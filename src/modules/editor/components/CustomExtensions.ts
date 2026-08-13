import { mergeAttributes, Mark, Node, Extension } from "@tiptap/core";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";

export interface CustomQuoteOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customQuote: {
      setCustomQuote: (backgroundColor?: string, color?: string) => ReturnType;
      toggleCustomQuote: () => ReturnType;
    };
  }
}

export const CustomQuote = Node.create<CustomQuoteOptions>({
  name: "customQuote",
  group: "block",
  content: "block+",
  defining: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      color: {
        default: "#6200ee",
        parseHTML: (element) =>
          (element as HTMLElement).getAttribute("data-color") ||
          (element as HTMLElement).style.borderLeftColor ||
          "#6200ee",
        renderHTML: (attributes) => ({
          "data-color": attributes.color,
          style: `border-left-color: ${attributes.color} !important;`,
        }),
      },
      backgroundColor: {
        default: "#f5f5f5",
        parseHTML: (element) =>
          (element as HTMLElement).getAttribute("data-bg-color") ||
          (element as HTMLElement).style.backgroundColor ||
          "#f5f5f5",
        renderHTML: (attributes) => ({
          "data-bg-color": attributes.backgroundColor,
          style: `background-color: ${attributes.backgroundColor} !important;`,
        }),
      },
    };
  },

  parseHTML() {
    return [
      { tag: "div.editor-callout" },
      { tag: "blockquote" },
      { tag: 'div[data-type="custom-quote"]' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ class: "editor-callout" }, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setCustomQuote:
        (backgroundColor = "#f5f5f5", color = "#6200ee") =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { backgroundColor, color },
            content: [{ type: "paragraph" }],
          });
        },
      toggleCustomQuote:
        () =>
        ({ commands }) => {
          return commands.toggleWrap(this.name);
        },
    };
  },
});

export const Collapsible = Node.create({
  name: "collapsible",
  group: "block",
  content: "block*",
  defining: true,
  addAttributes() {
    return {
      summary: {
        default: "Detalles",
        parseHTML: (element) => {
          const summaryElement = (element as HTMLElement).querySelector(
            "summary.kh-collapsible-header",
          );
          return summaryElement?.innerHTML || "Detalles";
        },
      },
      style: {
        default: null,
        parseHTML: (element) =>
          (element as HTMLElement).getAttribute("style") || null,
      },
    };
  },
  parseHTML() {
    return [{ tag: "details.kh-collapsible" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "details",
      mergeAttributes(HTMLAttributes, { class: "kh-collapsible" }),
      [
        "summary",
        { class: "kh-collapsible-header" },
        HTMLAttributes.summary ?? "Detalles",
      ],
      ["div", { class: "kh-collapsible-content" }, 0],
    ];
  },
});

export const EditorHighlight = Mark.create({
  name: "editorHighlight",
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style") || null,
      },
    };
  },
  parseHTML() {
    return [{ tag: "span.editor-highlight" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { class: "editor-highlight" }),
      0,
    ];
  },
});

export const SearchHighlight = Mark.create({
  name: "searchHighlight",
  parseHTML() {
    return [{ tag: "mark.search-highlight" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "mark",
      mergeAttributes(HTMLAttributes, { class: "search-highlight" }),
      0,
    ];
  },
});

export type TransformType = "uppercase" | "lowercase" | "capitalize" | "none";

export const TextTransform = Extension.create({
  name: "textTransform",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textTransform: {
            default: null,
            parseHTML: (element) =>
              (element as HTMLElement).style.textTransform || null,
            renderHTML: (attributes) => {
              if (!attributes.textTransform) return {};
              return { style: `text-transform: ${attributes.textTransform}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setTextTransform:
        (transform: TransformType) =>
        ({ chain }: { chain: any }) => {
          return chain()
            .setMark("textStyle", { textTransform: transform })
            .run();
        },
    } as any;
  },
});

export const Checklist = TaskList.extend({
  renderHTML({ HTMLAttributes }) {
    return ["ul", mergeAttributes(HTMLAttributes, { class: "checklist" }), 0];
  },
});

export const ChecklistItem = TaskItem.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "li",
      mergeAttributes(HTMLAttributes, { class: "checklist-item" }),
      0,
    ];
  },
});
