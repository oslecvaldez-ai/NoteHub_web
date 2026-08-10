import type { Note } from './notesApi'

export function extraerExtracto(content: string): string {
  return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150)
}

export function extractImage(content: string): string | null {
  return content.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? null
}

export function formatNoteDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }).format(date)
}

export function getNoteTitle(note: Note): string {
  return note.title || 'Sin título'
}
