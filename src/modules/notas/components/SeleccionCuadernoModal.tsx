import {
  BookMarked,
  Check,
  ChevronDown,
  ChevronRight,
  Folder,
  X,
} from "lucide-react";
import { useState, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../../core/theme/useTheme";
import type { Notebook } from "../notesApi";

export interface SeleccionCuadernoModalProps {
  isOpen: boolean;
  notebooks: Notebook[];
  currentNotebookId: number | null;
  onClose: () => void;
  onSelect: (notebookId: number | null) => void;
}

function getModalRoot(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  let root = document.getElementById("modal-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "modal-root";
    document.body.appendChild(root);
  }
  return root;
}

export function SeleccionCuadernoModal({
  isOpen,
  notebooks,
  currentNotebookId,
  onClose,
  onSelect,
}: SeleccionCuadernoModalProps): ReactElement | null {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const { accentColor } = useTheme();
  if (!isOpen) return null;

  const root = getModalRoot();
  if (!root) return null;

  const childrenOf = (parentId: number | null) =>
    notebooks.filter((notebook) => notebook.parent_notebook_id === parentId);

  function renderTree(parentId: number | null, depth = 0): ReactElement[] {
    return childrenOf(parentId).flatMap((notebook) => {
      const children = childrenOf(notebook.id);
      const isExpanded = expanded.has(notebook.id);
      const isSelected = currentNotebookId === notebook.id;

      return [
        <div key={notebook.id} className="w-full">
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            {children.length > 0 ? (
              <button
                type="button"
                aria-label={isExpanded ? "Contraer" : "Expandir"}
                onClick={() =>
                  setExpanded((current) => {
                    const next = new Set(current);
                    if (isExpanded) next.delete(notebook.id);
                    else next.add(notebook.id);
                    return next;
                  })
                }
                className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            ) : (
              <span className="h-6 w-6" />
            )}

            <button
              type="button"
              onClick={() => onSelect(notebook.id)}
              className="group flex w-full items-center justify-between rounded-2xl border p-3 text-left transition border-slate-200/70 bg-slate-50/50 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/60"
              style={
                isSelected
                  ? {
                      borderColor: accentColor,
                      backgroundColor: `${accentColor}12`,
                    }
                  : undefined
              }
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                  <Folder className="h-4 w-4" />
                </span>
                <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                  {notebook.name}
                </span>
              </span>

              {isSelected && (
                <Check className="h-4 w-4" style={{ color: accentColor }} />
              )}
            </button>
          </div>
        </div>,
        ...(isExpanded ? renderTree(notebook.id, depth + 1) : []),
      ];
    });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Mover a un cuaderno
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Selecciona el cuaderno destino para esta nota
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="group flex w-full items-center justify-between rounded-2xl border p-3 text-left transition border-slate-200/70 bg-slate-50/50 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/60"
            style={
              currentNotebookId === null
                ? {
                    borderColor: accentColor,
                    backgroundColor: `${accentColor}12`,
                  }
                : undefined
            }
          >
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Folder className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Sin cuaderno
              </span>
            </span>

            {currentNotebookId === null && (
              <Check className="h-4 w-4" style={{ color: accentColor }} />
            )}
          </button>

          {renderTree(null)}
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    root,
  );
}
