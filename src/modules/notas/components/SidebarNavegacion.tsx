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
}: SidebarNavegacionProps): ReactElement {
  const [resolvedWorkspace, setResolvedWorkspace] = useState<Workspace | null>(
    activeWorkspace,
  );

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

  return (
    <aside className="notas-sidebar">
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
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
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
                        : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900/80"
                    }`}
                  >
                    <Star className="h-3 w-3 shrink-0 text-amber-500 fill-amber-500/80 group-hover:scale-110 transition-transform" />
                    <span className="truncate flex-1">
                      {note.title || "Sin título"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button type="button">
          <Trash2 size={17} /> Papelera
        </button>
        <button type="button">
          <Archive size={17} /> Plantillas
        </button>
        <button type="button">
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
