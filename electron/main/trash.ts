import { ipcMain } from "electron";
import type Database from "better-sqlite3";
import { getDatabase } from "./database";

export interface TrashedNoteRow {
  id: number;
  workspace_id: number;
  notebook_id: number | null;
  title: string;
  content: string;
  is_pinned: number;
  is_quick_access: number;
  is_deleted: number;
  pinned_at: string | null;
  created_at: string;
  updated_at: string;
  notebookName?: string | null;
}

function listTrashedNotes(workspaceId: number): TrashedNoteRow[] {
  return getDatabase()
    .prepare(
      `SELECT n.*, b.name AS notebookName
       FROM notes n
       LEFT JOIN notebooks b ON b.id = n.notebook_id
       WHERE n.is_deleted = 1 AND n.workspace_id = ?
       ORDER BY n.updated_at DESC`,
    )
    .all(workspaceId) as TrashedNoteRow[];
}

function getNoteById(
  noteId: number,
): { notebook_id: number | null } | undefined {
  return getDatabase()
    .prepare("SELECT notebook_id FROM notes WHERE id = ?")
    .get(noteId) as { notebook_id: number | null } | undefined;
}

export function registerTrashIpc(): void {
  ipcMain.handle("trash:get-all", (_event, workspaceId: number) => {
    return listTrashedNotes(Number(workspaceId));
  });

  ipcMain.handle("trash:restore", (_event, noteId: number) => {
    const database = getDatabase();
    database
      .prepare(
        `UPDATE notes
         SET is_deleted = 0, updated_at = datetime('now', 'localtime')
         WHERE id = ?`,
      )
      .run(noteId);

    const note = getNoteById(Number(noteId));
    if (note?.notebook_id) {
      database
        .prepare(
          `UPDATE notebooks
           SET note_count = (
             SELECT COUNT(*) FROM notes WHERE notebook_id = ? AND is_deleted = 0
           )
           WHERE id = ?`,
        )
        .run(note.notebook_id, note.notebook_id);
    }

    return { success: true };
  });

  ipcMain.handle("trash:delete-permanent", (_event, noteId: number) => {
    const database = getDatabase();
    database.prepare("DELETE FROM note_tags WHERE note_id = ?").run(noteId);
    database.prepare("DELETE FROM notes WHERE id = ?").run(noteId);
    return { success: true };
  });

  ipcMain.handle("trash:empty", (_event, workspaceId: number) => {
    const database = getDatabase();
    const deletedNotes = database
      .prepare("SELECT id FROM notes WHERE workspace_id = ? AND is_deleted = 1")
      .all(Number(workspaceId)) as Array<{ id: number }>;

    const deleteTagsStmt = database.prepare(
      "DELETE FROM note_tags WHERE note_id = ?",
    );
    const deleteNoteStmt = database.prepare("DELETE FROM notes WHERE id = ?");

    const transaction = database.transaction(() => {
      for (const note of deletedNotes) {
        deleteTagsStmt.run(note.id);
        deleteNoteStmt.run(note.id);
      }
    });

    transaction();
    return { success: true, count: deletedNotes.length };
  });

  ipcMain.handle("trash:get-count", (_event, workspaceId: number) => {
    const row = getDatabase()
      .prepare(
        "SELECT COUNT(*) AS count FROM notes WHERE workspace_id = ? AND is_deleted = 1",
      )
      .get(Number(workspaceId)) as { count: number } | undefined;

    return row?.count ?? 0;
  });
}
