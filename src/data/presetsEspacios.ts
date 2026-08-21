import { presetBlank } from "./presets/presetBlank";
import { presetBiblico } from "./presets/presetBiblico";
import { presetDev } from "./presets/presetDev";
import { presetProductividad } from "./presets/presetProductividad";
import { presetSalud } from "./presets/presetSalud";

export interface PresetNota {
  title: string;
  content: string;
}

export interface PresetCuaderno {
  name: string;
  cover?: string;
  color?: string;
  notes?: PresetNota[];
  subNotebooks?: PresetCuaderno[];
}

export interface PresetEspacio {
  id: string;
  name: string;
  description: string;
  icon: string;
  notebooks: PresetCuaderno[];
}

export const PRESETS_ESPACIOS: PresetEspacio[] = [
  presetBlank,
  presetBiblico,
  presetDev,
  presetProductividad,
  presetSalud,
];
