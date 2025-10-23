import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GripVertical } from 'lucide-react';

const DragDropExercise = ({ exercise, onAnswer, disabled }) => {
  const [lines, setLines] = useState([...exercise.lines].sort(() => Math.random() - 0.5));
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newLines = [...lines];
    const draggedLine = newLines[draggedIndex];
    newLines.splice(draggedIndex, 1);
    newLines.splice(index, 0, draggedLine);
    
    setLines(newLines);
    setDraggedIndex(index);
  };

  const handleSubmit = () => {
    const isCorrect = lines.every((line, index) => line === exercise.lines[index]);
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 rounded-2xl p-4 space-y-2">
        {lines.map((line, index) => (
          <motion.div
            key={index}
            draggable={!disabled}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            className={`bg-slate-800 rounded-xl p-3 flex items-center gap-3 ${
              disabled ? 'cursor-not-allowed' : 'cursor-move'
            }`}
          >
            <GripVertical className="w-5 h-5 text-slate-500" />
            <code className="text-emerald-400 font-mono text-sm flex-1">{line}</code>
          </motion.div>
        ))}
      </div>

      {!disabled && (
        <Button onClick={handleSubmit} className="w-full btn-primary">
          Verificar Orden
        </Button>
      )}
    </div>
  );
};

export default DragDropExercise;