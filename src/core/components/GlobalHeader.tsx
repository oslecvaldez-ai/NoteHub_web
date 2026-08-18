import { type ChangeEvent, type ReactElement } from "react";
import {
  Copy,
  Lock,
  Save,
  Search,
  Settings,
  PanelLeft,
  PencilLine,
} from "lucide-react";

interface GlobalHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onCreateNote: () => void;
  onSaveNote?: () => void;
  onReload: () => void;
  onToggleSidebar?: () => void;
}

export function GlobalHeader({
  searchQuery,
  onSearch,
  onCreateNote,
  onSaveNote,
  onReload,
  onToggleSidebar,
}: GlobalHeaderProps): ReactElement {
  return (
    <header className="flex h-14 w-full items-center justify-between gap-4 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/70 px-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
          className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-2">
        <div className="flex w-full max-w-2xl items-center gap-3 rounded-full bg-gray-100 px-4 py-2 text-slate-500 shadow-sm">
          <Search size={18} />
          <input
            value={searchQuery}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onSearch(event.target.value)
            }
            placeholder="Buscar"
            className="w-full bg-transparent border-0 text-sm text-slate-900 outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCreateNote}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-sm transition flex items-center gap-2 px-3.5 py-1.5 rounded-2xl"
        >
          <PencilLine className="h-4 w-4" />
          <span>Nueva Nota</span>
        </button>
        <button
          type="button"
          aria-label="Guardar nota"
          title="Guardar cambios"
          onClick={onSaveNote}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-emerald-100 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          <Save size={18} />
        </button>
        <button
          type="button"
          aria-label="Bloquear"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        >
          <Lock size={18} />
        </button>
        <button
          type="button"
          aria-label="Duplicar"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        >
          <Copy size={18} />
        </button>
        <button
          type="button"
          aria-label="Ajustes"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
