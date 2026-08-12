import {
  createElement,
  useState,
  useRef,
  useEffect,
  type ElementType,
  type MouseEvent,
} from "react";
import { type TiptapEditorHandle } from "./TiptapEditor";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Calendar,
  CheckSquare,
  Highlighter,
  Image,
  Italic,
  List,
  ListOrdered,
  Minus,
  Palette,
  Quote,
  Slash,
  Subscript,
  Superscript,
  Table,
} from "lucide-react";

export interface EditorToolbarProps {
  editor?: TiptapEditorHandle | null;
  onInsertEmoji: (emoji: string) => void;
  onInsertTable: () => void;
  onInsertImage: () => void;
  onInsertDate: () => void;
  onInsertSubscript: () => void;
  onInsertSuperscript: () => void;
}

type ColorOption = {
  name: string;
  color: string;
  shortcut?: string;
};

// Paleta de Colores para TEXTO (Oscuros / Fuerte)
const TEXT_COLORS: ColorOption[] = [
  { name: "Rojo", color: "#EE2C2C" },
  { name: "Naranja", color: "#FF7A00" },
  { name: "Amarillo", color: "#FFC72C" },
  { name: "Verde", color: "#51B837" },
  { name: "Azul", color: "#478AF6" },
  { name: "Rosa", color: "#F86BD7" },
  { name: "Púrpura", color: "#9B51E0" },
  { name: "Gris", color: "#707070" },
];

// Paleta de Colores para FONDO (Claros / Pastel)
const BG_COLORS: ColorOption[] = [
  { name: "Rojo", color: "#FF8B8B" },
  { name: "Naranja", color: "#FFC085" },
  { name: "Amarillo", color: "#FFE285" },
  { name: "Verde", color: "#C2F18E" },
  { name: "Azul", color: "#85C8FF" },
  { name: "Rosa", color: "#FFB2E6" },
  { name: "Púrpura", color: "#CFA5FF" },
  { name: "Gris", color: "#CCCCCC" },
];

const BG_TO_BORDER_MAP: Record<string, string> = {
  "#FF8B8B": "#EE2C2C",
  "#FFC085": "#FF7A00",
  "#FFE285": "#FFC72C",
  "#C2F18E": "#51B837",
  "#85C8FF": "#478AF6",
  "#FFB2E6": "#F86BD7",
  "#CFA5FF": "#9B51E0",
  "#CCCCCC": "#707070",
};

const QUOTE_COLORS = [
  { name: "Azul", bgColor: "#E0F2FE", borderColor: "#0284C7" },
  { name: "Verde", bgColor: "#DCFCE7", borderColor: "#16A34A" },
  { name: "Amarillo", bgColor: "#FEF9C3", borderColor: "#CA8A04" },
  { name: "Naranja", bgColor: "#FFEDD5", borderColor: "#EA580C" },
  { name: "Rojo", bgColor: "#FEE2E2", borderColor: "#DC2626" },
  { name: "Rosa", bgColor: "#FCE7F3", borderColor: "#DB2777" },
  { name: "Púrpura", bgColor: "#F3E8FF", borderColor: "#9333EA" },
  { name: "Gris", bgColor: "#F1F5F9", borderColor: "#64748B" },
];

const QUOTE_COLOR_NAMES = QUOTE_COLORS.map((item) => item.name).join(", ");

function toolbarButton(
  icon: ElementType,
  label: string,
  onClick: () => void,
  isActive = false,
) {
  return (
    <button
      type="button"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900 ${
        isActive
          ? "border-purple-500 bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:border-purple-600"
          : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
      }`}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {createElement(icon, { className: "h-4 w-4" })}
    </button>
  );
}

export function EditorToolbar({
  editor,
  onInsertEmoji,
  onInsertTable,
  onInsertImage,
  onInsertDate,
  onInsertSubscript,
  onInsertSuperscript,
}: EditorToolbarProps) {
  const [showTextColorMenu, setShowTextColorMenu] = useState(false);
  const [showBgColorMenu, setShowBgColorMenu] = useState(false);

  const textMenuRef = useRef<HTMLDivElement>(null);
  const bgMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar menús al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent) {
      if (
        textMenuRef.current &&
        !textMenuRef.current.contains(event.target as Node)
      ) {
        setShowTextColorMenu(false);
      }
      if (
        bgMenuRef.current &&
        !bgMenuRef.current.contains(event.target as Node)
      ) {
        setShowBgColorMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-1.5 px-3 py-2 bg-white border-t border-gray-100 dark:bg-slate-950 dark:border-slate-800">
      {/* Selector de Encabezados (H1 - H6) */}
      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <select
          aria-label="Formato de encabezado"
          className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer px-1 py-0.5"
          onChange={(e) => {
            const val = e.target.value;
            if (val === "p") {
              editor?.runEditorCommand((ed) =>
                ed
                  .chain()
                  .focus(undefined, { scrollIntoView: false })
                  .setParagraph()
                  .run(),
              );
            } else {
              const level = parseInt(val) as 1 | 2 | 3 | 4 | 5 | 6;
              editor?.runEditorCommand((ed) =>
                ed
                  .chain()
                  .focus(undefined, { scrollIntoView: false })
                  .setNode("heading", { level })
                  .run(),
              );
            }
          }}
          defaultValue="p"
        >
          <option value="p">Párrafo</option>
          <option value="1">Título 1 (H1)</option>
          <option value="2">Título 2 (H2)</option>
          <option value="3">Título 3 (H3)</option>
          <option value="4">Título 4 (H4)</option>
          <option value="5">Título 5 (H5)</option>
          <option value="6">Título 6 (H6)</option>
        </select>
      </div>

      {/* Formato Básico */}
      <div className="flex items-center gap-1">
        {toolbarButton(Bold, "Negrita", () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .toggleBold()
              .run(),
          ),
        )}
        {toolbarButton(Italic, "Cursiva", () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .toggleItalic()
              .run(),
          ),
        )}
      </div>

      {/* DESPLEGABLES DE COLOR ELEGANTES */}
      <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5 dark:border-slate-800">
        {/* Desplegable: Color de Texto */}
        <div className="relative" ref={textMenuRef}>
          <button
            type="button"
            title="Color de texto"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setShowTextColorMenu(!showTextColorMenu);
              setShowBgColorMenu(false);
            }}
          >
            <Palette className="h-4 w-4" />
          </button>

          {showTextColorMenu && (
            <div className="absolute bottom-11 left-0 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-1">
                {TEXT_COLORS.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      editor?.runEditorCommand((ed) =>
                        ed
                          .chain()
                          .focus(undefined, { scrollIntoView: false })
                          .setColor(item.color)
                          .run(),
                      );
                      setShowTextColorMenu(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3.5 w-3.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.shortcut ? (
                      <span className="text-[10px] text-slate-400">
                        {item.shortcut}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
              <div className="mt-2 border-t border-slate-100 pt-1 dark:border-slate-800">
                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-1.5 text-left text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor?.runEditorCommand((ed) =>
                      ed
                        .chain()
                        .focus(undefined, { scrollIntoView: false })
                        .unsetColor()
                        .run(),
                    );
                    setShowTextColorMenu(false);
                  }}
                >
                  Eliminar color de texto
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desplegable: Color de Fondo */}
        <div className="relative" ref={bgMenuRef}>
          <button
            type="button"
            title="Color de fondo (Resaltador)"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setShowBgColorMenu(!showBgColorMenu);
              setShowTextColorMenu(false);
            }}
          >
            <Highlighter className="h-4 w-4" />
          </button>

          {showBgColorMenu && (
            <div className="absolute bottom-11 left-0 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-1">
                {BG_COLORS.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      editor?.runEditorCommand((ed) => {
                        const { selection } = ed.state;
                        const colorHex = item.color;
                        const isInsideCallout = ed.isActive("customQuote");
                        const accentColor =
                          BG_TO_BORDER_MAP[colorHex.toUpperCase()] || "#6200ee";

                        if (isInsideCallout && selection.empty) {
                          ed.chain()
                            .focus(undefined, { scrollIntoView: false })
                            .updateAttributes("customQuote", {
                              bgColor: colorHex,
                              borderColor: accentColor,
                            })
                            .run();
                        } else {
                          ed.chain()
                            .focus(undefined, { scrollIntoView: false })
                            .toggleHighlight({ color: colorHex })
                            .run();
                        }
                      });
                      setShowBgColorMenu(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3.5 w-3.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.shortcut ? (
                      <span className="text-[10px] text-slate-400">
                        {item.shortcut}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
              <div className="mt-2 border-t border-slate-100 pt-1 dark:border-slate-800">
                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-1.5 text-left text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor?.runEditorCommand((ed) => {
                      const { selection } = ed.state;
                      if (ed.isActive("customQuote") && selection.empty) {
                        ed.chain()
                          .focus(undefined, { scrollIntoView: false })
                          .updateAttributes("customQuote", {
                            bgColor: "#F1F5F9",
                            borderColor: "#64748B",
                          })
                          .run();
                      } else {
                        ed.chain()
                          .focus(undefined, { scrollIntoView: false })
                          .unsetHighlight()
                          .run();
                      }
                    });
                    setShowBgColorMenu(false);
                  }}
                >
                  Sin fondo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transformación de Texto: Mayúsculas / Minúsculas / Capitalizar */}
      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <select
          aria-label="Transformar texto"
          className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer px-1 py-0.5"
          onChange={(e) => {
            const val = e.target.value as
              | "uppercase"
              | "lowercase"
              | "capitalize"
              | "none"
              | "highlight_combo";

            if (val === "highlight_combo") {
              const randomTextColor =
                TEXT_COLORS[Math.floor(Math.random() * TEXT_COLORS.length)]
                  .color;
              const randomBgColor =
                BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)].color;

              editor?.runEditorCommand((ed) => {
                (ed.commands as any).setTextTransform("uppercase");
                ed.chain()
                  .focus(undefined, { scrollIntoView: false })
                  .setBold()
                  .setColor(randomTextColor)
                  .toggleHighlight({ color: randomBgColor })
                  .run();
              });

              (e.target as HTMLSelectElement).value = "none";
              return;
            }

            editor?.runEditorCommand((ed) =>
              (ed.commands as any).setTextTransform(val),
            );
          }}
          defaultValue="none"
        >
          <option value="none">Aa (Normal)</option>
          <option value="uppercase">MAYÚSCULAS</option>
          <option value="lowercase">minúsculas</option>
          <option value="capitalize">Capitalizar Palabras</option>
          <option value="highlight_combo">✨ Destacar</option>
        </select>
      </div>

      {/* Listas y Checklists */}
      <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5 dark:border-slate-800">
        {toolbarButton(CheckSquare, "Checklist", () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .toggleTaskList()
              .run(),
          ),
        )}
        {toolbarButton(List, "Lista con viñetas", () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .toggleBulletList()
              .run(),
          ),
        )}
        {toolbarButton(ListOrdered, "Lista numerada", () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .toggleOrderedList()
              .run(),
          ),
        )}
      </div>

      {/* Súper y Subíndice + Funciones */}
      <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5 dark:border-slate-800">
        {toolbarButton(Subscript, "Subíndice", onInsertSubscript)}
        {toolbarButton(Superscript, "Superíndice", onInsertSuperscript)}
        {toolbarButton(Slash, "Bloque de Código", () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .toggleCodeBlock()
              .run(),
          ),
        )}
      </div>

      {/* Alineación */}
      <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5 dark:border-slate-800">
        {toolbarButton(AlignLeft, "Izquierda", () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .setTextAlign("left")
              .run(),
          ),
        )}
        {toolbarButton(AlignCenter, "Centrar", () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .setTextAlign("center")
              .run(),
          ),
        )}
        {toolbarButton(AlignRight, "Derecha", () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .setTextAlign("right")
              .run(),
          ),
        )}
        {toolbarButton(AlignJustify, "Justificar", () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .setTextAlign("justify")
              .run(),
          ),
        )}
      </div>

      {/* Inserción de Objetos */}
      <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5 dark:border-slate-800">
        {toolbarButton(Minus, "Línea horizontal separadora", () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .setHorizontalRule()
              .run(),
          ),
        )}
        {toolbarButton(Quote, `Cita destacada (${QUOTE_COLOR_NAMES})`, () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .toggleWrap("customQuote")
              .run(),
          ),
        )}
        {toolbarButton(Image, "Insertar imagen", onInsertImage)}
        {toolbarButton(Calendar, "Insertar fecha", onInsertDate)}
        {toolbarButton(Table, "Insertar tabla", onInsertTable)}
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          onMouseDown={(event: MouseEvent<HTMLButtonElement>) =>
            event.preventDefault()
          }
          onClick={() => onInsertEmoji("🔥")}
          aria-label="Insertar emoji"
          title="Insertar emoji"
        >
          <span className="text-base">🔥</span>
        </button>
      </div>
    </div>
  );
}
