import { useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { ConfirmacionEliminacionModal } from '../../../core/components/ConfirmacionEliminacionModal'
import { useNotifications } from '../../../core/components/useNotifications'
import { X } from '../../../core/components/Iconos'
import { workspacesApi, type Workspace } from '../workspacesApi'

export interface EditarEspacioModalProps {
  isOpen: boolean
  workspace: Workspace | null
  onClose: () => void
  onUpdated?: (workspace: Workspace) => void
  onDeleted?: (workspaceId: number) => void
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

export function EditarEspacioModal({
  isOpen,
  workspace,
  onClose,
  onUpdated,
  onDeleted,
}: EditarEspacioModalProps): ReactElement | null {
  const [name, setName] = useState(workspace?.name ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const { notify: showNotification } = useNotifications()

  async function handleUpdate(): Promise<void> {
    if (!workspace || !name.trim() || isSaving) return
    setIsSaving(true)
    try {
      const updatedWorkspace = await workspacesApi.update(workspace.id, name)
      if (!updatedWorkspace) throw new Error('No se pudo actualizar el espacio')
      showNotification('Espacio actualizado correctamente', 'success')
      onUpdated?.(updatedWorkspace)
      onClose()
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'No se pudo actualizar el espacio', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(): Promise<void> {
    if (!workspace || workspace.is_default === 1 || isSaving) return
    setIsSaving(true)
    try {
      await workspacesApi.delete(workspace.id)
      showNotification('Espacio eliminado correctamente', 'success')
      onDeleted?.(workspace.id)
      setIsConfirmingDelete(false)
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'No se pudo eliminar el espacio', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const modalRoot = isOpen ? getModalRoot() : null
  const modal = isOpen && workspace && modalRoot
    ? createPortal(
        <div className="espacios-modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
          <section aria-labelledby="editar-espacio-titulo" className="espacios-modal" role="dialog">
            <button aria-label="Cerrar modal" className="espacios-modal-close" onClick={onClose} type="button">
              <X size={20} />
            </button>
            <h2 id="editar-espacio-titulo">Editar espacio</h2>
            <label htmlFor="editar-espacio-nombre">Nombre del espacio</label>
            <input
              autoFocus
              id="editar-espacio-nombre"
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
            <div className="espacios-modal-actions">
              <button onClick={onClose} type="button">Cancelar</button>
              <button disabled={!name.trim() || isSaving} onClick={() => void handleUpdate()} type="button">{isSaving ? 'Guardando...' : 'Hecho'}</button>
            </div>
            {workspace.is_default !== 1 && (
              <button
                className="espacios-danger-action"
                disabled={isSaving}
                onClick={() => {
                  onClose()
                  setIsConfirmingDelete(true)
                }}
                type="button"
              >
                Eliminar espacio
              </button>
            )}
          </section>
        </div>,
        modalRoot,
      )
    : null

  return (
    <>
      {modal}
      <ConfirmacionEliminacionModal
        isOpen={isConfirmingDelete}
        message="¿Estás seguro de que deseas eliminar este espacio? Se moverán todas sus notas y cuadernos al espacio por defecto."
        onCancel={() => setIsConfirmingDelete(false)}
        onConfirm={() => void handleDelete()}
        title="Eliminar espacio"
      />
    </>
  )
}
