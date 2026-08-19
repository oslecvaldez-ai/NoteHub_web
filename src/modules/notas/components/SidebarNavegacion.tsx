import { useEffect, useState, type ReactElement } from "react";
import {
  Archive,
  FileText,
  Settings,
  Star,
  Trash2,
} from "../../../core/components/Iconos";
import { SelectorEspacios } from "../../espacios/components/SelectorEspacios";
import { workspacesApi, type Workspace } from "../../espacios/workspacesApi";
import { ArbolCuadernos } from "./ArbolCuadernos";
import { type Note } from "../notesApi";
import { useTheme } from "../../../core/theme/useTheme";
import "../notas.css";

export interface SidebarNavegacionProps {
  activeWorkspace: Workspace | null;
  selectedNotebookId: number | null;
  activeNoteId?: number | null;
  quickAccessNotes?: Note[];
  onWorkspaceChange: (workspace: Workspace) => void;
  onSelectNotebook: (notebookId: number | null) => void;
  onSelectQuickNote?: (noteId: number) => void;
  onSelectAllNotes?: () => void;
  onSelectTrash?: () => void;
  onSelectTemplates?: () => void;
  onSelectBackups?: () => void;
  onSelectSettings?: () => void;
  isSettingsActive?: boolean;
}

export function SidebarNavegacion({
  activeWorkspace,
  selectedNotebookId,
  activeNoteId,
  quickAccessNotes = [],
  onWorkspaceChange,
  onSelectNotebook,
  onSelectQuickNote,
  onSelectAllNotes,
  onSelectTrash,
  onSelectTemplates,
  onSelectBackups,
  onSelectSettings,
  isSettingsActive = false,
}: SidebarNavegacionProps): ReactElement {
  const { accentColor } = useTheme();
  const [resolvedWorkspace, setResolvedWorkspace] = useState<Workspace | null>(
    activeWorkspace,
  );
  const [trashCount, setTrashCount] = useState<number>(0);
  const [templatesCount, setTemplatesCount] = useState<number>(0);

  const workspaceId = activeWorkspace?.id ?? resolvedWorkspace?.id ?? null;

  useEffect(() => {
    if (activeWorkspace) {
      setResolvedWorkspace(activeWorkspace);
      return;
    }

    let active = true;
    async function loadDefaultWorkspace(): Promise<void> {
      try {
        const spaces = await workspacesApi.getAll();
        if (!active) return;
        const defaultWorkspace =
          spaces.find((space) => space.is_default === 1) ?? spaces[0] ?? null;
        console.log(
          "SidebarNavegacion usa espacio:",
          defaultWorkspace?.id,
          defaultWorkspace?.name,
        );
        setResolvedWorkspace(defaultWorkspace);
      } catch (error) {
        console.error(
          "No se pudo cargar el espacio activo para la barra lateral",
          error,
        );
      }
    }

    void loadDefaultWorkspace();
    return () => {
      active = false;
    };
  }, [activeWorkspace]);

  useEffect(() => {
    const fetchBadges = async (): Promise<void> => {
      if (!workspaceId) {
        setTrashCount(0);
        setTemplatesCount(0);
        return;
      }

      try {
        const [trashTotal, templates] = await Promise.all([
          window.electron?.trash?.getCount(workspaceId) ?? Promise.resolve(0),
          window.electron?.templates?.getAll(workspaceId) ??
            Promise.resolve([]),
        ]);

        setTrashCount(Number(trashTotal) || 0);
        setTemplatesCount(Array.isArray(templates) ? templates.length : 0);
      } catch (error) {
        console.error("Error al actualizar contadores del sidebar:", error);
      }
    };

    void fetchBadges();

    const handleUpdate = (): void => {
      void fetchBadges();
    };

    window.addEventListener("notes:updated", handleUpdate);
    window.addEventListener("templates:updated", handleUpdate);
    window.addEventListener("trash:updated", handleUpdate);

    return () => {
      window.removeEventListener("notes:updated", handleUpdate);
      window.removeEventListener("templates:updated", handleUpdate);
      window.removeEventListener("trash:updated", handleUpdate);
    };
  }, [workspaceId]);

  return (
    <aside className="notas-sidebar border-r border-slate-200/80 bg-slate-50 transition-colors duration-200 dark:border-slate-800/60 dark:bg-slate-950">
      <SelectorEspacios onWorkspaceChange={onWorkspaceChange} />
      <nav aria-label="Navegación principal" className="notas-sidebar-nav">
        <button
          className="is-active"
          type="button"
          onClick={() => {
            if (onSelectAllNotes) onSelectAllNotes();
            else onSelectNotebook(null);
          }}
        >
          <FileText size={17} /> Todas las notas
        </button>

        <div className="flex flex-col">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
            onClick={() => {
              if (onSelectAllNotes) onSelectAllNotes();
              else onSelectNotebook(null);
            }}
          >
            <Star size={17} />
            <span>Acceso rápido</span>
          </button>

          {quickAccessNotes.length > 0 && (
            <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-slate-100 pl-2 dark:border-slate-800">
              {quickAccessNotes.map((note) => {
                const isCurrentSelected = activeNoteId === note.id;

                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => onSelectQuickNote?.(note.id)}
                    className={`group flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs transition ${
                      isCurrentSelected
                        ? "bg-amber-50 text-amber-900 font-semibold dark:bg-amber-950/40 dark:text-amber-300"
                        : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                    }`}
                  >
                    <Star
                      className="h-3 w-3 shrink-0 fill-current transition-transform group-hover:scale-110"
                      style={{ color: accentColor, fill: accentColor }}
                    />
                    <span className="truncate flex-1">
                      {note.title || "Sin título"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelectTrash?.()}
          className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
        >
          <span className="flex items-center gap-2">
            <Trash2 size={17} />
            <span>Papelera</span>
          </span>
          {trashCount > 0 && (
            <span
              style={{ color: accentColor }}
              className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-100 px-1.5 text-[11px] font-bold dark:bg-slate-800/60"
            >
              {trashCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => onSelectTemplates?.()}
          className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
        >
          <span className="flex items-center gap-2">
            <Archive size={17} />
            <span>Plantillas</span>
          </span>
          {templatesCount > 0 && (
            <span
              style={{ color: accentColor }}
              className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-100 px-1.5 text-[11px] font-bold dark:bg-slate-800/60"
            >
              {templatesCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => onSelectBackups?.()}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
        >
          <span className="flex items-center gap-2">
            <Archive size={17} />
            <span>Respaldos</span>
          </span>
        </button>
        <button
          type="button"
          className={isSettingsActive ? "is-active" : undefined}
          onClick={() => onSelectSettings?.()}
        >
          <Settings size={17} /> Ajustes
        </button>
      </nav>
      <ArbolCuadernos
        onSelectNotebook={onSelectNotebook}
        selectedNotebookId={selectedNotebookId}
        workspaceId={resolvedWorkspace?.id ?? null}
      />
    </aside>
  );
}
