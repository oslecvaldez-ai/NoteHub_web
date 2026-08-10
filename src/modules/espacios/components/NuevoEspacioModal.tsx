import { useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { useNotifications } from '../../../core/components/useNotifications'
import { X } from '../../../core/components/Iconos'
import { workspacesApi, type Workspace } from '../workspacesApi'

export interface NuevoEspacioModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: (workspace: Workspace) => void
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

export function NuevoEspacioModal({
  isOpen,
  onClose,
  onCreated,
}: NuevoEspacioModalProps): ReactElement | null {
  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const { notify: showNotification } = useNotifications()

  if (!isOpen) return null
  const modalRoot = getModalRoot()
  if (!modalRoot) return null

  const canSubmit = name.trim().length > 0 && !isSaving

  async function handleSubmit(): Promise<void> {
    if (!canSubmit) return
    setIsSaving(true)
    try {
      const workspace = await workspacesApi.create(name)
      if (!workspace) throw new Error('No se pudo crear el espacio')
      showNotification('Espacio creado correctamente', 'success')
      onCreated?.(workspace)
      onClose()
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'No se pudo crear el espacio', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return createPortal(
    <div className="espacios-modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="nuevo-espacio-titulo" className="espacios-modal" role="dialog">
        <button aria-label="Cerrar modal" className="espacios-modal-close" onClick={onClose} type="button">
          <X size={20} />
        </button>
        <h2 id="nuevo-espacio-titulo">Nuevo espacio</h2>
        <label htmlFor="nuevo-espacio-nombre">Nombre del espacio</label>
        <input
          autoFocus
          id="nuevo-espacio-nombre"
          onChange={(event) => setName(event.target.value)}
          placeholder="Ej. Trabajo"
          value={name}
        />
        <div className="espacios-modal-option">
          <span>Bloquear <small>Próximamente</small></span>
          <input aria-label="Bloquear espacio próximamente" disabled type="checkbox" />
        </div>
        <div className="espacios-modal-actions">
          <button onClick={onClose} type="button">Cancelar</button>
          <button disabled={!canSubmit} onClick={() => void handleSubmit()} type="button">{isSaving ? 'Guardando...' : 'Hecho'}</button>
        </div>
      </section>
    </div>,
    modalRoot,
  )
}
