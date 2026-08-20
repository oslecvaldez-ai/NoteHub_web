import { createHash } from "node:crypto";
import { ipcMain } from "electron";
import { getDatabase } from "./database";

export interface Notebook {
  id: number;
  workspace_id: number;
  parent_notebook_id: number | null;
  name: string;
  icon_type: string | null;
  icon_color: string | null;
  is_locked: number;
  password_hash: string | null;
  note_count: number;
  created_at: string;
}

export interface NotebookInput {
  name?: string;
  parentNotebookId?: number | null;
  iconType?: string | null;
  iconTypeValue?: string | null;
  icon?: string | null;
  icon_type?: string | null;
  iconColor?: string | null;
  isLocked?: boolean | number | null;
  password?: string | null;
  passwordHash?: string | null;
  workspaceId?: number;
}

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function getNotebook(id: number): Notebook | undefined {
  return getDatabase()
    .prepare(
      `SELECT notebooks.*, COUNT(notes.id) AS note_count
			 FROM notebooks
			 LEFT JOIN notes ON notes.notebook_id = notebooks.id AND notes.is_deleted = 0
			 WHERE notebooks.id = ?
			 GROUP BY notebooks.id`,
    )
    .get(id) as Notebook | undefined;
}

function resolveNotebookIcon(input: NotebookInput): string {
  return (
    input.iconType ??
    input.iconTypeValue ??
    input.icon ??
    input.icon_type ??
    "folder"
  );
}

function buildNotebookPassword(input: NotebookInput): {
  isLocked: number;
  passwordHash: string | null;
} {
  const isLocked = input.isLocked === true || input.isLocked === 1 ? 1 : 0;
  if (isLocked) {
    const passwordHash = input.password
      ? hashPassword(input.password)
      : (input.passwordHash ?? null);
    if (!passwordHash) {
      throw new Error("La contraseña es obligatoria para bloquear el cuaderno");
    }
    return { isLocked, passwordHash };
  }

  return { isLocked: 0, passwordHash: null };
}

function logNotebookError(context: string, error: unknown): void {
  console.error(
    `[notebooks] ${context} failed`,
    error instanceof Error ? error.message : error,
  );
  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }
}

function getCustomCovers(): string[] {
  const row = getDatabase()
    .prepare("SELECT value FROM settings WHERE key = ?")
    .get("notebook_custom_covers") as { value: string } | undefined;

  if (!row?.value) {
    return [];
  }

  try {
    const parsed = JSON.parse(row.value) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (entry): entry is string =>
        typeof entry === "string" && entry.trim().length > 0,
    );
  } catch {
    return [];
  }
}

function saveCustomCover(fileName: string): string[] {
  const normalizedName = String(fileName ?? "").trim();
  const current = getCustomCovers();
  const next = [
    normalizedName,
    ...current.filter((entry) => entry !== normalizedName),
  ].filter((entry) => entry.trim().length > 0);

  getDatabase()
    .prepare(
      `INSERT INTO settings (key, value) VALUES (?, ?)
			 ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    )
    .run("notebook_custom_covers", JSON.stringify(next));

  return next;
}

function ensureUniqueNotebookName(
  workspaceId: number,
  name: string,
  parentNotebookId: number | null,
): void {
  const existing = getDatabase()
    .prepare(
      `SELECT id FROM notebooks
			 WHERE workspace_id = ?
			   AND name = ?
			   AND (
					(? IS NULL AND parent_notebook_id IS NULL)
					OR (? IS NOT NULL AND parent_notebook_id = ?)
				)`,
    )
    .get(
      workspaceId,
      name,
      parentNotebookId,
      parentNotebookId,
      parentNotebookId,
    ) as { id: number } | undefined;

  if (existing) {
    throw new Error("Ya existe un cuaderno con este nombre en esta ubicación");
  }
}

export function registerNotebooksIpc(): void {
  ipcMain.handle("notebooks:get-all", (_event, workspaceId: number) => {
    try {
      return getDatabase()
        .prepare(
          `SELECT notebooks.*, COUNT(notes.id) AS note_count
					 FROM notebooks
					 LEFT JOIN notes ON notes.notebook_id = notebooks.id AND notes.is_deleted = 0
					 WHERE notebooks.workspace_id = ?
					 GROUP BY notebooks.id
					 ORDER BY notebooks.parent_notebook_id IS NOT NULL, notebooks.name COLLATE NOCASE ASC`,
        )
        .all(workspaceId) as Notebook[];
    } catch (error) {
      logNotebookError("notebooks:get-all", error);
      throw error;
    }
  });

  ipcMain.handle(
    "notebooks:create",
    (_event, workspaceId: number, input: NotebookInput) => {
      try {
        const name = input.name?.trim();
        if (!name) throw new Error("El nombre del cuaderno es obligatorio");
        const parentNotebookId = input.parentNotebookId ?? null;
        ensureUniqueNotebookName(workspaceId, name, parentNotebookId);
        const iconType = resolveNotebookIcon(input);
        const { isLocked, passwordHash } = buildNotebookPassword(input);
        const result = getDatabase()
          .prepare(
            `INSERT INTO notebooks
						 (workspace_id, parent_notebook_id, name, icon_type, icon_color, is_locked, password_hash)
						 VALUES (?, ?, ?, ?, ?, ?, ?)`,
          )
          .run(
            workspaceId,
            parentNotebookId,
            name,
            iconType,
            input.iconColor ?? null,
            isLocked,
            passwordHash,
          );
        return getNotebook(Number(result.lastInsertRowid));
      } catch (error) {
        logNotebookError("notebooks:create", error);
        throw error;
      }
    },
  );

  ipcMain.handle(
    "notebooks:update",
    (_event, id: number, input: NotebookInput) => {
      try {
        const name = input.name?.trim();
        if (!name) throw new Error("El nombre del cuaderno es obligatorio");
        const iconType = resolveNotebookIcon(input);
        const { isLocked, passwordHash } = buildNotebookPassword(input);
        const result = getDatabase()
          .prepare(
            `UPDATE notebooks
						 SET name = ?, parent_notebook_id = ?, icon_type = ?, icon_color = ?, is_locked = ?, password_hash = ?
						 WHERE id = ?`,
          )
          .run(
            name,
            input.parentNotebookId ?? null,
            iconType,
            input.iconColor ?? null,
            isLocked,
            passwordHash,
            id,
          );
        if (result.changes === 0) throw new Error("El cuaderno no existe");
        return getNotebook(id);
      } catch (error) {
        logNotebookError("notebooks:update", error);
        throw error;
      }
    },
  );

  ipcMain.handle("notebooks:delete", (_event, id: number) => {
    try {
      const result = getDatabase()
        .prepare("DELETE FROM notebooks WHERE id = ?")
        .run(id);
      if (result.changes === 0) throw new Error("El cuaderno no existe");
      return { id };
    } catch (error) {
      logNotebookError("notebooks:delete", error);
      throw error;
    }
  });

  ipcMain.handle("notebooks:get-custom-covers", () => getCustomCovers());

  ipcMain.handle("notebooks:save-custom-cover", (_event, fileName: string) => {
    try {
      if (!fileName || !String(fileName).trim()) {
        return getCustomCovers();
      }
      return saveCustomCover(fileName);
    } catch (error) {
      logNotebookError("notebooks:save-custom-cover", error);
      throw error;
    }
  });
}
