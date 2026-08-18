import { ipcMain } from "electron";
import { getDatabase } from "./database";

export function registerSettingsIpc(): void {
  ipcMain.handle("settings:get-all", () => {
    const rows = getDatabase()
      .prepare("SELECT key, value FROM settings")
      .all() as Array<{
      key: string;
      value: string;
    }>;
    return rows.reduce(
      (acc, cur) => {
        acc[cur.key] = cur.value;
        return acc;
      },
      {} as Record<string, string>,
    );
  });

  ipcMain.handle("settings:get", (_event, key: string) => {
    const row = getDatabase()
      .prepare("SELECT value FROM settings WHERE key = ?")
      .get(key) as { value: string } | undefined;
    return row?.value ?? null;
  });

  ipcMain.handle("settings:set", (_event, key: string, value: string) => {
    getDatabase()
      .prepare(
        `INSERT INTO settings (key, value) VALUES (?, ?)
				 ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      )
      .run(key, value);
    return { key, value };
  });
}
