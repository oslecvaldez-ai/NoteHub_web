# Scripts de Automatización e Inyección de Contexto DGC (Node.js)

Este directorio contiene las herramientas multiplataforma para gestionar el flujo de trabajo bajo la metodología de Desarrollo Guiado por Contexto (DGC). Permiten exportar rápidamente partes del código para compartirlas con agentes de IA sin saturar el contexto.

---

## 📂 Archivos en este Directorio

* **`help.js`**: Despliega en terminal la lista de comandos disponibles clasificados por función.
* **`list-tree.js`**: Escanea el proyecto ignorando directorios pesados (`node_modules`, `dist`, `dist-electron`, `.git`) y genera el mapa del proyecto.
* **`export-module.js`**: Recorre una carpeta específica y concatena sus archivos de código (`.ts`, `.tsx`, `.js`, `.jsx`, `.css`, `.json`) en un archivo plano `CONSOLIDADO_[ruta].txt`.

---

## 🚀 Guía de Comandos (`npm run ...`)

### Inspección del Proyecto
```bash
# Ver estructura de carpetas en terminal
npm run tree

# Exportar la estructura a ESTRUCTURA_PROYECTO.txt
npm run tree:file
```

### Consolidación de Módulos (Contexto para IA)
```bash
npm run export:core         # src/core
npm run export:notas        # src/modules/notas
npm run export:editor       # src/modules/editor
npm run export:espacios     # src/modules/espacios
npm run export:papelera     # src/modules/papelera-plantillas
npm run export:respaldos    # src/modules/respaldos
npm run export:config       # src/modules/configuracion
npm run export:electron     # electron/main
```

### Exportación de Rutas Arbitrarias
Puedes exportar cualquier subcarpeta pasando la ruta como parámetro:
```bash
node scripts/export-module.js src/components
```

---

## 📋 Flujo de Trabajo con la IA
1. Ejecuta el comando correspondiente al módulo que vas a modificar (ej: `npm run export:notas`).
2. Sube el archivo generado `CONSOLIDADO_src_modules_notas.txt` al chat de la IA.
3. Especifica la tarea para que el modelo trabaje sobre código exacto y actualizado.