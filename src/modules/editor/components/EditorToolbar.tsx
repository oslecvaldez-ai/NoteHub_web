import { createElement, type ElementType, type MouseEvent } from 'react'
import { type TiptapEditorHandle } from './TiptapEditor'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Calendar,
  CheckSquare,
  ChevronDown,
  Image,
  Italic,
  List,
  ListOrdered,
  MessageSquare,
  Slash,
  Table,
  Type,
} from 'lucide-react'

export interface EditorToolbarProps {
  editor?: TiptapEditorHandle | null
  onInsertEmoji: (emoji: string) => void
  onInsertTable: () => void
  onInsertImage: () => void
  onInsertDate: () => void
  onToggleCallout: () => void
  onToggleCollapsible: () => void
}

function toolbarButton(icon: ElementType, label: string, onClick: () => void) {
  return (
    <button
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {createElement(icon, { className: 'h-4 w-4' })}
    </button>
  )
}

export function EditorToolbar({
  editor,
  onInsertEmoji,
  onInsertTable,
  onInsertImage,
  onInsertDate,
  onToggleCallout,
  onToggleCollapsible,
}: EditorToolbarProps) {
  return (
    <div className="editor-toolbar flex flex-wrap items-center gap-2 rounded-3xl border border-slate-200 bg-white px-3 py-3 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-950 dark:shadow-none">
      <div className="flex items-center gap-2">
        {toolbarButton(Bold, 'Negrita', () => editor?.runEditorCommand((editor) => editor.chain().focus().toggleBold().run()))}
        {toolbarButton(Italic, 'Cursiva', () => editor?.runEditorCommand((editor) => editor.chain().focus().toggleItalic().run()))}
        {toolbarButton(Slash, 'Código', () => editor?.runEditorCommand((editor) => editor.chain().focus().toggleCodeBlock().run()))}
        {toolbarButton(Type, 'Párrafo', () => editor?.runEditorCommand((editor) => editor.chain().focus().setParagraph().run()))}
        {toolbarButton(List, 'Lista con viñetas', () => editor?.runEditorCommand((editor) => editor.chain().focus().toggleBulletList().run()))}
        {toolbarButton(ListOrdered, 'Lista numerada', () => editor?.runEditorCommand((editor) => editor.chain().focus().toggleOrderedList().run()))}
      </div>
      <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
      <div className="flex items-center gap-2">
        {toolbarButton(AlignLeft, 'Alinear a la izquierda', () => editor?.runEditorCommand((editor) => editor.chain().focus().setTextAlign('left').run()))}
        {toolbarButton(AlignCenter, 'Centrar', () => editor?.runEditorCommand((editor) => editor.chain().focus().setTextAlign('center').run()))}
        {toolbarButton(AlignRight, 'Alinear a la derecha', () => editor?.runEditorCommand((editor) => editor.chain().focus().setTextAlign('right').run()))}
        {toolbarButton(AlignJustify, 'Justificar', () => editor?.runEditorCommand((editor) => editor.chain().focus().setTextAlign('justify').run()))}
      </div>
      <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
      <div className="flex items-center gap-2">
        {toolbarButton(CheckSquare, 'Checklist', () => editor?.runEditorCommand((editor) => editor.chain().focus().toggleTaskList().run()))}
        {toolbarButton(MessageSquare, 'Callout', onToggleCallout)}
        {toolbarButton(ChevronDown, 'Colapsable', onToggleCollapsible)}
      </div>
      <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
      <div className="flex items-center gap-2">
        {toolbarButton(Image, 'Insertar imagen', onInsertImage)}
        {toolbarButton(Calendar, 'Insertar fecha', onInsertDate)}
        {toolbarButton(Table, 'Insertar tabla', onInsertTable)}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          onMouseDown={(event: MouseEvent<HTMLButtonElement>) => event.preventDefault()}
          onClick={() => onInsertEmoji('🔥')}
          aria-label="Insertar emoji"
          title="Insertar emoji"
        >
          <span className="text-lg">🔥</span>
        </button>
      </div>
    </div>
  )
}
