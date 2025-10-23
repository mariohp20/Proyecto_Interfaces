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
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Actualizar progreso del usuario
app.put('/api/users/:email/progress', async (req, res) => {
  try {
    const { lessonId, score, xpGained } = req.body;
    
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Agregar lección completada
    const lessonExists = user.completedLessons.some(
      lesson => lesson.lessonId === lessonId
    );
    
    if (!lessonExists) {
      user.completedLessons.push({
        lessonId,
        score,
        completedAt: new Date()
      });
    }
    
    // Actualizar XP y puntos
    user.xp += xpGained || 0;
    user.totalPoints += score || 0;
    
    // Calcular nivel basado en XP
    user.level = Math.floor(user.xp / 100) + 1;
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});