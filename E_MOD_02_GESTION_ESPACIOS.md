# 📄 E_MOD_02_GESTION_ESPACIOS.md - NoteHub Desktop

## 1. Frontera de Contexto y Aislamiento

### Archivo de Entrada Único

En la arquitectura de Electron, la responsabilidad de este módulo se divide entre el manejo de datos y la vista:

- **Backend (Node.js):** `/electron/main/workspaces.ts` (Controlador nativo para las consultas a SQLite).
- **Frontend (React):** `/src/modules/espacios/index.ts` (Barrel export que centraliza los componentes visuales de los espacios).

### Subcomponentes Permitidos (Frontend)

- **`/src/modules/espacios/components/SelectorEspacios.tsx`**: Componente ubicado en la parte superior del Sidebar fijo que muestra el espacio activo y permite cambiar entre ellos (Adaptación de `DrawerContent`[cite: 20]).
- **`/src/modules/espacios/components/EspacioItem.tsx`**: Componente reutilizable para cada fila de espacio en las listas[cite: 24].
- **`/src/modules/espacios/components/NuevoEspacioModal.tsx`**: Modal de escritorio para la creación de un espacio[cite: 21].
- **`/src/modules/espacios/components/EditarEspacioModal.tsx`**: Modal de escritorio para editar nombre o eliminar el espacio actual[cite: 22].
- **`/src/modules/espacios/components/MoverEspacioModal.tsx`**: Modal para seleccionar un espacio de destino y mover cuadernos o notas[cite: 23].

### Dependencias

- **E_MOD_01 (SHARED_CORE):**
  - `NotificacionToast` para feedback de éxito o error al guardar.
  - `ConfirmacionEliminacionModal` para confirmar borrado de espacios.
  - Contexto de Tema para inyectar variables de color.
  - Llamadas IPC preconfiguradas para operaciones de base de datos.

---

## 2. Requerimientos de Interfaz Visual (UI)

### A. Componente `SelectorEspacios` (Panel Lateral Izquierdo)

- Reemplaza el menú hamburguesa móvil[cite: 19]. Se posiciona fijo en la parte superior del panel lateral izquierdo[cite: 17].
- Muestra el nombre del espacio activo actual[cite: 20].
- Al hacer clic, despliega una lista (estilo Dropdown o sub-menú) con todos los espacios disponibles renderizando `EspacioItem`[cite: 20].
- Al final de la lista desplegada, incluye dos opciones fijas: "+ Nuevo Espacio" y "Editar Espacio Actual"[cite: 20].

### B. Componente `EspacioItem`

Reutilización de la estructura visual móvil[cite: 24] adaptada a web (HTML/Tailwind):

- Ícono `layers` (usando `lucide-react`) a la izquierda[cite: 24].
- Nombre del espacio[cite: 24].
- Etiqueta pequeña "Por defecto" si el espacio tiene la propiedad `is_default === 1`[cite: 24].
- Ícono de "check" si es el espacio activo seleccionado[cite: 24].
- Hover: Al pasar el cursor, el fondo debe cambiar ligeramente para indicar que es interactivo.

### C. Componente `NuevoEspacioModal`

- Adaptación de la pantalla completa móvil[cite: 21] a un modal centrado en pantalla (React Portal).
- **Contenido:**
  - Título: "Nuevo espacio"[cite: 21].
  - Input de texto para el nombre con auto-focus[cite: 21].
  - Fila informativa: "Bloquear - Próximamente" con un interruptor desactivado[cite: 21].
- **Acciones:**
  - Botón "Cancelar".
  - Botón "Hecho" (deshabilitado si el nombre está vacío o solo tiene espacios en blanco)[cite: 21].

### D. Componente `EditarEspacioModal`

- Modal centrado para modificar el espacio[cite: 22].
- **Contenido:** Igual al de creación, pero con el nombre precargado[cite: 22].
- **Acciones Adicionales:**
  - Si el espacio editado **no es el espacio por defecto** (`is_default !== 1`), mostrar un botón en rojo "Eliminar" en la parte inferior[cite: 22].
  - Al presionar "Eliminar", se oculta este modal y se lanza el `ConfirmacionEliminacionModal` global[cite: 22].

### E. Componente `MoverEspacioModal`

- Adaptación de `MoverEspacioScreen`[cite: 23] a un modal.
- Muestra una lista desplazable (`overflow-y-auto`) de todos los espacios disponibles[cite: 23].
- El espacio donde reside el elemento actualmente tiene el indicador de "check"[cite: 23].
- Botón "Mover" deshabilitado hasta que se seleccione un espacio de destino distinto al actual[cite: 23].

---

## 3. Lógica y Reglas de Negocio

### A. Comunicación de Datos (IPC)

El backend de Node.js expondrá, a través del preload, las funciones para que el frontend ejecute:

1. `window.electron.workspaces.getAll()`: Retorna la lista completa[cite: 20].
2. `window.electron.workspaces.create(name)`: Inserta en SQLite y retorna el ID[cite: 21].
3. `window.electron.workspaces.update(id, name)`: Actualiza el registro[cite: 22].
4. `window.electron.workspaces.delete(id)`: Borra el registro en SQLite[cite: 22].
5. `window.electron.workspaces.moveElement(type, elementId, targetWorkspaceId)`: Ejecuta el UPDATE correspondiente[cite: 23].

### B. Inicialización y Selección

- Al cargar la lista de espacios, si no hay un ID activo en memoria, el frontend seleccionará por defecto el espacio que tenga `is_default === 1` y lo definirá como activo[cite: 20].

### C. Eliminación Protegida

- Se debe validar en la interfaz que el espacio `is_default === 1` no ofrezca el botón de eliminar[cite: 22].
- Mensaje del modal de confirmación al eliminar: *"¿Estás seguro de que deseas eliminar este espacio? Se moverán todas sus notas y cuadernos al espacio por defecto."*[cite: 22].

---

## 4. Estado de Requerimientos (Checklist Técnico)

Para dar por terminado el **E_MOD_02_GESTION_ESPACIOS**, el asistente debe completar:

### Fase 2.1: Controladores Backend (Node.js)

- [x] Implementar funciones CRUD para `workspaces` en `/electron/main/workspaces.ts`.
- [x] Exponer los métodos en el `preload.ts` para habilitar su consumo desde el frontend.

### Fase 2.2: Componentes UI Base

- [x] Crear el componente `EspacioItem` usando `lucide-react` y Tailwind CSS[cite: 24].
- [x] Integrar el componente `SelectorEspacios` que controle el estado del espacio activo global.

### Fase 2.3: Implementación de Modales

- [x] Construir `NuevoEspacioModal` asegurando el comportamiento del botón "Hecho" condicionado[cite: 21].
- [x] Construir `EditarEspacioModal` con la lógica de carga de datos y botón de eliminación condicional[cite: 22].
- [x] Construir `MoverEspacioModal` con selección de elementos de lista y validación de destino[cite: 23].

### Fase 2.4: Integración y Retroalimentación

- [x] Conectar la creación, edición, eliminación y movimiento a las funciones IPC correspondientes.
- [x] Tras cada operación exitosa, disparar el `NotificacionToast` con el mensaje apropiado (ej: "Espacio creado correctamente")[cite: 21, 22, 23].
- [x] Actualizar automáticamente la lista de espacios en el frontend al terminar cualquier operación CRUD.

### Criterio de Aceptación Final

El módulo se considera **APROBADO** cuando:

1. El usuario puede ver sus espacios en el panel lateral.
2. Al crear o modificar un espacio, los cambios persisten en SQLite.
3. Se previene correctamente la eliminación del espacio por defecto.
4. Los modales se renderizan sobre la interfaz sin alterar la navegación principal de la aplicación.
