let electron = require("electron");
//#region electron/main/preload.ts
console.log("--- PRELOAD CARGADO CORRECTAMENTE ---");
electron.contextBridge.exposeInMainWorld("electron", {
	db: {
		query: (sql, params = []) => electron.ipcRenderer.invoke("db:query", sql, params),
		exec: (sql, params = []) => electron.ipcRenderer.invoke("db:exec", sql, params),
		getSetting: (key) => electron.ipcRenderer.invoke("db:get-setting", key),
		setSetting: (key, value) => electron.ipcRenderer.invoke("db:set-setting", key, value)
	},
	files: {
		copyImage: (sourcePath) => electron.ipcRenderer.invoke("files:copy-image", sourcePath ?? null),
		saveImage: (sourcePath) => electron.ipcRenderer.invoke("files:save-image", sourcePath ?? null)
	},
	editor: { saveContent: (noteId, content, notebookId) => electron.ipcRenderer.invoke("notes:save-content", noteId, content, notebookId) },
	export: {
		toTXT: (title, content) => electron.ipcRenderer.invoke("export:toTXT", title, content),
		toMD: (title, content) => electron.ipcRenderer.invoke("export:toMD", title, content),
		toHTML: (title, content) => electron.ipcRenderer.invoke("export:toHTML", title, content),
		toPDF: (title, content) => electron.ipcRenderer.invoke("export:toPDF", title, content),
		toNoteHub: (note) => electron.ipcRenderer.invoke("export:toNoteHub", note),
		fromNoteHub: () => electron.ipcRenderer.invoke("import:fromNoteHub")
	},
	workspaces: {
		getAll: () => electron.ipcRenderer.invoke("workspaces:get-all"),
		create: (name) => electron.ipcRenderer.invoke("workspaces:create", name),
		update: (id, name) => electron.ipcRenderer.invoke("workspaces:update", id, name),
		delete: (id) => electron.ipcRenderer.invoke("workspaces:delete", id),
		moveElement: (type, elementId, targetWorkspaceId) => electron.ipcRenderer.invoke("workspaces:move-element", type, elementId, targetWorkspaceId)
	},
	notebooks: {
		getAll: (workspaceId) => electron.ipcRenderer.invoke("notebooks:get-all", workspaceId),
		create: (workspaceId, input) => electron.ipcRenderer.invoke("notebooks:create", workspaceId, input),
		update: (id, input) => electron.ipcRenderer.invoke("notebooks:update", id, input),
		delete: (id) => electron.ipcRenderer.invoke("notebooks:delete", id)
	},
	notes: {
		getByWorkspace: (workspaceId, notebookId) => electron.ipcRenderer.invoke("notes:get-by-workspace", workspaceId, notebookId),
		search: (workspaceId, search, notebookId) => electron.ipcRenderer.invoke("notes:search", workspaceId, search, notebookId),
		create: (workspaceId, input) => electron.ipcRenderer.invoke("notes:create", workspaceId, input),
		duplicate: (id) => electron.ipcRenderer.invoke("notes:duplicate", id),
		togglePin: (id) => electron.ipcRenderer.invoke("notes:toggle-pin", id),
		toggleQuickAccess: (id) => electron.ipcRenderer.invoke("notes:toggle-quick-access", id),
		move: (id, notebookId) => electron.ipcRenderer.invoke("notes:move", id, notebookId),
		delete: (id) => electron.ipcRenderer.invoke("notes:delete", id)
	}
});
//#endregion
