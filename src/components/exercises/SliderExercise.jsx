// src/components/exercises/SliderExercise.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider'; // Asumo que existe

// NOTA IMPORTANTE: Para la simulación, usaremos una función simple de evaluación.
// Para lógica más compleja (como la de los condicionales), Pyodide sería la opción real, 
// pero usaremos una función utilitaria simple por ahora.

/**
 * Función utilitaria para simular la ejecución de código simple (como un evaluador).
 * Nota: Esto no es Pyodide, es una simulación de JS simple.
 */
const evaluateCode = (code, variableName, variableValue, targetOutput) => {
    // 1. Reemplazar la variable en el código
    const codeWithVar = code.replace(new RegExp(variableName, 'g'), variableValue);
    
    // 2. Intentar ejecutar la lógica (¡MUY simplificado y limitado!)
    // Esto es solo para ejemplos sencillos como 'X * 2' o condiciones simples.
    // Usaremos la función para Condicionales de la lección 3:
    // Ex: if temperatura > 25: print("Hace calor")...

    // Si el objetivo es verificar el output (ejemplo de la Lección 6), 
    // la simulación debe ser más sofisticada, pero para Sliders, verificaremos el valor final.

    // Para la Lección 3 (Condicionales): Simulamos la evaluación del flujo
    if (code.includes('if')) {
        let output = '';
        const temp = variableValue; // 'temperatura'
        
        // Simulación de la lógica de la Lección 3
        if (temp > 25) {
            output = 'Hace calor';
        } else if (temp > 15) {
            output = 'Es cálido';
        } else {
            output = 'Hace frío';
        }
        
        return output;
    }
    
    // Para la Lección 7 (Strings/Índice): Evaluar el índice de un string
    if (code.includes('palabra[indice]')) {
        const palabra = 'PyLingo';
        if (variableValue >= 0 && variableValue < palabra.length) {
            return palabra[variableValue];
        }
        return 'Índice fuera de rango';
    }

    return "Resultado no simulado"; // Fallback
};

const SliderExercise = ({ exercise, onAnswer, disabled }) => {
    // Inicializar el valor del slider al mínimo o al valor central si no hay un valor de inicio
    const [sliderValue, setSliderValue] = useState(exercise.minValue || 0);
    const [currentOutput, setCurrentOutput] = useState('');
    const [hasChecked, setHasChecked] = useState(false);
    
    // 1. Evaluar el código cada vez que el slider cambia
    useEffect(() => {
        // Ejecución simulada con el valor actual del slider
        const output = evaluateCode(
            exercise.code, 
            exercise.variableName, 
            sliderValue, 
            exercise.targetOutput // o exercise.correctRange
        );
        setCurrentOutput(output);
    }, [sliderValue, exercise]);

    // 2. Lógica de Verificación (Evaluación)
    const handleCheck = () => {
        let isCorrect = false;
        
        // Si la respuesta es un rango (Lección 3: temperatura entre 16 y 25)
        if (exercise.correctRange) {
            const [min, max] = exercise.correctRange;
            isCorrect = sliderValue >= min && sliderValue <= max;
        } 
        // Si la respuesta es un valor exacto (Lección 7: índice = 2 para 'L')
        else if (exercise.targetOutput) {
            isCorrect = currentOutput === exercise.targetOutput;
        }

        setHasChecked(true);
        onAnswer(isCorrect); // Notificar a LessonPage
    };
    
    // 3. Renderizado del Código (Resaltando la variable)
    const renderCode = useMemo(() => {
        if (!exercise.code) return null;
        
        // Usamos una expresión regular para encontrar y envolver la variable
        const parts = exercise.code.split(new RegExp(`(${exercise.variableName})`, 'g'));
        
        return (
            <code className="font-mono text-lg whitespace-pre-wrap">
                {parts.map((part, index) => {
                    if (part === exercise.variableName) {
                        return (
                            <span 
                                key={index} 
                                // 💥 Resaltamos el valor actual inyectado por el slider
                                className="font-bold text-lg bg-yellow-200 text-slate-900 px-1 rounded-sm transition-colors"
                            >
                                {sliderValue}
                            </span>
                        );
                    }
                    return <span key={index}>{part}</span>;
                })}
            </code>
        );
    }, [exercise.code, exercise.variableName, sliderValue]);

    const isButtonDisabled = disabled || hasChecked;

    return (
        <div className="space-y-6">
            
            {/* 💥 ÁREA DE CÓDIGO Y SLIDER */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl border border-blue-200 bg-white shadow-xl space-y-6"
            >
                {/* Visualizador de Código */}
                <div className="bg-gray-800 p-4 rounded-lg text-white font-mono text-sm shadow-inner">
                    {renderCode}
                </div>

                {/* SLIDER INTERACTIVO */}
                <div className="pt-4 px-4">
                    <label className="block text-slate-700 font-semibold mb-3">
                        {exercise.variableName} = <span className="text-2xl font-bold text-teal-600">{sliderValue}</span>
                    </label>
                    <Slider
                        defaultValue={[sliderValue]}
                        min={exercise.minValue}
                        max={exercise.maxValue}
                        step={1}
                        onValueChange={(value) => setSliderValue(value[0])}
                        disabled={disabled}
                        className="w-full"
                    />
                </div>
            </motion.div>
            
            {/* 💥 OUTPUT DE LA SIMULACIÓN */}
            <div className="mt-6 p-4 rounded-xl border-2 border-dashed border-gray-300 bg-slate-50">
                <p className="text-sm font-semibold text-slate-600 mb-1">Resultado de la Ejecución:</p>
                <code className="block p-3 bg-white border border-gray-200 rounded text-slate-900 font-mono">
                    {currentOutput || 'Esperando valor...'}
                </code>
            </div>

            <Button
                onClick={handleCheck}
                disabled={isButtonDisabled}
                className="btn-primary w-full text-lg py-6"
            >
                Verificar Resultado
            </Button>
            
            {hasChecked && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center text-sm ${onAnswer ? 'text-emerald-600' : 'text-red-600'}`}
                >
                    {exercise.explanation}
                </motion.p>
            )}
        </div>
    );
};

export default SliderExercise;