import { useEffect, useMemo, useState, type ReactElement } from "react";
import { LayoutTemplate, Plus, RefreshCw, Search } from "lucide-react";
import { useTheme } from "../../../core/theme/useTheme";
import { ItemPlantilla, type Plantilla } from "../components/ItemPlantilla";

interface PanelPlantillasProps {
  workspaceId: number;
  selectedTemplateId?: number | null;
  onSelectTemplate: (plantilla: Plantilla) => void;
  onCreateNewTemplate: () => void;
  onEditTemplate: (plantilla: Plantilla) => void;
  refreshTrigger?: number;
}

export function PanelPlantillas({
  workspaceId,
  selectedTemplateId,
  onSelectTemplate,
  onCreateNewTemplate,
  onEditTemplate,
  refreshTrigger,
}: PanelPlantillasProps): ReactElement {
  const { accentColor } = useTheme();
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadPlantillas = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await window.electron?.templates?.getAll(workspaceId);
      setPlantillas((data as Plantilla[]) ?? []);
    } catch (error) {
      console.error("Error al cargar plantillas:", error);
      setPlantillas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPlantillas();
  }, [workspaceId, refreshTrigger]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return plantillas;

    return plantillas.filter(
      (template) =>
        template.name.toLowerCase().includes(query) ||
        template.content.toLowerCase().includes(query),
    );
  }, [plantillas, search]);

  const handleDeleteTemplate = async (templateId: number): Promise<void> => {
    try {
      await window.electron?.templates?.delete(templateId);
      window.dispatchEvent(new CustomEvent("templates:updated"));
      await loadPlantillas();
    } catch (error) {
      console.error("Error al eliminar plantilla:", error);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="border-b border-slate-200/80 bg-white px-5 py-4 dark:border-slate-800/60 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <LayoutTemplate
                className="h-5 w-5"
                style={{ color: accentColor }}
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Plantillas
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {plantillas.length === 1
                  ? "1 plantilla"
                  : `${plantillas.length} plantillas`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCreateNewTemplate}
            style={{ backgroundColor: accentColor }}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nueva Plantilla</span>
          </button>
        </div>

        <div className="relative mt-3">
          <Search
            className="absolute left-3 top-2.5 h-3.5 w-3.5"
            style={{ color: accentColor }}
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar plantillas..."
            style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
        {loading ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-xs text-slate-400">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Cargando plantillas...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2.5 text-center text-slate-400 dark:text-slate-500">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
              <LayoutTemplate className="h-6 w-6 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-sm font-semibold">
              No hay plantillas disponibles
            </p>
            <p className="max-w-[220px] text-xs text-slate-400">
              Crea estructuras reutilizables para tus notas con el botón
              superior.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <ItemPlantilla
              key={item.id}
              plantilla={item}
              isSelected={selectedTemplateId === item.id}
              onDelete={handleDeleteTemplate}
              onEdit={onEditTemplate}
              onSelect={onSelectTemplate}
            />
          ))
        )}
      </div>
    </div>
  );
}
