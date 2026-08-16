import { app, ipcMain } from "electron";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export type DatabaseRow = Record<string, unknown>;
export type DatabaseParams = unknown[];

let database: Database.Database | null = null;

const initialSettings: Record<string, string> = {
  theme_mode: "light",
  accent_color: "#8B5CF6",
  font_family: "System",
  font_size: "16",
  line_spacing: "1.5",
  paragraph_spacing: "8",
};

function getDatabasePath(): string {
  return path.join(app.getPath("userData"), "SQLite", "NoteHub.db");
}

function ensureWorkspaceColumns(connection: Database.Database): void {
  const columns = connection
    .prepare("PRAGMA table_info(workspaces)")
    .all() as Array<{ name: string }>;
  const existingColumns = new Set(columns.map((column) => column.name));

  if (!existingColumns.has("description")) {
    connection.exec(
      'ALTER TABLE workspaces ADD COLUMN description TEXT NOT NULL DEFAULT ""',
    );
  }

  if (!existingColumns.has("icon_name")) {
    connection.exec(
      'ALTER TABLE workspaces ADD COLUMN icon_name TEXT NOT NULL DEFAULT "layers"',
    );
  }

  if (!existingColumns.has("updated_at")) {
    connection.exec("ALTER TABLE workspaces ADD COLUMN updated_at TEXT");
  }
}

function ensureNotebookColumns(connection: Database.Database): void {
  const columns = connection
    .prepare("PRAGMA table_info(notebooks)")
    .all() as Array<{ name: string }>;
  const existingColumns = new Set(columns.map((column) => column.name));

  if (!existingColumns.has("parent_notebook_id")) {
    connection.exec(
      "ALTER TABLE notebooks ADD COLUMN parent_notebook_id INTEGER REFERENCES notebooks(id) ON DELETE CASCADE",
    );
  }

  if (!existingColumns.has("icon_type")) {
    connection.exec("ALTER TABLE notebooks ADD COLUMN icon_type TEXT");
  }

  if (!existingColumns.has("icon_color")) {
    connection.exec("ALTER TABLE notebooks ADD COLUMN icon_color TEXT");
  }

  if (!existingColumns.has("is_locked")) {
    connection.exec(
      "ALTER TABLE notebooks ADD COLUMN is_locked INTEGER NOT NULL DEFAULT 0",
    );
  }

  if (!existingColumns.has("password_hash")) {
    connection.exec("ALTER TABLE notebooks ADD COLUMN password_hash TEXT");
  }
}

function ensureNoteColumns(connection: Database.Database): void {
  const columns = connection
    .prepare("PRAGMA table_info(notes)")
    .all() as Array<{ name: string }>;
  const existingColumns = new Set(columns.map((column) => column.name));

  if (!existingColumns.has("is_quick_access")) {
    connection.exec(
      "ALTER TABLE notes ADD COLUMN is_quick_access INTEGER NOT NULL DEFAULT 0 CHECK (is_quick_access IN (0, 1))",
    );
  }
}

function createSchema(connection: Database.Database): void {
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
			is_locked INTEGER NOT NULL DEFAULT 0 CHECK (is_locked IN (0, 1)),
			password_hash TEXT,
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
			is_quick_access INTEGER NOT NULL DEFAULT 0 CHECK (is_quick_access IN (0, 1)),
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
  ensureNotebookColumns(connection);
  ensureNoteColumns(connection);
}

function seedDatabase(connection: Database.Database): void {
  const seed = connection.transaction(() => {
    const count = connection
      .prepare("SELECT COUNT(*) as total FROM workspaces")
      .get() as { total: number };

    if (count.total === 0) {
      connection
        .prepare(
          `
					INSERT INTO workspaces (name, description, is_default, icon_name, color_hex)
					VALUES (?, ?, 1, ?, ?)
				`,
        )
        .run(
          "Mi Espacio",
          "Espacio principal por defecto",
          "layers",
          "#8B5CF6",
        );
    }

    const insertSetting = connection.prepare(
      "INSERT OR IGNORE INTO settings (key, value) VALUES (@key, @value)",
    );

    for (const [key, value] of Object.entries(initialSettings)) {
      insertSetting.run({ key, value });
    }
  });

  seed();
}

export function getDatabase(): Database.Database {
  if (!database) {
    const databasePath = getDatabasePath();
    const dbDir = path.dirname(databasePath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    database = new Database(databasePath);
    console.log("Base de datos conectada correctamente en:", databasePath);
    createSchema(database);
    seedDatabase(database);
  }

  return database;
}

export function closeDatabase(): void {
  database?.close();
  database = null;
}

export function registerDatabaseIpc(): void {
  ipcMain.handle(
    "db:query",
    (_event, sql: string, params: DatabaseParams = []) => {
      const statement = getDatabase().prepare(sql);
      return statement.all(...params) as DatabaseRow[];
    },
  );

  ipcMain.handle(
    "db:exec",
    (_event, sql: string, params: DatabaseParams = []) => {
      const statement = getDatabase().prepare(sql);
      return statement.run(...params);
    },
  );

  ipcMain.handle("db:get-setting", (_event, key: string) => {
    const row = getDatabase()
      .prepare("SELECT value FROM settings WHERE key = ?")
      .get(key) as { value: string } | undefined;
    return row?.value ?? null;
  });

  ipcMain.handle("db:set-setting", (_event, key: string, value: string) => {
    getDatabase()
      .prepare(
        `INSERT INTO settings (key, value) VALUES (?, ?)
				 ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      )
      .run(key, value);
    return value;
  });
}
