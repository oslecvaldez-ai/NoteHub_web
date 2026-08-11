import { useEffect, useMemo, useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { BookOpen, Check, Folder, Plus, Sparkles, Star } from 'lucide-react'
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

const defaultCoverOptions = [
  { value: 'folder', label: 'Carpeta', icon: Folder },
  { value: 'book', label: 'Libro', icon: BookOpen },
  { value: 'sparkles', label: 'Ideas', icon: Sparkles },
  { value: 'star', label: 'Favorito', icon: Star },
]

function resolvePreviewUrl(coverPath: string): string {
  if (/^(data:|https?:|blob:|file:)/i.test(coverPath)) {
    return coverPath
  }

  if (/\.(png|jpe?g|webp|gif)$/i.test(coverPath)) {
    return `notehub://${coverPath}`
  }

  return coverPath
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
  const [parentNotebookIdValue, setParentNotebookIdValue] = useState<number | null>(notebook?.parent_notebook_id ?? parentNotebookId ?? null)
  const [selectedIcon, setSelectedIcon] = useState<string>(notebook?.icon_type ?? 'folder')
  const [isLocked, setIsLocked] = useState(Boolean(notebook?.is_locked))
  const [password, setPassword] = useState('')
  const [availableNotebooks, setAvailableNotebooks] = useState<Notebook[]>([])
  const [customCovers, setCustomCovers] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const { notify: showNotification } = useNotifications()

  useEffect(() => {
    if (!isOpen) return
    setName(notebook?.name ?? '')
    setParentNotebookIdValue(notebook?.parent_notebook_id ?? parentNotebookId ?? null)
    setSelectedIcon(notebook?.icon_type ?? 'folder')
    setIsLocked(Boolean(notebook?.is_locked))
    setPassword('')
  }, [isOpen, notebook?.id, notebook?.name, notebook?.parent_notebook_id, notebook?.icon_type, notebook?.is_locked, parentNotebookId])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedCovers = window.localStorage.getItem('notehub-custom-covers')
    if (storedCovers) {
      try {
        const parsed = JSON.parse(storedCovers) as string[]
        setCustomCovers(parsed.filter(Boolean))
      } catch {
        setCustomCovers([])
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('notehub-custom-covers', JSON.stringify(customCovers))
  }, [customCovers])

  useEffect(() => {
    if (!isOpen || workspaceId === null || workspaceId <= 0) {
      setAvailableNotebooks([])
      return undefined
    }

    let active = true
    void notesApi.notebooks.getAll(workspaceId)
      .then((loaded) => {
        if (active) setAvailableNotebooks(loaded.filter((entry) => entry.id !== notebook?.id))
      })
      .catch(() => {
        if (active) setAvailableNotebooks([])
      })

    return () => {
      active = false
    }
  }, [isOpen, notebook?.id, workspaceId])

  const isEditing = Boolean(notebook)
  const canSubmit = name.trim().length > 0 && !isSaving && (!isLocked || password.trim().length > 0 || Boolean(notebook?.is_locked))
  const parentOptions = useMemo(() => availableNotebooks.slice().sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })), [availableNotebooks])
  const coverOptions = useMemo(() => [
    ...defaultCoverOptions.map((entry) => ({ ...entry, type: 'default' as const })),
    ...customCovers.map((coverPath) => ({
      value: coverPath,
      label: 'Portada local',
      type: 'custom' as const,
      src: coverPath,
    })),
  ], [customCovers])

  if (!isOpen) return null
  const root = getModalRoot()
  if (!root) return null

  async function handleAddLocalCover(): Promise<void> {
    try {
      const electronApi = (window as Window & { electron?: { files?: { copyImage?: (sourcePath?: string | null) => Promise<string | null> } } }).electron
      const copiedPath = await electronApi?.files?.copyImage?.()
      if (!copiedPath) return
      setCustomCovers((current) => (current.includes(copiedPath) ? current : [copiedPath, ...current]))
      setSelectedIcon(copiedPath)
      showNotification('Portada añadida correctamente', 'success')
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'No se pudo añadir la portada', 'error')
    }
  }

  async function handleSave(): Promise<void> {
    if (!canSubmit) return
    setIsSaving(true)
    try {
      const effectiveWorkspaceId = workspaceId && workspaceId > 0
        ? workspaceId
        : (await workspacesApi.getAll()).find((space) => space.is_default === 1)?.id ?? null

      if (effectiveWorkspaceId === null) {
        throw new Error('No hay un espacio disponible para guardar el cuaderno')
      }

      const selectedParentNotebookIdValue = parentNotebookIdValue
      const resolvedParentNotebookId = selectedParentNotebookIdValue === null || selectedParentNotebookIdValue === undefined
        ? null
        : Number(selectedParentNotebookIdValue)

      const payload = {
        name: name.trim(),
        parentNotebookId: resolvedParentNotebookId,
        iconType: selectedIcon,
        iconColor: null,
        isLocked,
        password: isLocked ? password : null,
      }

      const saved = isEditing && notebook
        ? await notesApi.notebooks.update(notebook.id, payload)
        : await notesApi.notebooks.create(effectiveWorkspaceId, payload)

      if (!saved) throw new Error('No se pudo guardar el cuaderno')
      showNotification(isEditing ? 'Cuaderno actualizado correctamente' : 'Cuaderno creado correctamente', 'success')
      onSaved?.(saved)
      onClose()
    } catch (error) {
      const message = error instanceof Error && error.message.includes('Ya existe')
        ? 'Ya existe un cuaderno con este nombre en esta ubicación'
        : (error instanceof Error ? error.message : 'No se pudo guardar el cuaderno')
      showNotification(message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return createPortal(
    <div className="notas-modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="nuevo-cuaderno-titulo" className="notas-modal" role="dialog">
        <button aria-label="Cerrar modal" className="notas-modal-close" onClick={onClose} type="button"><X size={20} /></button>
        <h2 id="nuevo-cuaderno-titulo">{isEditing ? 'Editar cuaderno' : 'Nuevo cuaderno'}</h2>

        <div className="notas-modal-field">
          <label htmlFor="cuaderno-nombre">Nombre</label>
          <input autoFocus id="cuaderno-nombre" onChange={(event) => setName(event.target.value)} value={name} />
        </div>

        <div className="notas-modal-field">
          <label htmlFor="cuaderno-padre">Cuaderno padre</label>
          <select id="cuaderno-padre" onChange={(event) => setParentNotebookIdValue(event.target.value === '' ? null : Number(event.target.value))} value={parentNotebookIdValue ?? ''}>
            <option value="">Raíz</option>
            {parentOptions.map((entry) => (
              <option key={entry.id} value={entry.id}>{entry.name}</option>
            ))}
          </select>
        </div>

        <div className="notas-modal-field">
          <label>Portada / icono</label>
          <div className="notas-modal-icon-grid" aria-label="Portada del cuaderno">
            {coverOptions.map((option) => {
              const IconComponent = 'icon' in option && option.icon ? option.icon : Folder
              const previewUrl = option.type === 'custom' && option.src ? resolvePreviewUrl(option.src) : undefined
              return (
                <button
                  className={selectedIcon === option.value ? 'is-selected' : ''}
                  key={option.value}
                  onClick={() => setSelectedIcon(option.value)}
                  type="button"
                >
                  <span className="notas-modal-cover-preview">
                    {option.type === 'custom' && previewUrl ? <img alt={option.label} src={previewUrl} /> : <IconComponent size={18} />}
                  </span>
                  <span className="notas-modal-cover-label">{option.label}</span>
                  {selectedIcon === option.value ? <span className="notas-modal-cover-check"><Check size={12} /></span> : null}
                </button>
              )
            })}
            <button className="notas-modal-cover-add" onClick={() => void handleAddLocalCover()} type="button" title="Añadir portada local">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <label className="notas-modal-switch" htmlFor="cuaderno-bloqueado">
          <span>Bloquear con contraseña</span>
          <input checked={isLocked} id="cuaderno-bloqueado" onChange={(event) => setIsLocked(event.target.checked)} type="checkbox" />
          <span className="notas-modal-switch-slider" />
        </label>

        {isLocked ? (
          <div className="notas-modal-field">
            <label htmlFor="cuaderno-password">Contraseña</label>
            <input id="cuaderno-password" onChange={(event) => setPassword(event.target.value)} placeholder="Ingresa una contraseña" type="password" value={password} />
          </div>
        ) : null}

        <div className="notas-modal-actions">
          <button onClick={onClose} type="button">Cancelar</button>
          <button disabled={!canSubmit} onClick={() => void handleSave()} type="button">{isSaving ? 'Guardando...' : 'Crear'}</button>
        </div>
      </section>
    </div>,
    root,
  )
}
