import { useState, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { useNotifications } from "../../../core/components/useNotifications";
import { X } from "../../../core/components/Iconos";
import { workspacesApi, type Workspace } from "../workspacesApi";

export interface EditarEspacioModalProps {
  isOpen: boolean;
  workspace: Workspace | null;
  onClose: () => void;
  onUpdated?: (workspace: Workspace) => void;
  onDeleted?: (workspaceId: number) => void;
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

export function EditarEspacioModal({
  isOpen,
  workspace,
  onClose,
  onDeleted,
}: EditarEspacioModalProps): ReactElement | null {
  const [isDeleting, setIsDeleting] = useState(false);
  const { notify: showNotification } = useNotifications();

  async function handleDelete(mode: "all" | "migrate"): Promise<void> {
    if (!workspace || workspace.is_default === 1 || isDeleting) return;

    setIsDeleting(true);
    try {
      await workspacesApi.delete(workspace.id, mode);
      showNotification(
        mode === "migrate"
          ? "Espacio eliminado. Las notas se movieron al espacio por defecto."
          : "Espacio eliminado y todo su contenido fue borrado.",
        "success",
      );
      onDeleted?.(workspace.id);
      onClose();
    } catch (error) {
      showNotification(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el espacio",
        "error",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  if (!isOpen || !workspace) return null;

  const modalRoot = getModalRoot();
  if (!modalRoot) return null;

  return createPortal(
    <div
      className="espacios-modal-overlay"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        aria-labelledby="editar-espacio-titulo"
        className="espacios-modal"
        role="dialog"
      >
        <button
          aria-label="Cerrar modal"
          className="espacios-modal-close"
          onClick={onClose}
          type="button"
        >
          <X size={20} />
        </button>
        <h2 id="editar-espacio-titulo">Eliminar espacio</h2>
        <p style={{ marginBottom: "1rem", color: "#64748b" }}>
          ¿Qué quieres hacer con el contenido de{" "}
          <strong>{workspace.name}</strong>?
        </p>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <button
            className="espacios-modal-action"
            disabled={isDeleting}
            onClick={() => void handleDelete("migrate")}
            type="button"
          >
            Mover notas al espacio por defecto
          </button>

          <button
            className="espacios-danger-action"
            disabled={isDeleting}
            onClick={() => void handleDelete("all")}
            type="button"
          >
            Eliminar espacio y todo su contenido
          </button>
        </div>

        <div className="espacios-modal-actions" style={{ marginTop: "1rem" }}>
          <button onClick={onClose} type="button">
            Atrás
          </button>
        </div>
      </section>
    </div>,
    modalRoot,
  );
}
