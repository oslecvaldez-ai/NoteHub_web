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
}
