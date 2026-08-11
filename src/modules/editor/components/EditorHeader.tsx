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
  editor?: TiptapEditorHandle | null;
}

export function EditorHeader({
  title,
  onPin,
  onStar,
  onShare,
  onHistory,
  onExternal,
  onMenu,
  onToggleFocusMode,
}: EditorHeaderProps) {
  return (
    <header className="editor-header flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-950 dark:shadow-none">
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Editor
          </p>
          <h1 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100"></h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onPin}
            aria-label="Pin"
            title="Pin"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Pin className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onStar}
            aria-label="Favorito"
            title="Favorito"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Star className="h-4 w-4" />
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
