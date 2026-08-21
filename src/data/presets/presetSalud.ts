import type { PresetEspacio } from "../presetsEspacios";

export const presetSalud: PresetEspacio = {
  id: "salud",
  name: "Salud y Bienestar",
  description: "Rutinas, nutrición y seguimiento de hábitos saludables.",
  icon: "HeartPulse",
  notebooks: [
    {
      name: "Rutinas",
      cover: "Dumbbell",
      notes: [
        {
          title: "Rutina de entrenamiento",
          content: "<h3>Entrenamiento:</h3><p></p><h3>Registro:</h3><p></p>",
        },
      ],
    },
    {
      name: "Nutrición",
      cover: "Apple",
      notes: [
        {
          title: "Registro de nutrición",
          content: "<h3>Comidas:</h3><p></p><h3>Observaciones:</h3><p></p>",
        },
      ],
    },
  ],
};
