import fs from "node:fs";
import path from "node:path";

// Archivos prioritarios de esquema y persistencia
const ARCHIVOS_BASE = [
  "electron/main/database.ts", // <-- Aquí está el CREATE TABLE y la inicialización
  "electron/main/preload.ts", // <-- El contrato de API expuesto hacia el frontend
];

// Módulos de persistencia específicos de la base de datos
const MODULOS_PERSISTENCIA = [
  "electron/main/workspaces.ts",
  "electron/main/notebooks.ts",
  "electron/main/notes.ts",
  "electron/main/tags.ts",
  "electron/main/templates.ts",
  "electron/main/trash.ts",
  "electron/main/settings.ts",
  "electron/main/backup.ts",
];

const todosLosArchivos = [...ARCHIVOS_BASE, ...MODULOS_PERSISTENCIA];

const rootDir = process.cwd();
const outputFile = "CONSOLIDADO_SCHEMA_DB.txt";

let contenido = `========================================================\n`;
contenido += `CONSOLIDADO: ESQUEMA DDL, PERSISTENCIA Y BASE DE DATOS SQLITE\n`;
contenido += `========================================================\n\n`;

let incluidos = 0;

for (const archivoRelativo of todosLosArchivos) {
  const rutaCompleta = path.join(rootDir, archivoRelativo);
  if (fs.existsSync(rutaCompleta)) {
    const data = fs.readFileSync(rutaCompleta, "utf-8");
    contenido += `========================================\nFILE: ${archivoRelativo.replace(/\\/g, "/")}\n========================================\n${data}\n\n`;
    incluidos++;
  }
}

fs.writeFileSync(outputFile, contenido, "utf-8");
console.log(
  "\x1b[32m%s\x1b[0m",
  `¡Listo! Esquema y operaciones de DB consolidados (${incluidos} archivos) en ${outputFile}`,
);
