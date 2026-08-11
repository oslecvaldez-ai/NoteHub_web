# Bitácora de Soluciones y Errores

## [Fecha actual] - Error de comunicación entre React y Electron (Preload)

**Síntomas:**
* La interfaz mostraba el error: "La API de Electron no está disponible. Abre la app desde Electron para gestionar espacios."
* Alerta roja: "No se pudo crear el espacio" al intentar guardar un espacio nuevo.
* Alerta roja: "No se pudo guardar el cuaderno".
* La aplicación no creaba el espacio por defecto al iniciar.

**Causa Raíz (Fueron tres problemas superpuestos):**
1. **Fallo en migración de SQLite:** Al agregar columnas dinámicamente con `ALTER TABLE`, SQLite lanzaba el error `Cannot add a column with non-constant default` porque no permite usar expresiones como `DEFAULT (datetime('now'))`. Esto detenía la ejecución antes de sembrar la base de datos.
2. **Error de Tipado en Seed:** El ID de la tabla `workspaces` es un `INTEGER`, pero el script de inicio intentaba insertar el valor de texto `'ws_default'`, rompiendo la creación del espacio principal.
3. **Desconexión del Preload:** Vite compilaba el archivo preload con el nombre `preload.mjs` y, en ocasiones, en rutas distintas. El archivo `main.ts` tenía la ruta escrita de forma rígida (`preload.mjs` en el directorio actual), por lo que Electron no encontraba el archivo, no inyectaba las funciones en la ventana y React no podía comunicarse con la base de datos.

**Solución Aplicada:**
* Se ajustó `database.ts` para agregar las columnas sin `DEFAULT` no constantes en el `ALTER TABLE`.
* Se corrigió el script de siembra (seed) en `database.ts` para evitar la inserción manual del ID, dejando que el `AUTOINCREMENT` hiciera su trabajo al insertar "Mi Espacio".
* Se modificó `main.ts` para que busque dinámicamente el archivo preload usando un array de rutas posibles y `fs.existsSync(p)`, garantizando que encuentre el archivo ya sea que Vite lo llame `.js`, `.mjs` o lo ubique en una subcarpeta.