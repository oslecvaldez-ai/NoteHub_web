import { useEffect, useState, type ReactElement } from "react";
import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Trash2,
  WrapText,
  X,
} from "lucide-react";
import { useTheme } from "../../../core/theme/useTheme";

type ImageAlignment = "left" | "center" | "right";
type ImageWrap = "inline" | "break";

interface ImageFloatingControlsProps {
  editor: Editor | null;
}

export function ImageFloatingControls({
  editor,
}: ImageFloatingControlsProps): ReactElement | null {
  const { accentColor } = useTheme();
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [, refreshAttributes] = useState(0);

  useEffect(() => {
    if (!editor) {
      setIsImageSelected(false);
      return;
    }

    const updateImageState = (): void => {
      setIsImageSelected(editor.isActive("image"));
      refreshAttributes((value) => value + 1);
    };

    updateImageState();
    editor.on("selectionUpdate", updateImageState);
    editor.on("transaction", updateImageState);
    return () => {
      editor.off("selectionUpdate", updateImageState);
      editor.off("transaction", updateImageState);
    };
  }, [editor]);

  useEffect(() => {
    if (!isImageSelected) setIsDismissed(false);
  }, [isImageSelected]);

  if (!editor || !isImageSelected || isDismissed) return null;

  const currentAttributes = editor.getAttributes("image") as {
    width?: string;
    alignment?: ImageAlignment;
    wrap?: ImageWrap;
  };
  const currentWidth = currentAttributes.width ?? "40%";
  const currentAlignment = currentAttributes.alignment ?? "left";
  const currentWrap = currentAttributes.wrap ?? "inline";

  const updateImage = (attributes: Record<string, string>): void => {
    editor.chain().focus().updateAttributes("image", attributes).run();
  };

  const setAlignment = (alignment: ImageAlignment): void => {
    updateImage({
      alignment,
      wrap: alignment === "center" ? "break" : "inline",
    });
  };

  return (
    <div className="absolute right-3 top-3 z-40 flex items-center gap-1 rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center gap-1 px-1">
        {["25%", "50%", "100%"].map((size) => (
          <button
            key={size}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => updateImage({ width: size })}
            style={
              currentWidth === size
                ? { backgroundColor: `${accentColor}18`, color: accentColor }
                : undefined
            }
            className="inline-flex h-7 items-center justify-center rounded-lg px-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {size}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

      <div className="flex items-center gap-0.5">
        {[
          ["left", AlignLeft, "Alinear a la izquierda"],
          ["center", AlignCenter, "Centrar"],
          ["right", AlignRight, "Alinear a la derecha"],
        ].map(([alignment, Icon, title]) => (
          <button
            key={alignment as string}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setAlignment(alignment as ImageAlignment)}
            title={title as string}
            aria-label={title as string}
            style={
              currentAlignment === alignment
                ? { color: accentColor }
                : undefined
            }
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() =>
          updateImage({ wrap: currentWrap === "inline" ? "break" : "inline" })
        }
        title={
          currentWrap === "inline"
            ? "Desactivar ajuste de texto"
            : "Ajustar texto alrededor"
        }
        aria-label="Alternar ajuste de texto"
        style={
          currentWrap === "inline"
            ? { backgroundColor: `${accentColor}18`, color: accentColor }
            : undefined
        }
        className="inline-flex h-7 items-center justify-center gap-1 rounded-lg px-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <WrapText className="h-3.5 w-3.5" />
        <span>Wrap</span>
      </button>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => editor.chain().focus().deleteSelection().run()}
        title="Eliminar imagen"
        aria-label="Eliminar imagen"
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setIsDismissed(true)}
        title="Cerrar barra de imagen"
        aria-label="Cerrar barra de imagen"
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
