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
      className={`nota-list-item${isSelected ? " is-selected" : ""}${isActive ? " is-active" : ""}`}
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
      <div className="nota-list-content">
        <div className="nota-list-heading">
          <h3>{getNoteTitle(note)}</h3>
          {note.is_pinned === 1 && (
            <Pin
              aria-label="Nota fijada"
              className="h-3.5 w-3.5 shrink-0 text-purple-600 dark:text-purple-400"
            />
          )}
        </div>
        <p>{excerpt || "Sin contenido todavía"}</p>
        <time dateTime={note.updated_at}>
          {formatNoteDate(note.updated_at)}
        </time>
      </div>
      {image && (
        <img
          alt="Miniatura de la nota"
          className="nota-list-thumbnail"
          src={image}
        />
      )}
    </article>
  );
}
