import { mergeAttributes, Mark, Node } from '@tiptap/core'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute('style') || null,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'div.editor-callout' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'editor-callout' }), 0]
  },
})

export const Collapsible = Node.create({
  name: 'collapsible',
  group: 'block',
  content: 'block*',
  defining: true,
  addAttributes() {
    return {
      summary: {
        default: 'Detalles',
        parseHTML: (element) => {
          const summaryElement = (element as HTMLElement).querySelector('summary.kh-collapsible-header')
          return summaryElement?.innerHTML || 'Detalles'
        },
      },
      style: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).getAttribute('style') || null,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'details.kh-collapsible' }]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'details',
      mergeAttributes(HTMLAttributes, { class: 'kh-collapsible' }),
      ['summary', { class: 'kh-collapsible-header' }, HTMLAttributes.summary ?? 'Detalles'],
      ['div', { class: 'kh-collapsible-content' }, 0],
    ]
  },
})

export const EditorHighlight = Mark.create({
  name: 'editorHighlight',
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute('style') || null,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'span.editor-highlight' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { class: 'editor-highlight' }), 0]
  },
})

export const SearchHighlight = Mark.create({
  name: 'searchHighlight',
  parseHTML() {
    return [{ tag: 'mark.search-highlight' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['mark', mergeAttributes(HTMLAttributes, { class: 'search-highlight' }), 0]
  },
})

export const Checklist = TaskList.extend({
  renderHTML({ HTMLAttributes }) {
    return ['ul', mergeAttributes(HTMLAttributes, { class: 'checklist' }), 0]
  },
})

export const ChecklistItem = TaskItem.extend({
  renderHTML({ HTMLAttributes }) {
    return ['li', mergeAttributes(HTMLAttributes, { class: 'checklist-item' }), 0]
  },
})
