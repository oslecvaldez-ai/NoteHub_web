# 📄 E_MOD_06_RESPALDO_RESTAURACION.md - NoteHub Desktop

## 1. Frontera de Contexto y Aislamiento

### Archivo de Entrada Único
En Electron, las operaciones de sistema de archivos se ejecutan en el proceso principal, separando la interfaz de la lógica pesada:
- **Backend (Node.js):** `/electron/main/backup.ts` (Lógica de compresión, descompresión y cuadros de diálogo del sistema operativo).
- **Frontend (React):** `/src/modules/respaldos/index.ts` (Barrel export que centraliza las vistas).

### Subcomponentes Permitidos (Frontend)
- **`/src/modules/respaldos/views/PanelRespaldos.tsx`**: Vista dedicada para gestionar la exportación e importación de datos.
- **`/src/modules/respaldos/components/SuccessModal.tsx`**: Modal para notificar el éxito de la restauración y requerir el reinicio de la aplicación.

### Dependencias
- **E_MOD_01 (SHARED_CORE):**
  - Uso de `NotificacionToast` para feedback de éxito o error.
  - Uso de `ConfirmacionEliminacionModal` antes de ejecutar una restauración.
  - Comunicación IPC para consultar la tabla `settings`.
- **Librerías Externas Aprobadas (Node.js):**
  - `adm-zip` o `archiver`/`extract-zip` para empaquetar y desempaquetar archivos.
  - Módulo nativo `fs` (File System) y `path`.
  - Módulo `dialog` de Electron para seleccionar ubicaciones de archivos.

---

## 2. Requerimientos de Interfaz Visual (UI)

### A. Vista `PanelRespaldos`
- Se renderiza en el área central/derecha de la aplicación al seleccionarse desde el menú o la configuración.
- **Cabecera:** Título "Respaldos".

### B. Sección "Estado Actual"
- Tarjeta visual que consulta la base de datos local para mostrar la clave `last_backup_date`.
- Muestra la fecha y hora formateada. Si es nula, muestra "Nunca".
- Texto descriptivo indicando la naturaleza local de los datos.

### C. Sección "Exportar Datos"
- Tarjeta visual con un ícono representativo.
- **Botón "Crear Respaldo Ahora":**
  - Al hacer clic, el botón se deshabilita y muestra un texto de "Empaquetando...".
  - Invoca la función IPC para generar el `.zip`.
  - Una vez finalizado, reactiva el botón y actualiza la fecha del "Estado Actual".

### D. Sección "Restaurar Datos"
- Tarjeta visual con un ícono representativo.
- **Botón "Seleccionar archivo de respaldo":**
  - Al hacer clic, invoca el diálogo de selección de archivos del sistema operativo (filtrado exclusivamente para extensiones `.zip`).
  - Si el usuario selecciona un archivo válido, se muestra inmediatamente el `ConfirmacionEliminacionModal`.

---

## 3. Lógica y Reglas de Negocio (IPC Bridge)

### A. Creación del Respaldo (`window.electron.backup.create`)
La función en el backend de Node.js ejecutará los siguientes pasos secuenciales:
1. Abrir una ventana `dialog.showSaveDialog` sugiriendo el nombre `NoteHub_Respaldo_YYYYMMDD_HHMMSS.zip`.
2. Si el usuario acepta, crear una carpeta temporal en el directorio de la aplicación.
3. Copiar el archivo `NoteHub.db` actual y la carpeta local `images` dentro de esta carpeta temporal.
4. Comprimir el contenido de la carpeta temporal en la ruta de destino seleccionada por el usuario.
5. Actualizar el registro `last_backup_date` en la tabla `settings`.
6. Eliminar la carpeta temporal.
7. Retornar una respuesta exitosa al frontend.

### B. Restauración del Respaldo (`window.electron.backup.restore`)
La función en el backend de Node.js ejecutará los siguientes pasos secuenciales, garantizando la integridad de los datos en caso de fallo:
1. Recibir la ruta del archivo `.zip` seleccionado mediante `dialog.showOpenDialog`.
2. Crear una carpeta temporal de restauración y descomprimir el archivo `.zip` allí.
3. **Validación estricta:** Verificar que el archivo `NoteHub.db` exista dentro de los archivos descomprimidos. Si falta, detener el proceso, limpiar la carpeta temporal y retornar un error de "Archivo inválido".
4. Cerrar la conexión actual de `better-sqlite3` de forma segura.
5. Sobrescribir el archivo de base de datos actual con el archivo `.db` extraído.
6. Sobrescribir la carpeta `images` local con las imágenes extraídas del respaldo (eliminando previamente el contenido anterior para no dejar archivos huérfanos).
7. Reabrir la conexión de la base de datos.
8. Eliminar la carpeta temporal de restauración.
9. Notificar éxito al frontend.

### C. Reinicio Obligatorio
Tras una restauración exitosa, el frontend desplegará el `SuccessModal`. Al hacer clic en "Entendido", la aplicación recargará por completo la ventana de Electron (`window.location.reload()` o método equivalente en Electron) para forzar la lectura fresca de todos los datos.

---

## 4. Estado de Requerimientos (Checklist Técnico)

Para dar por completado el **E_MOD_06_RESPALDO_RESTAURACION**, se deben cumplir las siguientes tareas:

### Fase 6.1: Controladores Backend (Node.js)
- [ ] Implementar la función de exportación en `/electron/main/backup.ts` usando empaquetado seguro.
- [ ] Implementar la función de importación en `/electron/main/backup.ts` con manejo de carpetas temporales y cierre de base de datos.
- [ ] Exponer los métodos mediante `ipcRenderer.invoke` en el archivo `preload.ts`.

### Fase 6.2: Interfaz de Usuario
- [ ] Maquetar `PanelRespaldos` utilizando clases de Tailwind CSS coherentes con la identidad visual.
- [ ] Conectar la lectura de la fecha del último respaldo desde la tabla `settings`.

### Fase 6.3: Integración y Flujo de Trabajo
- [ ] Enlazar el botón de exportación al canal IPC correspondiente y manejar sus estados de carga.
- [ ] Enlazar el botón de importación, condicionando la ejecución al `ConfirmacionEliminacionModal`.
- [ ] Implementar el modal de éxito que obligue a la recarga de la interfaz.

### Criterio de Aceptación Final
El módulo se considera **APROBADO** cuando:
1. El usuario puede generar un archivo `.zip` utilizando el explorador de archivos nativo del sistema operativo.
2. El archivo `.zip` resultante puede ser abierto y contiene la base de datos y la carpeta de imágenes sin corrupciones.
3. Al restaurar un `.zip` previamente validado, los datos antiguos de la aplicación son reemplazados en su totalidad, las imágenes cargan correctamente en el visor, y la interfaz se recarga automáticamente tras la confirmación.
