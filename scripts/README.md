# Scripts de Automatización e Inyección de Contexto DGC (NoteHub Web)

Este directorio contiene las herramientas multiplataforma en Node.js (ES Modules) para gestionar el flujo de trabajo bajo la metodología de Desarrollo Guiado por Contexto (DGC). Permiten exportar rápidamente partes del código para compartirlas con agentes de IA sin saturar la ventana de contexto.

---

## 📦 Requisitos y Dependencias

Los scripts utilizan exclusivamente los módulos nativos del motor de Node.js, por lo que **no requieren librerías externas de terceros** para ejecutarse. Sin embargo, para su correcto funcionamiento dentro del entorno del proyecto se debe verificar:

- **Node.js**: Versión 18.0.0 o superior (con soporte nativo para ES Modules).
- **Configuración en `package.json`**:
  - `"type": "module"` habilitado en la raíz del proyecto para la resolución de sintaxis `import/export`.
  - Los alias de ejecución configurados dentro de la sección `"scripts"`.
- **Módulos Nativos de Node.js Utilizados**:
  - `node:fs` (Lectura y escritura sincrónica en el sistema de archivos).
  - `node:path` (Normalización y resolución de rutas relativas y absolutas multiplataforma).

---

## 📂 Archivos en este Directorio

- **`help.js`**: Despliega en terminal el menú interactivo con la lista completa de comandos disponibles.
- **`list-tree.js`**: Escanea el proyecto ignorando directorios pesados (`node_modules`, `dist`, `dist-electron`, `.git`) y genera el mapa del proyecto.
- **`export-module.js`**: Recorre una carpeta específica y concatena sus archivos de código (`.ts`, `.tsx`, `.js`, `.jsx`, `.css`, `.json`) en un archivo plano `CONSOLIDADO_[ruta].txt`.
- **`export-schema.js`**: Consolida la definición DDL de SQLite (`CREATE TABLE`), inicialización y contratos de persistencia de Electron.
- **`export-styles.js`**: Recorre el proyecto y empaqueta exclusivamente todos los archivos de estilo (`.css`, `.scss`, `.sass`).
- **`export-connected.js`**: Rastreador de dependencias e imports. Empaqueta un archivo o módulo junto con todos los componentes y utilidades vinculadas que necesita para funcionar.

---

## 🚀 Guía Completa de Comandos (`npm run ...`)

```bash
# ==========================================
# 1. INSPECCIÓN DEL PROYECTO
# ==========================================
npm run tree                # Ver estructura de carpetas en terminal
npm run tree:file           # Exportar la estructura a ESTRUCTURA_PROYECTO.txt

# ==========================================
# 2. CONSOLIDACIÓN GLOBAL Y ESPECIALIZADA
# ==========================================
npm run export:all          # Empaqueta TODO el proyecto completo
npm run export:bundle       # Empaqueta un módulo con todas sus dependencias vinculadas
npm run export:schema       # Empaqueta esquemas SQLite (DDL), inicialización y persistencia
npm run export:db           # Alias de export:schema
npm run export:data         # Empaqueta presets y datos semilla (src/data)
npm run export:styles       # Empaqueta todos los archivos de estilos (CSS/SCSS)

# ==========================================
# 3. CONSOLIDACIÓN MODULAR (CONTEXTO DGC)
# ==========================================
npm run export:core         # src/core
npm run export:notas        # src/modules/notas
npm run export:editor       # src/modules/editor
npm run export:espacios     # src/modules/espacios
npm run export:papelera     # src/modules/papelera-plantillas
npm run export:respaldos    # src/modules/respaldos
npm run export:config       # src/modules/configuracion
npm run export:electron     # electron/main

# ==========================================
# 4. EXPORTACIÓN PERSONALIZADA / ARBITRARIA
# ==========================================
node scripts/export-module.js src/components
node scripts/export-connected.js src/modules/espacios
```
