import { Check, ChevronDown, ChevronRight, X } from '../../../core/components/Iconos'
import { useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import type { Notebook } from '../notesApi'

export interface SeleccionCuadernoModalProps {
  isOpen: boolean
  notebooks: Notebook[]
  currentNotebookId: number | null
  onClose: () => void
  onSelect: (notebookId: number | null) => void
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

export function SeleccionCuadernoModal({
  isOpen,
  notebooks,
  currentNotebookId,
  onClose,
  onSelect,
}: SeleccionCuadernoModalProps): ReactElement | null {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  if (!isOpen) return null
  const root = getModalRoot()
  if (!root) return null
  const childrenOf = (parentId: number | null) => notebooks.filter((notebook) => notebook.parent_notebook_id === parentId)

  function renderTree(parentId: number | null, depth = 0): ReactElement[] {
    return childrenOf(parentId).flatMap((notebook) => {
      const children = childrenOf(notebook.id)
      const isExpanded = expanded.has(notebook.id)
      return [
        <div className="seleccion-cuaderno-row" key={notebook.id} style={{ paddingLeft: 12 + depth * 18 }}>
          {children.length > 0 ? (
              <button aria-label={isExpanded ? 'Contraer' : 'Expandir'} onClick={() => setExpanded((current) => { const next = new Set(current); if (isExpanded) next.delete(notebook.id); else next.add(notebook.id); return next })} type="button">
              {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
          ) : <span className="seleccion-cuaderno-indent" />}
          <button className={currentNotebookId === notebook.id ? 'is-current' : undefined} onClick={() => onSelect(notebook.id)} type="button">
            <span>{notebook.name}</span>
            {currentNotebookId === notebook.id && <Check size={16} />}
          </button>
        </div>,
        ...(isExpanded ? renderTree(notebook.id, depth + 1) : []),
      ]
    })
  }

  return createPortal(
    <div className="notas-modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="seleccionar-cuaderno-titulo" className="notas-modal" role="dialog">
        <button aria-label="Cerrar modal" className="notas-modal-close" onClick={onClose} type="button"><X size={20} /></button>
        <h2 id="seleccionar-cuaderno-titulo">Mover a un cuaderno</h2>
        <div className="seleccion-cuaderno-list">
          <button className={currentNotebookId === null ? 'is-current' : undefined} onClick={() => onSelect(null)} type="button">
            <span>Sin cuaderno</span>{currentNotebookId === null && <Check size={16} />}
          </button>
          {renderTree(null)}
        </div>
        <div className="notas-modal-actions"><button onClick={onClose} type="button">Cancelar</button></div>
      </section>
    </div>,
    root,
  )
}
