import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, Star, BookOpen, Lock, CheckCircle, Play, Trophy, Medal, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { lessonsData } from '@/data/lessonsData';
import ThemeToggle from '@/components/ThemeToggle';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  // Calcular progreso
  const completedLessonsCount = user.completedLessons?.length || 0;
  const totalLessons = lessonsData.length;
  const progressPercentage = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

  // Función para verificar si una lección está desbloqueada
  const isLessonUnlocked = (lessonIndex) => {
    // La primera lección siempre está desbloqueada
    if (lessonIndex === 0) return true;
    
    // Las demás se desbloquean si la anterior está completada
    const previousLesson = lessonsData[lessonIndex - 1];
    return user.completedLessons?.some(
      completed => completed.lessonId === previousLesson.id
    );
  };

  // Función para verificar si una lección está completada
  const isLessonCompleted = (lessonId) => {
    return user.completedLessons?.some(
      completed => completed.lessonId === lessonId
    );
  };

  // Obtener puntuación de una lección completada
  const getLessonScore = (lessonId) => {
    const completed = user.completedLessons?.find(
      completed => completed.lessonId === lessonId
    );
    return completed?.score || 0;
  };

  const handleLessonClick = (lesson, index) => {
    if (isLessonUnlocked(index)) {
      navigate(`/lesson/${lesson.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 transition-colors duration-500">
      {/* Header de Navegación */}
      <nav className="glass-effect sticky top-0 z-50 border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold gradient-text cursor-pointer" onClick={() => navigate('/dashboard')}>🐍 PyLingo</h1>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              
              {/* 🔥 Indicador de Racha */}
              <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-md border border-orange-400" title="Días seguidos aprendiendo">
                <Flame className="w-5 h-5 fill-white animate-pulse" />
                <span className="font-bold">{user.streak || 0} días</span>
              </div>

              {/* Nivel */}
              <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full">
                <Star className="w-5 h-5" />
                <span className="font-bold">Nivel {user.level}</span>
              </div>

              {/* XP */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full">
                <span className="font-bold">{user.xp} XP</span>
              </div>

              <ThemeToggle />

              {/* Avatar y Menú de Usuario */}
              <div className="flex items-center gap-3 pl-2 border-l border-gray-300/50">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-emerald-500 object-cover"
                />
                <Button
                  variant="ghost"
                  onClick={() => navigate('/profile')} // Asumiendo que tienes una página de perfil o placeholder
                  className="text-slate-700 hover:text-emerald-600 px-2"
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="text-slate-700 hover:text-red-600 px-2"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="container mx-auto px-6 py-8">
        {/* Sección de Bienvenida */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-slate-800 mb-2">
            ¡Hola, {user.name}! 👋
          </h2>
          <p className="text-lg text-slate-600">
            Continúa tu viaje de aprendizaje en Python
          </p>
        </motion.div>

        {/* Tarjetas de Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card Nivel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-2xl p-6 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold gradient-text mb-1">
              Nivel {user.level}
            </div>
            <p className="text-sm text-slate-600">
              {user.xp % 100} / 100 XP para siguiente nivel
            </p>
          </motion.div>

          {/* Card Lecciones */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-6 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold gradient-text mb-1">
              {completedLessonsCount} / {totalLessons}
            </div>
            <p className="text-sm text-slate-600">Lecciones completadas</p>
          </motion.div>

          {/* Card XP Total */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-6 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Star className="w-8 h-8 text-white fill-white" />
            </div>
            <div className="text-3xl font-bold gradient-text mb-1">
              {user.xp} XP
            </div>
            <p className="text-sm text-slate-600">Experiencia total</p>
          </motion.div>
        </div>

        {/* 🏆 SECCIÓN DE COMPETENCIA Y LOGROS (GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* 1. Tarjeta Leaderboard */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-3xl border-2 border-amber-200 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate('/leaderboard')}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <Trophy className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-900">Tabla de Posiciones</h3>
                  <p className="text-sm text-amber-700">¡Compite y sube de nivel!</p>
                </div>
              </div>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 shadow-md">
                Ver Ranking
              </Button>
            </motion.div>

            {/* 2. Tarjeta Logros */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-3xl border-2 border-purple-200 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate('/achievements')}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <Medal className="w-8 h-8 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-900">Mis Logros</h3>
                  <p className="text-sm text-purple-700">Colecciona medallas</p>
                </div>
              </div>
              <Button className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl px-4 shadow-md">
                Ver Medallas
              </Button>
            </motion.div>

        </div>

        {/* Barra de progreso general */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl p-6 mb-8 border border-white/40"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-slate-800">
              Tu Progreso General
            </h3>
            <span className="text-sm font-semibold text-emerald-600">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
            />
          </div>
        </motion.div>

        {/* Lecciones */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            📚 Lecciones Disponibles
          </h3>
          <p className="text-slate-600 mb-6">
            Completa las lecciones en orden para desbloquear nuevos contenidos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessonsData.map((lesson, index) => {
            const isUnlocked = isLessonUnlocked(index);
            const isCompleted = isLessonCompleted(lesson.id);
            const score = getLessonScore(lesson.id);

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={isUnlocked ? { scale: 1.03, y: -5 } : {}}
                onClick={() => handleLessonClick(lesson, index)}
                className={`
                  glass-effect rounded-2xl p-6 transition-all duration-300 border-2
                  ${isUnlocked 
                    ? 'cursor-pointer hover:shadow-2xl' 
                    : 'opacity-60 cursor-not-allowed bg-gray-50'
                  }
                  ${isCompleted 
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50/50 to-teal-50/50' 
                    : 'border-transparent hover:border-blue-200'
                  }
                `}
              >
                {/* Header de la card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl filter drop-shadow-sm">{lesson.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg leading-tight">
                        {lesson.title}
                      </h4>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mt-1">
                        {lesson.difficulty}
                      </p>
                    </div>
                  </div>
                  
                  {/* Icono de estado */}
                  <div>
                    {isCompleted ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    ) : isUnlocked ? (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md animate-pulse">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center shadow-inner">
                        <Lock className="w-5 h-5 text-slate-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-slate-600 text-sm mb-4 min-h-[40px]">
                  {lesson.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-200/50 pt-4">
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="font-bold text-sm">+{lesson.xpReward} XP</span>
                  </div>

                  {isCompleted && (
                    <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      {score*10}/{lesson.exercises.length * 10} pts
                    </div>
                  )}

                  {!isUnlocked && (
                    <div className="text-sm font-medium text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Bloqueado
                    </div>
                  )}
                </div>

                {/* Barra de progreso individual (si está en progreso pero no completada) */}
                {isUnlocked && !isCompleted && (
                  <div className="mt-4">
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-gradient-to-r from-blue-500 to-cyan-500" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1 text-center">
                      {lesson.exercises.length} ejercicios
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Mensaje motivacional */}
        {completedLessonsCount > 0 && completedLessonsCount < totalLessons && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 glass-effect rounded-2xl p-6 text-center border border-white/50"
          >
            <p className="text-lg text-slate-700">
              🎉 ¡Vas genial! Has completado {completedLessonsCount} de {totalLessons} lecciones.
              <br />
              <span className="font-bold gradient-text">
                ¡Continúa aprendiendo para desbloquear más contenido!
              </span>
            </p>
          </motion.div>
        )}

        {/* Mensaje de finalización */}
        {completedLessonsCount === totalLessons && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 glass-effect rounded-2xl p-8 text-center bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-500 shadow-xl"
          >
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h3 className="text-2xl font-bold gradient-text mb-2">
              ¡Felicidades! Has completado todas las lecciones
            </h3>
            <p className="text-slate-700 font-medium">
              Eres un maestro de Python. ¡Sigue practicando para mantener tu racha!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;