import fs from 'node:fs';
import path from 'node:path';

const EXTENSIONES = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.json']);
const IGNORAR = new Set(['node_modules', 'dist', 'dist-electron', '.git']);

function obtenerArchivos(dir) {
  let resultados = [];
  if (!fs.existsSync(dir)) return resultados;

  const entradas = fs.readdirSync(dir, { withFileTypes: true });

  for (const entrada of entradas) {
    if (IGNORAR.has(entrada.name)) continue;

    const rutaCompleta = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      resultados = resultados.concat(obtenerArchivos(rutaCompleta));
    } else if (EXTENSIONES.has(path.extname(entrada.name).toLowerCase())) {
      resultados.push(rutaCompleta);
    }
  }
  return resultados;
}

const args = process.argv.slice(2);
let targetPath = 'src/modules/notas';

const pathIndex = args.indexOf('-Path');
if (pathIndex !== -1 && args[pathIndex + 1]) {
  targetPath = args[pathIndex + 1];
} else if (args[0] && !args[0].startsWith('-')) {
  targetPath = args[0];
}

const resolvedPath = path.resolve(targetPath);

if (!fs.existsSync(resolvedPath)) {
  console.log('\x1b[31m%s\x1b[0m', `La ruta '${targetPath}' no existe.`);
  process.exit(1);
}

const cleanName = targetPath.replace(/[\\/]/g, '_').replace(/^_+|_+$/g, '');
const outputFile = `CONSOLIDADO_${cleanName}.txt`;

console.log('\x1b[36m%s\x1b[0m', `Empaquetando archivos de '${targetPath}' en ${outputFile}...`);

const archivos = obtenerArchivos(resolvedPath);
let contenidoConsolidado = '';
const rootDir = process.cwd();

for (const archivo of archivos) {
  const rutaRelativa = path.relative(rootDir, archivo).replace(/\\/g, '/');
  const contenido = fs.readFileSync(archivo, 'utf-8');
  
  contenidoConsolidado += `========================================\nFILE: ${rutaRelativa}\n========================================\n${contenido}\n\n`;
}

fs.writeFileSync(outputFile, contenidoConsolidado, 'utf-8');
console.log('\x1b[32m%s\x1b[0m', `¡Listo! Archivo generado: ${outputFile}`);