import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, Flame, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { lessonsData } from '@/data/lessonsData';

const ProfilePage = ({ user, onLogout }) => {
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

  const stats = [
    {
      icon: <Star className="w-8 h-8" />,
      label: "XP Total",
      value: userData?.xp || 0,
      color: "from-yellow-400 to-amber-500"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      label: "Nivel",
      value: userData?.level || 1,
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <Flame className="w-8 h-8" />,
      label: "Racha",
      value: `${userData?.streak || 0} días`,
      color: "from-orange-400 to-red-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      label: "Lecciones",
      value: `${completedLessons.length}/${totalLessons}`,
      color: "from-emerald-400 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen pb-20">
      <nav className="glass-effect sticky top-0 z-50 border-b border-white/20">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold gradient-text">Mi Perfil</h1>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-3xl p-8 mb-8 text-center"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
            🐍
          </div>
          <h2 className="text-3xl font-bold mb-2">{userData?.name}</h2>
          <p className="text-slate-600">{userData?.email}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="glass-effect rounded-3xl p-6"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4`}>
                {stat.icon}
              </div>
              <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-3xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <h3 className="text-2xl font-bold">Progreso General</h3>
          </div>
          
          <Progress value={progressPercentage} className="h-4 mb-4" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-600">{completedLessons.length}</p>
              <p className="text-sm text-slate-600">Completadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{totalLessons - completedLessons.length}</p>
              <p className="text-sm text-slate-600">Pendientes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{Math.round(progressPercentage)}%</p>
              <p className="text-sm text-slate-600">Progreso</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Button onClick={onLogout} variant="outline" className="btn-secondary">
            Cerrar Sesión
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;