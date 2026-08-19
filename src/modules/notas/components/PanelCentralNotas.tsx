import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactElement,
} from "react";
import {
  ArrowUpDown,
  MoreVertical,
  Pin,
  Star,
  StarOff,
  Search as LucideSearch,
} from "lucide-react";
import { ConfirmacionEliminacionModal } from "../../../core/components/ConfirmacionEliminacionModal";
import { useNotifications } from "../../../core/components/useNotifications";
import { MenuContextual, type ContextMenuItem } from "./MenuContextual";
import { NotaListItem } from "./NotaListItem";
import { SeleccionCuadernoModal } from "./SeleccionCuadernoModal";
import { notesApi, type Notebook, type Note } from "../notesApi";
import { useTheme } from "../../../core/theme/useTheme";

export interface PanelCentralNotasProps {
  workspaceId: number | null;
  notebookId: number | null;
  searchQuery: string;
  onSearch?: (query: string) => void;
  activeNoteId?: number | null;
  onCreateNoteReady?: (createNote: () => void) => void;
  onReloadReady?: (reload: () => void) => void;
  onNoteSelect?: (note: Note) => void;
}

interface MenuState {
  x: number;
  y: number;
  note: Note;
}

export function PanelCentralNotas({
  workspaceId,
  notebookId,
  searchQuery,
  onSearch,
  activeNoteId,
  onCreateNoteReady,
  onReloadReady,
  onNoteSelect,
}: PanelCentralNotasProps): ReactElement {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const [moveNote, setMoveNote] = useState<Note | null>(null);
  const { notify: showNotification } = useNotifications();
  const { accentColor } = useTheme();

  const loadNotes = useCallback(async (): Promise<void> => {
    if (workspaceId === null) return;
    setIsLoading(true);
    try {
      const loaded = searchQuery.trim()
        ? await notesApi.notes.search(workspaceId, searchQuery, notebookId)
        : await notesApi.notes.getByWorkspace(workspaceId, notebookId);
      setNotes(loaded);
      setNotebooks(await notesApi.notebooks.getAll(workspaceId));
    } catch (error) {
      showNotification(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las notas",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  }, [notebookId, searchQuery, showNotification, workspaceId]);

  useEffect(() => {
    if (workspaceId === null) return undefined;
    let active = true;
    const notesRequest = searchQuery.trim()
      ? notesApi.notes.search(workspaceId, searchQuery, notebookId)
      : notesApi.notes.getByWorkspace(workspaceId, notebookId);
    void Promise.all([notesRequest, notesApi.notebooks.getAll(workspaceId)])
      .then(([loadedNotes, loadedNotebooks]) => {
        if (!active) return;
        setNotes(loadedNotes);
        setNotebooks(loadedNotebooks);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setIsLoading(false);
        showNotification(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las notas",
          "error",
        );
      });
    return () => {
      active = false;
    };
  }, [notebookId, searchQuery, showNotification, workspaceId]);

  const createNote = useCallback(async (): Promise<void> => {
    if (workspaceId === null) return;
    try {
      const note = await notesApi.notes.create(workspaceId, { notebookId });
      if (!note) throw new Error("No se pudo crear la nota");
      showNotification("Nota creada correctamente", "success");
      onNoteSelect?.(note);
      await loadNotes();
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "No se pudo crear la nota",
        "error",
      );
    }
  }, [loadNotes, notebookId, onNoteSelect, showNotification, workspaceId]);

  useEffect(() => {
    onCreateNoteReady?.(createNote);
    onReloadReady?.(loadNotes);
  }, [createNote, loadNotes, onCreateNoteReady, onReloadReady]);

  function selectNote(note: Note): void {
    if (selectionMode) {
      setSelectedIds((current) =>
        current.includes(note.id)
          ? current.filter((id) => id !== note.id)
          : [...current, note.id],
      );
      return;
    }
    onNoteSelect?.(note);
  }

  async function runNoteAction(
    action: () => Promise<Note | undefined>,
    message: string,
  ): Promise<void> {
    try {
      await action();
      showNotification(message, "success");
      await loadNotes();
    } catch (error) {
      showNotification(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la nota",
        "error",
      );
    }
  }

  function noteMenuItems(note: Note): ContextMenuItem[] {
    const isQuickAccess = note.is_quick_access === 1;

    return [
      {
        id: "pin",
        label: note.is_pinned === 1 ? "Desanclar" : "Anclar",
        icon: (
          <Pin
            className="h-4 w-4"
            style={
              note.is_pinned === 1
                ? { color: accentColor, fill: accentColor }
                : { color: accentColor }
            }
          />
        ),
        onSelect: () =>
          void runNoteAction(
            () => notesApi.notes.togglePin(note.id),
            "Nota actualizada correctamente",
          ),
      },
      {
        id: "quick",
        label: isQuickAccess ? "Quitar de Acceso rápido" : "Acceso rápido",
        icon: isQuickAccess ? (
          <StarOff className="h-4 w-4" style={{ color: accentColor }} />
        ) : (
          <Star
            className="h-4 w-4"
            style={{ color: accentColor, fill: accentColor }}
          />
        ),
        onSelect: () => {
          void (async () => {
            try {
              const nextStatus = isQuickAccess ? 0 : 1;
              await notesApi.notes.toggleQuickAccess(note.id, nextStatus);
              window.dispatchEvent(new CustomEvent("notes:updated"));
              showNotification(
                nextStatus === 1
                  ? "Nota añadida a Acceso rápido"
                  : "Nota quitada de Acceso rápido",
                "success",
              );
              await loadNotes();
            } catch (error) {
              showNotification(
                error instanceof Error
                  ? error.message
                  : "No se pudo actualizar el acceso rápido",
                "error",
              );
            }
          })();
        },
      },
      {
        id: "duplicate",
        label: "Duplicar",
        onSelect: () =>
          void runNoteAction(
            () => notesApi.notes.duplicate(note.id),
            "Nota duplicada correctamente",
          ),
      },
      {
        id: "move",
        label: "Mover a un cuaderno",
        onSelect: () => setMoveNote(note),
      },
      {
        id: "delete",
        label: "Eliminar",
        destructive: true,
        onSelect: () => setDeleteTarget(note),
      },
    ];
  }

  async function deleteNote(): Promise<void> {
    if (!deleteTarget) return;
    await runNoteAction(
      () => notesApi.notes.delete(deleteTarget.id),
      "Nota eliminada correctamente",
    );
    window.dispatchEvent(new CustomEvent("notes:updated"));
    window.dispatchEvent(new CustomEvent("trash:updated"));
    setDeleteTarget(null);
  }

  async function moveSelected(targetNotebookId: number | null): Promise<void> {
    const ids = moveNote ? [moveNote.id] : selectedIds;
    try {
      await Promise.all(
        ids.map((id) => notesApi.notes.move(id, targetNotebookId)),
      );
      showNotification("Nota movida correctamente", "success");
      setMoveNote(null);
      setSelectedIds([]);
      await loadNotes();
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "No se pudo mover la nota",
        "error",
      );
    }
  }

  function handleContextMenu(event: MouseEvent, note: Note): void {
    setMenu({ x: event.clientX, y: event.clientY, note });
  }

  const activeNotebookName = useMemo(() => {
    const match = notebooks.find((notebook) => notebook.id === notebookId);
    return match
      ? match.name
      : notebookId
        ? "Cuaderno seleccionado"
        : "Todas las notas";
  }, [notebookId, notebooks]);

  return (
    <section className="flex h-full max-h-full min-h-0 w-80 shrink-0 flex-col box-border border-r border-slate-200/80 bg-white/50 transition-colors duration-200 dark:border-slate-800/60 dark:bg-[#0f172a]">
      <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b border-slate-200/80 bg-transparent px-4 dark:border-slate-800/60 box-border">
        <h2 className="truncate pr-2 text-sm font-bold text-slate-800 dark:text-slate-100">
          {activeNotebookName}
        </h2>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200"
            aria-label="Ordenar"
          >
            <ArrowUpDown size={16} />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200"
            aria-label="Más opciones"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </header>

      {/* Barra de búsqueda contenida */}
      <div className="w-full px-3 pt-3 pb-1 box-border">
        <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs shadow-none transition-colors dark:border-slate-800/60 dark:bg-slate-800/40 box-border focus-within:border-purple-400">
          <LucideSearch className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder="Buscar en notas o #etiq"
            className="w-full min-w-0 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Lista con margen simétrico y sin desborde */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden px-3 py-3 space-y-3 box-border">
        {workspaceId === null && (
          <div className="p-6 text-center text-slate-400">
            <p className="text-sm font-semibold">Selecciona un espacio</p>
          </div>
        )}

        {workspaceId !== null && isLoading && (
          <p className="p-6 text-center text-xs text-slate-400">
            Cargando notas...
          </p>
        )}

        {workspaceId !== null && !isLoading && notes.length === 0 && (
          <div className="p-6 text-center text-slate-400">
            <p className="text-sm font-semibold">No hay notas todavía</p>
          </div>
        )}

        {workspaceId !== null && !isLoading && notes.length > 0 && (
          <>
            {notes.map((note) => (
              <div key={note.id} className="w-full min-w-0 box-border">
                <NotaListItem
                  isSelected={selectedIds.includes(note.id)}
                  isActive={note.id === activeNoteId}
                  isSelectionMode={selectionMode}
                  note={note}
                  onContextMenu={handleContextMenu}
                  onSelect={selectNote}
                />
              </div>
            ))}
          </>
        )}
      </div>

      {menu && (
        <MenuContextual
          isOpen
          items={noteMenuItems(menu.note)}
          onClose={() => setMenu(null)}
          x={menu.x}
          y={menu.y}
        />
      )}

      <ConfirmacionEliminacionModal
        isOpen={Boolean(deleteTarget)}
        message="¿Estás seguro de que deseas eliminar esta nota? Podrás encontrarla en la papelera."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void deleteNote()}
        title="Eliminar nota"
      />

      <SeleccionCuadernoModal
        currentNotebookId={moveNote?.notebook_id ?? null}
        isOpen={Boolean(moveNote) || (selectionMode && selectedIds.length > 1)}
        notebooks={notebooks}
        onClose={() => setMoveNote(null)}
        onSelect={(targetNotebookId) => void moveSelected(targetNotebookId)}
      />
    </section>
  );
}
