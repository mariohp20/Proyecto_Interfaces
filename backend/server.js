import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ message: '🐍 PyLingo API funcionando correctamente' });
});

// 👤 RUTAS DE USUARIOS

// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un usuario por email
app.get('/api/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

// Crear o actualizar usuario (Login)
app.post('/api/users/login', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    let user = await User.findOne({ email });
    
    if (user) {
      // Usuario existe, actualizar último login
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Crear nuevo usuario
      user = new User({
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      });
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ====================================================================
// 💥 RUTAS CON LÓGICA DE LOGROS (ACHIEVEMENTS)
// ====================================================================

// Actualizar progreso del usuario + CHEQUEO DE LOGROS
app.put('/api/users/:email/progress', async (req, res) => {
  try {
    const { lessonId, score, xpGained } = req.body;
    
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // 1. Buscar si la lección ya existe en el historial
    const lessonIndex = user.completedLessons.findIndex(
      lesson => lesson.lessonId === lessonId
    );
    
    if (lessonIndex === -1) {
      // CASO A: Primera vez que completa la lección
      user.completedLessons.push({
        lessonId,
        score,
        completedAt: new Date()
      });
      
      // Solo dar XP y Puntos la primera vez para evitar farming
      user.xp += xpGained || 0;
      user.totalPoints += (score * 10) || 0; // Guardamos puntos totales
      
      // Calcular nivel
      user.level = Math.floor(user.xp / 100) + 1;

    } else {
      // CASO B: Ya la completó antes (Reintento)
      // 💥 CORRECCIÓN: Si la nueva puntuación es mejor, actualizamos el registro
      if (score > user.completedLessons[lessonIndex].score) {
        user.completedLessons[lessonIndex].score = score;
        user.completedLessons[lessonIndex].completedAt = new Date();
        // Nota: No sumamos XP de nuevo, pero sí actualizamos el registro "mejor"
      }
    }

    // 2. 🏆 LÓGICA DE LOGROS (Sin cambios)
    if (!user.achievements) user.achievements = [];
    const newAchievements = [];
    const awardAchievement = (id, xpBonus = 0) => {
      if (!user.achievements.some(a => a.id === id)) {
        user.achievements.push({ id, unlockedAt: new Date() });
        newAchievements.push(id);
        if (xpBonus > 0) user.xp += xpBonus; 
      }
    };

    const totalCompleted = user.completedLessons.length;
    if (totalCompleted >= 1) awardAchievement('first-steps', 20);
    if (totalCompleted >= 3) awardAchievement('scholar', 100);
    if (score >= 5) awardAchievement('perfectionist', 30); // Ajustado si el max es 5 preguntas
    if (totalCompleted >= 8) awardAchievement('python-master', 500);

    await user.save();
    
    res.json({ user, newAchievements });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Deducir XP (Comprar Pista) + LOGRO INVERSIONISTA
app.patch('/api/users/:email/xp-deduction', async (req, res) => {
  try {
    const { email } = req.params;
    const { xp } = req.body; // Cantidad de XP a restar

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si tiene suficiente XP
    if (user.xp < xp) {
      return res.status(400).json({ message: 'XP insuficiente' });
    }

    // Restar XP
    user.xp -= xp;
    
    // 🏆 Logro: Inversionista (Gastar XP por primera vez)
    if (!user.achievements) user.achievements = [];
    
    if (!user.achievements.some(a => a.id === 'rich-kid')) {
      user.achievements.push({ id: 'rich-kid', unlockedAt: new Date() });
      // Opcional: Dar un pequeño reembolso o bonus por desbloquear el logro
      user.xp += 10; 
    }
    
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error deduciendo XP:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Endpoint para LEADERBOARD (Tabla de Posiciones)
app.get('/api/users/leaderboard', async (req, res) => {
  try {
    // Obtener los 50 mejores usuarios ordenados por XP (descendente)
    const users = await User.find({})
      .sort({ xp: -1 }) // -1 para descendente (mayor a menor)
      .limit(50)
      .select('name email xp level avatar completedLessons'); // Solo devolver datos seguros
      
    res.json(users);
  } catch (error) {
    console.error('Error obteniendo leaderboard:', error);
    res.status(500).json({ message: 'Error obteniendo leaderboard' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    let user = await User.findOne({ email });
    
    if (user) {
      // --- LÓGICA DE RACHAS ---
      const now = new Date();
      const lastLogin = new Date(user.lastLogin);
      
      // Normalizar fechas (ignorar horas, solo comparar días)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastDate = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());
      
      // Calcular diferencia en días
      const diffTime = Math.abs(today - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Si se conectó ayer, aumentar racha
        user.streak += 1;
      } else if (diffDays > 1) {
        // Si pasó más de un día, reiniciar racha
        user.streak = 1;
      }
      // Si diffDays === 0 (mismo día), no hacemos nada con la racha
      
      // 🏆 Logro: En Racha (3 días seguidos)
      if (user.streak >= 3) {
        // Verificamos si ya tiene el logro 'streak-3'
        // Nota: Asegúrate de que user.achievements esté inicializado
        if (!user.achievements) user.achievements = [];
        
        const hasAchievement = user.achievements.some(a => a.id === 'streak-3');
        if (!hasAchievement) {
           user.achievements.push({ 
             id: 'streak-3', 
             unlockedAt: new Date() 
           });
           user.xp += 50; // Bonus por desbloquear
        }
      }

      // Actualizar último login
      user.lastLogin = now;
      await user.save();
      
    } else {
      // Crear nuevo usuario
      user = new User({
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        streak: 1, // Primera racha
        lastLogin: new Date()
      });
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});