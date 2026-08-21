import {
  useEffect,
  useState,
  type ElementType,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";
import { BookOpen, Code2, HeartPulse, Layers, Target } from "lucide-react";
import { useNotifications } from "../../../core/components/useNotifications";
import { useTheme } from "../../../core/theme/useTheme";
import { X } from "../../../core/components/Iconos";
import { workspacesApi, type Workspace } from "../workspacesApi";
import { notesApi } from "../../notas/notesApi";
import {
  PRESETS_ESPACIOS,
  type PresetCuaderno,
  type PresetEspacio,
} from "../../../data/presetsEspacios";

export interface NuevoEspacioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (workspace: Workspace) => void;
}

function getModalRoot(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  let root = document.getElementById("modal-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "modal-root";
    document.body.appendChild(root);
  }
  return root;
}

async function createNotebookTree(
  workspaceId: number,
  presetNotebook: PresetCuaderno,
  parentNotebookId: number | null = null,
): Promise<void> {
  const notebook = await notesApi.notebooks.create(workspaceId, {
    name: presetNotebook.name,
    parentNotebookId,
    iconType: presetNotebook.cover ?? "folder",
    iconColor: presetNotebook.color ?? null,
  });
  if (!notebook) {
    throw new Error(`No se pudo crear el cuaderno ${presetNotebook.name}`);
  }

  // Se añade fallback seguro (?? []) por si el cuaderno es solo contenedor y no tiene notas directas
  for (const presetNote of presetNotebook.notes ?? []) {
    const note = await notesApi.notes.create(workspaceId, {
      notebookId: notebook.id,
      title: presetNote.title,
      content: presetNote.content,
    });
    if (!note) {
      throw new Error(`No se pudo crear la nota ${presetNote.title}`);
    }
  }

  // Recorrer subcuadernos recursivamente pasando el ID recién creado como parentNotebookId
  for (const subNotebook of presetNotebook.subNotebooks ?? []) {
    await createNotebookTree(workspaceId, subNotebook, notebook.id);
  }
}

export function NuevoEspacioModal({
  isOpen,
  onClose,
  onCreated,
}: NuevoEspacioModalProps): ReactElement | null {
  const [name, setName] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState("blank");
  const [isSaving, setIsSaving] = useState(false);
  const { notify: showNotification } = useNotifications();
  const { accentColor } = useTheme();

  useEffect(() => {
    if (isOpen) {
      setName(PRESETS_ESPACIOS[0].name);
      setSelectedPresetId("blank");
    }
  }, [isOpen]);

  if (!isOpen) return null;
  const modalRoot = getModalRoot();
  if (!modalRoot) return null;

  const canSubmit = name.trim().length > 0 && !isSaving;
  const selectedPreset =
    PRESETS_ESPACIOS.find((preset) => preset.id === selectedPresetId) ??
    PRESETS_ESPACIOS[0];

  const presetIcons: Record<string, ElementType> = {
    Layers,
    BookOpen,
    Code2,
    Target,
    HeartPulse,
  };

  async function handleSubmit(): Promise<void> {
    if (!canSubmit) return;
    setIsSaving(true);
    try {
      const workspaceName = name.trim() || selectedPreset.name;
      const workspace = await workspacesApi.create(workspaceName);
      if (!workspace) throw new Error("No se pudo crear el espacio");

      for (const presetNotebook of selectedPreset.notebooks) {
        await createNotebookTree(workspace.id, presetNotebook);
      }
      window.dispatchEvent(new CustomEvent("notes:updated"));
      window.dispatchEvent(new CustomEvent("workspaces:updated"));
      showNotification("Espacio creado correctamente", "success");
      onCreated?.(workspace);
      onClose();
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "No se pudo crear el espacio",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return createPortal(
    <div
      className="espacios-modal-overlay"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        aria-labelledby="nuevo-espacio-titulo"
        className="espacios-modal"
        role="dialog"
      >
        <button
          aria-label="Cerrar modal"
          className="espacios-modal-close"
          onClick={onClose}
          type="button"
        >
          <X size={20} />
        </button>
        <h2 id="nuevo-espacio-titulo">Nuevo espacio</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Elige una plantilla para comenzar con una estructura lista.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PRESETS_ESPACIOS.map((preset: PresetEspacio) => {
            const Icon = presetIcons[preset.icon] ?? Layers;
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setSelectedPresetId(preset.id);
                  if (!name.trim() || name === selectedPreset.name) {
                    setName(preset.name);
                  }
                }}
                style={
                  isSelected
                    ? {
                        borderColor: accentColor,
                        backgroundColor: `${accentColor}12`,
                      }
                    : undefined
                }
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800/70"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${accentColor}18`,
                    color: accentColor,
                  }}
                >
                  <Icon size={17} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                    {preset.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                    {preset.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <label htmlFor="nuevo-espacio-nombre">Nombre del espacio</label>
        <input
          autoFocus
          id="nuevo-espacio-nombre"
          onChange={(event) => setName(event.target.value)}
          placeholder={selectedPreset.name}
          value={name}
        />
        <div className="espacios-modal-actions">
          <button onClick={onClose} type="button">
            Cancelar
          </button>
          <button
            disabled={!canSubmit}
            onClick={() => void handleSubmit()}
            type="button"
          >
            {isSaving ? "Guardando..." : "Hecho"}
          </button>
        </div>
      </section>
    </div>,
    modalRoot,
  );
}
