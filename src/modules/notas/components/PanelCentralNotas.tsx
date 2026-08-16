import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactElement,
} from "react";
import { ArrowUpDown, MoreVertical, Star, StarOff } from "lucide-react";
import { ConfirmacionEliminacionModal } from "../../../core/components/ConfirmacionEliminacionModal";
import { useNotifications } from "../../../core/components/useNotifications";
import { MenuContextual, type ContextMenuItem } from "./MenuContextual";
import { NotaListItem } from "./NotaListItem";
import { SeleccionCuadernoModal } from "./SeleccionCuadernoModal";
import { notesApi, type Notebook, type Note } from "../notesApi";

export interface PanelCentralNotasProps {
  workspaceId: number | null;
  notebookId: number | null;
  searchQuery: string;
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
          <StarOff className="h-4 w-4 text-amber-500" />
        ) : (
          <Star className="h-4 w-4 text-amber-500 fill-amber-500/80" />
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
    <section className="panel-central-notas h-full w-full max-w-full flex flex-col overflow-hidden bg-white">
      <header className="panel-notas-header flex-shrink-0 w-full px-3 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-bold text-slate-800">
            {activeNotebookName}
          </h2>
        </div>
        <div className="panel-notas-header-actions flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            className="panel-notas-icon-button p-1 text-slate-500 hover:text-slate-800"
            aria-label="Ordenar"
          >
            <ArrowUpDown size={16} />
          </button>
          <button
            type="button"
            className="panel-notas-icon-button p-1 text-slate-500 hover:text-slate-800"
            aria-label="Más opciones"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </header>

      {selectionMode && selectedIds.length > 0 && (
        <div className="panel-notas-bulk-actions flex-shrink-0 p-2 text-xs bg-slate-50 border-b border-gray-100">
          <span>{selectedIds.length} seleccionada(s)</span>
          <button
            onClick={() =>
              setMoveNote(
                notes.find((note) => note.id === selectedIds[0]) ?? null,
              )
            }
            type="button"
          >
            Mover seleccionadas
          </button>
          <button
            onClick={() =>
              setDeleteTarget(
                notes.find((note) => note.id === selectedIds[0]) ?? null,
              )
            }
            type="button"
          >
            Eliminar seleccionadas
          </button>
        </div>
      )}

      {/* Contenedor de lista con ancho estrictamente contenido y scroll vertical únicamente */}
      <div className="panel-notas-list flex-1 w-full max-w-full overflow-y-auto overflow-x-hidden p-2 space-y-2">
        {workspaceId === null ? (
          <div className="panel-notas-empty text-center p-4">
            <h3 className="text-sm font-semibold text-slate-700">
              Selecciona un espacio
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Elige un espacio en la barra lateral para ver tus notas.
            </p>
          </div>
        ) : isLoading ? (
          <p className="panel-notas-status text-xs text-slate-400 p-3 text-center">
            Cargando notas...
          </p>
        ) : notes.length === 0 ? (
          <div className="panel-notas-empty text-center p-4">
            <h3 className="text-sm font-semibold text-slate-700">
              No hay notas todavía
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Crea una nota nueva para comenzar.
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="w-full max-w-full overflow-hidden">
              <NotaListItem
                isSelected={selectedIds.includes(note.id)}
                isActive={note.id === activeNoteId}
                isSelectionMode={selectionMode}
                note={note}
                onContextMenu={handleContextMenu}
                onSelect={selectNote}
              />
            </div>
          ))
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
