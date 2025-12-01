import axios from 'axios';

// Configuración base de Axios (ajusta el puerto si tu backend no es 5000)
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// =================================================================
// USUARIOS Y AUTENTICACIÓN
// =================================================================

// 1. Iniciar sesión o registrar usuario
export const loginUser = async (userData) => {
  try {
    const response = await api.post('/users/login', userData);
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// 2. Obtener usuario por email (Persistencia de sesión)
// 💥 ESTA ES LA FUNCIÓN QUE FALTABA Y CAUSABA EL ERROR EN APP.JSX
export const getUser = async (email) => {
  try {
    // Llamamos al backend para obtener los datos actualizados del usuario
    const response = await api.get(`/users/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    throw error;
  }
};

// 3. Actualizar el progreso del usuario (al terminar lección)
export const updateUserProgress = async (email, lessonId, score, xpGained) => {
  try {
    const response = await api.put(`/users/${email}/progress`, {
      lessonId,
      score,
      xpGained
    });
    return response.data;
  } catch (error) {
    console.error('Error guardando progreso:', error);
    throw error;
  }
};

// 4. Deducir XP (para comprar pistas)
export const deductUserXp = async (email, xpDeducted) => {
  try {
    const response = await api.patch(`/users/${email}/xp-deduction`, { 
        xp: xpDeducted 
    });
    return response.data;
  } catch (error) {
    console.error('Error deduciendo XP:', error);
    throw error;
  }
};

// 5. Obtener Leaderboard (Tabla de Posiciones)
export const getLeaderboard = async () => {
  try {
    const response = await api.get('/users/leaderboard');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo leaderboard:', error);
    throw error;
  }
};

export default api;