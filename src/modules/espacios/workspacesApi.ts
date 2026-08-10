export interface Workspace {
  id: number
  name: string
  is_default: number
  color_hex: string
  is_locked: number
  password_hash: string | null
  created_at: string
}

export type WorkspaceElementType = 'note' | 'notebook'

interface WorkspacesApi {
  getAll: () => Promise<Workspace[]>
  create: (name: string) => Promise<Workspace | undefined>
  update: (id: number, name: string) => Promise<Workspace | undefined>
  delete: (id: number) => Promise<{ id: number }>
  moveElement: (
    type: WorkspaceElementType,
    elementId: number,
    targetWorkspaceId: number,
  ) => Promise<{ type: WorkspaceElementType; elementId: number; targetWorkspaceId: number }>
}

type WorkspaceWindow = Window & {
  electron?: {
    workspaces?: WorkspacesApi
  }
}

function getApi(): WorkspacesApi | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  const api = (window as WorkspaceWindow).electron?.workspaces
  if (!api) {
    console.error('Electron workspace API not available in this runtime')
  }

  return api
}

export const workspacesApi = {
  getAll: async (): Promise<Workspace[]> => {
    const api = getApi()
    if (!api) {
      throw new Error('La API de Electron no está disponible. Abre la app desde Electron para gestionar espacios.')
    }

    return (await api.getAll()) ?? []
  },
  create: async (name: string): Promise<Workspace | undefined> => {
    const api = getApi()
    if (!api) {
      throw new Error('La API de Electron no está disponible. Abre la app desde Electron para gestionar espacios.')
    }

    return api.create(name)
  },
  update: async (id: number, name: string): Promise<Workspace | undefined> => {
    const api = getApi()
    if (!api) {
      throw new Error('La API de Electron no está disponible. Abre la app desde Electron para gestionar espacios.')
    }

    return api.update(id, name)
  },
  delete: async (id: number): Promise<{ id: number }> => {
    const api = getApi()
    if (!api) {
      throw new Error('La API de Electron no está disponible. Abre la app desde Electron para gestionar espacios.')
    }

    const result = await api.delete(id)
    return result ?? { id }
  },
  moveElement: async (
    type: WorkspaceElementType,
    elementId: number,
    targetWorkspaceId: number,
  ): Promise<{ type: WorkspaceElementType; elementId: number; targetWorkspaceId: number }> => {
    const api = getApi()
    if (!api) {
      throw new Error('La API de Electron no está disponible. Abre la app desde Electron para gestionar espacios.')
    }

    const result = await api.moveElement(type, elementId, targetWorkspaceId)
    return result ?? { type, elementId, targetWorkspaceId }
  },
}
