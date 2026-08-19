import React, { useState } from "react";
import {
  Archive,
  Download,
  RefreshCw,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { SuccessModal } from "../components/SuccessModal";
import { useTheme } from "../../../core/theme/useTheme";

export const PanelRespaldos: React.FC = () => {
  const { accentColor } = useTheme();
  const [loading, setLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      // @ts-expect-error electron API injected via preload
      const result = await window.electron.backup.create();
      if (result.success) {
        setModalInfo({
          isOpen: true,
          title: "Respaldo Exitoso",
          message: `El archivo se guardó correctamente. Se incluyeron ${result.imageCount ?? 0} imágenes.`,
        });
      } else if (result.error) {
        alert(`Error al generar respaldo: ${result.error}`);
      }
    } catch (err) {
      alert(
        `Error inesperado: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreBackup = async () => {
    const confirmed = window.confirm(
      "Restaurar una copia de seguridad sobrescribirá la base de datos actual y sus imágenes. ¿Deseas continuar?",
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      // @ts-expect-error electron API injected via preload
      const result = await window.electron.backup.restore();
      if (result.success) {
        setModalInfo({
          isOpen: true,
          title: "Restauración Completada",
          message:
            "La base de datos y archivos se restauraron correctamente. La aplicación se recargará.",
        });
      } else if (result.error) {
        alert(`Error al restaurar: ${result.error}`);
      }
    } catch (err) {
      alert(
        `Error inesperado: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalInfo({ isOpen: false, title: "", message: "" });
    if (modalInfo.title === "Restauración Completada") {
      window.location.reload();
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 bg-white p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Archive className="w-6 h-6" style={{ color: accentColor }} />
          Copias de Seguridad y Restauración
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Exporta todos tus datos locales o restaura un respaldo previo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Crear Respaldo */}
        <div className="flex flex-col justify-between space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold mb-1">
              <Download className="w-5 h-5" style={{ color: accentColor }} />
              Crear Respaldo Local
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Genera un archivo comprimido (.zip) que incluye la base de datos
              SQLite y todas las imágenes locales.
            </p>
          </div>
          <button
            onClick={handleCreateBackup}
            disabled={loading}
            style={{ backgroundColor: accentColor }}
            className="w-full py-2 px-4 hover:opacity-90 disabled:opacity-50 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-opacity"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Generar Respaldo
          </button>
        </div>

        {/* Restaurar Respaldo */}
        <div className="flex flex-col justify-between space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold mb-1">
              <Upload className="w-5 h-5" style={{ color: accentColor }} />
              Restaurar desde Respaldo
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Selecciona un archivo .zip para recuperar notas, carpetas,
              etiquetas e imágenes.
            </p>
          </div>
          <button
            onClick={handleRestoreBackup}
            disabled={loading}
            style={{ borderColor: accentColor, color: accentColor }}
            className="w-full py-2 px-4 border-2 bg-transparent transition hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:opacity-50 font-medium rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Restaurar Datos
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-semibold">Información Importante</p>
          <p>
            Los respaldos locales contienen la totalidad de tu información.
            Asegúrate de guardar los archivos en un lugar seguro. Al restaurar,
            se reemplazará la información existente en este dispositivo.
          </p>
        </div>
      </div>

      <SuccessModal
        isOpen={modalInfo.isOpen}
        title={modalInfo.title}
        message={modalInfo.message}
        onClose={handleCloseModal}
      />
    </div>
  );
};
