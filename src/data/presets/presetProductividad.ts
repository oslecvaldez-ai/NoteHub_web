import type { PresetEspacio } from "../presetsEspacios";

export const presetProductividad: PresetEspacio = {
  id: "productividad",
  name: "Productividad y Proyectos",
  description: "Metas, bitácora semanal e ideas para avanzar con claridad.",
  icon: "Target",
  notebooks: [
    {
      name: "Metas",
      cover: "Target",
      notes: [
        {
          title: "Mis metas",
          content: "<h3>Objetivo:</h3><p></p><h3>Próximos pasos:</h3><p></p>",
        },
      ],
    },
    {
      name: "Bitácora Semanal",
      cover: "CalendarDays",
      notes: [
        {
          title: "Semana en curso",
          content: "<h3>Logros:</h3><p></p><h3>Aprendizajes:</h3><p></p>",
        },
      ],
    },
    {
      name: "Ideas",
      cover: "Lightbulb",
      notes: [
        {
          title: "Banco de ideas",
          content: "<p>Captura aquí tus próximas ideas.</p>",
        },
      ],
    },
  ],
};
