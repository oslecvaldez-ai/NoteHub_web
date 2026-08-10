import { contextBridge, ipcRenderer } from 'electron'

console.log('--- PRELOAD CARGADO CORRECTAMENTE ---')

const electronApi = {
	db: {
		query: (sql: string, params: unknown[] = []) =>
			ipcRenderer.invoke('db:query', sql, params),
		exec: (sql: string, params: unknown[] = []) =>
			ipcRenderer.invoke('db:exec', sql, params),
		getSetting: (key: string) => ipcRenderer.invoke('db:get-setting', key),
		setSetting: (key: string, value: string) =>
			ipcRenderer.invoke('db:set-setting', key, value),
	},
	files: {
		copyImage: (sourcePath: string) =>
			ipcRenderer.invoke('files:copy-image', sourcePath),
	},
	workspaces: {
		getAll: () => ipcRenderer.invoke('workspaces:get-all'),
		create: (name: string) => ipcRenderer.invoke('workspaces:create', name),
		update: (id: number, name: string) =>
			ipcRenderer.invoke('workspaces:update', id, name),
		delete: (id: number) => ipcRenderer.invoke('workspaces:delete', id),
		moveElement: (
			type: 'note' | 'notebook',
			elementId: number,
			targetWorkspaceId: number,
		) => ipcRenderer.invoke('workspaces:move-element', type, elementId, targetWorkspaceId),
	},
	notebooks: {
		getAll: (workspaceId: number) => ipcRenderer.invoke('notebooks:get-all', workspaceId),
		create: (workspaceId: number, input: unknown) =>
			ipcRenderer.invoke('notebooks:create', workspaceId, input),
		update: (id: number, input: unknown) => ipcRenderer.invoke('notebooks:update', id, input),
		delete: (id: number) => ipcRenderer.invoke('notebooks:delete', id),
	},
	notes: {
		getByWorkspace: (workspaceId: number, notebookId?: number | null) =>
			ipcRenderer.invoke('notes:get-by-workspace', workspaceId, notebookId),
		search: (workspaceId: number, search: string, notebookId?: number | null) =>
			ipcRenderer.invoke('notes:search', workspaceId, search, notebookId),
		create: (workspaceId: number, input: unknown) =>
			ipcRenderer.invoke('notes:create', workspaceId, input),
		duplicate: (id: number) => ipcRenderer.invoke('notes:duplicate', id),
		togglePin: (id: number) => ipcRenderer.invoke('notes:toggle-pin', id),
		toggleQuickAccess: (id: number) => ipcRenderer.invoke('notes:toggle-quick-access', id),
		move: (id: number, notebookId: number | null) => ipcRenderer.invoke('notes:move', id, notebookId),
		delete: (id: number) => ipcRenderer.invoke('notes:delete', id),
	},
}

contextBridge.exposeInMainWorld('electron', electronApi)
