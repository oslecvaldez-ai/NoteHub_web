# 📄 E_MOD_05_PAPELERA_PLANTILLAS.md - NoteHub Desktop

## 1. Frontera de Contexto y Aislamiento

### Archivo de Entrada Único
La gestión de elementos eliminados y plantillas se divide en dos capas de ejecución:
- **Backend (Node.js):** `/electron/main/trash.ts` y `/electron/main/templates.ts` (Controladores para consultas a SQLite).
- **Frontend (React):** `/src/modules/papelera-plantillas/index.ts` (Exportación centralizada de componentes visuales).

### Subcomponentes Permitidos (Frontend)
- **`/src/modules/papelera-plantillas/views/PanelPapelera.tsx`**: Vista de lista para el panel central que muestra las notas con estado `is_deleted = 1`[cite: 56].
- **`/src/modules/papelera-plantillas/views/PanelPlantillas.tsx`**: Vista de lista para el panel central que muestra las plantillas guardadas[cite: 56].
- **`/src/modules/papelera-plantillas/views/EditorPlantilla.tsx`**: Vista que ocupa el panel derecho (área de edición) para redactar o modificar el HTML de una plantilla[cite: 56].
- **`/src/modules/papelera-plantillas/views/VistaPreviaPlantilla.tsx`**: Vista de solo lectura en el panel derecho para visualizar el contenido de una plantilla antes de usarla[cite: 56].
- **`/src/modules/papelera-plantillas/components/ItemPapelera.tsx`**: Componente de fila para cada nota eliminada[cite: 56].
- **`/src/modules/papelera-plantillas/components/ItemPlantilla.tsx`**: Componente de fila para cada plantilla[cite: 56].

### Dependencias
- **E_MOD_01 (SHARED_CORE):** Uso de notificaciones, modales de confirmación de eliminación y comunicación IPC.
- **E_MOD_03 (Cuadernos y Notas):** Consumo del estado global del espacio activo (`workspace_id`).
- **E_MOD_04 (Editor):** El componente de edición de plantillas instancia la misma librería de texto enriquecido (Tiptap/Lexical) utilizada para las notas[cite: 56].

---

## 2. Requerimientos de Interfaz Visual (UI)

### A. Vista `PanelPapelera` (Panel Central)
- Se renderiza en la columna central cuando el usuario selecciona "Papelera" en el Sidebar.
- **Cabecera:** Título "Papelera" y un botón rojo "Vaciar Papelera" alineado a la derecha. Este botón estará deshabilitado si la lista no contiene elementos[cite: 56].
- **Listado (`ItemPapelera`):**
  - Muestra título, extracto de texto, fecha de eliminación y nombre del cuaderno original[cite: 56].
  - Borde izquierdo de color rojo (`#EF4444`) para identificar visualmente su estado[cite: 56].
  - **Clic derecho (Menú Contextual):** Despliega las opciones "Restaurar" y "Eliminar permanentemente"[cite: 56].

### B. Vista `PanelPlantillas` (Panel Central)
- Se renderiza en la columna central cuando el usuario selecciona "Plantillas" en el Sidebar.
- **Cabecera:** Título "Plantillas" y un botón primario "+ Nueva Plantilla"[cite: 56].
- **Listado (`ItemPlantilla`):**
  - Muestra título, ícono representativo y fecha de creación[cite: 56].
  - **Clic izquierdo:** Abre la `VistaPreviaPlantilla` en el panel derecho[cite: 56].
  - **Clic derecho (Menú Contextual):** Despliega las opciones "Editar" y "Eliminar"[cite: 56].

### C. Vista `EditorPlantilla` (Panel Derecho)
- Reemplaza el editor de notas estándar temporalmente.
- **Cabecera:** Campo de texto (Input) grande para establecer o editar el nombre de la plantilla. Botones "Guardar" y "Cancelar" a la derecha[cite: 56].
- **Área de Trabajo:** Componente de texto enriquecido idéntico al de las notas regulares, sin la opción de asignar cuadernos ni etiquetas[cite: 56].

### D. Vista `VistaPreviaPlantilla` (Panel Derecho)
- Muestra el HTML renderizado de la plantilla seleccionada en modo de solo lectura[cite: 56].
- **Cabecera:** Muestra el nombre de la plantilla y un botón primario "Usar plantilla"[cite: 56].
- Al hacer clic en "Usar plantilla", se genera un nuevo registro en la tabla `notes` con este contenido y la aplicación cambia el enfoque al editor principal[cite: 56].

---

## 3. Lógica y Reglas de Negocio (IPC Bridge)

### A. Papelera (Backend Node.js)
El frontend invocará los siguientes métodos a través de IPC:
- `window.electron.trash.getAll(workspaceId)`: Ejecuta la consulta SQL con la condición `is_deleted = 1`[cite: 56].
- `window.electron.trash.restore(noteId)`: Ejecuta el UPDATE seteando `is_deleted = 0` y renovando `updated_at`[cite: 56].
- `window.electron.trash.deletePermanent(noteId)`: Ejecuta el comando DELETE en la base de datos[cite: 56].
- `window.electron.trash.empty(workspaceId)`: Ejecuta el comando DELETE para todos los registros del espacio activo con `is_deleted = 1`[cite: 56].

### B. Plantillas (Backend Node.js)
El frontend invocará los siguientes métodos a través de IPC:
- `window.electron.templates.getAll(workspaceId)`: Obtiene los registros ordenados por fecha[cite: 56].
- `window.electron.templates.create(name, content, workspaceId)`: Inserta un nuevo registro en la tabla `templates`[cite: 56].
- `window.electron.templates.update(id, name, content)`: Actualiza la información[cite: 56].
- `window.electron.templates.delete(id)`: Ejecuta el comando DELETE para una plantilla específica[cite: 56].
- `window.electron.templates.createNoteFromTemplate(templateId, workspaceId, notebookId)`: Obtiene el contenido de la plantilla y realiza un INSERT en la tabla `notes`, retornando el nuevo ID[cite: 56].

### C. Restricciones y Confirmaciones
- Todas las eliminaciones definitivas en la papelera y el borrado de plantillas deben invocar obligatoriamente el `ConfirmacionEliminacionModal` antes de enviar la instrucción IPC al backend[cite: 56].
- La creación y actualización de plantillas requiere que el campo del nombre contenga al menos un carácter válido[cite: 56].

---

## 4. Estado de Requerimientos (Checklist Técnico)

Para dar por completado el **E_MOD_05_PAPELERA_PLANTILLAS**, se deben cumplir las siguientes tareas:

### Fase 5.1: Controladores Backend (Node.js)
- [ ] Implementar la manipulación de base de datos en `/electron/main/trash.ts`.
- [ ] Implementar la manipulación de base de datos en `/electron/main/templates.ts`.
- [ ] Exponer los métodos descritos en el archivo de `preload.ts`.

### Fase 5.2: Vistas de Papelera
- [ ] Implementar `PanelPapelera` y `ItemPapelera`.
- [ ] Conectar el menú contextual de clic derecho para ejecutar las opciones de restaurar y eliminar permanentemente.
- [ ] Conectar el botón de vaciar papelera con su respectivo modal de confirmación.

### Fase 5.3: Vistas de Plantillas
- [ ] Implementar `PanelPlantillas` y `ItemPlantilla`.
- [ ] Implementar `VistaPreviaPlantilla` con renderizado de HTML estático y el botón de uso.
- [ ] Implementar `EditorPlantilla` reutilizando el componente base del editor enriquecido.

### Fase 5.4: Integración y Retroalimentación
- [ ] Asegurar que todas las operaciones exitosas notifiquen al usuario y recarguen el listado correspondiente en pantalla.
- [ ] Garantizar que al restaurar una nota, el conteo en el panel lateral se actualice de forma síncrona.

### Criterio de Aceptación Final
El módulo se considera **APROBADO** cuando:
1. Las notas eliminadas desde el listado general aparecen inmediatamente en la papelera.
2. Es posible recuperar una nota y verificar que regrese a su cuaderno de origen.
3. Se puede crear una nueva plantilla, asignarle contenido, visualizar su renderizado previo y generar una nota nueva a partir de ella sin errores de formato.
