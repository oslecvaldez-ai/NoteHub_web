import { useState, type ReactElement } from "react";
import { Check, Layers } from "../../../core/components/Iconos";
import type { Workspace } from "../workspacesApi";

export interface EspacioItemProps {
  workspace: Workspace;
  isActive: boolean;
  onSelect: (workspace: Workspace) => void;
}

export function EspacioItem({
  workspace,
  isActive,
  onSelect,
}: EspacioItemProps): ReactElement {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      aria-current={isActive ? "true" : undefined}
      className={`espacio-item flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${isActive ? "bg-purple-50 font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"}`}
      onClick={() => onSelect(workspace)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background:
          isActive || isHovered
            ? "color-mix(in srgb, var(--color-primary, #0077D6) 12%, transparent)"
            : "transparent",
      }}
      type="button"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <Layers aria-hidden="true" size={18} />
        <span className="espacio-item-name truncate">{workspace.name}</span>
      </div>
      {workspace.is_default === 1 && (
        <span className="espacio-item-badge text-[10px] font-medium text-slate-400 dark:text-slate-500">
          Por defecto
        </span>
      )}
      {isActive && <Check aria-label="Espacio activo" size={18} />}
    </button>
  );
}
