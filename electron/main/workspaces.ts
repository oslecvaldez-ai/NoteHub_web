import { ipcMain } from 'electron'
import { getDatabase } from './database'

export interface Workspace {
	id: number
	name: string
	is_default: number
	color_hex: string
	is_locked: number
	password_hash: string | null
	created_at: string
}

export type WorkspaceElementType = 'note' | 'notebook'

function getWorkspace(id: number): Workspace | undefined {
	return getDatabase()
		.prepare('SELECT * FROM workspaces WHERE id = ?')
		.get(id) as Workspace | undefined
}

export function registerWorkspacesIpc(): void {
	ipcMain.handle('workspaces:get-all', () => {
		return getDatabase()
			.prepare('SELECT * FROM workspaces ORDER BY is_default DESC, name COLLATE NOCASE ASC')
			.all() as Workspace[]
	})

	ipcMain.handle('workspaces:create', (_event, name: string) => {
		try {
			const normalizedName = name.trim()
			if (!normalizedName) {
				throw new Error('El nombre del espacio es obligatorio')
			}

			const result = getDatabase()
				.prepare('INSERT INTO workspaces (name, is_default, color_hex) VALUES (?, 0, ?)')
				.run(normalizedName, '#8B5CF6')
			return getWorkspace(Number(result.lastInsertRowid))
		} catch (error) {
			console.error('Error al crear espacio:', error)
			throw error
		}
	})

	ipcMain.handle('workspaces:update', (_event, id: number, name: string) => {
		const normalizedName = name.trim()
		if (!normalizedName) {
			throw new Error('El nombre del espacio es obligatorio')
		}
		if (!getWorkspace(id)) {
			throw new Error('El espacio no existe')
		}

		getDatabase().prepare('UPDATE workspaces SET name = ? WHERE id = ?').run(normalizedName, id)
		return getWorkspace(id)
	})

	ipcMain.handle('workspaces:delete', (_event, id: number) => {
		const database = getDatabase()
		const workspace = getWorkspace(id)
		if (!workspace) {
			throw new Error('El espacio no existe')
		}
		if (workspace.is_default === 1) {
			throw new Error('El espacio por defecto no se puede eliminar')
		}

		const defaultWorkspace = database
			.prepare('SELECT id FROM workspaces WHERE is_default = 1 LIMIT 1')
			.get() as { id: number } | undefined
		if (!defaultWorkspace) {
			throw new Error('No existe un espacio por defecto para reasignar el contenido')
		}

		const removeWorkspace = database.transaction(() => {
			database
				.prepare('UPDATE notebooks SET workspace_id = ? WHERE workspace_id = ?')
				.run(defaultWorkspace.id, id)
			database
				.prepare('UPDATE notes SET workspace_id = ? WHERE workspace_id = ?')
				.run(defaultWorkspace.id, id)
			database
				.prepare('UPDATE templates SET workspace_id = ? WHERE workspace_id = ?')
				.run(defaultWorkspace.id, id)
			database
				.prepare('UPDATE tags SET workspace_id = ? WHERE workspace_id = ?')
				.run(defaultWorkspace.id, id)
			database.prepare('DELETE FROM workspaces WHERE id = ?').run(id)
		})

		removeWorkspace()
		return { id }
	})

	ipcMain.handle(
		'workspaces:move-element',
		(_event, type: WorkspaceElementType, elementId: number, targetWorkspaceId: number) => {
			const database = getDatabase()
			if (!getWorkspace(targetWorkspaceId)) {
				throw new Error('El espacio de destino no existe')
			}

			if (type === 'note') {
				const result = database
					.prepare('UPDATE notes SET workspace_id = ? WHERE id = ?')
					.run(targetWorkspaceId, elementId)
				if (result.changes === 0) {
					throw new Error('La nota no existe')
				}
				return { type, elementId, targetWorkspaceId }
			}

			if (type === 'notebook') {
				const result = database
					.prepare('UPDATE notebooks SET workspace_id = ? WHERE id = ?')
					.run(targetWorkspaceId, elementId)
				if (result.changes === 0) {
					throw new Error('El cuaderno no existe')
				}
				return { type, elementId, targetWorkspaceId }
			}

			throw new Error('Tipo de elemento no válido')
		},
	)
}
