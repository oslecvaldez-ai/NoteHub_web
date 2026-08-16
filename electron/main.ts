import { app, BrowserWindow, net, protocol } from "electron";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import {
  closeDatabase,
  getDatabase,
  registerDatabaseIpc,
} from "./main/database";
import { registerExportIpc } from "./main/export";
import { registerFilesIpc } from "./main/files";
import { registerNotebooksIpc } from "./main/notebooks";
import { registerNotesIpc } from "./main/notes";
import { registerWorkspacesIpc } from "./main/workspaces";
import { registerTagsIpc } from "./main/tags";
import { registerEditorIpc } from "./main/editor";
import { registerTemplatesIpc } from "./main/templates";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  const possiblePaths = [
    path.join(currentDirectory, "preload.mjs"),
    path.join(currentDirectory, "preload.js"),
    path.join(currentDirectory, "main", "preload.mjs"),
    path.join(currentDirectory, "main", "preload.js"),
  ];
  const preloadPath =
    possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0];
  console.log("👉 Archivo preload inyectado desde:", preloadPath);
  // Resolve public/asset path depending on packaging state so icon path works in dev and production
  const publicPath = app.isPackaged
    ? path.join(currentDirectory, "..", "dist")
    : path.join(currentDirectory, "..", "public");

  // Prefer formats that work well as native icons on Windows/Linux (png, ico), fallback to svg
  const iconCandidates = ["notehub.png", "notehub.ico", "notehub.svg"];
  let resolvedIcon: string | undefined;
  for (const candidate of iconCandidates) {
    const candidatePath = path.join(publicPath, candidate);
    if (fs.existsSync(candidatePath)) {
      resolvedIcon = candidatePath;
      break;
    }
  }
  if (!resolvedIcon) {
    // Last-resort: try public folder relative to currentDirectory
    const fallback = path.join(currentDirectory, "..", "public", "notehub.svg");
    if (fs.existsSync(fallback)) resolvedIcon = fallback;
  }

  mainWindow = new BrowserWindow({
    height: 820,
    minHeight: 600,
    minWidth: 960,
    show: false,
    autoHideMenuBar: true,
    // Use the resolved icon when available (prefers png/ico over svg for native platforms)
    ...(resolvedIcon ? { icon: resolvedIcon } : {}),
    title: "NoteHub",
    webPreferences: {
      contextIsolation: true,
      preload: preloadPath,
    },
    width: 1320,
  });

  mainWindow.once("ready-to-show", () => mainWindow?.show());
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    void mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    void mainWindow.loadFile(
      path.join(currentDirectory, "..", "dist", "index.html"),
    );
  }
}

void app.whenReady().then(() => {
  protocol.handle("notehub", async (request) => {
    const requestedPath = request.url.replace("notehub://", "");
    const segments = requestedPath.split("/");
    let resolvedPath: string;

    if (segments[0] === "images") {
      resolvedPath = path.join(
        app.getPath("userData"),
        "images",
        ...segments.slice(1),
      );
    } else if (segments[0] === "covers") {
      resolvedPath = path.join(
        app.getPath("userData"),
        "covers",
        ...segments.slice(1),
      );
    } else {
      resolvedPath = path.join(
        app.getPath("userData"),
        "covers",
        requestedPath,
      );
    }

    if (!fs.existsSync(resolvedPath)) {
      return new Response("Archivo no encontrado", {
        status: 404,
        headers: { "content-type": "text/plain" },
      });
    }
    return net.fetch(`file://${resolvedPath}`);
  });

  getDatabase();
  registerDatabaseIpc();
  registerWorkspacesIpc();
  registerNotebooksIpc();
  registerNotesIpc();
  registerTagsIpc();
  registerEditorIpc();
  registerTemplatesIpc();
  registerFilesIpc();
  registerExportIpc();
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
