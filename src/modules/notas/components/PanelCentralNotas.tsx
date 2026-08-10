import { useCallback, useEffect, useState, type MouseEvent, type ReactElement } from 'react'
import { FileText, Plus, Search, Settings } from '../../../core/components/Iconos'
import { ConfirmacionEliminacionModal } from '../../../core/components/ConfirmacionEliminacionModal'
import { useNotifications } from '../../../core/components/useNotifications'
import { MenuContextual, type ContextMenuItem } from './MenuContextual'
import { NotaListItem } from './NotaListItem'
import { SeleccionCuadernoModal } from './SeleccionCuadernoModal'
import { notesApi, type Notebook, type Note } from '../notesApi'

export interface PanelCentralNotasProps {
  workspaceId: number | null
  notebookId: number | null
  onNoteSelect?: (note: Note) => void
}

interface MenuState {
  x: number
  y: number
  note: Note
}

export function PanelCentralNotas({ workspaceId, notebookId, onNoteSelect }: PanelCentralNotasProps): ReactElement {
  const [notes, setNotes] = useState<Note[]>([])
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [menu, setMenu] = useState<MenuState | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null)
  const [moveNote, setMoveNote] = useState<Note | null>(null)
  const { notify: showNotification } = useNotifications()

  const loadNotes = useCallback(async (): Promise<void> => {
    if (workspaceId === null) return
    setIsLoading(true)
    try {
      const loaded = search.trim()
        ? await notesApi.notes.search(workspaceId, search, notebookId)
        : await notesApi.notes.getByWorkspace(workspaceId, notebookId)
      setNotes(loaded)
      setNotebooks(await notesApi.notebooks.getAll(workspaceId))
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'No se pudieron cargar las notas', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [notebookId, search, showNotification, workspaceId])

  useEffect(() => {
    if (workspaceId === null) return undefined
    let active = true
    const notesRequest = search.trim()
      ? notesApi.notes.search(workspaceId, search, notebookId)
      : notesApi.notes.getByWorkspace(workspaceId, notebookId)
    void Promise.all([notesRequest, notesApi.notebooks.getAll(workspaceId)])
      .then(([loadedNotes, loadedNotebooks]) => {
        if (!active) return
        setNotes(loadedNotes)
        setNotebooks(loadedNotebooks)
        setIsLoading(false)
      })
      .catch((error: unknown) => {
        if (!active) return
        setIsLoading(false)
        showNotification(error instanceof Error ? error.message : 'No se pudieron cargar las notas', 'error')
      })
    return () => { active = false }
  }, [notebookId, search, showNotification, workspaceId])

  async function createNote(): Promise<void> {
    if (workspaceId === null) return
    try {
      const note = await notesApi.notes.create(workspaceId, { notebookId })
      if (!note) throw new Error('No se pudo crear la nota')
      showNotification('Nota creada correctamente', 'success')
      onNoteSelect?.(note)
      await loadNotes()
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'No se pudo crear la nota', 'error')
    }
  }

  function selectNote(note: Note): void {
    if (selectionMode) {
      setSelectedIds((current) => current.includes(note.id) ? current.filter((id) => id !== note.id) : [...current, note.id])
      return
    }
    onNoteSelect?.(note)
  }

  async function runNoteAction(action: () => Promise<Note | undefined>, message: string): Promise<void> {
    try {
      await action()
      showNotification(message, 'success')
      await loadNotes()
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'No se pudo actualizar la nota', 'error')
    }
  }

  function noteMenuItems(note: Note): ContextMenuItem[] {
    return [
      { id: 'pin', label: note.is_pinned === 1 ? 'Desanclar' : 'Anclar', onSelect: () => void runNoteAction(() => notesApi.notes.togglePin(note.id), 'Nota actualizada correctamente') },
      { id: 'quick', label: 'Acceso rápido', onSelect: () => void runNoteAction(() => notesApi.notes.toggleQuickAccess(note.id), 'Acceso rápido actualizado') },
      { id: 'duplicate', label: 'Duplicar', onSelect: () => void runNoteAction(() => notesApi.notes.duplicate(note.id), 'Nota duplicada correctamente') },
      { id: 'move', label: 'Mover a un cuaderno', onSelect: () => setMoveNote(note) },
      { id: 'delete', label: 'Eliminar', destructive: true, onSelect: () => setDeleteTarget(note) },
    ]
  }

  async function deleteNote(): Promise<void> {
    if (!deleteTarget) return
    await runNoteAction(() => notesApi.notes.delete(deleteTarget.id), 'Nota eliminada correctamente')
    setDeleteTarget(null)
  }

  async function moveSelected(targetNotebookId: number | null): Promise<void> {
    const ids = moveNote ? [moveNote.id] : selectedIds
    try {
      await Promise.all(ids.map((id) => notesApi.notes.move(id, targetNotebookId)))
      showNotification('Nota movida correctamente', 'success')
      setMoveNote(null)
      setSelectedIds([])
      await loadNotes()
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'No se pudo mover la nota', 'error')
    }
  }

  function handleContextMenu(event: MouseEvent, note: Note): void {
    setMenu({ x: event.clientX, y: event.clientY, note })
  }

  return (
    <section className="panel-central-notas">
      <header className="panel-notas-header">
        <div>
          <p className="panel-notas-eyebrow">Notas</p>
          <h2>{notebookId ? 'Cuaderno seleccionado' : 'Todas las notas'}</h2>
        </div>
        <div className="panel-notas-actions">
          <button aria-label="Cambiar orden" className="notas-icon-button" type="button"><Settings size={18} /></button>
          <button className={selectionMode ? 'is-active' : undefined} onClick={() => { setSelectionMode((current) => !current); setSelectedIds([]) }} type="button">
            <FileText size={16} /> Seleccionar
          </button>
          <button className="notas-primary-button" onClick={() => void createNote()} type="button"><Plus size={17} /> Nueva nota</button>
        </div>
      </header>
      <div className="panel-notas-search">
        <Search aria-hidden="true" size={18} />
        <input aria-label="Buscar notas" onChange={(event) => setSearch(event.target.value)} placeholder="Buscar en tus notas..." value={search} />
      </div>
      {selectionMode && selectedIds.length > 0 && (
        <div className="panel-notas-bulk-actions">
          <span>{selectedIds.length} seleccionada(s)</span>
          <button onClick={() => setMoveNote(notes.find((note) => note.id === selectedIds[0]) ?? null)} type="button">Mover seleccionadas</button>
          <button onClick={() => setDeleteTarget(notes.find((note) => note.id === selectedIds[0]) ?? null)} type="button">Eliminar seleccionadas</button>
        </div>
      )}
      <div className="panel-notas-list">
        {workspaceId === null ? <div className="panel-notas-empty"><h3>Selecciona un espacio</h3><p>Elige un espacio en la barra lateral para ver tus notas.</p></div> : isLoading ? <p className="panel-notas-status">Cargando notas...</p> : notes.length === 0 ? <div className="panel-notas-empty"><h3>No hay notas todavía</h3><p>Crea una nota nueva para comenzar.</p></div> : notes.map((note) => <NotaListItem isSelected={selectedIds.includes(note.id)} isSelectionMode={selectionMode} key={note.id} note={note} onContextMenu={handleContextMenu} onSelect={selectNote} />)}
      </div>
      {menu && <MenuContextual isOpen items={noteMenuItems(menu.note)} onClose={() => setMenu(null)} x={menu.x} y={menu.y} />}
      <ConfirmacionEliminacionModal
        isOpen={Boolean(deleteTarget)}
        message="¿Estás seguro de que deseas eliminar esta nota? Podrás encontrarla en la papelera."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void deleteNote()}
        title="Eliminar nota"
      />
      <SeleccionCuadernoModal
        currentNotebookId={moveNote?.notebook_id ?? null}
        isOpen={Boolean(moveNote) || (selectionMode && selectedIds.length > 1)}
        notebooks={notebooks}
        onClose={() => setMoveNote(null)}
        onSelect={(targetNotebookId) => void moveSelected(targetNotebookId)}
      />
    </section>
  )
}
