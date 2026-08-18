import { useEffect, useMemo, useState, type ReactElement } from "react";
import { AlertCircle, RefreshCw, Search, Trash2 } from "lucide-react";
import { ConfirmacionEliminacionModal } from "../../../core/components/ConfirmacionEliminacionModal";
import { useTheme } from "../../../core/theme/useTheme";
import { ItemPapelera, type NotaPapelera } from "../components/ItemPapelera";

interface PanelPapeleraProps {
  workspaceId: number;
  onNotesMutated?: () => void;
}

export function PanelPapelera({
  workspaceId,
  onNotesMutated,
}: PanelPapeleraProps): ReactElement {
  const { accentColor } = useTheme();
  const [notas, setNotas] = useState<NotaPapelera[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notaToDelete, setNotaToDelete] = useState<NotaPapelera | null>(null);
  const [showEmptyModal, setShowEmptyModal] = useState(false);

  const loadNotas = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await window.electron?.trash?.getAll(workspaceId);
      setNotas((data as NotaPapelera[]) ?? []);
    } catch (error) {
      console.error("Error al cargar papelera:", error);
      setNotas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotas();
  }, [workspaceId]);

  const filteredNotas = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return notas;

    return notas.filter(
      (nota) =>
        nota.title.toLowerCase().includes(query) ||
        nota.content.toLowerCase().includes(query),
    );
  }, [notas, search]);

  const handleRestore = async (noteId: number): Promise<void> => {
    try {
      await window.electron?.trash?.restore(noteId);
      await loadNotas();
      onNotesMutated?.();
      window.dispatchEvent(new CustomEvent("notes:updated"));
      window.dispatchEvent(new CustomEvent("trash:updated"));
    } catch (error) {
      console.error("Error al restaurar nota:", error);
    }
  };

  const handleConfirmDeletePermanent = async (): Promise<void> => {
    if (!notaToDelete) return;

    try {
      await window.electron?.trash?.deletePermanent(notaToDelete.id);
      setNotaToDelete(null);
      await loadNotas();
      onNotesMutated?.();
      window.dispatchEvent(new CustomEvent("notes:updated"));
      window.dispatchEvent(new CustomEvent("trash:updated"));
    } catch (error) {
      console.error("Error al eliminar nota permanentemente:", error);
    }
  };

  const handleConfirmEmptyTrash = async (): Promise<void> => {
    try {
      await window.electron?.trash?.empty(workspaceId);
      setShowEmptyModal(false);
      await loadNotas();
      onNotesMutated?.();
      window.dispatchEvent(new CustomEvent("notes:updated"));
      window.dispatchEvent(new CustomEvent("trash:updated"));
    } catch (error) {
      console.error("Error al vaciar papelera:", error);
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-50/50 dark:bg-slate-950/40">
      <div className="border-b border-slate-200/80 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <Trash2 className="h-5 w-5" style={{ color: accentColor }} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Papelera
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {notas.length === 1
                  ? "1 nota eliminada"
                  : `${notas.length} notas eliminadas`}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={notas.length === 0}
            onClick={() => setShowEmptyModal(true)}
            style={{ borderColor: accentColor, color: accentColor }}
            className="flex items-center gap-1.5 rounded-xl border bg-slate-50 px-3 py-1.5 text-xs font-semibold transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <Trash2 className="h-3.5 w-3.5" style={{ color: accentColor }} />
            <span>Vaciar Papelera</span>
          </button>
        </div>

        <div className="relative mt-3">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar en papelera..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-600"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {loading ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-xs text-slate-400">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Cargando notas eliminadas...</span>
          </div>
        ) : filteredNotas.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2.5 text-center text-slate-400 dark:text-slate-500">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
              <Trash2 className="h-6 w-6" style={{ color: accentColor }} />
            </div>
            <p className="text-sm font-semibold">La papelera está vacía</p>
            <p className="max-w-[200px] text-xs text-slate-400">
              Las notas que elimines aparecerán aquí para recuperarlas cuando lo
              necesites.
            </p>
          </div>
        ) : (
          filteredNotas.map((nota) => (
            <ItemPapelera
              key={nota.id}
              nota={nota}
              onRestore={handleRestore}
              onDeletePermanent={(entry) => setNotaToDelete(entry)}
            />
          ))
        )}
      </div>

      <ConfirmacionEliminacionModal
        isOpen={notaToDelete !== null}
        title="Eliminar permanentemente"
        message={`¿Estás seguro de que deseas eliminar permanentemente la nota \"${notaToDelete?.title ?? "Sin título"}\"? Esta acción no se puede deshacer.`}
        onCancel={() => setNotaToDelete(null)}
        onConfirm={handleConfirmDeletePermanent}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />

      <ConfirmacionEliminacionModal
        isOpen={showEmptyModal}
        title="Vaciar papelera"
        message="Esta acción es irreversible. Se eliminarán permanentemente todas las notas de la papelera."
        onCancel={() => setShowEmptyModal(false)}
        onConfirm={handleConfirmEmptyTrash}
        confirmLabel="Vaciar"
        cancelLabel="Cancelar"
      />

      <div className="pointer-events-none fixed bottom-4 right-4 z-10 flex items-center gap-2 rounded-full bg-red-900/80 px-3 py-1.5 text-[11px] font-medium text-white opacity-0 data-[visible='true']:opacity-100">
        <AlertCircle className="h-3.5 w-3.5" />
        <span>Acción irreversible</span>
      </div>
    </div>
  );
}
