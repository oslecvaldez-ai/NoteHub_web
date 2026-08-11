import { type MouseEventHandler } from 'react'

interface OpcionesEditorModalProps {
  onClose: () => void
  onExportToPDF: () => Promise<void>
  onExportToTXT: () => Promise<void>
  onExportToMD: () => Promise<void>
  onExportToHTML: () => Promise<void>
  onExportToNoteHub: () => Promise<void>
  onImportNoteHub: () => Promise<void>
  isProcessing: boolean
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
  const stopPropagation: MouseEventHandler<HTMLDivElement> = (event) => event.stopPropagation()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-950"
        onClick={stopPropagation}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Opciones de nota</h2>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="grid gap-3">
          <button type="button" className="btn-primary w-full" onClick={onExportToPDF} disabled={isProcessing}>
            Exportar a PDF
          </button>
          <button type="button" className="btn-primary w-full" onClick={onExportToTXT} disabled={isProcessing}>
            Exportar a TXT
          </button>
          <button type="button" className="btn-primary w-full" onClick={onExportToMD} disabled={isProcessing}>
            Exportar a MD
          </button>
          <button type="button" className="btn-primary w-full" onClick={onExportToHTML} disabled={isProcessing}>
            Exportar a HTML
          </button>
          <button type="button" className="btn-primary w-full" onClick={onExportToNoteHub} disabled={isProcessing}>
            Exportar a NoteHub
          </button>
          <button type="button" className="btn-secondary w-full" onClick={onImportNoteHub} disabled={isProcessing}>
            Importar .notehub
          </button>
        </div>
      </div>
    </div>
  )
}
