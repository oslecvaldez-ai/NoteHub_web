import { Info } from "lucide-react";

export function SeccionGeneral() {
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
    </div>
  );
}
