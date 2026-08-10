import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react'
import { ChevronDown, ChevronRight, Folder, Plus } from '../../../core/components/Iconos'
import { ConfirmacionEliminacionModal } from '../../../core/components/ConfirmacionEliminacionModal'
import { useNotifications } from '../../../core/components/useNotifications'
import { MenuContextual, type ContextMenuItem } from './MenuContextual'
import { NuevoCuadernoModal } from './NuevoCuadernoModal'
import { notesApi, type Notebook } from '../notesApi'

export interface ArbolCuadernosProps {
  workspaceId: number | null
  selectedNotebookId: number | null
  onSelectNotebook: (notebookId: number | null) => void
}

interface NotebookTreeNode extends Notebook {
  children: NotebookTreeNode[]
}

interface MenuState {
  x: number
  y: number
  notebook: Notebook
}

export function ArbolCuadernos({ workspaceId, selectedNotebookId, onSelectNotebook }: ArbolCuadernosProps): ReactElement {
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [reloadToken, setReloadToken] = useState(0)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [modal, setModal] = useState<{ open: boolean; parentId: number | null; notebook: Notebook | null }>({ open: false, parentId: null, notebook: null })
  const [menu, setMenu] = useState<MenuState | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Notebook | null>(null)
  const { notify: showNotification } = useNotifications()

  const loadNotebooks = useCallback(async (): Promise<void> => {
    if (workspaceId === null) return
    try {
      setNotebooks(await notesApi.notebooks.getAll(workspaceId))
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'No se pudieron cargar los cuadernos', 'error')
    }
  }, [showNotification, workspaceId])

  useEffect(() => {
    if (workspaceId === null) return undefined
    let active = true
    void notesApi.notebooks.getAll(workspaceId)
      .then((loaded) => {
        if (active) setNotebooks(loaded)
      })
      .catch((error: unknown) => {
        if (active) showNotification(error instanceof Error ? error.message : 'No se pudieron cargar los cuadernos', 'error')
      })
    return () => { active = false }
  }, [reloadToken, showNotification, workspaceId])

  const tree = useMemo(() => {
    const build = (parentId: number | null): NotebookTreeNode[] => notebooks
      .filter((notebook) => notebook.parent_notebook_id === parentId)
      .map((notebook) => ({ ...notebook, children: build(notebook.id) }))
    return build(null)
  }, [notebooks])

  function toggleExpanded(id: number): void {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function openNew(parentId: number | null): void {
    setMenu(null)
    setModal({ open: true, parentId, notebook: null })
  }

  function openEdit(notebook: Notebook): void {
    setMenu(null)
    setModal({ open: true, parentId: notebook.parent_notebook_id, notebook })
  }

  async function deleteNotebook(): Promise<void> {
    if (!deleteTarget) return
    try {
      await notesApi.notebooks.delete(deleteTarget.id)
      showNotification('Cuaderno eliminado correctamente', 'success')
      if (selectedNotebookId === deleteTarget.id) onSelectNotebook(null)
      setDeleteTarget(null)
      await loadNotebooks()
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'No se pudo eliminar el cuaderno', 'error')
    }
  }

  function menuItems(notebook: Notebook): ContextMenuItem[] {
    return [
      { id: 'edit', label: 'Editar', onSelect: () => openEdit(notebook) },
      { id: 'child', label: 'Nuevo subcuaderno', onSelect: () => openNew(notebook.id) },
      { id: 'delete', label: 'Eliminar', destructive: true, onSelect: () => { setMenu(null); setDeleteTarget(notebook) } },
    ]
  }

  function renderNode(node: NotebookTreeNode, depth = 0): ReactElement {
    const isExpanded = expanded.has(node.id)
    return (
      <div key={node.id}>
        <div
          className={`arbol-cuaderno-row${selectedNotebookId === node.id ? ' is-selected' : ''}`}
          onContextMenu={(event) => { event.preventDefault(); setMenu({ x: event.clientX, y: event.clientY, notebook: node }) }}
          style={{ paddingLeft: 10 + depth * 16 }}
        >
          {node.children.length > 0 ? (
            <button aria-label={isExpanded ? 'Contraer cuaderno' : 'Expandir cuaderno'} onClick={() => toggleExpanded(node.id)} type="button">
              {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
          ) : <span className="arbol-cuaderno-spacer" />}
          <button className="arbol-cuaderno-select" onClick={() => onSelectNotebook(node.id)} type="button">
            <Folder aria-hidden="true" size={17} />
            <span>{node.name}</span>
            <small>{node.note_count}</small>
          </button>
        </div>
        {isExpanded && node.children.map((child) => renderNode(child, depth + 1))}
      </div>
    )
  }

  return (
    <section className="arbol-cuadernos">
      <div className="notas-sidebar-section-heading">
        <span>Cuadernos</span>
        <button aria-label="Nuevo cuaderno" onClick={() => openNew(null)} type="button"><Plus size={16} /></button>
      </div>
      {workspaceId === null ? <p className="notas-sidebar-empty">Selecciona un espacio</p> : tree.length === 0 ? <p className="notas-sidebar-empty">Aún no hay cuadernos</p> : tree.map((node) => renderNode(node))}
      {menu && <MenuContextual isOpen items={menuItems(menu.notebook)} onClose={() => setMenu(null)} x={menu.x} y={menu.y} />}
      <NuevoCuadernoModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, parentId: null, notebook: null })}
        onSaved={() => setReloadToken((current) => current + 1)}
        parentNotebookId={modal.parentId}
        notebook={modal.notebook}
        workspaceId={workspaceId ?? 0}
      />
      <ConfirmacionEliminacionModal
        isOpen={Boolean(deleteTarget)}
        message="¿Estás seguro de que deseas eliminar este cuaderno? Sus notas quedarán sin cuaderno."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void deleteNotebook()}
        title="Eliminar cuaderno"
      />
    </section>
  )
}
