import { useEffect, useState, type ReactElement } from "react";
import { Columns3, Rows3, Trash2, X } from "lucide-react";
import type { Editor } from "@tiptap/react";
import { useTheme } from "../../../core/theme/useTheme";

interface TableControlsProps {
  editor: Editor | null;
}

function isSelectionInsideTable(editor: Editor | null): boolean {
  return Boolean(
    editor &&
    (editor.isActive("table") ||
      editor.isActive("tableCell") ||
      editor.isActive("tableHeader")),
  );
}

export function TableControls({
  editor,
}: TableControlsProps): ReactElement | null {
  const { accentColor } = useTheme();
  const [isInsideTable, setIsInsideTable] = useState(() =>
    isSelectionInsideTable(editor),
  );
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);

  useEffect(() => {
    if (!editor) {
      setIsInsideTable(false);
      return;
    }

    const updateTableState = (): void => {
      setIsInsideTable(isSelectionInsideTable(editor));
    };

    updateTableState();
    editor.on("selectionUpdate", updateTableState);
    return () => {
      editor.off("selectionUpdate", updateTableState);
    };
  }, [editor]);

  useEffect(() => {
    if (!isInsideTable) setIsManuallyClosed(false);
  }, [isInsideTable]);

  if (!editor || !isInsideTable || isManuallyClosed) return null;

  const run = (command: (currentEditor: Editor) => void): void => {
    command(editor);
  };

  return (
    <div
      className="absolute left-1/2 top-3 z-40 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95"
      style={{ color: accentColor }}
    >
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() =>
            run((currentEditor) =>
              currentEditor.chain().focus().addColumnBefore().run(),
            )
          }
          title="Agregar columna antes"
          aria-label="Agregar columna antes"
          className="inline-flex h-7 items-center justify-center rounded-lg px-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Columns3 className="mr-1 h-3.5 w-3.5" />+
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() =>
            run((currentEditor) =>
              currentEditor.chain().focus().addColumnAfter().run(),
            )
          }
          title="Agregar columna después"
          aria-label="Agregar columna después"
          className="inline-flex h-7 items-center justify-center rounded-lg px-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Columns3 className="mr-1 h-3.5 w-3.5" />+
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() =>
            run((currentEditor) =>
              currentEditor.chain().focus().deleteColumn().run(),
            )
          }
          title="Eliminar columna actual"
          aria-label="Eliminar columna actual"
          className="inline-flex h-7 items-center justify-center rounded-lg px-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
        >
          <Columns3 className="mr-1 h-3.5 w-3.5" />-
        </button>
      </div>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() =>
            run((currentEditor) =>
              currentEditor.chain().focus().addRowBefore().run(),
            )
          }
          title="Agregar fila antes"
          aria-label="Agregar fila antes"
          className="inline-flex h-7 items-center justify-center rounded-lg px-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Rows3 className="mr-1 h-3.5 w-3.5" />+
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() =>
            run((currentEditor) =>
              currentEditor.chain().focus().addRowAfter().run(),
            )
          }
          title="Agregar fila después"
          aria-label="Agregar fila después"
          className="inline-flex h-7 items-center justify-center rounded-lg px-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Rows3 className="mr-1 h-3.5 w-3.5" />+
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() =>
            run((currentEditor) =>
              currentEditor.chain().focus().deleteRow().run(),
            )
          }
          title="Eliminar fila actual"
          aria-label="Eliminar fila actual"
          className="inline-flex h-7 items-center justify-center rounded-lg px-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
        >
          <Rows3 className="mr-1 h-3.5 w-3.5" />-
        </button>
      </div>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() =>
          run((currentEditor) =>
            currentEditor.chain().focus().deleteTable().run(),
          )
        }
        title="Eliminar tabla completa"
        aria-label="Eliminar tabla completa"
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-100/70 dark:hover:bg-rose-900/50"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setIsManuallyClosed(true)}
        title="Cerrar barra de tabla"
        aria-label="Cerrar barra de tabla"
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
