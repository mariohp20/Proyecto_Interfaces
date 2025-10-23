import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Flame, Star, Code, Lock, CheckCircle, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { lessonsData } from '@/data/lessonsData';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    const storedUser = localStorage.getItem('pylingo_user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const completedLessons = userData?.completedLessons || [];
  const totalLessons = lessonsData.length;
  const progressPercentage = (completedLessons.length / totalLessons) * 100;

  const handleLessonClick = (lessonId, isLocked) => {
    if (isLocked) return;
    navigate(`/lesson/${lessonId}`);
  };

  return (
    <div className="min-h-screen pb-20">
      <nav className="glass-effect sticky top-0 z-50 border-b border-white/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-3xl">🐍</div>
            <span className="text-2xl font-bold gradient-text">PyLingo</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full font-semibold">
              <Flame className="w-5 h-5" />
              <span>{userData?.streak || 0} días</span>
            </div>
            
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-full font-semibold">
              <Star className="w-5 h-5" />
              <span>{userData?.xp || 0} XP</span>
            </div>

            <Button
              onClick={() => navigate('/profile')}
              variant="ghost"
              className="rounded-full"
            >
              <User className="w-5 h-5" />
            </Button>

            <Button
              onClick={onLogout}
              variant="ghost"
              className="rounded-full"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            ¡Hola, <span className="gradient-text">{userData?.name}!</span> 👋
          </h1>
          <p className="text-slate-600 text-lg">Continúa tu aventura de aprendizaje</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-3xl p-8 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Tu Progreso</h2>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span className="font-bold text-lg">Nivel {userData?.level || 1}</span>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-4 mb-2" />
          <p className="text-sm text-slate-600">
            {completedLessons.length} de {totalLessons} lecciones completadas
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-6 gradient-text">Lecciones</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessonsData.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isLocked = index > 0 && !completedLessons.includes(lessonsData[index - 1].id);
              
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleLessonClick(lesson.id, isLocked)}
                  className={`glass-effect rounded-3xl p-6 ${
                    isLocked ? 'opacity-50 cursor-not-allowed' : 'card-hover'
                  } relative overflow-hidden`}
                >
                  {isCompleted && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                  )}
                  
                  {isLocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="w-8 h-8 text-slate-400" />
                    </div>
                  )}

                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 ${
                    isLocked ? 'bg-slate-200' : 'bg-gradient-to-br from-emerald-400 to-teal-500'
                  }`}>
                    {lesson.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                  <p className="text-slate-600 mb-4">{lesson.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Code className="w-4 h-4" />
                    <span>{lesson.exercises?.length || 0} ejercicios</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-amber-600 mt-2">
                    <Star className="w-4 h-4" />
                    <span>+{lesson.xpReward} XP</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;