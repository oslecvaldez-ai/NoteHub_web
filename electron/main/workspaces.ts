import { ipcMain } from "electron";
import { getDatabase } from "./database";

export interface Workspace {
  id: number;
  name: string;
  is_default: number;
  color_hex: string;
  is_locked: number;
  password_hash: string | null;
  created_at: string;
}

export type WorkspaceElementType = "note" | "notebook";

function getWorkspace(id: number): Workspace | undefined {
  return getDatabase()
    .prepare("SELECT * FROM workspaces WHERE id = ?")
    .get(id) as Workspace | undefined;
}

export function registerWorkspacesIpc(): void {
  ipcMain.handle("workspaces:get-all", () => {
    return getDatabase()
      .prepare(
        "SELECT * FROM workspaces ORDER BY is_default DESC, name COLLATE NOCASE ASC",
      )
      .all() as Workspace[];
  });

  ipcMain.handle("workspaces:create", (_event, name: string) => {
    try {
      const normalizedName = name.trim();
      if (!normalizedName) {
        throw new Error("El nombre del espacio es obligatorio");
      }

      const existing = getDatabase()
        .prepare(
          "SELECT id FROM workspaces WHERE name COLLATE NOCASE = ? LIMIT 1",
        )
        .get(normalizedName) as { id: number } | undefined;
      if (existing) {
        throw new Error("Ya existe un espacio con ese nombre");
      }

      const result = getDatabase()
        .prepare(
          "INSERT INTO workspaces (name, is_default, color_hex) VALUES (?, 0, ?)",
        )
        .run(normalizedName, "#8B5CF6");
      return getWorkspace(Number(result.lastInsertRowid));
    } catch (error) {
      console.error("Error al crear espacio:", error);
      throw error;
    }
  });

  ipcMain.handle("workspaces:update", (_event, id: number, name: string) => {
    const normalizedName = name.trim();
    if (!normalizedName) {
      throw new Error("El nombre del espacio es obligatorio");
    }
    const existingWorkspace = getWorkspace(id);
    if (!existingWorkspace) {
      throw new Error("El espacio no existe");
    }

    const duplicate = getDatabase()
      .prepare(
        "SELECT id FROM workspaces WHERE id != ? AND name COLLATE NOCASE = ? LIMIT 1",
      )
      .get(id, normalizedName) as { id: number } | undefined;
    if (duplicate) {
      throw new Error("Ya existe un espacio con ese nombre");
    }

    getDatabase()
      .prepare("UPDATE workspaces SET name = ? WHERE id = ?")
      .run(normalizedName, id);
    return getWorkspace(id);
  });

  ipcMain.handle(
    "workspaces:delete",
    (_event, id: number, mode: "all" | "migrate" = "migrate") => {
      const database = getDatabase();
      const workspace = getWorkspace(id);
      if (!workspace) {
        throw new Error("El espacio no existe");
      }
      if (workspace.is_default === 1) {
        throw new Error("El espacio por defecto no se puede eliminar");
      }

      const defaultWorkspace = database
        .prepare("SELECT id FROM workspaces WHERE is_default = 1 LIMIT 1")
        .get() as { id: number } | undefined;
      if (!defaultWorkspace) {
        throw new Error("No existe un espacio por defecto");
      }

      const removeWorkspace = database.transaction(() => {
        if (mode === "all") {
          database
            .prepare(
              "DELETE FROM note_tags WHERE note_id IN (SELECT id FROM notes WHERE workspace_id = ?)",
            )
            .run(id);
          database.prepare("DELETE FROM notes WHERE workspace_id = ?").run(id);
          database
            .prepare("DELETE FROM notebooks WHERE workspace_id = ?")
            .run(id);
          database
            .prepare("DELETE FROM templates WHERE workspace_id = ?")
            .run(id);
          database.prepare("DELETE FROM tags WHERE workspace_id = ?").run(id);
        } else {
          const targetNotebookName =
            workspace.name.trim() || "Espacio importado";
          const insertNotebook = database
            .prepare(
              "INSERT INTO notebooks (workspace_id, name, icon_type) VALUES (?, ?, 'folder')",
            )
            .run(defaultWorkspace.id, targetNotebookName);
          const newNotebookId = Number(insertNotebook.lastInsertRowid);

          database
            .prepare(
              "UPDATE notes SET workspace_id = ?, notebook_id = ? WHERE workspace_id = ?",
            )
            .run(defaultWorkspace.id, newNotebookId, id);
          database
            .prepare(
              "UPDATE templates SET workspace_id = ? WHERE workspace_id = ?",
            )
            .run(defaultWorkspace.id, id);
          database
            .prepare("UPDATE tags SET workspace_id = ? WHERE workspace_id = ?")
            .run(defaultWorkspace.id, id);
          database
            .prepare(
              "UPDATE notebooks SET note_count = (SELECT COUNT(*) FROM notes WHERE notebook_id = ? AND is_deleted = 0) WHERE id = ?",
            )
            .run(newNotebookId, newNotebookId);
        }
        database.prepare("DELETE FROM workspaces WHERE id = ?").run(id);
      });

      removeWorkspace();
      return { id };
    },
  );

  ipcMain.handle(
    "workspaces:move-element",
    (
      _event,
      type: WorkspaceElementType,
      elementId: number,
      targetWorkspaceId: number,
    ) => {
      const database = getDatabase();
      if (!getWorkspace(targetWorkspaceId)) {
        throw new Error("El espacio de destino no existe");
      }

      if (type === "note") {
        const result = database
          .prepare(
            "UPDATE notes SET workspace_id = ?, notebook_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
          )
          .run(targetWorkspaceId, elementId);
        if (result.changes === 0) {
          throw new Error("La nota no existe");
        }
        return { type, elementId, targetWorkspaceId };
      }

      if (type === "notebook") {
        const result = database
          .prepare("UPDATE notebooks SET workspace_id = ? WHERE id = ?")
          .run(targetWorkspaceId, elementId);
        if (result.changes === 0) {
          throw new Error("El cuaderno no existe");
        }
        return { type, elementId, targetWorkspaceId };
      }

      throw new Error("Tipo de elemento no válido");
    },
  );
}
