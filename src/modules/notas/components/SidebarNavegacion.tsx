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
import "../notas.css";

export interface SidebarNavegacionProps {
  activeWorkspace: Workspace | null;
  selectedNotebookId: number | null;
  onWorkspaceChange: (workspace: Workspace) => void;
  onSelectNotebook: (notebookId: number | null) => void;
}

export function SidebarNavegacion({
  activeWorkspace,
  selectedNotebookId,
  onWorkspaceChange,
  onSelectNotebook,
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
        <button className="is-active" type="button">
          <FileText size={17} /> Todas las notas
        </button>
        <button type="button">
          <Star size={17} /> Acceso rápido
        </button>
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
