import { ipcMain } from 'electron'
import { getDatabase } from './database'

export interface Notebook {
	id: number
	workspace_id: number
	parent_notebook_id: number | null
	name: string
	icon_type: string | null
	icon_color: string | null
	note_count: number
	created_at: string
}

export interface NotebookInput {
	name: string
	parentNotebookId?: number | null
	iconType?: string | null
	iconColor?: string | null
	workspaceId?: number
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
		.get(id) as Notebook | undefined
}

function logNotebookError(context: string, error: unknown): void {
	console.error(`[notebooks] ${context} failed`, error instanceof Error ? error.message : error)
	if (error instanceof Error && error.stack) {
		console.error(error.stack)
	}
}

export function registerNotebooksIpc(): void {
	ipcMain.handle('notebooks:get-all', (_event, workspaceId: number) => {
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
				.all(workspaceId) as Notebook[]
		} catch (error) {
			logNotebookError('notebooks:get-all', error)
			throw error
		}
	})

	ipcMain.handle(
		'notebooks:create',
		(_event, workspaceId: number, input: NotebookInput) => {
			try {
				console.log('[notebooks] create request', { workspaceId, input })
				const name = input.name.trim()
				if (!name) throw new Error('El nombre del cuaderno es obligatorio')
				const result = getDatabase()
					.prepare(
						`INSERT INTO notebooks
						 (workspace_id, parent_notebook_id, name, icon_type, icon_color)
						 VALUES (?, ?, ?, ?, ?)`,
					)
					.run(
						workspaceId,
						input.parentNotebookId ?? null,
						name,
						input.iconType ?? 'folder',
						input.iconColor ?? null,
					)
				return getNotebook(Number(result.lastInsertRowid))
			} catch (error) {
				logNotebookError('notebooks:create', error)
				throw error
			}
		},
	)

	ipcMain.handle(
		'notebooks:update',
		(_event, id: number, input: NotebookInput) => {
			try {
				const name = input.name.trim()
				if (!name) throw new Error('El nombre del cuaderno es obligatorio')
				const result = getDatabase()
					.prepare(
						`UPDATE notebooks
						 SET name = ?, parent_notebook_id = ?, icon_type = ?, icon_color = ?
						 WHERE id = ?`,
					)
					.run(
						name,
						input.parentNotebookId ?? null,
						input.iconType ?? 'folder',
						input.iconColor ?? null,
						id,
					)
				if (result.changes === 0) throw new Error('El cuaderno no existe')
				return getNotebook(id)
			} catch (error) {
				logNotebookError('notebooks:update', error)
				throw error
			}
		},
	)

	ipcMain.handle('notebooks:delete', (_event, id: number) => {
		try {
			const result = getDatabase().prepare('DELETE FROM notebooks WHERE id = ?').run(id)
			if (result.changes === 0) throw new Error('El cuaderno no existe')
			return { id }
		} catch (error) {
			logNotebookError('notebooks:delete', error)
			throw error
		}
	})
}
