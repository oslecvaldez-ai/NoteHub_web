import { useCallback, useEffect, useRef, useState } from "react";
import { AppWrapper } from "./core";
import { GlobalHeader } from "./core/components/GlobalHeader";
import {
  workspacesApi,
  type Workspace,
} from "./modules/espacios/workspacesApi";
import {
  PanelCentralNotas,
  SidebarNavegacion,
  type Note,
} from "./modules/notas";
import {
  PanelEditor,
  type PanelEditorHandle,
} from "./modules/editor/components/PanelEditor";

function WorkspaceShell() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible((prev) => !prev);
  }, []);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    null,
  );
  const [selectedNotebookId, setSelectedNotebookId] = useState<number | null>(
    null,
  );
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [createNoteAction, setCreateNoteAction] = useState<() => void>(
    () => () => {},
  );
  const [reloadAction, setReloadAction] = useState<() => void>(() => () => {});

  const panelEditorRef = useRef<PanelEditorHandle | null>(null);

  const handleCreateNoteReady = useCallback((createNote: () => void) => {
    setCreateNoteAction(() => createNote);
  }, []);

  const handleReloadReady = useCallback((reload: () => void) => {
    setReloadAction(() => reload);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadDefaultWorkspace(): Promise<void> {
      try {
        const spaces = await workspacesApi.getAll();
        if (!active) return;

        if (spaces.length === 0) {
          return;
        }

        const defaultWorkspace =
          spaces.find((space) => space.is_default === 1) ?? spaces[0];
        if (defaultWorkspace) {
          console.log(
            "Espacio activo inicial cargado:",
            defaultWorkspace.id,
            defaultWorkspace.name,
          );
          setActiveWorkspace((current) => current ?? defaultWorkspace);
        }
      } catch (error) {
        console.error("No se pudo cargar el espacio activo inicial", error);
      }
    }

    if (!activeWorkspace) {
      void loadDefaultWorkspace();
    }

    return () => {
      active = false;
    };
  }, [activeWorkspace]);

  const handleWorkspaceChange = useCallback((workspace: Workspace): void => {
    console.log("Cambio de espacio activo:", workspace.id, workspace.name);
    setActiveWorkspace(workspace);
    setSelectedNotebookId(null);
    setSelectedNote(null);
  }, []);

  const handleNoteSelect = useCallback((note: Note): void => {
    setSelectedNote(note);
  }, []);

  const handleSelectAllNotes = useCallback(() => {
    setSelectedNote(null);
    setSelectedNotebookId(null);
    setSearchQuery("");
    // reset other filters/pagination here if present
    reloadAction();
  }, [reloadAction]);

  const handleSaveAndCloseNote = useCallback(async () => {
    if (selectedNote) {
      if (panelEditorRef.current) {
        await panelEditorRef.current.saveNow();
      }
      setSelectedNote(null);
      reloadAction();
    }
  }, [selectedNote, reloadAction]);

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--bg-app)] text-[var(--text-primary)]">
      {/* Cabecera Global Fija */}
      <div className="flex-shrink-0 z-20">
        <GlobalHeader
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onCreateNote={createNoteAction}
          onSaveNote={handleSaveAndCloseNote}
          onReload={reloadAction}
          onToggleSidebar={toggleSidebar}
        />
      </div>

      {/* Contenedor estricto de 3 columnas */}
      <div className="flex flex-row flex-1 min-h-0 overflow-hidden">
        {/* Columna 1: Sidebar Ampliado para ver todo completo */}
        {isSidebarVisible && (
          <div className="w-72 h-full overflow-y-auto border-r border-gray-200 flex-shrink-0 bg-slate-50 overflow-x-hidden transition-all duration-200">
            <SidebarNavegacion
              activeWorkspace={activeWorkspace}
              onSelectNotebook={(notebookId) => {
                setSelectedNotebookId(notebookId);
                setSelectedNote(null);
              }}
              onWorkspaceChange={handleWorkspaceChange}
              selectedNotebookId={selectedNotebookId}
              onSelectAllNotes={handleSelectAllNotes}
            />
          </div>
        )}

        {/* Columna 2: Lista de Notas Compacta */}
        <div className="w-52 h-full flex flex-col border-r border-gray-200 flex-shrink-0 bg-white overflow-hidden transition-all duration-200">
          <PanelCentralNotas
            key={`${activeWorkspace?.id ?? "none"}-${selectedNotebookId ?? "all"}`}
            notebookId={selectedNotebookId}
            workspaceId={activeWorkspace?.id ?? null}
            searchQuery={searchQuery}
            onCreateNoteReady={handleCreateNoteReady}
            onReloadReady={handleReloadReady}
            onNoteSelect={handleNoteSelect}
            activeNoteId={selectedNote?.id ?? null}
          />
        </div>

        {/* Columna 3: Editor (Expansible al resto de la pantalla) */}
        <div className="flex-1 h-full min-w-0 flex flex-col bg-white overflow-hidden transition-all duration-200">
          {selectedNote ? (
            <PanelEditor
              ref={panelEditorRef}
              noteId={selectedNote.id}
              notebookId={selectedNote.notebook_id}
              noteTitle={selectedNote.title}
              initialHTML={selectedNote.content}
            />
          ) : (
            <div className="flex h-full min-h-0 items-center justify-center bg-white p-8 text-center text-slate-500">
              <div>
                <h2 className="mb-2 text-xl font-medium text-slate-700">
                  Selecciona o crea una nota
                </h2>
                <p className="text-sm">
                  La nota recién creada se abrirá automáticamente aquí.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <AppWrapper>
      <WorkspaceShell />
    </AppWrapper>
  );
}

export default App;
