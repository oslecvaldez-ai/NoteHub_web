import React, { useState } from "react";
import { BookOpen, RotateCcw, Trash2 } from "lucide-react";

export interface NotaPapelera {
  id: number;
  title: string;
  content: string;
  updated_at: string;
  notebookName?: string | null;
  workspace_id: number;
}

interface ItemPapeleraProps {
  nota: NotaPapelera;
  onRestore: (noteId: number) => void;
  onDeletePermanent: (nota: NotaPapelera) => void;
}

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
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

export const ItemPapelera: React.FC<ItemPapeleraProps> = ({
  nota,
  onRestore,
  onDeletePermanent,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const extracto = stripHtml(nota.content).slice(0, 75);

  const handleContextMenu = (event: React.MouseEvent): void => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 text-slate-900 shadow-sm transition hover:border-red-200 hover:bg-red-50/20 dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:border-red-950 dark:hover:bg-red-950/10 border-l-4 border-l-red-500"
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
              {nota.title || "Sin título"}
            </h4>
            <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
              {formatDate(nota.updated_at)}
            </span>
          </div>

          <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
            {extracto || "Sin contenido"}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
          {nota.notebookName ? (
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <BookOpen className="h-3 w-3" />
              <span className="max-w-[120px] truncate">
                {nota.notebookName}
              </span>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onRestore(nota.id)}
              className="flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
              title="Restaurar nota"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restaurar</span>
            </button>
            <button
              type="button"
              onClick={() => onDeletePermanent(nota)}
              className="flex items-center gap-1 rounded-xl bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/50"
              title="Eliminar permanentemente"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Eliminar</span>
            </button>
          </div>
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
            className="fixed z-50 w-48 rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95"
          >
            <button
              type="button"
              onClick={() => {
                onRestore(nota.id);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-200 dark:hover:bg-emerald-950/40"
            >
              <RotateCcw className="h-4 w-4 text-emerald-500" />
              <span>Restaurar nota</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onDeletePermanent(nota);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              <span>Eliminar permanentemente</span>
            </button>
          </div>
        </>
      )}
    </>
  );
};
