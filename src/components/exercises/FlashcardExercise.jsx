import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCw, Check, X, HelpCircle } from 'lucide-react';

const FlashcardExercise = ({ exercise, onAnswer, disabled }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Manejar el giro de la tarjeta
  const handleFlip = () => {
    if (!hasAnswered) {
      setIsFlipped(!isFlipped);
    }
  };

  // El usuario indica si sabía la respuesta o no
  const handleSelfRate = (knewIt) => {
    setHasAnswered(true);
    if (!isFlipped) setIsFlipped(true);
    
    // En flashcards, la honestidad del usuario determina el score
    onAnswer(knewIt);
  };

  return (
    <div className="flex flex-col items-center space-y-8 py-4">
      
      {/* CONTENEDOR 3D */}
      <div 
        className="w-full max-w-lg h-72 cursor-pointer group perspective-1000" 
        onClick={handleFlip}
        style={{ perspective: '1000px' }} // Asegura la profundidad 3D
      >
        <motion.div
          className="relative w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* =======================================================
              CARA FRONTAL (PREGUNTA)
             ======================================================= */}
          <div 
            className="absolute inset-0 w-full h-full rounded-2xl shadow-xl border-2 border-slate-100 overflow-hidden"
            style={{ 
                backfaceVisibility: 'hidden', // 💥 CLAVE: Oculta esto cuando gira
                WebkitBackfaceVisibility: 'hidden',
                backgroundColor: 'white',     // 💥 CLAVE: Fondo sólido para que no trasluzca
                zIndex: 2 
            }}
          >
            <div className="h-full bg-gradient-to-br from-slate-50 to-white flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <HelpCircle className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {exercise.question || "Pregunta"}
                </h3>
                <p className="text-2xl font-medium text-slate-600 mt-2">
                    {exercise.front}
                </p>
                <p className="absolute bottom-6 text-sm text-slate-400 flex items-center gap-2 animate-pulse">
                    <RotateCw className="w-4 h-4" /> Haz clic para ver la respuesta
                </p>
            </div>
          </div>

          {/* =======================================================
              CARA TRASERA (RESPUESTA)
             ======================================================= */}
          <div 
            className="absolute inset-0 w-full h-full rounded-2xl shadow-xl overflow-hidden border-2 border-emerald-100"
            style={{ 
                transform: 'rotateY(180deg)', // Ya rotado 180 grados
                backfaceVisibility: 'hidden', // 💥 CLAVE: Invisible hasta que gire
                WebkitBackfaceVisibility: 'hidden',
                backgroundColor: 'white'      // Fondo sólido
            }} 
          >
            <div className="h-full bg-gradient-to-br from-emerald-50 to-white flex flex-col items-center justify-center p-8 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4 bg-emerald-100 px-3 py-1 rounded-full">
                    Respuesta Correcta
                </span>
                <h3 className="text-3xl font-bold text-emerald-800 mb-4">
                    {exercise.back}
                </h3>
                {exercise.explanation && (
                    <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                        {exercise.explanation}
                    </p>
                )}
            </div>
          </div>

        </motion.div>
      </div>

      {/* Controles de Autoevaluación (Solo aparecen al girar) */}
      <div className="h-20 w-full max-w-md flex justify-center items-end">
        {!hasAnswered && isFlipped && (
            <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 w-full"
            >
            <Button 
                onClick={(e) => { e.stopPropagation(); handleSelfRate(false); }}
                className="flex-1 bg-white hover:bg-red-50 text-red-600 border-2 border-red-100 py-6 text-lg shadow-sm hover:shadow-md transition-all"
            >
                <X className="w-5 h-5 mr-2" />
                No la sabía
            </Button>
            <Button 
                onClick={(e) => { e.stopPropagation(); handleSelfRate(true); }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white border-2 border-emerald-500 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
                <Check className="w-5 h-5 mr-2" />
                ¡La sabía!
            </Button>
            </motion.div>
        )}

        {/* Mensaje después de responder */}
        {hasAnswered && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-slate-500 italic bg-slate-100 px-4 py-2 rounded-lg"
            >
            Respuesta registrada. ¡Sigue así!
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default FlashcardExercise;