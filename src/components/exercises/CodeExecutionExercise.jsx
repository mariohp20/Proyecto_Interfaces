// src/components/exercises/CodeExecutionExercise.jsx

import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react'; // 💥 Importar el Monaco Editor
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Loader2 } from 'lucide-react';
// Asumo que tiene un hook o una función global para Pyodide
// Reemplace con su implementación real para Pyodide
import { runPyodideCode } from '@/lib/pyodideUtils'; 
import { normalizeOutput } from '@/lib/utils';

const CodeExecutionExercise = ({ exercise, onAnswer, disabled }) => {
  // Inicializamos el código con el código inicial del ejercicio
  const [code, setCode] = useState(exercise.initialCode || '');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Asegura que el código se reinicie si el ejercicio cambia
  useEffect(() => {
    setCode(exercise.initialCode || '');
    setOutput('');
    setIsLoading(false);
    setHasChecked(false);
    setIsCorrect(false);
  }, [exercise]);


  const handleRunCode = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    setOutput('Ejecutando código...');

    try {
      // 💥 SIMULACIÓN DE EJECUCIÓN CON PYODIDE
      // Esta función debe encargarse de cargar Pyodide si es necesario 
      // y devolver la salida (stdout) o el error (stderr).
      const result = await runPyodideCode(code); 
      
      setOutput(result.output); // Mostrar la salida

      const normalizedUserOutput = normalizeOutput(result.output);
      const normalizedExpectedOutput = normalizeOutput(exercise.expectedOutput);
      
      // Lógica de validación
      const isCodeCorrect = normalizedUserOutput === normalizedExpectedOutput;      

      setIsCorrect(isCodeCorrect);
      setHasChecked(true);

      // Notificar a LessonPage sólo si la validación es final
      if (isCodeCorrect) {
          onAnswer(true); 
      }
      
    } catch (error) {
      setOutput(`Error de Ejecución: ${error.message || 'Código inválido'}`);
      setIsCorrect(false);
      setHasChecked(true);
      onAnswer(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorChange = (value) => {
    setCode(value);
    // Reiniciar la validación cuando el usuario cambia el código
    setHasChecked(false);
    setIsCorrect(false);
    setOutput('');
  };

  return (
    <div className="space-y-6">
      
      {/* 💥 MONACO EDITOR */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg shadow-xl overflow-hidden border border-gray-300"
      >
        <Editor
          height="300px"
          language="python"
          theme="vs-dark" // Tema oscuro que se ve bien en la interfaz PyLingo
          value={code}
          onChange={handleEditorChange}
          options={{
            readOnly: disabled,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            // Sin línea de fondo de código para minimizar la distracción
            lineNumbersMinChars: 3, 
          }}
        />
      </motion.div>
      
      {/* Botón de Ejecutar / Verificar */}
      <Button
        onClick={handleRunCode}
        disabled={isLoading || disabled}
        className="btn-primary w-full text-lg py-6 flex items-center justify-center space-x-2"
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {!isLoading && <Play className="w-5 h-5" />}
        <span>{isLoading ? 'Ejecutando...' : 'Ejecutar Código'}</span>
      </Button>

      {/* Panel de Consola (Output) */}
      <div className="p-4 rounded-lg bg-gray-900 text-white font-mono text-sm shadow-inner">
        <h4 className="font-bold text-teal-400 mb-2">Consola de Salida:</h4>
        <pre className="whitespace-pre-wrap break-words min-h-[40px] text-gray-300">
          {output || '// Presiona Ejecutar para ver la salida'}
        </pre>
      </div>

      {/* Feedback de la Corrección (Aparece si ya se verificó) */}
      {hasChecked && (
          <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-xl border-2 ${isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-red-500 bg-red-50'}`}
          >
              <p className={`font-semibold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isCorrect ? '✅ ¡Solución Correcta! Puedes continuar.' : `❌ Incorrecto. Output Esperado: ${exercise.expectedOutput}`}
              </p>
          </motion.div>
      )}
    </div>
  );
};

export default CodeExecutionExercise;