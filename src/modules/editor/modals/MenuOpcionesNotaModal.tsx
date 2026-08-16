import type { MouseEvent } from "react";
import {
  Copy,
  Eraser,
  FileDown,
  FolderInput,
  FolderPlus,
  Pin,
  PinOff,
  Search,
  SlidersHorizontal,
  Tag,
  X,
  Maximize2,
  LayoutTemplate,
  Trash2,
} from "lucide-react";

export interface MenuOpcionesNotaModalProps {
  onClose: () => void;
  onTogglePin: () => Promise<void> | void;
  onDuplicate: () => Promise<void> | void;
  onOpenExport: () => void;
  onOpenSearch: () => void;
  onToggleFocusMode: () => void;
  onClearFormat: () => void;
  onMoveWorkspace: () => Promise<void> | void;
  onMoveNotebook: () => Promise<void> | void;
  onManageTags: () => Promise<void> | void;
  onCopyToTemplates?: () => void | Promise<void>;
  onDeleteNote?: () => void | Promise<void>;
  isPinned?: boolean;
}

export function MenuOpcionesNotaModal({
  onClose,
  onTogglePin,
  onDuplicate,
  onOpenExport,
  onOpenSearch,
  onToggleFocusMode,
  onClearFormat,
  onMoveWorkspace,
  onMoveNotebook,
  onManageTags,
  onCopyToTemplates,
  onDeleteNote,
  isPinned = false,
}: MenuOpcionesNotaModalProps) {
  const pinLabel = isPinned
    ? "Desfijar de Acceso Rápido"
    : "Fijar en Acceso Rápido";
  const pinButtonClass = isPinned
    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-200 text-purple-700 transition group-hover:scale-105 dark:bg-purple-800/80 dark:text-purple-200"
    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition group-hover:scale-105 dark:bg-purple-900/50 dark:text-purple-300";

  const stopPropagation = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Cerrar menú de opciones"
      />

      <div
        className="relative z-10 flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-950"
        onClick={stopPropagation}
      >
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Opciones de nota
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Acciones rápidas para la nota actual
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex max-h-[380px] flex-1 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
          <div className="w-full space-y-2">
            <button
              type="button"
              onClick={() => {
                void onTogglePin();
                onClose();
              }}
              className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/60"
            >
              <div className={pinButtonClass}>
                {isPinned ? (
                  <PinOff className="h-4 w-4" />
                ) : (
                  <Pin className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {pinLabel}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                void onDuplicate();
                onClose();
              }}
              className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:scale-105 dark:bg-blue-900/50 dark:text-blue-300">
                <Copy className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Duplicar nota
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenSearch();
                onClose();
              }}
              className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:scale-105 dark:bg-blue-900/50 dark:text-blue-300">
                <Search className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Buscar en esta nota
                </p>
                <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                  Encontrar y resaltar texto dentro del documento (Ctrl + F)
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleFocusMode();
                onClose();
              }}
              className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition group-hover:scale-105 dark:bg-purple-900/50 dark:text-purple-300">
                <Maximize2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Modo Lectura / Foco
                </p>
                <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                  Ocultar paneles laterales para concentrarse (F11)
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onClearFormat();
                onClose();
              }}
              className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-600 transition group-hover:scale-105 dark:bg-slate-800 dark:text-slate-300">
                <Eraser className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Limpiar Formato
                </p>
                <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                  Eliminar estilos, colores y fuentes del texto seleccionado
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                void onMoveWorkspace();
                onClose();
              }}
              className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:scale-105 dark:bg-blue-900/50 dark:text-blue-300">
                <FolderInput className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Mover a otro espacio
                </p>
                <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                  Reasignar nota a otro espacio de trabajo
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                void onMoveNotebook();
                onClose();
              }}
              className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition group-hover:scale-105 dark:bg-amber-900/50 dark:text-amber-300">
                <FolderPlus className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Añadir a Cuadernos
                </p>
                <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                  Asignar a un cuaderno o subcuaderno
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                void onManageTags();
                onClose();
              }}
              className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition group-hover:scale-105 dark:bg-emerald-900/50 dark:text-emerald-300">
                <Tag className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Gestionar Etiquetas
                </p>
                <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                  Asociar o crear tags (#) para la nota
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onCopyToTemplates?.();
                onClose();
              }}
              className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition group-hover:scale-105 dark:bg-indigo-900/50 dark:text-indigo-300">
                <LayoutTemplate className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Copiar a Plantillas
                </p>
                <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                  Guardar estructura y contenido como plantilla reutilizable
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onDeleteNote?.();
                onClose();
              }}
              className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:border-red-200 hover:bg-red-50/40 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-red-900/50 dark:hover:bg-red-950/20"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100/80 text-red-600 transition group-hover:scale-105 dark:bg-red-950/60 dark:text-red-400">
                <Trash2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Eliminar nota
                </p>
                <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                  Mover esta nota a la papelera
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenExport();
                onClose();
              }}
              className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition group-hover:scale-105 dark:bg-emerald-900/50 dark:text-emerald-300">
                <FileDown className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Exportar / Importar nota
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
