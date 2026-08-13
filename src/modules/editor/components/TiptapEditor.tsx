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

// keep CustomExtensions imports that remain
import "./TiptapEditor.css";

export interface TiptapEditorHandle {
  setContentHTML: (html: string) => void;
  getContentHTML: () => string;
  focus: () => void;
  clearFormat: () => void;
  insertContent: (html: string) => void;
  runEditorCommand: (callback: (editor: Editor) => void) => void;
  isActive: (name: string, attrs?: Record<string, any>) => boolean;
}

export interface TiptapEditorProps {
  initialHTML?: string;
  onUpdate?: (html: string) => void;
  onImageDrop?: (file: File) => Promise<string | null>;
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
  { initialHTML, onUpdate, onImageDrop }: TiptapEditorProps,
  ref: React.ForwardedRef<TiptapEditorHandle>,
) {
  const [isEmpty, setIsEmpty] = useState(true);

  const editor = useEditor({
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
      ImageExtension,
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "editor-table",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
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
      setIsEmpty(isEditorEmpty(editor));
    }
  }, [editor]);

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
    }),
    [editor],
  );

  return (
    <div className="flex flex-col flex-1 h-full w-full relative overflow-hidden">
      {isEmpty && (
        <div className="tiptap-editor-placeholder pointer-events-none px-6 pt-6 text-slate-400 dark:text-slate-500">
          Escriba / para mostrar el menú o seleccionar de Plantillas
        </div>
      )}
      <EditorContent
        editor={editor}
        className="flex-1 h-full w-full overflow-y-auto"
      />
    </div>
  );
}

export const TiptapEditor = forwardRef(TiptapEditorComponent);
