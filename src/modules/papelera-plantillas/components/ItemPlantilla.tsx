import { useState, type ReactElement } from "react";
import { ChevronRight, Edit2, LayoutTemplate, Trash2 } from "lucide-react";
import { ConfirmacionEliminacionModal } from "../../../core/components/ConfirmacionEliminacionModal";
import { useTheme } from "../../../core/theme/useTheme";

export interface Plantilla {
  id: number;
  name: string;
  content: string;
  created_at: string;
  workspace_id: number;
}

interface ItemPlantillaProps {
  plantilla: Plantilla;
  isSelected?: boolean;
  onSelect: (plantilla: Plantilla) => void;
  onEdit: (plantilla: Plantilla) => void;
  onDelete: (plantillaId: number) => void;
}

function formatDate(value: string): string {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;

  return new Date(parsed).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ItemPlantilla({
  plantilla,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
}: ItemPlantillaProps): ReactElement {
  const { accentColor } = useTheme();
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleContextMenu = (event: React.MouseEvent): void => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  return (
    <>
      <div
        onClick={() => onSelect(plantilla)}
        onContextMenu={handleContextMenu}
        onMouseEnter={(event) => {
          event.currentTarget.style.borderColor = accentColor;
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.borderColor = isSelected ? accentColor : "";
        }}
        style={
          {
            "--accent-color": accentColor,
            borderColor: isSelected ? accentColor : undefined,
            boxShadow: isSelected ? `0 0 0 1px ${accentColor}` : undefined,
          } as React.CSSProperties
        }
        className="group relative flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5 transition hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900/80"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition"
          >
            <LayoutTemplate className="h-5 w-5" color={accentColor} />
          </div>
          <div className="min-w-0 flex-1">
            <h4
              className="truncate text-sm font-bold text-slate-800 transition-colors dark:text-slate-100"
              style={{ color: isSelected ? accentColor : undefined }}
            >
              {plantilla.name}
            </h4>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              {formatDate(plantilla.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(plantilla);
            }}
            style={{ color: accentColor }}
            className="flex h-7 w-7 items-center justify-center rounded-lg opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Editar plantilla"
          >
            <Edit2 className="h-3.5 w-3.5" color={accentColor} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setShowConfirmDelete(true);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
            title="Eliminar plantilla"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <ChevronRight
            className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[var(--accent-color)] dark:text-slate-700"
            style={{ color: isSelected ? accentColor : undefined }}
          />
        </div>
      </div>

      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setContextMenu(null)}
          />
          <div
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed z-50 w-44 rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95"
          >
            <button
              type="button"
              onClick={() => {
                onEdit(plantilla);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-purple-50 hover:text-purple-600 dark:text-slate-200 dark:hover:bg-purple-950/40"
            >
              <Edit2 className="h-4 w-4 text-purple-500" />
              <span>Editar plantilla</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setContextMenu(null);
                setShowConfirmDelete(true);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              <span>Eliminar</span>
            </button>
          </div>
        </>
      )}

      <ConfirmacionEliminacionModal
        isOpen={showConfirmDelete}
        title="Eliminar plantilla"
        message={`¿Deseas eliminar la plantilla \"${plantilla.name}\"? Esta acción no se puede deshacer.`}
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={() => {
          setShowConfirmDelete(false);
          onDelete(plantilla.id);
        }}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />
    </>
  );
}
