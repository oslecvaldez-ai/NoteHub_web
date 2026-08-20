import { contextBridge, ipcRenderer } from "electron";

type NotebookInput = {
  name?: string;
  parentNotebookId?: number | null;
  iconType?: string | null;
  iconColor?: string | null;
  isLocked?: boolean | number | null;
  password?: string | null;
  passwordHash?: string | null;
};

type NoteInput = {
  title?: string;
  content?: string;
  notebookId?: number | null;
};

type TemplateInput = {
  workspaceId: number;
  name: string;
  content: string;
};

type ElectronApi = {
  db: {
    query: <T = Record<string, unknown>>(
      sql: string,
      params?: unknown[],
    ) => Promise<T[]>;
    exec: (
      sql: string,
      params?: unknown[],
    ) => Promise<{ changes: number; lastInsertRowid: number | bigint }>;
    getSetting: (key: string) => Promise<string | null>;
    setSetting: (key: string, value: string) => Promise<string>;
  };
  backup: {
    create: () => Promise<unknown>;
    restore: () => Promise<unknown>;
  };
  settings: {
    getAll: () => Promise<Record<string, string>>;
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<string>;
  };
  files: {
    copyImage: (sourcePath?: string | null) => Promise<string>;
    saveImage: (
      sourcePath?:
        | string
        | { name: string; mimeType: string; data: Uint8Array }
        | null,
    ) => Promise<string>;
  };
  editor: {
    saveContent: (
      noteId: number,
      content: string,
      notebookId?: number | null,
    ) => Promise<unknown>;
  };
  export: {
    toTXT: (title: string, content: string) => Promise<string | null>;
    toMD: (title: string, content: string) => Promise<string | null>;
    toHTML: (title: string, content: string) => Promise<string | null>;
    toPDF: (title: string, content: string) => Promise<string | null>;
    toNoteHub: (note: unknown) => Promise<string | null>;
    fromNoteHub: () => Promise<unknown | null>;
  };
  workspaces: {
    getAll: () => Promise<unknown[]>;
    create: (name: string) => Promise<unknown>;
    update: (id: number, name: string) => Promise<unknown>;
    delete: (id: number, mode?: "all" | "migrate") => Promise<unknown>;
    moveElement: (
      type: "note" | "notebook",
      elementId: number,
      targetWorkspaceId: number,
    ) => Promise<unknown>;
  };
  notebooks: {
    getAll: (workspaceId: number) => Promise<unknown[]>;
    create: (workspaceId: number, input: NotebookInput) => Promise<unknown>;
    update: (id: number, input: NotebookInput) => Promise<unknown>;
    delete: (id: number) => Promise<unknown>;
    getCustomCovers: () => Promise<string[]>;
    saveCustomCover: (fileName: string) => Promise<string[]>;
  };
  tags: {
    getAllForWorkspace: (workspaceId: number) => Promise<unknown[]>;
    getForNote: (noteId: number) => Promise<unknown[]>;
    setForNote: (noteId: number, tagIds: number[]) => Promise<unknown[]>;
    create: (workspaceId: number, name: string) => Promise<unknown>;
  };
  notes: {
    getById: (id: number) => Promise<unknown>;
    getByWorkspace: (
      workspaceId: number,
      notebookId?: number | null,
    ) => Promise<unknown[]>;
    getQuickAccess: (workspaceId: number) => Promise<unknown[]>;
    search: (
      workspaceId: number,
      search: string,
      notebookId?: number | null,
    ) => Promise<unknown[]>;
    create: (workspaceId: number, input: NoteInput) => Promise<unknown>;
    duplicate: (id: number) => Promise<unknown>;
    togglePin: (id: number) => Promise<unknown>;
    toggleQuickAccess: (id: number, nextStatus?: number) => Promise<unknown>;
    move: (id: number, notebookId: number | null) => Promise<unknown>;
    delete: (id: number) => Promise<unknown>;
  };
  trash: {
    getAll: (workspaceId: number) => Promise<unknown[]>;
    restore: (noteId: number) => Promise<{ success: boolean }>;
    deletePermanent: (noteId: number) => Promise<{ success: boolean }>;
    empty: (
      workspaceId: number,
    ) => Promise<{ success: boolean; count: number }>;
    getCount: (workspaceId: number) => Promise<number>;
  };
  templates: {
    getAll: (workspaceId: number) => Promise<unknown[]>;
    getById: (templateId: number) => Promise<unknown>;
    getByWorkspace: (workspaceId: number) => Promise<unknown[]>;
    create: (input: TemplateInput) => Promise<unknown>;
    update: (input: {
      id: number;
      name: string;
      content: string;
    }) => Promise<{ success: boolean }>;
    delete: (templateId: number) => Promise<{ success: boolean }>;
    createNoteFromTemplate: (input: {
      templateId: number;
      workspaceId: number;
      notebookId?: number | null;
    }) => Promise<unknown>;
  };
};

const electronApi: ElectronApi = {
  db: {
    query: (sql: string, params: unknown[] = []) =>
      ipcRenderer.invoke("db:query", sql, params),
    exec: (sql: string, params: unknown[] = []) =>
      ipcRenderer.invoke("db:exec", sql, params),
    getSetting: (key: string) => ipcRenderer.invoke("db:get-setting", key),
    setSetting: (key: string, value: string) =>
      ipcRenderer.invoke("db:set-setting", key, value),
  },
  backup: {
    create: () => ipcRenderer.invoke("backup:create"),
    restore: () => ipcRenderer.invoke("backup:restore"),
  },
  settings: {
    getAll: () => ipcRenderer.invoke("settings:get-all"),
    get: (key: string) => ipcRenderer.invoke("settings:get", key),
    set: (key: string, value: string) =>
      ipcRenderer.invoke("settings:set", key, value),
  },
  files: {
    copyImage: (sourcePath?: string | null) =>
      ipcRenderer.invoke("files:copy-image", sourcePath ?? null),
    saveImage: (
      sourcePath?:
        | string
        | { name: string; mimeType: string; data: Uint8Array }
        | null,
    ) => ipcRenderer.invoke("files:save-image", sourcePath ?? null),
  },
  editor: {
    saveContent: (
      noteId: number,
      content: string,
      notebookId?: number | null,
    ) => ipcRenderer.invoke("notes:save-content", noteId, content, notebookId),
  },
  export: {
    toTXT: (title: string, content: string) =>
      ipcRenderer.invoke("export:toTXT", title, content),
    toMD: (title: string, content: string) =>
      ipcRenderer.invoke("export:toMD", title, content),
    toHTML: (title: string, content: string) =>
      ipcRenderer.invoke("export:toHTML", title, content),
    toPDF: (title: string, content: string) =>
      ipcRenderer.invoke("export:toPDF", title, content),
    toNoteHub: (note: unknown) => ipcRenderer.invoke("export:toNoteHub", note),
    fromNoteHub: () => ipcRenderer.invoke("import:fromNoteHub"),
  },
  workspaces: {
    getAll: () => ipcRenderer.invoke("workspaces:get-all"),
    create: (name: string) => ipcRenderer.invoke("workspaces:create", name),
    update: (id: number, name: string) =>
      ipcRenderer.invoke("workspaces:update", id, name),
    delete: (id: number, mode: "all" | "migrate" = "migrate") =>
      ipcRenderer.invoke("workspaces:delete", id, mode),
    moveElement: (
      type: "note" | "notebook",
      elementId: number,
      targetWorkspaceId: number,
    ) =>
      ipcRenderer.invoke(
        "workspaces:move-element",
        type,
        elementId,
        targetWorkspaceId,
      ),
  },
  notebooks: {
    getAll: (workspaceId: number) =>
      ipcRenderer.invoke("notebooks:get-all", workspaceId),
    create: (workspaceId: number, input: unknown) =>
      ipcRenderer.invoke("notebooks:create", workspaceId, input),
    update: (id: number, input: unknown) =>
      ipcRenderer.invoke("notebooks:update", id, input),
    delete: (id: number) => ipcRenderer.invoke("notebooks:delete", id),
    getCustomCovers: () => ipcRenderer.invoke("notebooks:get-custom-covers"),
    saveCustomCover: (fileName: string) =>
      ipcRenderer.invoke("notebooks:save-custom-cover", fileName),
  },
  tags: {
    getAllForWorkspace: (workspaceId: number) =>
      ipcRenderer.invoke("tags:get-all-for-workspace", workspaceId),
    getForNote: (noteId: number) =>
      ipcRenderer.invoke("tags:get-for-note", noteId),
    setForNote: (noteId: number, tagIds: number[]) =>
      ipcRenderer.invoke("tags:set-for-note", noteId, tagIds),
    create: (workspaceId: number, name: string) =>
      ipcRenderer.invoke("tags:create", workspaceId, name),
  },
  notes: {
    getById: (id: number) => ipcRenderer.invoke("notes:get-by-id", id),
    getByWorkspace: (workspaceId: number, notebookId?: number | null) =>
      ipcRenderer.invoke("notes:get-by-workspace", workspaceId, notebookId),
    getQuickAccess: (workspaceId: number) =>
      ipcRenderer.invoke("notes:get-quick-access", workspaceId),
    search: (workspaceId: number, search: string, notebookId?: number | null) =>
      ipcRenderer.invoke("notes:search", workspaceId, search, notebookId),
    create: (workspaceId: number, input: unknown) =>
      ipcRenderer.invoke("notes:create", workspaceId, input),
    duplicate: (id: number) => ipcRenderer.invoke("notes:duplicate", id),
    togglePin: (id: number) => ipcRenderer.invoke("notes:toggle-pin", id),
    toggleQuickAccess: (id: number, nextStatus?: number) =>
      ipcRenderer.invoke("notes:toggle-quick-access", id, nextStatus),
    move: (id: number, notebookId: number | null) =>
      ipcRenderer.invoke("notes:move", id, notebookId),
    delete: (id: number) => ipcRenderer.invoke("notes:delete", id),
  },
  trash: {
    getAll: (workspaceId: number) =>
      ipcRenderer.invoke("trash:get-all", workspaceId),
    restore: (noteId: number) => ipcRenderer.invoke("trash:restore", noteId),
    deletePermanent: (noteId: number) =>
      ipcRenderer.invoke("trash:delete-permanent", noteId),
    empty: (workspaceId: number) =>
      ipcRenderer.invoke("trash:empty", workspaceId),
    getCount: (workspaceId: number) =>
      ipcRenderer.invoke("trash:get-count", workspaceId),
  },
  templates: {
    getAll: (workspaceId: number) =>
      ipcRenderer.invoke("templates:get-all", workspaceId),
    getById: (templateId: number) =>
      ipcRenderer.invoke("templates:get-by-id", templateId),
    getByWorkspace: (workspaceId: number) =>
      ipcRenderer.invoke("templates:get-by-workspace", workspaceId),
    create: (input: { workspaceId: number; name: string; content: string }) =>
      ipcRenderer.invoke("templates:create", input),
    update: (input: { id: number; name: string; content: string }) =>
      ipcRenderer.invoke("templates:update", input),
    delete: (templateId: number) =>
      ipcRenderer.invoke("templates:delete", templateId),
    createNoteFromTemplate: (input: {
      templateId: number;
      workspaceId: number;
      notebookId?: number | null;
    }) => ipcRenderer.invoke("templates:create-note-from-template", input),
  },
};

contextBridge.exposeInMainWorld("electron", electronApi);
