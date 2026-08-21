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
      content: `<h2>Lección 1: Complejidad Algorítmica y Notación Big-O</h2>
<p>El análisis de algoritmos es una disciplina fundamental en las ciencias de la computación que nos permite evaluar la eficiencia de un desarrollo de software antes de su implementación en un entorno real. Para ello, nos enfocamos en dos recursos clave:</p>
<ul>
    <li><strong>Complejidad Temporal:</strong> Mide cómo se incrementa el tiempo de ejecución de un algoritmo a medida que crece el tamaño de la entrada (denotado habitualmente como <em>n</em>).</li>
    <li><strong>Complejidad Espacial:</strong> Evalúa la cantidad de memoria u otros recursos computacionales que requiere el algoritmo en función del tamaño de entrada <em>n</em>.</li>
</ul>

<h3>La Cota Superior Asintótica y la Notación Big-O</h3>
<p>En el análisis de algoritmos, la <strong>cota superior asintótica</strong> es una función matemática que sirve para acotar superiormente el crecimiento de otra función cuando el argumento tiende a infinito. Coloquialmente, utilizamos la <strong>Notación de Landau</strong> u <strong>O Grande (Big-O)</strong> para referirnos a este límite superior de crecimiento.</p>
<p>Formalmente, se define de la siguiente manera:</p>
<blockquote>
    O(g(n)) = { f(n) : existen constantes c &gt; 0, n_0 &gt; 0 tales que ∀ n &ge; n_0, 0 ≤ |f(n)| ≤ c|g(n)| }
</blockquote>
<p>Esto significa que f(n) pertenece a O(g(n)) si existe una constante positiva <em>c</em> a partir de la cual f(n) no sobrepasa a c &middot; g(n), demostrando que el ritmo de crecimiento de f(n) es inferior o igual al de g(n) salvo por un factor constante. Por ejemplo, una función como f(n) = n + 10 está acotada superiormente por g(n) = n² (es decir, n + 10 = O(n²)) debido a que para todo n &ge; 4.0 se cumple que n + 10 &le; n².</p>

<h3>Órdenes de Crecimiento Comunes</h3>
<p>La notación Big-O se centra en el término más significativo que domina el crecimiento y desprecia los factores constantes y de menor orden. Los principales órdenes de crecimiento son:</p>
<ol>
    <li><strong>O(1) - Tiempo Constante:</strong> El tiempo de ejecución se mantiene idéntico independientemente del tamaño de la entrada. Un ejemplo clásico es el acceso a un elemento de un array mediante su índice.
        <pre><code>int obtenerPrimerElemento(const std::vector&lt;int&gt;&amp; arr) {
    if (arr.empty()) return -1;
    return arr[0]; // Operación O(1)
}</code></pre>
    </li>
    <li><strong>O(log n) - Tiempo Logarítmico:</strong> El tamaño del problema se reduce a la mitad en cada paso. Es típico de algoritmos de búsqueda y división, como la búsqueda binaria.
        <pre><code>int busquedaBinaria(const std::vector&lt;int&gt;&amp; arr, int target) {
    int izq = 0, der = arr.size() - 1;
    while (izq &lt;= der) {
        int medio = izq + (der - izq) / 2;
        if (arr[medio] == target) return medio;
        else if (arr[medio] &lt; target) izq = medio + 1;
        else der = medio - 1;
    }
    return -1; // Peor caso O(log n), Mejor caso O(1)
}</code></pre>
    </li>
    <li><strong>O(n) - Tiempo Lineal:</strong> El tiempo de ejecución crece en proporción directa al tamaño de la entrada. Se observa al realizar un escaneo lineal o una única iteración completa sobre una estructura.
        <pre><code>bool buscarElemento(const std::vector&lt;int&gt;&amp; arr, int target) {
    for (int val : arr) {
        if (val == target) return true; // O(n) en el peor caso
    }
    return false;
}</code></pre>
    </li>
    <li><strong>O(n log n) - Tiempo Linearítmico (Log-lineal):</strong> Es característico de algoritmos eficientes de ordenamiento por división y conquista, como Merge Sort y el caso promedio de QuickSort.
        <pre><code>// Estructura de llamada recursiva típica de Divide y Vencerás
void ordenarPorMezcla(std::vector&lt;int&gt;&amp; arr, int izq, int der) {
    if (izq &lt; der) {
        int medio = izq + (der - izq) / 2;
        ordenarPorMezcla(arr, izq, medio);
        ordenarPorMezcla(arr, medio + 1, der);
        combinar(arr, izq, medio, der); // Trabajo de división y fusión: O(n log n)
    }
}</code></pre>
    </li>
    <li><strong>O(n²) - Tiempo Cuadrático:</strong> Típico de algoritmos con bucles anidados donde cada elemento se compara con todos los demás. Ejemplos comunes son Bubble Sort y Selection Sort.
        <pre><code>void bubbleSort(std::vector&lt;int&gt;&amp; arr) {
    int n = arr.size();
    for (int i = 0; i &lt; n - 1; ++i) {
        for (int j = 0; j &lt; n - i - 1; ++j) {
            if (arr[j] &gt; arr[j+1]) {
                std::swap(arr[j], arr[j+1]); // Dos bucles anidados: O(n²)
            }
        }
    }
}</code></pre>
    </li>
</ol>

<h3>Resolución de Recurrencias: El Teorema Maestro</h3>
<p>El Teorema Maestro es una herramienta matemática sistemática para resolver relaciones de recurrencia de la forma:</p>
<blockquote>
    T(n) = a &middot; T(n / b) + f(n)
</blockquote>
<p>donde <strong>a &ge; 1</strong> representa el número de subproblemas recursivos, <strong>b &gt; 1</strong> es el factor por el cual se divide el tamaño del problema, y <strong>f(n)</strong> es el costo del trabajo realizado fuera de las llamadas recursivas (división y combinación).</p>
<p>La comparación fundamental se realiza entre f(n) y la función n^(log_b(a)):</p>
<ul>
    <li><strong>Caso 1:</strong> Si f(n) = O(n^(log_b(a) - &epsilon;)) para algún &epsilon; &gt; 0, entonces la complejidad está dominada por las hojas: <strong>T(n) = &Theta;(n^(log_b(a)))</strong>.</li>
    <li><strong>Caso 2:</strong> Si f(n) = &Theta;(n^(log_b(a)) &middot; log^k(n)) para k &ge; 0, entonces la complejidad es uniforme en todos los niveles: <strong>T(n) = &Theta;(n^(log_b(a)) &middot; log^(k+1)(n))</strong>.</li>
    <li><strong>Caso 3:</strong> Si f(n) = &Omega;(n^(log_b(a) + &epsilon;)) para algún &epsilon; &gt; 0, y se cumple la condición de regularidad a &middot; f(n/b) &le; c &middot; f(n) con c &lt; 1, entonces el trabajo en la raíz domina: <strong>T(n) = &Theta;(f(n))</strong>.</li>
</ul>
<p><strong>Ejemplos Prácticos:</strong></p>
<ul>
    <li><em>Búsqueda Binaria:</em> T(n) = T(n/2) + O(1). Aquí a = 1, b = 2, f(n) = O(1). Como n^(log_2(1)) = n^0 = 1, f(n) = &Theta;(1). Aplica el Caso 2 (con k=0), dando <strong>T(n) = &Theta;(log n)</strong>.</li>
    <li><em>Merge Sort:</em> T(n) = 2T(n/2) + O(n). Aquí a = 2, b = 2, f(n) = O(n). Como n^(log_2(2)) = n^1 = n, f(n) = &Theta;(n). Aplica el Caso 2 (con k=0), dando <strong>T(n) = &Theta;(n log n)</strong>.</li>
</ul>

<h3>Estrategias de Optimización Temporal y Espacial</h3>
<p>Para mejorar el rendimiento de nuestros desarrollos de software, debemos aplicar técnicas rigurosas destinadas a minimizar el consumo de recursos:</p>
<ul>
    <li><strong>Reducción de llamadas recursivas:</strong> Convertir la recursión en iteración para eliminar el uso excesivo de memoria en la pila de llamadas (call stack).</li>
    <li><strong>Minimización de espacio auxiliar:</strong> Emplear algoritmos in-place (como QuickSort frente a Merge Sort) para reducir la asignación de memoria dinámica adicional.</li>
    <li><strong>Uso de operaciones bitwise:</strong> Resolver operaciones aritméticas complejas mediante manipulaciones de bits para acelerar el procesamiento en procesadores embebidos o sistemas de alta frecuencia.</li>
</ul>`,
    },
    {
      title: "Lección 2: Estructuras de Datos Lineales y No Lineales",
      content: `<h2>Lección 2: Estructuras de Datos Lineales y No Lineales</h2>
<p>La selección adecuada de la estructura de datos es un paso crítico en el diseño de cualquier sistema informático. Las estructuras de datos organizan la información en memoria permitiéndonos optimizar el tiempo de ejecución (complejidad temporal) y el consumo de memoria (complejidad espacial).</p>

<h3>Estructuras de Datos Lineales</h3>
<p>En las estructuras lineales, los elementos se secuencian uno detrás de otro en un orden lógico unidisciplinar:</p>

<h4>1. Arrays (Vectores)</h4>
<p>Los arrays almacenan elementos en ubicaciones de memoria contiguas. Su tamaño es estático y debe definirse en tiempo de compilación o instanciación inicial. Su gran ventaja es el acceso aleatorio instantáneo de complejidad O(1) mediante índices. Sin embargo, la inserción o eliminación de elementos en posiciones intermedias requiere desplazar los datos, con un costo de O(n).</p>
<pre><code>// Uso de std::vector (array dinámico en C++)
#include &lt;vector&gt;
std::vector&lt;int&gt; miVector = {1, 2, 3};
miVector.push_back(4); // Inserción al final: O(1) amortizado</code></pre>

<h4>2. Listas Enlazadas (Linked Lists)</h4>
<p>Consisten en nodos distribuidos dinámicamente en memoria, donde cada nodo contiene un valor y un puntero de referencia hacia el siguiente nodo (o anteriores, en listas doblemente enlazadas). No requieren memoria contigua. La inserción y eliminación son extremadamente eficientes (O(1)) una vez localizado el nodo, pero el acceso a un elemento arbitrario requiere un recorrido secuencial de costo O(n).</p>
<pre><code>// Concepto de nodo en C++
struct Nodo {
    int dato;
    Nodo* siguiente;
    Nodo(int val) : dato(val), siguiente(nullptr) {}
};</code></pre>

<h4>3. Pilas (Stacks)</h4>
<p>Siguen el principio LIFO (Last-In, First-Out; el último en entrar es el primero en salir). Las operaciones clave son insertar (push) y retirar (pop), ambas con complejidad constante O(1). Son fundamentales para el seguimiento de llamadas a funciones y el almacenamiento del historial de acciones.</p>

<h4>4. Colas (Queues)</h4>
<p>Siguen el principio FIFO (First-In, First-Out; el primero en entrar es el primero en salir). Las operaciones principales son encolar (enqueue) y desencolar (dequeue) con un costo de O(1). Se aplican ampliamente en la comunicación entre procesos, buffers de mensajería y planificación de tareas del sistema operativo.</p>

<h3>Estructuras de Datos No Lineales</h3>
<p>En las estructuras no lineales, las relaciones entre los datos son jerárquicas o interconectadas en red:</p>

<h4>1. Tablas Hash (Hash Tables)</h4>
<p>Asocian claves con valores mediante una función hash que calcula el índice del casillero (bucket) donde se almacenará el elemento. En el escenario promedio, las operaciones de búsqueda, inserción y borrado toman tiempo constante <strong>O(1)</strong>. En el peor caso, si se producen colisiones masivas de hash, el rendimiento puede degradarse a <strong>O(n)</strong>.</p>
<pre><code>// std::unordered_map en C++ (implementada como tabla hash)
#include &lt;unordered_map&gt;
std::unordered_map&lt;std::string, int&gt; edades;
edades["Alice"] = 30; // Inserción promedio O(1)</code></pre>

<h4>2. Árboles Binarios y Árboles Binarios de Búsqueda (BST)</h4>
<p>Un árbol binario es una estructura jerárquica donde cada nodo tiene a lo sumo dos hijos. En un Árbol Binario de Búsqueda (BST), el subárbol izquierdo contiene valores menores al nodo padre, y el derecho contiene valores mayores.</p>
<ul>
    <li><strong>BST No Balanceado:</strong> En el caso promedio, la búsqueda, inserción y borrado toman <strong>O(log n)</strong>. No obstante, si el árbol se degenera convirtiéndose en una estructura lineal, estas operaciones pasan a ser de peor caso <strong>O(n)</strong>.</li>
    <li><strong>Árboles Balanceados (ej. AVL, Red-Black Trees):</strong> Mantienen su altura controlada de forma estricta mediante rotaciones. Garantizan una complejidad de <strong>O(log n)</strong> para todas las operaciones clave (búsqueda, inserción y borrado), requiriendo un espacio de memoria O(n). De hecho, en C++, <code>std::map</code> está típicamente implementada como un árbol Red-Black para asegurar operaciones logarítmicas estables.</li>
</ul>

<h4>3. Grafos</h4>
<p>Son conjuntos de nodos (vértices) interconectados por enlaces (aristas). Se utilizan para modelar redes complejas como redes de transporte, mapas o perfiles sociales. Se representan comúnmente mediante matrices de adyacencia o listas de adyacencia según la densidad de sus conexiones.</p>

<h3>Casos de Uso Prácticos</h3>
<table border="1" cellpadding="5">
    <thead>
        <tr>
            <th>Estructura de Datos</th>
            <th>Complejidad Promedio (Búsqueda)</th>
            <th>Caso de Uso Clave en la Industria</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Array</strong></td>
            <td>O(n) (O(1) por índice)</td>
            <td>Lectura masiva rápida y buffers de entrada/salida de tamaño estático.</td>
        </tr>
        <tr>
            <td><strong>Lista Enlazada</strong></td>
            <td>O(n)</td>
            <td>Implementación interna de LRU Caches combinada con Tablas Hash.</td>
        </tr>
        <tr>
            <td><strong>Pila</strong></td>
            <td>O(n) (O(1) push/pop)</td>
            <td>Evaluación de expresiones matemáticas y control de deshacer/rehacer (Undo/Redo).</td>
        </tr>
        <tr>
            <td><strong>Cola</strong></td>
            <td>O(n) (O(1) enqueue/dequeue)</td>
            <td>Sistemas de colas de impresión y transmisión de paquetes en redes.</td>
        </tr>
        <tr>
            <td><strong>Tabla Hash</strong></td>
            <td>O(1)</td>
            <td>Cachés de datos en memoria, almacenamiento de sesiones de usuario e indexación.</td>
        </tr>
        <tr>
            <td><strong>Árbol Balanceado</strong></td>
            <td>O(log n)</td>
            <td>Implementación de índices en motores de bases de datos y colecciones ordenadas (std::map).</td>
        </tr>
    </tbody>
</table>`,
    },
    {
      title: "Lección 3: Algoritmos de Búsqueda y Ordenamiento",
      content: `<h2>Lección 3: Algoritmos de Búsqueda y Ordenamiento</h2>
<p>El ordenamiento eficiente de los datos es un pilar fundamental para optimizar algoritmos dependientes, como los de búsqueda. Tener colecciones perfectamente estructuradas permite pasar de búsquedas lineales pesadas a búsquedas logarítmicas de alto desempeño.</p>

<h3>Algoritmos de Búsqueda</h3>
<p>La búsqueda es el proceso de localizar un elemento específico dentro de un conjunto de datos.</p>
<ul>
    <li><strong>Búsqueda Lineal:</strong> Recorre uno a uno todos los elementos. Su complejidad es <strong>O(n)</strong> y se aplica sobre datos desordenados.</li>
    <li><strong>Búsqueda Binaria (Binary Search):</strong> Requiere estrictamente que la colección esté previamente ordenada. Aplica la estrategia de divide y vencerás: compara el elemento central con el valor objetivo; si no coincide, reduce a la mitad el rango de búsqueda recursiva o iterativamente. Su complejidad temporal es de <strong>O(log n)</strong> en el peor caso y <strong>O(1)</strong> en el mejor caso (cuando el elemento central es el objetivo).</li>
</ul>

<h3>Algoritmos de Ordenamiento</h3>
<p>Los algoritmos de ordenamiento se distinguen por características de eficiencia temporal y espacial, así como por dos propiedades clave:</p>
<ul>
    <li><strong>Estabilidad:</strong> Un algoritmo es estable si conserva el orden relativo original de los elementos que poseen claves idénticas. Esto es crucial cuando ordenamos objetos por múltiples campos (por ejemplo, ordenar por nombre y luego por edad).</li>
    <li><strong>Naturalidad:</strong> Se dice que un algoritmo es natural cuando aprovecha el orden parcial existente de los datos de entrada para reducir significativamente su tiempo de ejecución (como Bubble Sort mejorado, que se detiene si en una pasada no realiza intercambios).</li>
</ul>

<h4>Análisis de QuickSort</h4>
<p>QuickSort es un algoritmo in-place no estable basado en particiones de divide y vencerás. Elige un valor como "pivote" y reorganiza el array para que los elementos menores queden a la izquierda y los mayores a la derecha. Luego ordena recursivamente ambas partes.</p>
<ul>
    <li><strong>Mejor y Promedio Caso: O(n log n).</strong> Ocurre cuando el pivote divide el array en partes equitativas.</li>
    <li><strong>Peor Caso: O(n²).</strong> Ocurre cuando el array ya está ordenado (en orden ascendente o descendente) y se elige sistemáticamente el peor pivote (el mínimo o máximo), convirtiendo el árbol de recursión en una lista lineal.</li>
    <li><strong>Complejidad Espacial: O(log n).</strong> Requiere un espacio de pila pequeño para gestionar las llamadas recursivas.</li>
</ul>

<h4>Análisis de MergeSort</h4>
<p>MergeSort es un algoritmo estable basado en mezcla y divide y vencerás. Divide el array recursivamente en mitades hasta obtener sub-arrays unitarios, los cuales luego se combinan en orden ascendente.</p>
<ul>
    <li><strong>Eficiencia Temporal: O(n log n) en Mejor, Promedio y Peor Caso.</strong> Al dividir siempre el problema por la mitad exacta de manera simétrica, garantiza un comportamiento log-lineal independientemente de la distribución de los datos originales.</li>
    <li><strong>Complejidad Espacial: O(n).</strong> Requiere un array auxiliar temporal del mismo tamaño que la entrada para realizar la mezcla de elementos. No es un algoritmo in-place.</li>
</ul>

<h3>Comparativa de Eficiencia Asintótica</h3>
<table border="1" cellpadding="5">
    <thead>
        <tr>
            <th>Algoritmo de Ordenamiento</th>
            <th>Mejor Caso</th>
            <th>Caso Promedio</th>
            <th>Peor Caso</th>
            <th>Espacio de Memoria</th>
            <th>Estabilidad</th>
            <th>Método</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>QuickSort</strong></td>
            <td>O(n log n)</td>
            <td>O(n log n)</td>
            <td>O(n²)</td>
            <td>O(log n) (Pila)</td>
            <td>Inestable</td>
            <td>Partición</td>
        </tr>
        <tr>
            <td><strong>Merge Sort</strong></td>
            <td>O(n log n)</td>
            <td>O(n log n)</td>
            <td>O(n log n)</td>
            <td>O(n) (Auxiliar)</td>
            <td>Estable</td>
            <td>Mezcla</td>
        </tr>
        <tr>
            <td><strong>Bubble Sort (Burbuja)</strong></td>
            <td>O(n) (Mejorado)</td>
            <td>O(n²)</td>
            <td>O(n²)</td>
            <td>O(1)</td>
            <td>Estable</td>
            <td>Intercambio</td>
        </tr>
        <tr>
            <td><strong>Insertion Sort (Inserción)</strong></td>
            <td>O(n)</td>
            <td>O(n²)</td>
            <td>O(n²)</td>
            <td>O(1)</td>
            <td>Estable</td>
            <td>Inserción</td>
        </tr>
        <tr>
            <td><strong>Selection Sort (Selección)</strong></td>
            <td>O(n²)</td>
            <td>O(n²)</td>
            <td>O(n²)</td>
            <td>O(1)</td>
            <td>Inestable</td>
            <td>Selección</td>
        </tr>
    </tbody>
</table>`,
    },
    {
      title: "Lección 4: Principios SOLID y Clean Code",
      content: `<h2>Lección 4: Principios SOLID y Clean Code</h2>
<p>La ingeniería de software profesional no se limita a escribir algoritmos funcionales; el código debe estar diseñado para ser legible, mantenible, robusto ante errores y adaptable al cambio continuo. Los principios SOLID, junto con la regla DRY y las técnicas de Clean Code, sientan las bases de una arquitectura limpia.</p>

<h3>Principios SOLID</h3>
<p>SOLID es un acrónimo de cinco principios de diseño orientado a objetos formulados para mitigar la rigidez, la fragilidad y el acoplamiento innecesario del software:</p>

<h4>1. S - Single-responsibility principle (Principio de Responsabilidad Única)</h4>
<p><strong>Definición:</strong> Una clase debe tener una, y solo una, razón para cambiar. Esto significa que debe encargarse de una única responsabilidad u operación del negocio, lo que maximiza la cohesión y minimiza el acoplamiento.</p>
<p><strong>Antipatrón:</strong> Una clase que procesa un reporte, calcula métricas financieras, lo guarda en la base de datos y además genera el HTML para mostrarlo en pantalla (Clase Dios).</p>
<p><strong>Refactorización:</strong> Separar en clases independientes: <code>ReporteFinanciero</code> (modelo), <code>ReporteRepository</code> (persistencia) y <code>ReporteRenderer</code> (presentación).</p>
<pre><code>// CÓDIGO LIMPIO: Separación estricta de responsabilidades
class Invoice {
public:
    double calculateTotal() { return m_subtotal * 1.16; }
private:
    double m_subtotal = 100.0;
};

class InvoiceRepository {
public:
    void saveToDatabase(const Invoice&amp; invoice) { /* Lógica de persistencia */ }
};</code></pre>

<h4>2. O - Open-closed principle (Principio de Abierto/Cerrado)</h4>
<p><strong>Definición:</strong> Las entidades de software deben estar abiertas para la extensión, pero cerradas para la modificación. Debemos ser capaces de agregar nuevos comportamientos sin alterar el código existente.</p>
<p><strong>Antipatrón:</strong> Llenar un método de múltiples bloques <code>if-else</code> o sentencias <code>switch</code> para evaluar tipos concretos de objetos y aplicar reglas de cálculo específicas.</p>
<p><strong>Refactorización:</strong> Definir una interfaz común y extender nuevos comportamientos creando clases hijas que implementen dicha interfaz.</p>
<pre><code>// CÓDIGO LIMPIO: Extensibilidad mediante interfaces (Polimorfismo de subtipo)
class TaxCalculator {
public:
    virtual ~TaxCalculator() = default;
    virtual double calculateTax(double amount) const = 0;
};

class USTaxCalculator : public TaxCalculator {
public:
    double calculateTax(double amount) const override { return amount * 0.08; }
};

class EUTaxCalculator : public TaxCalculator {
public:
    double calculateTax(double amount) const override { return amount * 0.20; }
};</code></pre>

<h4>3. L - Liskov substitution principle (Principio de Sustitución de Liskov)</h4>
<p><strong>Definición:</strong> Los objetos de un programa deben ser reemplazables por instancias de sus subtipos sin alterar la corrección del programa. Se debe programar contra la interfaz de manera confiable.</p>
<p><strong>Antipatrón:</strong> Una clase <code>Cuadrado</code> que hereda de <code>Rectangulo</code>. Al forzar que el ancho sea igual al alto, alterar el ancho rompe la lógica matemática de la clase base <code>Rectangulo</code>, violando el contrato de la jerarquía de herencia.</p>
<p><strong>Refactorización:</strong> Eliminar la herencia forzada; crear una interfaz común de figuras geométricas o desacoplar ambas clases por completo.</p>

<h4>4. I - Interface segregation principle (Principio de Segregación de Interfaces)</h4>
<p><strong>Definición:</strong> Es preferible diseñar interfaces pequeñas y específicas antes que interfaces enormes y genéricas. Ningún cliente debe ser forzado a depender de métodos de una interfaz que no utiliza.</p>
<p><strong>Antipatrón:</strong> Una interfaz de impresora multifuncional <code>IMultiPrinter</code> con métodos como <code>imprimir()</code>, <code>escanear()</code> y <code>enviarFax()</code>. Una clase impresora básica se ve obligada a implementar <code>escanear()</code> e implementar un stub vacío que lanza una excepción.</p>
<p><strong>Refactorización:</strong> Separar la interfaz masiva en interfaces pequeñas y cohesionadas: <code>IPrinter</code>, <code>IScanner</code> e <code>IFax</code>.</p>
<pre><code>// CÓDIGO LIMPIO: Interfaces segregadas y cohesivas
class IPrinter {
public:
    virtual ~IPrinter() = default;
    virtual void printDocument() = 0;
};

class IScanner {
public:
    virtual ~IScanner() = default;
    virtual void scanDocument() = 0;
};</code></pre>

<h4>5. D - Dependency inversion principle (Principio de Inversión de Dependencias)</h4>
<p><strong>Definición:</strong> Las clases de alto nivel no deben depender de módulos de bajo nivel; ambos deben depender de abstracciones (interfaces). A su vez, las abstracciones no deben depender de los detalles concretos; los detalles deben depender de las abstracciones.</p>
<p><strong>Antipatrón:</strong> Una clase controladora de mensajería que instancia internamente un cliente concreto de correo electrónico (<code>SMTPSender service = new SMTPSender()</code>).</p>
<p><strong>Refactorización:</strong> Inyectar en el constructor una interfaz genérica (<code>IMessageSender</code>), lo que permite cambiar el motor de envío de correos a SMS o servicios en la nube sin tocar el controlador de alto nivel.</p>
<pre><code>// CÓDIGO LIMPIO: Inversión de dependencias mediante inyección de constructor
class INotificationService {
public:
    virtual ~INotificationService() = default;
    virtual void send(const std::string&amp; msg) = 0;
};

class NotificationManager {
public:
    // Depende de la abstracción, no del detalle de implementación
    NotificationManager(std::shared_ptr&lt;INotificationService&gt; service) : m_service(service) {}
    void notifyUser(const std::string&amp; alert) { m_service-&gt;send(alert); }
private:
    std::shared_ptr&lt;INotificationService&gt; m_service;
};</code></pre>

<h3>El Principio DRY (Don't Repeat Yourself)</h3>
<p>El principio <strong>DRY (No te repitas)</strong> estipula que cada pieza de conocimiento o lógica dentro de un sistema de software debe tener una representación única, inequívoca y autoritativa. Duplicar código introduce deuda técnica y aumenta drásticamente el riesgo de inconsistencias durante futuras refactorizaciones. Cuando identifiques lógica repetida, abstrayela en funciones utilitarias, clases reutilizables o parametrizaciones elegantes.</p>`,
    },
    {
      title: "Lección 5: Patrones de Diseño Clave",
      content: `<h2>Lección 5: Patrones de Diseño Clave</h2>
<p>Los patrones de diseño GoF (Gang of Four) representan soluciones probadas a problemas recurrentes en el desarrollo de software orientado a objetos. Se categorizan según su propósito en tres grandes familias: creacionales, estructurales y de comportamiento.</p>

<h3>1. Patrones Creacionales</h3>
<p>Manejan los mecanismos de creación de objetos, incrementando la flexibilidad y la reutilización del código existente al encapsular los detalles de instanciación:</p>

<h4>Singleton</h4>
<p>Asegura que una clase tenga una <strong>única instancia</strong> en memoria durante la ejecución de la aplicación, proporcionando un punto de acceso global centralizado. Aunque es útil para ciertos recursos compartidos, <em>actúa esencialmente como una variable global</em>, lo que limita significativamente la flexibilidad para el cambio o extensión, tiende a ser sobreutilizado por programadores novatos y dificulta las pruebas unitarias automatizadas.</p>
<pre><code>// Implementación clásica de Singleton en C++
class Logger {
public:
    static Logger&amp; getInstance() {
        static Logger instance; // Instancia única garantizada de forma segura ante hilos
        return instance;
    }
    void log(const std::string&amp; msg) { /* Lógica de registro */ }
private:
    Logger() = default; // Constructor privado para evitar instanciación externa
    Logger(const Logger&amp;) = delete; // Eliminar constructor de copia
    Logger&amp; operator=(const Logger&amp;) = delete; // Eliminar operador de asignación
};</code></pre>

<h4>Factory Method (Método de Fábrica)</h4>
<p>Define una interfaz o método abstracto para crear un objeto, pero delega en las subclases la decisión de qué clase concreta instanciar. Esto permite encapsular las complejidades creacionales y desacoplar al creador de los tipos concretos de productos.</p>

<h3>2. Patrones Estructurales</h3>
<p>Explican cómo ensamblar objetos y clases en estructuras más grandes manteniendo la flexibilidad, eficiencia y compatibilidad de las interfaces:</p>

<h4>Adapter (Adaptador)</h4>
<p>Permite la colaboración de clases con interfaces incompatibles. Convierte la interfaz de una clase existente (adaptee) en otra que el cliente espera, logrando un diseño desacoplado de alta cohesión. Se aplica cuando se integran bibliotecas de terceros o módulos heredados sin alterar su código fuente.</p>
<pre><code>// Adaptando una clase antigua a una interfaz moderna
class OldSensor {
public:
    double getReadingFahrenheit() const { return 98.6; }
};

class ITemperatureSensor {
public:
    virtual ~ITemperatureSensor() = default;
    virtual double getTemperatureCelsius() const = 0;
};

class TemperatureAdapter : public ITemperatureSensor {
private:
    OldSensor m_oldSensor;
public:
    double getTemperatureCelsius() const override {
        double f = m_oldSensor.getReadingFahrenheit();
        return (f - 32.0) * 5.0 / 9.0; // Conversión y adaptación de datos
    }
};</code></pre>

<h4>Decorator (Decorador)</h4>
<p>Permite añadir dinámicamente responsabilidades o comportamientos adicionales a un objeto en tiempo de ejecución de manera flexible sin utilizar la herencia masiva. Funciona mediante un wrapper (envoltorio) que contiene al componente real y delega el flujo de ejecución agregando su propio procesamiento adicional.</p>

<h3>3. Patrones de Comportamiento</h3>
<p>Se encargan de gestionar una comunicación eficiente, el flujo de ejecución y la asignación clara de responsabilidades entre múltiples objetos del sistema:</p>

<h4>Observer (Observador)</h4>
<p>Define una relación de dependencia de uno a muchos entre objetos. Cuando el estado del objeto principal (sujeto/publicador) cambia, todos sus dependientes registrados (observadores/suscriptores) son notificados de manera automática y desacoplada. Es la base de arquitecturas reactivas y sistemas de gestión de eventos GUI.</p>

<h4>Strategy (Estrategia)</h4>
<p>Define una familia de algoritmos, encapsula cada uno de ellos y los hace completamente intercambiables en tiempo de ejecución. Permite que un algoritmo varíe de forma independiente del contexto o de los clientes que lo utilicen. Es una excelente alternativa para reemplazar bloques complejos de herencia y condicionales dinámicos.</p>
<pre><code>// Implementación del patrón Strategy en C++
class PaymentStrategy {
public:
    virtual ~PaymentStrategy() = default;
    virtual void collectPayment(double amount) const = 0;
};

class CreditCardPayment : public PaymentStrategy {
public:
    void collectPayment(double amount) const override { /* Cobrar con Tarjeta */ }
};

class PayPalPayment : public PaymentStrategy {
public:
    void collectPayment(double amount) const override { /* Cobrar con PayPal */ }
};

class ShoppingCart {
private:
    std::shared_ptr&lt;PaymentStrategy&gt; m_strategy;
public:
    void setPaymentStrategy(std::shared_ptr&lt;PaymentStrategy&gt; s) { m_strategy = s; }
    void checkout(double amount) { m_strategy-&gt;collectPayment(amount); }
};</code></pre>`,
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
      content: `<h2>Lección 1: Core de JavaScript Moderno y Event Loop</h2><p>Para diseñar arquitecturas frontend de alto rendimiento, es indispensable dominar cómo el motor de ejecución procesa el código de manera asíncrona y gestiona los recursos de memoria.</p><h3>El Motor V8 y la Estructura de Ejecución</h3><p>El <strong>Motor V8</strong> de Google (utilizado en Chrome y Node.js) compila código JavaScript directamente a código de máquina a través de su compilador JIT (Just-In-Time). Su ejecución es de un solo hilo (single-threaded), lo que significa que solo puede ejecutar una tarea a la vez utilizando las siguientes estructuras clave:</p><ul><li><strong>Call Stack (Pila de Llamadas):</strong> Es una estructura LIFO (Last In, First Out) que registra en qué parte del programa nos encontramos. Cada vez que se invoca una función, se añade un marco de pila (stack frame) a la pila, y se elimina una vez que la función retorna. Si la pila se desborda debido a una recursión infinita, se produce el error <em>Stack Overflow</em>.</li><li><strong>Memory Heap (Montículo de Memoria):</strong> Es un área de memoria desestructurada donde se asigna dinámicamente el espacio para los objetos, arrays y funciones de nuestra aplicación.</li></ul><h3>El Event Loop y la Gestión de Tareas</h3><p>La asincronía en JavaScript no ocurre dentro del propio motor V8, sino gracias a las APIs del entorno de ejecución (Web APIs en el navegador, como <code>setTimeout</code> o <code>fetch</code>) y al <strong>Event Loop</strong>. El Event Loop monitorea constantemente el Call Stack y decide cuándo mover tareas desde las colas de mensajes hacia la pila para su ejecución:</p><ul><li><strong>Task Queue (Cola de Macrotareas):</strong> Almacena callbacks de eventos como temporizadores (<code>setTimeout</code>, <code>setInterval</code>), interacciones del usuario y operaciones de E/S. El Event Loop procesa una macrotarea a la vez, dando paso al renderizado de la UI entre ellas.</li><li><strong>Microtask Queue (Cola de Microtareas):</strong> Tiene una prioridad significativamente mayor. Almacena callbacks de <strong>Promesas</strong> (controladas por <code>.then()</code>/<code>.catch()</code>) y mutaciones de observadores. El Event Loop vaciará por completo la cola de microtareas antes de dar paso a la siguiente macrotarea o permitir que el navegador actualice los gráficos de la pantalla.</li></ul><h3>Promesas, async/await y Manejo de Errores</h3><p>Las promesas representan el eventual resultado de una operación asíncrona. La sintaxis moderna <code>async/await</code> actúa como azúcar sintáctico sobre las promesas, permitiendo escribir código asíncrono con una estructura visualmente secuencial. En entornos de producción, es obligatorio envolver las llamadas asíncronas de red o persistencia dentro de bloques <code>try/catch</code> y un bloque opcional <code>finally</code> para garantizar que el estado de carga (loading) se desactive de forma segura independientemente del resultado:</p><pre><code>async function handleAsyncRequest() {
  try {
    setLoading(true);
    const response = await fetch('/api/data');
    const data = await response.json();
    setData(data);
  } catch (error) {
    console.error('Error de red capturado:', error);
    setError(error.message);
  } finally {
    setLoading(false); // Siempre se ejecuta
  }
}</code></pre><h3>Scope y Closures (Clausuras)</h3><p>El <strong>Scope</strong> define la accesibilidad de las variables. JavaScript utiliza un sistema de <em>lexical scoping</em>, donde el alcance se determina en tiempo de compilación según la ubicación física de las variables en el código fuente.</p><p>Un <strong>Closure</strong> es una función que recuerda y mantiene acceso a las variables de su ámbito léxico externo, incluso después de que la función externa haya terminado de ejecutarse. En React, los closures son la base de los Custom Hooks y las funciones de actualización de estado; preservan el estado entre renders pero exigen cautela, ya que si no se gestionan correctamente las dependencias en funciones callback se pueden generar <em>stale closures</em> (clausuras obsoletas) que consuman valores desactualizados del estado.</p>`,
    },
    {
      title: "Lección 2: TypeScript Avanzado para Aplicaciones Robustas",
      content: `<h2>Lección 2: TypeScript Avanzado para Aplicaciones Robustas</h2><p>TypeScript dota a los desarrolladores de un robusto sistema de tipos que permite detectar errores en tiempo de compilación, documentar el código de forma automática y facilitar refactorizaciones seguras.</p><h3>Generics (Tipos Genéricos) avanzados</h3><p>Los genéricos permiten crear componentes y hooks sumamente reutilizables que no están limitados a un único tipo de dato, manteniendo una seguridad estricta al inferir automáticamente los tipos pasados por parámetros. Por ejemplo, un hook de consulta de APIs tipado:</p><pre><code>function useAPI&lt;T&gt;(url: string): { data: T | null; loading: boolean; error: string | null } {
  // La estructura infiere dinámicamente el tipo T del response
  const [data, setData] = useState&lt;T | null&gt;(null);
  // ...
  return { data, loading, error };
}</code></pre><h3>Utility Types (Tipos de Utilidad)</h3><p>TypeScript proporciona utilidades nativas para transformar tipos existentes y evitar la duplicación de código:</p><ul><li><strong><code>Pick&lt;Type, Keys&gt;</code>:</strong> Crea un tipo seleccionando un conjunto de propiedades específicas de un tipo base. Ideal para mostrar resúmenes de datos o miniaturas de componentes.</li><li><strong><code>Omit&lt;Type, Keys&gt;</code>:</strong> Lo opuesto a Pick; crea un tipo omitiendo propiedades específicas. Muy útil para eliminar campos sensibles (contraseñas, hashes) o metadatos de base de datos antes de enviar datos al cliente.</li><li><strong><code>Partial&lt;Type&gt;</code>:</strong> Convierte todas las propiedades de un tipo en opcionales. Esencial para operaciones de actualización o formularios de edición parcial.</li><li><strong><code>Record&lt;Keys, Type&gt;</code>:</strong> Construye un tipo de objeto cuyas propiedades de clave pertenecen a un conjunto y sus valores a un tipo común. Es ideal para diccionarios y mapas de permisos.</li></ul><h3>Discriminated Unions y Type Narrowing</h3><p>Las uniones discriminadas (o <em>algebraic data types</em>) asocian múltiples estructuras bajo una propiedad de etiqueta común (el discriminador) para modelar de forma impecable estados complejos como las peticiones de red:</p><pre><code>type LoadingState = { status: 'loading' };
type SuccessState&lt;T&gt; = { status: 'success'; data: T };
type ErrorState = { status: 'error'; message: string };

type DataState&lt;T&gt; = LoadingState | SuccessState&lt;T&gt; | ErrorState;</code></pre><p>El <strong>Type Narrowing</strong> permite que el compilador reduzca o restrinja el tipo de una variable dentro de bloques condicionales (como <code>switch</code> o <code>if</code>) basándose en el discriminador <code>status</code>. Esto le garantiza al compilador que, por ejemplo, solo se puede acceder a la propiedad <code>data</code> cuando el estado es exactamente <code>'success'</code>.</p><h3>Exhaustive Checking con el tipo <code>never</code></h3><p>El tipo <code>never</code> representa valores que nunca deberían ocurrir. Se utiliza para implementar comprobaciones exhaustivas de tipos en tiempo de compilación. Si agregamos un nuevo estado a la unión discriminada y olvidamos manejarlo en un <code>switch</code>, el compilador arrojará un error inmediato:</p><pre><code>function renderUI&lt;T&gt;(state: DataState&lt;T&gt;) {
  switch (state.status) {
    case 'loading': return '&lt;p&gt;Cargando...&lt;/p&gt;';
    case 'success': return \`&lt;p&gt;Datos: \${JSON.stringify(state.data)}&lt;/p&gt;\`;
    case 'error': return \`&lt;p&gt;Error: \${state.message}&lt;/p&gt;\`;
    default:
      // Si falta un estado, TypeScript fallará aquí
      const _exhaustiveCheck: never = state;
      return _exhaustiveCheck;
  }
}</code></pre><h3>Buenas Prácticas Arquitectónicas</h3><ul><li>Habilitar siempre la configuración <code>strict: true</code> en el archivo <code>tsconfig.json</code>.</li><li>Usar aserciones de tipo (<code>as</code>) solo cuando sea estrictamente necesario; priorizar siempre los protectores de tipo (type guards).</li><li>Implementar imports exclusivos de tipos (<code>import type { User } from './types'</code>) para garantizar un tree-shaking óptimo en producción.</li></ul>`,
    },
    {
      title: "Lección 3: Arquitectura y Ciclo de Vida en React",
      content: `<h2>Lección 3: Arquitectura y Ciclo de Vida en React</h2><p>Comprender cómo React gestiona el ciclo de vida de los componentes, procesa los cambios y interactúa con el DOM real es fundamental para evitar problemas de re-renderizado masivo y fugas de memoria.</p><h3>Virtual DOM y el Algoritmo de Reconciliation (Fiber)</h3><p>El <strong>Virtual DOM</strong> es una representación en memoria de la UI real en forma de árbol de objetos JavaScript. Cuando el estado de un componente cambia, React genera un nuevo árbol virtual.</p><p>El proceso de <strong>Reconciliation</strong> compara el nuevo árbol virtual con el anterior mediante un algoritmo de difracción (diffing) optimizado para identificar de forma eficiente qué partes del DOM real necesitan ser actualizadas:</p><ul><li>React asume que dos elementos de diferente tipo producirán árboles diferentes y los destruirá por completo.</li><li>Utiliza la propiedad especial <code>key</code> para mantener la identidad de los elementos a lo largo de los renders, evitando la recreación destructiva de listas en el DOM.</li></ul><h3>Las Fases del Ciclo de Vida: Render y Commit</h3><p>El ciclo de vida de React se divide formalmente en dos fases principales:</p><ol><li><strong>Fase de Render:</strong> Es puramente computacional. React ejecuta el código de los componentes para calcular qué parte de la UI debe cambiar. Esta fase es asíncrona, no produce efectos visuales en pantalla y puede ser pausada o reiniciada por React en caso de interrupciones de prioridad.</li><li><strong>Fase de Commit:</strong> Es donde React escribe directamente las modificaciones en el DOM real de forma síncrona. Aquí es donde se aplican físicamente los cambios calculados. Posteriormente, se disparan los efectos como <code>useLayoutEffect</code> (síncronamente tras pintar) y <code>useEffect</code> (de forma asíncrona tras la fase de commit).</li></ol><h3>Arquitectura de Custom Hooks avanzados y Patrones Form</h3><p>Un Custom Hook permite encapsular estado complejo y comportamiento reusable en una función limpia. En el diseño de formularios de producción (CRUD Form Pattern), es sumamente eficiente unificar patrones avanzados como:</p><ul><li><strong>Custom Hook centralizado (useForm):</strong> Actúa como el cerebro, manteniendo el estado de valores, errores de validación, campos tocados (touched) y envío de datos (isSubmitting).</li><li><strong>Compound Components Pattern:</strong> Permite componer formularios de forma declarativa (e.g., <code>&lt;Form&gt; &lt;Form.Field name='email'/&gt; &lt;/Form&gt;</code>) delegando flexibilidad de diseño al desarrollador.</li><li><strong>Provider-Context Pattern:</strong> Expone el estado del hook <code>useForm</code> a través de un contexto de formulario (<code>useFormContext</code>), permitiendo que cada subcomponente de campo se registre de forma independiente sin incurrir en acoplamiento de props (prop drilling).</li></ul><h3>Reglas de los Hooks</h3><ul><li><strong>Regla 1:</strong> Solo invocar hooks en el nivel superior de tus funciones de React. No los llames dentro de bucles, condiciones o funciones anidadas para garantizar que siempre se ejecuten en el mismo orden exacto.</li><li><strong>Regla 2:</strong> Solo invocar hooks desde funciones de componentes de React o desde otros Custom Hooks (cuyo nombre debe empezar obligatoriamente con el prefijo <code>use</code>).</li></ul>`,
    },
    {
      title: "Lección 4: Estrategias de Renderizado Web",
      content: `<h2>Lección 4: Estrategias de Renderizado Web</h2><p>La elección de la estrategia de renderizado tiene un impacto directo en el rendimiento percibido por el usuario, el posicionamiento en buscadores (SEO) y la escalabilidad de la infraestructura.</p><h3>Comparativa Técnica de Estrategias de Renderizado</h3><table><thead><tr><th>Estrategia</th><th>Descripción</th><th>Ventajas</th><th>Desventajas / Retos</th></tr></thead><tbody><tr><td><strong>CSR (Client-Side Rendering)</strong></td><td>Todo el renderizado se realiza en el navegador del usuario utilizando JavaScript.</td><td>Interacciones fluidas una vez cargada la app; menor costo de servidor.</td><td>Tiempos de carga inicial lentos (bloat de bundles &gt;5MB); mal SEO; alta carga de ejecución de CPU en el cliente.</td></tr><tr><td><strong>SSR (Server-Side Rendering)</strong></td><td>El servidor genera HTML dinámico personalizado en cada solicitud del usuario.</td><td>FCP rápido; excelente SEO; contenido siempre fresco y actualizado.</td><td>Mayor latencia en el servidor (TTFB); costo de infraestructura alto; sobrecarga en hidratación del cliente.</td></tr><tr><td><strong>SSG (Static Site Generation)</strong></td><td>La página se renderiza completamente a HTML estático en tiempo de compilación.</td><td>Carga ultrarrápida desde CDNs; costo mínimo; máxima seguridad y SEO.</td><td>Inviable para contenido altamente dinámico; requiere recompilar la app completa ante cambios.</td></tr><tr><td><strong>ISR (Incremental Static Regeneration)</strong></td><td>Permite regenerar de forma estática páginas individuales en segundo plano sin reconstruir todo el sitio.</td><td>Rendimiento de SSG con la capacidad de servir contenido dinámico actualizado.</td><td>Los usuarios iniciales pueden ver datos desactualizados (stale) durante el proceso de regeneración.</td></tr></tbody></table><h3>La Revolución de React Server Components (RSC)</h3><p>Los <strong>React Server Components (RSC)</strong> introducen un paradigma de renderizado híbrido. A diferencia de SSR tradicional (donde todo el código se envía al cliente para su hidratación), los RSC se ejecutan exclusivamente en el servidor:</p><ul><li><strong>Zero-Bundle-Size:</strong> Las dependencias pesadas utilizadas exclusivamente en Server Components (como formateadores de Markdown o librerías matemáticas) se quedan en el servidor, disminuyendo el tamaño de descarga del JavaScript del cliente entre un 40% y un 60%.</li><li><strong>Acceso Directo al Servidor:</strong> Permiten realizar operaciones de asincronía nativa con <code>async/await</code> y consultar directamente bases de datos, APIs internas o el sistema de archivos sin necesidad de APIs intermedias.</li><li><strong>Sin Hidratación en el Cliente:</strong> No envían código de interacción Javascript para los RSC, liberando el hilo principal del cliente y optimizando las Core Web Vitals críticas, como el Largest Contentful Paint (LCP) que disminuye hasta un 67% y el Time to Interactive (TTI) que mejora un 64%.</li></ul><h3>Matriz de Decisión: Server vs. Client Components</h3><blockquote><strong>Cuándo usar Server Components:</strong> Obtención de datos (data fetching), layouts estructurales, renderizado de contenido puramente informativo o estático, almacenamiento seguro de secretos y lógica sensible, y minimización de código de cliente.<br/><br/><strong>Cuándo usar Client Components:</strong> Necesidad de interactividad directa (eventos como <code>onClick</code> o <code>onChange</code>), gestión de estado con <code>useState</code> o <code>useReducer</code>, uso de hooks del ciclo de vida (<code>useEffect</code>) y APIs exclusivas del navegador.</blockquote>`,
    },
    {
      title: "Lección 5: Gestión de Estado y Rendimiento Frontend",
      content: `<h2>Lección 5: Gestión de Estado y Rendimiento Frontend</h2><p>El escalado de aplicaciones complejas exige optimizaciones quirúrgicas en la persistencia del estado, estrategias de renderizado controlado y técnicas de carga diferida de recursos.</p><h3>Estrategia de Estado Local vs. Global</h3><p>Un error común en aplicaciones React masivas es centralizar todo el estado en un único almacén global monolítico como Redux, provocando renderizados en cascada que degradan el rendimiento drásticamente. Las soluciones arquitectónicas incluyen:</p><ul><li><strong>State Colocation (Colocación de Estado):</strong> Desplazar el estado lo más cerca posible de los componentes que realmente lo consumen. Esto delimita el impacto de las actualizaciones y reduce el número de componentes afectados en un re-renderizado.</li><li><strong>Context Splitting (División de Contexto):</strong> Diseñar contextos de dominio finos e independientes en lugar de un único proveedor masivo. Esto evita que cambios en datos volátiles (como notificaciones) obliguen a repintar componentes que solo consumen datos estáticos (como el perfil de usuario).</li></ul><h3>Memoización Estratégica en React</h3><p>La memoización almacena en caché cálculos pesados o renderizados de componentes para saltarse ciclos innecesarios, resolviendo el problema de la inestabilidad de referencias generada por JavaScript en cada ciclo de render:</p><ul><li><strong>React.memo:</strong> HOC que envuelve componentes funcionales y almacena su última representación visual, omitiendo el renderizado si las nuevas propiedades superan una comparación superficial (shallow comparison). Es ideal para listas pesadas, dashboards de datos y visualizaciones. Permite definir comparadores personalizados (custom comparators) para omitir metadatos volátiles como marcas de tiempo de APIs.</li><li><strong>useMemo y useCallback:</strong> Garantizan la estabilidad de referencias. <code>useMemo</code> memoriza valores derivados de operaciones de alto costo computacional (ej. filtrar listas de más de 100 elementos), mientras que <code>useCallback</code> mantiene la misma referencia en memoria para funciones de callback pasadas como props a hijos memoizados.</li></ul><h3>La Era de React Compiler 1.0 (React Forget)</h3><p>Lanzado en versión estable en octubre de 2025, <strong>React Compiler</strong> marca un hito al automatizar la memoización de componentes a nivel de compilación mediante un análisis estático profundo con grafos de flujo de control (CFG). Los desarrolladores ya no necesitan escribir manualmente <code>useMemo</code> ni <code>useCallback</code>, ya que el compilador optimiza dinámicamente las referencias en tiempo de build, dejando estas herramientas tradicionales exclusivamente como escape hatches de control ultra preciso en casos de integración muy específicos.</p><h3>Lazy Loading (Carga Diferida) y Suspense</h3><p>Permite dividir el bundle final en trozos más pequeños (code-splitting) para que el navegador solo descargue los recursos que el usuario realmente necesita en su vista actual:</p><ul><li><strong>React.lazy():</strong> Importa dinámicamente componentes bajo demanda. Se recomienda aplicar esta estrategia de forma híbrida: a nivel de rutas principales (route-based) y en subcomponentes pesados individuales que superen los 40KB de peso (component-based).</li><li><strong>&lt;Suspense&gt;:</strong> Envuelve componentes lazy y define un fallback visual de carga limpio (como un spinner de carga o un esqueleto estructurado) para evitar molestos desplazamientos de diseño (Cumulative Layout Shift) en la pantalla.</li></ul>`,
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
      content: `<h2>Lección 1: Diseño de APIs RESTful Profesionales</h2><p>El diseño de una API RESTful profesional va más allá de exponer endpoints; requiere el cumplimiento de principios arquitectónicos estrictos y buenas prácticas para garantizar la escalabilidad, la mantenibilidad y una óptima experiencia del desarrollador.</p><h3>Principios Clave de REST</h3><ul><li><strong>Cliente-servidor:</strong> Separación clara de responsabilidades, permitiendo la evolución independiente del frontend y del backend.</li><li><strong>Sin estado (Stateless):</strong> Cada petición HTTP debe contener toda la información necesaria para ser procesada; el servidor no almacena contexto de sesión entre peticiones.</li><li><strong>Caché:</strong> Las respuestas deben definirse explícitamente como almacenables en caché para reducir la latencia y la carga del servidor.</li><li><strong>Interfaz uniforme:</strong> Uso estandarizado de métodos HTTP y diseño consistente de recursos.</li><li><strong>Sistema en capas:</strong> Permite arquitecturas flexibles (balanceadores, proxies, gateways) invisibles para el cliente.</li></ul><h3>Uso Correcto de Verbos HTTP</h3><table><thead><tr><th>Método</th><th>Uso principal</th><th>Idempotente</th><th>Seguro</th></tr></thead><tbody><tr><td><strong>GET</strong></td><td>Lectura de recursos o colecciones. No debe modificar el estado del servidor.</td><td>✔ Sí</td><td>✔ Sí</td></tr><tr><td><strong>POST</strong></td><td>Creación de recursos o ejecución de acciones que no encajan en otros verbos (ej. búsquedas complejas con payloads grandes).</td><td>✘ No</td><td>✘ No</td></tr><tr><td><strong>PUT</strong></td><td>Reemplazar por completo un recurso identificado por su URI. Puede crear el recurso si no existe.</td><td>✔ Sí</td><td>✘ No</td></tr><tr><td><strong>PATCH</strong></td><td>Actualización parcial de un recurso. Se recomienda diseñar su comportamiento para que sea idempotente.</td><td>✘ No (Recomendado ✔)</td><td>✘ No</td></tr><tr><td><strong>DELETE</strong></td><td>Eliminación del recurso especificado. Varias peticiones idénticas tienen el mismo efecto final.</td><td>✔ Sí</td><td>✘ No</td></tr><tr><td><strong>HEAD</strong></td><td>Obtener metadatos (encabezados) de un recurso sin transferir el cuerpo.</td><td>✔ Sí</td><td>✔ Sí</td></tr><tr><td><strong>OPTIONS</strong></td><td>Consultar los métodos HTTP soportados por un endpoint específico.</td><td>✔ Sí</td><td>✔ Sí</td></tr></tbody></table><h3>Códigos de Estado Canónicos</h3><p>Una API profesional debe retornar códigos HTTP semánticamente correctos, evitando devolver siempre 200 OK con un objeto de error en la carga útil:</p><ul><li><strong>200 OK:</strong> Éxito en operaciones de lectura o actualización que retornan datos.</li><li><strong>201 Created:</strong> Recurso creado exitosamente.</li><li><strong>204 No Content:</strong> Operación exitosa que no requiere retornar cuerpo (ej. eliminaciones).</li><li><strong>400 Bad Request:</strong> Error del cliente en formato, parámetros obligatorios o validaciones iniciales de datos.</li><li><strong>401 Unauthorized:</strong> Falta de credenciales de autenticación o credenciales inválidas.</li><li><strong>403 Forbidden:</strong> Cliente autenticado pero sin permisos para acceder al recurso específico.</li><li><strong>404 Not Found:</strong> El recurso solicitado no existe en el sistema.</li><li><strong>409 Conflict:</strong> Conflicto con el estado actual del recurso (ej. duplicados).</li><li><strong>422 Unprocessable Entity:</strong> Carga útil válida estructuralmente pero con lógica o contenido inválido.</li><li><strong>429 Too Many Requests:</strong> Límite de peticiones excedido (Rate limiting).</li><li><strong>500 Internal Server Error:</strong> Fallo inesperado en el backend.</li><li><strong>503 Service Unavailable:</strong> Sistema temporalmente inactivo por mantenimiento.</li></ul><h3>Versionamiento Semántico</h3><p>Se debe adoptar la nomenclatura <strong>MAJOR.MINOR.PATCH</strong>. Cualquier cambio incompatible que rompa el contrato de la API (breaking change) obliga a un incremento de la versión MAJOR (ej. de <code>/v1/users</code> a <code>/v2/users</code>). Los cambios no destructivos incrementan MINOR, y la resolución de errores incrementa PATCH.</p><h3>Paginación y Filtros</h3><p>Para colecciones voluminosas, es mandatorio implementar parámetros de consulta para limitar la transferencia de datos (ej. <code>GET /users?limit=10&offset=20</code> o mediante cursor). La respuesta paginada debe estructurar metadatos como el total de elementos, límite, desplazamiento y enlaces de navegación (<em>next</em> / <em>prev</em>).</p><h3>Manejo Centralizado de Errores</h3><p>Es indispensable estructurar las respuestas de error en un formato uniforme (como el estándar <em>Problem+JSON</em>: <code>application/problem+json</code>). El cuerpo de error debe ser consistente, claro y libre de información técnica de infraestructura:</p><pre><code>{\n  \"status\": 422,\n  \"error\": \"Unprocessable Entity\",\n  \"message\": \"La solicitud contiene errores de validación.\",\n  \"code\": \"ERR_VALIDATION_PASSWORD_WEAK\",\n  \"timestamp\": \"2026-08-20T19:05:00Z\",\n  \"path\": \"/api/v1/users\",\n  \"errors\": [\n    {\n      \"field\": \"password\",\n      \"message\": \"Debe tener al menos 8 caracteres.\"\n    }\n  ]\n}</code></pre><p><strong>Regla de oro:</strong> Nunca expongas trazas de pila (stack traces), nombres de tablas de bases de datos o errores crudos de SQL en producción, ya que representan fallas de seguridad graves.</p>`,
    },
    {
      title: "Lección 2: Autenticación, Autorización y Seguridad",
      content: `<h2>Lección 2: Autenticación, Autorización y Seguridad</h2><p>La protección de datos y servicios en una API REST es una obligación tanto ética como de diseño. Una API segura debe delegar, auditar y controlar de forma granular quién accede a qué recursos.</p><h3>Mecanismos JWT (JSON Web Tokens)</h3><p>JWT es un estándar compacto que empaqueta información firmada digitalmente en tres secciones: <strong>Header</strong> (algoritmo y tipo), <strong>Payload</strong> (claims o afirmaciones de identidad como <code>sub</code>, <code>iss</code>, <code>aud</code>, <code>exp</code>, roles y scopes), y <strong>Signature</strong> (para verificar la integridad del token en el backend sin consultas constantes a una base de datos central, facilitando la validación stateless).</p><p><em>Riesgos Críticos con JWT:</em> No verificar la firma digital, aceptar algoritmos débiles (como <code>none</code>), emitir tokens con tiempos de expiración excesivos, e incluir información confidencial o sensible dentro del payload sin cifrar.</p><h3>Refresh Tokens y Gestión de Sesión</h3><p>Los Refresh Tokens son credenciales de larga duración que se guardan de forma segura en el cliente (como cookies <code>HttpOnly</code> y <code>Secure</code>) y se transmiten únicamente al servidor de autorización para obtener un nuevo Access Token corto cuando este expire. Esto minimiza el riesgo de interceptación de los tokens de acceso activos.</p><h3>OAuth 2.0 y OpenID Connect (OIDC)</h3><p>Es de vital importancia entender que <strong>OAuth 2.0 es un marco de autorización delegada</strong> (responde a: ¿qué recursos tiene permitido acceder este cliente?), mientras que <strong>OpenID Connect es la capa de identidad</strong> construida sobre OAuth 2.0 para la autenticación de usuarios (responde a: ¿quién es el usuario autenticado?).</p><ul><li><strong>Access Token:</strong> Diseñado para autorizar solicitudes en los servidores de recursos (APIs).</li><li><strong>ID Token:</strong> Un JWT diseñado específicamente para que el cliente obtenga información estandarizada de la identidad del usuario de manera legible.</li></ul><h3>Control de Acceso Basado en Roles (RBAC)</h3><p>Consiste en mapear los claims del token (como scopes o roles) a permisos específicos dentro del backend, limitando las acciones sensibles únicamente a usuarios autorizados de acuerdo con el principio de mínimo privilegio.</p><h3>Hash de Contraseñas (Argon2 / Bcrypt)</h3><p>Las contraseñas de los usuarios nunca deben almacenarse en texto plano. Se debe aplicar un algoritmo de hash criptográfico adaptativo y con factor de trabajo (salting) como <strong>Bcrypt</strong> o, preferiblemente, <strong>Argon2</strong> para proteger la base de datos de credenciales frente a ataques de fuerza bruta o tablas de arcoíris.</p><h3>Mitigación de Vulnerabilidades Comunes</h3><ul><li><strong>CORS (Cross-Origin Resource Sharing):</strong> Debe configurarse con políticas de origen estrictas en el servidor, evitando comodines (<code>*</code>) en entornos que manejen autenticación.</li><li><strong>XSS (Cross-Site Scripting):</strong> Se previene sanitizando rigurosamente todos los datos de entrada en el servidor y escapando las salidas en el cliente para evitar la inyección de scripts maliciosos.</li><li><strong>CSRF (Cross-Site Request Forgery):</strong> Se mitiga utilizando tokens CSRF de un solo uso o mediante políticas estrictas en cookies de sesión como <code>SameSite=Strict</code> o <code>Lax</code>.</li></ul>`,
    },
    {
      title: "Lección 3: Protocolos Modernos de Comunicación",
      content: `<h2>Lección 3: Protocolos Modernos de Comunicación</h2><p>En la arquitectura de sistemas distribuida moderna, no existe un protocolo único que resuelva de manera óptima todos los problemas. El arquitecto de software debe dominar las compensaciones de cada alternativa:</p><h3>Comparativa Técnica de Protocolos</h3><table><thead><tr><th>Protocolo</th><th>Estilo de Interacción</th><th>Formato de Datos</th><th>Latencia y Transporte</th><th>Casos de Uso Ideales</th></tr></thead><tbody><tr><td><strong>REST</strong></td><td>Orientado a Recursos (Cliente-Servidor)</td><td>JSON / XML</td><td>Media-Alta (HTTP/1.1 o HTTP/2)</td><td>APIs públicas, integraciones generales de sistemas corporativos y servicios CRUD.</td></tr><tr><td><strong>GraphQL</strong></td><td>Orientado a Consultas Flexibles (Single Endpoint)</td><td>JSON</td><td>Media (HTTP/1.1 o HTTP/2)</td><td>Aplicaciones frontend con requisitos de datos dinámicos, evitando overfetching y underfetching.</td></tr><tr><td><strong>WebSockets</strong></td><td>Bidireccional, Persistente y Full-Duplex</td><td>Texto / Binario</td><td>Muy Baja (TCP persistente)</td><td>Sistemas en tiempo real como chats, notificaciones push, feeds financieros o tableros colaborativos (ej. SignalR).</td></tr><tr><td><strong>gRPC</strong></td><td>Llamada a Procedimientos Remotos (RPC)</td><td>Protocol Buffers (Binario)</td><td>Baja-Extrema (HTTP/2 nativo)</td><td>Comunicación de alto rendimiento máquina a máquina (m2m) dentro de arquitecturas de microservicios.</td></tr></tbody></table><h3>Análisis de Latencia y Eficiencia</h3><p>La elección del protocolo afecta directamente el rendimiento y el ancho de banda del sistema. Mientras que REST y GraphQL dependen de serializar y deserializar cadenas JSON textuales con metadatos repetitivos, <strong>gRPC</strong> minimiza la latencia de red al empaquetar los datos de forma binaria extremadamente compacta a través de <strong>Protocol Buffers</strong> y aprovechar multiplexación de conexiones de <strong>HTTP/2</strong>. Por su parte, <strong>WebSockets</strong> elimina la sobrecarga de los encabezados de las peticiones HTTP repetitivas al mantener una única conexión TCP activa y abierta.</p>`,
    },
    {
      title:
        "Lección 4: Patrones Arquitectónicos: De Monolito a Microservicios",
      content: `<h2>Lección 4: Patrones Arquitectónicos: De Monolito a Microservicios</h2><p>La transición hacia arquitecturas distribuidas requiere una base de diseño de software limpia y estructurada para evitar la creación de un 'monolito distribuido'.</p><h3>Monolito Modular</h3><p>Antes de pasar directamente a microservicios, se recomienda reestructurar la base de código monolítica actual en módulos altamente cohesivos y con bajo acoplamiento que compartan un proceso único pero que definan fronteras lógicas claras. Esto simplifica una futura extracción de servicios y permite diagnosticar dependencias de manera segura.</p><h3>Arquitectura Hexagonal (Puertos y Adaptadores)</h3><p>Este patrón de arquitectura promueve que la lógica de negocio central (el dominio) sea el centro del software y no dependa de implementaciones técnicas externas de bajo nivel (como bases de datos, APIs de terceros o interfaces de usuario). El flujo de dependencias se invierte:</p><ul><li><strong>El Dominio:</strong> Es puro, encapsula reglas de negocio y define las abstracciones de comunicación llamadas <strong>Puertos</strong> (interfaces).</li><li><strong>Puertos:</strong> Abstracciones en el dominio que definen cómo el mundo exterior interactúa con el dominio (puertos de entrada) y cómo el dominio se comunica con la infraestructura (puertos de salida).</li><li><strong>Adaptadores:</strong> Componentes de infraestructura que interactúan con el dominio implementando un puerto específico. Los adaptadores se dividen en:</li><ul><li><em>Adaptadores Primarios (de entrada):</em> Conducen la aplicación. Son los puntos de acceso como controladores de API REST, disparadores de AWS Lambda o interfaces de línea de comandos.</li><li><em>Adaptadores Secundarios (de salida):</em> Son conducidos por la aplicación. Abstraen el acceso a infraestructura de base de datos (ej. clientes de Amazon DynamoDB, SQL), mensajería, o clientes HTTP de terceros.</li></ul></ul><h3>Domain-Driven Design (DDD) - Diseño Táctico</h3><p>DDD ayuda a descomponer sistemas complejos de negocio mediante modelado conceptual en los siguientes bloques tácticos:</p><ul><li><strong>Entidades:</strong> Objetos con identidad única persistente que los diferencia de otros, con un ciclo de vida propio (ej. un Cliente con id único).</li><li><strong>Objetos de Valor (Value Objects):</strong> Objetos sin identidad propia definidos exclusivamente por sus atributos. Son inmutables (ej. un Dirección o un Color RGB).</li><li><strong>Agregados:</strong> Un grupo de entidades y objetos de valor que se tratan como una unidad cohesiva. La lógica y modificaciones internas se gestionan a través de una única raíz, la 'Raíz de Agregado'.</li><li><strong>Servicios de Dominio:</strong> Encapsulan lógica de negocio pura que no puede atribuirse lógicamente a una sola entidad u objeto de valor.</li><li><strong>Repositorios:</strong> Abstracciones que encapsulan la persistencia y recuperación de agregados en el almacén de datos.</li><li><strong>Factorías:</strong> Patrones de diseño para encapsular lógica compleja de creación de agregados consistentes.</li><li><strong>Eventos de Dominio:</strong> Notificaciones que representan un cambio relevante ocurrido en el dominio (ej. 'PedidoRealizado') y permiten desacoplar procesos interesados de forma asíncrona.</li></ul><h3>Capas Organizacionales</h3><p>Se estructura el software en capas con responsabilidades independientes:</p><ol><li><strong>Capa de Dominio:</strong> Núcleo de lógica pura independiente de la tecnología.</li><li><strong>Capa de Aplicación:</strong> Coordina los flujos, servicios de aplicación y orquesta objetos de dominio sin contener lógica de negocio.</li><li><strong>Capa de Infraestructura:</strong> Implementa aspectos tecnológicos (persistencia, mensajería de bajo nivel).</li><li><strong>Capa de Presentación:</strong> Interfaz expuesta (controladores de API REST, vistas).</li></ol>`,
    },
    {
      title: "Lección 5: Resiliencia y Escalabilidad Backend",
      content: `<h2>Lección 5: Resiliencia y Escalabilidad Backend</h2><p>Las arquitecturas backend profesionales deben diseñarse bajo la asunción de que 'todo lo que puede fallar, eventualmente fallará'. Mantener sistemas estables y escalables requiere estrategias de control de fallos.</p><h3>Rate Limiting</h3><p>Mecanismo que limita el número de peticiones permitidas por usuario o IP en una ventana de tiempo para prevenir ataques de denegación de servicio (DoS) o agotamiento de recursos. Se utilizan encabezados HTTP para notificar al cliente:</p><ul><li><code>X-RateLimit-Limit</code>: Número de peticiones permitidas por ventana.</li><li><code>X-RateLimit-Remaining</code>: Peticiones restantes en la ventana actual.</li><li><code>Retry-After</code>: Segundos que debe esperar el cliente antes de reintentar una llamada si recibe un código de estado 429.</li></ul><h3>Circuit Breaker</h3><p>Patrón de resiliencia que detecta fallos reiterados en un servicio externo y detiene las llamadas a este de forma temporal abriendo el circuito. Esto evita la acumulación de hilos en espera y fallos en cadena que consuman los recursos del servidor local. Permite transicionar de un estado Abierto (no pasa tráfico, retorna error fallback inmediato) a Semi-Abierto (comprobación controlada) y finalmente Cerrado (operación normal). Implementado con librerías como <em>resilience4j</em> o <em>opossum</em>.</p><h3>Colas de Mensajes (RabbitMQ / Kafka)</h3><p>La mensajería asíncrona permite desacoplar componentes y asegurar la entrega de mensajes transaccionales. Ante fallos de procesamiento, los mensajes inviables se redirigen automáticamente a una <strong>Dead Letter Queue (DLQ)</strong> para evitar la pérdida de datos y permitir análisis manuales posteriores. Esto facilita patrones distribuidos de consistencia eventual como Saga u Outbox.</p><h3>Balanceadores de Carga</h3><p>Componentes del sistema en capas que distribuyen el tráfico de red de forma equitativa entre múltiples réplicas del servicio backend, permitiendo la escalabilidad horizontal y evitando cuellos de botella en servidores únicos.</p><h3>Idempotencia</h3><p>Garantiza que realizar la misma petición HTTP varias veces producirá el mismo resultado en el servidor que la primera ejecución. Mientras que los métodos HTTP GET, PUT y DELETE son intrínsecamente idempotentes por estándar, las solicitudes de creación POST deben diseñarse explícitamente para soportar idempotencia (ej. utilizando claves únicas de idempotencia provistas por el cliente o controlando operaciones duplicadas en el backend) para evitar duplicados accidentales durante reintentos automáticos de red.</p>`,
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
      content: `<h2>Lección 1: Modelado Relacional y Normalización</h2><p>El diseño de una base de datos relacional robusta comienza con la comprensión de su estructura lógica, definida como el <strong>esquema de la base de datos</strong>. Este esquema actúa como el marco arquitectónico que define las tablas, columnas, relaciones y restricciones que configuran la integridad de los datos.</p><h3>1. Componentes Clave del Esquema Relacional</h3><ul><li><strong>Tablas (Relaciones):</strong> Son las estructuras bidimensionales básicas que almacenan registros (filas) compuestos por atributos lógicos (columnas).</li><li><strong>Columnas (Campos o Atributos):</strong> Definen el tipo específico de datos que se puede almacenar en una sección determinada de la tabla (por ejemplo, identificadores, estados, marcas de tiempo o textos).</li><li><strong>Restricciones (Constraints):</strong> Reglas que se aplican a nivel de columna o tabla para garantizar la precisión y confiabilidad de los datos.</li></ul><h3>2. Claves y Restricciones de Integridad</h3><p>Las restricciones de integridad aseguran que las aplicaciones interactúen de manera consistente con la base de datos:</p><ul><li><strong>Clave Primaria (Primary Key):</strong> Es una columna o conjunto de columnas que identifica de manera única y sin ambigüedad cada registro de una tabla.</li><li><strong>Clave Foránea (Foreign Key):</strong> Garantiza el mapeo relacional correcto entre distintas tablas. Enlaza un registro de una tabla con la clave primaria de otra, impidiendo que existan huérfanos y asegurando la integridad referencial.</li></ul><h3>3. Tipos de Relaciones</h3><p>En el modelado relacional, las tablas se interconectan según condiciones del negocio:</p><ul><li><strong>Relación Uno a Uno (1:1):</strong> Un registro de la Tabla A se asocia con un único registro de la Tabla B. Se suele usar para particionar tablas por motivos de seguridad o rendimiento.</li><li><strong>Relación Uno a Muchos (1:N):</strong> Un registro en la Tabla A puede estar enlazado con múltiples registros en la Tabla B (por ejemplo, un cliente con varios pedidos), pero cada pedido pertenece a un solo cliente.</li><li><strong>Relación Muchos a Muchos (N:M):</strong> Múltiples registros de la Tabla A se asocian con múltiples registros de la Tabla B. Para implementarse a nivel físico, requiere una tabla intermedia (tabla de unión) que contenga claves foráneas apuntando a ambas tablas primarias.</li></ul><h3>4. El Proceso de Normalización (1NF, 2NF, 3NF)</h3><p>La normalización es la técnica de diseño lógico que reduce la redundancia de datos y elimina anomalías de actualización, inserción y borrado, estructurando los atributos de forma óptima:</p><blockquote><strong>Primera Forma Normal (1NF):</strong> Requiere que todos los atributos de una tabla contengan únicamente valores atómicos (indivisibles) y que no existan grupos repetitivos de columnas.<br/><br/><strong>Segunda Forma Normal (2NF):</strong> Debe cumplir con la 1NF y, además, garantizar que todos los atributos que no forman parte de la clave primaria dependan completamente de toda la clave primaria, eliminando las dependencias parciales.<br/><br/><strong>Tercera Forma Normal (3NF):</strong> Debe cumplir con la 2NF y exigir que ningún atributo no clave dependa transitivamente de la clave primaria (es decir, los atributos no clave deben depender únicamente de la clave primaria, y no de otros campos no clave).</blockquote><p>En la práctica de ingeniería de datos, antes de realizar cualquier migración de esquemas o alteración de base de datos, es una buena práctica fundamental realizar un inventario completo de las tablas, campos, relaciones y dependencias. Esto permite mitigar riesgos de duplicación de datos o corrupción de registros debido a inconsistencias lógicas en el origen.</p>`,
    },
    {
      title: "Lección 2: Propiedades ACID y Manejo de Transacciones",
      content: `<h2>Lección 2: Propiedades ACID y Manejo de Transacciones</h2><p>En los sistemas de bases de datos relacionales, una <strong>transacción</strong> es una unidad lógica de trabajo que debe garantizar consistencia absoluta incluso en presencia de fallas de hardware, caídas del sistema o accesos concurrentes de múltiples usuarios.</p><h3>1. Las Propiedades ACID</h3><p>El acrónimo ACID define las cuatro características indispensables que garantizan la consistencia de las transacciones:</p><ul><li><strong>Atomicidad (Atomicity):</strong> Garantiza que la transacción se ejecute bajo el principio de todo o nada; es decir, o bien se completan todas las operaciones con éxito, o bien la base de datos se revierte al estado inicial en caso de falla.</li><li><strong>Consistencia (Consistency):</strong> Asegura que una transacción mueva la base de datos de un estado válido a otro, manteniendo intactos todos los invariantes y reglas de integridad de los datos.</li><li><strong>Aislamiento (Isolation):</strong> Especifica cómo y cuándo los cambios realizados por una transacción concurrentemente en ejecución se vuelven visibles para otras sesiones. El aislamiento evita anomalías de concurrencia concurrentes.</li><li><strong>Durabilidad (Durability):</strong> Garantiza que una vez que la transacción ha sido confirmada (committed), los cambios persistan en almacenamiento no volátil incluso ante fallas catastróficas inmediatas del sistema.</li></ul><h3>2. Niveles de Aislamiento y Control de Concurrencia</h3><p>El estándar ANSI/ISO SQL define cuatro niveles de aislamiento basados en bloqueos concurrentes, ordenados de menor a mayor protección frente a anomalías:</p><ul><li><strong>Read Uncommitted (Lectura no comprometida):</strong> Permite leer modificaciones no confirmadas por otras transacciones, exponiéndose al fenómeno de <em>lecturas sucias (dirty reads)</em>.</li><li><strong>Read Committed (Lectura comprometida):</strong> Es el nivel de aislamiento predeterminado en muchos motores relacionales modernos. Evita las lecturas sucias asegurando que solo se lean datos confirmados. Sin embargo, permite el fenómeno de <em>lecturas no repetibles (non-repeatable reads)</em>.</li><li><strong>Repeatable Read (Lectura repetible):</strong> Evita lecturas sucias y lecturas no repetibles manteniendo bloqueos compartidos de lectura a largo plazo. No obstante, puede sufrir de <em>lecturas fantasma (phantom reads)</em>.</li><li><strong>Serializable (Serializable):</strong> Es el aislamiento más estricto. Evita todas las anomalías de concurrencia anteriores (incluyendo lecturas fantasma) forzando una ejecución lógicamente equivalente a un orden puramente secuencial de las transacciones.</li></ul><h3>3. El Paradigma Salt: Coexistencia entre ACID y BASE</h3><p>En bases de datos distribuidas, el costo de mantener un aislamiento ACID serializable estricto a través de protocolos de compromiso distribuido (como el Two-Phase Commit o 2PC) puede ser prohibitivo, degradando drásticamente el rendimiento y la disponibilidad.</p><p>Para solucionar esto, tecnologías híbridas como <strong>Salt</strong> permiten la coexistencia controlada de transacciones ACID y BASE:</p><ul><li>Introduce la abstracción de <strong>transacciones BASE (BASE transactions)</strong> que desacoplan la atomicidad del aislamiento estricto.</li><li>Las transacciones BASE se dividen internamente en <strong>subtransacciones alcalinas (alkaline subtransactions)</strong>, que suelen ser locales a cada partición física para evitar la sobrecarga del 2PC distribuido.</li><li>A través de <strong>Salt Isolation</strong> y cerraduras específicas (bloqueos ACID, alcalinos y salinos), el sistema permite que las transacciones BASE expongan sus estados intermedios solo a otras transacciones BASE, mientras que los aísla de forma opaca y perfecta de las transacciones ACID convencionales.</li></ul>`,
    },
    {
      title: "Lección 3: Optimización y Estrategia de Índices en SQL",
      content: `<h2>Lección 3: Optimización y Estrategia de Índices en SQL</h2><p>Un <strong>índice</strong> es una estructura física en disco o memoria que acelera de manera significativa la velocidad de recuperación de registros de una tabla. Diseñar una estrategia de indexación correcta es un balance delicado: la subindexación ralentiza las consultas críticas, mientras que la sobreindexación degrada el rendimiento de operaciones DML (INSERT, UPDATE, DELETE) e infla el almacenamiento y el uso de memoria.</p><h3>1. Estructura B-Tree (B+ Tree)</h3><p>En el almacenamiento tradicional por filas (rowstore), los índices se organizan físicamente como árboles B+. Esta estructura consta de:</p><ul><li><strong>Nodo Raíz (Root Node):</strong> El punto de entrada principal para buscar cualquier valor de clave.</li><li><strong>Nodos Intermedios (Intermediate Levels):</strong> Actúan como ramas de direccionamiento lógico.</li><li><strong>Nodos Hoja (Leaf Nodes):</strong> Contienen los valores de clave del índice. En un <strong>índice agrupado (clustered index)</strong>, los nodos hoja contienen directamente las páginas de datos físicos de la tabla. En un <strong>índice no agrupado (nonclustered index)</strong>, los nodos hoja contienen punteros de localización de fila (como un ID de fila RID en montones, o la clave agrupada).</li></ul><h3>2. Índices Hash (In-Memory)</h3><p>Diseñados exclusivamente para tablas optimizadas en memoria (In-Memory OLTP), consisten en un arreglo de punteros denominados contenedores de hash (hash buckets). Son altamente eficientes con un rendimiento óptimo para búsquedas basadas en igualdad exacta. Sin embargo, pierden su eficacia en búsquedas de rango o filtros de desigualdad, donde se degradan a un escaneo completo de la tabla. Su cantidad de contenedores (bucket count) debe configurarse típicamente entre 1 y 2 veces la cantidad de valores distintos de la clave.</p><h3>3. Índices Filtrados (Filtered Indexes)</h3><p>Es un índice no agrupado optimizado que utiliza una cláusula condicional (por ejemplo, <code>WHERE EndDate IS NOT NULL</code>) para indexar únicamente un subconjunto de filas de la tabla. Esto ofrece enormes ventajas de rendimiento, reduciendo drásticamente los requisitos de almacenamiento en disco y el costo de actualización del índice durante modificaciones de datos.</p><h3>4. Índices de Almacén de Columnas (Columnstore)</h3><p>En lugar de organizar los datos por filas relacionales, el almacén de columnas almacena físicamente la información agrupada por columnas. Divide las filas en unidades llamadas <strong>grupos de filas (row groups)</strong> y las comprime individualmente por cada columna en <strong>segmentos de columna (column segments)</strong>. Esto permite escanear grandes volúmenes de datos analíticos a alta velocidad descomprimiendo únicamente las columnas solicitadas.</p><h3>5. Análisis con EXPLAIN y Predicados SARGable</h3><p>Para optimizar consultas complejas en SQL, los desarrolladores utilizan los planes de ejecución lógicos que provee la base de datos (como <code>EXPLAIN</code> en MySQL, o <code>EXPLAIN ANALYZE</code> en PostgreSQL) para identificar escaneos secuenciales lentos frente a búsquedas indexadas directas (Index Seek).</p><p>Para que el motor de base de datos pueda aprovechar un índice de manera óptima, las condiciones de filtrado en el <code>WHERE</code> deben ser predicados <strong>SARGable</strong> (Search ARGumentable):</p><ul><li>Se deben colocar las columnas indexadas primero en el orden de clave compuesto antes de aplicar ordenamientos o agrupamientos.</li><li>Se debe evitar aplicar funciones matemáticas o conversiones implícitas de tipo de datos sobre el lado izquierdo del operador en el predicado, lo cual anula el uso de búsquedas directas en el índice.</li></ul>`,
    },
    {
      title: "Lección 4: Ecosistema NoSQL y Modelos de Datos",
      content: `<h2>Lección 4: Ecosistema NoSQL y Modelos de Datos</h2><p>A diferencia de las bases de datos relacionales tradicionales, el ecosistema NoSQL (Not Only SQL) prescinde del esquema estricto y de las uniones costosas a nivel de disco, permitiendo escalar de forma horizontal sobre grandes clústeres distribuidos.</p><h3>1. Modelos de Datos NoSQL</h3><ul><li><strong>Documentales (por ejemplo, MongoDB):</strong> Almacenan los registros lógicos en estructuras de documentos semiformales (por lo general representados en JSON o BSON), permitiendo que cada registro evolucione su esquema de forma dinámica.</li><li><strong>Clave-Valor (por ejemplo, Redis):</strong> Un modelo simple y de ultra-bajo retardo que mapea claves únicas a valores específicos.</li><li><strong>Columnar (por ejemplo, Cassandra):</strong> Organiza físicamente los datos orientados a familias de columnas optimizando lecturas masivas agregadas.</li><li><strong>Grafos:</strong> Enfocado en modelar relaciones altamente conectadas mediante nodos, bordes y propiedades directamente vinculados.</li></ul><h3>2. Redis como Data Structure Store en Memoria</h3><p>Redis es un almacén de estructuras de datos NoSQL en memoria altamente optimizado que se utiliza frecuentemente como base de datos primaria de alto rendimiento, caché distribuido y bróker de mensajería asíncrona. Permite un rendimiento superior con tasas de rendimiento superiores a 1.5 millones de operaciones por segundo a latencias sub-milisegundo. Sus estructuras nativas altamente optimizadas incluyen:</p><ul><li><strong>Strings:</strong> Cadenas simples de bytes en memoria.</li><li><strong>Hashes:</strong> Ideales para la gestión de sesiones de usuario persistentes, almacenando mapas internos de clave-valor sobre un único User ID sin requerir la sobrecarga de leer o escribir todo el registro.</li><li><strong>Lists:</strong> Listas ordenadas útiles para gestionar colas de trabajo FIFO/LIFO de ejecución asíncrona.</li><li><strong>Sets y Sorted Sets:</strong> Conjuntos únicos autoordenados mediante puntuaciones en tiempo real (por ejemplo, leaderboards de videojuegos).</li></ul><h3>3. El Teorema CAP</h3><p>En un sistema de datos distribuido, el <strong>Teorema CAP</strong> (Consistencia, Disponibilidad, Tolerancia a Particiones) estipula de forma matemática que es imposible garantizar simultáneamente las tres propiedades en caso de una partición de red (falla de comunicación física entre nodos):</p><ul><li><strong>Consistencia (Consistency):</strong> Todos los nodos leen los mismos datos en el mismo instante.</li><li><strong>Disponibilidad (Availability):</strong> Toda petición no fallida de un nodo recibe una respuesta válida sin garantía de que contenga la información más reciente.</li><li><strong>Tolerancia al Particionado (Partition Tolerance):</strong> El sistema distribuido sigue funcionando a pesar de pérdidas de comunicación entre nodos individuales.</li></ul><p>Debido a que la tolerancia a particiones (P) es obligatoria en el internet físico, las bases de datos deben elegir entre consistencia estricta (sistemas CP de tipo ACID que bloquean recursos) o disponibilidad masiva con consistencia eventual (sistemas AP de tipo BASE). Redis Enterprise, por ejemplo, utiliza arquitecturas Activas-Activas con Tipos de Datos Replicados Libres de Conflicto (CRDTs) para sincronizar clústeres distribuidos globalmente a latencia local, logrando una disponibilidad de 99.999% al resolver conflictos lógicos de forma automática.</p>`,
    },
    {
      title: "Lección 5: Estrategias de Caché y Persistencia Local",
      content: `<h2>Lección 5: Estrategias de Caché y Persistencia Local</h2><p>La implementación de un nivel de caché distribuido en memoria como Redis permite aliviar el cuello de botella número uno en aplicaciones de alta escala: la saturación y latencia de conexión hacia la base de datos relacional persistente.</p><h3>1. Patrones de Diseño de Caché</h3><p>Existen tres patrones de indexación y sincronización de caché fundamentales en sistemas de alto rendimiento:</p><ul><li><strong>Cache-Aside (Lazy Loading):</strong> La aplicación intenta leer primero del caché. Si ocurre un acierto (cache hit), retorna los datos inmediatamente. Si ocurre un fallo de caché (cache miss), la aplicación consulta la base de datos, retorna la respuesta al usuario y de forma asíncrona escribe la copia del registro en el caché para futuras peticiones.</li><li><strong>Write-Through:</strong> La aplicación actualiza primero el caché y este escribe inmediatamente de forma síncrona en la base de datos antes de confirmar el éxito de la transacción. Garantiza consistencia absoluta de lectura y escritura inmediata, pero introduce penalización de latencia en escrituras.</li><li><strong>Write-Behind (Write-Back):</strong> Las modificaciones de datos se realizan directamente en el caché de forma instantánea. Luego, un bróker de colas en segundo plano escribe las actualizaciones de forma asíncrona en la base de datos persistente. Optimiza al extremo el rendimiento de escritura de la aplicación, pero introduce el riesgo de pérdida temporal de datos en memoria si la caché colapsa antes de vaciar las colas asíncronas.</li></ul><h3>2. Invalidación de Caché</h3><p>Mantener la coherencia de datos entre la base de datos origen y el caché es crucial. Las técnicas principales incluyen la definición de tiempos de vida para las claves (TTL - Time to Live) o estrategias programáticas que expulsan activamente los registros del caché durante escrituras directas sobre la base de datos relacional persistente.</p><h3>3. SQLite Embebido y Persistencia Local</h3><p>En el extremo opuesto del caché distribuido central se encuentra el uso de motores de persistencia embebidos como <strong>SQLite</strong>. SQLite permite almacenar un motor SQL completo de forma local dentro del propio proceso de la aplicación cliente (por ejemplo, dispositivos móviles o microservicios aislados), ofreciendo persistencia y consultas relacionales sin requerir la sobrecarga de conexiones de red a un DBMS central.</p><p>Esto se complementa con la durabilidad selectiva en motores de memoria como Redis, que permite alternar desde almacenamiento completamente efímero en memoria RAM hasta persistencia en disco de alta confiabilidad mediante archivos de solo adición Append-Only File (AOF) o instantáneas periódicas (snapshots), logrando el equilibrio óptimo entre velocidad extrema de consulta y seguridad de datos lógicos persistentes.</p>`,
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
      content: `<h2>Lección 1: Git Avanzado y Flujos de Colaboración</h2><p>En el desarrollo de software moderno y entornos DevOps, el control de versiones robusto con Git es la columna vertebral de la entrega continua. Dominar técnicas avanzadas de Git permite mantener un historial de cambios limpio, depurar errores de forma eficiente y colaborar sin fricciones.</p><h3>1. Rebase Interactivo (Interactive Rebase)</h3><p>El <strong>Rebase Interactivo</strong> (<code>git rebase -i HEAD~n</code>) es una herramienta clave para curar el historial de commits local antes de integrarlo a ramas compartidas. Permite reorganizar, renombrar y consolidar commits con precisión.</p><ul><li><strong>pick</strong>: Conserva el commit tal como está sin realizar modificaciones.</li><li><strong>squash</strong>: Combina los cambios de un commit con el commit anterior, permitiendo consolidar múltiples correcciones temporales en un único commit lógico.</li><li><strong>reword</strong>: Detiene la ejecución para permitir la edición del mensaje del commit, ideal para estandarizar mensajes según las políticas de commits convencionales (<em>conventional commits</em>).</li><li><strong>drop</strong>: Elimina por completo un commit del historial, útil para remover commits de depuración que no deben llegar al repositorio remoto.</li></ul><p><strong>Resolución de conflictos durante el rebase:</strong> Si surgen conflictos, Git detiene el proceso. Se deben editar los archivos en conflicto, marcarlos como resueltos ejecutando <code>git add .</code> (o el archivo específico) y continuar el rebase mediante <code>git rebase --continue</code>. Si se desea abortar y volver al estado original, se ejecuta <code>git rebase --abort</code>.</p><h3>2. Cherry-pick y Stash</h3><ul><li><strong>Cherry-pick</strong>: Permite aplicar un commit específico de una rama a la rama actual sin integrar toda la historia de la rama de origen (por ejemplo, para portar un hotfix urgente de una rama de desarrollo o de liberación a la rama principal).</li><li><strong>Stash</strong>: Permite almacenar de forma temporal las modificaciones locales de archivos rastreados para poder cambiar de contexto o de rama sin perder el trabajo en progreso. Los comandos principales son: <code>git stash</code> (guarda los cambios), <code>git stash list</code> (lista el orden de la pila de stashes), <code>git stash pop</code> (aplica el último stash y lo elimina de la pila) y <code>git stash drop</code> (descarta el stash superior de la pila).</li></ul><h3>3. Git Bisect y Git Reflog</h3><ul><li><strong>Git Bisect</strong>: Realiza una búsqueda binaria interactiva para identificar el commit exacto que introdujo una regresión o fallo en el código. Al mantener un historial lineal mediante rebase, el proceso de bisecado se acelera y se vuelve más predecible al eliminar la complejidad de los commits de fusión (<em>merge commits</em>).</li><li><strong>Git Reflog</strong>: Registra cada movimiento del HEAD local, incluyendo rebasados y reinicios. Es la red de seguridad de Git, permitiendo deshacer un rebase fallido al buscar la referencia previa en el reflog y restaurar el estado mediante <code>git reset --hard [commit]</code>.</li></ul><h3>4. Modelos de Ramificación: GitFlow vs. Trunk-Based Development</h3><p>Elegir la estrategia de ramificación adecuada alinea el desarrollo de software con las prácticas de despliegue continuo de la organización:</p><table><thead><tr><th>Criterio</th><th>GitFlow</th><th>Trunk-Based Development</th></tr></thead><tbody><tr><td><strong>Ramas principales</strong></td><td><code>master</code> (o <code>main</code>, historial oficial) y <code>develop</code> (integración).</td><td><code>main</code> (única fuente de verdad siempre lista para desplegar).</td></tr><tr><td><strong>Ramas de soporte</strong></td><td><code>feature/*</code>, <code>release/*</code>, <code>hotfix/*</code> y <code>bugfix/*</code>.</td><td>Ramas de características de vida extremadamente corta (1-2 días como máximo).</td></tr><tr><td><strong>Filosofía de integración</strong></td><td>Desarrollo aislado prolongado; fusiones programadas formales.</td><td>Commits pequeños y frecuentes integrados diariamente en la rama principal.</td></tr><tr><td><strong>Control de características</strong></td><td>Aislamiento físico en ramas de larga duración.</td><td>Uso de alternadores de funcionalidad (<em>feature toggles</em>) en el código.</td></tr><tr><td><strong>Ventajas</strong></td><td>Excelente para lanzamientos programados y fases formales de control de calidad (QA).</td><td>Minimiza conflictos de fusión grandes y habilita la entrega continua (CD) real.</td></tr><tr><td><strong>Desventajas</strong></td><td>Alta sobrecarga de gestión de ramas y propensión a conflictos complejos al fusionar.</td><td>Requiere pruebas automatizadas sofisticadas y alta disciplina de desarrollo.</td></tr></tbody></table><p><strong>Regla de oro de Rebase:</strong> Nunca apliques <code>git rebase</code> sobre commits que existan fuera de tu repositorio local o que hayan sido publicados en ramas remotas compartidas, ya que esto reescribe los hashes de commit y rompe las referencias de los demás desarrolladores.</p>`,
    },
    {
      title: "Lección 2: Comandos de Terminal Linux y Shell Scripting",
      content: `<h2>Lección 2: Comandos de Terminal Linux y Shell Scripting</h2><p>La terminal Linux es el entorno de trabajo natural para la automatización de procesos en DevOps. Un ingeniero DevOps debe dominar la navegación del sistema, la administración de permisos, el filtrado de datos y el scripting en Bash.</p><h3>1. Navegación de Archivos y Monitoreo del Sistema</h3><p>El primer paso en el diagnóstico y reconocimiento de un entorno Linux consiste en comprender el estado físico del sistema:</p><ul><li><code>df -h</code>: Verifica el uso general del disco en un formato legible para humanos.</li><li><code>du -sh *</code>: Muestra el espacio en disco que ocupa recursivamente cada carpeta y archivo dentro del directorio actual.</li><li><code>top</code> / <code>htop</code>: Monitorea en tiempo real los procesos que más recursos consumen (htop ofrece una interfaz interactiva más clara).</li><li><code>free -h</code>: Detalla la memoria física (RAM) y de intercambio (swap) usada y disponible.</li></ul><h3>2. Gestión de Permisos de Archivos</h3><p>Los permisos controlan el acceso seguro a los archivos de script y datos del sistema:</p><ul><li><code>chmod +x script.sh</code>: Otorga permisos de ejecución a un script para poder correrlo localmente como <code>./script.sh</code>.</li><li><code>chmod -R 755 [directorio]</code>: Cambia de manera recursiva los permisos de un directorio para permitir lectura/ejecución al público y escritura exclusiva al propietario (común en despliegues web).</li><li><code>chown user:group [archivo]</code>: Cambia la propiedad del propietario y del grupo del archivo o directorio especificado para mantener el principio de mínimo privilegio.</li></ul><h3>3. Redirecciones, Pipes y Procesamiento de Texto (grep, awk, sed)</h3><p>Las herramientas de filtrado permiten extraer información precisa de flujos de texto enormes o archivos de log:</p><ul><li><strong>Redirecciones (<code>&gt;</code>, <code>&gt;&gt;</code>) y Pipes (<code>|</code>)</strong>: Las redirecciones envían la salida a un archivo (creándolo o sobrescribiéndolo con <code>&gt;</code>, o añadiendo texto al final con <code>&gt;&gt;</code>). Un pipe (<code>|</code>) conecta directamente la salida estándar de un comando con la entrada estándar del siguiente.</li><li><strong>grep</strong>: Busca patrones de texto en archivos. Por ejemplo, se puede automatizar la búsqueda de errores en múltiples archivos ejecutando: <pre><code>for i in *.log; do grep "ERROR" $i; done</code></pre></li><li><strong>sed</strong>: Editor de flujo para filtrar y transformar texto de manera no interactiva. Permite el reemplazo directo dentro de archivos con el flag de edición in-place (<code>-i</code>), por ejemplo: <pre><code>sed -i 's/error/info/g' archivo.log</code></pre></li><li><strong>awk</strong>: Lenguaje de procesamiento diseñado para manipular datos basados en columnas. Permite extraer datos de rendimiento con precisión: <pre><code>free -m | awk 'NR==2{printf "%.2f%%", $3/$2 }'</code></pre></li></ul><h3>4. Variables de Entorno y Flujo en Bash</h3><p>Las variables de entorno almacenan configuraciones esenciales usadas por los procesos. En Shell Scripting, estructuramos variables (por ejemplo, rutas como <code>BACKUP_DIR="/backup"</code>) para construir scripts dinámicos y reutilizables.</p><p><strong>Bash vs. Dash:</strong> Es fundamental diferenciar que <strong>Bash</strong> (<em>Bourne Again Shell</em>) es el intérprete completo y predeterminado para scripts interactivos, compatible con estructuras ricas como arrays y funciones complejas. Por su parte, <strong>Dash</strong> (<em>Debian Almquist Shell</em>) es una versión más ligera y rápida que se utiliza comúnmente como <code>/bin/sh</code> durante el arranque del sistema. Al usar sintaxis de scripting avanzada exclusiva de Bash, siempre se debe declarar el shebang explícito: <code>#!/bin/bash</code> para evitar fallos de portabilidad en entornos POSIX puros.</p>`,
    },
    {
      title: "Lección 3: Contenerización con Docker",
      content: `<h2>Lección 3: Contenerización con Docker</h2><p>Docker revolucionó el desarrollo de software al proporcionar un estándar uniforme para empaquetar, distribuir y ejecutar aplicaciones en contenedores ligeros y aislados, eliminando por completo el clásico problema de 'funciona en mi máquina'.</p><h3>1. Arquitectura de Docker</h3><p>La arquitectura de Docker se compone del motor Docker (Docker Daemon) que gestiona el ciclo de vida de los contenedores mediante el aislamiento del sistema de archivos, las interfaces de red y el hardware del host. Una imagen de Docker representa una plantilla de solo lectura que consta de múltiples capas inmutables que se superponen entre sí para optimizar el almacenamiento.</p><h3>2. Dockerfiles Multi-stage Optimizados</h3><p>La técnica de <strong>despliegues multi-stage (multi-etapa)</strong> es la mejor práctica estándar para crear imágenes minimalistas y seguras para producción. Permite utilizar múltiples sentencias <code>FROM</code> en un único Dockerfile.</p><ul><li><strong>Principio de funcionamiento</strong>: Cada instrucción <code>FROM</code> inicia una nueva etapa de construcción independiente que puede usar diferentes imágenes base. Es posible compilar la aplicación utilizando todas las dependencias pesadas de construcción en una etapa inicial, y luego copiar exclusivamente los binarios compilados hacia una imagen final minimalista (como una imagen limpia, <code>alpine</code> o incluso <code>scratch</code>).</li><li><strong>Uso de alias</strong>: Nombrar las etapas mediante <code>FROM [imagen] AS [nombre_etapa]</code> permite referenciar etapas de compilación previas de forma clara mediante la directiva <code>COPY --from=[nombre_etapa]</code>, asegurando que las directivas no se rompan si se cambia el orden del archivo.</li><li><strong>Detención selectiva (target builds)</strong>: Al construir la imagen, es posible detener el proceso en una etapa intermedia específica mediante el flag target: <pre><code>docker build --target build -t app-debug .</code></pre> Esto es extremadamente útil para tareas de depuración local o flujos de pruebas automatizadas aisladas.</li><li><strong>BuildKit vs. Legacy Builder</strong>: El motor tradicional procesa de manera secuencial todas las etapas declaradas en el Dockerfile. El motor moderno <strong>BuildKit</strong> (activado con <code>DOCKER_BUILDKIT=1</code>) optimiza la compilación al analizar el árbol de dependencias, construyendo únicamente las etapas de las cuales depende el target seleccionado y saltándose las etapas redundantes para reducir los tiempos del pipeline.</li></ul><h3>3. Capas, Volúmenes y Redes</h3><ul><li><strong>Volúmenes y Bind Mounts</strong>: Docker proporciona mecanismos para persistir los datos de los contenedores. Los volúmenes son gestionados nativamente por Docker, mientras que los bind mounts montan un directorio específico del host dentro del contenedor.</li><li><strong>Redes aisladas</strong>: Permiten la comunicación segura entre contenedores a través de diferentes controladores de red (como <code>bridge</code> para contenedores locales, o <code>overlay</code> para clústeres swarm).</li><li><strong>Comandos esenciales de administración de ciclo de vida:</strong><ul><li><code>docker ps -a</code>: Muestra todos los contenedores en el sistema, activos o detenidos.</li><li><code>docker logs [container_id]</code>: Muestra los logs en tiempo real del contenedor para facilitar el diagnóstico.</li><li><code>docker exec -it [container_id] bash</code>: Abre una terminal interactiva dentro del contenedor en ejecución.</li><li><code>docker stats</code>: Muestra estadísticas de uso de CPU, memoria y ancho de banda por contenedor.</li></ul></li></ul>`,
    },
    {
      title: "Lección 4: Orquestación Local con Docker Compose",
      content: `<h2>Lección 4: Orquestación Local con Docker Compose</h2><p>Para aplicaciones modernas estructuradas como microservicios, ejecutar contenedores individuales de forma aislada no es práctico. Docker Compose simplifica la definición y gestión de arquitecturas multi-contenedor en entornos locales de desarrollo mediante archivos de configuración declarativos en formato YAML.</p><h3>1. Definición de Servicios Multi-Contenedor</h3><p>A través de un archivo <code>docker-compose.yml</code>, se define el ciclo de vida completo de múltiples servicios relacionados (como un servidor web, una base de datos y un sistema de caché) para que puedan ser inicializados de forma sincronizada con un solo comando: <code>docker-compose up -d</code> (ejecuta el entorno en segundo plano, liberando la terminal).</p><h3>2. Gestión de Dependencias y Orden de Arranque</h3><p>Los contenedores en Compose pueden requerir que otros servicios estén inicializados antes de arrancar. Mediante la directiva <code>depends_on</code> se puede definir el orden jerárquico de inicialización de los contenedores (por ejemplo, asegurar que la base de datos se levante antes que la API de la aplicación).</p><h3>3. Variables de Entorno y Archivos .env</h3><p>Docker Compose admite una sólida gestión de variables de entorno para evitar escribir configuraciones sensibles en duro dentro de los archivos de repositorio:</p><ul><li><strong>Interpolación de variables</strong>: Permite inyectar dinámicamente valores del sistema o de archivos de entorno dentro de la configuración del servicio (por ejemplo, <code>\${DB_PASSWORD}</code>).</li><li><strong>Uso de archivos de configuración (.env)</strong>: Centraliza la configuración en archivos específicos por entorno que Compose lee automáticamente al inicializar la infraestructura local.</li></ul><h3>4. Redes Aisladas de Desarrollo</h3><p>De manera predeterminada, Docker Compose crea una red virtual de tipo <code>bridge</code> dedicada exclusivamente a la aplicación al momento de arrancar. Todos los servicios definidos en el archivo YAML se unen automáticamente a esta red, lo que les permite comunicarse entre sí de forma aislada y segura utilizando únicamente el nombre del servicio como dirección DNS interna (por ejemplo, la API puede conectarse al servicio de base de datos usando la URL <code>mongodb://db:27017</code>).</p>`,
    },
    {
      title: "Lección 5: Fundamentos de CI/CD y Despliegue",
      content: `<h2>Lección 5: Fundamentos de CI/CD y Despliegue</h2><p>Los pipelines de Integración Continua y Despliegue Continuo (CI/CD) automatizan el ciclo de entrega de código, reduciendo la intervención manual, acelerando el tiempo de llegada al mercado (time-to-market) y garantizando la estabilidad operativa mediante pruebas y despliegues estandarizados.</p><h3>1. Pipelines Automatizados: Construcción, Pruebas y Despliegue</h3><p>Un pipeline robusto divide las tareas de entrega en etapas (stages) secuenciales:</p><ol><li><strong>Build (Construcción)</strong>: Ingesta el código fuente, descarga dependencias, compila binarios y genera los artefactos desplegables o imágenes Docker de producción.</li><li><strong>Test (Pruebas)</strong>: Corre análisis de calidad de código estático (linters) y ejecuta suites de pruebas unitarias, de integración y de seguridad automáticas para validar que los cambios no introduzcan regresiones.</li><li><strong>Deploy (Despliegue)</strong>: Propaga el artefacto aprobado hacia los entornos de ejecución (staging, pre-producción o producción). El flujo se automatiza mediante scripts robustos que realizan la actualización del código (por ejemplo, <code>git pull</code>), ejecutan compilaciones ligeras en destino y reinician los servicios de forma limpia: <pre><code>git pull origin main &amp;&amp; npm run build &amp;&amp; systemctl restart myapp.service</code></pre></li></ol><h3>2. Gestión Segura de Secretos</h3><p>La seguridad y cumplimiento normativo de la infraestructura exigen una estricta política de custodia de credenciales. <strong>Nunca se deben subir contraseñas, llaves SSH, tokens de API o certificados de seguridad en duro a un sistema de control de versiones.</strong></p><ul><li><strong>Mecanismos de inyección</strong>: Los secretos deben ser inyectados dinámicamente como variables de entorno seguras durante el tiempo de ejecución (utilizando las herramientas nativas de secretos de CI/CD como GitHub Actions Secrets, credenciales de orquestadores o secretos nativos de Docker).</li><li><strong>Variables de compilación vs. ejecución</strong>: Es crítico diferenciar entre secretos requeridos en la compilación (inyectados de forma controlada a través de secretos en BuildKit) y secretos de ejecución que se configuran dinámicamente al inicializar el contenedor en el entorno productivo.</li></ul><h3>3. Despliegues Zero-Downtime y Resiliencia</h3><p>Para mantener la disponibilidad continua de servicios críticos ante un flujo frecuente de actualizaciones, se implementan técnicas de despliegue progresivo que evitan caídas del sistema:</p><ul><li><strong>Despliegue progresivo (Rolling Updates)</strong>: Actualiza de forma gradual las instancias o contenedores de la aplicación. En lugar de detener todo el clúster, el orquestador actualiza las réplicas en pequeños lotes, manteniendo las versiones anteriores activas para procesar peticiones hasta que las nuevas réplicas pasen las pruebas de estado de salud.</li><li><strong>Comandos de reinicio seguro:</strong> En Kubernetes, por ejemplo, el comando <code>kubectl rollout restart deployment [nombre_deployment]</code> gatilla una actualización de réplicas controlada y progresiva. Para servicios locales de Docker Compose, el uso de scripts de monitoreo continuo (como scripts que levantan servicios y comprueban el puerto antes de redirigir el tráfico) mitiga el impacto de los reinicios.</li></ul>`,
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
      content: `<h2>Lección 1: Arquitectura de React Native y Expo</h2>
<p>La arquitectura moderna de React Native (conocida históricamente como la <strong>Nueva Arquitectura</strong>) representa una reescritura profunda de su núcleo en C++ para eliminar el intermediario asíncrono y serializado (el "Bridge" clásico) y ofrecer un acceso síncrono y directo con el entorno nativo de la plataforma.</p>

<h3>1. El motor de JavaScript Hermes</h3>
<p><strong>Hermes</strong> es el motor de JavaScript predeterminado y altamente optimizado para React Native. Su principal ventaja competitiva es que precompila el código JavaScript en un bytecode optimizado durante la fase de construcción en lugar de interpretarlo en tiempo de ejecución. Además, Hermes utiliza una técnica de <strong>mapeo de memoria (memory-mapping)</strong> para cargar dinámicamente solo las partes del bytecode necesarias directamente de la memoria RAM, lo que reduce sustancialmente el tiempo de inicio (startup time) y la huella de memoria (heap footprint), especialmente beneficioso en dispositivos móviles de gama baja.</p>

<h3>2. Sistema de renderizado Fabric</h3>
<p><strong>Fabric</strong> es el nuevo sistema de renderizado que interactúa de manera directa con los componentes de interfaz de usuario de la plataforma mediante la interfaz JSI (JavaScript Interface). Al no tener que enviar mensajes serializados JSON a través de un canal asíncrono, Fabric renderiza la UI de manera mucho más eficiente, reduciendo los tiempos de carga y garantizando transiciones y animaciones fluidas a 60 FPS.</p>

<h3>3. TurboModules y Codegen</h3>
<p>Los <strong>TurboModules</strong> gestionan el acceso seguro a las API nativas del dispositivo de forma perezosa (lazy-loading), cargándolas en memoria únicamente cuando el código de la aplicación lo requiere en lugar de cargarlas en la inicialización. Para interactuar con ellos, se emplea una especificación de tipos estática en TypeScript o Flow. El motor de <strong>Codegen</strong> de React Native analiza esta especificación para autogenerar interfaces nativas en C++, garantizando una total seguridad de tipos entre JavaScript y las capas nativas de Android e iOS.</p>

<h3>4. Ciclo de vida y diferencias críticas entre Android e iOS</h3>
<p>React Native mapea dinámicamente componentes abstractos de React (como <code>&lt;View&gt;</code>, <code>&lt;Text&gt;</code> y <code>&lt;Pressable&gt;</code>) a bloques de construcción nativos de cada sistema operativo (por ejemplo, <code>ViewGroup</code>, <code>TextView</code> e <code>ImageView</code> en Android, frente a <code>UIView</code>, <code>UITextView</code> e <code>UIImageView</code> en iOS). No obstante, el desarrollo nativo subyacente difiere en varios aspectos estructurales clave:</p>
<ul>
  <li><strong>Android:</strong> El almacenamiento persistente nativo se gestiona a través de <code>SharedPreferences</code>. El código nativo se escribe en Java o Kotlin, requiriendo la inicialización de módulos en <code>MainApplication.java</code>, y el proceso de Codegen se ejecuta de forma nativa a través de tareas Gradle (por ejemplo, <code>./gradlew generateCodegenArtifactsFromSchema</code>).</li>
  <li><strong>iOS:</strong> El almacenamiento persistente nativo se gestiona mediante <code>NSUserDefaults</code>. Las integraciones se realizan en Objective-C, Objective-C++ o Swift, y las interfaces de Codegen se enlazan mediante el sistema de gestión de dependencias CocoaPods con <code>pod install</code>.</li>
</ul>`,
    },
    {
      title: "Lección 2: Estrategia Offline-First en Aplicaciones Móviles",
      content: `<h2>Lección 2: Estrategia Offline-First en Aplicaciones Móviles</h2>
<p>Una verdadera arquitectura <strong>offline-first</strong> (o local-first) asume que el dispositivo local es la fuente de verdad primaria durante la sesión de un usuario, no el servidor. Cada acción de escritura o lectura se realiza de inmediato sobre una base de datos local con latencia cero, delegando la consistencia e integridad de datos a un proceso de sincronización asíncrono en segundo plano.</p>

<h3>1. Rendimiento empírico de bases de datos locales en React Native</h3>
<p>De acuerdo con pruebas empíricas de rendimiento realizadas en simuladores iOS y emuladores Android (como el estudio del diccionario de colocalizaciones DeSKoll), el tiempo requerido para cargar y mostrar datos varía drásticamente según la base de datos seleccionada y el número de registros en disco:</p>

<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Volumen de Datos (Filas)</th>
      <th>SQLite (iOS / Android)</th>
      <th>AsyncStorage (iOS / Android)</th>
      <th>Realm (iOS / Android)</th>
      <th>TinyBase (iOS / Android)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>100 filas</strong></td>
      <td>36 ms / 40 ms</td>
      <td>3 ms / 5 ms</td>
      <td>1 ms / 1 ms</td>
      <td>23 ms / 28 ms</td>
    </tr>
    <tr>
      <td><strong>1,000 filas</strong></td>
      <td>55 ms / 62 ms</td>
      <td>6 ms / 8 ms</td>
      <td>4 ms / 5 ms</td>
      <td>102 ms / 113 ms</td>
    </tr>
    <tr>
      <td><strong>10,000 filas</strong></td>
      <td>68 ms / 103 ms</td>
      <td>18 ms / 17 ms</td>
      <td>46 ms / 50 ms</td>
      <td>352 ms / 384 ms</td>
    </tr>
    <tr>
      <td><strong>20,000 filas</strong></td>
      <td>88 ms / 148 ms</td>
      <td>86 ms / 143 ms</td>
      <td>84 ms / 86 ms</td>
      <td>380 ms / 434 ms</td>
    </tr>
    <tr>
      <td><strong>100,000 filas</strong></td>
      <td><strong>224 ms / 490 ms</strong></td>
      <td>437 ms / 621 ms</td>
      <td>466 ms / 578 ms</td>
      <td>3,364 ms / 3,526 ms</td>
    </tr>
  </tbody>
</table>

<p><strong>Análisis de resultados:</strong></p>
<ul>
  <li><strong>SQLite:</strong> Ofrece el comportamiento más estable y predecible. Aunque es más lento para volúmenes pequeños de datos debido a la sobrecarga inicial de inicialización, su crecimiento en tiempos de carga es uniforme y lineal, consolidándose como la única opción viable y escalable para bases de datos de más de 100,000 registros.</li>
  <li><strong>AsyncStorage:</strong> Es sumamente eficiente para configuraciones ligeras, tokens de sesión y pequeños pares clave-valor (menores de 10,000 filas). Sin embargo, carece de soporte relacional, no cifra los datos por defecto y sufre una pérdida severa de eficiencia y un crecimiento exponencial a partir de los 20,000 registros debido a la sobrecarga de serialización JSON.</li>
  <li><strong>Realm:</strong> Es una base de datos de objetos con formato de copia cero (zero-copy), resultando extremadamente rápida para conjuntos de datos pequeños (menos de 10,000 filas). No obstante, su rendimiento decae significativamente al escalar hacia los 100,000 registros y genera un aumento notable en el tamaño del bundle final de la aplicación.</li>
  <li><strong>TinyBase:</strong> Al funcionar principalmente como una base de datos reactiva en memoria, carece de optimizaciones eficientes para la persistencia masiva en disco. El estudio demuestra que muestra un degradamiento de rendimiento exponencial no apto para producción (más de 3.3 segundos para cargar 100,000 registros), por lo que se recomienda únicamente para la gestión de estado local reactivo en el runtime.</li>
  <li><strong>WatermelonDB:</strong> Es una base de datos relacional optimizada para offline-first, soporta flujos reactivos y consultas indexadas muy rápidas, pero tiene la desventaja de no ser compatible de forma directa con algunas herramientas modernas de empaquetado (como Vite) y utilizar propuestas heredadas de JS.</li>
</ul>

<h3>2. Sincronización asíncrona en segundo plano (Background Sync)</h3>
<p>El refresco de datos en background se puede estructurar con herramientas como <code>expo-background-task</code> o <code>expo-background-fetch</code>, comúnmente acopladas a motores de sincronización como PowerSync o PouchDB. Al implementar estas tareas, se deben cumplir rigurosas pautas arquitectónicas:</p>
<ul>
  <li><strong>Reutilización del objeto de conexión:</strong> Se debe reutilizar la instancia de base de datos o sistema global inicializado en el foreground para evitar múltiples conexiones simultáneas en SQLite, previniendo condiciones de carrera y bloqueos de escritura (SQLite database locks).</li>
  <li><strong>Adaptación headless:</strong> Como las tareas en segundo plano se ejecutan en un modo headless (sin acceso al runtime completo de JS de la UI), se debe sobrescribir la función de petición de red nativa por <code>expo-fetch</code> para asegurar la conectividad con el servidor.</li>
  <li><strong>Configuraciones en iOS:</strong> Requiere habilitar explícitamente los modos <code>processing</code> y <code>fetch</code> en el array <code>UIBackgroundModes</code> dentro del archivo <code>Info.plist</code> del proyecto Xcode, coordinando la ejecución mediante <code>BGTaskScheduler</code>.</li>
</ul>

<h3>3. Manejo de conectividad y resiliencia de datos</h3>
<p>La detección de red simple de navegador (como <code>navigator.onLine</code>) no es fiable en escenarios reales. Se debe combinar <code>@react-native-community/netinfo</code> para escuchar eventos del sistema operativo junto con pings periódicos de salud (health pings) hacia el endpoint real de sincronización. Cada transacción en offline debe encolarse localmente en una tabla de outbox (sync_queue). La lógica de reintentos requiere la implementación estricta de retroceso exponencial (exponential backoff) con un tope de tiempo para evitar tormentas de reintentos (retry storms) que saturen la red y el servidor al recuperar la conexión. Los modelos de datos deben incluir metadatos de sincronización como <code>lastSyncedAt</code>, un marcador booleano de borrado lógico (soft deletes con columna <code>deleted</code>) y usar UUIDs generados del lado del cliente como identificadores estables para evitar colisiones de ID durante la reconciliación.</p>`,
    },
    {
      title: "Lección 3: Arquitectura de Electron para Escritorio",
      content: `<h2>Lección 3: Arquitectura de Electron para Escritorio</h2>
<p>La arquitectura de una aplicación de escritorio basada en Electron se asienta firmemente sobre un modelo de múltiples procesos que desacopla la lógica del sistema operativo de la interfaz de usuario para maximizar la estabilidad y la seguridad.</p>

<h3>1. El Proceso Principal (Main Process)</h3>
<p>Iniciado a través del script especificado en el campo <code>main</code> de <code>package.json</code> (ej. <code>main.js</code> o <code>main.ts</code>), se ejecuta en un entorno completo de Node.js. Es el encargado de orquestar el ciclo de vida de la aplicación (eventos como <code>ready</code>, <code>window-all-closed</code>, <code>activate</code>), instanciar ventanas del navegador (<code>BrowserWindow</code>), registrar atajos de teclado globales y ejecutar operaciones con privilegios elevados como el acceso directo al sistema de archivos local y bases de datos SQLite nativas.</p>

<h3>2. Procesos de Renderizado (Renderer Process)</h3>
<p>Cada ventana o vista (<code>BrowserWindow</code> o <code>BrowserView</code>) corre en su propio proceso de renderizado independiente ejecutando un motor de Chromium. Su función principal es renderizar la UI web (construida con HTML, CSS, JavaScript y frameworks de frontend como React). Por motivos de seguridad críticos, los renderizadores están aislados y sandboxeados por defecto, lo que significa que no tienen acceso directo a las APIs de Node.js ni a los recursos nativos del sistema operativo, limitando el riesgo de que ataques XSS deriven en ejecución remota de código (RCE).</p>

<h3>3. Preload Scripts y Comunicación Segura vía contextBridge</h3>
<p>La frontera de comunicación segura entre ambos procesos se establece a través de los scripts de precarga (preload scripts) y el objeto <strong>contextBridge</strong>. Los scripts de precarga se ejecutan antes de que se cargue la página web del renderizador y tienen acceso limitado a las APIs de Node.js y al DOM. La única forma de exponer funcionalidades seguras y restringidas al renderizador es a través de <code>contextBridge.exposeInMainWorld</code>, evitando exponer de manera directa el módulo <code>ipcRenderer</code>.</p>

<p>Se deben estipular estrictas configuraciones de seguridad en las preferencias web de cada <code>BrowserWindow</code>:</p>
<pre><code>webPreferences: {
  preload: path.join(__dirname, '../preload/index.js'),
  contextIsolation: true,
  sandbox: true,
  nodeIntegration: false
}</code></pre>
<p><em>Nota histórica:</em> El aislamiento de contexto (contextIsolation) está habilitado por defecto desde Electron 12, mientras que el sandbox de renderizado es predeterminado a partir de Electron 20.</p>

<h3>4. Patrón IPC Seguro e Integración de Tipos</h3>
<p>Para la comunicación Inter-Procesos (IPC), se debe preferir el patrón bidireccional basado en Promesas <code>ipcRenderer.invoke()</code> (del lado del renderizador) e <code>ipcMain.handle()</code> (del lado del proceso principal) en lugar del patrón heredado asíncrono y propenso a fugas <code>send</code>/<code>on</code>. Las mejores prácticas de desarrollo dictan agrupar los canales IPC en módulos de comunicación tipados mediante interfaces TypeScript y sanitizar o validar rigurosamente todos los parámetros de entrada procedentes del renderizador (por ejemplo, con validadores como Zod) antes de realizar llamadas del sistema. Además, dado que Electron solo serializa el mensaje del error sobre la barrera IPC, se aconseja empaquetar las respuestas en un tipo estructurado como <code>{ success, data, error }</code> para preservar el contexto de error.</p>`,
    },
    {
      title:
        "Lección 4: Empaquetado, Actualizaciones y Rendimiento en Escritorio",
      content: `<h2>Lección 4: Empaquetado, Actualizaciones y Rendimiento en Escritorio</h2>
<p>Llevar una aplicación de Electron a producción requiere optimizar la entrega de actualizaciones, configurar la firma de código bajo los requisitos del sistema operativo y gestionar eficientemente la memoria RAM y los recursos nativos del entorno Node.js.</p>

<h3>1. Bundling y Estructura de Doble package.json</h3>
<p>El empaquetado y construcción multiplataforma (DMG/PKG en macOS, NSIS/MSI en Windows, AppImage/deb/rpm en Linux) se realiza eficientemente con herramientas de la comunidad como <code>electron-builder</code> o <code>Electron Forge</code>. Para optimizar el tamaño del paquete, se deben excluir de manera estricta todas las dependencias de desarrollo (devDependencies) en el build de producción.</p>
<p>Además, para gestionar correctamente los recursos locales nativos que requieren compilación binaria (como bases de datos u optimizadores de imágenes), se adopta el patrón de <strong>doble package.json</strong>. Bajo este diseño, el archivo package.json raíz gestiona los módulos de interfaz de usuario, cargadores de bundlers y herramientas de desarrollo. Por otro lado, un archivo secundario en <code>./app/package.json</code> declara únicamente las dependencias de Node.js y módulos nativos que correrán de forma exclusiva en el Main Process (tales como <code>sqlite3</code> o <code>sharp</code>). Estos binarios nativos deben ser recompilados contra las cabeceras de la versión exacta de Node de Electron mediante utilidades como <code>electron-rebuild</code> o <code>@electron/rebuild</code>. Al empaquetar, el bundle del frontend se compila hacia <code>./app/dist/</code>.</p>
<p><em>Nota técnica importante:</em> A partir de Node.js 22, el entorno incluye el módulo nativo integrado <code>node:sqlite</code>, el cual permite prescindir de módulos nativos de terceros y elimina la necesidad de pasos de recompilación para implementaciones SQL estándar.</p>

<h3>2. Firma de Código y Notarización Multiplataforma</h3>
<p>La firma de código es obligatoria en sistemas operativos modernos para garantizar la procedencia del ejecutable y evitar bloqueos de seguridad como Windows SmartScreen o Apple Gatekeeper. En macOS, las aplicaciones deben firmarse con certificados de desarrollador de Apple y ser sometidas al servicio de notarización de Apple mediante herramientas como <code>electron-notarize</code> incorporadas en los flujos de CI/CD. En Windows, se emplean certificados de Code Signing estándar o EV (Extended Validation), requiriendo un almacenamiento seguro de credenciales mediante secretos en pipelines de automatización (como GitHub Actions).</p>

<h3>3. Mecanismos de Auto-Updates con electron-updater</h3>
<p>La integración de actualizaciones seguras se realiza con la librería <code>electron-updater</code>, que consulta metadatos en segundo plano (ej. archivos yaml como <code>latest.yml</code>) sobre CDNs distribuidos globalmente, GitHub Releases o buckets de Amazon S3. Los flujos avanzados escuchan eventos del ciclo de vida como <code>update-available</code> y <code>update-downloaded</code> para mostrar diálogos interactivos al usuario y permitir la aplicación segura de la actualización (o actualizaciones incrementales "delta" mediante NSIS-web) tras reiniciar el software.</p>

<h3>4. Optimización de Memoria, Virtualización y Multiprocesamiento</h3>
<p>Debido a que cada <code>BrowserWindow</code> ejecuta una instancia completa del motor Chromium, el consumo de memoria RAM escala linealmente con cada ventana abierta. Para mitigar el consumo de recursos en aplicaciones SaaS complejas:</p>
<ul>
  <li><strong>Virtualización de listas:</strong> Se debe implementar renderizado virtual (windowing) con librerías como <code>react-window</code> o <code>react-virtualized</code> para limitar los nodos del DOM activos en pantalla al renderizar conjuntos masivos de datos.</li>
  <li><strong>Fugas de memoria:</strong> Es indispensable limpiar referencias a listeners de eventos globales, closures y suscripciones IPC durante el desmontaje de componentes en React, utilizando herramientas de DevTools como el analizador de Heap Snapshots para monitorizar el recolector de basura (Garbage Collection). El uso de React Strict Mode ayuda a identificar estas fugas de listeners en desarrollo.</li>
  <li><strong>Procesamiento en segundo plano:</strong> Las tareas de cálculo pesado (cifrado de datos, transacciones de sincronización complejas o transformaciones de archivos locales) nunca deben bloquear el hilo principal (Main Thread) ni el hilo del renderizador. Deben delegarse a <code>Worker Threads</code> de Node.js (lado del Main) o <code>Web Workers</code> estándar (lado del renderizador) para garantizar un rendimiento fluido y una UI reactiva a 60 FPS.</li>
</ul>`,
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
