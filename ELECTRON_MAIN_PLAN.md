# 📄 ELECTRON_MAIN_PLAN.md - NoteHub Desktop

## 1. Objetivo y Alcance
**NoteHub Desktop** es la versión para computadora (Windows, Linux, macOS) de la aplicación de toma de notas. Opera de forma 100% local (Offline-First) y está diseñada para mantener una **compatibilidad absoluta e inquebrantable** con la versión móvil. 
El objetivo es permitir al usuario redactar y organizar sus bosquejos con la comodidad de un teclado, ratón y pantalla grande, compartiendo la misma base de datos SQLite y el mismo formato de exportación `.zip` que la versión de tablet/celular.

## 2. Stack Tecnológico
*   **Entorno de Escritorio:** Electron.
*   **Frontend:** React con Vite.
*   **Lenguaje:** TypeScript.
*   **Base de Datos Local:** `better-sqlite3` (vía Node.js en el proceso principal de Electron).
*   **Almacenamiento Multimedia y Respaldos:** Módulo `fs` (File System nativo de Node.js) y librerías de compresión compatibles.
*   **Estilos:** Tailwind CSS.
*   **Motor de Editor:** Tiptap o Lexical (Configurado para producir y leer exactamente el mismo HTML/JSON que la versión móvil).
*   **Comunicación:** IPC (Inter-Process Communication) estricto entre el hilo principal (Node) y la vista (React).

## 3. Identidad Visual y Estilos (Paridad con Móvil)
*   **Modo Claro:** Fondo `#FFFFFF`, Tarjetas `#F4F5F7`, Texto primario `#1C1C1E`, Texto secundario `#8E8E93`, Acento `#0077D6`.
*   **Modo Oscuro:** Fondo `#121212`, Tarjetas `#1E1E1E`, Texto primario `#FFFFFF`, Texto secundario `#B0B3B8`, Acento `#0077D6`.
*   **Regla de Herencia:** Prohibido usar colores fijos hardcodeados en los componentes.

## 4. Arquitectura de Navegación (Escritorio)
A diferencia del móvil, la interfaz aprovechará el ancho de la pantalla usando una distribución de **paneles redimensionables**.

### A. Panel Lateral Izquierdo (Sidebar Fijo)
1. Selector superior de Espacios de Trabajo.
2. Navegación principal: Acceso Rápido, Todas las Notas, Papelera, Plantillas, Ajustes y Respaldos.
3. Árbol jerárquico de Cuadernos (anidables y desplegables).

### B. Panel Central (Lista de Notas)
*   Muestra el listado de las notas correspondientes a la selección del panel izquierdo (Espacio activo o Cuaderno específico).
*   Barra de búsqueda integrada en la parte superior.

### C. Panel Derecho (Área de Edición - Editor)
*   Área principal de trabajo. Cuando se selecciona una nota, se abre aquí.
*   Barra de herramientas (Toolbar) anclada en la parte superior con atajos de teclado nativos (`Ctrl+B`, `Ctrl+Z`, etc.).

## 5. Diseño y Arquitectura de Datos (Estricta Paridad SQLite)
Esta estructura debe ser idéntica a la móvil para que el archivo `.db` sea intercambiable.

*   **`workspaces`**: `id` (PK), `name`, `is_default`, `color_hex`, `is_locked`, `password_hash`, `created_at`.
*   **`notebooks`**: `id` (PK), `workspace_id` (FK), `parent_notebook_id` (FK), `name`, `icon_type`, `icon_color`, `note_count`, `created_at`.
*   **`notes`**: `id` (PK), `workspace_id` (FK), `notebook_id` (FK), `title`, `content` (HTML/JSON), `is_pinned`, `is_deleted`, `pinned_at`, `created_at`, `updated_at`.
*   **`templates`**: `id` (PK), `workspace_id` (FK), `name`, `content`, `created_at`.
*   **`settings`**: `key` (PK), `value` (Almacena `theme_mode`, tipografía, etc.).

## 6. Reglas de Negocio Globales
*   **Idioma:** Estrictamente español.
*   **Persistencia:** Guardado inmediato en SQLite.
*   **Compatibilidad HTML:** El editor de Electron no debe inyectar clases CSS propietarias que rompan la visualización en la app móvil. Las etiquetas `<p>`, `<h1>`, `<b>`, `<i>`, etc., deben ser puras.
*   **Imágenes:** Se guardan en una carpeta local de la computadora (ej. `Documents/NoteHub/images`). El respaldo debe empaquetar la base de datos `.db` y esta carpeta `images`.
*   **Borrado Seguro:** Confirmación obligatoria antes de eliminar cuadernos, notas o vaciar la papelera.

## 7. Estructura del Sistema (Módulos de Escritorio)

*   **E_MOD_01: SHARED_CORE (Infraestructura de Electron)**
    *   Configuración IPC, conexión a `better-sqlite3`, utilidades de Node `fs`, manejador de tema y componentes UI compartidos (Modales, Toasts).
*   **E_MOD_02: Gestión de Espacios de Trabajo**
    *   CRUD de espacios, selector superior del Sidebar.
*   **E_MOD_03: Estructura de Cuadernos y Notas**
    *   Árbol lateral de cuadernos, panel central de listado, búsqueda y filtros.
*   **E_MOD_04: Editor de Texto Enriquecido (Escritorio)**
    *   Motor web del editor, atajos de teclado nativos, exportación a PDF, soporte para plantillas (comando `/`).
*   **E_MOD_05: Papelera y Plantillas**
    *   Vistas dedicadas en el panel central para administrar elementos eliminados y editar plantillas base.
*   **E_MOD_06: Respaldo y Restauración (El Puente)**
    *   Lógica en Node.js para empaquetar `.db` e imágenes en `.zip` y extraer respaldos móviles hacia el escritorio.
*   **E_MOD_07: Configuración**
    *   Pantalla de ajustes (Tipografía global, Temas, Acerca de).
