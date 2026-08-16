import {
  Clock,
  ExternalLink,
  Maximize2,
  MoreHorizontal,
  Pin,
  Share2,
  Star,
} from "lucide-react";
import { type TiptapEditorHandle } from "./TiptapEditor";

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
  onPin,
  onStar,
  onShare,
  onHistory,
  onExternal,
  onMenu,
  onToggleFocusMode,
  isPinned = false,
  isQuickAccess = false,
}: EditorHeaderProps) {
  const pinTitle = isPinned ? "Desfijar nota" : "Fijar nota";
  const pinButtonClass = isPinned
    ? "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-purple-500 bg-purple-100 text-purple-700 transition hover:bg-purple-200 dark:border-purple-600 dark:bg-purple-950/70 dark:text-purple-300 dark:hover:bg-purple-900/70"
    : "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";
  const quickAccessTitle = isQuickAccess
    ? "Quitar de Acceso rápido"
    : "Añadir a Acceso rápido";
  const quickAccessButtonClass = isQuickAccess
    ? "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-400 bg-amber-100 text-amber-600 transition hover:bg-amber-200 dark:border-amber-500 dark:bg-amber-950/70 dark:text-amber-300 dark:hover:bg-amber-900/70"
    : "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";

  return (
    <header className="editor-header flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-950 dark:shadow-none">
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Editor
          </p>
          {/* <h1 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h1> */}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onPin}
            aria-label={pinTitle}
            title={pinTitle}
            className={pinButtonClass}
          >
            <Pin className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onStar}
            aria-label={quickAccessTitle}
            title={quickAccessTitle}
            className={quickAccessButtonClass}
          >
            <Star
              className={`h-4 w-4 ${isQuickAccess ? "fill-current" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={onShare}
            aria-label="Compartir"
            title="Compartir"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onHistory}
            aria-label="Historial"
            title="Historial"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Clock className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onExternal}
            aria-label="Abrir externamente"
            title="Abrir externamente"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onMenu}
            aria-label="Más opciones"
            title="Más opciones"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggleFocusMode}
        aria-label="Pantalla completa"
        title="Pantalla completa"
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </header>
  );
}
