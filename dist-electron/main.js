import { BrowserWindow, app, ipcMain } from "electron";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
//#region electron/main/database.ts
var database = null;
var initialSettings = {
	theme_mode: "light",
	accent_color: "#8B5CF6",
	font_family: "System",
	font_size: "16",
	line_spacing: "1.5",
	paragraph_spacing: "8"
};
function getDatabasePath() {
	return path.join(app.getPath("userData"), "SQLite", "NoteHub.db");
}
function ensureWorkspaceColumns(connection) {
	const columns = connection.prepare("PRAGMA table_info(workspaces)").all();
	const existingColumns = new Set(columns.map((column) => column.name));
	if (!existingColumns.has("description")) connection.exec("ALTER TABLE workspaces ADD COLUMN description TEXT NOT NULL DEFAULT \"\"");
	if (!existingColumns.has("icon_name")) connection.exec("ALTER TABLE workspaces ADD COLUMN icon_name TEXT NOT NULL DEFAULT \"layers\"");
	if (!existingColumns.has("updated_at")) connection.exec("ALTER TABLE workspaces ADD COLUMN updated_at TEXT");
}
function createSchema(connection) {
	connection.pragma("foreign_keys = ON");
	connection.exec(`
		CREATE TABLE IF NOT EXISTS workspaces (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			description TEXT NOT NULL DEFAULT '',
			is_default INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),
			icon_name TEXT NOT NULL DEFAULT 'layers',
			color_hex TEXT NOT NULL DEFAULT '#8B5CF6',
			is_locked INTEGER NOT NULL DEFAULT 0 CHECK (is_locked IN (0, 1)),
			password_hash TEXT,
			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE IF NOT EXISTS notebooks (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			workspace_id INTEGER NOT NULL,
			parent_notebook_id INTEGER,
			name TEXT NOT NULL,
			icon_type TEXT,
			icon_color TEXT,
			note_count INTEGER NOT NULL DEFAULT 0,
			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
			FOREIGN KEY (parent_notebook_id) REFERENCES notebooks(id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS notes (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			workspace_id INTEGER NOT NULL,
			notebook_id INTEGER,
			title TEXT NOT NULL DEFAULT '',
			content TEXT NOT NULL DEFAULT '',
			is_pinned INTEGER NOT NULL DEFAULT 0 CHECK (is_pinned IN (0, 1)),
			is_deleted INTEGER NOT NULL DEFAULT 0 CHECK (is_deleted IN (0, 1)),
			pinned_at TEXT,
			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
			FOREIGN KEY (notebook_id) REFERENCES notebooks(id) ON DELETE SET NULL
		);

		CREATE TABLE IF NOT EXISTS templates (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			workspace_id INTEGER NOT NULL,
			name TEXT NOT NULL,
			content TEXT NOT NULL DEFAULT '',
			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS tags (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			workspace_id INTEGER NOT NULL,
			name TEXT NOT NULL,
			color_hex TEXT,
			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
			UNIQUE (workspace_id, name),
			FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS note_tags (
			note_id INTEGER NOT NULL,
			tag_id INTEGER NOT NULL,
			PRIMARY KEY (note_id, tag_id),
			FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
			FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS settings (
			key TEXT PRIMARY KEY,
			value TEXT NOT NULL
		);

		CREATE INDEX IF NOT EXISTS idx_notebooks_workspace_id ON notebooks(workspace_id);
		CREATE INDEX IF NOT EXISTS idx_notes_workspace_id ON notes(workspace_id);
		CREATE INDEX IF NOT EXISTS idx_notes_notebook_id ON notes(notebook_id);
		CREATE INDEX IF NOT EXISTS idx_templates_workspace_id ON templates(workspace_id);
	`);
	ensureWorkspaceColumns(connection);
}
function seedDatabase(connection) {
	connection.transaction(() => {
		if (connection.prepare("SELECT COUNT(*) as total FROM workspaces").get().total === 0) connection.prepare(`
					INSERT INTO workspaces (name, description, is_default, icon_name, color_hex)
					VALUES (?, ?, 1, ?, ?)
				`).run("Mi Espacio", "Espacio principal por defecto", "layers", "#8B5CF6");
		const insertSetting = connection.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (@key, @value)");
		for (const [key, value] of Object.entries(initialSettings)) insertSetting.run({
			key,
			value
		});
	})();
}
function getDatabase() {
	if (!database) {
		const databasePath = getDatabasePath();
		const dbDir = path.dirname(databasePath);
		if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
		database = new Database(databasePath);
		console.log("Base de datos conectada correctamente en:", databasePath);
		createSchema(database);
		seedDatabase(database);
	}
	return database;
}
function closeDatabase() {
	database?.close();
	database = null;
}
function registerDatabaseIpc() {
	ipcMain.handle("db:query", (_event, sql, params = []) => {
		return getDatabase().prepare(sql).all(...params);
	});
	ipcMain.handle("db:exec", (_event, sql, params = []) => {
		return getDatabase().prepare(sql).run(...params);
	});
	ipcMain.handle("db:get-setting", (_event, key) => {
		return getDatabase().prepare("SELECT value FROM settings WHERE key = ?").get(key)?.value ?? null;
	});
	ipcMain.handle("db:set-setting", (_event, key, value) => {
		getDatabase().prepare(`INSERT INTO settings (key, value) VALUES (?, ?)
				 ON CONFLICT(key) DO UPDATE SET value = excluded.value`).run(key, value);
		return value;
	});
}
//#endregion
//#region electron/main/notebooks.ts
function getNotebook(id) {
	return getDatabase().prepare(`SELECT notebooks.*, COUNT(notes.id) AS note_count
			 FROM notebooks
			 LEFT JOIN notes ON notes.notebook_id = notebooks.id AND notes.is_deleted = 0
			 WHERE notebooks.id = ?
			 GROUP BY notebooks.id`).get(id);
}
function logNotebookError(context, error) {
	console.error(`[notebooks] ${context} failed`, error instanceof Error ? error.message : error);
	if (error instanceof Error && error.stack) console.error(error.stack);
}
function registerNotebooksIpc() {
	ipcMain.handle("notebooks:get-all", (_event, workspaceId) => {
		try {
			return getDatabase().prepare(`SELECT notebooks.*, COUNT(notes.id) AS note_count
					 FROM notebooks
					 LEFT JOIN notes ON notes.notebook_id = notebooks.id AND notes.is_deleted = 0
					 WHERE notebooks.workspace_id = ?
					 GROUP BY notebooks.id
					 ORDER BY notebooks.parent_notebook_id IS NOT NULL, notebooks.name COLLATE NOCASE ASC`).all(workspaceId);
		} catch (error) {
			logNotebookError("notebooks:get-all", error);
			throw error;
		}
	});
	ipcMain.handle("notebooks:create", (_event, workspaceId, input) => {
		try {
			console.log("[notebooks] create request", {
				workspaceId,
				input
			});
			const name = input.name.trim();
			if (!name) throw new Error("El nombre del cuaderno es obligatorio");
			const result = getDatabase().prepare(`INSERT INTO notebooks
						 (workspace_id, parent_notebook_id, name, icon_type, icon_color)
						 VALUES (?, ?, ?, ?, ?)`).run(workspaceId, input.parentNotebookId ?? null, name, input.iconType ?? "folder", input.iconColor ?? null);
			return getNotebook(Number(result.lastInsertRowid));
		} catch (error) {
			logNotebookError("notebooks:create", error);
			throw error;
		}
	});
	ipcMain.handle("notebooks:update", (_event, id, input) => {
		try {
			const name = input.name.trim();
			if (!name) throw new Error("El nombre del cuaderno es obligatorio");
			if (getDatabase().prepare(`UPDATE notebooks
						 SET name = ?, parent_notebook_id = ?, icon_type = ?, icon_color = ?
						 WHERE id = ?`).run(name, input.parentNotebookId ?? null, input.iconType ?? "folder", input.iconColor ?? null, id).changes === 0) throw new Error("El cuaderno no existe");
			return getNotebook(id);
		} catch (error) {
			logNotebookError("notebooks:update", error);
			throw error;
		}
	});
	ipcMain.handle("notebooks:delete", (_event, id) => {
		try {
			if (getDatabase().prepare("DELETE FROM notebooks WHERE id = ?").run(id).changes === 0) throw new Error("El cuaderno no existe");
			return { id };
		} catch (error) {
			logNotebookError("notebooks:delete", error);
			throw error;
		}
	});
}
//#endregion
//#region electron/main/notes.ts
function getNote(id) {
	return getDatabase().prepare("SELECT * FROM notes WHERE id = ?").get(id);
}
function listNotes(workspaceId, notebookId, search = "") {
	const clauses = ["workspace_id = ?", "is_deleted = 0"];
	const params = [workspaceId];
	if (notebookId !== void 0 && notebookId !== null) {
		clauses.push("notebook_id = ?");
		params.push(notebookId);
	}
	if (search.trim()) {
		clauses.push("(title LIKE ? OR content LIKE ?)");
		const term = `%${search.trim()}%`;
		params.push(term, term);
	}
	return getDatabase().prepare(`SELECT * FROM notes
			 WHERE ${clauses.join(" AND ")}
			 ORDER BY is_pinned DESC, updated_at DESC`).all(...params);
}
function registerNotesIpc() {
	ipcMain.handle("notes:get-by-workspace", (_event, workspaceId, notebookId) => listNotes(workspaceId, notebookId));
	ipcMain.handle("notes:search", (_event, workspaceId, search, notebookId) => listNotes(workspaceId, notebookId, search));
	ipcMain.handle("notes:create", (_event, workspaceId, input = {}) => {
		const result = getDatabase().prepare(`INSERT INTO notes (workspace_id, notebook_id, title, content)
				 VALUES (?, ?, ?, ?)`).run(workspaceId, input.notebookId ?? null, input.title?.trim() ?? "", input.content ?? "");
		return getNote(Number(result.lastInsertRowid));
	});
	ipcMain.handle("notes:duplicate", (_event, id) => {
		const note = getNote(id);
		if (!note) throw new Error("La nota no existe");
		const result = getDatabase().prepare(`INSERT INTO notes (workspace_id, notebook_id, title, content)
				 VALUES (?, ?, ?, ?)`).run(note.workspace_id, note.notebook_id, `${note.title} (copia)`, note.content);
		return getNote(Number(result.lastInsertRowid));
	});
	ipcMain.handle("notes:toggle-pin", (_event, id) => {
		const note = getNote(id);
		if (!note) throw new Error("La nota no existe");
		getDatabase().prepare(`UPDATE notes SET is_pinned = ?, pinned_at = CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE NULL END
				 WHERE id = ?`).run(note.is_pinned === 1 ? 0 : 1, note.is_pinned === 1 ? 0 : 1, id);
		return getNote(id);
	});
	ipcMain.handle("notes:toggle-quick-access", (_event, id) => {
		if (!getNote(id)) throw new Error("La nota no existe");
		getDatabase().prepare("UPDATE notes SET is_pinned = CASE is_pinned WHEN 1 THEN 0 ELSE 1 END WHERE id = ?").run(id);
		return getNote(id);
	});
	ipcMain.handle("notes:move", (_event, id, notebookId) => {
		if (getDatabase().prepare("UPDATE notes SET notebook_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(notebookId, id).changes === 0) throw new Error("La nota no existe");
		return getNote(id);
	});
	ipcMain.handle("notes:delete", (_event, id) => {
		if (getDatabase().prepare("UPDATE notes SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id).changes === 0) throw new Error("La nota no existe");
		return getNote(id);
	});
}
//#endregion
//#region electron/main/workspaces.ts
function getWorkspace(id) {
	return getDatabase().prepare("SELECT * FROM workspaces WHERE id = ?").get(id);
}
function registerWorkspacesIpc() {
	ipcMain.handle("workspaces:get-all", () => {
		return getDatabase().prepare("SELECT * FROM workspaces ORDER BY is_default DESC, name COLLATE NOCASE ASC").all();
	});
	ipcMain.handle("workspaces:create", (_event, name) => {
		try {
			const normalizedName = name.trim();
			if (!normalizedName) throw new Error("El nombre del espacio es obligatorio");
			const result = getDatabase().prepare("INSERT INTO workspaces (name, is_default, color_hex) VALUES (?, 0, ?)").run(normalizedName, "#8B5CF6");
			return getWorkspace(Number(result.lastInsertRowid));
		} catch (error) {
			console.error("Error al crear espacio:", error);
			throw error;
		}
	});
	ipcMain.handle("workspaces:update", (_event, id, name) => {
		const normalizedName = name.trim();
		if (!normalizedName) throw new Error("El nombre del espacio es obligatorio");
		if (!getWorkspace(id)) throw new Error("El espacio no existe");
		getDatabase().prepare("UPDATE workspaces SET name = ? WHERE id = ?").run(normalizedName, id);
		return getWorkspace(id);
	});
	ipcMain.handle("workspaces:delete", (_event, id) => {
		const database = getDatabase();
		const workspace = getWorkspace(id);
		if (!workspace) throw new Error("El espacio no existe");
		if (workspace.is_default === 1) throw new Error("El espacio por defecto no se puede eliminar");
		const defaultWorkspace = database.prepare("SELECT id FROM workspaces WHERE is_default = 1 LIMIT 1").get();
		if (!defaultWorkspace) throw new Error("No existe un espacio por defecto para reasignar el contenido");
		database.transaction(() => {
			database.prepare("UPDATE notebooks SET workspace_id = ? WHERE workspace_id = ?").run(defaultWorkspace.id, id);
			database.prepare("UPDATE notes SET workspace_id = ? WHERE workspace_id = ?").run(defaultWorkspace.id, id);
			database.prepare("UPDATE templates SET workspace_id = ? WHERE workspace_id = ?").run(defaultWorkspace.id, id);
			database.prepare("UPDATE tags SET workspace_id = ? WHERE workspace_id = ?").run(defaultWorkspace.id, id);
			database.prepare("DELETE FROM workspaces WHERE id = ?").run(id);
		})();
		return { id };
	});
	ipcMain.handle("workspaces:move-element", (_event, type, elementId, targetWorkspaceId) => {
		const database = getDatabase();
		if (!getWorkspace(targetWorkspaceId)) throw new Error("El espacio de destino no existe");
		if (type === "note") {
			if (database.prepare("UPDATE notes SET workspace_id = ? WHERE id = ?").run(targetWorkspaceId, elementId).changes === 0) throw new Error("La nota no existe");
			return {
				type,
				elementId,
				targetWorkspaceId
			};
		}
		if (type === "notebook") {
			if (database.prepare("UPDATE notebooks SET workspace_id = ? WHERE id = ?").run(targetWorkspaceId, elementId).changes === 0) throw new Error("El cuaderno no existe");
			return {
				type,
				elementId,
				targetWorkspaceId
			};
		}
		throw new Error("Tipo de elemento no válido");
	});
}
//#endregion
//#region electron/main.ts
var currentDirectory = path.dirname(fileURLToPath(import.meta.url));
var mainWindow = null;
function createWindow() {
	const possiblePaths = [
		path.join(currentDirectory, "preload.mjs"),
		path.join(currentDirectory, "preload.js"),
		path.join(currentDirectory, "main", "preload.mjs"),
		path.join(currentDirectory, "main", "preload.js")
	];
	const preloadPath = possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0];
	console.log("👉 Archivo preload inyectado desde:", preloadPath);
	mainWindow = new BrowserWindow({
		height: 820,
		minHeight: 600,
		minWidth: 960,
		show: false,
		title: "NoteHub Desktop",
		webPreferences: {
			contextIsolation: true,
			preload: preloadPath
		},
		width: 1320
	});
	mainWindow.once("ready-to-show", () => mainWindow?.show());
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
	if (process.env.VITE_DEV_SERVER_URL) mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
	else mainWindow.loadFile(path.join(currentDirectory, "..", "dist", "index.html"));
}
app.whenReady().then(() => {
	getDatabase();
	registerDatabaseIpc();
	registerWorkspacesIpc();
	registerNotebooksIpc();
	registerNotesIpc();
	createWindow();
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
app.on("before-quit", () => {
	closeDatabase();
});
//#endregion
export {};
