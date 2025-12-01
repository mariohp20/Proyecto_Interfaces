export const lessonsData = [
  {
    id: 'python-basics-1',
    title: 'Variables y Tipos de Datos',
    description: 'Aprende a crear y usar variables en Python',
    difficulty: 'Fácil',
    icon: '📦',
    xpReward: 50,
    theory: {
      videoUrl: 'https://www.youtube.com/embed/dbICRLZ46Qw',
      videoTitle: 'Introducción a Variables y Tipos',
      readingTime: '3 minutos',
      concepts: [
        { title: 'Asignación', text: 'Una variable se crea al asignarle un valor usando el operador =.' },
        { title: 'Tipos Comunes', text: 'Los tipos principales son: int (número entero), float (número decimal), y str (texto/cadena).' },
        { title: 'Reglas de Nombre', text: 'Las variables no pueden empezar con números y son sensibles a mayúsculas/minúsculas.' }
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: '¿Qué imprime el siguiente código? print("Hola")', hint: 'La función print() muestra texto en la consola', options: ['Hola', '"Hola"', 'print("Hola")', 'Error'], correctAnswer: 0, explanation: 'print() muestra el contenido del texto sin las comillas. En este caso imprime: Hola' },
      { type: 'fill-in-blanks', question: 'Completa el código para crear una variable llamada "edad" con valor 25', hint: 'Usa el formato: nombre_variable = valor', code: '___ = ___', blanks: [['edad'], ['25']], explanation: 'En Python se asigna un valor a una variable usando el signo igual (=)' },
      { type: 'drag-drop', question: 'Ordena el código para crear una variable y mostrarla', hint: 'Primero se crea la variable, luego se imprime', items: ['nombre = "Python"', 'print(nombre)'], correctOrder: [0, 1], explanation: 'Primero debes asignar el valor a la variable, y luego usar print() para mostrarla' },
      { type: 'multiple-choice', question: '¿Cuál es el tipo de dato de la variable x? x = 5', hint: 'Los números enteros tienen un tipo específico', options: ['string', 'int', 'float', 'boolean'], correctAnswer: 1, explanation: 'El número 5 es un entero (integer), por lo que x es de tipo int' },
      { type: 'drag-drop', question: 'Ordena el código para sumar dos números', hint: 'Define las variables primero, luego realiza la operación', items: ['a = 10', 'b = 20', 'suma = a + b', 'print(suma)'], correctOrder: [0, 1, 2, 3], explanation: 'El orden correcto es: definir primera variable, segunda variable, calcular suma y finalmente mostrar el resultado' }
    ]
  },
  {
    id: 'operadores-matematicos',
    title: 'Operadores Matemáticos',
    description: 'Suma, resta, multiplicación y más',
    difficulty: 'Fácil',
    icon: '➕',
    xpReward: 50,
    theory: {
      videoUrl: 'https://www.youtube.com/embed/dbICRLZ46Qw',
      videoTitle: 'Operaciones Aritméticas Básicas',
      readingTime: '4 minutos',
      concepts: [
        { title: 'Suma/Resta', text: 'Se usan + y - para las operaciones básicas.' },
        { title: 'Multiplicación/División', text: 'Se usan * y / . La división / siempre retorna un float.' },
        { title: 'Módulo', text: 'El operador % (módulo) retorna el residuo de una división.' }
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: '¿Qué resultado da 10 + 5?', hint: 'Es una suma simple', options: ['15', '105', '10.5', '5'], correctAnswer: 0, explanation: 'La suma de 10 + 5 es 15' },
      { type: 'drag-drop', question: 'Ordena el código para calcular el área de un rectángulo', hint: 'Área = base × altura', items: ['base = 5', 'altura = 10', 'area = base * altura', 'print("El área es:", area)'], correctOrder: [0, 1, 2, 3], explanation: 'Para calcular el área necesitas: definir base, definir altura, multiplicarlas y mostrar el resultado' },
      { 
        type: 'drag-drop', 
        question: 'Ordena las operaciones matemáticas de menor a mayor resultado', 
        hint: 'Calcula mentalmente cada operación', 
        items: ['10 - 8', '2 * 3', '20 / 4', '3 + 4'], 
        correctOrder: [0, 2, 1, 3], // [2, 5, 6, 7]
        explanation: 'El orden de resultados (menor a mayor) es: 10-8 (2), 20/4 (5), 2*3 (6), 3+4 (7)' 
      },
      {
        type: 'matching',
        question: 'Une cada operador con su función en Python.',
        hint: 'El módulo es el residuo.',
        pairs: [
          { left: '+', right: 'Suma' },
          { left: '*', right: 'Multiplicación' },
          { left: '//', right: 'División Entera' },
          { left: '%', right: 'Módulo' },
        ],
        explanation: 'Los operadores son los símbolos que ejecutan operaciones matemáticas o lógicas.'
      },
      { type: 'fill-in-blanks', question: 'Completa: resultado = 20 ___ 4 (para que resultado sea 5)', hint: 'Piensa qué operación da 5 cuando divides 20', code: 'resultado = 20 ___ 4', blanks: [['/']], explanation: '20 dividido entre 4 es igual a 5, por lo que el operador correcto es /' },
    ]
  },
  {
    id: 'condicionales',
    title: 'Condicionales (if/else)',
    description: 'Toma decisiones en tu código',
    difficulty: 'Intermedio',
    icon: '🔀',
    xpReward: 75,
    theory: {
      videoUrl: 'https://www.youtube.com/embed/dbICRLZ46Qw',
      videoTitle: 'Control de Flujo con if/elif/else',
      readingTime: '5 minutos',
      concepts: [
        { title: 'if', text: 'Ejecuta un bloque de código SOLO si la condición es verdadera.' },
        { title: 'elif', text: 'Abreviación de "else if", se evalúa si la condición del if anterior fue falsa.' },
        { title: 'else', text: 'Se ejecuta si ninguna condición anterior (if/elif) fue verdadera.' }
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: '¿Qué imprime este código?\nx = 10\nif x > 5:\n    print("Mayor")', hint: '¿10 es mayor que 5?', options: ['Mayor', 'Menor', 'Nada', 'Error'], correctAnswer: 0, explanation: 'Como 10 es mayor que 5, la condición es verdadera y se imprime "Mayor"' },
      { type: 'drag-drop', question: 'Ordena el código para verificar si un número es positivo', hint: 'Primero define la variable, luego verifica con if', items: ['numero = 5', 'if numero > 0:', '    print("Es positivo")'], correctOrder: [0, 1, 2], explanation: 'La estructura correcta es: asignar valor, condición if, acción indentada' },
      { type: 'fill-in-blanks', question: 'Completa el código para un if-else', hint: 'La palabra clave para "si no" es else', code: 'if edad >= 18:\n    print("Mayor de edad")\n___:\n    print("Menor de edad")', blanks: [['else']], explanation: 'else se usa para el caso contrario cuando la condición del if es falsa' },
      { type: 'drag-drop', question: 'Ordena el código para clasificar una nota', hint: 'Las condiciones van de más específica a más general', items: ['nota = 85', 'if nota >= 90:', '    print("Excelente")', 'elif nota >= 70:', '    print("Bueno")', 'else:', '    print("Necesita mejorar")'], correctOrder: [0, 1, 2, 3, 4, 5, 6], explanation: 'La estructura if-elif-else permite evaluar múltiples condiciones en orden' },
      {
        type: 'slider',
        question: 'Ajusta la variable `temperatura` para que el código imprima "Es cálido".',
        code: 'if temperatura > 25: print("Hace calor")\nelif temperatura > 15: print("Es cálido")\nelse: print("Hace frío")',
        targetOutput: 'Es cálido',
        variableName: 'temperatura',
        correctRange: [16, 25],
        minValue: 0,
        maxValue: 30,
        explanation: 'Para que la condición `temperatura > 15` sea verdadera y la `temperatura > 25` sea falsa, el valor debe estar entre 16 y 25.'
      }
    ]
  },
  {
    id: 'loops',
    title: 'Bucles (for/while)',
    description: 'Repite acciones automáticamente',
    difficulty: 'Intermedio',
    icon: '🔁',
    xpReward: 75,
    theory: {
      videoUrl: 'https://www.youtube.com/embed/dbICRLZ46Qw',
      videoTitle: 'Introducción a for y while',
      readingTime: '6 minutos',
      concepts: [
        { title: 'Bucle for', text: 'Se usa para iterar sobre una secuencia de elementos (listas, rangos).' },
        { title: 'Bucle while', text: 'Se repite mientras una condición booleana sea verdadera.' },
        { title: 'range()', text: 'Una función común para generar secuencias de números en bucles for.' }
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: '¿Cuántas veces se imprime "Hola"?\nfor i in range(3):\n    print("Hola")', hint: 'range(3) genera números del 0 al 2', options: ['2', '3', '4', 'Infinitas'], correctAnswer: 1, explanation: 'range(3) genera 3 números (0, 1, 2), por lo que el loop se ejecuta 3 veces' },
      { type: 'drag-drop', question: 'Ordena el código para imprimir números del 1 al 5', hint: 'for in range() es la estructura básica', items: ['for i in range(1, 6):', '    print(i)'], correctOrder: [0, 1], explanation: 'range(1, 6) genera números del 1 al 5 (el 6 no se incluye)' },
      { type: 'fill-in-blanks', question: 'Completa el código para sumar números del 1 al 10', hint: 'En cada iteración suma i a la suma total', code: 'suma = 0\nfor i in range(1, 11):\n    suma ___ i\nprint(suma)', blanks: [['+=']], explanation: 'El operador += suma el valor a la variable existente (equivale a: suma = suma + i)' },
      { type: 'drag-drop', question: 'Ordena el código para un bucle while', hint: 'Inicializa contador, condición while, incremento', items: ['contador = 0', 'while contador < 5:', '    print(contador)', '    contador += 1'], correctOrder: [0, 1, 2, 3], explanation: 'Un while necesita: valor inicial, condición de continuación, incremento para evitar loop infinito' },
      {
        type: 'drag-drop',
        question: 'Reordena los segmentos para completar la sintaxis del bucle for.',
        layout: 'horizontal', 
        hint: 'La estructura es: for [variable] in [secuencia]:',
        items: ['i', 'for', 'in range(5):'],
        correctOrder: [1, 0, 2],
        explanation: 'La sintaxis correcta para un bucle for es `for i in range(5):`'
      }
    ]
  },
  {
    id: 'listas-tuplas',
    title: 'Listas y Tuplas',
    description: 'Colecciones de datos ordenadas',
    difficulty: 'Intermedio',
    icon: '🧾',
    xpReward: 75,
    theory: {
      videoUrl: 'https://www.youtube.com/embed/dbICRLZ46Qw',
      videoTitle: 'Listas, Mutabilidad y Tuplas',
      readingTime: '7 minutos',
      concepts: [
        { title: 'Listas []', text: 'Son mutables (se pueden cambiar) y se definen con corchetes.' },
        { title: 'Tuplas ()', text: 'Son inmutables (no se pueden cambiar) y se definen con paréntesis.' },
        { title: 'Acceso', text: 'Se accede a los elementos usando el índice (empieza en 0).' }
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: '¿Cuál es la principal diferencia entre Listas y Tuplas?', options: ['Tuplas son más rápidas', 'Listas son inmutables', 'Tuplas son inmutables', 'No hay diferencia'], correctAnswer: 2, explanation: 'Las tuplas son inmutables, lo que significa que no se pueden modificar después de su creación.' },
      { 
        type: 'code-execution', 
        question: 'Crea una lista llamada `frutas` con "manzana", "banana", "cereza" y luego imprime el segundo elemento.', 
        initialCode: 'frutas = []', 
        expectedOutput: 'banana', 
        hint: 'Recuerda que los índices comienzan en 0.' 
      },
      {
        type: 'matching',
        question: 'Relaciona la estructura con su mutabilidad.',
        pairs: [
          { left: 'Lista [ ]', right: 'Mutable' },
          { left: 'Tupla ( )', right: 'Inmutable' },
          { left: 'String " "', right: 'Inmutable' },
        ],
        explanation: 'La mutabilidad define si un objeto puede ser modificado después de crearse.'
      },
      { type: 'fill-in-blanks', question: 'Completa el código para cambiar el primer elemento de la lista.', code: 'mi_lista = [10, 20]\nmi_lista[___] = 5', blanks: [['0']], explanation: 'El primer elemento siempre se accede con el índice 0.' },
    ]
  },
  {
    id: 'funciones',
    title: 'Funciones',
    description: 'Organiza y reutiliza tu código',
    difficulty: 'Intermedio',
    icon: '⚙️',
    xpReward: 75,
    theory: {
      videoUrl: 'https://www.youtube.com/embed/dbICRLZ46Qw',
      videoTitle: 'Definición y Llamada de Funciones',
      readingTime: '8 minutos',
      concepts: [
        { title: 'Sintaxis', text: 'Las funciones se definen con `def` seguido del nombre y paréntesis.' },
        { title: 'Argumentos', text: 'Son los valores que se pasan a la función.' },
        { title: 'Retorno', text: 'La palabra clave `return` se usa para devolver un valor.' }
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: '¿Cuál es la palabra clave para definir una función en Python?', options: ['func', 'def', 'function', 'define'], correctAnswer: 1, explanation: 'La palabra clave es `def`.' },
      { 
        type: 'drag-drop', 
        question: 'Ordena las líneas para definir una función que suma 1 a un número.', 
        items: ['def sumar_uno(x):', '    return x + 1'], 
        correctOrder: [0, 1], 
        explanation: 'Primero se define la función, luego se retorna el valor.' 
      },
      { 
        type: 'fill-in-blanks', 
        question: 'Completa el código para llamar a la función `saludar`.', 
        code: 'def saludar():\n    print("Hola")\n___()', 
        blanks: [['saludar']], 
        explanation: 'Para ejecutar la función, se usa su nombre seguido de paréntesis.' 
      },
      { 
        type: 'code-execution', 
        question: 'Crea una función llamada `doble` que reciba un argumento `num` y retorne el doble de ese número. Luego imprime `doble(5)`.', 
        initialCode: 'def doble():\n    pass\nprint()', 
        expectedOutput: '10', 
        hint: 'Usa `return num * 2`.' 
      },
    ]
  },
  {
    id: 'strings-metodos',
    title: 'Strings y Métodos',
    description: 'Trabaja con cadenas de texto',
    difficulty: 'Fácil',
    icon: '📝',
    xpReward: 50,
    theory: {
      videoUrl: 'https://www.youtube.com/embed/dbICRLZ46Qw',
      videoTitle: 'Strings, F-Strings y Métodos',
      readingTime: '4 minutos',
      concepts: [
        { title: 'Inmutabilidad', text: 'Los strings son inmutables (no se pueden modificar, solo crear uno nuevo).' },
        { title: 'Métodos', text: 'Tienen métodos útiles como `.upper()`, `.lower()`, `.strip()`.' },
        { title: 'Formato', text: 'Los f-strings (cadenas literales con formato) facilitan la inclusión de variables.' }
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: '¿Cuál método convierte un string a mayúsculas?', options: ['.caps()', '.upper()', '.to_upper()', '.capitalize()'], correctAnswer: 1, explanation: 'El método correcto es `.upper()`.' },
      { 
        type: 'drag-drop', 
        question: 'Ordena el código para imprimir el string sin espacios al inicio y final.', 
        items: ['texto = " Hola Mundo "', 'print(texto.strip())'], 
        correctOrder: [0, 1], 
        explanation: 'El método `.strip()` elimina los espacios en blanco iniciales y finales.' 
      },
      { type: 'fill-in-blanks', question: 'Completa la f-string para incluir la variable `nombre`.', code: 'nombre = "PyLingo"\nprint(f"Me llamo {___}")', blanks: [['nombre']], explanation: 'Dentro de un f-string, la variable va entre llaves `{}`.' },
      { 
        type: 'slider',
        question: 'Ajusta la variable `indice` para imprimir la letra "L" del string.',
        code: 'palabra = "PyLingo"\nprint(palabra[indice])',
        targetOutput: 'L',
        variableName: 'indice',
        correctRange: [2, 2],
        minValue: 0,
        maxValue: 6,
        explanation: 'La letra "L" está en la posición 3, que corresponde al índice 2.'
      }
    ]
  },
  {
    id: 'diccionarios',
    title: 'Diccionarios',
    description: 'Almacena datos con pares clave-valor',
    difficulty: 'Intermedio',
    icon: '🔑',
    xpReward: 75,
    theory: {
      videoUrl: 'https://www.youtube.com/embed/dbICRLZ46Qw',
      videoTitle: 'Diccionarios (Objetos) en Python',
      readingTime: '7 minutos',
      concepts: [
        { title: 'Clave-Valor', text: 'Los diccionarios almacenan datos en pares (key: value).' },
        { title: 'Definición', text: 'Se definen con llaves `{}`.' },
        { title: 'Acceso', text: 'Se accede a los valores usando la clave entre corchetes, e.g., `mi_diccionario["clave"]`.' }
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: '¿Qué tipo de estructura se usa para definir un diccionario?', options: ['[ ]', '( )', '{ }', '< >'], correctAnswer: 2, explanation: 'Los diccionarios usan llaves `{}`.' },
      { type: 'fill-in-blanks', question: 'Completa el código para acceder al valor de la clave "país".', code: 'datos = {"país": "Chile"}\nprint(datos[___])', blanks: [['"país"']], explanation: 'Se accede usando la clave entre comillas dentro de corchetes.' },
      { 
        type: 'drag-drop', 
        question: 'Ordena el código para crear un diccionario y agregar una nueva clave.', 
        items: ['usuario = {"nombre": "Ana"}', 'usuario["edad"] = 30', 'print(usuario)'], 
        correctOrder: [0, 1, 2], 
        explanation: 'Primero se inicializa, luego se añade el par clave-valor y finalmente se imprime.' 
      },
      {
        type: 'matching',
        question: 'Relaciona la estructura con su uso.',
        pairs: [
          { left: 'Lista', right: 'Colección ordenada por índice' },
          { left: 'Tupla', right: 'Colección ordenada inmutable' },
          { left: 'Diccionario', right: 'Colección desordenada por clave' },
        ],
        explanation: 'Cada estructura tiene un propósito distinto en Python.'
      },
    ]
  },
  // =====================================================================
  // 🧠 LECCIÓN 9: REPASO CON FLASHCARDS (NUEVA)
  // =====================================================================
  {
    id: 'repaso-flashcards',
    title: 'Repaso Rápido: Conceptos',
    description: 'Pon a prueba tu memoria con tarjetas interactivas',
    difficulty: 'Fácil',
    icon: '🧠',
    xpReward: 40,
    theory: {
      videoUrl: 'https://www.youtube.com/embed/dbICRLZ46Qw',
      videoTitle: 'Técnicas de Memorización',
      readingTime: '2 minutos',
      concepts: [
        { title: 'Active Recall', text: 'Intentar recordar la respuesta antes de verla fortalece la memoria.' },
        { title: 'Repaso', text: 'Usa estas tarjetas para consolidar lo que has aprendido hasta ahora.' }
      ],
    },
    exercises: [
      { 
        type: 'flashcard', 
        question: '¿Recuerdas este concepto?', // Título genérico
        front: '¿Qué palabra clave se usa para definir una función?', 
        back: 'def', 
        explanation: 'En Python, las funciones siempre comienzan con `def`.' 
      },
      { 
        type: 'flashcard', 
        question: 'Concepto de Listas',
        front: '¿Las listas en Python son mutables o inmutables?', 
        back: 'Mutables', 
        explanation: 'Puedes cambiar, agregar o eliminar elementos de una lista después de crearla.' 
      },
      { 
        type: 'flashcard', 
        question: 'Operadores',
        front: '¿Qué operador devuelve el residuo de una división?', 
        back: '% (Módulo)', 
        explanation: 'El operador módulo (%) es útil para determinar si un número es par o impar.' 
      },
      { 
        type: 'flashcard', 
        question: 'Sintaxis',
        front: '¿Cómo se escriben los comentarios de una sola línea?', 
        back: '# Comentario', 
        explanation: 'El símbolo numeral (#) indica que el resto de la línea es un comentario.' 
      }
    ]
  }
];