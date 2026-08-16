# Sistema de Diseño Oficial: NoteHub UI

Este documento establece las reglas visuales, paleta de colores, tipografía, iconografía y estructura de componentes para todas las ventanas, modales, paneles y tarjetas de la aplicación.

---

## 1. Filosofía y Estilo Base

- **Enfoque:** Minimalista, elegante, moderno y limpio (inspirado en UpNote / Notion).
- **Esquinas y Bordes:** Curvaturas pronunciadas y suaves (`rounded-2xl`, `rounded-3xl`).
- **Profundidad:** Sombras amplias y difuminadas (`shadow-2xl`), fondos translúcidos con efecto de cristal (`backdrop-blur-sm`).
- **Soporte de Tema:** Adaptabilidad total e instantánea para modo claro (`light`) y modo oscuro (`dark`).

---

## 2. Paleta de Colores Oficial

### A. Superficies y Contenedores

- **Fondo Backdrop (Overlay):** `bg-slate-900/40 backdrop-blur-sm`
- **Contenedor Principal (Claro):** `bg-white border-slate-200/80`
- **Contenedor Principal (Oscuro):** `bg-slate-950 border-slate-800`
- **Superficies Secundarias / Tarjetas (Claro):** `bg-slate-50/50 border-slate-200/70`
- **Superficies Secundarias / Tarjetas (Oscuro):** `bg-slate-900/50 border-slate-800`

### B. Jerarquía de Texto

- **Títulos Principales:** `text-slate-900 dark:text-slate-100 font-bold`
- **Cuerpo y Opciones:** `text-slate-800 dark:text-slate-200 font-semibold`
- **Subtítulos y Descripciones:** `text-slate-400 dark:text-slate-500 font-normal`
- **Insignias / Acciones Secundarias:** `uppercase tracking-wider text-[10px] font-bold`

### C. Paleta Temática por Categoría (Iconos y Acentos Pastel)

| Categoría / Contexto                  | Fondo Icono (Claro) | Color Icono / Texto (Claro) | Fondo Icono (Oscuro) | Color Icono / Texto (Oscuro) | Hover Tarjeta                                     |
| :------------------------------------ | :------------------ | :-------------------------- | :------------------- | :--------------------------- | :------------------------------------------------ |
| **Identidad NoteHub / Nativo**        | `bg-purple-100`     | `text-purple-600`           | `bg-purple-900/50`   | `text-purple-300`            | `hover:border-purple-300 hover:bg-purple-50/70`   |
| **Documentos / PDF / Eliminar**       | `bg-red-100/80`     | `text-red-600`              | `bg-red-950/60`      | `text-red-400`               | `hover:border-red-200 hover:bg-red-50/40`         |
| **Markdown / Información / Búsqueda** | `bg-blue-100/80`    | `text-blue-600`             | `bg-blue-950/60`     | `text-blue-400`              | `hover:border-blue-200 hover:bg-blue-50/40`       |
| **Páginas Web / HTML / Éxito**        | `bg-emerald-100/80` | `text-emerald-600`          | `bg-emerald-950/60`  | `text-emerald-400`           | `hover:border-emerald-200 hover:bg-emerald-50/40` |
| **Texto Plano / Sistema / Neutro**    | `bg-slate-200`      | `text-slate-600`            | `bg-slate-800`       | `text-slate-300`             | `hover:border-slate-300 hover:bg-slate-100/60`    |

---

## 3. Estructura Estándar de Modales y Ventanas

### Cabecera (Header)

- Contenedor con borde inferior suave: `flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-5`.
- Icono identificador: Recuadro suave de `h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 flex items-center justify-center`.
- Botón de cierre: `h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800`.

### Tarjetas de Acción (Action Cards)

- Estructura: Botón interactivo con `group flex items-center gap-3 rounded-2xl p-3 text-left transition`.
- Contenedor del Icono: `h-9 w-9 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105`.
- Textos Internos:
  - Título: `text-xs font-bold`
  - Descripción: `text-[11px] text-slate-400 dark:text-slate-500 truncate`

### Zonas Especiales (Importación / Acciones Destacadas)

- Estilo: Borde discontinuo `border border-dashed border-purple-300 bg-purple-50/20 dark:border-purple-800/60 dark:bg-purple-950/10 rounded-2xl p-3.5`.
- Botón de acción integrado: Pastilla pequeña `bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-200 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase`.

---

## 4. Biblioteca de Iconos (Lucide Icons)

Se utiliza exclusivamente la librería `lucide-react`:

- **Acciones Principales:** `Sparkles`, `Package`, `UploadCloud`, `FileDown`, `X`.
- **Formatos y Archivos:** `FileText`, `FileType`, `Code2`.
- **Organización:** `Pin`, `Copy`, `FolderInput`, `Tag`, `Lock`, `Search`, `BarChart2`, `History`.
