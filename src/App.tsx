import { useCallback, useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { AppWrapper } from "./core";
import { GlobalHeader } from "./core/components/GlobalHeader";
import {
  workspacesApi,
  type Workspace,
} from "./modules/espacios/workspacesApi";
import {
  PanelCentralNotas,
  SidebarNavegacion,
  notesApi,
  type Note,
} from "./modules/notas";
import {
  EditorPlantilla,
  PanelPapelera,
  PanelPlantillas,
  VistaPreviaPlantilla,
  type Plantilla,
} from "./modules/papelera-plantillas";
import {
  PanelEditor,
  type PanelEditorHandle,
} from "./modules/editor/components/PanelEditor";
import { PanelRespaldos } from "./modules/respaldos";

function WorkspaceShell() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    null,
  );
  const [selectedNotebookId, setSelectedNotebookId] = useState<number | null>(
    null,
  );
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [quickAccessNotes, setQuickAccessNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Plantilla | null>(
    null,
  );
  const [templateEditorMode, setTemplateEditorMode] = useState<
    "idle" | "create" | "edit"
  >("idle");
  const [templatesRefreshKey, setTemplatesRefreshKey] = useState(0);
  const [activeView, setActiveView] = useState<
    "notas" | "papelera" | "plantillas" | "respaldos"
  >("notas");

  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible((prev) => !prev);
  }, []);

  const handleToggleFocusMode = useCallback(() => {
    setIsFocusMode((prev) => !prev);
  }, []);

  const exitFocusMode = useCallback(() => {
    setIsFocusMode(false);
  }, []);
  const [reloadAction, setReloadAction] = useState<() => void>(() => () => {});

  const panelEditorRef = useRef<PanelEditorHandle | null>(null);

  const handleCreateNewNote = useCallback(async () => {
    if (!activeWorkspace) return;

    try {
      const createdNote = await notesApi.notes.create(activeWorkspace.id, {
        notebookId: selectedNotebookId,
        title: "Sin título",
        content: "",
      });

      if (!createdNote) {
        throw new Error("No se pudo crear la nota");
      }

      setSelectedNotebookId(createdNote.notebook_id ?? selectedNotebookId);
      setSelectedNote(createdNote);
      setActiveView("notas");
      setSearchQuery("");
      window.dispatchEvent(new CustomEvent("notes:updated"));
      reloadAction();
    } catch (error) {
      console.error("Error al crear nueva nota:", error);
    }
  }, [activeWorkspace, reloadAction, selectedNotebookId]);

  const refreshQuickAccessNotes = useCallback(async () => {
    if (!activeWorkspace) {
      setQuickAccessNotes([]);
      return;
    }

    const notes = await notesApi.notes.getQuickAccess(activeWorkspace.id);
    setQuickAccessNotes(notes);
  }, [activeWorkspace]);

  const handleReloadReady = useCallback(
    (reload: () => void) => {
      setReloadAction(() => {
        return () => {
          reload();
          void refreshQuickAccessNotes();
        };
      });
    },
    [refreshQuickAccessNotes],
  );

  useEffect(() => {
    const handleHotkeys = (event: KeyboardEvent) => {
      if (event.key === "F11") {
        event.preventDefault();
        handleToggleFocusMode();
      }

      if (event.key === "Escape" && isFocusMode) {
        event.preventDefault();
        exitFocusMode();
      }
    };

    window.addEventListener("keydown", handleHotkeys);
    return () => window.removeEventListener("keydown", handleHotkeys);
  }, [exitFocusMode, handleToggleFocusMode, isFocusMode]);

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

  useEffect(() => {
    void refreshQuickAccessNotes();
  }, [refreshQuickAccessNotes]);

  useEffect(() => {
    if (activeView === "papelera") {
      setSelectedNote(null);
    }
  }, [activeView]);

  useEffect(() => {
    const handleNotesUpdated = (): void => {
      void refreshQuickAccessNotes();
    };

    window.addEventListener("notes:updated", handleNotesUpdated);
    return () => {
      window.removeEventListener("notes:updated", handleNotesUpdated);
    };
  }, [refreshQuickAccessNotes]);

  const handleNoteSelect = useCallback((note: Note): void => {
    setSelectedNote(note);
  }, []);

  const handleSelectAllNotes = useCallback(() => {
    setSelectedNote(null);
    setSelectedNotebookId(null);
    setSearchQuery("");
    reloadAction();
  }, [reloadAction]);

  const handleSelectQuickNote = useCallback(
    async (noteId: number) => {
      const note = await notesApi.notes.getById(noteId);
      if (!note) return;
      setSelectedNotebookId(note.notebook_id);
      setSelectedNote(note);
      await refreshQuickAccessNotes();
    },
    [refreshQuickAccessNotes],
  );

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
          onCreateNote={handleCreateNewNote}
          onSaveNote={handleSaveAndCloseNote}
          onReload={reloadAction}
          onToggleSidebar={toggleSidebar}
        />
      </div>

      {/* Contenedor estricto de 3 columnas */}
      <div className="flex flex-row flex-1 min-h-0 overflow-hidden">
        {!isFocusMode && isSidebarVisible && (
          <div className="w-72 h-full overflow-y-auto border-r border-gray-200 flex-shrink-0 bg-slate-50 overflow-x-hidden transition-all duration-200">
            <SidebarNavegacion
              activeWorkspace={activeWorkspace}
              onSelectNotebook={(notebookId) => {
                setSelectedNotebookId(notebookId);
                setSelectedNote(null);
                setActiveView("notas");
              }}
              onWorkspaceChange={handleWorkspaceChange}
              selectedNotebookId={selectedNotebookId}
              activeNoteId={selectedNote?.id ?? null}
              quickAccessNotes={quickAccessNotes}
              onSelectQuickNote={handleSelectQuickNote}
              onSelectAllNotes={() => {
                setActiveView("notas");
                handleSelectAllNotes();
              }}
              onSelectTrash={() => setActiveView("papelera")}
              onSelectTemplates={() => setActiveView("plantillas")}
              onSelectBackups={() => setActiveView("respaldos")}
            />
          </div>
        )}

        {!isFocusMode && activeView !== "papelera" && (
          <div
            className={`flex h-full max-h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white transition-all duration-200 ${
              activeView === "plantillas" ? "w-[360px]" : "w-80"
            }`}
          >
            {activeView === "plantillas" ? (
              <PanelPlantillas
                workspaceId={activeWorkspace?.id ?? 0}
                selectedTemplateId={selectedTemplate?.id ?? null}
                refreshTrigger={templatesRefreshKey}
                onSelectTemplate={(template) => {
                  setSelectedTemplate(template);
                  setTemplateEditorMode("idle");
                }}
                onCreateNewTemplate={() => {
                  setSelectedTemplate(null);
                  setTemplateEditorMode("create");
                }}
                onEditTemplate={(template) => {
                  setSelectedTemplate(template);
                  setTemplateEditorMode("edit");
                }}
              />
            ) : (
              <PanelCentralNotas
                key={`${activeWorkspace?.id ?? "none"}-${selectedNotebookId ?? "all"}`}
                notebookId={selectedNotebookId}
                workspaceId={activeWorkspace?.id ?? null}
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                onReloadReady={handleReloadReady}
                onNoteSelect={handleNoteSelect}
                activeNoteId={selectedNote?.id ?? null}
              />
            )}
          </div>
        )}

        <div
          className={`flex-1 h-full min-w-0 flex flex-col bg-white overflow-hidden transition-all duration-200 ${
            isFocusMode ? "max-w-none" : ""
          }`}
        >
          {activeView === "papelera" && activeWorkspace ? (
            <PanelPapelera
              workspaceId={activeWorkspace.id}
              onNotesMutated={() => {
                void refreshQuickAccessNotes();
                reloadAction();
              }}
            />
          ) : activeView === "plantillas" ? (
            templateEditorMode !== "idle" ? (
              <EditorPlantilla
                plantilla={
                  templateEditorMode === "edit" ? selectedTemplate : null
                }
                workspaceId={activeWorkspace?.id ?? 0}
                onSave={() => {
                  setTemplateEditorMode("idle");
                  setTemplatesRefreshKey((current) => current + 1);
                }}
                onCancel={() => setTemplateEditorMode("idle")}
              />
            ) : (
              <VistaPreviaPlantilla
                plantilla={selectedTemplate}
                onUseTemplate={async (plantilla) => {
                  if (!activeWorkspace) return;
                  const newNote =
                    await window.electron?.templates?.createNoteFromTemplate({
                      templateId: plantilla.id,
                      workspaceId: activeWorkspace.id,
                    });
                  if (newNote) {
                    const createdNote = newNote as Note & {
                      notebook_id?: number | null;
                    };
                    setSelectedNote(createdNote as Note);
                    setSelectedNotebookId(createdNote.notebook_id ?? null);
                    setActiveView("notas");
                    window.dispatchEvent(new CustomEvent("notes:updated"));
                  }
                }}
              />
            )
          ) : activeView === "respaldos" ? (
            <PanelRespaldos />
          ) : selectedNote ? (
            <PanelEditor
              ref={panelEditorRef}
              noteId={selectedNote.id}
              notebookId={selectedNote.notebook_id}
              workspaceId={
                selectedNote.workspace_id ?? activeWorkspace?.id ?? null
              }
              noteTitle={selectedNote.title}
              initialHTML={selectedNote.content}
              isPinned={selectedNote.is_pinned === 1}
              isQuickAccess={selectedNote.is_quick_access === 1}
              isFocusMode={isFocusMode}
              onNotesChanged={reloadAction}
              onToggleFocusMode={handleToggleFocusMode}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 bg-white p-8 text-center dark:bg-slate-950">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-50 text-purple-500 shadow-sm dark:bg-purple-950/40 dark:text-purple-400">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Selecciona o crea una nota
              </h3>
              <p className="max-w-xs text-xs text-slate-400 dark:text-slate-500">
                Elige una nota de la lista izquierda o pulsa "Nueva Nota" para
                comenzar a escribir.
              </p>
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
