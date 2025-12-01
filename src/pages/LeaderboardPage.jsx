import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { getLeaderboard } from '@/services/api'; // Usamos la función centralizada de la API

// Componente para la fila del usuario
const LeaderboardItem = ({ user, rank, isCurrentUser }) => {
  let RankIcon = null;
  let rankColor = "text-slate-600";
  let bgColor = "bg-white";

  // Estilos para el Top 3
  if (rank === 1) {
    RankIcon = <Crown className="w-6 h-6 text-yellow-500" />;
    rankColor = "text-yellow-600 font-bold";
    bgColor = "bg-yellow-50 border-yellow-200";
  } else if (rank === 2) {
    RankIcon = <Medal className="w-6 h-6 text-slate-400" />;
    rankColor = "text-slate-500 font-bold";
    bgColor = "bg-slate-50 border-slate-200";
  } else if (rank === 3) {
    RankIcon = <Medal className="w-6 h-6 text-amber-700" />;
    rankColor = "text-amber-800 font-bold";
    bgColor = "bg-orange-50 border-orange-200";
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={`flex items-center justify-between p-4 rounded-xl border-2 mb-3 ${bgColor} ${isCurrentUser ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-8 text-center text-lg ${rankColor}`}>
          {RankIcon ? RankIcon : `#${rank}`}
        </div>
        
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200">
             <img 
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                alt={user.name}
                className="w-full h-full object-cover"
             />
        </div>
        
        <div>
          <p className={`font-bold ${isCurrentUser ? 'text-emerald-700' : 'text-slate-800'}`}>
            {user.name} {isCurrentUser && '(Tú)'}
          </p>
          <p className="text-xs text-slate-500">Nivel {user.level || 1}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-emerald-600">{user.xp} XP</p>
        <p className="text-xs text-slate-400">{user.completedLessons?.length || 0} lecciones</p>
      </div>
    </motion.div>
  );
};

const LeaderboardPage = ({ currentUser }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Usamos la función importada de api.js
        const data = await getLeaderboard();
        setUsers(data);
      } catch (error) {
        console.error("Error cargando leaderboard", error);
        // Fallback visual por si la API falla
        setUsers([
            { _id: '1', name: 'Python Master', xp: 1200, level: 12, email: 'master@test.com' },
            { _id: '2', name: 'Code Ninja', xp: 950, level: 9, email: 'ninja@test.com' },
            { _id: '3', name: currentUser?.name || 'Tú', xp: currentUser?.xp || 0, level: currentUser?.level || 1, email: currentUser?.email },
        ].sort((a, b) => b.xp - a.xp));
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={() => navigate('/dashboard')} variant="ghost" className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Tabla de Posiciones
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50">
           {loading ? (
             <p className="text-center py-10 text-slate-500">Cargando rankings...</p>
           ) : (
             users.map((user, index) => (
               <LeaderboardItem 
                  key={user._id || index} 
                  user={user} 
                  rank={index + 1} 
                  isCurrentUser={user.email === currentUser?.email}
               />
             ))
           )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;