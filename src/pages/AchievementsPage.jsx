import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CheckCircle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Importamos los datos que acabamos de crear
import { achievementsData } from '@/data/achievementsData';
import ThemeToggle from '@/components/ThemeToggle';

const AchievementsPage = ({ user }) => {
  const navigate = useNavigate();

  // Función auxiliar para verificar si el usuario tiene el logro
  const isUnlocked = (achievementId) => {
    // Verificamos si el ID del logro existe en el array de logros del usuario
    // Asumimos que user.achievements es un array de objetos { id: '...', date: ... } o strings
    // Adaptamos para soportar ambos casos por seguridad
    return user.achievements?.some(a => (typeof a === 'string' ? a : a.id) === achievementId);
  };

  // Calcular progreso total
  const unlockedCount = achievementsData.filter(a => isUnlocked(a.id)).length;
  const totalCount = achievementsData.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={() => navigate('/dashboard')} variant="ghost" className="rounded-full hover:bg-white/50">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Logros y Medallas
            </h1>
            <p className="text-slate-600">
              Has desbloqueado {unlockedCount} de {totalCount} logros
            </p>
          </div>
        </div>

        {/* Grid de Logros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {achievementsData.map((achievement, index) => {
            const unlocked = isUnlocked(achievement.id);

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative overflow-hidden p-6 rounded-3xl border-2 flex items-center gap-6 transition-all duration-300
                  ${unlocked 
                    ? 'bg-white border-yellow-400 shadow-xl scale-[1.02]' 
                    : 'bg-slate-100/80 border-slate-200 opacity-90 grayscale-[0.8] hover:grayscale-0'
                  }
                `}
              >
                {/* Fondo decorativo brillante si está desbloqueado */}
                {unlocked && (
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
                )}

                {/* Icono */}
                <div className={`
                  w-24 h-24 flex-shrink-0 rounded-full flex items-center justify-center text-5xl shadow-inner border-4
                  ${unlocked 
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-200' 
                    : 'bg-slate-200 border-slate-300 text-slate-400'
                  }
                `}>
                  {achievement.icon}
                </div>

                {/* Contenido */}
                <div className="flex-1 z-10">
                  <h3 className={`text-xl font-bold mb-1 ${unlocked ? 'text-slate-800' : 'text-slate-600'}`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    {achievement.description}
                  </p>
                  
                  {/* Badges de estado */}
                  <div className="flex flex-wrap items-center gap-2">
                    {unlocked ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 shadow-sm">
                        <CheckCircle className="w-3 h-3" /> Completado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full border border-slate-300">
                        <Lock className="w-3 h-3" /> Bloqueado
                      </span>
                    )}
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      Recompensa: +{achievement.xpBonus} XP
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;