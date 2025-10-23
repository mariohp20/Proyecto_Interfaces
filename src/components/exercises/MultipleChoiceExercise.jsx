import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const MultipleChoiceExercise = ({ exercise, onAnswer, disabled }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    onAnswer(selectedOption === exercise.correctAnswer);
  };

  return (
    <div className="space-y-4">
      {exercise.options.map((option, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          onClick={() => !disabled && setSelectedOption(index)}
          className={`w-full p-4 rounded-2xl text-left font-medium transition-all ${
            selectedOption === index
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
              : 'bg-white/50 hover:bg-white/70 text-slate-700'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedOption === index ? 'border-white bg-white' : 'border-slate-300'
            }`}>
              {selectedOption === index && (
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              )}
            </div>
            <span>{option}</span>
          </div>
        </motion.button>
      ))}
      
      {!disabled && (
        <Button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className="w-full btn-primary mt-6"
        >
          Verificar Respuesta
        </Button>
      )}
    </div>
  );
};

export default MultipleChoiceExercise;