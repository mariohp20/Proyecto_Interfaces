import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';
import LessonPage from '@/pages/LessonPage';
import ProfilePage from '@/pages/ProfilePage';
import { loginUser, getUser } from '@/services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentar recuperar usuario desde localStorage (solo el email)
    const storedEmail = localStorage.getItem('pylingo_user_email');
    if (storedEmail) {
      // Obtener datos completos desde MongoDB
      getUser(storedEmail)
        .then(userData => {
          setUser(userData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error recuperando usuario:', error);
          localStorage.removeItem('pylingo_user_email');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (userData) => {
    try {
      // Login o crear usuario en MongoDB
      const dbUser = await loginUser(userData.name, userData.email);
      setUser(dbUser);
      // Guardar solo el email en localStorage para sesión
      localStorage.setItem('pylingo_user_email', dbUser.email);
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pylingo_user_email');
  };

  // Función para actualizar el usuario desde componentes hijos
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="text-3xl font-bold gradient-text mb-4">Cargando PyLingo...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>PyLingo - Aprende Python Jugando</title>
        <meta name="description" content="Aprende Python de forma divertida e interactiva con PyLingo. Lecciones gamificadas, ejercicios prácticos y feedback instantáneo." />
      </Helmet>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <LandingPage onLogin={handleLogin} />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/lesson/:lessonId" 
            element={user ? <LessonPage user={user} updateUser={updateUser} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <ProfilePage user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
          />
        </Routes>
        <Toaster />
      </Router>
    </>
  );
}

export default App;