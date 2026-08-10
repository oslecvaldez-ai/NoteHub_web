# 📄 E_MOD_01_SHARED_CORE.md - NoteHub Desktop

## 1. Frontera de Contexto y Aislamiento

### Archivo de Entrada Único

En Electron, el núcleo compartido se divide en dos mundos que se comunican entre sí.

- **Backend (Node.js):** `/electron/main/database.ts` y `/electron/main/files.ts` (Controladores nativos).
- **Frontend (React):** `/src/core/index.ts` (Barrel export que centraliza componentes, contextos y utilidades).

### Subcomponentes Permitidos (Frontend - `/src/core/`)

- **`/src/core/theme/`**: Configuración del `ThemeContext` (Adaptado a web/CSS).
- **`/src/core/components/`**: Componentes UI globales (`NotificacionToast`, `AppWrapper`, `VisorImagenModal`, `ConfirmacionEliminacionModal`, `Iconos`).
- **`/src/core/ipc/`**: Envoltorios tipados para llamar a la base de datos y archivos mediante `window.electron`.
- **`/src/core/utils/`**: Funciones puras (fechas y validaciones).

### Dependencias Externas Aprobadas

- `better-sqlite3` (Motor de DB para el Main Process de Node.js).
- `lucide-react` (Reemplazo web directo para `@expo/vector-icons`).
- `framer-motion` (Reemplazo web para `Animated` de React Native en Toasts y Modales).
- `tailwindcss` (Para el diseño visual).

---

## 2. Requerimientos de Interfaz Visual (UI)

### A. Sistema de Temas (Claro/Oscuro y Acentos)

El `ThemeContext` mantendrá la misma lógica de NoteHub móvil, guardando sus preferencias en SQLite.

- Utilizará las paletas base (`#121212`, `#ffffff`, `#8B5CF6`).
- El contexto aplicará una clase global `dark` a la etiqueta `<html>` o `<body>` cuando el modo oscuro esté activo.
- Inyectará variables CSS en el `:root` de la aplicación web (ej. `--color-primary`, `--bg-card`) para que Tailwind pueda reaccionar instantáneamente a los cambios de colores de acento.

### B. Componente `NotificacionToast`

Adaptación del componente móvil a web usando CSS transitions o `framer-motion`.

- **Posición:** Flotante en la parte inferior central (`bottom: 40px`).
- **Comportamiento:** Auto-ocultable a los 3000ms.
- **Variantes:** `success` (Verde), `error` (Rojo), `warning` (Naranja), `info` (Azul).

### C. Modales Globales (`ConfirmacionEliminacionModal` y `VisorImagenModal`)

- Al no existir el `<Modal>` de React Native, se implementarán usando **React Portals** (renderizándolos en un `<div id="modal-root">` fuera de la jerarquía principal) o la etiqueta `<dialog>` nativa de HTML5.
- Mantendrán el fondo oscuro semi-transparente (`bg-black/50`) y el cierre al hacer clic fuera del contenedor (overlay).
- Botones de acción y tipografía idénticos a la versión móvil.

### D. Iconografía Estándar

Se reemplazará `MaterialIcons` por la librería `lucide-react` que es el estándar moderno en web, buscando los iconos equivalentes (`CheckCircle`, `X`, `Folder`, `Image`, etc.).

---

## 3. Lógica y Reglas de Negocio (El Puente IPC)

### A. Inicialización de Base de Datos (Backend / Main Process)

Al arrancar la aplicación de Electron, el archivo `/electron/main/database.ts` ejecutará la inicialización de `better-sqlite3`:

1. **Ruta Segura:** Creará/abrirá el archivo `NoteHub.db` en el directorio de usuario del sistema operativo (`app.getPath('userData') + '/SQLite/'`).
2. **Creación de Tablas (Schema Completo):** Ejecutará el esquema SQL estricto (`workspaces`, `notebooks`, `notes`, `templates`, `tags`, `note_tags`, `settings`).
3. **Restricciones:** Ejecutará `PRAGMA foreign_keys = ON;`.
4. **Siembra de Datos:** 
   - Si `workspaces` está vacío, insertará "Mi Espacio" con `is_default=1` y color `#8B5CF6`.
   - Si `settings` no tiene claves, insertará `theme_mode='light'` y las de tipografía base.

### B. Comunicación IPC (El Frontend no toca SQLite directo)

El Frontend React usará funciones puente predefinidas. Ejemplo:

- Móvil: `db.getFirstAsync('SELECT * FROM notes')`
- Desktop: `window.electron.db.query('SELECT * FROM notes')`
  *Nota: El agente de IA configurará el `preload.ts` para exponer estos métodos de forma segura.*

### C. Manejo de Archivos Multimedia (`utils/files`)

Para replicar `copyImageToAppDirectory`:

- El frontend llama a `window.electron.files.copyImage(sourcePath)`.
- El backend de Node.js usa `fs.copyFileSync` para llevar la imagen a `app.getPath('userData') + '/images/'` y devuelve la ruta local relativa para que el `<img src="...">` la pueda renderizar mediante un protocolo de seguridad local.

---

## 4. Estado de Requerimientos (Checklist Técnico)

Para dar por terminado el **E_MOD_01_SHARED_CORE** e iniciar la maquetación, el asistente de IA debe completar:

### Fase 1.1: Infraestructura Electron (Backend)

- [x] Configurar `/electron/main/database.ts` inicializando `better-sqlite3` con el esquema SQL exacto.
- [x] Implementar la siembra (Seed) de "Mi Espacio" y configuraciones por defecto.
- [x] Configurar `/electron/main/preload.ts` exponiendo los canales IPC de base de datos y archivos (`ipcRenderer.invoke`).

### Fase 1.2: Infraestructura React (Frontend)

- [x] Configurar `tailwind.config.js` para modo oscuro (basado en clases) y colores variables.
- [x] Crear el `ThemeContext.tsx` adaptado a web, leyendo preferencias de `settings` vía IPC y aplicando clases dinámicas.
- [x] Crear el `NotificationContext.tsx` y el componente `NotificacionToast` con `framer-motion` o CSS puro.
- [x] Crear componente `ConfirmacionEliminacionModal` basado en React Portals.
- [x] Crear componente `VisorImagenModal` web.
- [x] Implementar envoltorios en `/src/core/ipc/` para consumir la base de datos de manera tipada.

#### **Fase 1.3: Componentes UI**

- [x] Implementar componente `NotificacionToast.tsx`:
  
  - [x] Soportar 4 variantes (success, error, warning, info).
  
  - [x] Auto-ocultamiento a los 3 segundos.
  
  - [x] Posicionamiento absoluto/flotante en la parte inferior.

- [x] Implementar `NotificationContext.tsx` para exponer `showNotification()` globalmente.

- [x] Implementar `AppWrapper.tsx` que envuelva la aplicación en los proveedores globales.

- [x] Implementar componente `VisorImagenModal.tsx` con React Portals.

- [x] Implementar componente `ConfirmacionEliminacionModal.tsx` con React Portals.

- [x] Crear archivo de iconos `Iconos.tsx` centralizando la librería `lucide-react`.

### Criterio de Aceptación Final

El módulo se considera **APROBADO** cuando:

1. La aplicación Electron compila y abre una ventana blanca sin errores de consola.
2. Al revisar la carpeta oculta de la app en la PC, el archivo `NoteHub.db` se generó correctamente.
3. El archivo de DB contiene "Mi Espacio" y los ajustes por defecto.
4. El cambio manual de tema usando el `ThemeContext` altera el CSS del DOM web.
