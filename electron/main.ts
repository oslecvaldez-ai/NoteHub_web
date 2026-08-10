import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  closeDatabase,
  getDatabase,
  registerDatabaseIpc,
} from './main/database'
import { registerNotebooksIpc } from './main/notebooks'
import { registerNotesIpc } from './main/notes'
import { registerWorkspacesIpc } from './main/workspaces'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  const possiblePaths = [
    path.join(currentDirectory, 'preload.mjs'),
    path.join(currentDirectory, 'preload.js'),
    path.join(currentDirectory, 'main', 'preload.mjs'),
    path.join(currentDirectory, 'main', 'preload.js'),
  ]
  const preloadPath = possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0]
  console.log('👉 Archivo preload inyectado desde:', preloadPath)

  mainWindow = new BrowserWindow({
    height: 820,
    minHeight: 600,
    minWidth: 960,
    show: false,
    title: 'NoteHub Desktop',
    webPreferences: {
      contextIsolation: true,
      preload: preloadPath,
		},
		width: 1320,
	})

	mainWindow.once('ready-to-show', () => mainWindow?.show())
	mainWindow.on('closed', () => {
		mainWindow = null
	})

	if (process.env.VITE_DEV_SERVER_URL) {
		void mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
	} else {
		void mainWindow.loadFile(path.join(currentDirectory, '..', 'dist', 'index.html'))
	}
}

void app.whenReady().then(() => {
	getDatabase()
	registerDatabaseIpc()
	registerWorkspacesIpc()
	registerNotebooksIpc()
	registerNotesIpc()
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
	closeDatabase()
})
