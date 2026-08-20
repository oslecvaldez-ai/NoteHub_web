import {
  BookOpen,
  ExternalLink,
  Maximize2,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Pin,
  Star,
} from "lucide-react";
import { type TiptapEditorHandle } from "./TiptapEditor";
import { useTheme } from "../../../core/theme/useTheme";

export interface EditorHeaderProps {
  title: string;
  onPin: () => void;
  onStar: () => void;
  onShare: () => void;
  onHistory: () => void;
  onExternal: () => void;
  onMenu: () => void;
  onToggleFocusMode: () => void;
  onToggleNoteList?: () => void;
  isNoteListCollapsed?: boolean;
  isPinned?: boolean;
  isQuickAccess?: boolean;
  editor?: TiptapEditorHandle | null;
}

export function EditorHeader({
  title,
  onPin,
  onStar,
  onExternal,
  onMenu,
  onToggleFocusMode,
  onToggleNoteList,
  isNoteListCollapsed = false,
  isPinned = false,
  isQuickAccess = false,
}: EditorHeaderProps) {
  const { accentColor } = useTheme();
  const pinTitle = isPinned ? "Desfijar nota" : "Fijar nota";
  const quickAccessTitle = isQuickAccess
    ? "Quitar de Acceso rápido"
    : "Añadir a Acceso rápido";

  return (
    <div className="mx-4 mt-3 mb-1 px-4 py-2.5 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/90">
      {/* Left: metadata */}
      <div className="flex items-center gap-3">
        {onToggleNoteList && (
          <button
            type="button"
            onClick={onToggleNoteList}
            title={
              isNoteListCollapsed
                ? "Mostrar lista de notas"
                : "Ocultar lista de notas"
            }
            style={{ color: accentColor }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/80 dark:hover:bg-slate-800/80"
          >
            {isNoteListCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        )}

        <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
          <BookOpen className="h-4 w-4 text-slate-700 dark:text-slate-200" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
            {title || "Cuaderno"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-xs text-slate-600 dark:text-slate-300">
            Guardado local
          </span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPin}
          title={pinTitle}
          style={{
            color: isPinned ? "#fff" : accentColor,
            backgroundColor: isPinned ? accentColor : undefined,
            borderColor: isPinned ? accentColor : accentColor,
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/80 dark:hover:bg-slate-800/80"
        >
          <Pin
            className="h-4 w-4"
            style={{ fill: isPinned ? "currentColor" : "none" }}
          />
        </button>
        <button
          type="button"
          onClick={onStar}
          title={quickAccessTitle}
          style={{
            color: isQuickAccess ? "#fff" : accentColor,
            backgroundColor: isQuickAccess ? accentColor : undefined,
            borderColor: isQuickAccess ? accentColor : accentColor,
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/80 dark:hover:bg-slate-800/80"
        >
          <Star
            className="h-4 w-4"
            style={{ fill: isQuickAccess ? "currentColor" : "none" }}
          />
        </button>
        <button
          type="button"
          onClick={onMenu}
          title="Más opciones"
          style={{ color: accentColor }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/80 dark:hover:bg-slate-800/80"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onExternal}
          title="Exportar"
          style={{ color: accentColor }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/80 dark:hover:bg-slate-800/80"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onToggleFocusMode}
          title="Modo foco"
          style={{ color: accentColor, borderColor: accentColor }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border bg-white transition hover:bg-slate-50 dark:bg-slate-900/80 dark:hover:bg-slate-800/80"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
