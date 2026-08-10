import { useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { X } from '../../../core/components/Iconos'
import { useNotifications } from '../../../core/components/useNotifications'
import { workspacesApi } from '../../espacios/workspacesApi'
import { notesApi, type Notebook } from '../notesApi'

export interface NuevoCuadernoModalProps {
  isOpen: boolean
  workspaceId: number | null
  parentNotebookId?: number | null
  notebook?: Notebook | null
  onClose: () => void
  onSaved?: (notebook: Notebook) => void
}

function getModalRoot(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  let root = document.getElementById('modal-root')
  if (!root) {
    root = document.createElement('div')
    root.id = 'modal-root'
    document.body.appendChild(root)
  }
  return root
}

export function NuevoCuadernoModal({
  isOpen,
  workspaceId,
  parentNotebookId = null,
  notebook,
  onClose,
  onSaved,
}: NuevoCuadernoModalProps): ReactElement | null {
  const [name, setName] = useState(notebook?.name ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const { notify: showNotification } = useNotifications()
  if (!isOpen) return null
  const root = getModalRoot()
  if (!root) return null
  const isEditing = Boolean(notebook)
  const canSubmit = name.trim().length > 0 && !isSaving

  async function handleSave(): Promise<void> {
    if (!canSubmit) return
    setIsSaving(true)
    try {
      const effectiveWorkspaceId = workspaceId && workspaceId > 0
        ? workspaceId
        : (await workspacesApi.getAll()).find((space) => space.is_default === 1)?.id ?? null

      console.log('Creando cuaderno en espacio:', effectiveWorkspaceId, { requestedWorkspaceId: workspaceId, name: name.trim() })

      if (effectiveWorkspaceId === null) {
        throw new Error('No hay un espacio disponible para guardar el cuaderno')
      }

      const saved = isEditing && notebook
        ? await notesApi.notebooks.update(notebook.id, { name: name.trim(), parentNotebookId: notebook.parent_notebook_id, iconType: notebook.icon_type, iconColor: notebook.icon_color })
        : await notesApi.notebooks.create(effectiveWorkspaceId, { name: name.trim(), parentNotebookId })
      if (!saved) throw new Error('No se pudo guardar el cuaderno')
      showNotification(isEditing ? 'Cuaderno actualizado correctamente' : 'Cuaderno creado correctamente', 'success')
      onSaved?.(saved)
      onClose()
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'No se pudo guardar el cuaderno', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return createPortal(
    <div className="notas-modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="nuevo-cuaderno-titulo" className="notas-modal" role="dialog">
        <button aria-label="Cerrar modal" className="notas-modal-close" onClick={onClose} type="button"><X size={20} /></button>
        <h2 id="nuevo-cuaderno-titulo">{isEditing ? 'Editar cuaderno' : 'Nuevo cuaderno'}</h2>
        <label htmlFor="cuaderno-nombre">Nombre</label>
        <input autoFocus id="cuaderno-nombre" onChange={(event) => setName(event.target.value)} value={name} />
        <div className="notas-modal-icon-grid" aria-label="Icono del cuaderno">
          <button className="is-selected" type="button">Carpeta</button>
          <button type="button">Archivo</button>
          <button type="button">Ideas</button>
        </div>
        <div className="notas-modal-actions">
          <button onClick={onClose} type="button">Cancelar</button>
          <button disabled={!canSubmit} onClick={() => void handleSave()} type="button">{isSaving ? 'Guardando...' : 'Hecho'}</button>
        </div>
      </section>
    </div>,
    root,
  )
}
