import fs from "node:fs";
import path from "node:path";

const EXTENSIONES = [".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".sql"];
const IGNORAR_CARPETAS = [
  "node_modules",
  "dist",
  "dist-electron",
  ".git",
  "scripts",
  ".vscode",
  ".idea",
];

function resolverRutaImport(rutaOrigen, specifier, rootDir) {
  if (
    !specifier.startsWith(".") &&
    !specifier.startsWith("@/") &&
    !specifier.startsWith("src/")
  ) {
    return null; // Paquetes externos de node_modules
  }

  let basePath = specifier;
  if (specifier.startsWith(".")) {
    basePath = path.resolve(path.dirname(rutaOrigen), specifier);
  } else if (specifier.startsWith("@/")) {
    basePath = path.resolve(rootDir, specifier.replace("@/", "src/"));
  } else if (specifier.startsWith("src/")) {
    basePath = path.resolve(rootDir, specifier);
  }

  if (fs.existsSync(basePath) && fs.statSync(basePath).isFile()) {
    return basePath;
  }

  for (const ext of EXTENSIONES) {
    if (fs.existsSync(basePath + ext)) {
      return basePath + ext;
    }
  }

  for (const ext of EXTENSIONES) {
    const indexPath = path.join(basePath, "index" + ext);
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }

  return null;
}

function extraerImports(contenidoArchivo) {
  const imports = [];
  const regex = /(?:import|export)\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(contenidoArchivo)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

function rastrearDependencias(rutaInicial, rootDir) {
  const visitados = new Set();
  const cola = [path.resolve(rutaInicial)];

  while (cola.length > 0) {
    const actual = cola.shift();

    if (visitados.has(actual)) continue;
    if (!fs.existsSync(actual)) continue;

    visitados.add(actual);

    if (fs.statSync(actual).isDirectory()) {
      const entradas = fs.readdirSync(actual, { withFileTypes: true });
      for (const ent of entradas) {
        if (IGNORAR_CARPETAS.includes(ent.name)) continue;
        cola.push(path.join(actual, ent.name));
      }
      continue;
    }

    const ext = path.extname(actual).toLowerCase();
    if (!EXTENSIONES.includes(ext)) continue;

    const contenido = fs.readFileSync(actual, "utf-8");
    const imports = extraerImports(contenido);

    for (const imp of imports) {
      const rutaResuelta = resolverRutaImport(actual, imp, rootDir);
      if (rutaResuelta && !visitados.has(rutaResuelta)) {
        cola.push(rutaResuelta);
      }
    }
  }

  return Array.from(visitados).filter(
    (p) => fs.existsSync(p) && fs.statSync(p).isFile(),
  );
}

const args = process.argv.slice(2);
const target = args[0] || "src/modules/editor";
const rootDir = process.cwd();
const resolvedTarget = path.resolve(target);

if (!fs.existsSync(resolvedTarget)) {
  console.log("\x1b[31m%s\x1b[0m", `La ruta '${target}' no existe.`);
  process.exit(1);
}

const cleanName = target.replace(/[\\/]/g, "_").replace(/^_+|_+$/g, "");
const outputFile = `CONSOLIDADO_CONECTADO_${cleanName}.txt`;

console.log(
  "\x1b[36m%s\x1b[0m",
  `Rastreando dependencias y conexiones de '${target}'...`,
);

const archivos = rastrearDependencias(resolvedTarget, rootDir);
let contenidoConsolidado = `========================================================\n`;
contenidoConsolidado += `CONSOLIDADO CONECTADO: ${target}\n`;
contenidoConsolidado += `TOTAL ARCHIVOS VINCULADOS: ${archivos.length}\n`;
contenidoConsolidado += `========================================================\n\n`;

for (const archivo of archivos) {
  const rutaRelativa = path.relative(rootDir, archivo).replace(/\\/g, "/");
  const contenido = fs.readFileSync(archivo, "utf-8");
  contenidoConsolidado += `========================================\nFILE: ${rutaRelativa}\n========================================\n${contenido}\n\n`;
}

fs.writeFileSync(outputFile, contenidoConsolidado, "utf-8");
console.log(
  "\x1b[32m%s\x1b[0m",
  `¡Listo! Se empaquetaron ${archivos.length} archivos vinculados en ${outputFile}`,
);
