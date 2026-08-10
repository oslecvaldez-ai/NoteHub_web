import { useCallback, useEffect, useState } from 'react'
import { AppWrapper } from './core'
import { workspacesApi, type Workspace } from './modules/espacios/workspacesApi'
import { PanelCentralNotas, SidebarNavegacion } from './modules/notas'

function WorkspaceShell() {
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null)
  const [selectedNotebookId, setSelectedNotebookId] = useState<number | null>(null)

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
  }, [])

  return (
    <main className="flex min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      <SidebarNavegacion
        activeWorkspace={activeWorkspace}
        onSelectNotebook={setSelectedNotebookId}
        onWorkspaceChange={handleWorkspaceChange}
        selectedNotebookId={selectedNotebookId}
      />
      <PanelCentralNotas
        key={`${activeWorkspace?.id ?? 'none'}-${selectedNotebookId ?? 'all'}`}
        notebookId={selectedNotebookId}
        workspaceId={activeWorkspace?.id ?? null}
      />
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
