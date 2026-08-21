console.log(`
\x1b[36m=======================================================
       NOTEHUB-WEB - SCRIPTS DE CONTEXTO Y TAREAS (DGC)
=======================================================\x1b[0m

\x1b[33mComandos de Inspección:\x1b[0m
  npm run tree                -> Muestra el árbol de carpetas del proyecto.
  npm run tree:file           -> Guarda el árbol en ESTRUCTURA_PROYECTO.txt.

\x1b[33mComandos de Consolidación (Inyección de Contexto DGC):\x1b[0m
  npm run export:all          -> Empaqueta TODO el proyecto completo.
  npm run export:schema       -> Empaqueta esquemas SQLite, DDL y persistencia.
  npm run export:db           -> Alias de export:schema.
  npm run export:data         -> Empaqueta presets y datos semilla (src/data).
  npm run export:styles       -> Empaqueta todos los archivos de estilo (CSS/SCSS).
  npm run export:core         -> Empaqueta el núcleo (src/core).
  npm run export:notas        -> Empaqueta el módulo de notas.
  npm run export:editor       -> Empaqueta el módulo del editor.
  npm run export:espacios     -> Empaqueta el módulo de espacios.
  npm run export:papelera     -> Empaqueta papelera y plantillas.
  npm run export:respaldos    -> Empaqueta el módulo de respaldos.
  npm run export:config       -> Empaqueta el módulo de configuración.
  npm run export:electron     -> Empaqueta el proceso principal de Electron.

\x1b[33mComandos de Desarrollo y Compilación:\x1b[0m
  npm run dev                 -> Inicia el servidor de desarrollo Vite.
  npm run build               -> Compila el proyecto con TypeScript y Vite.
  npm run lint                -> Analiza el código con ESLint.
  npm run preview             -> Previsualiza la compilación de producción.

\x1b[32mUso libre:\x1b[0m
  node scripts/export-module.js <ruta_personalizada>
`);
