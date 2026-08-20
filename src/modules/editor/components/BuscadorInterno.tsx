import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { useTheme } from "../../../core/theme/useTheme";

export interface BuscadorInternoProps {
  query: string;
  currentIndex: number;
  totalResults: number;
  onSearch: (query: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export function BuscadorInterno({
  query,
  currentIndex,
  totalResults,
  onSearch,
  onNext,
  onPrev,
  onClose,
}: BuscadorInternoProps) {
  const { accentColor } = useTheme();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const counterText =
    totalResults > 0
      ? `${Math.min(currentIndex + 1, totalResults)} de ${totalResults}`
      : "0 de 0";

  return (
    <div className="fixed bottom-5 right-5 z-40 rounded-2xl border border-slate-200/80 bg-white/95 p-2.5 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex items-center gap-2">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          <Search className="h-4 w-4" />
        </div>

        <input
          className="w-52 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          type="text"
          value={query}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onSearch(event.target.value)
          }
          placeholder="Buscar texto..."
          aria-label="Buscar en esta nota"
          style={
            isInputFocused
              ? {
                  borderColor: accentColor,
                  boxShadow: `0 0 0 1px ${accentColor}`,
                }
              : undefined
          }
        />

        <span className="min-w-12 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
          {counterText}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrev}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Resultado anterior"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Siguiente resultado"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Cerrar buscador"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
