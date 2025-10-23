import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 👤 USUARIOS

export const loginUser = async (name, email) => {
  try {
    const response = await api.post('/users/login', { name, email });
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const getUser = async (email) => {
  try {
    const response = await api.get(`/users/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    throw error;
  }
};

export const updateUserProgress = async (email, lessonId, score, xpGained) => {
  try {
    const response = await api.put(`/users/${email}/progress`, {
      lessonId,
      score,
      xpGained,
    });
    return response.data;
  } catch (error) {
    console.error('Error actualizando progreso:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};

export default api;