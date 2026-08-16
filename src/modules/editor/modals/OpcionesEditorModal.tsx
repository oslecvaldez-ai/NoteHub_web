import { type MouseEventHandler } from "react";
import {
  FileText,
  FileType,
  Code2,
  Package,
  UploadCloud,
  FileDown,
  X,
  Sparkles,
} from "lucide-react";

export interface OpcionesEditorModalProps {
  onClose: () => void;
  onExportToPDF: () => Promise<void>;
  onExportToTXT: () => Promise<void>;
  onExportToMD: () => Promise<void>;
  onExportToHTML: () => Promise<void>;
  onExportToNoteHub: () => Promise<void>;
  onImportNoteHub: () => Promise<void>;
  isProcessing: boolean;
}

export function OpcionesEditorModal({
  onClose,
  onExportToPDF,
  onExportToTXT,
  onExportToMD,
  onExportToHTML,
  onExportToNoteHub,
  onImportNoteHub,
  isProcessing,
}: OpcionesEditorModalProps) {
  const stopPropagation: MouseEventHandler<HTMLDivElement> = (event) =>
    event.stopPropagation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-950"
        onClick={stopPropagation}
      >
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Opciones de Nota
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Exporta tu contenido o restaura un respaldo
              </p>
            </div>
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Exportar Nota
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={isProcessing}
                onClick={onExportToPDF}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:border-red-200 hover:bg-red-50/40 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-red-900/50 dark:hover:bg-red-950/20"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100/80 text-red-600 transition group-hover:scale-105 dark:bg-red-950/60 dark:text-red-400">
                  <FileDown className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    PDF
                  </p>
                  <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                    Documento para imprimir
                  </p>
                </div>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={onExportToNoteHub}
                className="group flex items-center gap-3 rounded-2xl border border-purple-200/80 bg-purple-50/30 p-3 text-left transition hover:border-purple-300 hover:bg-purple-50/70 disabled:cursor-not-allowed disabled:opacity-60 dark:border-purple-900/40 dark:bg-purple-950/20 dark:hover:border-purple-700/60 dark:hover:bg-purple-950/40"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition group-hover:scale-105 dark:bg-purple-900/50 dark:text-purple-300">
                  <Package className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-purple-900 dark:text-purple-200">
                    .NoteHub
                  </p>
                  <p className="truncate text-[11px] text-purple-600/70 dark:text-purple-400/70">
                    Formato editable completo
                  </p>
                </div>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={onExportToMD}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/40 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-blue-900/50 dark:hover:bg-blue-950/20"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100/80 text-blue-600 transition group-hover:scale-105 dark:bg-blue-950/60 dark:text-blue-400">
                  <FileType className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Markdown
                  </p>
                  <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                    Texto enriquecido .md
                  </p>
                </div>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={onExportToHTML}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/40 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-emerald-900/50 dark:hover:bg-emerald-950/20"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-600 transition group-hover:scale-105 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Code2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    HTML
                  </p>
                  <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                    Página web estática
                  </p>
                </div>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={onExportToTXT}
                className="group col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3 text-left transition hover:border-slate-300 hover:bg-slate-100/60 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:hover:bg-slate-900"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-600 transition group-hover:scale-105 dark:bg-slate-800 dark:text-slate-300">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Texto Plano (.txt)
                  </p>
                  <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                    Sin formato ni estilos
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 dark:border-slate-800/80">
            <span className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Importación
            </span>

            <button
              type="button"
              disabled={isProcessing}
              onClick={onImportNoteHub}
              className="group flex w-full items-center justify-between rounded-2xl border border-dashed border-purple-300 bg-purple-50/20 p-3.5 text-left transition hover:border-purple-500 hover:bg-purple-50/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-purple-800/60 dark:bg-purple-950/10 dark:hover:border-purple-600 dark:hover:bg-purple-950/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500 text-white shadow-md shadow-purple-500/20 transition group-hover:scale-105">
                  <UploadCloud className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-purple-950 dark:text-purple-100">
                    Importar archivo .NoteHub
                  </p>
                  <p className="text-[11px] text-purple-700/70 dark:text-purple-300/70">
                    Carga el contenido y sustituye la nota actual
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-purple-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-900/60 dark:text-purple-200">
                Cargar
              </span>
            </button>
          </div>
        </div>

        {isProcessing && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-purple-50 py-2 text-xs font-medium text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
            Procesando archivo...
          </div>
        )}
      </div>
    </div>
  );
}
