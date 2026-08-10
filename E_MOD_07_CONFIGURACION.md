# 📄 E_MOD_07_CONFIGURACION.md - NoteHub Desktop

## 1. Frontera de Contexto y Aislamiento

### Archivo de Entrada Único
En Electron, la lectura y escritura de ajustes se procesa a través de la comunicación directa con la base de datos local:
- **Backend (Node.js):** `/electron/main/settings.ts` (Consultas y actualizaciones a la tabla `settings`).
- **Frontend (React):** `/src/modules/configuracion/index.ts` (Exportación centralizada de la vista de ajustes).

### Subcomponentes Permitidos (Frontend)
- **`/src/modules/configuracion/views/VistaConfiguracion.tsx`**: Contenedor principal dividido en dos columnas (Menú izquierdo y Panel de contenido derecho). Reemplaza a `AjustesScreen`[cite: 61].
- **`/src/modules/configuracion/components/MenuAjustes.tsx`**: Lista de categorías (Temas, Espacios, General, Editor) utilizando un estilo similar a `AjustesItem`[cite: 59].
- **`/src/modules/configuracion/sections/SeccionTemas.tsx`**: Panel para alternar el Modo Claro/Oscuro y seleccionar el color de acento. Adaptación de `TemasScreen`[cite: 64].
- **`/src/modules/configuracion/sections/SeccionEspacios.tsx`**: Panel para la gestión de espacios (editar nombre, mover al espacio por defecto, eliminar). Adaptación de `EspaciosScreen`[cite: 60].
- **`/src/modules/configuracion/sections/SeccionEditor.tsx`**: Panel para configurar la fuente, tamaño de letra y espaciados mediante deslizadores. Adaptación de `EditorScreen` (Tipografía)[cite: 62].
- **`/src/modules/configuracion/sections/SeccionGeneral.tsx`**: Información de idioma y versión[cite: 63].

### Dependencias
- **E_MOD_01 (SHARED_CORE):** Uso de `ThemeContext` para la actualización visual global, `NotificacionToast` para confirmación de guardado, y métodos IPC.
- **E_MOD_02 (Gestión de Espacios):** Reutilización de los métodos IPC de CRUD de espacios.

---

## 2. Requerimientos de Interfaz Visual (UI)

### A. Vista `VistaConfiguracion`
- Se renderiza al seleccionar "Configuración" o "Ajustes" desde el panel principal.
- **Layout dividido:** 
  - Columna izquierda (25% del ancho): Lista estática de categorías.
  - Columna derecha (75% del ancho): Contenido dinámico según la categoría seleccionada.

### B. Sección `SeccionTemas`
- **Modo Visual:** Botones grandes o tarjetas ilustradas para seleccionar entre "Claro", "Oscuro" y "Sistema"[cite: 64].
- **Color de Acento:** Cuadrícula con los colores disponibles (`#0277BD`, `#00838F`, etc.). El color seleccionado muestra un ícono de confirmación[cite: 64].

### C. Sección `SeccionEditor` (Tipografía)
- Menú desplegable para seleccionar la familia tipográfica (System, Serif, Monospace)[cite: 62].
- Controles deslizantes (Sliders nativos HTML `<input type="range">`) para:
  - Tamaño de fuente (12px - 24px)[cite: 62].
  - Espaciado lineal (1.0 - 2.5)[cite: 62].
  - Espaciado de párrafos (0px - 24px)[cite: 62].
- Cuadro de "Vista previa" con texto de prueba que reacciona en tiempo real a los cambios[cite: 62].

### D. Sección `SeccionEspacios`
- Lista de todos los espacios de trabajo registrados.
- Indicador visual (etiqueta) para el espacio "Por defecto"[cite: 60].
- Al hacer clic derecho o seleccionar opciones en un espacio, se muestran las acciones destructivas ("Mover notas y eliminar" o "Eliminar todo")[cite: 60].
- Estas acciones disparan obligatoriamente el `ConfirmacionEliminacionModal` antes de proceder.

---

## 3. Lógica y Reglas de Negocio (IPC Bridge)

### A. Guardado Inmediato
No existe un botón general de "Guardar". Cada vez que el usuario modifica un control (ej. cambia el tamaño de fuente o selecciona un color), el frontend ejecuta `window.electron.settings.set(key, value)` e inserta/actualiza el registro correspondiente en la tabla `settings`[cite: 62, 64].

### B. Aplicación del Tema Global
Al seleccionar un color de acento o cambiar el modo oscuro, el `ThemeContext` actualiza las variables CSS de la etiqueta `:root` de inmediato, provocando un repintado de toda la interfaz sin necesidad de recargar la aplicación[cite: 64].

### C. Eliminación de Espacios
Las acciones en `SeccionEspacios` reutilizarán el puente IPC de espacios.
- `MOVER_AL_DEFAULT`: Elimina el espacio y reasigna los cuadernos/notas vinculados al `workspace_id` del espacio por defecto[cite: 60].
- `ELIMINAR_TODO`: Ejecuta un borrado en cascada (Cascade Delete) de todo el contenido del espacio seleccionado[cite: 60].

---

## 4. Estado de Requerimientos (Checklist Técnico)

Para dar por completado el **E_MOD_07_CONFIGURACION**, se deben cumplir las siguientes tareas:

### Fase 7.1: Controladores Backend (Node.js)
- [ ] Implementar `/electron/main/settings.ts` con funciones para leer y escribir claves específicas o devolver todas las configuraciones.
- [ ] Exponer los métodos `settings.get` y `settings.set` en el `preload.ts`.

### Fase 7.2: Interfaz Base y Navegación
- [ ] Construir la estructura dividida `VistaConfiguracion` y el `MenuAjustes`.
- [ ] Implementar `SeccionGeneral` con los datos estáticos de la aplicación[cite: 63].

### Fase 7.3: Paneles de Ajustes Dinámicos
- [ ] Construir `SeccionTemas` e integrarlo con la escritura en SQLite y la lectura del `ThemeContext`[cite: 64].
- [ ] Construir `SeccionEditor` utilizando controles deslizantes nativos de HTML y vincularlos a las preferencias del editor de Tiptap[cite: 62].
- [ ] Construir `SeccionEspacios` adaptando el flujo de eliminación destructiva y los modales de confirmación[cite: 60].

### Criterio de Aceptación Final
El módulo se considera **APROBADO** cuando:
1. El usuario puede cambiar el tamaño de letra desde la configuración, regresar a la vista de notas y verificar que el texto del editor respeta el nuevo valor.
2. Los colores de acento se guardan correctamente y persisten al cerrar y volver a abrir la aplicación.
3. Se previene la eliminación accidental de un espacio forzando el diálogo de confirmación y respetando la lógica de protección del espacio por defecto.
