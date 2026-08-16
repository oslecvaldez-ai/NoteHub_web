import { useState, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { Check, FolderInput, Layers, X } from "lucide-react";
import { useNotifications } from "../../../core/components/useNotifications";
import {
  workspacesApi,
  type Workspace,
  type WorkspaceElementType,
} from "../workspacesApi";

export interface MoverEspacioModalProps {
  isOpen: boolean;
  spaces: Workspace[];
  currentWorkspaceId: number;
  elementId: number;
  elementType: WorkspaceElementType;
  onClose: () => void;
  onMoved?: (targetWorkspaceId: number) => void;
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

export function MoverEspacioModal({
  isOpen,
  spaces,
  currentWorkspaceId,
  elementId,
  elementType,
  onClose,
  onMoved,
}: MoverEspacioModalProps): ReactElement | null {
  const [targetWorkspaceId, setTargetWorkspaceId] = useState<number | null>(
    null,
  );
  const [isMoving, setIsMoving] = useState(false);
  const { notify: showNotification } = useNotifications();

  if (!isOpen) return null;
  const modalRoot = getModalRoot();
  if (!modalRoot) return null;

  const canMove =
    targetWorkspaceId !== null &&
    targetWorkspaceId !== currentWorkspaceId &&
    !isMoving;

  async function handleMove(): Promise<void> {
    if (!canMove || targetWorkspaceId === null) return;
    setIsMoving(true);

    try {
      await workspacesApi.moveElement(
        elementType,
        elementId,
        targetWorkspaceId,
      );
      showNotification("Elemento movido correctamente", "success");
      onMoved?.(targetWorkspaceId);
      onClose();
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "No se pudo mover el elemento",
        "error",
      );
    } finally {
      setIsMoving(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <FolderInput className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Mover a otro espacio
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Elige el espacio de trabajo de destino
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          className="max-h-72 space-y-2 overflow-y-auto pr-1"
          role="listbox"
          aria-label="Espacios disponibles"
        >
          {spaces.map((space) => {
            const isCurrent = space.id === currentWorkspaceId;
            const isSelected = space.id === targetWorkspaceId;

            return (
              <button
                key={space.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={isCurrent}
                onClick={() => setTargetWorkspaceId(space.id)}
                className={`group flex w-full items-center justify-between rounded-2xl border p-3 text-left transition ${
                  isSelected
                    ? "border-purple-500 bg-purple-50/50 dark:border-purple-600 dark:bg-purple-950/30"
                    : "border-slate-200/70 bg-slate-50/50 hover:bg-slate-100/60 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100/80 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    <Layers className="h-4 w-4" />
                  </span>

                  <span className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {space.name}
                    </span>
                    {isCurrent && (
                      <span className="mt-0.5 inline-flex w-fit rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Espacio actual
                      </span>
                    )}
                  </span>
                </span>

                {isSelected && (
                  <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => void handleMove()}
            disabled={!canMove}
            className="rounded-2xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/20 transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isMoving ? "Moviendo..." : "Mover"}
          </button>
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
