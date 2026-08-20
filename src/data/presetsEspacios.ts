export interface PresetNota {
  title: string;
  content: string;
}

export interface PresetCuaderno {
  name: string;
  cover?: string;
  notes: PresetNota[];
}

export interface PresetEspacio {
  id: string;
  name: string;
  description: string;
  icon: string;
  notebooks: PresetCuaderno[];
}

export const PRESETS_ESPACIOS: PresetEspacio[] = [
  {
    id: "blank",
    name: "Estándar (Lienzo en blanco)",
    description: "Espacio vacío para organizar tus notas a tu manera.",
    icon: "Layers",
    notebooks: [
      {
        name: "General",
        notes: [
          {
            title: "Bienvenido a tu nuevo espacio",
            content: "<p>Comienza escribiendo aquí tus ideas...</p>",
          },
        ],
      },
    ],
  },
  {
    id: "biblico",
    name: "Estudios Bíblicos y Ministerio",
    description: "Devocionales, bosquejos, hermenéutica y plan de lectura.",
    icon: "BookOpen",
    notebooks: [
      {
        name: "Devocionales",
        notes: [
          {
            title: "Mi Devocional Diario",
            content:
              "<h3>Pasaje Clave:</h3><p></p><h3>Reflexión:</h3><p></p><h3>Oración:</h3><p></p>",
          },
        ],
      },
      {
        name: "Bosquejos y Predicaciones",
        notes: [
          {
            title:
              "Lección 1: Fundamentos de la Homilética y Anatomía del Mensaje",
            content: `<h2>Lección 1: Fundamentos de la Homilética y Anatomía del Mensaje</h2><p>La homilética es el arte y la ciencia de preparar y ordenar sermones religiosos para presentar las verdades evangélicas de un modo claro, lógico y persuasivo. Un sermón bíblico eficaz no debe ser una charla desordenada sin rumbo, sino un organismo bien estructurado que guíe el intelecto y mueva el corazón de los oyentes.</p><h3>Anatomía de un Sermón</h3><p>De acuerdo con la homilética práctica y el desarrollo contemporáneo, la estructura fundamental de un sermón se compone de los siguientes elementos clave:</p><ul><li><strong>Texto Bíblico:</strong> Es el fundamento y cimiento del mensaje. Aporta autoridad divina al sermón y asegura que la predicación esté arraigada en la Palabra de Dios.</li><li><strong>Título:</strong> Es la puerta de acceso al sermón. Debe ser breve, claro, sugerente e intrigante para despertar el interés de la congregación.</li><li><strong>Proposición o Tema:</strong> Es el sermón condensado en una sola frase clara y definida que resume la esencia del texto bíblico. Define con precisión de qué se va a hablar y evita divagar en ideas secundarias.</li><li><strong>Introducción:</strong> Su objetivo primordial es captar la atención de los oyentes y prepararlos para recibir el mensaje. Puede basarse en el contexto histórico del pasaje, un incidente personal verídico o un hecho de actualidad.</li><li><strong>Cuerpo del Mensaje (Puntos Principales):</strong> Son las divisiones principales (usualmente expresadas en números romanos I, II, III) que organizan los pensamientos de forma progresiva hacia un clímax. El cerebro retiene hasta un 70% más de información cuando existe una estructura clara.</li><li><strong>Ilustraciones:</strong> Actúan como las ventanas que permiten la entrada de luz en las mentes de la audiencia, facilitando la comprensión de ideas abstractas mediante analogías cotidianas.</li><li><strong>Conclusión:</strong> El punto culminante del sermón donde se recapitulan los puntos clave y se dirige el río de pensamientos de manera directa y firme hacia el corazón del oyente.</li><li><strong>Llamado:</strong> Una invitación directa que insta al oyente a tomar una decisión o compromiso espiritual concreto en reacción al mensaje predicado.</li></ul>`,
          },
          {
            title: "Lección 2: El Método PEICA para la Preparación Homilética",
            content: `<h2>Lección 2: El Método PEICA para la Preparación Homilética</h2><p>El método <strong>PEICA</strong> es una herramienta poderosa que integra la disciplina del estudio bíblico tradicional con metodologías de estructuración lógica para asegurar un mensaje coherente, pedagógico y de alto impacto espiritual. Este método se puede entender desde dos vertientes complementarias: el proceso de preparación del mensaje y la estructura del cuerpo del sermón.</p><h3>Fases de Elaboración del Mensaje</h3><p>Para diseñar un sermón expositivo sólido, el predicador sigue este trayecto ordenado:</p><ol><li><strong>Pasaje:</strong> Selección minuciosa del texto o porción de las Sagradas Escrituras que servirá de fundamento. Implica leer el relato repetidamente para identificar las palabras clave.</li><li><strong>Exégesis:</strong> Análisis interpretativo, gramatical e histórico del pasaje en su contexto original para extraer el significado exacto que pretendía el autor bíblico.</li><li><strong>Idea Central (Centralidad):</strong> Identificación del principio espiritual supremo y unificador del pasaje. Es la base lógica (<em>logos</em>) que evita que el sermón se desvíe.</li><li><strong>Contexto o Bosquejo:</strong> Estructuración del bosquejo del pasaje, dividiéndolo en unidades de pensamiento para reflejar fielmente la estructura del texto bíblico. Esto sirve como el cimiento sobre el cual se edificará el bosquejo del sermón.</li><li><strong>Aplicación Práctica:</strong> El aterrizaje de la verdad eterna en el contexto contemporáneo de los oyentes, respondiendo a sus necesidades particulares y proveyendo un plan de acción concreto.</li></ol><h3>Estructuración de los Puntos (Acróstico PEICA)</h3><p>Al momento de predicar y desarrollar cada uno de los puntos principales en el púlpito, se aplica la siguiente estructura dinámica:</p><table><thead><tr><th>Letra</th><th>Fase del Punto</th><th>Propósito Homilético</th></tr></thead><tbody><tr><td><strong>P</strong></td><td>Presentación</td><td>Anunciar el punto principal de forma clara, concisa y directa.</td></tr><tr><td><strong>E</strong></td><td>Explicación</td><td>Definir el significado teológico, analizando palabras clave y haciendo preguntas que capten la atención.</td></tr><tr><td><strong>I</strong></td><td>Ilustración</td><td>Relatar una analogía sencilla o testimonio que ilumine la verdad expuesta.</td></tr><tr><td><strong>C</strong></td><td>Comparación</td><td>Vincular la enseñanza con otros pasajes bíblicos paralelos para dar mayor soporte doctrinal.</td></tr><tr><td><strong>A</strong></td><td>Aplicación</td><td>Traducir la doctrina a la vida práctica y cotidiana del oyente en su contexto particular.</td></tr></tbody></table>`,
          },
          {
            title:
              "Lección 3: Clasificación de Sermones: Textual, Temático y Expositivo",
            content: `<h2>Lección 3: Clasificación de Sermones: Textual, Temático y Expositivo</h2><p>En la teología práctica y la homilética clásica, los mensajes bíblicos se clasifican principalmente en tres categorías fundamentales según la manera en que el predicador utiliza e interactúa con el texto sagrado. Cada tipo tiene características propias y responde a diferentes propósitos de edificación y evangelización.</p><h3>Definiciones Clave</h3><ul><li><strong>Sermón Textual:</strong> Es aquel que se limita a exponer y explicar un texto bíblico corto (generalmente uno o dos versículos). El esqueleto del mensaje se deriva directamente de las palabras o frases del mismo versículo, pudiendo ser ilativo (palabra por palabra) o analítico (ordenado por conceptos).</li><li><strong>Sermón Temático:</strong> Consiste en la exposición organizada de un asunto, doctrina o tema bíblico, sin ceñirse a las líneas de un texto único. El predicador explora lo que el conjunto de las Escrituras enseña sobre el tema, utilizando diversos versículos de soporte.</li><li><strong>Sermón Expositivo:</strong> Se basa en el comentario de un pasaje extenso de las Escrituras (como una parábola, un relato histórico o todo un capítulo). Sigue un método analítico o sintético para extraer principios espirituales hilvanados por un tema común.</li></ul><hr/><h3>Tabla Comparativa de los Tipos de Sermones</h3><table><thead><tr><th>Criterio</th><th>Sermón Textual</th><th>Sermón Temático</th><th>Sermón Expositivo</th></tr></thead><tbody><tr><td><strong>Base Bíblica</strong></td><td>Un versículo o pasaje muy corto.</td><td>Múltiples pasajes a lo largo de la Biblia.</td><td>Un pasaje largo o capítulo completo.</td></tr><tr><td><strong>Estructura</strong></td><td>Proviene de las palabras o cláusulas del texto.</td><td>Desarrollada de manera lógica por el predicador sobre un tema.</td><td>Sigue la corriente narrativa o lógica del pasaje largo.</td></tr><tr><td><strong>Ventaja</strong></td><td>Mantiene el mensaje enfocado en la letra de la Escritura.</td><td>Permite un análisis doctrinal exhaustivo y amplio.</td><td>Enseña a la congregación cómo interpretar pasajes extensos de la Biblia.</td></tr><tr><td><strong>Riesgo</strong></td><td>Puede volverse repetitivo o limitarse a un tratamiento verbal.</td><td>Peligro de usar versículos fuera de su contexto original.</td><td>Puede tornarse monótono si no se conecta con un tema unificador.</td></tr></tbody></table>`,
          },
          {
            title: "Lección 4: Estructura Modelo de un Bosquejo Expositivo",
            content: `<h2>Lección 4: Estructura Modelo de un Bosquejo Expositivo</h2><p>Un bosquejo homilético eficaz actúa como el esqueleto que sostiene y da forma al mensaje bíblico. Para la predicación expositiva, es fundamental combinar el orden lógico de los puntos con el <strong>proceso retórico</strong> que equilibra el carácter del predicador (<em>ethos</em>), el razonamiento del mensaje (<em>logos</em>) y la conexión emocional (<em>pathos</em>).</p><h3>Plantilla de Bosquejo Expositivo</h3><blockquote><p><strong>Título del Sermón:</strong> [Inserte un título sugerente e interesante]<br><strong>Texto Bíblico Base:</strong> [Pasaje extenso, e.g., Romanos 8:18-25]<br><strong>Idea Central o Proposición:</strong> [Sentencia breve que resume el pasaje en tiempo pasado o presente]</p></blockquote><h3>Desarrollo Estructural</h3><p>Utilice la nomenclatura homilética clásica para estructurar el mensaje: números romanos (I, II, III) para puntos principales, números arábigos (1, 2) para subdivisiones y letras (a, b) para subdivisiones secundarias:</p><ul><li><strong>Introducción:</strong> Presente el contexto histórico-literario o un incidente relevante para capturar la atención de la audiencia. Declare preguntas de alto interés para involucrar la mente de los oyentes.</li><li><strong>Punto Principal I: [Primer Encabezado Sólido]</strong><ul><li><strong>A. Observación:</strong> Dirija a los oyentes a leer el versículo correspondiente antes de enunciar formalmente el punto para que vean que la idea proviene directamente de la Escritura.</li><li><strong>B. Interpretación:</strong> Explique detalladamente el significado histórico, gramatical y literario del pasaje (<em>logos</em>).</li><li><strong>C. Ilustración:</strong> Utilice una anécdota o analogía de la vida cotidiana para arrojar luz sobre la verdad interpretada (<em>pathos</em>).</li><li><strong>D. Aplicación:</strong> Provea aplicaciones concretas dirigidas a las necesidades del oyente en su realidad actual.</li><li><strong>E. Exhortación:</strong> Anime, advierta, consuele o ruegue a la congregación a responder ante el principio enseñado.</li></ul></li><li><strong>Conclusión y Llamado:</strong> Mencione brevemente los argumentos principales (recapitulación) y descienda directamente al corazón del oyente para requerir un compromiso claro y de crecimiento espiritual.</li></ul>`,
          },
          {
            title: "Lección 5: El Arte de Ilustrar y la Aplicación Práctica",
            content: `<h2>Lección 5: El Arte de Ilustrar y la Aplicación Práctica</h2><p>La entrega eficaz de un sermón requiere el dominio de dos herramientas críticas: la habilidad de ilustrar conceptos espirituales abstractos y la capacidad de guiar a la congregación a una respuesta o decisión madura en el cierre. El predicador ideal une el fondo teológico con una forma de entrega elocuente y ungida.</p><h3>El Uso Efectivo de Ilustraciones</h3><p>Las ilustraciones son las ventanas que iluminan el sermón. Para utilizarlas adecuadamente, siga estas pautas esenciales:</p><ul><li><strong>Sean Breves:</strong> Prepare y anote la historia previamente para evitar divagar en detalles irrelevantes o convertir el sermón en una simple retahíla de anécdotas sin base doctrinal.</li><li><strong>Analogías Cotidianas:</strong> Imite el ejemplo de Jesús y utilice verdades cotidianas de la creación o de la vida diaria para revelar verdades espirituales profundas.</li><li><strong>Aumentan el Ethos y el Pathos:</strong> Una buena ilustración ayuda a la audiencia a relacionar las verdades eternas con el siglo XXI y fomenta un ambiente propicio para la obra del Espíritu Santo.</li></ul><hr/><h3>La Entrega de la Conclusión y el Llamado</h3><p>La conclusión es el momento decisivo del mensaje homilético. Es aquí donde se clava el clavo en las conciencias de los oyentes:</p><ul><li><strong>Descienda en Línea Recta:</strong> No describa círculos innecesarios repitiendo ideas o extendiendo la conclusión como un nuevo sermón en miniatura. Sea breve y directo.</li><li><strong>Evite Muletillas y Apologías:</strong> No use apoyos verbales repetitivos ni pida disculpas al final por falta de preparación, ya que esto resta autoridad y distrae de la solemnidad del momento.</li><li><strong>El Llamado al Altar o Próximo Paso:</strong> Guíe a la congregación a dar un paso concreto y medible en su desarrollo espiritual. El llamado debe requerir decisiones conscientes y espiritualmente maduras, evitando la manipulación emocional o la insistencia mecánica.</li></ul>`,
          },
        ],
      },
      {
        name: "Hermenéutica y Exégesis",
        notes: [
          {
            title: "Análisis de Contexto Histórico",
            content:
              "<p>Notas y trasfondo histórico del autor, fecha y destinatarios.</p>",
          },
        ],
      },
      {
        name: "Hermenéutica Bíblica - Nivel I",
        notes: [
          {
            title:
              "Lección 1: Introducción a la Hermenéutica y la Necesidad de Principios",
            content: `<h2>Lección 1: Introducción a la Hermenéutica y la Necesidad de Principios</h2><p>La palabra <strong>hermenéutica</strong> proviene del término griego <em>hermeneuo</em>, que significa 'interpretar, traducir o explicar'. Este término está relacionado con Hermes, el mensajero de los dioses en la mitología griega, encargado de entregar e interpretar los mensajes divinos.</p><h3>¿Por qué necesitamos la hermenéutica?</h3><p>Interpretar la Biblia sin principios claros produce confusión y caos. El libro de los Jueces describe una época oscura porque 'cada uno hacía lo que bien le parecía' (Jueces 17:6). De igual modo, necesitamos principios hermenéuticos por cuatro razones fundamentales:</p><ol><li><strong>Guía en la interpretación:</strong> Al igual que las reglas de tránsito previenen accidentes, los principios de interpretación evitan errores graves en la comprensión bíblica.</li><li><strong>Habilidades para responder preguntas difíciles:</strong> Nos capacita para resolver pasajes complejos, como el aparente conflicto de por qué el Espíritu Santo enseña todas las cosas pero aún necesitamos maestros (1 Juan 2:27).</li><li><strong>Afirmación en la verdad:</strong> Nos enseña a apoyarnos en la roca de la Palabra de Dios y evitar tropiezos por interpretaciones humanas falsas.</li><li><strong>Atravesar las brechas de la comunicación:</strong> Nos ayuda a cruzar las distancias que nos separan del texto original:</li></ol><ul><li><em>La brecha del tiempo:</em> El Nuevo Testamento fue escrito hace casi 2,000 años, y el Antiguo Testamento mucho antes.</li><li><em>La brecha cultural:</em> Las costumbres de los pueblos bíblicos (como el lavado de pies o los sacrificios) son muy distintas a las nuestras.</li><li><em>La brecha del idioma:</em> Las Escrituras se escribieron originalmente en hebreo, arameo y griego.</li><li><em>La brecha histórica:</em> Cada libro fue redactado en un tiempo histórico y bajo circunstancias políticas específicas.</li></ul>`,
          },
          {
            title:
              "Lección 2: Calificaciones del Intérprete e Inspiración Divina",
            content: `<h2>Lección 2: Calificaciones del Intérprete e Inspiración Divina</h2><p>Para interpretar las Escrituras de manera correcta, el estudiante debe poseer calificaciones espirituales y mentales específicas, reconociendo ante todo la naturaleza de la revelación de Dios.</p><h3>La Naturaleza de la Inspiración Bíblica</h3><p>La <strong>inspiración</strong> es el proceso por el cual Dios sopló o respiró Su mensaje en los escritores originales (2 Timoteo 3:16) y los guió a través del Espíritu Santo para que escribieran Su Palabra sin error (2 Pedro 1:20-21). Esta inspiración se caracteriza por seis aspectos fundamentales:</p><table><thead><tr><th>Aspecto</th><th>Definición y Significado</th></tr></thead><tbody><tr><td><strong>Verbal</strong></td><td>Dios inspiró las palabras exactas de los autógrafos originales, no solo las ideas generales.</td></tr><tr><td><strong>Plenaria</strong></td><td>Toda la Escritura es completa y plenamente inspirada, desde los relatos históricos hasta las genealogías.</td></tr><tr><td><strong>Revelada</strong></td><td>A través de la Biblia, Dios desvela Su persona, carácter, voluntad y obras.</td></tr><tr><td><strong>Infalible</strong></td><td>La Escritura es incapaz de fallar o errar en asuntos de doctrina, fe y moral.</td></tr><tr><td><strong>Inerrante</strong></td><td>La Biblia no contiene errores en sus registros históricos, geográficos ni científicos.</td></tr><tr><td><strong>Autoritativa</strong></td><td>La Palabra de Dios es la máxima autoridad, por encima de la tradición, la razón humana o los líderes eclesiales.</td></tr></tbody></table><h3>Calificaciones Esenciales del Intérprete</h3><p>Además de aceptar la inspiración, el intérprete calificado debe cumplir con cinco condiciones básicas:</p><ul><li><strong>Haber nacido de nuevo:</strong> La comprensión profunda de las verdades divinas requiere el nuevo nacimiento espiritual.</li><li><strong>Depender del Espíritu Santo:</strong> Se debe buscar la iluminación divina mediante la oración constante (Salmo 119:18).</li><li><strong>Obedecer la verdad que ya entiende:</strong> La obediencia precede a un mayor entendimiento espiritual (Juan 7:17).</li><li><strong>Tener una mente abierta y espíritu enseñable:</strong> El corazón debe estar dispuesto a aprender y corregir ideas preconcebidas.</li><li><strong>Estudiar con diligencia:</strong> El uso correcto de la verdad requiere esfuerzo mental y estudio riguroso (2 Timoteo 2:15).</li></ul>`,
          },
          {
            title:
              "Lección 3: Los Objetivos de la Interpretación: Exégesis vs. Eiségesis",
            content: `<h2>Lección 3: Los Objetivos de la Interpretación: Exégesis vs. Eiségesis</h2><p>El estudio bíblico formal tiene dos metas esenciales que dirigen todo el trabajo del intérprete.</p><h3>Los Dos Grandes Objetivos</h3><ol><li><strong>Descubrir el significado original:</strong> Entender qué significaba el texto para el autor y los primeros lectores de la época. Un pasaje bíblico tiene <strong>un solo significado</strong> verdadero.</li><li><strong>Descubrir qué nos dice hoy:</strong> Aunque hay un solo significado original, este produce múltiples principios y aplicaciones para nuestra vida moderna.</li></ol><h3>Exégesis vs. Eiségesis</h3><p>La diferencia entre estas dos metodologías es crucial para no torcer las Escrituras:</p><blockquote><p><strong>Exégesis:</strong> Consiste en extraer del texto bíblico lo que el autor originalmente quiso decir. Comienza con la Palabra de Dios y descubre su significado inherente.</p></blockquote><blockquote><p><strong>Eiségesis:</strong> Consiste en introducir a la fuerza pensamientos o prejuicios personales dentro del texto bíblico. Ocurre cuando alguien ya tiene una creencia previa y busca forzar versículos aislados para justificarla.</p></blockquote><p>Por ejemplo, utilizar Romanos 6:14 (<em>'no estáis bajo la ley, sino bajo la gracia'</em>) para justificar el pecado personal es un caso claro de eiségesis, pues el versículo siguiente (Romanos 6:15) prohíbe explícitamente pecar bajo la gracia.</p>`,
          },
          {
            title:
              "Lección 4: Escuelas de Interpretación y el Contexto Literario",
            content: `<h2>Lección 4: Escuelas de Interpretación y el Contexto Literario</h2><p>A lo largo de la historia de la iglesia, surgieron diferentes enfoques para descifrar el texto bíblico, lo cual resalta la importancia de la ley del contexto literario.</p><h3>Dos Escuelas Históricas de Interpretación</h3><ul><li><strong>La Escuela de Alejandría:</strong> Favorecía el método de la alegoría, buscando significados ocultos y místicos más allá del texto literal. Esto conducía con frecuencia a interpretaciones puramente subjetivas.</li><li><strong>La Escuela de Antioquía:</strong> Defendía el método <strong>histórico-gramatical</strong>, sosteniendo que cada pasaje tiene un único significado determinado por su contexto histórico y las reglas gramaticales. Este es el método correcto para la interpretación bíblica.</li></ul><p>Durante la Edad Media, la interpretación sufrió oscurantismo debido al abuso de la alegoría y la dependencia de las tradiciones humanas. Martín Lutero y Juan Calvino, líderes de la Reforma, restauraron el principio de que las Escrituras deben interpretarse en su sentido literal e histórico dentro de su contexto inmediato.</p><hr/><h3>La Ley del Contexto Literario</h3><p>El verdadero significado de cualquier versículo es el que posee dentro de su propio contexto escrito. Tomar un versículo fuera de su contexto es usarlo como un arma peligrosa, tal como Satanás intentó hacer al tentar a Jesús en el desierto (Mateo 4:5-6).</p><p>Para interpretar un texto bíblico correctamente, se deben examinar sus <strong>círculos de contexto literario</strong>:</p><ol><li><strong>Contexto del párrafo:</strong> El círculo más pequeño que rodea de inmediato al versículo.</li><li><strong>Contexto de la subdivisión:</strong> El capítulo o sección temática en la que se ubica el párrafo.</li><li><strong>Contexto del libro:</strong> El tema general, bosquejo y propósito del libro completo.</li><li><strong>Contexto del mismo autor:</strong> Comparar pasajes del mismo escritor en otros libros (por ejemplo, Lucas en su Evangelio y en Hechos).</li><li><strong>Contexto del testamento:</strong> Comparar con otros escritores del mismo Testamento.</li><li><strong>Contexto de toda la Biblia:</strong> Integrar las verdades de ambos Testamentos, equilibrando el Antiguo y el Nuevo Pacto.</li></ol>`,
          },
          {
            title:
              "Lección 5: Descubrimiento y Aplicación de Principios Bíblicos",
            content: `<h2>Lección 5: Descubrimiento y Aplicación de Principios Bíblicos</h2><p>La meta final de la hermenéutica es aplicar la verdad divina a nuestra vida diaria, transformando el significado original del autor en principios eternos y transculturales.</p><h3>¿Qué es un Principio Bíblico?</h3><p>Un <strong>principio bíblico</strong> es una amplia certeza transcultural y eterna de la Palabra de Dios. No cambia según la época o el lugar. Los principios bíblicos se presentan bajo cuatro formas principales:</p><ul><li><strong>Mandamiento:</strong> Ejercen una directriz moral para la conducta, como <em>'No cometerás adulterio'</em> (Éxodo 20:14).</li><li><strong>Advertencia:</strong> Llamados de alerta para guardarse de algún peligro, como <em>'Guardaos de toda avaricia'</em> (Lucas 12:15).</li><li><strong>Promesa:</strong> Declaraciones sobre lo que Dios hará por Sus hijos, como <em>'Cree en el Señor Jesucristo, y serás salvo'</em> (Hechos 16:31).</li><li><strong>Verdad eterna o proverbio:</strong> Hechos espirituales inmutables, como <em>'La fe sin obras está muerta'</em> (Santiago 2:17).</li></ul><h3>Pasos para Encontrar y Expresar Principios</h3><p>Para extraer principios de un pasaje de manera exegética y no eiségetica, se recomiendan los siguientes pasos:</p><ol><li><strong>Leer, estudiar y meditar el pasaje:</strong> Analizar el entorno original, los destinatarios primarios y el problema específico que se buscaba resolver.</li><li><strong>Definir el significado del autor:</strong> Encontrar el tronco temático del pasaje antes de ramificar sus aplicaciones.</li><li><strong>Usar herramientas y comentarios:</strong> Contrastar sus hallazgos personales con diccionarios bíblicos, concordancias y comentarios teológicos confiables.</li><li><strong>Redactar el principio con claridad:</strong> Expresarlo en una frase corta (generalmente entre 8 y 12 palabras), asegurándose de que esté en armonía con toda la teología de la Biblia.</li></ol>`,
          },
        ],
      },
      {
        name: "Plan de Lectura",
        notes: [
          {
            title: "Lección 1: Plan de los Evangelios Sinópticos en 30 Días",
            content: `<h2>Plan de los Evangelios Sinópticos en 30 Días</h2><p>Este plan está diseñado para leer los Evangelios de Mateo, Marcos y Lucas en un mes, comparando sus relatos paralelos para profundizar en la vida, enseñanzas y ministerio de Jesús. Es un método ideal para comprender la perspectiva única de cada escritor sinóptico.</p><h3>Estructura del Plan en Tres Fases:</h3><h4>1. Nacimiento, Bautismo y Primeras Enseñanzas (Días 1 a 10)</h4><p>Día 1: Genealogía de Jesús en <em>Mateo 1:1 al 17</em> y <em>Lucas 3:23 al 38</em>.<br>Día 2: Anunciación y Nacimiento en <em>Mateo 1:18 al 25</em> y <em>Lucas 1:26 al 38</em>.<br>Día 3: Adoración de los Magos y Pastores en <em>Mateo 2:1 al 12</em> y <em>Lucas 2:1 al 20</em>.<br>Día 4: Ministerio de Juan el Bautista en <em>Mateo 3:1 al 12</em>, <em>Marcos 1:1 al 8</em> y <em>Lucas 3:1 al 20</em>.<br>Día 5: Bautismo de Jesús en <em>Mateo 3:13 al 17</em>, <em>Marcos 1:9 al 11</em> y <em>Lucas 3:21 al 22</em>.<br>Día 6: Tentaciones en el Desierto en <em>Mateo 4:1 al 11</em>, <em>Marcos 1:12 al 13</em> y <em>Lucas 4:1 al 13</em>.<br>Día 7: Llamado de los Discípulos en <em>Mateo 4:12 al 25</em>, <em>Marcos 1:14 al 20</em> y <em>Lucas 4:14 al 30</em>.<br>Día 8: Las Bienaventuranzas en <em>Mateo 5:1 al 12</em> y <em>Lucas 6:20 al 23</em>.<br>Día 9: Sermón del Monte y la Ley en <em>Mateo 5:13 al 48</em> y <em>Lucas 6:27 al 36</em>.<br>Día 10: La Oración del Padre Nuestro en <em>Mateo 6:1 al 18</em> y <em>Lucas 11:1 al 4</em>.</p><h4>2. Milagros, Parábolas y Enseñanzas (Días 11 a 20)</h4><p>Día 11: Curaciones y Autoridad en <em>Mateo 8:1 al 17</em>, <em>Marcos 1:29 al 34</em> y <em>Lucas 4:38 al 41</em>.<br>Día 12: Jesús Calma la Tormenta en <em>Mateo 8:23 al 27</em>, <em>Marcos 4:35 al 41</em> y <em>Lucas 8:22 al 25</em>.<br>Día 13: La Hija de Jairo y la Mujer Enferma en <em>Mateo 9:18 al 26</em>, <em>Marcos 5:21 al 43</em> y <em>Lucas 8:40 al 56</em>.<br>Día 14: Parábola del Sembrador en <em>Mateo 13:1 al 23</em>, <em>Marcos 4:1 al 20</em> y <em>Lucas 8:4 al 15</em>.<br>Día 15: Parábolas del Reino en <em>Mateo 13:31 al 35</em>, <em>Marcos 4:30 al 34</em> y <em>Lucas 13:18 al 21</em>.<br>Día 16: Multiplicación de los Panes en <em>Mateo 14:13 al 21</em>, <em>Marcos 6:30 al 44</em> y <em>Lucas 9:10 al 17</em>.<br>Día 17: Tradición y Pureza en <em>Mateo 15:1 al 20</em> y <em>Marcos 7:1 al 23</em>.<br>Día 18: Confesión de Pedro en <em>Mateo 16:13 al 20</em>, <em>Marcos 8:27 al 30</em> y <em>Lucas 9:18 al 21</em>.<br>Día 19: Transfiguración en <em>Mateo 17:1 al 13</em>, <em>Marcos 9:2 al 13</em> y <em>Lucas 9:28 al 36</em>.<br>Día 20: Humildad y Perdón en <em>Mateo 18:1 al 14</em>, <em>Marcos 9:33 al 50</em> y <em>Lucas 9:46 al 50</em>.</p><h4>3. Pasión, Muerte y Resurrección (Días 21 a 30)</h4><p>Día 21: Entrada Triunfal en <em>Mateo 21:1 al 11</em>, <em>Marcos 11:1 al 11</em> y <em>Lucas 19:28 al 44</em>.<br>Día 22: Purificación del Templo en <em>Mateo 21:12 al 17</em>, <em>Marcos 11:15 al 19</em> y <em>Lucas 19:45 al 48</em>.<br>Día 23: El Tributo al César en <em>Mateo 22:15 al 22</em>, <em>Marcos 12:13 al 17</em> y <em>Lucas 20:20 al 26</em>.<br>Día 24: Señales del Fin en <em>Mateo 24:1 al 14</em>, <em>Marcos 13:1 al 13</em> y <em>Lucas 21:5 al 19</em>.<br>Día 25: La Última Cena en <em>Mateo 26:17 al 30</em>, <em>Marcos 14:12 al 26</em> y <em>Lucas 22:7 al 20</em>.<br>Día 26: Oración en Getsemaní en <em>Mateo 26:36 al 46</em>, <em>Marcos 14:32 al 42</em> y <em>Lucas 22:39 al 46</em>.<br>Día 27: Jesús ante Pilato en <em>Mateo 27:11 al 26</em>, <em>Marcos 15:1 al 15</em> y <em>Lucas 23:1 al 25</em>.<br>Día 28: Crucifixión y Muerte en <em>Mateo 27:32 al 56</em>, <em>Marcos 15:21 al 41</em> y <em>Lucas 23:26 al 49</em>.<br>Día 29: Resurrección en <em>Mateo 28:1 al 10</em>, <em>Marcos 16:1 al 8</em> y <em>Lucas 24:1 al 12</em>.<br>Día 30: Gran Comisión y Ascensión en <em>Mateo 28:16 al 20</em>, <em>Marcos 16:15 al 20</em> y <em>Lucas 24:36 al 53</em>.</p><blockquote><p><strong>Consejo de Estudio:</strong> Se sugiere aplicar el método de la <strong>Lectio Divina</strong> (Lectura, Meditación, Oración y Acción) para asimilar el texto. Registra las observaciones y diferencias de estilo que notes entre los evangelistas, utilizando como versículo clave <em>Mateo 24:35</em>: "El cielo y la tierra pasarán, pero mis palabras no pasarán."</p></blockquote>`,
          },
          {
            title: "Lección 2: Itinerario del Nuevo Testamento en 90 Días",
            content: `<h2>Itinerario del Nuevo Testamento en 90 Días</h2><p>Completar los 27 libros del Nuevo Testamento en tres meses es una excelente meta que requiere consistencia. Este itinerario estructurado organiza la lectura diaria con un promedio de tres capítulos al día, permitiendo al creyente asimilar las enseñanzas apostólicas y la vida de la Iglesia primitiva de forma sistemática.</p><h3>Distribución del Itinerario:</h3><ol><li><strong>Los Evangelios (Días 1 a 30):</strong> Consiste en absorber la vida de Jesucristo a través de los cuatro relatos canónicos de forma correlativa. Se leen secuencialmente los pasajes de <em>Mateo 1 al 28</em>, seguidos por <em>Marcos 1 al 16</em>, <em>Lucas 1 al 24</em> y finalmente <em>Juan 1 al 11</em>.</li><li><strong>Hechos y Epístolas Paulinas Mayores (Días 31 a 60):</strong> Continúa con la segunda parte del Evangelio de Juan (<em>Juan 12 al 21</em>), para luego sumergirse en la historia del Espíritu Santo guiando a la Iglesia primitiva en <em>Hechos 1 al 28</em>. Inmediatamente se avanza hacia las epístolas doctrinales dirigidas a las primeras iglesias, incluyendo la carta a los <em>Romanos 1 al 16</em>, <em>1 Corintios 1 al 16</em> y la primera porción de <em>2 Corintios 1 al 7</em>.</li><li><strong>Epístolas Paulinas Menores, Generales y Profecía (Días 61 a 90):</strong> Se lee el final de <em>2 Corintios 8 al 13</em>, seguido por <em>Gálatas 1 al 6</em>, <em>Efesios 1 al 6</em>, <em>Filipenses 1 al 4</em>, <em>Colosenses 1 al 4</em>, las epístolas a los Tesalonicenses, las epístolas pastorales a Timoteo, Tito y Filemón. Posteriormente se estudian las cartas generales de Hebreos, Santiago, Pedro, Juan y Judas, para concluir con la revelación profética de <em>Apocalipsis 1 al 22</em>.</li></ol><blockquote><p><strong>Criterios para la Constancia:</strong> Recuerda que la continuidad es más valiosa que la perfección. Si te retrasas algún día, no trates de saldar el atraso como si fuera una multa agobiante; simplemente vuelve a comenzar hoy con gozo, recordando la promesa de <em>Lamentaciones 3:22 y 23</em> sobre la misericordia de Dios que se renueva cada mañana.</p></blockquote>`,
          },
          {
            title: "Lección 3: Ruta de la Biblia Completa en Un Año",
            content: `<h2>Ruta de la Biblia Completa en Un Año</h2><p>Emprender la lectura completa de los 66 libros que conforman el canon de la Escritura en 365 días es una decisión que fortalece profundamente la fe y mejora el entendimiento sistemático del plan redentor de Dios. Este plan anual organiza las lecturas diarias en un promedio de 4 capítulos al día, integrando diferentes géneros literarios para mantener una experiencia variada y enriquecedora.</p><h3>El Enfoque de la Ruta Mixta</h3><p>A diferencia de la ruta puramente tradicional (secuencial de Génesis a Apocalipsis) o la ruta cronológica (según el orden de los acontecimientos históricos), la <strong>Ruta Mixta</strong> combina diariamente porciones del Antiguo Testamento con el Nuevo Testamento, añadiendo un capítulo diario de los libros de sabiduría (<em>Salmos</em> o <em>Proverbios</em>). Este equilibrio evita que el lector se estanque en secciones más densas de leyes o censos del Antiguo Testamento.</p><h3>Ejemplo del Ritmo Diario</h3><ul><li><strong>Día 1:</strong> Se lee <em>Proverbios 1</em> y <em>Génesis 1 al 3</em>.</li><li><strong>Día 2:</strong> Se lee <em>Proverbios 2</em> y <em>Génesis 4 al 6</em>.</li><li><strong>Día 32:</strong> (cambio de libro de sabiduría) Se lee <em>Salmo 1</em> y <em>Levítico 4 al 6</em>.</li></ul><p>Con esta estructura metodológica, el lector completará el Antiguo y el Nuevo Testamento una vez, y los libros de Salmos y Proverbios dos veces al año, permitiendo resaltar constantemente el carácter de Dios de forma devocional.</p><blockquote><p><strong>Variación para Mayor Rapidez:</strong> Si deseas completar el recorrido en menos tiempo, puedes optar por leer los libros de Salmos y Proverbios solo una vez. Al terminar de leerlos en la secuencia descrita, añade 1 capítulo más de los libros restantes. De esta manera, a partir del día 182, leerás 4 capítulos diarios del texto principal, completando toda la Biblia en menos de un año.</p></blockquote>`,
          },
          {
            title:
              "Lección 4: Plan de Iniciación de 21 Días: El Evangelio de Juan",
            content: `<h2>Plan de Iniciación de 21 Días: El Evangelio de Juan</h2><p>Si eres principiante o te estás familiarizando por primera vez con los textos sagrados, este plan de 21 días es la ruta de entrada perfecta. El Evangelio de Juan consta de 21 capítulos y es reconocido como uno de los libros más profundos y espirituales de las Escrituras, diseñado específicamente para resaltar la divinidad de Jesucristo.</p><h3>¿Cómo realizar este Plan?</h3><ol><li><strong>Lectura Diaria:</strong> Lee con detenimiento un capítulo por día de forma deliberada. No te apresures; el objetivo es la profundidad antes que el volumen.</li><li><strong>Enfoque en los Milagros:</strong> A lo largo de la lectura, presta especial atención a los <strong>ocho milagros de Cristo</strong> que el apóstol Juan registra para dar testimonio de que Jesús es el Hijo de Dios (<em>Juan 5:39</em>).</li><li><strong>Registro Espiritual:</strong> Anota diariamente tus reflexiones, las verdades que impacten tu corazón y las dudas que te surjan. Subraya o marca los versículos de mayor gracia.</li></ol><blockquote><p><strong>Variación Rápida:</strong> Si deseas terminar en menos tiempo, puedes optar por leer 3 capítulos al día, lo cual te permitirá completar todo el Evangelio de Juan en solo 7 días.</p></blockquote>`,
          },
          {
            title: "Lección 5: Planes Temáticos Semanales de Enfoque",
            content: `<h2>Planes Temáticos Semanales de Enfoque</h2><p>Los planes de lectura de una semana de duración son herramientas útiles para mantener el hábito espiritual en temporadas de alta ocupación, transiciones de vida, o para enfocar la meditación en virtudes cristianas específicas. Estos itinerarios seleccionan pasajes clave para profundizar en un tema central con regularidad y profundidad.</p><h3>Itinerarios Semanales:</h3><h4>1. Ruta: Más que Vencedores (Fortaleza en la Prueba)</h4><ul><li><strong>Día 1:</strong> Lee <em>Romanos 8</em> (somos más que vencedores en Su amor).</li><li><strong>Día 2:</strong> Lee <em>1 Juan 5</em> (la fe en Jesucristo como la victoria que vence al mundo).</li><li><strong>Día 3:</strong> Lee <em>1 Corintios 15</em> (la resurrección como la victoria final de Cristo sobre la muerte).</li><li><strong>Día 4:</strong> Lee <em>Salmo 33</em> (la victoria de aquellos que esperan en la soberanía de Dios).</li><li><strong>Día 5:</strong> Lee <em>Romanos 12</em> (la victoria ética de vencer el mal con el bien).</li><li><strong>Día 6:</strong> Lee <em>Proverbios 21</em> (reconocer que la victoria proviene únicamente del Señor).</li><li><strong>Día 7:</strong> Lee <em>Apocalipsis 2</em> (la promesa de la vida eterna para los que perseveren).</li></ul><h4>2. Ruta: Vivamos por Fe (Confianza Práctica)</h4><ul><li><strong>Día 1:</strong> Lee <em>Hebreos 11:6 al 40</em> (el testimonio histórico de los héroes de la fe).</li><li><strong>Día 2:</strong> Lee <em>Hebreos 10:35 al 39</em> y <em>11:1 al 5</em> (la justificación de vivir por fe).</li><li><strong>Día 3:</strong> Lee <em>Génesis 22:1 al 14</em> y <em>Santiago 1:2 al 4</em> (la confianza renovada cuando la fe es probada).</li><li><strong>Día 4:</strong> Lee <em>2 Crónicas 20:20 al 30</em> (la fe unida a la alabanza como protección divina).</li><li><strong>Día 5:</strong> Lee <em>Romanos 10:8 al 17</em> (la fe salvadora que viene por el oír la Palabra de Dios).</li><li><strong>Día 6:</strong> Lee <em>Santiago 2:14 al 26</em> (la fe verdadera demostrada a través de las buenas obras).</li><li><strong>Día 7:</strong> Lee <em>1 Juan 5:1 al 13</em> y <em>Juan 3:15 al 18</em> (el testimonio que confirma la vida abundante por la fe).</li></ul><blockquote><p><strong>Consejo Devocional:</strong> Aunque estos planes sean de corta duración, no omitas la oración escrita en tu diario. Compartir lo aprendido o unirte a una comunidad de estudio enriquecerá tu constancia y madurez espiritual.</p></blockquote>`,
          },
        ],
      },
    ],
  },
  {
    id: "dev",
    name: "Desarrollo y Programación",
    description: "Sintaxis, arquitectura, snippets y comandos de terminal.",
    icon: "Code2",
    notebooks: [
      {
        name: "Cheat Sheets y Sintaxis",
        notes: [
          {
            title: "Sintaxis y Snippets",
            content:
              "<pre><code>// Agrega tus funciones reutilizables aquí</code></pre>",
          },
        ],
      },
      {
        name: "Arquitectura y APIs",
        notes: [
          {
            title: "Diseño de Endpoints y Modelos",
            content: "<p>Documentación técnica de la estructura y flujos.</p>",
          },
        ],
      },
      {
        name: "Comandos de Terminal",
        notes: [
          {
            title: "Comandos Frecuentes",
            content:
              "<pre><code># Git, Docker y scripts de consola</code></pre>",
          },
        ],
      },
    ],
  },
  {
    id: "productividad",
    name: "Productividad y Proyectos",
    description: "Metas, bitácora semanal e ideas para avanzar con claridad.",
    icon: "Target",
    notebooks: [
      {
        name: "Metas",
        notes: [
          {
            title: "Mis metas",
            content: "<h3>Objetivo:</h3><p></p><h3>Próximos pasos:</h3><p></p>",
          },
        ],
      },
      {
        name: "Bitácora Semanal",
        notes: [
          {
            title: "Semana en curso",
            content: "<h3>Logros:</h3><p></p><h3>Aprendizajes:</h3><p></p>",
          },
        ],
      },
      {
        name: "Ideas",
        notes: [
          {
            title: "Banco de ideas",
            content: "<p>Captura aquí tus próximas ideas.</p>",
          },
        ],
      },
    ],
  },
  {
    id: "salud",
    name: "Salud y Bienestar",
    description: "Rutinas, nutrición y seguimiento de hábitos saludables.",
    icon: "HeartPulse",
    notebooks: [
      {
        name: "Rutinas",
        notes: [
          {
            title: "Rutina de entrenamiento",
            content: "<h3>Entrenamiento:</h3><p></p><h3>Registro:</h3><p></p>",
          },
        ],
      },
      {
        name: "Nutrición",
        notes: [
          {
            title: "Registro de nutrición",
            content: "<h3>Comidas:</h3><p></p><h3>Observaciones:</h3><p></p>",
          },
        ],
      },
    ],
  },
];
