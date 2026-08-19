import {
  ExternalLink,
  Maximize2,
  MoreHorizontal,
  Pin,
  Star,
  BookOpen,
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
          className="rounded-xl h-8 w-8 inline-flex items-center justify-center border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/80 dark:text-slate-200"
        >
          <Pin
            className="h-4 w-4"
            style={
              isPinned ? { color: accentColor, fill: accentColor } : undefined
            }
          />
        </button>
        <button
          type="button"
          onClick={onStar}
          title={quickAccessTitle}
          className="rounded-xl h-8 w-8 inline-flex items-center justify-center border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/80 dark:text-slate-200"
        >
          <Star
            className="h-4 w-4"
            style={
              isQuickAccess
                ? { color: accentColor, fill: accentColor }
                : undefined
            }
          />
        </button>
        <button
          type="button"
          onClick={onMenu}
          title="Más opciones"
          className="rounded-xl h-8 w-8 inline-flex items-center justify-center border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/80 dark:text-slate-200"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onExternal}
          title="Exportar"
          className="rounded-xl h-8 w-8 inline-flex items-center justify-center border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/80 dark:text-slate-200"
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
