import { BrowserWindow as e, app as t, dialog as n, ipcMain as r, net as i, protocol as a } from "electron";
import o from "node:path";
import s from "node:fs";
import { fileURLToPath as c } from "node:url";
import l from "better-sqlite3";
import { createHash as u } from "node:crypto";
//#region electron/main/database.ts
var d = null, f = {
	theme_mode: "light",
	accent_color: "#8B5CF6",
	font_family: "System",
	font_size: "16",
	line_spacing: "1.5",
	paragraph_spacing: "8"
};
function p() {
	return o.join(t.getPath("userData"), "SQLite", "NoteHub.db");
}
function m(e) {
	let t = e.prepare("PRAGMA table_info(workspaces)").all(), n = new Set(t.map((e) => e.name));
	n.has("description") || e.exec("ALTER TABLE workspaces ADD COLUMN description TEXT NOT NULL DEFAULT \"\""), n.has("icon_name") || e.exec("ALTER TABLE workspaces ADD COLUMN icon_name TEXT NOT NULL DEFAULT \"layers\""), n.has("updated_at") || e.exec("ALTER TABLE workspaces ADD COLUMN updated_at TEXT");
}
function ee(e) {
	let t = e.prepare("PRAGMA table_info(notebooks)").all(), n = new Set(t.map((e) => e.name));
	n.has("parent_notebook_id") || e.exec("ALTER TABLE notebooks ADD COLUMN parent_notebook_id INTEGER REFERENCES notebooks(id) ON DELETE CASCADE"), n.has("icon_type") || e.exec("ALTER TABLE notebooks ADD COLUMN icon_type TEXT"), n.has("icon_color") || e.exec("ALTER TABLE notebooks ADD COLUMN icon_color TEXT"), n.has("is_locked") || e.exec("ALTER TABLE notebooks ADD COLUMN is_locked INTEGER NOT NULL DEFAULT 0"), n.has("password_hash") || e.exec("ALTER TABLE notebooks ADD COLUMN password_hash TEXT");
}
function te(e) {
	let t = e.prepare("PRAGMA table_info(notes)").all();
	new Set(t.map((e) => e.name)).has("is_quick_access") || e.exec("ALTER TABLE notes ADD COLUMN is_quick_access INTEGER NOT NULL DEFAULT 0 CHECK (is_quick_access IN (0, 1))");
}
function h(e) {
	e.pragma("foreign_keys = ON"), e.exec("\n		CREATE TABLE IF NOT EXISTS workspaces (\n			id INTEGER PRIMARY KEY AUTOINCREMENT,\n			name TEXT NOT NULL,\n			description TEXT NOT NULL DEFAULT '',\n			is_default INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),\n			icon_name TEXT NOT NULL DEFAULT 'layers',\n			color_hex TEXT NOT NULL DEFAULT '#8B5CF6',\n			is_locked INTEGER NOT NULL DEFAULT 0 CHECK (is_locked IN (0, 1)),\n			password_hash TEXT,\n			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP\n		);\n\n		CREATE TABLE IF NOT EXISTS notebooks (\n			id INTEGER PRIMARY KEY AUTOINCREMENT,\n			workspace_id INTEGER NOT NULL,\n			parent_notebook_id INTEGER,\n			name TEXT NOT NULL,\n			icon_type TEXT,\n			icon_color TEXT,\n			is_locked INTEGER NOT NULL DEFAULT 0 CHECK (is_locked IN (0, 1)),\n			password_hash TEXT,\n			note_count INTEGER NOT NULL DEFAULT 0,\n			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,\n			FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,\n			FOREIGN KEY (parent_notebook_id) REFERENCES notebooks(id) ON DELETE CASCADE\n		);\n\n		CREATE TABLE IF NOT EXISTS notes (\n			id INTEGER PRIMARY KEY AUTOINCREMENT,\n			workspace_id INTEGER NOT NULL,\n			notebook_id INTEGER,\n			title TEXT NOT NULL DEFAULT '',\n			content TEXT NOT NULL DEFAULT '',\n			is_pinned INTEGER NOT NULL DEFAULT 0 CHECK (is_pinned IN (0, 1)),\n			is_quick_access INTEGER NOT NULL DEFAULT 0 CHECK (is_quick_access IN (0, 1)),\n			is_deleted INTEGER NOT NULL DEFAULT 0 CHECK (is_deleted IN (0, 1)),\n			pinned_at TEXT,\n			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,\n			updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,\n			FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,\n			FOREIGN KEY (notebook_id) REFERENCES notebooks(id) ON DELETE SET NULL\n		);\n\n		CREATE TABLE IF NOT EXISTS templates (\n			id INTEGER PRIMARY KEY AUTOINCREMENT,\n			workspace_id INTEGER NOT NULL,\n			name TEXT NOT NULL,\n			content TEXT NOT NULL DEFAULT '',\n			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,\n			FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE\n		);\n\n		CREATE TABLE IF NOT EXISTS tags (\n			id INTEGER PRIMARY KEY AUTOINCREMENT,\n			workspace_id INTEGER NOT NULL,\n			name TEXT NOT NULL,\n			color_hex TEXT,\n			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,\n			UNIQUE (workspace_id, name),\n			FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE\n		);\n\n		CREATE TABLE IF NOT EXISTS note_tags (\n			note_id INTEGER NOT NULL,\n			tag_id INTEGER NOT NULL,\n			PRIMARY KEY (note_id, tag_id),\n			FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,\n			FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE\n		);\n\n		CREATE TABLE IF NOT EXISTS settings (\n			key TEXT PRIMARY KEY,\n			value TEXT NOT NULL\n		);\n\n		CREATE INDEX IF NOT EXISTS idx_notebooks_workspace_id ON notebooks(workspace_id);\n		CREATE INDEX IF NOT EXISTS idx_notes_workspace_id ON notes(workspace_id);\n		CREATE INDEX IF NOT EXISTS idx_notes_notebook_id ON notes(notebook_id);\n		CREATE INDEX IF NOT EXISTS idx_templates_workspace_id ON templates(workspace_id);\n	"), m(e), ee(e), te(e);
}
function g(e) {
	e.transaction(() => {
		e.prepare("SELECT COUNT(*) as total FROM workspaces").get().total === 0 && e.prepare("\n					INSERT INTO workspaces (name, description, is_default, icon_name, color_hex)\n					VALUES (?, ?, 1, ?, ?)\n				").run("Mi Espacio", "Espacio principal por defecto", "layers", "#8B5CF6");
		let t = e.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (@key, @value)");
		for (let [e, n] of Object.entries(f)) t.run({
			key: e,
			value: n
		});
	})();
}
function _() {
	if (!d) {
		let e = p(), t = o.dirname(e);
		s.existsSync(t) || s.mkdirSync(t, { recursive: !0 }), d = new l(e), console.log("Base de datos conectada correctamente en:", e), h(d), g(d);
	}
	return d;
}
function v() {
	d?.close(), d = null;
}
function y() {
	r.handle("db:query", (e, t, n = []) => _().prepare(t).all(...n)), r.handle("db:exec", (e, t, n = []) => _().prepare(t).run(...n)), r.handle("db:get-setting", (e, t) => _().prepare("SELECT value FROM settings WHERE key = ?").get(t)?.value ?? null), r.handle("db:set-setting", (e, t, n) => (_().prepare("INSERT INTO settings (key, value) VALUES (?, ?)\n				 ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(t, n), n));
}
//#endregion
//#region electron/main/export.ts
function b(e) {
	return e.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-_\. ]+/g, "_").replace(/\s+/g, "_").replace(/^_+|_+$/g, "").substring(0, 120);
}
function x(e) {
	return e.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<li[^>]*>/gi, "- ").replace(/<\/li>/gi, "\n").replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, (e, t, n) => "#".repeat(Number(t)) + " " + n + "\n\n").replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)").replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/gi, "![$1]($2)").replace(/<strong>|<b>/gi, "**").replace(/<\/strong>|<\/b>/gi, "**").replace(/<em>|<i>/gi, "*").replace(/<\/em>|<\/i>/gi, "*").replace(/<u>/gi, "_").replace(/<\/u>/gi, "_").replace(/<[^>]+>/g, "").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;|&#34;/g, "\"").replace(/&#39;|&#x27;/g, "'").replace(/\n{3,}/g, "\n\n").trim();
}
function S(e, t) {
	return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>${e}</title>
<style>
body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; color: #111827; background: #fff; }
img { max-width: 100%; height: auto; }
pre { white-space: pre-wrap; }
</style>
</head>
<body>
<h1>${e}</h1>
${t}
</body>
</html>`;
}
function C(e, t) {
	return `${b(e) || "Nota"}.${t}`;
}
function w(e, t) {
	return s.writeFileSync(e, t, "utf8"), e;
}
async function T(t) {
	let n = new e({
		show: !1,
		webPreferences: {
			contextIsolation: !0,
			sandbox: !1
		}
	});
	return await n.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(t)}`), n;
}
function E() {
	r.handle("export:toTXT", async (e, t, r) => {
		let i = C(t, "txt"), { canceled: a, filePath: o } = await n.showSaveDialog({
			title: "Exportar nota como TXT",
			defaultPath: i,
			filters: [{
				name: "Texto",
				extensions: ["txt"]
			}]
		});
		return a || !o ? null : w(o, x(r));
	}), r.handle("export:toMD", async (e, t, r) => {
		let i = C(t, "md"), { canceled: a, filePath: o } = await n.showSaveDialog({
			title: "Exportar nota como Markdown",
			defaultPath: i,
			filters: [{
				name: "Markdown",
				extensions: ["md", "markdown"]
			}]
		});
		return a || !o ? null : w(o, x(r));
	}), r.handle("export:toHTML", async (e, t, r) => {
		let i = C(t, "html"), { canceled: a, filePath: o } = await n.showSaveDialog({
			title: "Exportar nota como HTML",
			defaultPath: i,
			filters: [{
				name: "HTML",
				extensions: ["html", "htm"]
			}]
		});
		return a || !o ? null : w(o, S(t, r));
	}), r.handle("export:toPDF", async (e, t, r) => {
		let i = C(t, "pdf"), { canceled: a, filePath: o } = await n.showSaveDialog({
			title: "Exportar nota como PDF",
			defaultPath: i,
			filters: [{
				name: "PDF",
				extensions: ["pdf"]
			}]
		});
		if (a || !o) return null;
		let c = await T(S(t, r));
		try {
			let e = await c.webContents.printToPDF({
				printBackground: !0,
				pageSize: "A4",
				marginsType: 1
			});
			return s.writeFileSync(o, e), o;
		} finally {
			c.close();
		}
	}), r.handle("export:toNoteHub", async (e, t) => {
		let r = typeof t.title == "string" ? t.title : "nota", { filePath: i } = await n.showSaveDialog({
			title: "Exportar Nota NoteHub",
			defaultPath: `${r || "nota"}.notehub`,
			filters: [{
				name: "Paquete NoteHub",
				extensions: ["notehub"]
			}]
		});
		if (!i) return null;
		let a = {
			app: "NoteHub",
			version: "1.0",
			exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
			data: {
				id: t.id ?? null,
				workspaceId: t.workspaceId ?? null,
				notebookId: t.notebookId ?? null,
				title: typeof t.title == "string" ? t.title : "Sin título",
				content: typeof t.content == "string" ? t.content : "",
				isPinned: typeof t.isPinned == "number" ? t.isPinned : +!!t.isPinned,
				isFavorite: typeof t.isFavorite == "number" ? t.isFavorite : +!!t.isFavorite,
				isQuickAccess: typeof t.isQuickAccess == "number" ? t.isQuickAccess : +!!t.isQuickAccess,
				isDeleted: typeof t.isDeleted == "number" ? t.isDeleted : +!!t.isDeleted,
				pinnedAt: t.pinnedAt ?? null,
				createdAt: t.createdAt ?? (/* @__PURE__ */ new Date()).toISOString(),
				updatedAt: t.updatedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
				tags: Array.isArray(t.tags) ? t.tags : []
			}
		};
		return w(i, JSON.stringify(a, null, 2));
	}), r.handle("import:fromNoteHub", async () => {
		let { canceled: e, filePaths: t } = await n.showOpenDialog({
			title: "Importar nota desde archivo NoteHub",
			properties: ["openFile"],
			filters: [{
				name: "NoteHub",
				extensions: ["notehub", "json"]
			}]
		});
		if (e || t.length === 0) return null;
		let r = t[0];
		try {
			let e = s.readFileSync(r, "utf8"), t = JSON.parse(e), n = (t && typeof t == "object" && "data" in t ? t.data : "note" in t ? t.note : t) ?? t;
			if (!n || typeof n != "object" || !("content" in n && typeof n.content == "string") && !("title" in n && typeof n.title == "string")) throw Error("Formato de archivo NoteHub no válido");
			let i = n;
			return {
				title: typeof i.title == "string" && i.title.trim() ? i.title : "Nota importada",
				content: typeof i.content == "string" ? i.content : "",
				notebookId: typeof i.notebookId == "number" ? i.notebookId : i.notebookId ?? null,
				workspaceId: typeof i.workspaceId == "number" ? i.workspaceId : i.workspaceId ?? null
			};
		} catch (e) {
			throw e instanceof SyntaxError ? Error("El archivo JSON no es válido o está corrupto.") : e instanceof Error && e.message === "Formato de archivo NoteHub no válido" ? e : Error("No se pudo importar la nota. El formato del archivo no es válido.");
		}
	});
}
//#endregion
//#region electron/main/files.ts
function ne(e) {
	return e.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-_\. ]+/g, "_").replace(/\s+/g, "_").replace(/^_+|_+$/g, "");
}
function D(e, t) {
	let n = o.extname(e).toLowerCase() || (t?.startsWith("image/") ? `.${t.split("/")[1]}` : ".png"), r = ne(o.basename(e, o.extname(e))) || "imagen";
	return `${Date.now()}-${r}${n}`;
}
function O(e) {
	let n = o.join(t.getPath("userData"), "images");
	s.mkdirSync(n, { recursive: !0 });
	let r, i;
	if (typeof e == "string") {
		let t = o.resolve(e);
		if (!s.existsSync(t)) throw Error("No se encontró el archivo seleccionado");
		return r = D(t), i = o.join(n, r), s.copyFileSync(t, i), r;
	}
	return r = D(e.name, e.mimeType), i = o.join(n, r), s.writeFileSync(i, Buffer.from(e.data)), r;
}
function k() {
	r.handle("files:copy-image", async (e, t) => {
		let r = t?.trim() ?? "";
		if (!r) {
			let { canceled: e, filePaths: t } = await n.showOpenDialog({
				title: "Selecciona una imagen",
				properties: ["openFile"],
				filters: [{
					name: "Imágenes",
					extensions: [
						"png",
						"jpg",
						"jpeg",
						"webp",
						"gif"
					]
				}]
			});
			if (e || t.length === 0) return null;
			r = t[0];
		}
		return O(r);
	}), r.handle("files:save-image", async (e, t) => {
		if (!t) {
			let { canceled: e, filePaths: t } = await n.showOpenDialog({
				title: "Selecciona una imagen",
				properties: ["openFile"],
				filters: [{
					name: "Imágenes",
					extensions: [
						"png",
						"jpg",
						"jpeg",
						"webp",
						"gif"
					]
				}]
			});
			return e || t.length === 0 ? null : O(t[0]);
		}
		return O(t);
	});
}
//#endregion
//#region electron/main/notebooks.ts
function A(e) {
	return u("sha256").update(e).digest("hex");
}
function j(e) {
	return _().prepare("SELECT notebooks.*, COUNT(notes.id) AS note_count\n			 FROM notebooks\n			 LEFT JOIN notes ON notes.notebook_id = notebooks.id AND notes.is_deleted = 0\n			 WHERE notebooks.id = ?\n			 GROUP BY notebooks.id").get(e);
}
function M(e) {
	return e.iconType ?? e.iconTypeValue ?? e.icon ?? e.icon_type ?? "folder";
}
function N(e) {
	let t = +(e.isLocked === !0 || e.isLocked === 1);
	if (t) {
		let n = e.password ? A(e.password) : e.passwordHash ?? null;
		if (!n) throw Error("La contraseña es obligatoria para bloquear el cuaderno");
		return {
			isLocked: t,
			passwordHash: n
		};
	}
	return {
		isLocked: 0,
		passwordHash: null
	};
}
function P(e, t) {
	console.error(`[notebooks] ${e} failed`, t instanceof Error ? t.message : t), t instanceof Error && t.stack && console.error(t.stack);
}
function F(e, t, n) {
	if (_().prepare("SELECT id FROM notebooks\n			 WHERE workspace_id = ?\n			   AND name = ?\n			   AND (\n					(? IS NULL AND parent_notebook_id IS NULL)\n					OR (? IS NOT NULL AND parent_notebook_id = ?)\n				)").get(e, t, n, n, n)) throw Error("Ya existe un cuaderno con este nombre en esta ubicación");
}
function I() {
	r.handle("notebooks:get-all", (e, t) => {
		try {
			return _().prepare("SELECT notebooks.*, COUNT(notes.id) AS note_count\n					 FROM notebooks\n					 LEFT JOIN notes ON notes.notebook_id = notebooks.id AND notes.is_deleted = 0\n					 WHERE notebooks.workspace_id = ?\n					 GROUP BY notebooks.id\n					 ORDER BY notebooks.parent_notebook_id IS NOT NULL, notebooks.name COLLATE NOCASE ASC").all(t);
		} catch (e) {
			throw P("notebooks:get-all", e), e;
		}
	}), r.handle("notebooks:create", (e, t, n) => {
		try {
			console.log("[notebooks] create request", {
				workspaceId: t,
				input: n
			});
			let e = n.name?.trim();
			if (!e) throw Error("El nombre del cuaderno es obligatorio");
			let r = n.parentNotebookId ?? null;
			F(t, e, r);
			let i = M(n), { isLocked: a, passwordHash: o } = N(n), s = _().prepare("INSERT INTO notebooks\n						 (workspace_id, parent_notebook_id, name, icon_type, icon_color, is_locked, password_hash)\n						 VALUES (?, ?, ?, ?, ?, ?, ?)").run(t, r, e, i, n.iconColor ?? null, a, o);
			return j(Number(s.lastInsertRowid));
		} catch (e) {
			throw P("notebooks:create", e), e;
		}
	}), r.handle("notebooks:update", (e, t, n) => {
		try {
			let e = n.name?.trim();
			if (!e) throw Error("El nombre del cuaderno es obligatorio");
			let r = M(n), { isLocked: i, passwordHash: a } = N(n);
			if (_().prepare("UPDATE notebooks\n						 SET name = ?, parent_notebook_id = ?, icon_type = ?, icon_color = ?, is_locked = ?, password_hash = ?\n						 WHERE id = ?").run(e, n.parentNotebookId ?? null, r, n.iconColor ?? null, i, a, t).changes === 0) throw Error("El cuaderno no existe");
			return j(t);
		} catch (e) {
			throw P("notebooks:update", e), e;
		}
	}), r.handle("notebooks:delete", (e, t) => {
		try {
			if (_().prepare("DELETE FROM notebooks WHERE id = ?").run(t).changes === 0) throw Error("El cuaderno no existe");
			return { id: t };
		} catch (e) {
			throw P("notebooks:delete", e), e;
		}
	});
}
//#endregion
//#region electron/main/notes.ts
function L(e) {
	return _().prepare("SELECT * FROM notes WHERE id = ?").get(e);
}
function R(e, t, n = "") {
	let r = ["workspace_id = ?", "is_deleted = 0"], i = [e];
	if (t != null && (r.push("notebook_id = ?"), i.push(t)), n.trim()) {
		r.push("(title LIKE ? OR content LIKE ?)");
		let e = `%${n.trim()}%`;
		i.push(e, e);
	}
	return _().prepare(`SELECT * FROM notes
			 WHERE ${r.join(" AND ")}
			 ORDER BY is_pinned DESC, updated_at DESC`).all(...i);
}
function z() {
	r.handle("notes:get-by-id", (e, t) => L(t)), r.handle("notes:get-by-workspace", (e, t, n) => R(t, n)), r.handle("notes:get-quick-access", (e, t) => _().prepare("SELECT id, workspace_id, notebook_id, title, content, is_pinned, is_quick_access, is_deleted, pinned_at, created_at, updated_at\n				 FROM notes\n				 WHERE workspace_id = ? AND (is_quick_access = 1 OR is_pinned = 1) AND is_deleted = 0\n				 ORDER BY updated_at DESC").all(t)), r.handle("notes:search", (e, t, n, r) => R(t, r, n)), r.handle("notes:create", (e, t, n = {}) => {
		let r = _().prepare("INSERT INTO notes (workspace_id, notebook_id, title, content)\n				 VALUES (?, ?, ?, ?)").run(t, n.notebookId ?? null, n.title?.trim() ?? "", n.content ?? "");
		return L(Number(r.lastInsertRowid));
	}), r.handle("notes:duplicate", (e, t) => {
		let n = L(t);
		if (!n) throw Error("La nota no existe");
		let r = _().prepare("INSERT INTO notes (workspace_id, notebook_id, title, content)\n				 VALUES (?, ?, ?, ?)").run(n.workspace_id, n.notebook_id, `${n.title} (copia)`, n.content);
		return L(Number(r.lastInsertRowid));
	}), r.handle("notes:toggle-pin", (e, t) => {
		let n = L(t);
		if (!n) throw Error("La nota no existe");
		let r = n.is_pinned === 1 ? 0 : 1;
		return _().prepare("UPDATE notes SET is_pinned = ?, is_quick_access = ?, pinned_at = CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE NULL END, updated_at = CURRENT_TIMESTAMP\n				 WHERE id = ?").run(r, r, r, t), L(t);
	}), r.handle("notes:toggle-quick-access", (e, t, n) => {
		let r = L(t);
		if (!r) throw Error("La nota no existe");
		let i = n === 0 || n === 1 ? n : r.is_quick_access === 1 ? 0 : 1;
		return _().prepare("UPDATE notes SET is_quick_access = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(i, t), L(t);
	}), r.handle("notes:move", (e, t, n) => {
		if (_().prepare("UPDATE notes SET notebook_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(n, t).changes === 0) throw Error("La nota no existe");
		return L(t);
	}), r.handle("notes:delete", (e, t) => {
		if (_().prepare("UPDATE notes SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(t).changes === 0) throw Error("La nota no existe");
		return L(t);
	});
}
//#endregion
//#region electron/main/workspaces.ts
function B(e) {
	return _().prepare("SELECT * FROM workspaces WHERE id = ?").get(e);
}
function V() {
	r.handle("workspaces:get-all", () => _().prepare("SELECT * FROM workspaces ORDER BY is_default DESC, name COLLATE NOCASE ASC").all()), r.handle("workspaces:create", (e, t) => {
		try {
			let e = t.trim();
			if (!e) throw Error("El nombre del espacio es obligatorio");
			let n = _().prepare("INSERT INTO workspaces (name, is_default, color_hex) VALUES (?, 0, ?)").run(e, "#8B5CF6");
			return B(Number(n.lastInsertRowid));
		} catch (e) {
			throw console.error("Error al crear espacio:", e), e;
		}
	}), r.handle("workspaces:update", (e, t, n) => {
		let r = n.trim();
		if (!r) throw Error("El nombre del espacio es obligatorio");
		if (!B(t)) throw Error("El espacio no existe");
		return _().prepare("UPDATE workspaces SET name = ? WHERE id = ?").run(r, t), B(t);
	}), r.handle("workspaces:delete", (e, t) => {
		let n = _(), r = B(t);
		if (!r) throw Error("El espacio no existe");
		if (r.is_default === 1) throw Error("El espacio por defecto no se puede eliminar");
		let i = n.prepare("SELECT id FROM workspaces WHERE is_default = 1 LIMIT 1").get();
		if (!i) throw Error("No existe un espacio por defecto para reasignar el contenido");
		return n.transaction(() => {
			n.prepare("UPDATE notebooks SET workspace_id = ? WHERE workspace_id = ?").run(i.id, t), n.prepare("UPDATE notes SET workspace_id = ? WHERE workspace_id = ?").run(i.id, t), n.prepare("UPDATE templates SET workspace_id = ? WHERE workspace_id = ?").run(i.id, t), n.prepare("UPDATE tags SET workspace_id = ? WHERE workspace_id = ?").run(i.id, t), n.prepare("DELETE FROM workspaces WHERE id = ?").run(t);
		})(), { id: t };
	}), r.handle("workspaces:move-element", (e, t, n, r) => {
		let i = _();
		if (!B(r)) throw Error("El espacio de destino no existe");
		if (t === "note") {
			if (i.prepare("UPDATE notes SET workspace_id = ? WHERE id = ?").run(r, n).changes === 0) throw Error("La nota no existe");
			return {
				type: t,
				elementId: n,
				targetWorkspaceId: r
			};
		}
		if (t === "notebook") {
			if (i.prepare("UPDATE notebooks SET workspace_id = ? WHERE id = ?").run(r, n).changes === 0) throw Error("El cuaderno no existe");
			return {
				type: t,
				elementId: n,
				targetWorkspaceId: r
			};
		}
		throw Error("Tipo de elemento no válido");
	});
}
//#endregion
//#region electron/main/tags.ts
function H(e) {
	return _().prepare("SELECT * FROM tags WHERE id = ?").get(e);
}
function U(e) {
	return _().prepare("SELECT * FROM tags WHERE workspace_id = ? ORDER BY name COLLATE NOCASE ASC").all(e);
}
function W(e) {
	return _().prepare("SELECT t.*\n       FROM tags t\n       INNER JOIN note_tags nt ON nt.tag_id = t.id\n       WHERE nt.note_id = ?\n       ORDER BY t.name COLLATE NOCASE ASC").all(e);
}
function G(e) {
	let t = e.trim().replace(/^#+/, "").trim();
	if (!t) throw Error("El nombre del tag no puede estar vacío");
	return t;
}
function K() {
	r.handle("tags:get-all-for-workspace", (e, t) => U(t)), r.handle("tags:get-for-note", (e, t) => W(t)), r.handle("tags:create", (e, t, n) => {
		let r = G(n), i = _().prepare("SELECT id FROM tags WHERE workspace_id = ? AND name = ? COLLATE NOCASE").get(t, r);
		if (i) return H(i.id);
		let a = _().prepare("INSERT INTO tags (workspace_id, name, color_hex) VALUES (?, ?, ?)").run(t, r, "#8B5CF6");
		return H(Number(a.lastInsertRowid));
	}), r.handle("tags:set-for-note", (e, t, n) => {
		let r = _();
		if (r.prepare("DELETE FROM note_tags WHERE note_id = ?").run(t), !Array.isArray(n) || n.length === 0) return W(t);
		let i = [...new Set(n.filter((e) => Number.isFinite(Number(e))))].map(Number);
		for (let e of i) H(e) && r.prepare("INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)").run(t, e);
		return W(t);
	});
}
//#endregion
//#region electron/main/editor.ts
function q(e) {
	return _().prepare("SELECT id, title, content, notebook_id FROM notes WHERE id = ?").get(e);
}
function J(e) {
	return e.replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;|&#34;/g, "\"").replace(/&#39;|&#x27;/g, "'").replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}
function Y(e) {
	let t = e.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i);
	return ((t?.[1] ? J(t[1]) : J(e)).split("\n").map((e) => e.trim()).find(Boolean) ?? "").slice(0, 120) || "Nota sin título";
}
function X() {
	r.handle("notes:save-content", (e, t, n, r) => {
		let i = q(t);
		if (!i) throw Error("La nota no existe");
		let a = Y(n) || i.title || "Nota sin título", o = r === void 0 ? i.notebook_id : r;
		return _().prepare("UPDATE notes\n				 SET title = ?, content = ?, notebook_id = ?, updated_at = CURRENT_TIMESTAMP\n				 WHERE id = ?").run(a, n, o, t), q(t);
	});
}
//#endregion
//#region electron/main/templates.ts
function re(e) {
	return _().prepare("SELECT * FROM templates WHERE id = ?").get(e);
}
function ie(e) {
	return _().prepare("SELECT * FROM templates\n       WHERE workspace_id = ?\n       ORDER BY created_at DESC").all(e);
}
function ae() {
	r.handle("templates:get-by-workspace", (e, t) => t ? ie(Number(t)) : []), r.handle("templates:create", (e, t) => {
		let n = Number(t?.workspaceId ?? 0), r = String(t?.name ?? "").trim(), i = String(t?.content ?? "");
		if (!n || !r) throw Error("Se requiere un espacio y un nombre para la plantilla");
		let a = _().prepare("INSERT INTO templates (workspace_id, name, content)\n         VALUES (?, ?, ?)").run(n, r, i);
		return re(Number(a.lastInsertRowid));
	});
}
//#endregion
//#region electron/main.ts
var Z = o.dirname(c(import.meta.url)), Q = null;
function $() {
	let n = [
		o.join(Z, "preload.mjs"),
		o.join(Z, "preload.js"),
		o.join(Z, "main", "preload.mjs"),
		o.join(Z, "main", "preload.js")
	], r = n.find((e) => s.existsSync(e)) || n[0];
	console.log("👉 Archivo preload inyectado desde:", r);
	let i = t.isPackaged ? o.join(Z, "..", "dist") : o.join(Z, "..", "public"), a = [
		"notehub.png",
		"notehub.ico",
		"notehub.svg"
	], c;
	for (let e of a) {
		let t = o.join(i, e);
		if (s.existsSync(t)) {
			c = t;
			break;
		}
	}
	if (!c) {
		let e = o.join(Z, "..", "public", "notehub.svg");
		s.existsSync(e) && (c = e);
	}
	Q = new e({
		height: 820,
		minHeight: 600,
		minWidth: 960,
		show: !1,
		autoHideMenuBar: !0,
		...c ? { icon: c } : {},
		title: "NoteHub",
		webPreferences: {
			contextIsolation: !0,
			preload: r
		},
		width: 1320
	}), Q.once("ready-to-show", () => Q?.show()), Q.on("closed", () => {
		Q = null;
	}), process.env.VITE_DEV_SERVER_URL ? Q.loadURL(process.env.VITE_DEV_SERVER_URL) : Q.loadFile(o.join(Z, "..", "dist", "index.html"));
}
t.whenReady().then(() => {
	a.handle("notehub", async (e) => {
		let n = e.url.replace("notehub://", ""), r = n.split("/"), a;
		return a = r[0] === "images" ? o.join(t.getPath("userData"), "images", ...r.slice(1)) : r[0] === "covers" ? o.join(t.getPath("userData"), "covers", ...r.slice(1)) : o.join(t.getPath("userData"), "covers", n), s.existsSync(a) ? i.fetch(`file://${a}`) : new Response("Archivo no encontrado", {
			status: 404,
			headers: { "content-type": "text/plain" }
		});
	}), _(), y(), V(), I(), z(), K(), X(), ae(), k(), E(), $(), t.on("activate", () => {
		e.getAllWindows().length === 0 && $();
	});
}), t.on("window-all-closed", () => {
	process.platform !== "darwin" && t.quit();
}), t.on("before-quit", () => {
	v();
});
//#endregion
export {};
