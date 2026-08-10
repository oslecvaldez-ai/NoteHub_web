import { useState, type ReactElement } from 'react'
import { Check, Layers } from '../../../core/components/Iconos'
import type { Workspace } from '../workspacesApi'

export interface EspacioItemProps {
  workspace: Workspace
  isActive: boolean
  onSelect: (workspace: Workspace) => void
}

export function EspacioItem({ workspace, isActive, onSelect }: EspacioItemProps): ReactElement {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      aria-current={isActive ? 'true' : undefined}
      className="espacio-item"
      onClick={() => onSelect(workspace)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ background: isActive || isHovered ? 'color-mix(in srgb, var(--color-primary, #0077D6) 12%, transparent)' : 'transparent' }}
      type="button"
    >
      <Layers aria-hidden="true" size={18} />
      <span className="espacio-item-name">{workspace.name}</span>
      {workspace.is_default === 1 && <span className="espacio-item-badge">Por defecto</span>}
      {isActive && <Check aria-label="Espacio activo" size={18} />}
    </button>
  )
}
