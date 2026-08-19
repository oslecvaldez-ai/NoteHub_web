import { type ReactElement } from "react";
import { Play, Sparkles } from "lucide-react";
import type { Plantilla } from "../components/ItemPlantilla";

interface VistaPreviaPlantillaProps {
  plantilla: Plantilla | null;
  onUseTemplate: (plantilla: Plantilla) => void;
}

export function VistaPreviaPlantilla({
  plantilla,
  onUseTemplate,
}: VistaPreviaPlantillaProps): ReactElement {
  if (!plantilla) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-white p-8 text-center dark:bg-slate-950">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-50 text-purple-400 dark:bg-purple-950/30 dark:text-purple-500">
          <Sparkles className="h-8 w-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          Selecciona una plantilla
        </h3>
        <p className="max-w-xs text-xs text-slate-400 dark:text-slate-500">
          Haz clic en una plantilla de la lista central para visualizar su
          estructura o crear una nueva nota con ella.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5 dark:border-slate-800/60">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Vista Previa de Plantilla
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {plantilla.name}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => onUseTemplate(plantilla)}
          className="flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/25 transition hover:bg-purple-700 active:scale-95"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>Usar plantilla</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
        <div className="prose prose-slate max-w-none rounded-3xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/30 dark:prose-invert">
          <div
            dangerouslySetInnerHTML={{
              __html:
                plantilla.content ||
                '<p class="text-slate-400 italic">Plantilla sin contenido...</p>',
            }}
          />
        </div>
      </div>
    </div>
  );
}
