# 📄 E_MOD_02_GESTION_ESPACIOS.md - NoteHub Desktop

## 1. Frontera de Contexto y Aislamiento

### Archivo de Entrada Único

En la arquitectura de Electron, la responsabilidad de este módulo se divide entre el manejo de datos y la vista:

- **Backend (Node.js):** `/electron/main/workspaces.ts` (Controlador nativo para las consultas a SQLite).
- **Frontend (React):** `/src/modules/espacios/index.ts` (Barrel export que centraliza los componentes visuales de los espacios).

### Subcomponentes Permitidos (Frontend)

- **`/src/modules/espacios/components/SelectorEspacios.tsx`**: Componente ubicado en la parte superior del Sidebar fijo que muestra el espacio activo y permite cambiar entre ellos (Adaptación de `DrawerContent`).
- **`/src/modules/espacios/components/EspacioItem.tsx`**: Componente reutilizable para cada fila de espacio en las listas.
- **`/src/modules/espacios/components/NuevoEspacioModal.tsx`**: Modal de escritorio para la creación de un espacio.
- **`/src/modules/espacios/components/EditarEspacioModal.tsx`**: Modal de escritorio para editar nombre o eliminar el espacio actual.
- **`/src/modules/espacios/components/MoverEspacioModal.tsx`**: Modal para seleccionar un espacio de destino y mover cuadernos o notas.

### Dependencias

- **E_MOD_01 (SHARED_CORE):**
  - `NotificacionToast` para feedback de éxito o error al guardar.
  - `ConfirmacionEliminacionModal` para confirmar borrado de espacios.
  - Contexto de Tema para inyectar variables de color.
  - Llamadas IPC preconfiguradas para operaciones de base de datos.

---

## 2. Requerimientos de Interfaz Visual (UI)

### A. Componente `SelectorEspacios` (Panel Lateral Izquierdo)

- Reemplaza el menú hamburguesa móvil. Se posiciona fijo en la parte superior del panel lateral izquierdo.
- Muestra el nombre del espacio activo actual.
- Al hacer clic, despliega una lista (estilo Dropdown o sub-menú) con todos los espacios disponibles renderizando `EspacioItem`.
- Al final de la lista desplegada, incluye dos opciones fijas: "+ Nuevo Espacio" y "Editar Espacio Actual".

### B. Componente `EspacioItem`

Reutilización de la estructura visual móvil adaptada a web (HTML/Tailwind):

- Ícono `layers` (usando `lucide-react`) a la izquierda.
- Nombre del espacio.
- Etiqueta pequeña "Por defecto" si el espacio tiene la propiedad `is_default === 1`.
- Ícono de "check" si es el espacio activo seleccionado.
- Hover: Al pasar el cursor, el fondo debe cambiar ligeramente para indicar que es interactivo.

### C. Componente `NuevoEspacioModal`

- Adaptación de la pantalla completa móvil a un modal centrado en pantalla (React Portal).
- **Contenido:**
  - Título: "Nuevo espacio".
  - Input de texto para el nombre con auto-focus.
  - Fila informativa: "Bloquear - Próximamente" con un interruptor desactivado.
- **Acciones:**
  - Botón "Cancelar".
  - Botón "Hecho" (deshabilitado si el nombre está vacío o solo tiene espacios en blanco).

### D. Componente `EditarEspacioModal`

- Modal centrado para modificar el espacio.
- **Contenido:** Igual al de creación, pero con el nombre precargado.
- **Acciones Adicionales:**
  - Si el espacio editado **no es el espacio por defecto** (`is_default !== 1`), mostrar un botón en rojo "Eliminar" en la parte inferior.
  - Al presionar "Eliminar", se oculta este modal y se lanza el `ConfirmacionEliminacionModal` global.

### E. Componente `MoverEspacioModal`

- Adaptación de `MoverEspacioScreen` a un modal.
- Muestra una lista desplazable (`overflow-y-auto`) de todos los espacios disponibles.
- El espacio donde reside el elemento actualmente tiene el indicador de "check".
- Botón "Mover" deshabilitado hasta que se seleccione un espacio de destino distinto al actual.

---

## 3. Lógica y Reglas de Negocio

### A. Comunicación de Datos (IPC)

El backend de Node.js expondrá, a través del preload, las funciones para que el frontend ejecute:

1. `window.electron.workspaces.getAll()`: Retorna la lista completa.
2. `window.electron.workspaces.create(name)`: Inserta en SQLite y retorna el ID.
3. `window.electron.workspaces.update(id, name)`: Actualiza el registro.
4. `window.electron.workspaces.delete(id)`: Borra el registro en SQLite.
5. `window.electron.workspaces.moveElement(type, elementId, targetWorkspaceId)`: Ejecuta el UPDATE correspondiente.

### B. Inicialización y Selección

- Al cargar la lista de espacios, si no hay un ID activo en memoria, el frontend seleccionará por defecto el espacio que tenga `is_default === 1` y lo definirá como activo.

### C. Eliminación Protegida

- Se debe validar en la interfaz que el espacio `is_default === 1` no ofrezca el botón de eliminar.
- Mensaje del modal de confirmación al eliminar: _"¿Estás seguro de que deseas eliminar este espacio? Se moverán todas sus notas y cuadernos al espacio por defecto."_.

---

## 4. Estado de Requerimientos (Checklist Técnico)

Para dar por terminado el **E_MOD_02_GESTION_ESPACIOS**, el asistente debe completar:

### Fase 2.1: Controladores Backend (Node.js)

- [x] Implementar funciones CRUD para `workspaces` en `/electron/main/workspaces.ts`.
- [x] Exponer los métodos en el `preload.ts` para habilitar su consumo desde el frontend.

### Fase 2.2: Componentes UI Base

- [x] Crear el componente `EspacioItem` usando `lucide-react` y Tailwind CSS.
- [x] Integrar el componente `SelectorEspacios` que controle el estado del espacio activo global.

### Fase 2.3: Implementación de Modales

- [x] Construir `NuevoEspacioModal` asegurando el comportamiento del botón "Hecho" condicionado.
- [x] Construir `EditarEspacioModal` con la lógica de carga de datos y botón de eliminación condicional.
- [x] Construir `MoverEspacioModal` con selección de elementos de lista y validación de destino.

### Fase 2.4: Integración y Retroalimentación

- [x] Conectar la creación, edición, eliminación y movimiento a las funciones IPC correspondientes.
- [x] Tras cada operación exitosa, disparar el `NotificacionToast` con el mensaje apropiado (ej: "Espacio creado correctamente").
- [x] Actualizar automáticamente la lista de espacios en el frontend al terminar cualquier operación CRUD.

### Criterio de Aceptación Final

El módulo se considera **APROBADO** cuando:

1. El usuario puede ver sus espacios en el panel lateral.
2. Al crear o modificar un espacio, los cambios persisten en SQLite.
3. Se previene correctamente la eliminación del espacio por defecto.
4. Los modales se renderizan sobre la interfaz sin alterar la navegación principal de la aplicación.
