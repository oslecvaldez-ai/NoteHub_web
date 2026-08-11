import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TiptapEditor, type TiptapEditorHandle } from './TiptapEditor'
import { EditorHeader } from './EditorHeader'
import { EditorToolbar } from './EditorToolbar'
import { BuscadorInterno } from './BuscadorInterno'
import { OpcionesEditorModal } from '../modals/OpcionesEditorModal'
import { useNotifications } from '../../../core/components/useNotifications'

export interface PanelEditorProps {
  noteId?: number | null
  notebookId?: number | null
  noteTitle?: string
  initialHTML?: string
}

function extractTitleFromHTML(html: string): string {
  const headingMatch = html.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i)
  if (headingMatch?.[1]) {
    return headingMatch[1].replace(/<[^>]+>/g, '').trim()
  }
  const plain = html.replace(/<[^>]+>/g, '').trim()
  return plain.split('\n').map((line) => line.trim()).find(Boolean) ?? 'Nota'
}

function buildImagePayload(file: File): Promise<{ name: string; mimeType: string; data: Uint8Array }> {
  return file.arrayBuffer().then((buffer) => ({
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    data: new Uint8Array(buffer),
  }))
}

export function PanelEditor({
  noteId = null,
  notebookId = null,
  noteTitle = 'Nota',
  initialHTML = '',
}: PanelEditorProps) {
  const editorRef = useRef<TiptapEditorHandle | null>(null)
  const previousNoteIdRef = useRef<number | null>(noteId)
  const [focusMode, setFocusMode] = useState(false)
  const [isTagsModalOpen, setTagsModalOpen] = useState(false)
  const [isOptionsModalOpen, setOptionsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [content, setContent] = useState(initialHTML)
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const saveTimeoutRef = useRef<number | null>(null)
  const { notify } = useNotifications()

  useEffect(() => {
    setContent(initialHTML)
  }, [initialHTML])

  useEffect(() => {
    if (previousNoteIdRef.current !== noteId) {
      previousNoteIdRef.current = noteId
      if (noteId !== null) {
        editorRef.current?.setContentHTML(initialHTML ?? '')
        editorRef.current?.focus()
      }
    }
  }, [noteId, initialHTML])

  const resolvedTitle = useMemo(() => extractTitleFromHTML(content) || noteTitle || 'Nota', [content, noteTitle])

  const saveContent = useCallback(
    async (showToast = false): Promise<void> => {
      if (noteId === null) {
        if (showToast) {
          notify('No hay nota activa para guardar', 'warning')
        }
        return
      }

      try {
        await window.electron?.editor?.saveContent(noteId, content, notebookId ?? null)
        if (showToast) {
          notify('Nota guardada correctamente', 'success')
        }
      } catch (error) {
        console.error('Error guardando nota:', error)
        notify('No se pudo guardar la nota', 'error')
      }
    },
    [content, noteId, notebookId, notify],
  )

  useEffect(() => {
    if (noteId === null) return

    window.clearTimeout(saveTimeoutRef.current ?? undefined)
    saveTimeoutRef.current = window.setTimeout(() => {
      void saveContent(false)
    }, 2000)

    return () => {
      window.clearTimeout(saveTimeoutRef.current ?? undefined)
    }
  }, [content, noteId, saveContent])

  const handleSave = useCallback(() => {
    void saveContent(true)
  }, [saveContent])

  const handleImageSave = useCallback(
    async (source: string | File | undefined): Promise<string | null> => {
      if (!source) return null
      try {
        const imageSource =
          typeof source === 'string' ? source : await buildImagePayload(source)
        const fileName = await window.electron?.files?.saveImage(imageSource as any)
        if (!fileName) return null
        return `notehub://images/${fileName}`
      } catch (error) {
        console.error('Error guardando imagen:', error)
        notify('No se pudo guardar la imagen', 'error')
        return null
      }
    },
    [notify],
  )

  const handleInsertImage = useCallback(async () => {
    const fileName = await window.electron?.files?.saveImage?.()
    if (!fileName) return
    editorRef.current?.insertContent(`<img src="notehub://images/${fileName}" alt="Imagen" />`)
  }, [])

  const handleExportAction = useCallback(
    async (type: 'pdf' | 'txt' | 'md' | 'html' | 'notehub') => {
      if (!content) {
        notify('No hay contenido para exportar', 'warning')
        return
      }
      setIsExporting(true)
      try {
        const title = resolvedTitle
        let savedPath: string | null = null
        switch (type) {
          case 'pdf':
            savedPath = (await window.electron?.export?.toPDF(title, content)) ?? null
            break
          case 'txt':
            savedPath = (await window.electron?.export?.toTXT(title, content)) ?? null
            break
          case 'md':
            savedPath = (await window.electron?.export?.toMD(title, content)) ?? null
            break
          case 'html':
            savedPath = (await window.electron?.export?.toHTML(title, content)) ?? null
            break
          case 'notehub':
            savedPath = (await window.electron?.export?.toNoteHub({
              id: noteId,
              notebookId,
              title: resolvedTitle,
              content,
            })) ?? null
            break
        }
        if (savedPath) {
          notify(`Exportado correctamente a ${savedPath}`, 'success')
        }
      } catch (error) {
        console.error('Error en exportación:', error)
        notify('No se pudo exportar la nota', 'error')
      } finally {
        setIsExporting(false)
      }
    },
    [content, notebookId, noteId, notify, resolvedTitle],
  )

  const handleImportNoteHub = useCallback(async () => {
    setIsImporting(true)
    try {
      const importedNote = await window.electron?.export?.fromNoteHub()
      if (!importedNote || typeof importedNote !== 'object') {
        notify('No se importó un contenido válido', 'warning')
        return
      }

      const importedContent = ('content' in importedNote && typeof importedNote.content === 'string')
        ? importedNote.content
        : null

      if (importedContent) {
        setContent(importedContent)
        editorRef.current?.setContentHTML(importedContent)
        notify('Nota importada correctamente', 'success')
      } else {
        notify('El archivo no tiene contenido procesable', 'warning')
      }
    } catch (error) {
      console.error('Error importando nota:', error)
      notify('No se pudo importar el archivo', 'error')
    } finally {
      setIsImporting(false)
    }
  }, [notify])

  const handleTogglePin = useCallback(() => {
    console.log('Fijar editor')
  }, [])

  const handleQuickAccess = useCallback(() => {
    setTagsModalOpen(true)
  }, [])

  const handleOptions = useCallback(() => {
    setOptionsModalOpen(true)
  }, [])

  const handleInsertTable = useCallback(() => {
    editorRef.current?.insertContent('<table><tbody><tr><td></td><td></td></tr></tbody></table>')
  }, [])

  const handleInsertDate = useCallback(() => {
    const now = new Date().toLocaleDateString('es-ES')
    editorRef.current?.insertContent(now)
  }, [])

  const handleInsertEmoji = useCallback((emoji: string) => {
    editorRef.current?.insertContent(emoji)
  }, [])

  const handleToggleCallout = useCallback(() => {
    editorRef.current?.insertContent('<div class="editor-callout" style="background-color: #FEF3C7; border-left: 4px solid #F59E0B;">Callout</div>')
  }, [])

  const handleToggleCollapsible = useCallback(() => {
    editorRef.current?.insertContent('<details class="kh-collapsible"><summary class="kh-collapsible-header">Collapsible</summary><div class="kh-collapsible-content"><p>Contenido colapsable</p></div></details>')
  }, [])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const panelClassName = focusMode ? 'flex h-full min-h-0 flex-1 flex-col p-0' : 'flex h-full min-h-0 flex-1 flex-col p-4'
  const editorWrapperClassName = focusMode ? 'w-full h-full' : 'w-full lg:w-3/4 h-full'

  return (
    <div className={panelClassName}>
      <EditorHeader
        editor={editorRef.current}
        onSave={handleSave}
        onClose={() => void saveContent(true)}
        onPin={handleTogglePin}
        onQuickAccess={handleQuickAccess}
        onOptions={handleOptions}
        onToggleFocusMode={() => setFocusMode((current) => !current)}
      />
      <div className="flex flex-col gap-2 h-full min-h-0">
        <EditorToolbar
          editor={editorRef.current}
          onInsertEmoji={handleInsertEmoji}
          onInsertTable={handleInsertTable}
          onInsertImage={handleInsertImage}
          onInsertDate={handleInsertDate}
          onToggleCallout={handleToggleCallout}
          onToggleCollapsible={handleToggleCollapsible}
        />
        <div className="flex flex-1 gap-4 min-h-0">
          <div className={`${editorWrapperClassName} flex flex-col h-full min-h-0`}>
            <TiptapEditor
              ref={editorRef}
              initialHTML={content}
              onUpdate={setContent}
              onImageDrop={async (file) => {
                const src = await handleImageSave(file)
                if (src) {
                  editorRef.current?.insertContent(`<img src="${src}" alt="Imagen" />`)
                }
                return src
              }}
            />
          </div>
          {!focusMode && (
            <aside className="hidden w-1/4 flex-col gap-3 lg:flex">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Panel adicional</h3>
              </div>
            </aside>
          )}
        </div>
      </div>
      <BuscadorInterno query={searchQuery} onSearch={handleSearch} />
      {isTagsModalOpen && <div className="fixed inset-0 bg-black/40" />}
      {isOptionsModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/40" />
          <OpcionesEditorModal
            onClose={() => setOptionsModalOpen(false)}
            onExportToPDF={() => handleExportAction('pdf')}
            onExportToTXT={() => handleExportAction('txt')}
            onExportToMD={() => handleExportAction('md')}
            onExportToHTML={() => handleExportAction('html')}
            onExportToNoteHub={() => handleExportAction('notehub')}
            onImportNoteHub={handleImportNoteHub}
            isProcessing={isExporting || isImporting}
          />
        </>
      )}
    </div>
  )
}
