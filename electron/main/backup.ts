import { app, dialog, ipcMain } from "electron";
import fs from "node:fs";
import path from "node:path";
import AdmZip from "adm-zip";
import { getDatabase, closeDatabase } from "./database";

function getUserDataPath(): string {
  return app.getPath("userData");
}

function getDatabaseFilePath(): string {
  return path.join(getUserDataPath(), "SQLite", "NoteHub.db");
}

function getImagesDirectoryPath(): string {
  return path.join(getUserDataPath(), "images");
}

export function registerBackupIpc(): void {
  // Crear Respaldo ZIP compatible con móvil
  ipcMain.handle("backup:create", async () => {
    try {
      const defaultFileName = `NoteHub_Backup_${new Date().toISOString().replace(/[:.]/g, "-")}.zip`;
      const { canceled, filePath } = await dialog.showSaveDialog({
        title: "Guardar Respaldo de NoteHub (.zip)",
        defaultPath: defaultFileName,
        filters: [{ name: "Archivo ZIP", extensions: ["zip"] }],
      });

      if (canceled || !filePath) {
        return { success: false, message: "Operación cancelada" };
      }

      // Asegurar que las transacciones pendientes de SQLite se vuelquen al archivo
      const db = getDatabase();
      db.pragma("wal_checkpoint(TRUNCATE)");

      const dbPath = getDatabaseFilePath();
      const imagesDir = getImagesDirectoryPath();

      if (!fs.existsSync(dbPath)) {
        throw new Error("No se encontró el archivo de base de datos local");
      }

      const zip = new AdmZip();

      // 1. Agregar NoteHub.db a la raíz del ZIP
      zip.addLocalFile(dbPath);

      // 2. Agregar carpeta de imágenes si existe y contiene archivos
      let imageCount = 0;
      if (fs.existsSync(imagesDir)) {
        const files = fs.readdirSync(imagesDir);
        for (const file of files) {
          const fullImagePath = path.join(imagesDir, file);
          if (fs.statSync(fullImagePath).isFile()) {
            zip.addLocalFile(fullImagePath, "images");
            imageCount++;
          }
        }
      }

      // Escribir el archivo zip
      zip.writeZip(filePath);

      return {
        success: true,
        filePath,
        imageCount,
      };
    } catch (error) {
      console.error("[backup:create] error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al crear el archivo ZIP",
      };
    }
  });

  // Restaurar Respaldo desde ZIP (móvil o desktop)
  ipcMain.handle("backup:restore", async () => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "Seleccionar respaldo NoteHub (.zip)",
        properties: ["openFile"],
        filters: [{ name: "Archivo ZIP", extensions: ["zip"] }],
      });

      if (canceled || filePaths.length === 0) {
        return { success: false, message: "Operación cancelada" };
      }

      const sourceZipPath = filePaths[0];
      const zip = new AdmZip(sourceZipPath);
      const zipEntries = zip.getEntries();

      // Validar que el ZIP contenga NoteHub.db
      const hasDatabase = zipEntries.some(
        (entry) =>
          entry.entryName === "NoteHub.db" || entry.name === "NoteHub.db",
      );

      if (!hasDatabase) {
        throw new Error(
          "El archivo ZIP seleccionado no contiene una base de datos NoteHub.db válida",
        );
      }

      // Cerrar conexión para reemplazar archivos
      closeDatabase();

      const dbPath = getDatabaseFilePath();
      const dbDir = path.dirname(dbPath);
      const imagesDir = getImagesDirectoryPath();

      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      // Extraer NoteHub.db a la carpeta de datos
      zip.extractEntryTo("NoteHub.db", dbDir, false, true);

      // Extraer las imágenes a la carpeta images/
      for (const entry of zipEntries) {
        if (entry.entryName.startsWith("images/") && !entry.isDirectory) {
          zip.extractEntryTo(entry.entryName, dbDir, true, true);
        }
      }

      // Reconectar base de datos
      getDatabase();

      return { success: true };
    } catch (error) {
      console.error("[backup:restore] error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al restaurar el archivo ZIP",
      };
    }
  });
}
