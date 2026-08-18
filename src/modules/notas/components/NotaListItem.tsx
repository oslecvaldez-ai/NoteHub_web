import type { MouseEvent } from "react";
import { Pin } from "lucide-react";
import { Check } from "../../../core/components/Iconos";
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
  const image = extractImage(note.content);
  const excerpt = extraerExtracto(note.content);

  return (
    <article
      className={`group relative flex cursor-pointer flex-col gap-1.5 rounded-[22px] p-4 box-border w-full min-w-0 overflow-hidden transition ${
        isActive || isSelected
          ? "border-2 border-purple-300 bg-white shadow-sm dark:border-purple-700 dark:bg-slate-900"
          : "border border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60"
      }`}
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

      <div className="flex items-start justify-between gap-2 min-w-0 w-full">
        <h3 className="min-w-0 flex-1 line-clamp-2 text-xs font-bold text-slate-900 dark:text-slate-100 break-words leading-snug">
          {getNoteTitle(note) || "Sin título"}
        </h3>
        {note.is_pinned === 1 && (
          <Pin
            aria-label="Nota fijada"
            className="h-3 w-3 shrink-0 fill-current text-purple-600 dark:text-purple-400"
          />
        )}
      </div>

      <p className="min-w-0 truncate text-[11px] font-normal leading-relaxed mt-1 text-slate-400 dark:text-slate-500">
        {excerpt || "Sin contenido adicional"}
      </p>

      <div className="mt-2 w-full">
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
