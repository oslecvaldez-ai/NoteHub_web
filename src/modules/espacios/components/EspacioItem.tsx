import type { ReactElement } from "react";
import * as Icons from "../../../core/components/Iconos";
import { Check, Settings, Layers } from "../../../core/components/Iconos";
import { useTheme } from "../../../core/theme/useTheme";
import type { Workspace } from "../workspacesApi";

export interface EspacioItemProps {
  workspace: Workspace;
  isActive: boolean;
  noteCount?: number;
  onSelect: (workspace: Workspace) => void;
  onEdit: (workspace: Workspace) => void;
}

export function EspacioItem({
  workspace,
  isActive,
  noteCount = 0,
  onSelect,
  onEdit,
}: EspacioItemProps): ReactElement {
  const { accentColor } = useTheme();

  // Obtener el icono dinámico o usar Layers por defecto
  const IconComponent =
    (workspace.icon && (Icons as Record<string, any>)[workspace.icon]) ||
    Layers;

  return (
    <div
      onClick={() => onSelect(workspace)}
      title={workspace.name} // Tooltip al pasar el mouse por todo el item
      className={`group relative flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer transition-all duration-150 ${
        isActive
          ? "bg-slate-100/90 dark:bg-slate-800/80 font-medium text-slate-900 dark:text-slate-100"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Contenedor del Icono */}
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
            isActive
              ? "bg-white shadow-sm dark:bg-slate-700"
              : "bg-slate-100/70 group-hover:bg-white dark:bg-slate-800 dark:group-hover:bg-slate-700"
          }`}
          style={{ color: isActive ? accentColor : undefined }}
        >
          <IconComponent size={16} />
        </div>

        {/* Textos del Espacio */}
        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
          {/* Fila 1: Nombre con ancho completo para evitar truncado prematuro */}
          <span
            className="truncate text-xs font-semibold leading-tight text-slate-800 dark:text-slate-100"
            title={workspace.name}
          >
            {workspace.name}
          </span>

          {/* Fila 2: Contador de notas y badge "Por defecto" juntos */}
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400 dark:text-slate-500 font-normal">
            <span>
              {noteCount} {noteCount === 1 ? "nota" : "notas"}
            </span>
            {workspace.is_default === 1 && (
              <>
                <span>•</span>
                <span className="font-medium text-amber-600/90 dark:text-amber-400/90 text-[10px]">
                  Por defecto
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Botones de acción / Check */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(workspace);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-all"
          title="Editar o eliminar este espacio"
        >
          <Settings size={14} />
        </button>

        {isActive && (
          <Check
            size={15}
            className="shrink-0"
            style={{ color: accentColor }}
          />
        )}
      </div>
    </div>
  );
}
