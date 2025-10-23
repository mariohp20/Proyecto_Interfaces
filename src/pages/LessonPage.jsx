import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { lessonsData } from '@/data/lessonsData';
import { updateUserProgress } from '@/services/api';
import MultipleChoiceExercise from '@/components/exercises/MultipleChoiceExercise';
import FillInBlanksExercise from '@/components/exercises/FillInBlanksExercise';
import CodeExecutionExercise from '@/components/exercises/CodeExecutionExercise';
import DragDropExercise from '@/components/exercises/DragDropExercise';

const LessonPage = ({ user, updateUser }) => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const lesson = lessonsData.find(l => l.id === lessonId);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Lección no encontrada</h2>
          <Button onClick={() => navigate('/dashboard')}>Volver al Dashboard</Button>
        </div>
      </div>
    );
  }

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / lesson.exercises.length) * 100;

  const handleAnswer = (correct) => {
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 1);
      toast({
        title: "¡Correcto! 🎉",
        description: "¡Excelente trabajo!",
      });
    } else {
      toast({
        title: "Revisa la sintaxis 👀",
        description: currentExercise.explanation || "Intenta de nuevo",
        variant: "destructive"
      });
    }
  };

  const handleNext = async () => {
    setShowResult(false);
    
    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Lección completada - guardar en MongoDB
      try {
        const finalScore = score;
        const xpGained = lesson.xpReward || 50;
        
        // Verificar si ya completó esta lección
        const alreadyCompleted = user.completedLessons?.some(
          l => l.lessonId === lessonId
        );
        
        if (!alreadyCompleted) {
          // Actualizar progreso en MongoDB
          const updatedUser = await updateUserProgress(
            user.email,
            lessonId,
            finalScore,
            xpGained
          );
          
          // Actualizar el estado del usuario en el frontend
          if (updateUser) {
            updateUser(updatedUser);
          }
          
          toast({
            title: "¡Progreso guardado! 💾",
            description: `Has ganado ${xpGained} XP`,
          });
        }
        
        setLessonCompleted(true);
      } catch (error) {
        console.error('Error guardando progreso:', error);
        toast({
          title: "Error guardando progreso",
          description: "Pero completaste la lección correctamente",
          variant: "destructive"
        });
        setLessonCompleted(true);
      }
    }
  };

  const renderExercise = () => {
    switch (currentExercise.type) {
      case 'multiple-choice':
        return <MultipleChoiceExercise exercise={currentExercise} onAnswer={handleAnswer} disabled={showResult} />;
      case 'fill-in-blanks':
        return <FillInBlanksExercise exercise={currentExercise} onAnswer={handleAnswer} disabled={showResult} />;
      case 'code-execution':
        return <CodeExecutionExercise exercise={currentExercise} onAnswer={handleAnswer} disabled={showResult} />;
      case 'drag-drop':
        return <DragDropExercise exercise={currentExercise} onAnswer={handleAnswer} disabled={showResult} />;
      default:
        return null;
    }
  };

  if (lessonCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-effect rounded-3xl p-12 text-center max-w-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="w-16 h-16 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-4 gradient-text">¡Lección Completada! 🎉</h1>
          <p className="text-xl text-slate-600 mb-6">
            Obtuviste {score} de {lesson.exercises.length} respuestas correctas
          </p>
          
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-amber-600 mb-8">
            <Star className="w-8 h-8" />
            <span>+{lesson.xpReward || 50} XP</span>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6">
            <p className="text-lg font-semibold text-slate-700">Tu progreso:</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">{user.level || 1}</p>
                <p className="text-sm text-slate-600">Nivel</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">{user.xp || 0}</p>
                <p className="text-sm text-slate-600">XP Total</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">{user.completedLessons?.length || 0}</p>
                <p className="text-sm text-slate-600">Lecciones</p>
              </div>
            </div>
          </div>

          <Button onClick={() => navigate('/dashboard')} className="btn-primary text-lg px-8 py-6">
            Volver al Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="glass-effect sticky top-0 z-50 border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">{lesson.title}</h1>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExerciseIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-effect rounded-3xl p-8"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  Ejercicio {currentExerciseIndex + 1} de {lesson.exercises.length}
                </span>
                <div className="flex items-center gap-2 text-amber-600 font-semibold">
                  <Star className="w-5 h-5" />
                  <span>+10 XP</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">{currentExercise.question}</h2>
              {currentExercise.hint && (
                <p className="text-slate-600">💡 {currentExercise.hint}</p>
              )}
            </div>

            {renderExercise()}

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-6 rounded-2xl ${
                  isCorrect 
                    ? 'bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-300' 
                    : 'bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {isCorrect ? (
                    <Check className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <X className="w-8 h-8 text-red-600" />
                  )}
                  <h3 className="text-xl font-bold">
                    {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                  </h3>
                </div>
                {currentExercise.explanation && (
                  <p className="text-slate-700">{currentExercise.explanation}</p>
                )}
                <Button onClick={handleNext} className="btn-primary mt-4">
                  {currentExerciseIndex < lesson.exercises.length - 1 ? 'Siguiente' : 'Finalizar'}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LessonPage;