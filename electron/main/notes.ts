import { ipcMain } from 'electron'
import { getDatabase } from './database'

export interface Note {
	id: number
	workspace_id: number
	notebook_id: number | null
	title: string
	content: string
	is_pinned: number
	is_deleted: number
	pinned_at: string | null
	created_at: string
	updated_at: string
}

export interface NoteInput {
	title?: string
	content?: string
	notebookId?: number | null
}

function getNote(id: number): Note | undefined {
	return getDatabase().prepare('SELECT * FROM notes WHERE id = ?').get(id) as Note | undefined
}

function listNotes(workspaceId: number, notebookId?: number | null, search = ''): Note[] {
	const clauses = ['workspace_id = ?', 'is_deleted = 0']
	const params: unknown[] = [workspaceId]
	if (notebookId !== undefined && notebookId !== null) {
		clauses.push('notebook_id = ?')
		params.push(notebookId)
	}
	if (search.trim()) {
		clauses.push('(title LIKE ? OR content LIKE ?)')
		const term = `%${search.trim()}%`
		params.push(term, term)
	}
	return getDatabase()
		.prepare(
			`SELECT * FROM notes
			 WHERE ${clauses.join(' AND ')}
			 ORDER BY is_pinned DESC, updated_at DESC`,
		)
		.all(...params) as Note[]
}

export function registerNotesIpc(): void {
	ipcMain.handle(
		'notes:get-by-workspace',
		(_event, workspaceId: number, notebookId?: number | null) =>
			listNotes(workspaceId, notebookId),
	)

	ipcMain.handle(
		'notes:search',
		(_event, workspaceId: number, search: string, notebookId?: number | null) =>
			listNotes(workspaceId, notebookId, search),
	)

	ipcMain.handle('notes:create', (_event, workspaceId: number, input: NoteInput = {}) => {
		const result = getDatabase()
			.prepare(
				`INSERT INTO notes (workspace_id, notebook_id, title, content)
				 VALUES (?, ?, ?, ?)`,
			)
			.run(workspaceId, input.notebookId ?? null, input.title?.trim() ?? '', input.content ?? '')
		return getNote(Number(result.lastInsertRowid))
	})

	ipcMain.handle('notes:duplicate', (_event, id: number) => {
		const note = getNote(id)
		if (!note) throw new Error('La nota no existe')
		const result = getDatabase()
			.prepare(
				`INSERT INTO notes (workspace_id, notebook_id, title, content)
				 VALUES (?, ?, ?, ?)`,
			)
			.run(note.workspace_id, note.notebook_id, `${note.title} (copia)`, note.content)
		return getNote(Number(result.lastInsertRowid))
	})

	ipcMain.handle('notes:toggle-pin', (_event, id: number) => {
		const note = getNote(id)
		if (!note) throw new Error('La nota no existe')
		getDatabase()
			.prepare(
				`UPDATE notes SET is_pinned = ?, pinned_at = CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE NULL END
				 WHERE id = ?`,
			)
			.run(note.is_pinned === 1 ? 0 : 1, note.is_pinned === 1 ? 0 : 1, id)
		return getNote(id)
	})

	ipcMain.handle('notes:toggle-quick-access', (_event, id: number) => {
		const note = getNote(id)
		if (!note) throw new Error('La nota no existe')
		getDatabase().prepare('UPDATE notes SET is_pinned = CASE is_pinned WHEN 1 THEN 0 ELSE 1 END WHERE id = ?').run(id)
		return getNote(id)
	})

	ipcMain.handle('notes:move', (_event, id: number, notebookId: number | null) => {
		const result = getDatabase().prepare('UPDATE notes SET notebook_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(notebookId, id)
		if (result.changes === 0) throw new Error('La nota no existe')
		return getNote(id)
	})

	ipcMain.handle('notes:delete', (_event, id: number) => {
		const result = getDatabase()
			.prepare('UPDATE notes SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
			.run(id)
		if (result.changes === 0) throw new Error('La nota no existe')
		return getNote(id)
	})
}
