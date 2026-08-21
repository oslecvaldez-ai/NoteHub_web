import type { PresetEspacio } from "../presetsEspacios";

export const presetBlank: PresetEspacio = {
  id: "blank",
  name: "Estándar (Lienzo en blanco)",
  description: "Espacio vacío para organizar tus notas a tu manera.",
  icon: "Layers",
  notebooks: [
    {
      name: "General",
      cover: "Folder",
      notes: [
        {
          title: "Bienvenido a tu nuevo espacio",
          content: "<p>Comienza escribiendo aquí tus ideas...</p>",
        },
      ],
    },
  ],
};
