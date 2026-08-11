import { ipcMain } from 'electron'
import { getDatabase } from './database'

interface NoteRecord {
	id: number
	title: string
	content: string
	notebook_id: number | null
}

function getNoteById(id: number): NoteRecord | undefined {
	return getDatabase()
		.prepare('SELECT id, title, content, notebook_id FROM notes WHERE id = ?')
		.get(id) as NoteRecord | undefined
}

function normalizeHtmlText(value: string): string {
	return value
		.replace(/&nbsp;|&#160;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;|&#34;/g, '"')
		.replace(/&#39;|&#x27;/g, "'")
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<\/p>/gi, '\n')
		.replace(/<[^>]+>/g, '')
		.replace(/\s+/g, ' ')
		.trim()
}

function extractTitleFromContent(content: string): string {
	const headingMatch = content.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i)
	const rawTitle = headingMatch?.[1] ? normalizeHtmlText(headingMatch[1]) : normalizeHtmlText(content)
	const title = rawTitle.split('\n').map((line) => line.trim()).find(Boolean) ?? ''
	return title.slice(0, 120) || 'Nota sin título'
}

export function registerEditorIpc(): void {
	ipcMain.handle('notes:save-content', (_event, noteId: number, content: string, notebookId?: number | null) => {
		const note = getNoteById(noteId)
		if (!note) {
			throw new Error('La nota no existe')
		}

		const title = extractTitleFromContent(content) || note.title || 'Nota sin título'
		const targetNotebookId = notebookId === undefined ? note.notebook_id : notebookId

		getDatabase()
			.prepare(
				`UPDATE notes
				 SET title = ?, content = ?, notebook_id = ?, updated_at = CURRENT_TIMESTAMP
				 WHERE id = ?`,
			)
			.run(title, content, targetNotebookId, noteId)

		return getNoteById(noteId)
	})
}
