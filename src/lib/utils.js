import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

// En src/lib/utils.js (o al inicio de DragDropExercise.jsx)

/**
 * Función Fisher-Yates (o Kuth-Yates) para desordenar un array.
 * @param {Array} array Array a desordenar.
 * @returns {Array} Nuevo array desordenado.
 */
export const shuffleArray = (array) => {
  // Creamos una copia para no mutar el array original
  const shuffledArray = [...array]; 
  
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Escogemos un elemento al azar
    const j = Math.floor(Math.random() * (i + 1));
    // Intercambiamos
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

/**
 * Normaliza una cadena de texto para hacerla tolerante a variaciones comunes
 * en código (espacios, comillas, case).
 * @param {string} text Texto a normalizar.
 * @returns {string} Texto normalizado.
 */
export const normalizeOutput = (text) => {
    if (!text) return '';
    
    // 1. Convertir a minúsculas (ignorando mayúsculas/minúsculas)
    let normalized = text.toLowerCase();
    
    // 2. Quitar espacios en blanco al inicio/final de cada línea y múltiples espacios
    normalized = normalized.trim().replace(/\s+/g, ' '); 
    
    // 3. Estandarizar comillas (reemplazar comillas simples con dobles o viceversa)
    // Usaremos comillas dobles como estándar para evitar confusión con el apóstrofe en "don't"
    normalized = normalized.replace(/'/g, '"'); 
    
    // 4. Quitar saltos de línea y tabulaciones si la comparación debe ser en una sola línea
    // Esto es útil si esperamos una salida simple, no un bloque de código
    normalized = normalized.replace(/[\r\n\t]/g, ''); 
    
    // 5. Normalizar la representación de números y booleanos (ej. '1.0' == '1', 'True' == 'true')
    // Esto es muy complejo para una función genérica, por ahora nos enfocaremos en texto y espacios.
    
    return normalized;
};