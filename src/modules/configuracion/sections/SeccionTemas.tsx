import { Check, Moon, Sun } from "lucide-react";
import { useTheme } from "../../../core/theme/useTheme";

const accentColors = ["#8B5CF6", "#2563EB", "#059669", "#DC2626", "#D97706"];

export function SeccionTemas() {
  const { mode, setMode, accentColor, setAccentColor } = useTheme();
  const modes = [
    { id: "light" as const, label: "Claro", icon: Sun },
    { id: "dark" as const, label: "Oscuro", icon: Moon },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Apariencia
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Personaliza el aspecto visual de NoteHub.
        </p>
      </div>
      <div className="mb-8 grid grid-cols-2 gap-4">
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => void setMode(id)}
            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border p-6 transition ${mode === id ? "border-purple-500 bg-purple-50/50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300" : "border-slate-200/80 bg-white text-slate-600 hover:border-purple-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"}`}
          >
            <Icon size={24} />
            <span className="text-sm font-bold">{label}</span>
          </button>
        ))}
      </div>
      <h4 className="mb-4 text-sm font-bold text-slate-800 dark:text-slate-200">
        Color de Acento
      </h4>
      <div className="flex flex-wrap gap-3">
        {accentColors.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Seleccionar color ${color}`}
            onClick={() => void setAccentColor(color)}
            style={{ backgroundColor: color }}
            className="flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition hover:scale-110"
          >
            {accentColor === color && (
              <Check size={18} className="text-white" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
