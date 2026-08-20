import { Type } from "lucide-react";
import { useTheme } from "../../../core/theme/useTheme";
import { useEditorSettings } from "../../../core/editor-settings/useEditorSettings";

export function SeccionEditor() {
  const { accentColor } = useTheme();
  const {
    fontFamily,
    fontSize,
    lineHeight,
    paragraphSpacing,
    setFontFamily,
    setFontSize,
    setLineHeight,
    setParagraphSpacing,
  } = useEditorSettings();
  const fontOptions = [
    { id: "system" as const, label: "System" },
    { id: "serif" as const, label: "Serif" },
    { id: "monospace" as const, label: "Monospace" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Editor y Tipografía
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ajusta la experiencia de lectura y escritura.
        </p>
      </div>
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">
            Fuente Base
          </label>
          <div className="flex gap-3">
            {fontOptions.map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => {
                  setFontFamily(font.id);
                }}
                style={
                  fontFamily === font.id
                    ? { borderColor: accentColor, color: accentColor }
                    : undefined
                }
                className={`flex-1 rounded-xl border p-2.5 text-sm font-semibold transition ${fontFamily === font.id ? "bg-slate-50 dark:bg-slate-800/60" : "border-slate-200/80 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"}`}
              >
                {font.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
          {[
            [
              "Tamaño de fuente",
              `${fontSize}px`,
              "font_size",
              12,
              24,
              1,
              fontSize,
              setFontSize,
            ],
            [
              "Espaciado lineal",
              lineHeight.toFixed(1),
              "line_spacing",
              1,
              2.5,
              0.1,
              lineHeight,
              setLineHeight,
            ],
            [
              "Espaciado de párrafo",
              `${paragraphSpacing}px`,
              "paragraph_spacing",
              0,
              32,
              1,
              paragraphSpacing,
              setParagraphSpacing,
            ],
          ].map(([label, display, key, min, max, step, value, setter]) => (
            <div key={String(key)}>
              <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span>{String(label)}</span>
                <span>{String(display)}</span>
              </div>
              <input
                type="range"
                min={Number(min)}
                max={Number(max)}
                step={Number(step)}
                value={Number(value)}
                onChange={(event) =>
                  (setter as (value: number) => void)(
                    Number(event.target.value),
                  )
                }
                style={{ accentColor }}
              />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
            <Type size={16} className="text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Vista Previa
            </span>
          </div>
          <div
            style={{
              fontFamily:
                fontFamily === "system"
                  ? "inherit"
                  : fontFamily === "serif"
                    ? "serif"
                    : "monospace",
              fontSize: `${fontSize}px`,
              lineHeight,
            }}
            className="text-slate-800 dark:text-slate-200"
          >
            <p style={{ marginBottom: `${paragraphSpacing}px` }}>
              El diseño no es solo cómo se ve y se siente. El diseño es cómo
              funciona.
            </p>
            <p>
              NoteHub te permite capturar tus ideas con claridad y sin
              distracciones, adaptándose completamente a tus preferencias de
              lectura.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
