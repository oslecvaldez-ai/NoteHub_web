import React, { useEffect, useMemo, useState } from "react";
import { Copy, LayoutTemplate, Search, X } from "lucide-react";

interface Template {
  id: number;
  name: string;
  content: string;
}

interface InsertarPlantillaModalProps {
  isOpen: boolean;
  workspaceId: number | null;
  onClose: () => void;
  onSelectTemplate: (content: string) => void;
}

export const InsertarPlantillaModal: React.FC<InsertarPlantillaModalProps> = ({
  isOpen,
  workspaceId,
  onClose,
  onSelectTemplate,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !workspaceId) return;

    const loadTemplates = async () => {
      try {
        setLoading(true);
        const data =
          await window.electron?.templates?.getByWorkspace(workspaceId);
        setTemplates((data as Template[]) || []);
      } catch (err) {
        console.error("Error al cargar plantillas:", err);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    void loadTemplates();
  }, [isOpen, workspaceId]);

  const filteredTemplates = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(q) ||
        template.content
          .replace(/<[^>]*>/g, " ")
          .toLowerCase()
          .includes(q),
    );
  }, [search, templates]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div
        className="flex max-h-[80vh] w-full max-w-md flex-col rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-950"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Insertar plantilla
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Selecciona una plantilla para añadir a la nota
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onClose}
            aria-label="Cerrar modal de plantillas"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar plantilla..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>

        <div className="max-h-[300px] flex-1 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
          {loading ? (
            <p className="py-6 text-center text-xs text-slate-400">
              Cargando plantillas...
            </p>
          ) : filteredTemplates.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">
              No hay plantillas disponibles
            </p>
          ) : (
            filteredTemplates.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTemplate(item.content);
                  onClose();
                }}
                className="group flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40 dark:border-slate-800/60 dark:bg-slate-900/40 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/20"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200/60 transition group-hover:scale-105 group-hover:text-indigo-600 dark:bg-slate-800 dark:ring-slate-700">
                  <Copy className="h-4 w-4 text-slate-500 group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-semibold text-slate-800 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400">
                    {item.name}
                  </h4>
                  <p className="truncate text-xs text-slate-400">
                    {item.content
                      .replace(/<[^>]*>/g, " ")
                      .replace(/\s+/g, " ")
                      .trim() || "Sin contenido"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
