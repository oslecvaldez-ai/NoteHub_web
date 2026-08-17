import fs from 'node:fs';
import path from 'node:path';

const CARPETAS_IGNORAR = new Set([
  'node_modules',
  'dist',
  'dist-electron',
  '.git',
  '.vscode',
  '.idea'
]);

function generarArbol(dir, profundidad = 0, rutaBase = dir) {
  if (profundidad > 4) return [];

  let lineas = [];
  const entradas = fs.readdirSync(dir, { withFileTypes: true });

  for (const entrada of entradas) {
    if (CARPETAS_IGNORAR.has(entrada.name)) continue;

    const rutaCompleta = path.join(dir, entrada.name);
    const rutaRelativa = path.relative(rutaBase, rutaCompleta).replace(/\\/g, '/');
    lineas.push(rutaRelativa);

    if (entrada.isDirectory()) {
      lineas = lineas.concat(generarArbol(rutaCompleta, profundidad + 1, rutaBase));
    }
  }

  return lineas;
}

const toFile = process.argv.includes('--to-file') || process.argv.includes('-f');
const items = generarArbol(process.cwd());

if (toFile) {
  fs.writeFileSync('ESTRUCTURA_PROYECTO.txt', items.join('\n'), 'utf-8');
  console.log('\x1b[32m%s\x1b[0m', 'Estructura guardada en ESTRUCTURA_PROYECTO.txt');
} else {
  console.log(items.join('\n'));
}