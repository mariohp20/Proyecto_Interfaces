import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const FillInBlanksExercise = ({ exercise, onAnswer, disabled }) => {
  // Inicializamos el estado de las respuestas
  const [userAnswers, setUserAnswers] = useState(
    exercise.blanks.map(() => '')
  );

  const isDisabled = disabled; 

  const handleChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };
  
  // Función de normalización
  const normalizeInput = (input) => {
    return String(input).trim().toLowerCase().replace(/['"]/g, '');
  };

  // Lógica de verificación
  const handleCheck = () => {
    let isCorrect = true;
    
    for (let i = 0; i < userAnswers.length; i++) {
        const userAnswer = normalizeInput(userAnswers[i]);
        const blankData = exercise.blanks[i]; 

        const correctOptions = Array.isArray(blankData) ? blankData : [blankData];

        const isAnswerValid = correctOptions.some(option => 
            normalizeInput(option) === userAnswer
        );

        if (!isAnswerValid) {
            isCorrect = false;
            break; 
        }
    }
    
    onAnswer(isCorrect);
  };
  
  const isButtonDisabled = isDisabled || userAnswers.some(ans => ans.trim() === '');
  
  const parts = exercise.code.split('___');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        // 💥 CAMBIO CLAVE: Usamos 'whitespace-pre-wrap' para respetar saltos de línea e indentación
        // Quitamos 'flex' y centramos el bloque contenedor, pero el texto interno es 'text-left' (estándar de código)
        className="p-8 rounded-xl border border-teal-200 bg-white/90 shadow-inner overflow-x-auto" 
      >
        <div className="font-mono text-xl text-slate-800 whitespace-pre-wrap leading-loose text-left inline-block min-w-full">
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {/* Renderizamos el texto del código */}
              <span>{part}</span>

              {/* Renderizamos el input si corresponde */}
              {index < parts.length - 1 && (
                // 💥 CAMBIO: 'inline-flex' y 'align-middle' para que se quede en su línea correcta
                <span className="inline-flex align-middle mx-2">
                  <Input 
                    type="text" 
                    value={userAnswers[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    disabled={isDisabled}
                    placeholder="..." 
                    // Ajustamos el ancho y padding para que se vea mejor integrado
                    className="w-32 text-center font-bold text-slate-900 border-2 border-teal-400 bg-teal-50 focus:border-teal-600 h-10" 
                  />
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      <Button
        onClick={handleCheck}
        disabled={isButtonDisabled}
        className="btn-primary w-full text-lg py-6"
      >
        Verificar Respuesta
      </Button>
    </div>
  );
};

export default FillInBlanksExercise;