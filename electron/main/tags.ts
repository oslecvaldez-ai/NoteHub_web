import { ipcMain } from "electron";
import { getDatabase } from "./database";

export interface Tag {
  id: number;
  workspace_id: number;
  name: string;
  color_hex: string | null;
  created_at: string;
}

function getTag(id: number): Tag | undefined {
  return getDatabase().prepare("SELECT * FROM tags WHERE id = ?").get(id) as
    | Tag
    | undefined;
}

function listTagsForWorkspace(workspaceId: number): Tag[] {
  return getDatabase()
    .prepare(
      "SELECT * FROM tags WHERE workspace_id = ? ORDER BY name COLLATE NOCASE ASC",
    )
    .all(workspaceId) as Tag[];
}

function listTagsForNote(noteId: number): Tag[] {
  return getDatabase()
    .prepare(
      `SELECT t.*
       FROM tags t
       INNER JOIN note_tags nt ON nt.tag_id = t.id
       WHERE nt.note_id = ?
       ORDER BY t.name COLLATE NOCASE ASC`,
    )
    .all(noteId) as Tag[];
}

function ensureTagName(name: string): string {
  const normalized = name.trim().replace(/^#+/, "").trim();
  if (!normalized) throw new Error("El nombre del tag no puede estar vacío");
  return normalized;
}

export function registerTagsIpc(): void {
  ipcMain.handle(
    "tags:get-all-for-workspace",
    (_event, workspaceId: number) => {
      return listTagsForWorkspace(workspaceId);
    },
  );

  ipcMain.handle("tags:get-for-note", (_event, noteId: number) => {
    return listTagsForNote(noteId);
  });

  ipcMain.handle("tags:create", (_event, workspaceId: number, name: string) => {
    const normalized = ensureTagName(name);
    const existing = getDatabase()
      .prepare(
        "SELECT id FROM tags WHERE workspace_id = ? AND name = ? COLLATE NOCASE",
      )
      .get(workspaceId, normalized) as { id: number } | undefined;

    if (existing) {
      return getTag(existing.id);
    }

    const result = getDatabase()
      .prepare(
        "INSERT INTO tags (workspace_id, name, color_hex) VALUES (?, ?, ?)",
      )
      .run(workspaceId, normalized, "#8B5CF6");

    return getTag(Number(result.lastInsertRowid));
  });

  ipcMain.handle(
    "tags:set-for-note",
    (_event, noteId: number, tagIds: number[]) => {
      const database = getDatabase();
      database.prepare("DELETE FROM note_tags WHERE note_id = ?").run(noteId);

      if (!Array.isArray(tagIds) || tagIds.length === 0) {
        return listTagsForNote(noteId);
      }

      const validIds = [
        ...new Set(tagIds.filter((id) => Number.isFinite(Number(id)))),
      ].map(Number);
      for (const tagId of validIds) {
        const tag = getTag(tagId);
        if (!tag) continue;
        database
          .prepare(
            "INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)",
          )
          .run(noteId, tagId);
      }

      return listTagsForNote(noteId);
    },
  );
}
