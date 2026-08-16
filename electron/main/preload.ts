import { contextBridge, ipcRenderer } from "electron";

console.log("--- PRELOAD CARGADO CORRECTAMENTE ---");

const electronApi = {
  db: {
    query: (sql: string, params: unknown[] = []) =>
      ipcRenderer.invoke("db:query", sql, params),
    exec: (sql: string, params: unknown[] = []) =>
      ipcRenderer.invoke("db:exec", sql, params),
    getSetting: (key: string) => ipcRenderer.invoke("db:get-setting", key),
    setSetting: (key: string, value: string) =>
      ipcRenderer.invoke("db:set-setting", key, value),
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
    delete: (id: number) => ipcRenderer.invoke("workspaces:delete", id),
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
  templates: {
    getByWorkspace: (workspaceId: number) =>
      ipcRenderer.invoke("templates:get-by-workspace", workspaceId),
    create: (input: { workspaceId: number; name: string; content: string }) =>
      ipcRenderer.invoke("templates:create", input),
  },
};

contextBridge.exposeInMainWorld("electron", electronApi);
