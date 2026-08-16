import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Plus, Tag, X } from "lucide-react";
import { useNotifications } from "../../../core/components/useNotifications";

export interface NoteTag {
  id: number;
  name: string;
  workspace_id: number;
  color_hex?: string | null;
}

export interface TagsModalProps {
  isOpen: boolean;
  workspaceId: number | null;
  noteId: number | null;
  onClose: () => void;
  onSaved?: () => void;
}

function getModalRoot(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  let root = document.getElementById("modal-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "modal-root";
    document.body.appendChild(root);
  }
  return root;
}

export function TagsModal({
  isOpen,
  workspaceId,
  noteId,
  onClose,
  onSaved,
}: TagsModalProps) {
  const [allTags, setAllTags] = useState<NoteTag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useNotifications();

  const refreshTags = async (): Promise<void> => {
    if (!workspaceId || !noteId) return;
    setIsLoading(true);
    try {
      const [workspaceTags, currentTags] = await Promise.all([
        window.electron?.tags?.getAllForWorkspace(workspaceId) ?? [],
        window.electron?.tags?.getForNote(noteId) ?? [],
      ]);
      setAllTags(
        Array.isArray(workspaceTags) ? (workspaceTags as NoteTag[]) : [],
      );
      setSelectedTagIds(
        Array.isArray(currentTags)
          ? (currentTags as NoteTag[]).map((tag) => tag.id)
          : [],
      );
    } catch (error) {
      console.error("Error cargando etiquetas:", error);
      notify("No se pudieron cargar las etiquetas", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    void refreshTags();
  }, [isOpen, workspaceId, noteId]);

  const tagOptions = useMemo(
    () =>
      allTags.map((tag) => ({
        ...tag,
        selected: selectedTagIds.includes(tag.id),
      })),
    [allTags, selectedTagIds],
  );

  async function handleSave(): Promise<void> {
    if (!noteId) return;

    setIsSaving(true);
    try {
      await window.electron?.tags?.setForNote(noteId, selectedTagIds);
      notify("Etiquetas actualizadas correctamente", "success");
      onSaved?.();
      onClose();
    } catch (error) {
      console.error("Error guardando etiquetas:", error);
      notify("No se pudieron guardar las etiquetas", "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateTag(): Promise<void> {
    if (!workspaceId || !newTagName.trim()) return;

    try {
      await window.electron?.tags?.create(workspaceId, newTagName);
      setNewTagName("");
      await refreshTags();
    } catch (error) {
      console.error("Error creando etiqueta:", error);
      notify("No se pudo crear la etiqueta", "error");
    }
  }

  if (!isOpen) return null;
  const root = getModalRoot();
  if (!root) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <button
          type="button"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onClose}
          aria-label="Cerrar etiquetas"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Etiquetas de la nota
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Organiza tus notas con tags rápidos
            </p>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <input
            value={newTagName}
            onChange={(event) => setNewTagName(event.target.value)}
            placeholder="Nueva etiqueta"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none ring-0 transition focus:border-purple-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
          <button
            type="button"
            onClick={() => void handleCreateTag()}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-500"
          >
            <Plus className="h-3.5 w-3.5" />
            Añadir
          </button>
        </div>

        <div className="space-y-2">
          {isLoading ? (
            <p className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">
              Cargando etiquetas...
            </p>
          ) : tagOptions.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 py-5 text-center text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
              Aún no hay etiquetas para este espacio.
            </p>
          ) : (
            tagOptions.map((tag) => {
              const selected = tag.selected;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() =>
                    setSelectedTagIds((current) =>
                      current.includes(tag.id)
                        ? current.filter((id) => id !== tag.id)
                        : [...current, tag.id],
                    )
                  }
                  className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition ${
                    selected
                      ? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-200"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: tag.color_hex || "#8B5CF6" }}
                    />
                    #{tag.name}
                  </span>
                  {selected && <Check className="h-4 w-4" />}
                </button>
              );
            })
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving}
            className="rounded-xl bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>,
    root,
  );
}
