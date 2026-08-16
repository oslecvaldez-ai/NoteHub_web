export interface Notebook {
  id: number;
  workspace_id: number;
  parent_notebook_id: number | null;
  name: string;
  icon_type: string | null;
  icon_color: string | null;
  is_locked: number;
  password_hash: string | null;
  note_count: number;
  created_at: string;
}

export interface Note {
  id: number;
  workspace_id: number;
  notebook_id: number | null;
  title: string;
  content: string;
  is_pinned: number;
  is_quick_access: number;
  is_deleted: number;
  pinned_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotebookInput {
  name: string;
  parentNotebookId?: number | null;
  iconType?: string | null;
  iconColor?: string | null;
  isLocked?: boolean | number | null;
  password?: string | null;
  passwordHash?: string | null;
}

export interface NoteInput {
  title?: string;
  content?: string;
  notebookId?: number | null;
}

interface NotesElectronApi {
  notebooks: {
    getAll: (workspaceId: number) => Promise<Notebook[]>;
    create: (
      workspaceId: number,
      input: NotebookInput,
    ) => Promise<Notebook | undefined>;
    update: (id: number, input: NotebookInput) => Promise<Notebook | undefined>;
    delete: (id: number) => Promise<{ id: number }>;
  };
  notes: {
    getById: (id: number) => Promise<Note | undefined>;
    getByWorkspace: (
      workspaceId: number,
      notebookId?: number | null,
    ) => Promise<Note[]>;
    getQuickAccess: (workspaceId: number) => Promise<Note[]>;
    search: (
      workspaceId: number,
      search: string,
      notebookId?: number | null,
    ) => Promise<Note[]>;
    create: (
      workspaceId: number,
      input: NoteInput,
    ) => Promise<Note | undefined>;
    duplicate: (id: number) => Promise<Note | undefined>;
    togglePin: (id: number) => Promise<Note | undefined>;
    toggleQuickAccess: (
      id: number,
      nextStatus?: number,
    ) => Promise<Note | undefined>;
    move: (id: number, notebookId: number | null) => Promise<Note | undefined>;
    delete: (id: number) => Promise<Note | undefined>;
  };
}

type NotesWindow = Window & { electron?: Partial<NotesElectronApi> };

function getApi(): Partial<NotesElectronApi> | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as NotesWindow).electron;
}

export const notesApi = {
  notebooks: {
    getAll: async (workspaceId: number): Promise<Notebook[]> =>
      (await getApi()?.notebooks?.getAll(workspaceId)) ?? [],
    create: async (
      workspaceId: number,
      input: NotebookInput,
    ): Promise<Notebook | undefined> =>
      getApi()?.notebooks?.create(workspaceId, input),
    update: async (
      id: number,
      input: NotebookInput,
    ): Promise<Notebook | undefined> => getApi()?.notebooks?.update(id, input),
    delete: async (id: number): Promise<{ id: number }> =>
      (await getApi()?.notebooks?.delete(id)) ?? { id },
  },
  notes: {
    getById: async (id: number): Promise<Note | undefined> =>
      getApi()?.notes?.getById(id) as Note | undefined,
    getByWorkspace: async (
      workspaceId: number,
      notebookId?: number | null,
    ): Promise<Note[]> =>
      (await getApi()?.notes?.getByWorkspace(workspaceId, notebookId)) ?? [],
    getQuickAccess: async (workspaceId: number): Promise<Note[]> =>
      (await getApi()?.notes?.getQuickAccess(workspaceId)) ?? [],
    search: async (
      workspaceId: number,
      search: string,
      notebookId?: number | null,
    ): Promise<Note[]> =>
      (await getApi()?.notes?.search(workspaceId, search, notebookId)) ?? [],
    create: async (
      workspaceId: number,
      input: NoteInput,
    ): Promise<Note | undefined> => getApi()?.notes?.create(workspaceId, input),
    duplicate: async (id: number): Promise<Note | undefined> =>
      getApi()?.notes?.duplicate(id),
    togglePin: async (id: number): Promise<Note | undefined> =>
      getApi()?.notes?.togglePin(id),
    toggleQuickAccess: async (
      id: number,
      nextStatus?: number,
    ): Promise<Note | undefined> =>
      getApi()?.notes?.toggleQuickAccess(id, nextStatus),
    move: async (
      id: number,
      notebookId: number | null,
    ): Promise<Note | undefined> => getApi()?.notes?.move(id, notebookId),
    delete: async (id: number): Promise<Note | undefined> =>
      getApi()?.notes?.delete(id),
  },
};
