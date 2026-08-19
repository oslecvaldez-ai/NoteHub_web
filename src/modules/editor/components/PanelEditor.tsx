import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { TiptapEditor, type TiptapEditorHandle } from "./TiptapEditor";
import { EditorHeader } from "./EditorHeader";
import { EditorToolbar } from "./EditorToolbar";
import { OpcionesEditorModal } from "../modals/OpcionesEditorModal";
import { MenuOpcionesNotaModal } from "../modals/MenuOpcionesNotaModal";
import { TagsModal } from "../modals/TagsModal";
import { useNotifications } from "../../../core/components/useNotifications";
import { MoverEspacioModal } from "../../espacios/components/MoverEspacioModal";
import { SeleccionCuadernoModal } from "../../notas/components/SeleccionCuadernoModal";
import { notesApi, type Notebook } from "../../notas/notesApi";
import { workspacesApi, type Workspace } from "../../espacios/workspacesApi";
import { BuscadorInterno } from "./BuscadorInterno";
import { InsertarPlantillaModal } from "./InsertarPlantillaModal";
import { ConfirmacionEliminacionModal } from "../../../core/components/ConfirmacionEliminacionModal";
import { Minimize2 } from "lucide-react";

export interface PanelEditorHandle {
  saveNow: () => Promise<void>;
}

export interface PanelEditorProps {
  noteId?: number | null;
  notebookId?: number | null;
  workspaceId?: number | null;
  noteTitle?: string;
  initialHTML?: string;
  isPinned?: boolean;
  isQuickAccess?: boolean;
  isFocusMode?: boolean;
  onNotesChanged?: () => void;
  onToggleFocusMode?: () => void;
}

function extractTitleFromHTML(html: string): string {
  const headingMatch = html.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i);
  if (headingMatch?.[1]) {
    return headingMatch[1].replace(/<[^>]+>/g, "").trim();
  }
  const plain = html.replace(/<[^>]+>/g, "").trim();
  return (
    plain
      .split("\n")
      .map((line) => line.trim())
      .find(Boolean) ?? "Nota"
  );
}

function buildImagePayload(
  file: File,
): Promise<{ name: string; mimeType: string; data: Uint8Array }> {
  return file.arrayBuffer().then((buffer) => ({
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    data: new Uint8Array(buffer),
  }));
}

export const PanelEditor = forwardRef<PanelEditorHandle, PanelEditorProps>(
  function PanelEditorComponent(
    {
      noteId = null,
      notebookId = null,
      workspaceId = null,
      noteTitle = "Nota",
      initialHTML = "",
      isPinned: initialPinned = false,
      isQuickAccess: initialQuickAccess = false,
      isFocusMode = false,
      onNotesChanged,
      onToggleFocusMode,
    },
    ref,
  ) {
    const editorRef = useRef<TiptapEditorHandle | null>(null);
    const previousNoteIdRef = useRef<number | null>(noteId);
    const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);
    const [isQuickMenuOpen, setQuickMenuOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(Boolean(initialPinned));
    const [isQuickAccess, setIsQuickAccess] = useState(
      Boolean(initialQuickAccess),
    );
    const [content, setContent] = useState(initialHTML ?? "");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
    const [totalSearchResults, setTotalSearchResults] = useState(0);
    const [spaces, setSpaces] = useState<Workspace[]>([]);
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);
    const [isMoveWorkspaceOpen, setIsMoveWorkspaceOpen] = useState(false);
    const [isMoveNotebookOpen, setIsMoveNotebookOpen] = useState(false);
    const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
    const [showPlantillasModal, setShowPlantillasModal] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [editorInitialHTML, setEditorInitialHTML] = useState(
      initialHTML ?? "",
    );
    const [isImporting, setIsImporting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const saveTimeoutRef = useRef<number | null>(null);
    const { notify } = useNotifications();

    useEffect(() => {
      setIsPinned(Boolean(initialPinned));
    }, [initialPinned, noteId]);

    useEffect(() => {
      setIsQuickAccess(Boolean(initialQuickAccess));
    }, [initialQuickAccess, noteId]);

    useEffect(() => {
      if (!workspaceId) return;
      void Promise.all([
        workspacesApi.getAll(),
        notesApi.notebooks.getAll(workspaceId),
      ])
        .then(([loadedSpaces, loadedNotebooks]) => {
          setSpaces(loadedSpaces);
          setNotebooks(loadedNotebooks);
        })
        .catch((error) => {
          console.error("No se pudieron cargar espacios/cuadernos:", error);
        });
    }, [workspaceId]);

    useEffect(() => {
      if (previousNoteIdRef.current !== noteId) {
        previousNoteIdRef.current = noteId;
        const nextHTML = initialHTML ?? "";
        setContent(nextHTML);
        setEditorInitialHTML(nextHTML);
        if (noteId !== null) {
          editorRef.current?.setContentHTML(nextHTML);
        }
      }
    }, [noteId, initialHTML]);

    const resolvedTitle = useMemo(
      () => extractTitleFromHTML(content) || noteTitle || "Nota",
      [content, noteTitle],
    );

    // Guardado efectivo usando la API de Electron o persistencia
    const saveContent = useCallback(
      async (htmlToSave: string, showToast = false): Promise<void> => {
        if (noteId === null) return;

        try {
          if (window.electron?.editor?.saveContent) {
            await window.electron.editor.saveContent(
              noteId,
              htmlToSave,
              notebookId ?? null,
            );
          }
          if (showToast) {
            notify("Nota guardada correctamente", "success");
          }
        } catch (error) {
          console.error("Error guardando nota:", error);
          notify("No se pudo guardar la nota", "error");
        }
      },
      [noteId, notebookId, notify],
    );

    // Permite al padre (App.tsx) invocar el guardado inmediato al presionar el disquete
    useImperativeHandle(
      ref,
      () => ({
        saveNow: async () => {
          if (saveTimeoutRef.current) {
            window.clearTimeout(saveTimeoutRef.current);
          }
          const latestHTML = editorRef.current?.getContentHTML() ?? content;
          await saveContent(latestHTML, true);
        },
      }),
      [content, saveContent],
    );

    const handleContentUpdate = useCallback(
      (newHTML: string) => {
        setContent(newHTML);

        if (noteId === null) return;

        if (saveTimeoutRef.current) {
          window.clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = window.setTimeout(() => {
          void saveContent(newHTML, false);
        }, 1000);
      },
      [noteId, saveContent],
    );

    useEffect(() => {
      return () => {
        if (saveTimeoutRef.current) {
          window.clearTimeout(saveTimeoutRef.current);
        }
      };
    }, []);

    const handleImageSave = useCallback(
      async (source: string | File | undefined): Promise<string | null> => {
        if (!source) return null;
        try {
          const imageSource =
            typeof source === "string"
              ? source
              : await buildImagePayload(source);
          const fileName = await window.electron?.files?.saveImage?.(
            imageSource as any,
          );
          if (!fileName) return null;
          return `notehub://images/${fileName}`;
        } catch (error) {
          console.error("Error guardando imagen:", error);
          notify("No se pudo guardar la imagen", "error");
          return null;
        }
      },
      [notify],
    );

    const handleInsertImage = useCallback(async () => {
      const fileName = await window.electron?.files?.saveImage?.();
      if (!fileName) return;
      const src = `notehub://images/${fileName}`;
      editorRef.current?.runEditorCommand((ed) =>
        ed.chain().focus().setImage({ src }).run(),
      );
    }, []);

    const handleExportAction = useCallback(
      async (type: "pdf" | "txt" | "md" | "html" | "notehub") => {
        if (!content) {
          notify("No hay contenido para exportar", "warning");
          return;
        }
        setIsExporting(true);
        try {
          const title = resolvedTitle;
          let savedPath: string | null = null;
          switch (type) {
            case "pdf":
              savedPath =
                (await window.electron?.export?.toPDF(title, content)) ?? null;
              break;
            case "txt":
              savedPath =
                (await window.electron?.export?.toTXT(title, content)) ?? null;
              break;
            case "md":
              savedPath =
                (await window.electron?.export?.toMD(title, content)) ?? null;
              break;
            case "html":
              savedPath =
                (await window.electron?.export?.toHTML(title, content)) ?? null;
              break;
            case "notehub":
              savedPath =
                (await window.electron?.export?.toNoteHub({
                  id: noteId,
                  notebookId,
                  title: resolvedTitle,
                  content,
                })) ?? null;
              break;
          }
          if (savedPath) {
            notify(`Exportado correctamente a ${savedPath}`, "success");
          }
        } catch (error) {
          console.error("Error en exportación:", error);
          notify("No se pudo exportar la nota", "error");
        } finally {
          setIsExporting(false);
        }
      },
      [content, notebookId, noteId, notify, resolvedTitle],
    );

    const handleImportNoteHub = useCallback(async () => {
      setIsImporting(true);
      try {
        const importedNote = await window.electron?.export?.fromNoteHub();
        if (!importedNote || typeof importedNote !== "object") {
          notify("No se importó un contenido válido", "warning");
          return;
        }

        const importedContent =
          "content" in importedNote && typeof importedNote.content === "string"
            ? importedNote.content
            : null;

        if (importedContent) {
          setContent(importedContent);
          editorRef.current?.setContentHTML(importedContent);
          notify("Nota importada correctamente", "success");
        } else {
          notify("El archivo no tiene contenido procesable", "warning");
        }
      } catch (error) {
        console.error("Error importando nota:", error);
        notify("No se pudo importar el archivo", "error");
      } finally {
        setIsImporting(false);
      }
    }, [notify]);

    const handleTogglePin = useCallback(async () => {
      if (noteId === null) return;

      try {
        const updatedNote = (await window.electron?.notes?.togglePin?.(
          noteId,
        )) as { is_pinned?: number } | undefined;
        const nextPinned = updatedNote
          ? updatedNote.is_pinned === 1
          : !isPinned;
        setIsPinned(nextPinned);
        onNotesChanged?.();
        notify(
          nextPinned
            ? "Nota fijada correctamente"
            : "Nota desfijada correctamente",
          "success",
        );
      } catch (error) {
        console.error("Error al fijar/desfijar nota:", error);
        notify("No se pudo actualizar el estado de fijado", "error");
      }
    }, [isPinned, noteId, notify, onNotesChanged]);

    const handleDuplicateNote = useCallback(async () => {
      if (noteId === null) return;

      try {
        const duplicatedNote = (await window.electron?.notes?.duplicate?.(
          noteId,
        )) as { title?: string } | undefined;
        if (!duplicatedNote) {
          notify("No se pudo duplicar la nota", "warning");
          return;
        }

        onNotesChanged?.();
        notify(
          `Nota duplicada como "${duplicatedNote.title ?? "copia"}"`,
          "success",
        );
      } catch (error) {
        console.error("Error al duplicar la nota:", error);
        notify("No se pudo duplicar la nota", "error");
      }
    }, [noteId, notify]);

    const handleStar = useCallback(async () => {
      if (noteId === null) return;

      try {
        const updatedNote = (await window.electron?.notes?.toggleQuickAccess?.(
          noteId,
        )) as { is_quick_access?: number } | undefined;
        const nextQuickAccess = updatedNote
          ? updatedNote.is_quick_access === 1
          : !isQuickAccess;
        setIsQuickAccess(nextQuickAccess);
        onNotesChanged?.();
        notify(
          nextQuickAccess
            ? "Nota añadida a Acceso rápido"
            : "Nota quitada de Acceso rápido",
          "success",
        );
      } catch (error) {
        console.error("Error al actualizar Acceso rápido:", error);
        notify("No se pudo actualizar Acceso rápido", "error");
      }
    }, [isQuickAccess, noteId, notify, onNotesChanged]);

    const handleShare = useCallback(() => {
      console.log("Compartir nota");
    }, []);

    const handleHistory = useCallback(() => {
      console.log("Abrir historial");
    }, []);

    const handleExternal = useCallback(() => {
      console.log("Abrir externamente");
    }, []);

    const handleMenu = useCallback(() => {
      setQuickMenuOpen(true);
    }, []);

    const handleOpenExport = useCallback(() => {
      setQuickMenuOpen(false);
      setOptionsModalOpen(true);
    }, []);

    const countMatchingTerms = useCallback((html: string, query: string) => {
      const normalizedQuery = query.trim();
      if (!normalizedQuery) return 0;
      const pattern = new RegExp(
        normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "gi",
      );
      return (html.match(pattern) ?? []).length;
    }, []);

    useEffect(() => {
      const nextTotal = countMatchingTerms(content, searchQuery);
      setTotalSearchResults(nextTotal);
      setCurrentSearchIndex((current) =>
        nextTotal === 0 ? 0 : Math.min(current, nextTotal - 1),
      );
    }, [content, countMatchingTerms, searchQuery]);

    const handleOpenSearch = useCallback(() => {
      setIsSearchOpen(true);
    }, []);

    const handleCopyToTemplates = useCallback(async () => {
      if (!noteId || !workspaceId) return;
      try {
        const template = await window.electron?.templates?.create({
          workspaceId,
          name: noteTitle || resolvedTitle || "Plantilla",
          content: content,
        });
        if (!template) {
          notify("No se pudo crear la plantilla", "error");
          return;
        }
        window.dispatchEvent(new CustomEvent("templates:updated"));
        notify("Plantilla creada a partir de la nota", "success");
      } catch (error) {
        console.error("Error creando plantilla:", error);
        notify("No se pudo crear la plantilla", "error");
      }
    }, [content, noteId, noteTitle, notify, resolvedTitle, workspaceId]);

    const handleDeleteNote = useCallback(() => {
      if (!noteId) return;
      setIsDeleteConfirmOpen(true);
    }, [noteId]);

    const handleConfirmDeleteNote = useCallback(async () => {
      if (!noteId) return;
      try {
        await window.electron?.notes?.delete(noteId);
        window.dispatchEvent(new CustomEvent("notes:updated"));
        window.dispatchEvent(new CustomEvent("trash:updated"));
        notify("Nota enviada a la papelera", "success");
        setIsDeleteConfirmOpen(false);
        onNotesChanged?.();
      } catch (error) {
        console.error("Error eliminando nota:", error);
        notify("No se pudo enviar la nota a la papelera", "error");
      }
    }, [noteId, notify, onNotesChanged]);

    const handleToggleFocusMode = useCallback(() => {
      onToggleFocusMode?.();
    }, [onToggleFocusMode]);

    const handleClearFormat = useCallback(() => {
      editorRef.current?.clearFormat();
      notify("Formato de texto limpiado", "success");
    }, [notify]);

    const handleSearch = useCallback((value: string) => {
      setSearchQuery(value);
      if (value.trim()) setIsSearchOpen(true);
    }, []);

    const handleSearchNext = useCallback(() => {
      if (!totalSearchResults) return;
      setCurrentSearchIndex((current) =>
        current >= totalSearchResults - 1 ? 0 : current + 1,
      );
    }, [totalSearchResults]);

    const handleSearchPrev = useCallback(() => {
      if (!totalSearchResults) return;
      setCurrentSearchIndex((current) =>
        current <= 0 ? totalSearchResults - 1 : current - 1,
      );
    }, [totalSearchResults]);

    const handleMoveWorkspace = useCallback(async () => {
      if (!noteId) return;
      setQuickMenuOpen(false);
      setIsMoveWorkspaceOpen(true);
    }, [noteId]);

    const handleMoveNotebook = useCallback(async () => {
      if (!noteId) return;
      setQuickMenuOpen(false);
      setIsMoveNotebookOpen(true);
    }, [noteId]);

    const handleManageTags = useCallback(async () => {
      if (!noteId || !workspaceId) return;
      setQuickMenuOpen(false);
      setIsTagsModalOpen(true);
    }, [noteId, workspaceId]);

    const handleMoveToWorkspace = useCallback(
      async (targetWorkspaceId: number) => {
        if (!noteId) return;
        try {
          await window.electron?.workspaces?.moveElement(
            "note",
            noteId,
            targetWorkspaceId,
          );
          onNotesChanged?.();
          notify("Nota movida al espacio seleccionado", "success");
        } catch (error) {
          console.error("Error moviendo nota de espacio:", error);
          notify("No se pudo mover la nota a ese espacio", "error");
        }
      },
      [noteId, notify, onNotesChanged],
    );

    const handleMoveToNotebook = useCallback(
      async (targetNotebookId: number | null) => {
        if (!noteId) return;
        try {
          await window.electron?.notes?.move(noteId, targetNotebookId);
          onNotesChanged?.();
          notify("Nota movida al cuaderno seleccionado", "success");
        } catch (error) {
          console.error("Error moviendo nota a cuaderno:", error);
          notify("No se pudo mover la nota a ese cuaderno", "error");
        }
      },
      [noteId, notify, onNotesChanged],
    );

    const handleInsertTable = useCallback((r?: number, c?: number) => {
      const rows = r ?? 2;
      const cols = c ?? 2;
      editorRef.current?.runEditorCommand((ed) =>
        ed
          .chain()
          .focus()
          .insertTable({ rows, cols, withHeaderRow: false })
          .run(),
      );
    }, []);

    const formatDateValue = useCallback(
      (type: "datetime" | "date" | "time"): string => {
        const now = new Date();

        if (type === "datetime") {
          const datePart = new Intl.DateTimeFormat("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
            .format(now)
            .replace(/\./g, "");
          const timePart = new Intl.DateTimeFormat("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(now);
          return `${datePart}, ${timePart}`;
        }

        if (type === "date") {
          return new Intl.DateTimeFormat("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
            .format(now)
            .replace(/\./g, "");
        }

        return new Intl.DateTimeFormat("es-ES", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(now);
      },
      [],
    );

    const handleInsertDate = useCallback(
      (type: "datetime" | "date" | "time" = "datetime") => {
        editorRef.current?.insertContent(formatDateValue(type));
      },
      [formatDateValue],
    );

    useEffect(() => {
      const handleKeyboardShortcuts = (event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
        const isModifierPressed = event.ctrlKey || event.metaKey;

        if (!editorRef.current?.isFocused()) {
          if (event.key === "Escape" && isSearchOpen) {
            setIsSearchOpen(false);
            setSearchQuery("");
          }
          return;
        }

        if (isModifierPressed && key === "f") {
          event.preventDefault();
          setIsSearchOpen(true);
        }

        if (event.key === "F11") {
          event.preventDefault();
          onToggleFocusMode?.();
        }

        if (
          event.altKey &&
          isModifierPressed &&
          event.shiftKey &&
          (key === "d" || key === "D")
        ) {
          event.preventDefault();
          handleInsertDate("time");
          return;
        }

        if (
          isModifierPressed &&
          event.shiftKey &&
          !event.altKey &&
          (key === "d" || key === "D")
        ) {
          event.preventDefault();
          handleInsertDate("date");
          return;
        }

        if (
          isModifierPressed &&
          !event.shiftKey &&
          !event.altKey &&
          (key === "d" || key === "D")
        ) {
          event.preventDefault();
          handleInsertDate("datetime");
          return;
        }

        if (event.key === "Escape" && isSearchOpen) {
          setIsSearchOpen(false);
          setSearchQuery("");
        }
      };

      window.addEventListener("keydown", handleKeyboardShortcuts);
      return () =>
        window.removeEventListener("keydown", handleKeyboardShortcuts);
    }, [handleInsertDate, isSearchOpen, onToggleFocusMode]);

    const handleInsertTemplateContent = useCallback(
      (templateContent: string) => {
        editorRef.current?.runEditorCommand((ed) => {
          ed.chain()
            .focus(undefined, { scrollIntoView: false })
            .insertContent(templateContent)
            .run();
        });
      },
      [],
    );

    if (isFocusMode) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white dark:bg-slate-950">
          <div className="fixed top-4 right-6 z-50 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFocusMode?.()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Minimize2 className="h-3.5 w-3.5" />
              Salir del modo foco
            </button>
          </div>

          <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 md:px-8 md:py-10">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <TiptapEditor
                ref={editorRef}
                initialHTML={editorInitialHTML}
                searchQuery={searchQuery}
                editable={false}
                onUpdate={handleContentUpdate}
                onImageDrop={async (file) => {
                  const src = await handleImageSave(file);
                  if (src) {
                    editorRef.current?.runEditorCommand((ed) =>
                      ed.chain().focus().setImage({ src }).run(),
                    );
                  }
                  return src;
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col h-full w-full bg-white overflow-hidden dark:bg-slate-950">
        <div className="flex-shrink-0 w-full bg-white z-10 dark:bg-slate-950">
          <EditorHeader
            title={resolvedTitle}
            onPin={handleTogglePin}
            onStar={handleStar}
            onShare={handleShare}
            onHistory={handleHistory}
            onExternal={handleExternal}
            onMenu={handleMenu}
            onToggleFocusMode={handleToggleFocusMode}
            isPinned={isPinned}
            isQuickAccess={isQuickAccess}
          />
        </div>

        <div className="flex-1 w-full overflow-y-auto min-h-0 relative bg-white transition-colors duration-200 dark:bg-slate-950">
          <TiptapEditor
            ref={editorRef}
            initialHTML={editorInitialHTML}
            searchQuery={searchQuery}
            onUpdate={handleContentUpdate}
            onImageDrop={async (file) => {
              const src = await handleImageSave(file);
              if (src) {
                editorRef.current?.runEditorCommand((ed) =>
                  ed.chain().focus().setImage({ src }).run(),
                );
              }
              return src;
            }}
          />
        </div>

        <div className="flex-shrink-0 w-full flex flex-col bg-white border-t border-gray-200 z-10 dark:bg-slate-950 dark:border-slate-800/80">
          <EditorToolbar
            editor={editorRef.current}
            onInsertTable={handleInsertTable}
            onInsertImage={handleInsertImage}
            onInsertDate={handleInsertDate}
            onOpenPlantillas={() => setShowPlantillasModal(true)}
          />
          <footer className="w-full flex items-center justify-between border-t border-gray-100 bg-white px-4 py-2.5 text-sm text-slate-600 transition-colors duration-200 dark:border-slate-800/60 dark:bg-slate-950 dark:text-slate-400">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:border dark:border-slate-800/60">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                📄
              </span>
              <span className="text-xs font-medium">
                {notebookId ? `Cuaderno ${notebookId}` : "Sin cuaderno"}
              </span>
            </div>
          </footer>
        </div>

        {isQuickMenuOpen && (
          <MenuOpcionesNotaModal
            onClose={() => setQuickMenuOpen(false)}
            onTogglePin={handleTogglePin}
            onDuplicate={handleDuplicateNote}
            onOpenExport={handleOpenExport}
            onOpenSearch={handleOpenSearch}
            onToggleFocusMode={handleToggleFocusMode}
            onClearFormat={handleClearFormat}
            onMoveWorkspace={handleMoveWorkspace}
            onMoveNotebook={handleMoveNotebook}
            onManageTags={handleManageTags}
            onCopyToTemplates={handleCopyToTemplates}
            onDeleteNote={handleDeleteNote}
            isPinned={isPinned}
          />
        )}

        {isDeleteConfirmOpen && (
          <ConfirmacionEliminacionModal
            isOpen={isDeleteConfirmOpen}
            title="Eliminar nota"
            message="¿Estás seguro de que deseas enviar esta nota a la papelera?"
            onCancel={() => setIsDeleteConfirmOpen(false)}
            onConfirm={() => void handleConfirmDeleteNote()}
            confirmLabel="Eliminar"
            cancelLabel="Cancelar"
          />
        )}

        {showPlantillasModal && (
          <InsertarPlantillaModal
            isOpen={showPlantillasModal}
            workspaceId={workspaceId}
            onClose={() => setShowPlantillasModal(false)}
            onSelectTemplate={handleInsertTemplateContent}
          />
        )}

        {isSearchOpen && (
          <BuscadorInterno
            query={searchQuery}
            currentIndex={currentSearchIndex}
            totalResults={totalSearchResults}
            onSearch={handleSearch}
            onNext={handleSearchNext}
            onPrev={handleSearchPrev}
            onClose={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
            }}
          />
        )}

        {isMoveWorkspaceOpen && noteId && (
          <MoverEspacioModal
            isOpen={isMoveWorkspaceOpen}
            spaces={spaces}
            currentWorkspaceId={workspaceId ?? 0}
            elementId={noteId}
            elementType="note"
            onClose={() => setIsMoveWorkspaceOpen(false)}
            onMoved={handleMoveToWorkspace}
          />
        )}

        {isMoveNotebookOpen && noteId && (
          <SeleccionCuadernoModal
            isOpen={isMoveNotebookOpen}
            notebooks={notebooks}
            currentNotebookId={notebookId}
            onClose={() => setIsMoveNotebookOpen(false)}
            onSelect={(targetNotebookId) => {
              void handleMoveToNotebook(targetNotebookId);
              setIsMoveNotebookOpen(false);
            }}
          />
        )}

        {isTagsModalOpen && noteId && workspaceId && (
          <TagsModal
            isOpen={isTagsModalOpen}
            workspaceId={workspaceId}
            noteId={noteId}
            onClose={() => setIsTagsModalOpen(false)}
            onSaved={() => onNotesChanged?.()}
          />
        )}

        {isOptionsModalOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40" />
            <OpcionesEditorModal
              onClose={() => setOptionsModalOpen(false)}
              onExportToPDF={() => handleExportAction("pdf")}
              onExportToTXT={() => handleExportAction("txt")}
              onExportToMD={() => handleExportAction("md")}
              onExportToHTML={() => handleExportAction("html")}
              onExportToNoteHub={() => handleExportAction("notehub")}
              onImportNoteHub={handleImportNoteHub}
              isProcessing={isExporting || isImporting}
            />
          </>
        )}
      </div>
    );
  },
);
