import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { lessonsData } from '@/data/lessonsData';
import { updateUserProgress } from '@/services/api';

// Componentes de Ejercicio
import MultipleChoiceExercise from '@/components/exercises/MultipleChoiceExercise';
import FillInBlanksExercise from '@/components/exercises/FillInBlanksExercise';
import CodeExecutionExercise from '@/components/exercises/CodeExecutionExercise';
import DragDropExercise from '@/components/exercises/DragDropExercise';
import MatchingExercise from '@/components/exercises/MatchingExercise'; 
import SliderExercise from '@/components/exercises/SliderExercise';
import FlashcardExercise from '@/components/exercises/FlashcardExercise';

// Componentes de Apoyo
import LessonTheory from '@/components/LessonTheory'; 
import LessonAssistant from '@/components/LessonAssistant'; 
import Confetti from 'react-confetti';

// Sonidos
const correctSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
const incorrectSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
const fanfareSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');

const LessonPage = ({ user, updateUser }) => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  
  const [theoryCompleted, setTheoryCompleted] = useState(false); 
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);

  const lesson = lessonsData.find(l => l.id === lessonId);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Lección no encontrada</h2>
          <Button onClick={() => navigate('/dashboard')}>Volver al Dashboard</Button>
        </div>
      </div>
    );
  }

  // Si hay teoría y no se ha completado, mostramos el componente de Teoría
  if (lesson.theory && !theoryCompleted) {
    return (
      <LessonTheory 
        lesson={lesson} 
        onComplete={() => setTheoryCompleted(true)} 
      />
    );
  }

  const currentExercise = lesson.exercises[currentExerciseIndex];
  // Cálculo de progreso (0 a 100)
  const progress = ((currentExerciseIndex) / lesson.exercises.length) * 100;

  const handleAnswer = (correct) => {
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 1);
      correctSound.play().catch(e => console.error(e));
      toast({ title: "¡Correcto! 🎉", description: "¡Excelente trabajo!" });
    } else {
      incorrectSound.play().catch(e => console.error(e));
      if (currentExercise.type === 'flashcard') {
         toast({ title: "A repasar 📚", description: "Sigue practicando.", variant: "default" });
      } else {
         toast({ title: "Incorrecto 👀", description: currentExercise.explanation, variant: "destructive" });
      }
    }
  };

  const handleNext = async () => {
    setShowResult(false);
    
    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // --- LECCIÓN COMPLETADA ---
      try {
        const finalScore = score;
        const xpGained = lesson.xpReward || 50;
        
        const data = await updateUserProgress(user.email, lessonId, finalScore, xpGained);
        
        if (updateUser && data.user) {
          updateUser(data.user);
        }

        if (data.newAchievements && data.newAchievements.length > 0) {
            setNewAchievements(data.newAchievements);
            toast({
                title: "🏆 ¡Nuevo Logro!",
                description: "Revisa tu perfil.",
                className: "bg-yellow-100 border-yellow-400 text-yellow-800"
            });
        }
        
        if (data.newAchievements?.length > 0 || !user.completedLessons?.some(l => l.lessonId === lessonId)) {
             fanfareSound.play().catch(e => console.error(e));
             toast({ title: "¡Progreso guardado!", description: `Has ganado +${xpGained} XP` });
        }
        
        setLessonCompleted(true);
      } catch (error) {
        console.error('Error:', error);
        setLessonCompleted(true); // Permitir terminar aunque falle el guardado
      }
    }
  };

  const renderExercise = () => {
    switch (currentExercise.type) {
      case 'multiple-choice': return <MultipleChoiceExercise exercise={currentExercise} onAnswer={handleAnswer} disabled={showResult} />;
      case 'fill-in-blanks': return <FillInBlanksExercise exercise={currentExercise} onAnswer={handleAnswer} disabled={showResult} />;
      case 'code-execution': return <CodeExecutionExercise exercise={currentExercise} onAnswer={handleAnswer} disabled={showResult} />;
      case 'drag-drop': return <DragDropExercise exercise={currentExercise} onAnswer={handleAnswer} disabled={showResult} />;
      case 'matching': return <MatchingExercise exercise={currentExercise} onAnswer={handleAnswer} disabled={showResult} />;
      case 'slider': return <SliderExercise exercise={currentExercise} onAnswer={handleAnswer} disabled={showResult} />;
      case 'flashcard': return <FlashcardExercise exercise={currentExercise} onAnswer={handleAnswer} disabled={showResult} />;
      default: return null;
    }
  };

  // --- PANTALLA DE ÉXITO ---
  if (lessonCompleted) {
    const { innerWidth: width, innerHeight: height } = window; 
    return (
      // 💥 FONDO OSCURO EN PANTALLA DE ÉXITO
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-gray-950"> 
        <Confetti width={width} height={height} recycle={false} numberOfPieces={500} colors={['#10b981', '#0d9488', '#fbbf24']} />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-effect rounded-3xl p-12 text-center max-w-2xl z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl border border-white/50 dark:border-slate-700"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Trophy className="w-16 h-16 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-4 gradient-text">¡Lección Completada! 🎉</h1>
          
          {newAchievements.length > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-xl">
                  <p className="text-yellow-800 dark:text-yellow-200 font-bold">¡Has desbloqueado {newAchievements.length} nuevo(s) logro(s)! 🏅</p>
              </div>
          )}

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            Obtuviste {score} de {lesson.exercises.length} respuestas correctas
          </p>
          
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-amber-600 dark:text-amber-400 mb-8">
            <Star className="w-8 h-8 fill-amber-500" />
            <motion.span
                key={user.xp} 
                initial={{ scale: 1.5, color: '#fbbf24' }} 
                animate={{ scale: 1, color: '#059669' }} 
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              +{lesson.xpReward || 50} XP
            </motion.span>
          </div>

          <Button onClick={() => navigate('/dashboard')} className="btn-primary text-lg px-8 py-6 w-full shadow-lg hover:shadow-xl">
            Volver al Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  // --- PANTALLA DE EJERCICIOS ---
  return (
    // 💥 FONDO OSCURO PRINCIPAL (Soluciona el fondo blanco)
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-gray-950 transition-colors duration-500">
      
      {/* Navegación */}
      <nav className="glass-effect sticky top-0 z-50 border-b border-white/20 dark:border-slate-700/50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50"
            >
              {/* 💥 FLECHA ADAPTABLE */}
              <ArrowLeft className="w-5 h-5 text-slate-800 dark:text-slate-200" />
            </Button>
            {/* 💥 TÍTULO ADAPTABLE */}
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{lesson.title}</h1>
          </div>
          {/* Barra de progreso */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
             <div 
               className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
               style={{ width: `${progress}%` }}
             />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExerciseIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            // 💥 TARJETA DE EJERCICIO ADAPTABLE
            className="glass-effect rounded-3xl p-8 shadow-xl border border-white/40 dark:border-slate-700 bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ejercicio {currentExerciseIndex + 1} de {lesson.exercises.length}
                </span>
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>+{lesson.xpReward ? Math.round(lesson.xpReward / lesson.exercises.length) : 10} XP</span>
                </div>
              </div>
              
              {/* 💥 PREGUNTA ADAPTABLE */}
              <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">
                {currentExercise.question}
              </h2>
            </div>

            <div className="min-h-[200px]">
                {renderExercise()}
            </div>

            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <LessonAssistant 
                    exercise={currentExercise}
                    user={user}
                    updateUser={updateUser}
                />
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-6 rounded-2xl shadow-md border ${
                  isCorrect 
                    ? 'bg-emerald-100/50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700' 
                    : 'bg-red-100/50 dark:bg-red-900/30 border-red-300 dark:border-red-700'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {isCorrect ? (
                    <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-emerald-950 rounded-full p-1 shadow-sm" />
                  ) : (
                    currentExercise.type === 'flashcard' 
                        ? <div className="text-2xl">📚</div> 
                        : <X className="w-8 h-8 text-red-600 dark:text-red-400 bg-white dark:bg-red-950 rounded-full p-1 shadow-sm" />
                  )}
                  <h3 className={`text-xl font-bold ${isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {isCorrect ? '¡Bien hecho!' : (currentExercise.type === 'flashcard' ? 'A repasar este concepto' : 'Incorrecto')}
                  </h3>
                </div>
                {currentExercise.explanation && (
                  <p className="text-slate-700 dark:text-slate-300 mt-2 ml-11">{currentExercise.explanation}</p>
                )}
                <div className="flex justify-end mt-4">
                    <Button onClick={handleNext} className="btn-primary px-8 py-2 text-lg shadow-lg hover:shadow-xl">
                    {currentExerciseIndex < lesson.exercises.length - 1 ? 'Siguiente Ejercicio' : 'Finalizar Lección'}
                    </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LessonPage;