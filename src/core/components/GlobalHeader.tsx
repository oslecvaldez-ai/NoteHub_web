import {
  type ChangeEvent,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { Save, Search, Settings, PanelLeft, PencilLine } from "lucide-react";

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
        <div ref={containerRef} className="flex items-center">
          {!searchOpen ? (
            <button
              type="button"
              aria-label="Abrir búsqueda"
              onClick={() => setSearchOpen(true)}
              className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center transition"
            >
              <Search size={18} />
            </button>
          ) : (
            <div className="transition-all duration-200 ease-out w-64 md:w-80">
              <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2 text-slate-700 shadow-sm border border-slate-100">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onSearch(event.target.value)
                  }
                  placeholder="Buscar"
                  autoFocus
                  className="w-full bg-transparent border-0 text-sm outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  aria-label="Limpiar búsqueda"
                  onClick={() => {
                    onSearch("");
                    setSearchOpen(false);
                  }}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"
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
          className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/60 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center transition shadow-sm"
        >
          <Save size={18} />
        </button>
        <button
          type="button"
          aria-label="Ajustes"
          className="h-9 w-9 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 flex items-center justify-center transition"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
