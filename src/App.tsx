import { useCallback, useEffect, useState } from 'react'
import { AppWrapper } from './core'
import { workspacesApi, type Workspace } from './modules/espacios/workspacesApi'
import { PanelCentralNotas, SidebarNavegacion, type Note } from './modules/notas'
import { PanelEditor } from './modules/editor/components/PanelEditor'

function WorkspaceShell() {
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null)
  const [selectedNotebookId, setSelectedNotebookId] = useState<number | null>(null)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    let active = true

    async function loadDefaultWorkspace(): Promise<void> {
      try {
        const spaces = await workspacesApi.getAll()
        if (!active) return

        if (spaces.length === 0) {
          return
        }

        const defaultWorkspace = spaces.find((space) => space.is_default === 1) ?? spaces[0]
        if (defaultWorkspace) {
          console.log('Espacio activo inicial cargado:', defaultWorkspace.id, defaultWorkspace.name)
          setActiveWorkspace((current) => current ?? defaultWorkspace)
        }
      } catch (error) {
        console.error('No se pudo cargar el espacio activo inicial', error)
      }
    }

    if (!activeWorkspace) {
      void loadDefaultWorkspace()
    }

    return () => {
      active = false
    }
  }, [activeWorkspace])

  const handleWorkspaceChange = useCallback((workspace: Workspace): void => {
    console.log('Cambio de espacio activo:', workspace.id, workspace.name)
    setActiveWorkspace(workspace)
    setSelectedNotebookId(null)
    setSelectedNote(null)
  }, [])

  const handleNoteSelect = useCallback((note: Note): void => {
    setSelectedNote(note)
  }, [])

  return (
    <main className="flex min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      <SidebarNavegacion
        activeWorkspace={activeWorkspace}
        onSelectNotebook={(notebookId) => {
          setSelectedNotebookId(notebookId)
          setSelectedNote(null)
        }}
        onWorkspaceChange={handleWorkspaceChange}
        selectedNotebookId={selectedNotebookId}
      />
      <div className="flex flex-1 gap-4">
        <div className="w-full lg:w-1/3">
          <PanelCentralNotas
            key={`${activeWorkspace?.id ?? 'none'}-${selectedNotebookId ?? 'all'}`}
            notebookId={selectedNotebookId}
            workspaceId={activeWorkspace?.id ?? null}
            onNoteSelect={handleNoteSelect}
          />
        </div>
        <div className="w-full lg:w-2/3">
          {selectedNote ? (
            <PanelEditor
              noteId={selectedNote.id}
              notebookId={selectedNote.notebook_id}
              noteTitle={selectedNote.title}
              initialHTML={selectedNote.content}
            />
          ) : (
            <div className="flex h-full min-h-[calc(100vh-1rem)] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              <div>
                <h2 className="mb-2 text-2xl font-semibold">Selecciona o crea una nota</h2>
                <p>La nota recién creada se abrirá automáticamente aquí.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function App() {
  return (
    <AppWrapper>
      <WorkspaceShell />
    </AppWrapper>
  )
}

export default App
