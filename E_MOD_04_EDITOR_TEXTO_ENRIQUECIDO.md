# 📄 E_MOD_04_EDITOR_TEXTO_ENRIQUECIDO.md - NoteHub Desktop

## 1. Frontera de Contexto y Aislamiento

### Archivo de Entrada Único
En Electron, el editor se desprende del modelo de "Pantalla" para convertirse en el **Panel Principal** de trabajo, comunicado estrechamente con Node.js para auto-guardado y manipulación de archivos.
- **Backend (Node.js):** `/electron/main/editor.ts` y `/electron/main/export.ts` (Lógica nativa de guardado y diálogos del sistema).
- **Frontend (React):** `/src/modules/editor/index.ts` (Barrel export).

### Subcomponentes Permitidos (Frontend)
- **`/src/modules/editor/components/PanelEditor.tsx`**: Contenedor principal que ocupa la zona derecha/central de la app (Adaptación de `EditorScreen`[cite: 48]).
- **`/src/modules/editor/components/EditorHeader.tsx`**: Cabecera superior con el título de la nota, estado de guardado, y botones de acción (Etiquetas, Exportar, Opciones)[cite: 48, 49].
- **`/src/modules/editor/components/EditorToolbar.tsx`**: Barra de herramientas estática o flotante con las herramientas de formato.
- **`/src/modules/editor/components/TiptapEditor.tsx`**: El motor puro. Reemplaza a `RichTextEditor`[cite: 41]. Se configurará para escupir HTML idéntico al móvil.
- **`/src/modules/editor/components/BuscadorInterno.tsx`**: Barra superior que aparece al presionar `Ctrl + F` para buscar texto dentro de la nota[cite: 48].
- **`/src/modules/editor/modals/TagsModal.tsx`**, **`PlantillasMenu.tsx`**, **`OpcionesEditorModal.tsx`**: Adaptaciones a React Portals de los menús móviles.

### Dependencias
- **E_MOD_01 (SHARED_CORE):** Para Notificaciones, Modal de Confirmación, y la conexión IPC.
- **E_MOD_03 (Cuadernos y Notas):** El editor recibe el `note_id` seleccionado desde el panel central de listas.
- **Librería Externa Clave:** `@tiptap/react` y `@tiptap/starter-kit` (Reemplazo directo del Pell Editor).

---

## 2. Requerimientos de Interfaz Visual (UI)

### A. Componente `PanelEditor`
- **Layout:** Flex column que ocupa el 100% de su contenedor.
- **Modo Foco (Focus Mode):** Al activarse (`F11` o botón dedicado), oculta el Sidebar izquierdo y el panel central de listas, dejando únicamente el editor centrado en pantalla completa[cite: 48, 49].

### B. Componente `EditorHeader` y `EditorToolbar`
- **Header:** 
  - Muestra el ícono de "Acceso Rápido" (Estrella) a la izquierda del título[cite: 48, 49].
  - A la derecha: Botón "Etiquetas" (Tags), Botón "Exportar" (Abre menú de formatos) y Menú de Tres Puntos (Duplicar, Mover, Copiar a Plantillas, Eliminar)[cite: 48].
- **Toolbar:**
  - Fija debajo del Header.
  - Opciones de texto (Negrita, Cursiva, Subrayado, Tachado), Alineación, Listas, Títulos (H1-H6).
  - Paletas de Color de Texto y Fondo (Resaltado) idénticas a las del móvil[cite: 42].
  - Botones especiales: "Destacar Texto", "Íconos/Emojis", Insertar Imagen, Tabla, Fecha, Bloque Colapsable y Callouts[cite: 42, 49].

### C. Componente `TiptapEditor` (El Área de Texto)
- Renderiza el HTML conservando las clases personalizadas como `.kh-collapsible`, `.editor-callout` y `.search-highlight`[cite: 41, 48].
- Soporte para **Atajos de Teclado Nativos:** `Ctrl+B`, `Ctrl+I`, `Ctrl+Z`, `Ctrl+S` (Guardar explícito).
- **Imágenes Drag & Drop:** Soporte para arrastrar una imagen desde el escritorio directamente al editor, delegando su guardado a IPC[cite: 42].

### D. Buscador Interno (`Ctrl + F`)
- Se posiciona sobre el área del editor.
- Input de texto, contador de coincidencias ("1 de 5") y flechas para saltar entre resultados.
- La lógica nativa de Tiptap/JavaScript se encargará de inyectar los `<mark class="search-highlight">`[cite: 48].

---

## 3. Lógica y Reglas de Negocio (IPC Bridge)

### A. Guardado (Auto-Save vs Manual)
- Se implementará un **Debounce Auto-Save:** Guardará silenciosamente la nota cada 2 segundos después de que el usuario deje de escribir para evitar pérdida de datos en escritorio.
- El título se extraerá automáticamente del primer tag `<h1>` o de los primeros caracteres del texto[cite: 48, 49].

### B. Gestión de Imágenes
- Al intentar insertar una imagen (por botón o drag & drop), el frontend llamará a `window.electron.files.saveImage(pathOrBlob)`. Node.js la copiará a la carpeta local segura y devolverá la URL local para inyectar el tag `<img>` en el editor[cite: 48, 49].

### C. Exportación (Node.js)
El servicio de exportación en Node.js manejará:
- `export.toHTML`, `export.toMD`, `export.toTXT`: Escriben el archivo directamente usando `fs.writeFile` tras pedir la ruta con `dialog.showSaveDialog`[cite: 49].
- `export.toPDF`: Utilizará `webContents.printToPDF()` nativo de Electron para generar un PDF fiel.
- `export.toNoteHub`: Genera el `.zip` o `.json` con el contenido y dependencias, empaquetado en Node[cite: 49].

### D. Interacción con Etiquetas y Plantillas
- **Comando `/`:** El editor Tiptap detectará el slash inicial y levantará el portal `PlantillasMenu` sobre el cursor[cite: 48, 49].
- **Etiquetas (Tags):** Modal para asignar tags (`TagsModal`). Al guardar, se llama a IPC para actualizar la tabla relacional `note_tags`[cite: 48].

---

## 4. Estado de Requerimientos (Checklist Técnico)

Para completar el **E_MOD_04_EDITOR_TEXTO_ENRIQUECIDO**, se debe:

### Fase 4.1: Controladores Backend (Node.js)
- [ ] Configurar IPC para el CRUD y Auto-Guardado de la nota actual.
- [ ] Implementar `dialog.showSaveDialog` y `dialog.showOpenDialog` en `/electron/main/export.ts` para las funciones de exportación e importación[cite: 49].
- [ ] Implementar la captura y copia de imágenes hacia la carpeta local mediante IPC[cite: 48].

### Fase 4.2: Tiptap Editor Base
- [ ] Instalar `@tiptap/react` y configurar las extensiones necesarias para igualar el CSS de NoteHub móvil (Heading, Color, Highlight, TaskList, Image, Custom Callout).
- [ ] Ajustar la tipografía leyendo los valores globales (`font_size`, `line_spacing`)[cite: 49].

### Fase 4.3: Interfaz de Usuario y Menús
- [ ] Maquetar el `EditorHeader` y `EditorToolbar` con los iconos y dropdowns[cite: 48, 49].
- [ ] Implementar el menú de transformación de texto ("MAYÚSCULAS", "Destacar Texto")[cite: 42].
- [ ] Implementar modales en React Portal para Etiquetas, Plantillas y Opciones[cite: 48].

### Fase 4.4: Productividad de Escritorio
- [ ] Implementar el Buscador Interno (`Ctrl + F`) con resaltado de texto en tiempo real[cite: 48].
- [ ] Configurar el Focus Mode (ocultando barras laterales al presionar botón o `F11`)[cite: 48, 49].
- [ ] Configurar atajos de teclado estándar.

### Criterio de Aceptación Final
El módulo se considera **APROBADO** cuando:
1. Una nota formateada en el emulador de Android se visualiza y edita de forma idéntica en Electron (y viceversa).
2. Tiptap genera código HTML limpio y estructurado igual que la versión móvil.
3. Se pueden arrastrar/insertar imágenes de la PC y se guardan correctamente en la carpeta compartida local.
4. La exportación a NoteHub y PDF se procesa a través de los diálogos nativos del Sistema Operativo de escritorio.
