import { useEffect, useState, type ReactElement } from "react";
import {
  ChevronDown,
  Layers,
  Plus,
  Settings,
} from "../../../core/components/Iconos";
import { useNotifications } from "../../../core/components/useNotifications";
import { workspacesApi, type Workspace } from "../workspacesApi";
import { EspacioItem } from "./EspacioItem";
import { NuevoEspacioModal } from "./NuevoEspacioModal";
import { EditarEspacioModal } from "./EditarEspacioModal";
import "../espacios.css";

export interface SelectorEspaciosProps {
  spaces?: Workspace[];
  activeWorkspaceId?: number | null;
  onWorkspaceChange?: (workspace: Workspace) => void;
  onSpacesChange?: (spaces: Workspace[]) => void;
}

export function SelectorEspacios({
  spaces: providedSpaces,
  activeWorkspaceId,
  onWorkspaceChange,
  onSpacesChange,
}: SelectorEspaciosProps): ReactElement {
  const [loadedSpaces, setLoadedSpaces] = useState<Workspace[]>([]);
  const [internalSelectedId, setInternalSelectedId] = useState<number | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const { notify: showNotification } = useNotifications();

  useEffect(() => {
    if (providedSpaces && providedSpaces.length > 0) {
      return;
    }

    let active = true;
    async function loadSpaces(): Promise<void> {
      try {
        const spacesFromDb = await workspacesApi.getAll();
        if (!active) return;
        setLoadedSpaces(spacesFromDb);

        if (spacesFromDb.length > 0) {
          const defaultSpace =
            spacesFromDb.find((space) => space.is_default === 1) ??
            spacesFromDb[0];
          setInternalSelectedId((prev) => prev ?? defaultSpace.id);
          onWorkspaceChange?.(defaultSpace);
        }
      } catch (error) {
        showNotification(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los espacios",
          "error",
        );
      }
    }

    void loadSpaces();
    return () => {
      active = false;
    };
  }, [providedSpaces, showNotification]);

  const spaces = providedSpaces ?? loadedSpaces;
  const selectedId = activeWorkspaceId ?? internalSelectedId;

  const activeWorkspace =
    spaces.find((space) => space.id === selectedId) ??
    spaces.find((space) => space.is_default === 1) ??
    spaces[0];

  function updateSpaces(nextSpaces: Workspace[]): void {
    setLoadedSpaces(nextSpaces);
    onSpacesChange?.(nextSpaces);
  }

  function handleSelect(workspace: Workspace): void {
    setInternalSelectedId(workspace.id);
    setIsOpen(false);
    onWorkspaceChange?.(workspace);
  }

  function handleCreated(workspace: Workspace): void {
    const nextSpaces = [...spaces, workspace];
    updateSpaces(nextSpaces);
    handleSelect(workspace);
  }

  function handleUpdated(workspace: Workspace): void {
    updateSpaces(
      spaces.map((current) =>
        current.id === workspace.id ? workspace : current,
      ),
    );
    if (workspace.id === selectedId) onWorkspaceChange?.(workspace);
  }

  function handleDeleted(workspaceId: number): void {
    const nextSpaces = spaces.filter((space) => space.id !== workspaceId);
    updateSpaces(nextSpaces);
    if (workspaceId === selectedId) {
      const nextWorkspace =
        nextSpaces.find((space) => space.is_default === 1) ?? nextSpaces[0];
      if (nextWorkspace) handleSelect(nextWorkspace);
    }
  }

  return (
    <div className="selector-espacios">
      <button
        aria-expanded={isOpen}
        className="selector-espacios-trigger flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-200/60 dark:text-slate-100 dark:hover:bg-slate-900/80"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <Layers
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-slate-600 dark:text-slate-400"
            size={19}
          />
          <span className="truncate">
            {activeWorkspace?.name ?? "Seleccionar espacio"}
          </span>
        </div>
        <ChevronDown
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-slate-400"
          size={17}
        />
      </button>
      {isOpen && (
        <div className="selector-espacios-menu" role="menu">
          <div className="selector-espacios-list">
            {spaces.map((workspace) => (
              <EspacioItem
                isActive={workspace.id === selectedId}
                key={workspace.id}
                onSelect={handleSelect}
                workspace={workspace}
              />
            ))}
          </div>
          <div className="selector-espacios-menu-actions">
            <button
              onClick={() => {
                setIsOpen(false);
                setModal("new");
              }}
              type="button"
            >
              <Plus size={17} /> Nuevo espacio
            </button>
            <button
              disabled={!activeWorkspace}
              onClick={() => {
                setIsOpen(false);
                setModal("edit");
              }}
              type="button"
            >
              <Settings size={17} /> Editar espacio actual
            </button>
          </div>
        </div>
      )}
      {modal === "new" && (
        <NuevoEspacioModal
          isOpen
          onClose={() => setModal(null)}
          onCreated={handleCreated}
        />
      )}
      {modal === "edit" && activeWorkspace && (
        <EditarEspacioModal
          isOpen
          onClose={() => setModal(null)}
          onDeleted={handleDeleted}
          onUpdated={handleUpdated}
          workspace={activeWorkspace}
        />
      )}
    </div>
  );
}
