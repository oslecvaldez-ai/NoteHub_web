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
      className={`group relative flex cursor-pointer flex-col gap-1.5 rounded-2xl border p-3.5 transition w-full overflow-hidden ${
        isActive || isSelected
          ? "border-purple-300 bg-purple-50/60 shadow-sm dark:border-purple-800 dark:bg-purple-950/40"
          : "border-slate-200/70 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:border-slate-700"
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
        <h3 className="min-w-0 flex-1 line-clamp-2 text-xs font-bold text-slate-800 dark:text-slate-100 break-words">
          {getNoteTitle(note) || "Sin título"}
        </h3>
        {note.is_pinned === 1 && (
          <Pin
            aria-label="Nota fijada"
            className="h-3 w-3 shrink-0 fill-current text-purple-600 dark:text-purple-400"
          />
        )}
      </div>

      <p className="min-w-0 break-words line-clamp-2 text-[11px] font-normal leading-relaxed text-slate-400 dark:text-slate-500">
        {excerpt || "Sin contenido adicional"}
      </p>

      <div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-slate-400 dark:text-slate-500 w-full">
        <span className="shrink-0">{formatNoteDate(note.updated_at)}</span>
        {note.notebook_id && (
          <span className="truncate max-w-[120px] rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">
            {note.notebook_id}
          </span>
        )}
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
