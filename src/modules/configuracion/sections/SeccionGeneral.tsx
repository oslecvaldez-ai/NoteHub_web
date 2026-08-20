import { Info } from "lucide-react";
import { useTheme } from "../../../core/theme/useTheme";
import { useSettings } from "../../../core/settings/useSettings";

export function SeccionGeneral() {
  const { accentColor } = useTheme();
  const { collapseNotebooksByDefault, toggleCollapseNotebooksByDefault } =
    useSettings();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          General
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Información de la aplicación y sistema.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/50">
        {[
          ["Idioma", "Español"],
          ["Versión", "1.0.0 (Escritorio)"],
        ].map(([label, value], index) => (
          <div
            key={label}
            className={`flex items-center justify-between p-4 ${index === 0 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Info size={18} />
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {label}
              </span>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {value}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition dark:border-slate-800/60 dark:bg-slate-900/80">
        <div className="space-y-0.5">
          <label
            className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-100"
            htmlFor="toggle-collapse-notebooks"
          >
            Colapsar lista de cuadernos por defecto
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Al iniciar la aplicación, la sección de cuadernos aparecerá cerrada.
          </p>
        </div>
        <button
          id="toggle-collapse-notebooks"
          type="button"
          role="switch"
          aria-checked={collapseNotebooksByDefault}
          onClick={() =>
            toggleCollapseNotebooksByDefault(!collapseNotebooksByDefault)
          }
          style={{
            backgroundColor: collapseNotebooksByDefault
              ? accentColor
              : undefined,
          }}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!collapseNotebooksByDefault ? "bg-slate-200 dark:bg-slate-700" : ""}`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${collapseNotebooksByDefault ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>
    </div>
  );
}
