import type { MouseEvent } from "react";
import { Pin } from "lucide-react";
import { Check } from "../../../core/components/Iconos";
import { useTheme } from "../../../core/theme/useTheme";
import type { Note } from "../notesApi";
import {
  extractImage,
  extraerExtracto,
  formatNoteDate,
  getNoteTitle,
} from "../noteUtils";

export interface NotaListItemProps {
  note: Note;
  isSelected: boolean;
  isActive?: boolean;
  isSelectionMode: boolean;
  onSelect: (note: Note) => void;
  onContextMenu: (event: MouseEvent, note: Note) => void;
}

export function NotaListItem({
  note,
  isSelected,
  isActive,
  isSelectionMode,
  onSelect,
  onContextMenu,
}: NotaListItemProps) {
  const { accentColor } = useTheme();
  const image = extractImage(note.content);
  const excerpt = extraerExtracto(note.content);

  return (
    <article
      className={`group relative flex cursor-pointer flex-col gap-1.5 rounded-[22px] p-4 box-border w-full min-w-0 overflow-hidden transition-all duration-200 ${
        isActive || isSelected
          ? "border-2 rounded-2xl bg-white shadow-sm dark:bg-slate-800/80"
          : "border border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800/40 dark:bg-transparent dark:hover:bg-slate-800/40 dark:hover:border-slate-700/60"
      }`}
      style={
        isActive || isSelected
          ? { backgroundColor: `${accentColor}15`, borderColor: accentColor }
          : undefined
      }
      onClick={() => onSelect(note)}
      onContextMenu={(event) => {
        event.preventDefault();
        onContextMenu(event, note);
      }}
    >
      {isSelectionMode && (
        <span
          className={`nota-checkbox${isSelected ? " is-checked" : ""}`}
          aria-hidden="true"
        >
          {isSelected && <Check size={14} />}
        </span>
      )}

      {/* Cabecera del Título con truncado garantizado */}
      <div className="flex items-start justify-between gap-2 w-full min-w-0 overflow-hidden">
        <h3
          className="flex-1 min-w-0 text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug break-all"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={getNoteTitle(note)}
        >
          {getNoteTitle(note) || "Sin título"}
        </h3>

        {note.is_pinned === 1 && (
          <Pin
            aria-label="Nota fijada"
            className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-current"
            style={{ color: accentColor }}
          />
        )}
      </div>

      {/* Extracto en 1 sola línea con elipsis limpia */}
      <p className="w-full min-w-0 text-[11px] font-normal leading-relaxed text-slate-400 dark:text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">
        {excerpt || "Sin contenido adicional"}
      </p>

      {/* Fecha */}
      <div className="mt-1 w-full min-w-0">
        <span className="block text-[10px] text-slate-400 dark:text-slate-500">
          {formatNoteDate(note.updated_at)}
        </span>
      </div>

      {image && (
        <img
          alt="Miniatura de la nota"
          className="mt-1 h-16 w-full rounded-xl object-cover"
          src={image}
        />
      )}
    </article>
  );
}
