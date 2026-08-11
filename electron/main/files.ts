import { app, dialog, ipcMain } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

export type ImagePayload = {
	name: string
	mimeType: string
	data: Uint8Array
}

function sanitizeFileName(value: string): string {
	return value
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-zA-Z0-9-_\. ]+/g, '_')
		.replace(/\s+/g, '_')
		.replace(/^_+|_+$/g, '')
}

function buildDestinationName(sourceName: string, sourceType?: string): string {
	const extension = path.extname(sourceName).toLowerCase() || (sourceType?.startsWith('image/') ? `.${sourceType.split('/')[1]}` : '.png')
	const baseName = path.basename(sourceName, path.extname(sourceName))
	const sanitizedBaseName = sanitizeFileName(baseName) || 'imagen'
	return `${Date.now()}-${sanitizedBaseName}${extension}`
}

function writeImageToUserData(payload: string | ImagePayload): string {
	const imagesDirectory = path.join(app.getPath('userData'), 'images')
	fs.mkdirSync(imagesDirectory, { recursive: true })

	let fileName: string
	let destinationPath: string

	if (typeof payload === 'string') {
		const absoluteSourcePath = path.resolve(payload)
		if (!fs.existsSync(absoluteSourcePath)) {
			throw new Error('No se encontró el archivo seleccionado')
		}
		fileName = buildDestinationName(absoluteSourcePath)
		destinationPath = path.join(imagesDirectory, fileName)
		fs.copyFileSync(absoluteSourcePath, destinationPath)
		return fileName
	}

	fileName = buildDestinationName(payload.name, payload.mimeType)
	destinationPath = path.join(imagesDirectory, fileName)
	fs.writeFileSync(destinationPath, Buffer.from(payload.data))
	return fileName
}

export function registerFilesIpc(): void {
	ipcMain.handle('files:copy-image', async (_event, sourcePath?: string | null) => {
		let selectedPath = sourcePath?.trim() ?? ''
		if (!selectedPath) {
			const { canceled, filePaths } = await dialog.showOpenDialog({
				title: 'Selecciona una imagen',
				properties: ['openFile'],
				filters: [{ name: 'Imágenes', extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif'] }],
			})
			if (canceled || filePaths.length === 0) {
				return null
			}
			selectedPath = filePaths[0]
		}
		return writeImageToUserData(selectedPath)
	})

	ipcMain.handle('files:save-image', async (_event, source) => {
		if (!source) {
			const { canceled, filePaths } = await dialog.showOpenDialog({
				title: 'Selecciona una imagen',
				properties: ['openFile'],
				filters: [{ name: 'Imágenes', extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif'] }],
			})
			if (canceled || filePaths.length === 0) {
				return null
			}
			return writeImageToUserData(filePaths[0])
		}

		return writeImageToUserData(source as string | ImagePayload)
	})
}
