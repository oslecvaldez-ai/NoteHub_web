import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TiptapEditor, type TiptapEditorHandle } from "./TiptapEditor";
import { EditorHeader } from "./EditorHeader";
import { EditorToolbar } from "./EditorToolbar";
import { OpcionesEditorModal } from "../modals/OpcionesEditorModal";
import { useNotifications } from "../../../core/components/useNotifications";
import { Info, Printer } from "lucide-react";

export interface PanelEditorProps {
  noteId?: number | null;
  notebookId?: number | null;
  noteTitle?: string;
  initialHTML?: string;
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

export function PanelEditor({
  noteId = null,
  notebookId = null,
  noteTitle = "Nota",
  initialHTML = "",
}: PanelEditorProps) {
  const editorRef = useRef<TiptapEditorHandle | null>(null);
  const previousNoteIdRef = useRef<number | null>(noteId);
  const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);
  const [content, setContent] = useState(initialHTML ?? "");
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const saveTimeoutRef = useRef<number | null>(null);
  const { notify } = useNotifications();

  // Sincronizar contenido inicial al cambiar de nota
  useEffect(() => {
    setContent(initialHTML ?? "");
    if (previousNoteIdRef.current !== noteId) {
      previousNoteIdRef.current = noteId;
      if (noteId !== null) {
        editorRef.current?.setContentHTML(initialHTML ?? "");
      }
    }
  }, [noteId, initialHTML]);

  const resolvedTitle = useMemo(
    () => extractTitleFromHTML(content) || noteTitle || "Nota",
    [content, noteTitle],
  );

  // Función de guardado directo
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

  // Manejador de cambios con auto-guardado con debounce
  const handleContentUpdate = useCallback(
    (newHTML: string) => {
      setContent(newHTML);

      if (noteId === null) return;

      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }

      // Guardar automáticamente 1 segundo después de dejar de escribir
      saveTimeoutRef.current = window.setTimeout(() => {
        void saveContent(newHTML, false);
      }, 1000);
    },
    [noteId, saveContent],
  );

  // Guardar al desmontar o cambiar de nota
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
          typeof source === "string" ? source : await buildImagePayload(source);
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
    editorRef.current?.insertContent(
      `<img src="notehub://images/${fileName}" alt="Imagen" />`,
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

  const handleTogglePin = useCallback(() => {
    console.log("Fijar editor");
  }, []);

  const handleStar = useCallback(() => {
    console.log("Marcar como favorito");
  }, []);

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
    setOptionsModalOpen(true);
  }, []);

  const handleInsertTable = useCallback(() => {
    editorRef.current?.insertContent(
      "<table><tbody><tr><td></td><td></td></tr></tbody></table>",
    );
  }, []);

  const handleInsertDate = useCallback(() => {
    const now = new Date().toLocaleDateString("es-ES");
    editorRef.current?.insertContent(now);
  }, []);

  const handleInsertEmoji = useCallback((emoji: string) => {
    editorRef.current?.insertContent(emoji);
  }, []);

  const handleInsertSubscript = useCallback(() => {
    editorRef.current?.runEditorCommand((editor) =>
      editor.chain().focus().insertContent("<sub>x</sub>").run(),
    );
  }, []);

  const handleInsertSuperscript = useCallback(() => {
    editorRef.current?.runEditorCommand((editor) =>
      editor.chain().focus().insertContent("<sup>x</sup>").run(),
    );
  }, []);

  const handleInsertFunction = useCallback(() => {
    editorRef.current?.runEditorCommand((editor) =>
      editor.chain().focus().insertContent("f(x)").run(),
    );
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-white overflow-hidden">
      {/* Cabecera Fija */}
      <div className="flex-shrink-0 w-full bg-white z-10">
        <EditorHeader
          title={resolvedTitle}
          onPin={handleTogglePin}
          onStar={handleStar}
          onShare={handleShare}
          onHistory={handleHistory}
          onExternal={handleExternal}
          onMenu={handleMenu}
          onToggleFocusMode={() => {}}
        />
      </div>

      {/* Lienzo Expansible */}
      <div className="flex-1 w-full overflow-y-auto min-h-0 relative bg-white">
        <TiptapEditor
          ref={editorRef}
          initialHTML={content}
          onUpdate={handleContentUpdate}
          onImageDrop={async (file) => {
            const src = await handleImageSave(file);
            if (src) {
              editorRef.current?.insertContent(
                `<img src="${src}" alt="Imagen" />`,
              );
            }
            return src;
          }}
        />
      </div>

      {/* Barras Inferiores Fijas */}
      <div className="flex-shrink-0 w-full flex flex-col bg-white border-t border-gray-200 z-10">
        <EditorToolbar
          editor={editorRef.current}
          onInsertEmoji={handleInsertEmoji}
          onInsertTable={handleInsertTable}
          onInsertImage={handleInsertImage}
          onInsertDate={handleInsertDate}
          onInsertSubscript={handleInsertSubscript}
          onInsertSuperscript={handleInsertSuperscript}
          onInsertFunction={handleInsertFunction}
        />
        <footer className="w-full flex items-center justify-between border-t border-gray-100 bg-white px-4 py-2.5 text-sm text-slate-600">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-700">
              📄
            </span>
            <span className="text-xs font-medium">
              {notebookId ? `Cuaderno ${notebookId}` : "Sin cuaderno"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Aa
            </button>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              aria-label="Imprimir"
              title="Imprimir"
            >
              <Printer className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              aria-label="Información"
              title="Información"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </div>
        </footer>
      </div>

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
}
