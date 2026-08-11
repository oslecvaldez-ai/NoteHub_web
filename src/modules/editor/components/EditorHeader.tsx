import { Check, Maximize2, Save, Settings2, Sparkles, Pin } from 'lucide-react'
import { type TiptapEditorHandle } from './TiptapEditor'

export interface EditorHeaderProps {
  onSave: () => void
  onClose: () => void
  onPin: () => void
  onQuickAccess: () => void
  onOptions: () => void
  onToggleFocusMode: () => void
  editor?: TiptapEditorHandle | null
}

export function EditorHeader({
  onSave,
  onClose,
  onPin,
  onQuickAccess,
  onOptions,
  onToggleFocusMode,
}: EditorHeaderProps) {
  return (
    <header className="editor-header flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-950 dark:shadow-none">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          onClick={onSave}
          aria-label="Guardar"
          title="Guardar"
        >
          <Save className="h-4 w-4" />
          Guardar
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          onClick={onClose}
          aria-label="Hecho"
          title="Hecho"
        >
          <Check className="h-4 w-4" />
          Hecho
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          onClick={onPin}
          aria-label="Fijar"
          title="Fijar"
        >
          <Pin className="h-4 w-4" />
          Fijar
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          onClick={onQuickAccess}
          aria-label="Acceso rápido"
          title="Acceso rápido"
        >
          <Sparkles className="h-4 w-4" />
          Acceso rápido
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          onClick={onOptions}
          aria-label="Opciones"
          title="Opciones"
        >
          <Settings2 className="h-4 w-4" />
          Opciones
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          onClick={onToggleFocusMode}
          aria-label="Modo foco"
          title="Modo foco"
        >
          <Maximize2 className="h-4 w-4" />
          Modo foco
        </button>
      </div>
    </header>
  )
}
