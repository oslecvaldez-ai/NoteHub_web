import { useEffect, useRef, useState, type ReactElement } from "react";
import * as Icons from "../../../core/components/Iconos";
import {
  ChevronDown,
  Layers,
  Plus,
  Settings,
} from "../../../core/components/Iconos";
import { useNotifications } from "../../../core/components/useNotifications";
import { useTheme } from "../../../core/theme/useTheme";
import { workspacesApi, type Workspace } from "../workspacesApi";
import { EspacioItem } from "./EspacioItem";
import { NuevoEspacioModal } from "./NuevoEspacioModal";
import { EditarEspacioModal } from "./EditarEspacioModal";
import { notesApi } from "../../notas/notesApi";
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
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(
    null,
  );
  const [noteCounts, setNoteCounts] = useState<Record<number, number>>({});
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { notify: showNotification } = useNotifications();
  const { accentColor } = useTheme();

  function clearCloseTimeout(): void {
    if (closeTimeoutRef.current !== null) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function handleMouseEnter(): void {
    clearCloseTimeout();
    setIsOpen(true);
  }

  function handleMouseLeave(): void {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimeoutRef.current = null;
    }, 180);
  }

  useEffect(() => {
    return () => clearCloseTimeout();
  }, []);

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
            spacesFromDb.find(
              (space) =>
                space.id ===
                Number(localStorage.getItem("notehub_active_workspace_id")),
            ) ??
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

  useEffect(() => {
    let active = true;
    void Promise.all(
      spaces.map(async (space) => {
        try {
          const notes = await notesApi.notes.getByWorkspace(space.id);
          return [space.id, notes.length] as const;
        } catch {
          return [space.id, 0] as const;
        }
      }),
    ).then((counts) => {
      if (active) setNoteCounts(Object.fromEntries(counts));
    });

    return () => {
      active = false;
    };
  }, [spaces]);

  const activeWorkspace =
    spaces.find((space) => space.id === selectedId) ??
    spaces.find((space) => space.is_default === 1) ??
    spaces[0];

  const ActiveIcon =
    (activeWorkspace?.icon &&
      (Icons as Record<string, any>)[activeWorkspace.icon]) ||
    Layers;

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
    <div
      className="selector-espacios relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        aria-expanded={isOpen}
        className="selector-espacios-trigger group flex w-full items-center justify-between rounded-2xl border border-slate-200/80 bg-white/70 px-3.5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900"
        onClick={() => setIsOpen((open) => !open)}
        style={{ borderColor: isOpen ? accentColor : undefined }}
        type="button"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <ActiveIcon
            aria-hidden="true"
            className="h-4 w-4 shrink-0"
            size={19}
            style={{ color: accentColor }}
          />
          <span className="truncate font-semibold">
            {activeWorkspace?.name ?? "Seleccionar espacio"}
          </span>
        </div>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
          size={17}
        />
      </button>

      {isOpen && (
        <div
          className="selector-espacios-menu absolute top-full left-0 right-0 z-50 mt-1.5 flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
        >
          {/* Lista con scroll vertical estilizado y sin scroll horizontal */}
          <div className="custom-scroll max-h-56 overflow-y-auto overflow-x-hidden p-1.5 space-y-0.5">
            {spaces.map((workspace) => (
              <EspacioItem
                isActive={workspace.id === selectedId}
                key={workspace.id}
                onSelect={handleSelect}
                onEdit={() => {
                  setEditingWorkspace(workspace);
                  setIsOpen(false);
                  setModal("edit");
                }}
                noteCount={noteCounts[workspace.id] ?? 0}
                workspace={workspace}
              />
            ))}
          </div>

          {/* Acciones fijas abajo */}
          <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 p-1.5 space-y-0.5">
            <button
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              onClick={() => {
                setIsOpen(false);
                setModal("new");
              }}
              type="button"
            >
              <Plus size={15} style={{ color: accentColor }} />
              Nuevo espacio
            </button>
            <button
              disabled={!activeWorkspace}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors disabled:opacity-40"
              onClick={() => {
                setEditingWorkspace(activeWorkspace);
                setIsOpen(false);
                setModal("edit");
              }}
              type="button"
            >
              <Settings size={15} />
              Editar espacio actual
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
      {modal === "edit" && editingWorkspace && (
        <EditarEspacioModal
          isOpen
          onClose={() => {
            setModal(null);
            setEditingWorkspace(null);
          }}
          onDeleted={handleDeleted}
          onUpdated={handleUpdated}
          workspace={editingWorkspace}
        />
      )}
    </div>
  );
}
