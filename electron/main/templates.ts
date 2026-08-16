import { ipcMain } from "electron";
import { getDatabase } from "./database";

export interface TemplateRecord {
  id: number;
  workspace_id: number;
  name: string;
  content: string;
  created_at: string;
}

export interface CreateTemplateInput {
  workspaceId: number;
  name: string;
  content: string;
}

function getTemplate(id: number): TemplateRecord | undefined {
  return getDatabase()
    .prepare("SELECT * FROM templates WHERE id = ?")
    .get(id) as TemplateRecord | undefined;
}

function listTemplates(workspaceId: number): TemplateRecord[] {
  return getDatabase()
    .prepare(
      `SELECT * FROM templates
       WHERE workspace_id = ?
       ORDER BY created_at DESC`,
    )
    .all(workspaceId) as TemplateRecord[];
}

export function registerTemplatesIpc(): void {
  ipcMain.handle("templates:get-all", (_event, workspaceId: number) => {
    if (!workspaceId) return [];
    return listTemplates(Number(workspaceId));
  });

  ipcMain.handle("templates:get-by-id", (_event, templateId: number) => {
    return getTemplate(Number(templateId));
  });

  ipcMain.handle(
    "templates:get-by-workspace",
    (_event, workspaceId: number) => {
      if (!workspaceId) return [];
      return listTemplates(Number(workspaceId));
    },
  );

  ipcMain.handle("templates:create", (_event, input: CreateTemplateInput) => {
    const workspaceId = Number(input?.workspaceId ?? 0);
    const name = String(input?.name ?? "").trim();
    const content = String(input?.content ?? "");

    if (!workspaceId || !name) {
      throw new Error("Se requiere un espacio y un nombre para la plantilla");
    }

    const result = getDatabase()
      .prepare(
        `INSERT INTO templates (workspace_id, name, content)
         VALUES (?, ?, ?)`,
      )
      .run(workspaceId, name, content);

    return getTemplate(Number(result.lastInsertRowid));
  });

  ipcMain.handle(
    "templates:update",
    (_event, input: { id: number; name: string; content: string }) => {
      const templateId = Number(input?.id ?? 0);
      const name = String(input?.name ?? "").trim();
      const content = String(input?.content ?? "");

      if (!templateId || !name) {
        throw new Error("Se requiere una plantilla y un nombre válidos");
      }

      getDatabase()
        .prepare("UPDATE templates SET name = ?, content = ? WHERE id = ?")
        .run(name, content, templateId);

      return { success: true };
    },
  );

  ipcMain.handle("templates:delete", (_event, templateId: number) => {
    getDatabase().prepare("DELETE FROM templates WHERE id = ?").run(templateId);
    return { success: true };
  });

  ipcMain.handle(
    "templates:create-note-from-template",
    (
      _event,
      input: {
        templateId: number;
        workspaceId: number;
        notebookId?: number | null;
      },
    ) => {
      const database = getDatabase();
      const templateId = Number(input?.templateId ?? 0);
      const workspaceId = Number(input?.workspaceId ?? 0);
      const notebookId = input?.notebookId ?? null;

      const template = database
        .prepare("SELECT * FROM templates WHERE id = ?")
        .get(templateId) as TemplateRecord | undefined;

      if (!template) {
        throw new Error("No se encontró la plantilla especificada");
      }

      const result = database
        .prepare(
          `INSERT INTO notes (workspace_id, notebook_id, title, content, is_pinned, is_quick_access, is_deleted, created_at, updated_at)
           VALUES (?, ?, ?, ?, 0, 0, 0, datetime('now', 'localtime'), datetime('now', 'localtime'))`,
        )
        .run(workspaceId, notebookId ?? null, template.name, template.content);

      const newNoteId = Number(result.lastInsertRowid);

      if (notebookId) {
        database
          .prepare(
            `UPDATE notebooks
             SET note_count = (
               SELECT COUNT(*) FROM notes WHERE notebook_id = ? AND is_deleted = 0
             )
             WHERE id = ?`,
          )
          .run(notebookId, notebookId);
      }

      return {
        id: newNoteId,
        title: template.name,
        content: template.content,
        workspaceId,
        notebookId,
      };
    },
  );
}
