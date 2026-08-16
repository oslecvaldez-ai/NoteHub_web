import { useRef, useState, type ReactElement } from "react";
import { Save, X } from "lucide-react";
import { EditorToolbar } from "../../editor/components/EditorToolbar";
import {
  TiptapEditor,
  type TiptapEditorHandle,
} from "../../editor/components/TiptapEditor";
import type { Plantilla } from "../components/ItemPlantilla";

interface EditorPlantillaProps {
  plantilla?: Plantilla | null;
  workspaceId: number;
  onSave: () => void;
  onCancel: () => void;
}

export function EditorPlantilla({
  plantilla,
  workspaceId,
  onSave,
  onCancel,
}: EditorPlantillaProps): ReactElement {
  const [name, setName] = useState(plantilla?.name ?? "");
  const [content, setContent] = useState(plantilla?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const editorRef = useRef<TiptapEditorHandle | null>(null);

  const insertDate = (format?: "datetime" | "date" | "time"): void => {
    const now = new Date();
    let value = "";

    const resolvedFormat = format ?? "datetime";

    if (resolvedFormat === "date") {
      value = now.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } else if (resolvedFormat === "time") {
      value = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      value = `${now.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })} ${now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    editorRef.current?.runEditorCommand((ed) => {
      ed.chain()
        .focus(undefined, { scrollIntoView: false })
        .insertContent(value)
        .run();
    });
  };

  const insertTable = (rows = 3, cols = 3): void => {
    editorRef.current?.runEditorCommand((ed) => {
      const tableHtml = Array.from({ length: rows }, (_, rowIndex) => {
        const cells = Array.from({ length: cols }, (_, colIndex) => {
          const cellTag = rowIndex === 0 ? "th" : "td";
          return `<${cellTag}>${colIndex + 1}</${cellTag}>`;
        }).join("");
        return `<tr>${cells}</tr>`;
      }).join("");

      ed.chain()
        .focus(undefined, { scrollIntoView: false })
        .insertContent(`<table><tbody>${tableHtml}</tbody></table><p></p>`)
        .run();
    });
  };

  const handleSave = async (): Promise<void> => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("El nombre de la plantilla es obligatorio");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (plantilla) {
        await window.electron?.templates?.update({
          id: plantilla.id,
          name: trimmedName,
          content,
        });
      } else {
        await window.electron?.templates?.create({
          name: trimmedName,
          content,
          workspaceId,
        });
      }

      window.dispatchEvent(new CustomEvent("templates:updated"));
      onSave();
    } catch (err) {
      console.error("Error al guardar plantilla:", err);
      setError("No se pudo guardar la plantilla");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div className="max-w-lg flex-1">
          <input
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError("");
            }}
            placeholder="Nombre de la plantilla..."
            className="w-full text-lg font-extrabold text-slate-900 placeholder-slate-300 outline-none dark:bg-transparent dark:text-slate-100 dark:placeholder-slate-600"
            autoFocus
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
            <span>Cancelar</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              void handleSave();
            }}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Guardando..." : "Guardar"}</span>
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <TiptapEditor
            ref={editorRef}
            initialHTML={content}
            editable
            onUpdate={(html) => setContent(html)}
          />
        </div>

        <div className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <EditorToolbar
            editor={editorRef.current}
            onInsertTable={insertTable}
            onInsertImage={() => {
              editorRef.current?.runEditorCommand((ed) => {
                ed.chain()
                  .focus(undefined, { scrollIntoView: false })
                  .insertContent("<p>Imagen</p>")
                  .run();
              });
            }}
            onInsertDate={insertDate}
          />
        </div>
      </div>
    </div>
  );
}
