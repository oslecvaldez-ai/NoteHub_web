import fs from "node:fs";
import path from "node:path";

const EXTENSIONES_ESTILO = new Set([".css", ".scss", ".sass", ".less"]);
const IGNORAR = new Set([
  "node_modules",
  "dist",
  "dist-electron",
  ".git",
  "scripts",
  ".vscode",
  ".idea",
]);

function buscarArchivosEstilo(dir) {
  let resultados = [];
  if (!fs.existsSync(dir)) return resultados;

  const entradas = fs.readdirSync(dir, { withFileTypes: true });

  for (const entrada of entradas) {
    if (IGNORAR.has(entrada.name)) continue;

    const rutaCompleta = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      resultados = resultados.concat(buscarArchivosEstilo(rutaCompleta));
    } else if (
      EXTENSIONES_ESTILO.has(path.extname(entrada.name).toLowerCase())
    ) {
      resultados.push(rutaCompleta);
    }
  }
  return resultados;
}

const rootDir = process.cwd();
const archivos = buscarArchivosEstilo(rootDir);
const outputFile = "CONSOLIDADO_ESTILOS.txt";

let contenido = `========================================================\n`;
contenido += `RESUMEN DE ARCHIVOS DE ESTILO (${archivos.length} archivos encontrados)\n`;
contenido += `========================================================\n`;

for (const archivo of archivos) {
  const rutaRelativa = path.relative(rootDir, archivo).replace(/\\/g, "/");
  contenido += `- ${rutaRelativa}\n`;
}

contenido += `\n\n`;

for (const archivo of archivos) {
  const rutaRelativa = path.relative(rootDir, archivo).replace(/\\/g, "/");
  const codigo = fs.readFileSync(archivo, "utf-8");

  contenido += `========================================\nFILE: ${rutaRelativa}\n========================================\n${codigo}\n\n`;
}

fs.writeFileSync(outputFile, contenido, "utf-8");
console.log(
  "\x1b[32m%s\x1b[0m",
  `¡Listo! Se consolidaron ${archivos.length} archivos de estilo en ${outputFile}`,
);
