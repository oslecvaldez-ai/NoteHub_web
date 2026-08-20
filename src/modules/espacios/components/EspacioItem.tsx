import { useState, type ReactElement } from "react";
import { Check, Layers, Settings } from "../../../core/components/Iconos";
import { useTheme } from "../../../core/theme/useTheme";
import type { Workspace } from "../workspacesApi";

export interface EspacioItemProps {
  workspace: Workspace;
  isActive: boolean;
  onSelect: (workspace: Workspace) => void;
  onEdit?: () => void;
  noteCount?: number;
}

export function EspacioItem({
  workspace,
  isActive,
  onSelect,
  onEdit,
  noteCount = 0,
}: EspacioItemProps): ReactElement {
  const [isHovered, setIsHovered] = useState(false);
  const { accentColor } = useTheme();

  return (
    <div
      className={`group flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm transition ${isActive ? "font-semibold" : "text-slate-700 dark:text-slate-300"}`}
      onClick={() => onSelect(workspace)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isActive || isHovered ? `${accentColor}12` : "transparent",
      }}
    >
      <button
        type="button"
        aria-current={isActive ? "true" : undefined}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        onClick={() => onSelect(workspace)}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          <Layers aria-hidden="true" size={17} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="espacio-item-name truncate">{workspace.name}</span>
          <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
            {noteCount} {noteCount === 1 ? "nota" : "notas"}
          </span>
        </span>
      </button>
      <div className="flex items-center gap-1">
        {workspace.is_default === 1 && (
          <span className="espacio-item-badge text-[10px] font-medium text-slate-400 dark:text-slate-500">
            Por defecto
          </span>
        )}
        {isActive && (
          <Check
            aria-label="Espacio activo"
            size={17}
            style={{ color: accentColor }}
          />
        )}
        {onEdit && (
          <button
            type="button"
            aria-label={`Editar espacio ${workspace.name}`}
            title="Editar espacio"
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Settings size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
