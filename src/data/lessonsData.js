export const lessonsData = [
  {
    id: 'lesson-1',
    title: 'Variables y Tipos de Datos',
    description: 'Aprende los fundamentos de Python',
    icon: '📦',
    xpReward: 50,
    exercises: [
      {
        type: 'multiple-choice',
        question: '¿Cuál es la forma correcta de crear una variable en Python?',
        hint: 'En Python no necesitas declarar el tipo de variable',
        options: [
          'var nombre = "Juan"',
          'nombre = "Juan"',
          'let nombre = "Juan"',
          'string nombre = "Juan"'
        ],
        correctAnswer: 1,
        explanation: 'En Python, simplemente asignas un valor a un nombre de variable usando el signo igual (=)'
      },
      {
        type: 'fill-in-blanks',
        question: 'Completa el código para crear una variable llamada "edad" con el valor 25',
        code: '_____ = _____',
        blanks: ['edad', '25'],
        explanation: 'Las variables en Python se crean asignando un valor con el operador ='
      },
      {
        type: 'code-execution',
        question: 'Escribe código que imprima "Hola Python"',
        hint: 'Usa la función print()',
        expectedOutput: 'Hola Python',
        explanation: 'La función print() se usa para mostrar texto en la consola'
      }
    ]
  },
  {
    id: 'lesson-2',
    title: 'Condicionales',
    description: 'Toma decisiones en tu código',
    icon: '🔀',
    xpReward: 60,
    exercises: [
      {
        type: 'multiple-choice',
        question: '¿Qué palabra clave se usa para una condición en Python?',
        options: ['if', 'when', 'check', 'condition'],
        correctAnswer: 0,
        explanation: 'La palabra clave "if" se usa para crear condiciones en Python'
      },
      {
        type: 'drag-drop',
        question: 'Ordena las líneas para crear un condicional correcto',
        lines: [
          'edad = 18',
          'if edad >= 18:',
          '    print("Eres mayor de edad")',
          'else:',
          '    print("Eres menor de edad")'
        ],
        explanation: 'Los condicionales en Python usan if, elif y else con indentación'
      },
      {
        type: 'fill-in-blanks',
        question: 'Completa el código para verificar si un número es positivo',
        code: 'numero = 10\n_____ numero > 0:\n    print("Positivo")',
        blanks: ['if'],
        explanation: 'Usamos "if" seguido de una condición y dos puntos'
      }
    ]
  },
  {
    id: 'lesson-3',
    title: 'Bucles',
    description: 'Repite acciones eficientemente',
    icon: '🔄',
    xpReward: 70,
    exercises: [
      {
        type: 'multiple-choice',
        question: '¿Qué bucle usarías para iterar sobre una lista?',
        options: ['while', 'for', 'loop', 'repeat'],
        correctAnswer: 1,
        explanation: 'El bucle "for" es ideal para iterar sobre secuencias como listas'
      },
      {
        type: 'code-execution',
        question: 'Escribe un bucle que imprima los números del 1 al 3',
        hint: 'Usa range(1, 4) con un bucle for',
        expectedOutput: '1\n2\n3',
        explanation: 'range(1, 4) genera números del 1 al 3 (el 4 no se incluye)'
      },
      {
        type: 'drag-drop',
        question: 'Ordena el código para crear un bucle while',
        lines: [
          'contador = 0',
          'while contador < 3:',
          '    print(contador)',
          '    contador += 1'
        ],
        explanation: 'El bucle while se ejecuta mientras la condición sea verdadera'
      }
    ]
  },
  {
    id: 'lesson-4',
    title: 'Funciones',
    description: 'Organiza tu código en bloques reutilizables',
    icon: '⚙️',
    xpReward: 80,
    exercises: [
      {
        type: 'multiple-choice',
        question: '¿Cómo se define una función en Python?',
        options: [
          'function nombre():',
          'def nombre():',
          'func nombre():',
          'define nombre():'
        ],
        correctAnswer: 1,
        explanation: 'Las funciones en Python se definen con la palabra clave "def"'
      },
      {
        type: 'fill-in-blanks',
        question: 'Completa el código para crear una función que salude',
        code: '_____ saludar():\n    print("Hola")',
        blanks: ['def'],
        explanation: 'Usamos "def" seguido del nombre de la función y paréntesis'
      },
      {
        type: 'code-execution',
        question: 'Crea una función llamada "suma" que retorne 5 + 3',
        hint: 'Usa def, return y los números 5 y 3',
        expectedOutput: '8',
        explanation: 'Las funciones pueden retornar valores usando "return"'
      }
    ]
  },
  {
    id: 'lesson-5',
    title: 'Listas',
    description: 'Trabaja con colecciones de datos',
    icon: '📋',
    xpReward: 75,
    exercises: [
      {
        type: 'multiple-choice',
        question: '¿Cómo se crea una lista vacía en Python?',
        options: [
          'lista = {}',
          'lista = []',
          'lista = ()',
          'lista = <>'
        ],
        correctAnswer: 1,
        explanation: 'Las listas se crean usando corchetes []'
      },
      {
        type: 'fill-in-blanks',
        question: 'Completa el código para agregar un elemento a una lista',
        code: 'frutas = ["manzana"]\nfrutas._____("banana")',
        blanks: ['append'],
        explanation: 'El método append() agrega elementos al final de una lista'
      },
      {
        type: 'drag-drop',
        question: 'Ordena el código para crear y usar una lista',
        lines: [
          'numeros = [1, 2, 3]',
          'numeros.append(4)',
          'print(numeros[0])',
          'print(len(numeros))'
        ],
        explanation: 'Las listas pueden crearse, modificarse y accederse por índice'
      }
    ]
  },
  {
    id: 'lesson-6',
    title: 'Diccionarios',
    description: 'Almacena datos con clave-valor',
    icon: '📖',
    xpReward: 85,
    exercises: [
      {
        type: 'multiple-choice',
        question: '¿Cómo se crea un diccionario en Python?',
        options: [
          'dict = []',
          'dict = ()',
          'dict = {}',
          'dict = <>'
        ],
        correctAnswer: 2,
        explanation: 'Los diccionarios se crean usando llaves {}'
      },
      {
        type: 'fill-in-blanks',
        question: 'Completa el código para acceder al valor de una clave',
        code: 'persona = {"nombre": "Ana"}\nprint(persona_____)',
        blanks: ['["nombre"]'],
        explanation: 'Accedemos a valores del diccionario usando la clave entre corchetes'
      },
      {
        type: 'code-execution',
        question: 'Crea un diccionario con la clave "edad" y valor 30, luego imprímelo',
        hint: 'Usa llaves {} y el formato clave: valor',
        expectedOutput: "{'edad': 30}",
        explanation: 'Los diccionarios almacenan pares clave-valor'
      }
    ]
  }
];