import { useEffect, useState } from "react";
import { Archive, Trash2 } from "lucide-react";
import { ConfirmacionEliminacionModal } from "../../../core/components/ConfirmacionEliminacionModal";
import { useNotifications } from "../../../core/components/useNotifications";
import { workspacesApi, type Workspace } from "../../espacios/workspacesApi";

export function SeccionEspacios() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [targetWorkspace, setTargetWorkspace] = useState<Workspace | null>(
    null,
  );
  const { notify } = useNotifications();

  const loadWorkspaces = async () => {
    const list = await workspacesApi.getAll();
    setWorkspaces(list);
  };
  useEffect(() => {
    let active = true;
    workspacesApi
      .getAll()
      .then((list) => {
        if (active) setWorkspaces(list);
      })
      .catch(() => notify("No se pudieron cargar los espacios", "error"));
    return () => {
      active = false;
    };
  }, [notify]);

  const handleDelete = async () => {
    if (!targetWorkspace) return;
    try {
      await workspacesApi.delete(targetWorkspace.id);
      notify(
        "Espacio eliminado. Su contenido fue movido al espacio por defecto.",
        "success",
      );
      await loadWorkspaces();
    } catch {
      notify("Error al eliminar el espacio", "error");
    }
    setTargetWorkspace(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Gestión de Espacios
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Administra tus entornos de trabajo aislados.
        </p>
      </div>
      <div className="space-y-3">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Archive size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {workspace.name}
                </h4>
                {workspace.is_default === 1 && (
                  <span className="mt-1 inline-block rounded-md bg-blue-100/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                    Por defecto
                  </span>
                )}
              </div>
            </div>
            {workspace.is_default === 0 && (
              <button
                type="button"
                aria-label={`Eliminar espacio ${workspace.name}`}
                title="Eliminar y mover notas al espacio por defecto"
                onClick={() => setTargetWorkspace(workspace)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/40 dark:hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      <ConfirmacionEliminacionModal
        isOpen={Boolean(targetWorkspace)}
        title="Eliminar espacio y mover contenido"
        message={`¿Seguro que deseas mover todo el contenido de «${targetWorkspace?.name ?? ""}» al espacio por defecto y eliminarlo?`}
        onConfirm={() => void handleDelete()}
        onCancel={() => setTargetWorkspace(null)}
      />
    </div>
  );
}
