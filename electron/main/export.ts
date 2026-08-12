import { BrowserWindow, dialog, ipcMain } from "electron";
import fs from "node:fs";
import path from "node:path";

function sanitizeFileName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_\. ]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/^_+|_+$/g, "")
    .substring(0, 120);
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, (_match, level, content) => {
      return "#".repeat(Number(level)) + " " + content + "\n\n";
    })
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
    .replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/gi, "![$1]($2)")
    .replace(/<strong>|<b>/gi, "**")
    .replace(/<\/strong>|<\/b>/gi, "**")
    .replace(/<em>|<i>/gi, "*")
    .replace(/<\/em>|<\/i>/gi, "*")
    .replace(/<u>/gi, "_")
    .replace(/<\/u>/gi, "_")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildHtmlDocument(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>
body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; color: #111827; background: #fff; }
img { max-width: 100%; height: auto; }
pre { white-space: pre-wrap; }
</style>
</head>
<body>
<h1>${title}</h1>
${content}
</body>
</html>`;
}

function getSaveFileName(title: string, extension: string): string {
  const safeName = sanitizeFileName(title) || "Nota";
  return `${safeName}.${extension}`;
}

function writeFile(filePath: string, contents: string | Buffer): string {
  fs.writeFileSync(filePath, contents, "utf8");
  return filePath;
}

async function createHiddenWindow(html: string): Promise<BrowserWindow> {
  const exportWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
    },
  });

  await exportWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(html)}`,
  );
  return exportWindow;
}

function getActiveWindow(): BrowserWindow | null {
  return (
    BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0] ?? null
  );
}

export function registerExportIpc(): void {
  ipcMain.handle(
    "export:toTXT",
    async (_event, title: string, content: string) => {
      const defaultPath = getSaveFileName(title, "txt");
      const { canceled, filePath } = await dialog.showSaveDialog({
        title: "Exportar nota como TXT",
        defaultPath,
        filters: [{ name: "Texto", extensions: ["txt"] }],
      });
      if (canceled || !filePath) return null;
      return writeFile(filePath, htmlToPlainText(content));
    },
  );

  ipcMain.handle(
    "export:toMD",
    async (_event, title: string, content: string) => {
      const defaultPath = getSaveFileName(title, "md");
      const { canceled, filePath } = await dialog.showSaveDialog({
        title: "Exportar nota como Markdown",
        defaultPath,
        filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
      });
      if (canceled || !filePath) return null;
      return writeFile(filePath, htmlToPlainText(content));
    },
  );

  ipcMain.handle(
    "export:toHTML",
    async (_event, title: string, content: string) => {
      const defaultPath = getSaveFileName(title, "html");
      const { canceled, filePath } = await dialog.showSaveDialog({
        title: "Exportar nota como HTML",
        defaultPath,
        filters: [{ name: "HTML", extensions: ["html", "htm"] }],
      });
      if (canceled || !filePath) return null;
      return writeFile(filePath, buildHtmlDocument(title, content));
    },
  );

  ipcMain.handle(
    "export:toPDF",
    async (_event, title: string, content: string) => {
      const defaultPath = getSaveFileName(title, "pdf");
      const { canceled, filePath } = await dialog.showSaveDialog({
        title: "Exportar nota como PDF",
        defaultPath,
        filters: [{ name: "PDF", extensions: ["pdf"] }],
      });
      if (canceled || !filePath) return null;

      const html = buildHtmlDocument(title, content);
      const printWindow = await createHiddenWindow(html);
      try {
        const data = await printWindow.webContents.printToPDF({
          printBackground: true,
          pageSize: "A4",
          marginsType: 1,
        });
        fs.writeFileSync(filePath, data);
        return filePath;
      } finally {
        printWindow.close();
      }
    },
  );

  ipcMain.handle(
    "export:toNoteHub",
    async (_event, noteData: Record<string, unknown>) => {
      const title =
        typeof noteData.title === "string" ? noteData.title : "nota";
      const { filePath } = await dialog.showSaveDialog({
        title: "Exportar Nota NoteHub",
        defaultPath: `${title || "nota"}.notehub`,
        filters: [{ name: "Paquete NoteHub", extensions: ["notehub"] }],
      });

      if (!filePath) return null;

      const payload = {
        app: "NoteHub",
        version: "1.0",
        exportedAt: new Date().toISOString(),
        data: {
          id: noteData.id ?? null,
          workspaceId: noteData.workspaceId ?? null,
          notebookId: noteData.notebookId ?? null,
          title:
            typeof noteData.title === "string" ? noteData.title : "Sin título",
          content: typeof noteData.content === "string" ? noteData.content : "",
          isPinned:
            typeof noteData.isPinned === "number"
              ? noteData.isPinned
              : noteData.isPinned
                ? 1
                : 0,
          isFavorite:
            typeof noteData.isFavorite === "number"
              ? noteData.isFavorite
              : noteData.isFavorite
                ? 1
                : 0,
          isQuickAccess:
            typeof noteData.isQuickAccess === "number"
              ? noteData.isQuickAccess
              : noteData.isQuickAccess
                ? 1
                : 0,
          isDeleted:
            typeof noteData.isDeleted === "number"
              ? noteData.isDeleted
              : noteData.isDeleted
                ? 1
                : 0,
          pinnedAt: noteData.pinnedAt ?? null,
          createdAt: noteData.createdAt ?? new Date().toISOString(),
          updatedAt: noteData.updatedAt ?? new Date().toISOString(),
          tags: Array.isArray(noteData.tags) ? noteData.tags : [],
        },
      };

      return writeFile(filePath, JSON.stringify(payload, null, 2));
    },
  );

  ipcMain.handle("import:fromNoteHub", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "Importar nota desde archivo NoteHub",
      properties: ["openFile"],
      filters: [{ name: "NoteHub", extensions: ["notehub", "json"] }],
    });
    if (canceled || filePaths.length === 0) return null;

    const filePath = filePaths[0];
    const content = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(content) as { note?: Record<string, unknown> };
    if (!parsed || typeof parsed !== "object" || !parsed.note) {
      throw new Error("Formato de archivo NoteHub no válido");
    }
    return parsed.note;
  });
}
