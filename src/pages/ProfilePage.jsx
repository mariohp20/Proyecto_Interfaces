import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Calendar, Star, Trophy, LogOut, Flame, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';

const ProfilePage = ({ user, onLogout }) => {
  const navigate = useNavigate();

  if (!user) return null;

  // Formatear fecha de registro
  const joinDate = new Date(user.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Botón Volver */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/dashboard')} 
            variant="ghost" 
            className="rounded-full hover:bg-white/50"
          >
            <ArrowLeft className="w-6 h-6 text-slate-700" />
            <span className="ml-2 text-slate-700">Volver al Dashboard</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Tarjeta de Perfil */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 text-center">
              <div className="relative inline-block mb-4">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover mx-auto"
                />
                <div className="absolute bottom-0 right-0 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center" title="En línea">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
              <p className="text-slate-500 mb-6">Estudiante de Python</p>

              <div className="space-y-4 text-left bg-slate-50 p-4 rounded-2xl mb-6">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span className="text-sm">Unido el {joinDate}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <span className="text-sm">Nivel {user.level}</span>
                </div>
              </div>

              <Button 
                onClick={onLogout} 
                variant="outline" 
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </motion.div>

          {/* Columna Derecha: Estadísticas y Logros */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Stats Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-white/80 p-6 rounded-3xl shadow-md border border-white/50 flex flex-col items-center justify-center">
                <Flame className="w-10 h-10 text-orange-500 mb-2" />
                <span className="text-3xl font-bold text-slate-800">{user.streak || 0}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Racha de días</span>
              </div>
              
              <div className="bg-white/80 p-6 rounded-3xl shadow-md border border-white/50 flex flex-col items-center justify-center">
                <Star className="w-10 h-10 text-yellow-500 mb-2" />
                <span className="text-3xl font-bold text-slate-800">{user.xp}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">XP Total</span>
              </div>
            </motion.div>

            {/* Sección de Logros Recientes */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Tus Logros
                </h3>
                <Button 
                  onClick={() => navigate('/achievements')} 
                  variant="link" 
                  className="text-blue-600 hover:text-blue-700"
                >
                  Ver todos
                </Button>
              </div>

              {(!user.achievements || user.achievements.length === 0) ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  <p>Aún no tienes logros desbloqueados.</p>
                  <p className="text-sm mt-2">¡Completa lecciones para ganar medallas!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mostramos solo los últimos 4 logros para no saturar */}
                  {user.achievements.slice(0, 4).map((achievement, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
                        🏅
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm capitalize">
                          {/* Si guardas solo el ID, aquí deberías mapearlo al nombre real usando achievementsData */}
                          {/* Por simplicidad mostramos el ID formateado o un texto genérico */}
                          {typeof achievement === 'string' ? achievement : achievement.id}
                        </p>
                        <p className="text-xs text-slate-500">
                          Desbloqueado
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Historial de Lecciones (Opcional, visualización simple) */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
            >
                <h3 className="text-xl font-bold text-slate-800 mb-4">Progreso Reciente</h3>
                <div className="space-y-3">
                    {user.completedLessons && user.completedLessons.slice(-3).reverse().map((lesson, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                            <span className="font-medium text-slate-700">Lección {lesson.lessonId}</span>
                            <span className="text-emerald-600 font-bold">+{lesson.score * 10} pts</span>
                        </div>
                    ))}
                    {(!user.completedLessons || user.completedLessons.length === 0) && (
                        <p className="text-slate-500 text-sm">No hay actividad reciente.</p>
                    )}
                </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;