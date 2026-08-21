import type { PresetEspacio } from "../presetsEspacios";

// ============================================================================
// CUADERNO 1: FUNDAMENTOS Y ALGORITMOS
// ============================================================================
const cuadernoFundamentos = {
  name: "Fundamentos y Algoritmos",
  cover: "Cpu",
  color: "#3b82f6",
  notes: [
    {
      title: "Lección 1: Complejidad Algorítmica y Notación Big-O",
      content: `<h2>Lección 1: Complejidad Algorítmica y Notación Big-O</h2><p>El análisis de algoritmos permite evaluar la eficiencia temporal y espacial de un software antes de su implementación...</p>`,
    },
    {
      title: "Lección 2: Estructuras de Datos Lineales y No Lineales",
      content: `<h2>Lección 2: Estructuras de Datos Lineales y No Lineales</h2><p>La selección adecuada de la estructura de datos optimiza el uso de CPU y memoria en sistemas informáticos...</p>`,
    },
    {
      title: "Lección 3: Algoritmos de Búsqueda y Ordenamiento",
      content: `<h2>Lección 3: Algoritmos de Búsqueda y Ordenamiento</h2><p>La búsqueda binaria y algoritmos eficientes como QuickSort y MergeSort son pilares del rendimiento computacional...</p>`,
    },
    {
      title: "Lección 4: Principios SOLID y Clean Code",
      content: `<h2>Lección 4: Principios SOLID y Clean Code</h2><p>Los cinco principios SOLID junto con la regla DRY garantizan arquitecturas mantenibles y desacopladas...</p>`,
    },
    {
      title: "Lección 5: Patrones de Diseño Clave",
      content: `<h2>Lección 5: Patrones de Diseño Clave</h2><p>Soluciones probadas de la banda de los cuatro (GoF) clasificadas en creacionales, estructurales y de comportamiento...</p>`,
    },
  ],
};

// ============================================================================
// CUADERNO 2: DESARROLLO WEB Y FRONTEND
// ============================================================================
const cuadernoFrontend = {
  name: "Desarrollo Web y Frontend",
  cover: "Layout",
  color: "#06b6d4",
  notes: [
    {
      title: "Lección 1: Core de JavaScript Moderno y Event Loop",
      content: `<h2>Lección 1: Core de JavaScript Moderno y Event Loop</h2><p>Call stack, memory heap, microtask queue y el motor V8 para la gestión asíncrona...</p>`,
    },
    {
      title: "Lección 2: TypeScript Avanzado para Aplicaciones Robustas",
      content: `<h2>Lección 2: TypeScript Avanzado para Aplicaciones Robustas</h2><p>Tipado estático, generics, utility types, discriminated unions y comprobaciones exhaustivas con never...</p>`,
    },
    {
      title: "Lección 3: Arquitectura y Ciclo de Vida en React",
      content: `<h2>Lección 3: Arquitectura y Ciclo de Vida en React</h2><p>Virtual DOM, algoritmo de reconciliación Fiber, fases de Render y Commit, y patrones avanzados de hooks...</p>`,
    },
    {
      title: "Lección 4: Estrategias de Renderizado Web",
      content: `<h2>Lección 4: Estrategias de Renderizado Web</h2><p>Comparativa profunda entre CSR, SSR, SSG, ISR y la llegada de React Server Components (RSC)...</p>`,
    },
    {
      title: "Lección 5: Gestión de Estado y Rendimiento Frontend",
      content: `<h2>Lección 5: Gestión de Estado y Rendimiento Frontend</h2><p>State colocation, context splitting, memoización estratégica y la automatización con React Compiler...</p>`,
    },
  ],
};

// ============================================================================
// CUADERNO 3: BACKEND Y ARQUITECTURA DE SOFTWARE
// ============================================================================
const cuadernoBackend = {
  name: "Backend y Arquitectura de Software",
  cover: "Server",
  color: "#10b981",
  notes: [
    {
      title: "Lección 1: Diseño de APIs RESTful Profesionales",
      content: `<h2>Lección 1: Diseño de APIs RESTful Profesionales</h2><p>Verbos HTTP, códigos de estado canónicos, paginación, filtros y manejo centralizado de errores con Problem+JSON...</p>`,
    },
    {
      title: "Lección 2: Autenticación, Autorización y Seguridad",
      content: `<h2>Lección 2: Autenticación, Autorización y Seguridad</h2><p>Mecanismos JWT, Refresh Tokens, OAuth 2.0 vs OIDC, RBAC y mitigación de CORS, XSS y CSRF...</p>`,
    },
    {
      title: "Lección 3: Protocolos Modernos de Comunicación",
      content: `<h2>Lección 3: Protocolos Modernos de Comunicación</h2><p>Comparativa técnica a fondo: REST vs GraphQL vs WebSockets vs gRPC con Protocol Buffers...</p>`,
    },
    {
      title:
        "Lección 4: Patrones Arquitectónicos: De Monolito a Microservicios",
      content: `<h2>Lección 4: Patrones Arquitectónicos: De Monolito a Microservicios</h2><p>Monolitos modulares, Arquitectura Hexagonal (Puertos y Adaptadores) y bloques tácticos de Domain-Driven Design...</p>`,
    },
    {
      title: "Lección 5: Resiliencia y Escalabilidad Backend",
      content: `<h2>Lección 5: Resiliencia y Escalabilidad Backend</h2><p>Rate limiting, Circuit Breaker, colas de mensajes con Dead Letter Queues e idempotencia transaccional...</p>`,
    },
  ],
};

// ============================================================================
// CUADERNO 4: BASES DE DATOS Y MODELADO
// ============================================================================
const cuadernoBasesDatos = {
  name: "Bases de Datos y Modelado",
  cover: "Database",
  color: "#f59e0b",
  notes: [
    {
      title: "Lección 1: Modelado Relacional y Normalización",
      content: `<h2>Lección 1: Modelado Relacional y Normalización</h2><p>Esquemas relacionales, claves foráneas, restricciones de integridad y normalización formal (1NF, 2NF, 3NF)...</p>`,
    },
    {
      title: "Lección 2: Propiedades ACID y Manejo de Transacciones",
      content: `<h2>Lección 2: Propiedades ACID y Manejo de Transacciones</h2><p>Atomicidad, Consistencia, Aislamiento, Durabilidad, niveles de aislamiento SQL y el paradigma Salt...</p>`,
    },
    {
      title: "Lección 3: Optimización y Estrategia de Índices en SQL",
      content: `<h2>Lección 3: Optimización y Estrategia de Índices en SQL</h2><p>Estructuras B-Tree, índices Hash in-memory, Columnstore, análisis de planes EXPLAIN y predicados SARGable...</p>`,
    },
    {
      title: "Lección 4: Ecosistema NoSQL y Modelos de Datos",
      content: `<h2>Lección 4: Ecosistema NoSQL y Modelos de Datos</h2><p>Bases documentales, clave-valor con Redis, columnar, Teorema CAP y consistencia eventual con CRDTs...</p>`,
    },
    {
      title: "Lección 5: Estrategias de Caché y Persistencia Local",
      content: `<h2>Lección 5: Estrategias de Caché y Persistencia Local</h2><p>Patrones Cache-Aside, Write-Through, Write-Behind, persistencia local con SQLite embebido y durabilidad AOF...</p>`,
    },
  ],
};

// ============================================================================
// CUADERNO 5: DEVOPS, TERMINAL Y DESPLIEGUE
// ============================================================================
const cuadernoDevOps = {
  name: "DevOps, Terminal y Despliegue",
  cover: "Terminal",
  color: "#8b5cf6",
  notes: [
    {
      title: "Lección 1: Git Avanzado y Flujos de Colaboración",
      content: `<h2>Lección 1: Git Avanzado y Flujos de Colaboración</h2><p>Rebase interactivo, cherry-pick, stash, bisect, reflog y comparativa GitFlow vs Trunk-Based Development...</p>`,
    },
    {
      title: "Lección 2: Comandos de Terminal Linux y Shell Scripting",
      content: `<h2>Lección 2: Comandos de Terminal Linux y Shell Scripting</h2><p>Gestión de permisos chmod/chown, pipes, redirecciones, procesamiento con grep/sed/awk y scripting en Bash...</p>`,
    },
    {
      title: "Lección 3: Contenerización con Docker",
      content: `<h2>Lección 3: Contenerización con Docker</h2><p>Arquitectura del daemon, Dockerfiles multi-stage optimizados, capas inmutables, volúmenes y redes aisladas...</p>`,
    },
    {
      title: "Lección 4: Orquestación Local con Docker Compose",
      content: `<h2>Lección 4: Orquestación Local con Docker Compose</h2><p>Definición de servicios multi-contenedor en YAML, orden de arranque depends_on, variables .env y redes internas...</p>`,
    },
    {
      title: "Lección 5: Fundamentos de CI/CD y Despliegue",
      content: `<h2>Lección 5: Fundamentos de CI/CD y Despliegue</h2><p>Pipelines de Build/Test/Deploy, custodia segura de secretos, variables de compilación y despliegues Zero-Downtime...</p>`,
    },
  ],
};

// ============================================================================
// CUADERNO 6: DESARROLLO MULTIPLATAFORMA
// ============================================================================
const cuadernoMultiplataforma = {
  name: "Desarrollo Multiplataforma",
  cover: "Smartphone",
  color: "#ec4899",
  notes: [
    {
      title: "Lección 1: Arquitectura de React Native y Expo",
      content: `<h2>Lección 1: Arquitectura de React Native y Expo</h2><p>Motor de ejecución Hermes con memory-mapping, renderizador Fabric vía JSI, TurboModules y generación de tipos con Codegen...</p>`,
    },
    {
      title: "Lección 2: Estrategia Offline-First en Aplicaciones Móviles",
      content: `<h2>Lección 2: Estrategia Offline-First en Aplicaciones Móviles</h2><p>Rendimiento comparativo entre SQLite, AsyncStorage y Realm, sincronización asíncrona en segundo plano y manejo de conectividad...</p>`,
    },
    {
      title: "Lección 3: Arquitectura de Electron para Escritorio",
      content: `<h2>Lección 3: Arquitectura de Electron para Escritorio</h2><p>Separación Main Process vs Renderer Process, aislamiento de contexto vía contextBridge y patrones de comunicación IPC tipados...</p>`,
    },
    {
      title:
        "Lección 4: Empaquetado, Actualizaciones y Rendimiento en Escritorio",
      content: `<h2>Lección 4: Empaquetado, Actualizaciones y Rendimiento en Escritorio</h2><p>Patrón de doble package.json para módulos nativos de Node.js, firma de código/notarización y virtualización de UI...</p>`,
    },
  ],
};

// ============================================================================
// EXPORTACIÓN PRINCIPAL DEL ESPACIO DEV
// ============================================================================
export const presetDev: PresetEspacio = {
  id: "dev",
  name: "Desarrollo y Programación",
  description: "Sintaxis, arquitectura, snippets y comandos de terminal.",
  icon: "Code2",
  notebooks: [
    cuadernoFundamentos,
    cuadernoFrontend,
    cuadernoBackend,
    cuadernoBasesDatos,
    cuadernoDevOps,
    cuadernoMultiplataforma,
  ],
};
