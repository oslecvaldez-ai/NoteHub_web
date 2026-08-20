import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import ImageExtension from "@tiptap/extension-image";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import {
  Collapsible,
  CustomQuote,
  EditorHighlight,
  SearchHighlight,
  TextTransform,
} from "./CustomExtensions";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEditorSettings } from "../../../core/editor-settings/useEditorSettings";
import { TableControls } from "./TableControls";
import { ImageFloatingControls } from "./ImageFloatingControls";

// keep CustomExtensions imports that remain
import "./TiptapEditor.css";

const CustomImage = ImageExtension.extend({
  name: "image",
  inline: true,
  group: "inline",
  draggable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "40%",
        parseHTML: (element: HTMLElement) => element.style.width || "40%",
        renderHTML: (attributes: { width?: string }) => ({
          style: `width: ${attributes.width || "40%"}; max-width: 100%; height: auto;`,
        }),
      },
      alignment: {
        default: "left",
        parseHTML: (element: HTMLElement) => element.dataset.align || "left",
        renderHTML: (attributes: { alignment?: string }) => ({
          "data-align": attributes.alignment || "left",
        }),
      },
      wrap: {
        default: "inline",
        parseHTML: (element: HTMLElement) => element.dataset.wrap || "inline",
        renderHTML: (attributes: { wrap?: string }) => ({
          "data-wrap": attributes.wrap || "inline",
        }),
      },
    };
  },
});

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.style.backgroundColor || null,
        renderHTML: (attributes: { backgroundColor?: string | null }) => {
          if (!attributes.backgroundColor) return {};
          return { style: `background-color: ${attributes.backgroundColor}` };
        },
      },
    };
  },
});

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.style.backgroundColor || null,
        renderHTML: (attributes: { backgroundColor?: string | null }) => {
          if (!attributes.backgroundColor) return {};
          return { style: `background-color: ${attributes.backgroundColor}` };
        },
      },
    };
  },
});

export interface TiptapEditorHandle {
  setContentHTML: (html: string) => void;
  getContentHTML: () => string;
  focus: () => void;
  clearFormat: () => void;
  insertContent: (html: string) => void;
  runEditorCommand: (callback: (editor: Editor) => void) => void;
  isActive: (name: string, attrs?: Record<string, any>) => boolean;
  isFocused: () => boolean;
}

export interface TiptapEditorProps {
  initialHTML?: string;
  searchQuery?: string;
  editable?: boolean;
  onUpdate?: (html: string) => void;
  onImageDrop?: (file: File) => Promise<string | null>;
}

function stripSearchHighlight(html: string): string {
  return html
    .replace(/<mark class="search-highlight"[^>]*>/gi, "")
    .replace(/<\/mark>/gi, "");
}

function highlightSearchTerms(html: string, query: string): string {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return stripSearchHighlight(html);
  }

  const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(${escapedQuery})`, "gi");

  return html.replace(/>([^<>]+)</g, (match, text) => {
    if (!text.trim()) return match;
    return `>${text.replace(pattern, '<mark class="search-highlight">$1</mark>')}<`;
  });
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

function isEditorEmpty(editor: Editor): boolean {
  const isEmptyProperty = (editor as any).isEmpty;
  if (typeof isEmptyProperty === "function") {
    return isEmptyProperty();
  }
  if (typeof isEmptyProperty === "boolean") {
    return isEmptyProperty;
  }
  return editor.getText().trim().length === 0;
}

function TiptapEditorComponent(
  {
    initialHTML,
    searchQuery = "",
    editable = true,
    onUpdate,
    onImageDrop,
  }: TiptapEditorProps,
  ref: React.ForwardedRef<TiptapEditorHandle>,
) {
  const [isEmpty, setIsEmpty] = useState(true);
  const { fontFamily, fontSize, lineHeight, paragraphSpacing } =
    useEditorSettings();
  const fontFamilyClass =
    { system: "font-sans", serif: "font-serif", monospace: "font-mono" }[
      fontFamily
    ] || "font-sans";

  const editor = useEditor({
    editable,
    editorProps: {
      attributes: {
        class:
          "tiptap-editor flex-1 h-full min-h-0 w-full overflow-y-auto focus:outline-none border-none shadow-none rounded-none bg-transparent",
      },
      handleDrop(_view, event) {
        const files = Array.from(event.dataTransfer?.files ?? []);
        const imageFile = files.find(isImageFile);
        if (!imageFile) return false;

        event.preventDefault();
        void (async () => {
          const src = await onImageDrop?.(imageFile);
          if (src && editor) {
            editor.chain().focus().setImage({ src }).run();
          }
        })();
        return true;
      },
      handlePaste(_view, event) {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((item) => item.type.startsWith("image/"));
        if (!imageItem) return false;

        const file = imageItem.getAsFile();
        if (!file) return false;

        event.preventDefault();
        void (async () => {
          const src = await onImageDrop?.(file);
          if (src && editor) {
            editor.chain().focus().setImage({ src }).run();
          }
        })();
        return true;
      },
    },
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        strike: false,
      }),
      BulletList,
      OrderedList,
      ListItem,
      Underline,
      Strike,
      CustomImage,
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "tiptap-table",
        },
      }),
      TableRow,
      CustomTableHeader,
      CustomTableCell,
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Collapsible,
      CustomQuote,
      EditorHighlight,
      SearchHighlight,
      TextTransform,
    ],
    content: initialHTML ?? "",
    onUpdate: ({ editor }) => {
      setIsEmpty(isEditorEmpty(editor));
      onUpdate?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
      setIsEmpty(isEditorEmpty(editor));
    }
  }, [editor, editable]);

  useEffect(() => {
    if (!editor || typeof initialHTML !== "string") {
      return;
    }

    const currentHTML = editor.getHTML();
    const isFocused =
      typeof (editor as any).isFocused === "function"
        ? (editor as any).isFocused()
        : (editor as any).isFocused;

    if (currentHTML !== initialHTML && !isFocused) {
      editor.commands.setContent(initialHTML);
      setIsEmpty(isEditorEmpty(editor));
    }
  }, [editor, initialHTML]);

  useEffect(() => {
    if (!editor) return;

    const nextHTML = highlightSearchTerms(editor.getHTML(), searchQuery);
    const normalizedHTML = nextHTML.replace(/\s\s+/g, " ").trim();
    const currentHTML = editor.getHTML().replace(/\s\s+/g, " ").trim();

    if (normalizedHTML !== currentHTML) {
      editor.commands.setContent(nextHTML, { emitUpdate: false });
      setIsEmpty(isEditorEmpty(editor));
    }
  }, [editor, searchQuery]);

  useEffect(() => {
    if (!editor) return;

    const handleEditorKeyboardShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isModifierPressed = event.ctrlKey || event.metaKey;
      const isAltShift = event.altKey && event.shiftKey;

      if (!editor.isFocused) return;

      if (
        (isAltShift && (key === "d" || key === "t")) ||
        (isModifierPressed && event.shiftKey && (key === "d" || key === "t"))
      ) {
        event.preventDefault();

        if (key === "d") {
          editor.commands.insertContent(
            new Date().toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
          );
        }

        if (key === "t") {
          editor.commands.insertContent(
            new Date().toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          );
        }
      }
    };

    editor.view.dom.addEventListener("keydown", handleEditorKeyboardShortcuts);
    return () => {
      editor.view.dom.removeEventListener(
        "keydown",
        handleEditorKeyboardShortcuts,
      );
    };
  }, [editor]);

  useImperativeHandle(
    ref,
    () => ({
      setContentHTML: (html: string) => {
        editor?.commands.setContent(html);
        if (editor) {
          setIsEmpty(isEditorEmpty(editor));
        }
      },
      getContentHTML: () => editor?.getHTML() ?? "",
      focus: () => {
        editor?.commands.focus();
      },
      clearFormat: () => {
        editor?.chain().focus().clearNodes().unsetAllMarks().run();
      },
      insertContent: (html: string) => {
        editor?.commands.insertContent(html);
        if (editor) {
          setIsEmpty(isEditorEmpty(editor));
        }
      },
      runEditorCommand: (callback: (editor: Editor) => void) => {
        if (editor) callback(editor);
      },
      isActive: (name: string, attrs?: Record<string, any>) => {
        try {
          return !!editor && editor.isActive(name, attrs);
        } catch {
          return false;
        }
      },
      isFocused: () => {
        try {
          return !!editor && editor.isFocused;
        } catch {
          return false;
        }
      },
    }),
    [editor],
  );

  return (
    <div className="flex flex-col flex-1 h-full w-full relative overflow-hidden">
      {isEmpty && (
        <div className="tiptap-editor-placeholder pointer-events-none px-8 pt-6 text-slate-400 dark:text-slate-500">
          Escriba / para mostrar el menú o seleccionar de Plantillas
        </div>
      )}

      <div
        className={`tiptap-container prose dark:prose-invert max-w-none flex-1 min-h-0 ${fontFamilyClass}`}
        style={
          {
            fontSize: `${fontSize}px`,
            lineHeight,
            "--paragraph-spacing": `${paragraphSpacing}px`,
          } as React.CSSProperties
        }
      >
        <TableControls editor={editor} />
        <ImageFloatingControls editor={editor} />
        <EditorContent editor={editor} className="w-full h-full" />
      </div>
    </div>
  );
}

export const TiptapEditor = forwardRef(TiptapEditorComponent);
