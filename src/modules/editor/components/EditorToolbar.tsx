import {
  createElement,
  useState,
  useRef,
  useEffect,
  type CSSProperties,
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
  Plus,
  Slash,
  Subscript,
  Superscript,
  Table,
  Star,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useTheme } from "../../../core/theme/useTheme";

export interface EditorToolbarProps {
  editor?: TiptapEditorHandle | null;
  onInsertTable: (rows?: number, cols?: number) => void;
  onInsertImage: () => void;
  onInsertDate: (format?: "datetime" | "date" | "time") => void;
  onOpenPlantillas?: () => void;
}

const DATE_MENU_ITEMS: Array<{
  label: string;
  shortcut: string;
  type: "datetime" | "date" | "time";
}> = [
  { label: "Fecha y Hora", shortcut: "Ctrl+D", type: "datetime" },
  { label: "Solo Fecha", shortcut: "Ctrl+Shift+D", type: "date" },
  { label: "Solo Hora", shortcut: "Alt+Ctrl+Shift+D", type: "time" },
];

type ColorOption = { name: string; color: string; shortcut?: string };

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

const BG_COLORS: ColorOption[] = [
  { name: "Azul", color: "#E1EFFF" },
  { name: "Rojo", color: "#FFEAEA" },
  { name: "Amarillo", color: "#FFF6D6" },
  { name: "Naranja", color: "#FFEBD6" },
  { name: "Verde", color: "#E8F8D8" },
  { name: "Púrpura", color: "#F3E8FF" },
  { name: "Gris", color: "#F1F3F5" },
];

const BG_TO_BORDER_MAP: Record<string, string> = {
  "#E1EFFF": "#478AF6",
  "#FFEAEA": "#EE2C2C",
  "#FFF6D6": "#FFC72C",
  "#FFEBD6": "#FF7A00",
  "#E8F8D8": "#51B837",
  "#F3E8FF": "#9B51E0",
  "#F1F3F5": "#94A3B8",
};

// Mapa de Pares Armónicos: Fondo Pastel -> Texto Armónico Oscuro
const HARMONIC_PAIRS: Record<string, string> = {
  "#E1EFFF": "#003B73",
  "#FFEAEA": "#8A0000",
  "#FFF6D6": "#5C4300",
  "#FFEBD6": "#6B3300",
  "#E8F8D8": "#1F4E0A",
  "#F3E8FF": "#4A156B",
  "#F1F3F5": "#334155",
};

const handleApplyHarmonicHighlight = (ed: any, bgColor: string) => {
  if (!ed) return;
  const normalizedBg = (bgColor || "").toUpperCase();
  const harmonicTextColor = HARMONIC_PAIRS[normalizedBg] || "#1A1A1A";
  ed.chain()
    .focus(undefined, { scrollIntoView: false })
    .setHighlight({ color: bgColor })
    .setColor(harmonicTextColor)
    .run();
};

const ICONS_MAP: Record<string, string[]> = {
  indicadores: ["🟢", "🔴", "🟡", "✅", "🛡️"],
  simbolos: [
    "🎯",
    "👉",
    "🔑",
    "📖",
    "💡",
    "📘",
    "📚",
    "📜",
    "🙏",
    "🕊️",
    "🔥",
    "🔍",
    "💬",
    "🏁",
    "⬆️",
    "⬇️",
  ],
  enumeration: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"],
  herramientas: ["👉", "📖", "📚", "📜", "📝", "🔑", "🎯", "💡"],
};

function toolbarButton(
  icon: ElementType | null,
  label: string,
  onClick: () => void,
  isActive = false,
) {
  const base =
    "inline-flex h-9 w-9 items-center justify-center rounded-xl border text-slate-700 transition hover:border-[var(--accent-color)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent-color)] dark:text-slate-400 dark:hover:text-slate-200";
  const activeCls = isActive
    ? "border-[var(--accent-color)] bg-[var(--accent-bg)] text-[var(--accent-color)]"
    : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950";

  return (
    <button
      type="button"
      className={`${base} ${activeCls}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {icon ? createElement(icon, { className: "h-4 w-4" }) : null}
    </button>
  );
}

export function EditorToolbar({
  editor,
  onInsertTable,
  onInsertImage,
  onInsertDate,
  onOpenPlantillas,
}: EditorToolbarProps) {
  const { accentColor } = useTheme();
  const [showTextColorMenu, setShowTextColorMenu] = useState(false);
  const [showBgColorMenu, setShowBgColorMenu] = useState(false);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showIconsMenu, setShowIconsMenu] = useState(false);
  const [iconsTab, setIconsTab] = useState<
    "indicadores" | "simbolos" | "enumeration" | "herramientas"
  >("indicadores");
  const [showTableSubmenu, setShowTableSubmenu] = useState(false);
  const [showDateSubmenu, setShowDateSubmenu] = useState(false);

  const textMenuRef = useRef<HTMLDivElement | null>(null);
  const bgMenuRef = useRef<HTMLDivElement | null>(null);
  const insertMenuRef = useRef<HTMLDivElement | null>(null);
  const iconsMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        textMenuRef.current &&
        !textMenuRef.current.contains(event.target as Node)
      )
        setShowTextColorMenu(false);
      if (
        bgMenuRef.current &&
        !bgMenuRef.current.contains(event.target as Node)
      )
        setShowBgColorMenu(false);
      if (
        insertMenuRef.current &&
        !insertMenuRef.current.contains(event.target as Node)
      ) {
        setShowInsertMenu(false);
        setShowTableSubmenu(false);
        setShowDateSubmenu(false);
      }
      if (
        iconsMenuRef.current &&
        !iconsMenuRef.current.contains(event.target as Node)
      )
        setShowIconsMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside as any);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside as any);
  }, []);

  // helpers
  const insertTable = (r: number, c: number) => {
    onInsertTable?.(r, c);
    setShowInsertMenu(false);
    setShowTableSubmenu(false);
  };

  const insertDate = (type: "datetime" | "date" | "time") => {
    onInsertDate?.(type);
    setShowInsertMenu(false);
    setShowDateSubmenu(false);
  };

  return (
    <div
      style={
        {
          "--accent-color": accentColor,
          "--accent-bg": `${accentColor}20`,
        } as CSSProperties
      }
      className="w-full flex flex-wrap items-center gap-1.5 px-3 py-2 bg-white border-t border-gray-100 dark:bg-slate-900/90 dark:border-slate-800/80 dark:backdrop-blur-md"
    >
      {/* 1) Insert (+) */}
      <div className="relative" ref={insertMenuRef}>
        <button
          type="button"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:border-[var(--accent-color)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent-color)] ${showInsertMenu ? "border-[var(--accent-color)] bg-[var(--accent-bg)] text-[var(--accent-color)]" : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setShowInsertMenu((s) => !s);
            setShowIconsMenu(false);
          }}
          title="Insertar"
        >
          <Plus className="h-4 w-4" />
        </button>

        {showInsertMenu && (
          <div className="absolute bottom-11 left-0 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-1">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onInsertImage();
                  setShowInsertMenu(false);
                }}
              >
                <Image className="h-4 w-4" />
                <span>Insertar imagen</span>
              </button>

              {/* Insertar tabla -> submenu */}
              <div className="relative">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowTableSubmenu((s) => !s)}
                >
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    <span>Insertar tabla</span>
                  </div>
                  <span className="text-xs text-slate-400">▷</span>
                </button>

                {showTableSubmenu && (
                  <div className="absolute left-full top-0 ml-2 w-36 rounded-xl border border-slate-200 bg-white p-2 shadow-md dark:border-slate-800 dark:bg-slate-900">
                    <button
                      className="w-full rounded-lg px-2 py-1 text-left text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => insertTable(2, 2)}
                    >
                      2x2
                    </button>
                    <button
                      className="w-full rounded-lg px-2 py-1 text-left text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => insertTable(3, 3)}
                    >
                      3x3
                    </button>
                    <button
                      className="w-full rounded-lg px-2 py-1 text-left text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => insertTable(4, 4)}
                    >
                      4x4
                    </button>
                    <button
                      className="w-full rounded-lg px-2 py-1 text-left text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => insertTable(5, 5)}
                    >
                      5x5
                    </button>
                  </div>
                )}
              </div>

              {/* Insertar fecha -> submenu */}
              <div className="relative">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowDateSubmenu((s) => !s)}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Insertar fecha</span>
                  </div>
                  <span className="text-xs text-slate-400">▷</span>
                </button>

                {showDateSubmenu && (
                  <div className="absolute left-full top-0 ml-2 w-64 rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 z-50">
                    {DATE_MENU_ITEMS.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          insertDate(item.type);
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <span className="truncate">{item.label}</span>
                        <kbd className="ml-2 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                          {item.shortcut}
                        </kbd>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onOpenPlantillas?.();
                  setShowInsertMenu(false);
                }}
              >
                <Minus className="h-4 w-4" />
                <span>Insertar plantilla</span>
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  console.info("Ver imágenes de la nota - placeholder");
                  setShowInsertMenu(false);
                }}
              >
                <Image className="h-4 w-4" />
                <span>Ver imágenes de la nota</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2) Header selector (H) */}
      <div>
        <select
          aria-label="Formato de encabezado"
          className="cursor-pointer rounded-xl border border-slate-200 bg-transparent px-2 py-1 text-xs font-semibold text-slate-700 outline-none transition-colors hover:border-[var(--accent-color)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent-color)] focus:border-[var(--accent-color)] focus:bg-[var(--accent-bg)] focus:text-[var(--accent-color)] dark:border-slate-700 dark:text-slate-200"
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
          <option value="p">P</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
          <option value="5">H5</option>
          <option value="6">H6</option>
        </select>
      </div>

      {/* 3) Icons (Star) */}
      <div className="relative" ref={iconsMenuRef}>
        <button
          type="button"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:border-[var(--accent-color)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent-color)] ${showIconsMenu ? "border-[var(--accent-color)] bg-[var(--accent-bg)] text-[var(--accent-color)]" : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setShowIconsMenu((s) => !s);
            setShowInsertMenu(false);
          }}
        >
          <Star className="h-4 w-4" />
        </button>

        {showIconsMenu && (
          <div className="absolute bottom-11 left-0 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 flex items-center gap-1">
              <button
                className={`rounded-xl px-2 py-1 text-xs text-slate-600 dark:text-slate-400 ${iconsTab === "indicadores" ? "bg-slate-100 dark:bg-slate-800 dark:text-slate-200" : ""}`}
                onClick={() => setIconsTab("indicadores")}
              >
                Indicadores
              </button>
              <button
                className={`rounded-xl px-2 py-1 text-xs text-slate-600 dark:text-slate-400 ${iconsTab === "simbolos" ? "bg-slate-100 dark:bg-slate-800 dark:text-slate-200" : ""}`}
                onClick={() => setIconsTab("simbolos")}
              >
                Símbolos
              </button>
              <button
                className={`rounded-xl px-2 py-1 text-xs text-slate-600 dark:text-slate-400 ${iconsTab === "enumeration" ? "bg-slate-100 dark:bg-slate-800 dark:text-slate-200" : ""}`}
                onClick={() => setIconsTab("enumeration")}
              >
                Enumeración
              </button>
              <button
                className={`rounded-xl px-2 py-1 text-xs text-slate-600 dark:text-slate-400 ${iconsTab === "herramientas" ? "bg-slate-100 dark:bg-slate-800 dark:text-slate-200" : ""}`}
                onClick={() => setIconsTab("herramientas")}
              >
                Herramientas
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {ICONS_MAP[iconsTab].map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor?.runEditorCommand((ed) =>
                      ed
                        .chain()
                        .focus(undefined, { scrollIntoView: false })
                        .insertContent(icon)
                        .run(),
                    );
                    setShowIconsMenu(false);
                  }}
                >
                  <span className="text-lg">{icon}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4) Bold */}
      {toolbarButton(Bold, "Negrita", () =>
        editor?.runEditorCommand((ed) =>
          ed
            .chain()
            .focus(undefined, { scrollIntoView: false })
            .toggleBold()
            .run(),
        ),
      )}

      {/* 5) Italic */}
      {toolbarButton(Italic, "Cursiva", () =>
        editor?.runEditorCommand((ed) =>
          ed
            .chain()
            .focus(undefined, { scrollIntoView: false })
            .toggleItalic()
            .run(),
        ),
      )}

      {/* 6) Underline */}
      <button
        type="button"
        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:border-[var(--accent-color)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent-color)] ${editor?.isActive("underline") ? "border-[var(--accent-color)] bg-[var(--accent-bg)] text-[var(--accent-color)]" : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"}`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .toggleUnderline()
              .run(),
          );
        }}
        title="Subrayado"
      >
        <span className="font-semibold">U</span>
      </button>

      {/* 7) Strikethrough */}
      <button
        type="button"
        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:border-[var(--accent-color)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent-color)] ${editor?.isActive("strike") ? "border-[var(--accent-color)] bg-[var(--accent-bg)] text-[var(--accent-color)]" : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"}`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .toggleStrike()
              .run(),
          );
        }}
        title="Tachado"
      >
        <span className="font-semibold">S</span>
      </button>

      {/* 8) Text color (Palette) */}
      <div className="relative" ref={textMenuRef}>
        <button
          type="button"
          title="Color de texto"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:border-[var(--accent-color)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent-color)] ${showTextColorMenu ? "border-[var(--accent-color)] bg-[var(--accent-bg)] text-[var(--accent-color)]" : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setShowTextColorMenu((s) => !s);
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
          </div>
        )}
      </div>

      {/* 9) Background color (Highlighter) */}
      <div className="relative" ref={bgMenuRef}>
        <button
          type="button"
          title="Color de fondo (Resaltador)"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:border-[var(--accent-color)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent-color)] ${showBgColorMenu ? "border-[var(--accent-color)] bg-[var(--accent-bg)] text-[var(--accent-color)]" : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setShowBgColorMenu((s) => !s);
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
                      const isInsideTable =
                        ed.isActive("tableCell") || ed.isActive("tableHeader");
                      const isInsideCallout = ed.isActive("customQuote");
                      const accentColor =
                        BG_TO_BORDER_MAP[colorHex.toUpperCase()] || "#6200ee";
                      if (isInsideTable) {
                        ed.chain()
                          .focus(undefined, { scrollIntoView: false })
                          .setCellAttribute("backgroundColor", colorHex)
                          .run();
                      } else if (isInsideCallout && selection.empty) {
                        ed.chain()
                          .focus(undefined, { scrollIntoView: false })
                          .updateAttributes("customQuote", {
                            backgroundColor: colorHex,
                            color: accentColor,
                          })
                          .run();
                      } else {
                        handleApplyHarmonicHighlight(ed, colorHex);
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
            <div className="mt-2 border-t border-slate-100 pt-1">
              <button
                type="button"
                className="w-full rounded-xl px-3 py-1.5 text-left text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor?.runEditorCommand((ed) => {
                    const { selection } = ed.state;
                    const isInsideTable =
                      ed.isActive("tableCell") || ed.isActive("tableHeader");
                    if (isInsideTable) {
                      ed.chain()
                        .focus(undefined, { scrollIntoView: false })
                        .setCellAttribute("backgroundColor", null)
                        .run();
                    } else if (ed.isActive("customQuote") && selection.empty) {
                      ed.chain()
                        .focus(undefined, { scrollIntoView: false })
                        .updateAttributes("customQuote", {
                          backgroundColor: "#F1F5F9",
                          color: "#64748B",
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

      {/* 10) Transformation select (Aa) */}
      <div>
        <select
          aria-label="Transformar texto"
          className="cursor-pointer rounded-lg border border-slate-200/80 bg-white/50 px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none transition-colors hover:border-transparent hover:bg-[var(--accent-bg)] hover:text-[var(--accent-color)] focus:border-transparent focus:bg-[var(--accent-bg)] focus:text-[var(--accent-color)] dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
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
                  .run();
                // apply harmonic highlight after setting text color
                handleApplyHarmonicHighlight(ed, randomBgColor);
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

      {/* 11) Clear format (Tx) */}
      <div>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-[var(--accent-color)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent-color)] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            editor?.runEditorCommand((ed) =>
              ed
                .chain()
                .focus(undefined, { scrollIntoView: false })
                .clearNodes()
                .unsetAllMarks()
                .run(),
            )
          }
          title="Limpiar formato"
        >
          <span className="text-xs">Tx</span>
        </button>
      </div>

      {/* 12..15) Alignment and lists */}
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

        {toolbarButton(
          List,
          "Lista con viñetas",
          () =>
            editor?.runEditorCommand((ed) =>
              ed
                .chain()
                .focus(undefined, { scrollIntoView: false })
                .toggleBulletList()
                .run(),
            ),
          !!editor?.isActive("bulletList"),
        )}
        {toolbarButton(
          ListOrdered,
          "Lista numerada",
          () =>
            editor?.runEditorCommand((ed) =>
              ed
                .chain()
                .focus(undefined, { scrollIntoView: false })
                .toggleOrderedList()
                .run(),
            ),
          !!editor?.isActive("orderedList"),
        )}
        {toolbarButton(CheckSquare, "Checklist", () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .toggleTaskList()
              .run(),
          ),
        )}
      </div>

      {/* 16) Quote / Callout */}
      {toolbarButton(
        Quote,
        `Cita destacada`,
        () =>
          editor?.runEditorCommand((ed) => {
            if (ed.isActive("customQuote")) {
              ed.chain()
                .focus(undefined, { scrollIntoView: false })
                .lift("customQuote")
                .run();
            } else {
              ed.chain()
                .focus(undefined, { scrollIntoView: false })
                .wrapIn("customQuote")
                .run();
            }
          }),
        !!editor?.isActive("customQuote"),
      )}

      {/* 17) Code block */}
      {toolbarButton(
        Slash,
        "Bloque de Código",
        () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .toggleCodeBlock()
              .run(),
          ),
        !!editor?.isActive("codeBlock"),
      )}

      {/* Sub/Superscript buttons (use handlers passed from parent) */}
      {toolbarButton(
        Subscript,
        "Subíndice",
        () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .toggleSubscript()
              .run(),
          ),
        !!editor?.isActive("subscript"),
      )}
      {toolbarButton(
        Superscript,
        "Superíndice",
        () =>
          editor?.runEditorCommand((ed) =>
            ed
              .chain()
              .focus(undefined, { scrollIntoView: false })
              .toggleSuperscript()
              .run(),
          ),
        !!editor?.isActive("superscript"),
      )}

      {/* 18) Horizontal rule */}
      {toolbarButton(Minus, "Línea horizontal separadora", () =>
        editor?.runEditorCommand((ed) =>
          ed
            .chain()
            .focus(undefined, { scrollIntoView: false })
            .setHorizontalRule()
            .run(),
        ),
      )}

      {/* 19..20) Undo / Redo */}
      <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5 dark:border-slate-800">
        {toolbarButton(RotateCcw, "Deshacer", () =>
          editor?.runEditorCommand((ed) =>
            ed.chain().focus(undefined, { scrollIntoView: false }).undo().run(),
          ),
        )}
        {toolbarButton(RotateCw, "Rehacer", () =>
          editor?.runEditorCommand((ed) =>
            ed.chain().focus(undefined, { scrollIntoView: false }).redo().run(),
          ),
        )}
      </div>

      {/* Emoji quick insert removed per UI cleanup */}
    </div>
  );
}
