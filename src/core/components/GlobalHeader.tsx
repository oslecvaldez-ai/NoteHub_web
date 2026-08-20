import {
  type ChangeEvent,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { Save, Search, Settings, PanelLeft, FileText } from "lucide-react";
import { useTheme } from "../theme/useTheme";

interface GlobalHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onCreateNote: () => void;
  onSaveNote?: () => void;
  onReload?: () => void;
  onToggleSidebar?: () => void;
  onSettings?: () => void;
}

export function GlobalHeader({
  searchQuery,
  onSearch,
  onCreateNote,
  onSaveNote,
  onToggleSidebar,
  onSettings,
}: GlobalHeaderProps): ReactElement {
  const { accentColor } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node) && !searchQuery) {
        setSearchOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !searchQuery) setSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [searchQuery]);
  return (
    <header className="flex h-14 w-full items-center justify-between gap-4 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-md transition-colors duration-200 dark:border-slate-800/60 dark:bg-slate-950/80">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
          style={{ color: accentColor }}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-2">
        <div ref={containerRef} className="flex items-center">
          {!searchOpen ? (
            <button
              type="button"
              aria-label="Abrir búsqueda"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Search size={18} style={{ color: accentColor }} />
            </button>
          ) : (
            <div className="transition-all duration-200 ease-out w-64 md:w-80">
              <div className="flex items-center gap-3 rounded-full border border-slate-100 bg-white px-3 py-2 text-slate-700 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 dark:text-slate-200">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onSearch(event.target.value)
                  }
                  placeholder="Buscar"
                  autoFocus
                  className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
                />
                <button
                  type="button"
                  aria-label="Limpiar búsqueda"
                  onClick={() => {
                    onSearch("");
                    setSearchOpen(false);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCreateNote}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 active:scale-95"
        >
          <FileText className="h-4 w-4 text-white" />
          <span>✏️ Escribir</span>
        </button>
        <button
          type="button"
          aria-label="Guardar nota"
          title="Guardar cambios"
          onClick={onSaveNote}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 shadow-sm transition hover:bg-slate-200 dark:border-slate-800/60 dark:bg-slate-800/80 dark:hover:bg-slate-700"
        >
          <Save size={18} style={{ color: accentColor }} />
        </button>
        <button
          type="button"
          aria-label="Ajustes"
          onClick={onSettings}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 shadow-sm transition hover:bg-slate-200 dark:border-slate-800/60 dark:bg-slate-800/80 dark:hover:bg-slate-700"
        >
          <Settings size={18} style={{ color: accentColor }} />
        </button>
      </div>
    </header>
  );
}
