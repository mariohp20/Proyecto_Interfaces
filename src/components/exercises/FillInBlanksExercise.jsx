import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FillInBlanksExercise = ({ exercise, onAnswer, disabled }) => {
  const [answers, setAnswers] = useState(exercise.blanks.map(() => ''));

  const handleSubmit = () => {
    const isCorrect = answers.every((answer, index) => 
      answer.trim().toLowerCase() === exercise.blanks[index].toLowerCase()
    );
    onAnswer(isCorrect);
  };

  const codeParts = exercise.code.split('_____');

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm">
        <pre className="text-emerald-400">
          {codeParts.map((part, index) => (
            <span key={index}>
              {part}
              {index < codeParts.length - 1 && (
                <Input
                  value={answers[index]}
                  onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[index] = e.target.value;
                    setAnswers(newAnswers);
                  }}
                  disabled={disabled}
                  className="inline-block w-32 mx-2 bg-slate-800 border-emerald-500 text-white"
                  placeholder="..."
                />
              )}
            </span>
          ))}
        </pre>
      </div>

      {!disabled && (
        <Button
          onClick={handleSubmit}
          disabled={answers.some(a => !a.trim())}
          className="w-full btn-primary"
        >
          Verificar Respuesta
        </Button>
      )}
    </div>
  );
};

export default FillInBlanksExercise;