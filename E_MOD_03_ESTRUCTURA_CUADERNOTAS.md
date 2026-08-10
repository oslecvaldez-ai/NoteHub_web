# 📄 E_MOD_03_ESTRUCTURA_CUADERNOTAS.md - NoteHub Desktop

## 1. Frontera de Contexto y Aislamiento

### Archivo de Entrada Único
En Electron, la lógica de listas y carpetas se divide entre:
- **Backend (Node.js):** `/electron/main/notebooks.ts` y `/electron/main/notes.ts` (Controladores SQLite nativos).
- **Frontend (React):** `/src/modules/notas/index.ts` (Centraliza los componentes del Sidebar y la Lista Central).

### Subcomponentes Permitidos (Frontend)
- **`/src/modules/notas/components/SidebarNavegacion.tsx`**: Contiene los accesos a "Todas las notas", "Acceso Rápido", "Plantillas" y "Papelera" (Adaptación directa del `SubmenuLateral`[cite: 30]).
- **`/src/modules/notas/components/ArbolCuadernos.tsx`**: Renderiza la jerarquía de cuadernos (reemplazo de `CollapsibleNotebookItem`[cite: 30]).
- **`/src/modules/notas/components/PanelCentralNotas.tsx`**: Columna central con barra de búsqueda, filtros y el listado de notas.
- **`/src/modules/notas/components/NotaListItem.tsx`**: Adaptación web del `NotaItem` móvil para mostrar título, extracto y miniatura[cite: 28].
- **`/src/modules/notas/components/MenuContextual.tsx`**: Menú flotante (React Portal) que aparece al hacer clic derecho en cuadernos o notas (Reemplaza a `NotaItemContextual`[cite: 27] y `MenuContextualInferior`[cite: 29]).
- **`/src/modules/notas/components/NuevoCuadernoModal.tsx`**: Modal para crear o editar cuadernos.
- **`/src/modules/notas/components/SeleccionCuadernoModal.tsx`**: Modal para mover notas masivamente (Adaptación de `SeleccionCuadernoView`[cite: 26]).

### Dependencias
- **E_MOD_01 (SHARED_CORE):** Para Toasts, Modales de confirmación de eliminación y utilidades de fecha.
- **E_MOD_02 (Gestión de Espacios):** Para inyectar el `workspaceId` activo.

---

## 2. Requerimientos de Interfaz Visual (UI)

### A. Componentes del Panel Lateral Izquierdo (Sidebar)
1. **Navegación Base:** Links para "Todas las notas" y "Acceso Rápido" con sus respectivos iconos de `lucide-react`[cite: 30]. El diseño visual imitará el padding y hover state con el color primario de acento (`rgba` o clases de Tailwind)[cite: 30].
2. **Árbol de Cuadernos:**
   - Lista recursiva que muestra icono de carpeta/personalizado, nombre y contador de notas[cite: 30, 32].
   - Al pasar el cursor (hover), muestra un ícono de flecha (`chevron-right` / `chevron-down`) para expandir subcuadernos si `hasChildren` es verdadero[cite: 30, 32].
   - **Clic derecho (onContextMenu):** Abre un menú para "Editar", "Eliminar" o "Nuevo subcuaderno"[cite: 30].

### B. Panel Central (Lista de Notas)
1. **Cabecera del Panel:**
   - Barra de búsqueda de ancho completo (Reemplaza al tab de Lupa de la `BarraInferior`[cite: 31]).
   - Botones compactos para "Ordenar" (sort) y modo de "Selección Múltiple"[cite: 29].
   - Botón primario: "+ Nueva Nota" (Reemplazo del `FABContextual`[cite: 25]).
2. **Listado (`NotaListItem`):**
   - Renderiza el título, extracto (`extraerExtracto`), fecha formateada y miniatura de imagen si existe[cite: 28].
   - En modo selección múltiple, muestra un checkbox a la izquierda[cite: 28].
   - **Clic izquierdo:** Selecciona la nota y la abre en el panel derecho (Editor).
   - **Clic derecho:** Despliega menú contextual: "Anclar/Desanclar" (Acceso rápido), "Duplicar", "Mover", "Eliminar"[cite: 27, 29].

### C. Modales de Gestión
1. **`NuevoCuadernoModal`:** Formulario con campo de nombre, selector de icono (grid) y color.
2. **`SeleccionCuadernoModal`:** Árbol visual de cuadernos en modal para elegir el destino de notas movidas, con un checkbox indicando la selección actual[cite: 26].

---

## 3. Lógica y Reglas de Negocio (IPC Bridge)

### A. Comunicación con SQLite (Backend Node.js)
El frontend consumirá los siguientes canales IPC expuestos en el preload:
- `window.electron.notebooks.getAll(workspaceId)`
- `window.electron.notebooks.create(data)` / `update(id, data)` / `delete(id)`
- `window.electron.notes.getByWorkspace(workspaceId)`
- `window.electron.notes.duplicate(id)`[cite: 27]
- `window.electron.notes.togglePin(id)` / `toggleQuickAccess(id)`[cite: 27]
- `window.electron.notes.delete(id)` (Soft delete seteando `is_deleted = 1`).

### B. Manejo de Contexto y Selecciones
- **Comportamiento Táctil Mandatorio adaptado:** Al hacer clic en un cuaderno en el Sidebar, el panel central se filtra para mostrar solo las notas correspondientes a ese `notebookId`.
- **Selección Múltiple:** Al activar este modo, la cabecera central cambia para mostrar acciones masivas (Mover seleccionadas, Eliminar seleccionadas) usando un array local de `selectedNoteIds`[cite: 28, 29].
- El estado visual activo (fondo con opacidad del color primario) debe persistir tanto en el ítem seleccionado del sidebar como en la nota seleccionada del panel central[cite: 28, 30].

---

## 4. Estado de Requerimientos (Checklist Técnico)

Para dar por completado el **E_MOD_03_ESTRUCTURA_CUADERNOTAS**, el asistente de IA debe completar:

### Fase 3.1: Controladores Backend (Node.js)
- [ ] Implementar los handlers IPC en `/electron/main/notebooks.ts` y `/electron/main/notes.ts`.
- [ ] Exponer los métodos en el `preload.ts`.

### Fase 3.2: Panel Lateral (Sidebar)
- [ ] Maquetar `SidebarNavegacion` con las secciones estáticas (Todas, Favoritas, Papelera, Plantillas)[cite: 30].
- [ ] Implementar el `ArbolCuadernos` con soporte recursivo (nested items) y contadores[cite: 30].
- [ ] Implementar menú contextual nativo (clic derecho) para las acciones de edición de cuaderno[cite: 30].

### Fase 3.3: Panel Central (Listado)
- [ ] Maquetar la cabecera con el input de búsqueda y el botón "+ Nueva Nota" (reemplazando el FAB)[cite: 25, 31].
- [ ] Construir `NotaListItem` asegurando la correcta extracción de imágenes y renderizado de texto truncado[cite: 28].
- [ ] Implementar menú contextual para notas (Anclar, Duplicar, Eliminar)[cite: 27].
- [ ] Implementar el estado y UI del modo de "Selección múltiple"[cite: 28, 29].

### Fase 3.4: Modales
- [ ] Implementar `SeleccionCuadernoModal` para la acción de mover notas[cite: 26].
- [ ] Implementar `NuevoCuadernoModal`.

### Criterio de Aceptación Final
El módulo se considera **APROBADO** cuando:
1. El usuario puede crear un árbol de cuadernos con soporte multinivel desde el escritorio.
2. Al seleccionar "Todas las notas" o un cuaderno, el panel central se actualiza dinámicamente.
3. El clic derecho funciona abriendo menús contextuales precisos sin comportamiento nativo del navegador que estorbe.
4. Las listas responden fluidamente al modo oscuro y a los colores de acento configurados.
