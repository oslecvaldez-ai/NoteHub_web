import { useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { Check, X } from '../../../core/components/Iconos'
import { useNotifications } from '../../../core/components/useNotifications'
import {
  workspacesApi,
  type Workspace,
  type WorkspaceElementType,
} from '../workspacesApi'

export interface MoverEspacioModalProps {
  isOpen: boolean
  spaces: Workspace[]
  currentWorkspaceId: number
  elementId: number
  elementType: WorkspaceElementType
  onClose: () => void
  onMoved?: (targetWorkspaceId: number) => void
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

export function MoverEspacioModal({
  isOpen,
  spaces,
  currentWorkspaceId,
  elementId,
  elementType,
  onClose,
  onMoved,
}: MoverEspacioModalProps): ReactElement | null {
  const [targetWorkspaceId, setTargetWorkspaceId] = useState<number | null>(null)
  const [isMoving, setIsMoving] = useState(false)
  const { notify: showNotification } = useNotifications()

  if (!isOpen) return null
  const modalRoot = getModalRoot()
  if (!modalRoot) return null
  const canMove = targetWorkspaceId !== null && targetWorkspaceId !== currentWorkspaceId && !isMoving

  async function handleMove(): Promise<void> {
    if (!canMove || targetWorkspaceId === null) return
    setIsMoving(true)
    try {
      await workspacesApi.moveElement(elementType, elementId, targetWorkspaceId)
      showNotification('Elemento movido correctamente', 'success')
      onMoved?.(targetWorkspaceId)
      onClose()
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'No se pudo mover el elemento', 'error')
    } finally {
      setIsMoving(false)
    }
  }

  return createPortal(
    <div className="espacios-modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="mover-espacio-titulo" className="espacios-modal" role="dialog">
        <button aria-label="Cerrar modal" className="espacios-modal-close" onClick={onClose} type="button">
          <X size={20} />
        </button>
        <h2 id="mover-espacio-titulo">Mover a un espacio</h2>
        <div className="espacios-list" role="listbox" aria-label="Espacios disponibles">
          {spaces.map((space) => {
            const isCurrent = space.id === currentWorkspaceId
            const isSelected = space.id === targetWorkspaceId
            return (
              <button
                aria-selected={isSelected}
                className={`espacios-list-item${isSelected ? ' is-selected' : ''}`}
                disabled={isCurrent}
                key={space.id}
                onClick={() => setTargetWorkspaceId(space.id)}
                role="option"
                type="button"
              >
                <span>{space.name}{isCurrent ? ' (actual)' : ''}</span>
                {isSelected && <Check aria-hidden="true" size={18} />}
              </button>
            )
          })}
        </div>
        <div className="espacios-modal-actions">
          <button onClick={onClose} type="button">Cancelar</button>
          <button disabled={!canMove} onClick={() => void handleMove()} type="button">{isMoving ? 'Moviendo...' : 'Mover'}</button>
        </div>
      </section>
    </div>,
    modalRoot,
  )
}
