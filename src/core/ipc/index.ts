export interface DatabaseRow {
  [column: string]: unknown;
}

export interface DatabaseRunResult {
  changes: number;
  lastInsertRowid: number | bigint;
}

export interface ImagePayload {
  name: string;
  mimeType: string;
  data: Uint8Array;
}

export interface ElectronApi {
  db: {
    query<T extends DatabaseRow = DatabaseRow>(
      sql: string,
      params?: unknown[],
    ): Promise<T[]>;
    exec(sql: string, params?: unknown[]): Promise<DatabaseRunResult>;
    getSetting(key: string): Promise<string | null>;
    setSetting(key: string, value: string): Promise<string>;
  };
  files: {
    copyImage(sourcePath?: string | null): Promise<string>;
    saveImage(
      sourcePath?: string | File | ImagePayload | null,
    ): Promise<string>;
  };
  editor: {
    saveContent(
      noteId: number,
      content: string,
      notebookId?: number | null,
    ): Promise<unknown>;
  };
  workspaces: {
    getAll: () => Promise<unknown[]>;
    create: (name: string) => Promise<unknown>;
    update: (id: number, name: string) => Promise<unknown>;
    delete: (id: number) => Promise<unknown>;
    moveElement: (
      type: "note" | "notebook",
      elementId: number,
      targetWorkspaceId: number,
    ) => Promise<unknown>;
  };
  notebooks: {
    getAll: (workspaceId: number) => Promise<unknown[]>;
    create: (workspaceId: number, input: unknown) => Promise<unknown>;
    update: (id: number, input: unknown) => Promise<unknown>;
    delete: (id: number) => Promise<unknown>;
  };
  tags: {
    getAllForWorkspace: (workspaceId: number) => Promise<unknown[]>;
    getForNote: (noteId: number) => Promise<unknown[]>;
    setForNote: (noteId: number, tagIds: number[]) => Promise<unknown[]>;
    create: (workspaceId: number, name: string) => Promise<unknown>;
  };
  notes: {
    getById(id: number): Promise<unknown>;
    getByWorkspace(
      workspaceId: number,
      notebookId?: number | null,
    ): Promise<unknown[]>;
    getQuickAccess(workspaceId: number): Promise<unknown[]>;
    search(
      workspaceId: number,
      search: string,
      notebookId?: number | null,
    ): Promise<unknown[]>;
    create(workspaceId: number, input: unknown): Promise<unknown>;
    duplicate(id: number): Promise<unknown>;
    togglePin(id: number): Promise<unknown>;
    toggleQuickAccess(id: number, nextStatus?: number): Promise<unknown>;
    move(id: number, notebookId: number | null): Promise<unknown>;
    delete(id: number): Promise<unknown>;
  };
  templates: {
    getByWorkspace(workspaceId: number): Promise<unknown[]>;
    create(input: {
      workspaceId: number;
      name: string;
      content: string;
    }): Promise<unknown>;
  };
  export: {
    toTXT(title: string, content: string): Promise<string | null>;
    toMD(title: string, content: string): Promise<string | null>;
    toHTML(title: string, content: string): Promise<string | null>;
    toPDF(title: string, content: string): Promise<string | null>;
    toNoteHub(note: unknown): Promise<string | null>;
    fromNoteHub(): Promise<unknown | null>;
  };
}

declare global {
  interface Window {
    electron?: ElectronApi;
  }
}

const browserSettings = new Map<string, string>();

function getElectronApi(): ElectronApi | undefined {
  return typeof window !== "undefined" ? window.electron : undefined;
}

export const db = {
  query<T extends DatabaseRow = DatabaseRow>(
    sql: string,
    params: unknown[] = [],
  ): Promise<T[]> {
    const api = getElectronApi();
    return api ? api.db.query<T>(sql, params) : Promise.resolve([]);
  },
  exec(sql: string, params: unknown[] = []): Promise<DatabaseRunResult> {
    const api = getElectronApi();
    return api
      ? api.db.exec(sql, params)
      : Promise.resolve({ changes: 0, lastInsertRowid: 0 });
  },
  getSetting(key: string): Promise<string | null> {
    const api = getElectronApi();
    return api
      ? api.db.getSetting(key)
      : Promise.resolve(browserSettings.get(key) ?? null);
  },
  setSetting(key: string, value: string): Promise<string> {
    browserSettings.set(key, value);
    const api = getElectronApi();
    return api ? api.db.setSetting(key, value) : Promise.resolve(value);
  },
};

export const files = {
  copyImage(sourcePath?: string | null): Promise<string> {
    const api = getElectronApi();
    return api
      ? api.files.copyImage(sourcePath)
      : Promise.resolve(sourcePath ?? "");
  },
  saveImage(sourcePath?: string | File | ImagePayload | null): Promise<string> {
    const api = getElectronApi();
    if (!api) {
      return Promise.resolve(
        typeof sourcePath === "string"
          ? (sourcePath ?? "")
          : (sourcePath?.name ?? ""),
      );
    }

    if (!sourcePath) {
      return api.files.saveImage(null);
    }

    if (typeof sourcePath === "string") {
      return api.files.saveImage(sourcePath);
    }

    if (sourcePath instanceof File) {
      return sourcePath.arrayBuffer().then((buffer) =>
        api.files.saveImage({
          name: sourcePath.name,
          mimeType: sourcePath.type || "application/octet-stream",
          data: new Uint8Array(buffer),
        }),
      );
    }

    return api.files.saveImage(sourcePath);
  },
};

export const editor = {
  saveContent(
    noteId: number,
    content: string,
    notebookId?: number | null,
  ): Promise<unknown> {
    const api = getElectronApi();
    return api
      ? api.editor.saveContent(noteId, content, notebookId)
      : Promise.resolve(null);
  },
};

export const exporter = {
  toTXT(title: string, content: string): Promise<string | null> {
    const api = getElectronApi();
    return api ? api.export.toTXT(title, content) : Promise.resolve(null);
  },
  toMD(title: string, content: string): Promise<string | null> {
    const api = getElectronApi();
    return api ? api.export.toMD(title, content) : Promise.resolve(null);
  },
  toHTML(title: string, content: string): Promise<string | null> {
    const api = getElectronApi();
    return api ? api.export.toHTML(title, content) : Promise.resolve(null);
  },
  toPDF(title: string, content: string): Promise<string | null> {
    const api = getElectronApi();
    return api ? api.export.toPDF(title, content) : Promise.resolve(null);
  },
  toNoteHub(note: unknown): Promise<string | null> {
    const api = getElectronApi();
    return api ? api.export.toNoteHub(note) : Promise.resolve(null);
  },
  fromNoteHub(): Promise<unknown | null> {
    const api = getElectronApi();
    return api ? api.export.fromNoteHub() : Promise.resolve(null);
  },
};
