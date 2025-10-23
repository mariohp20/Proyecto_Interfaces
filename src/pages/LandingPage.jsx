import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code, Trophy, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

const LandingPage = ({ onLogin }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    
    if (!email || (isSignup && !name)) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const userData = {
      id: Date.now().toString(),
      email,
      name: name || email.split('@')[0],
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      completedLessons: []
    };

    onLogin(userData);
    toast({
      title: "¡Bienvenido a PyLingo! 🎉",
      description: "Comienza tu aventura de aprendizaje"
    });
    setIsLoginOpen(false);
  };

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Ejercicios Interactivos",
      description: "Aprende haciendo con ejercicios prácticos y divertidos"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Gamificación Total",
      description: "Gana XP, medallas y sube de nivel mientras aprendes"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Feedback Instantáneo",
      description: "Recibe retroalimentación inmediata en cada ejercicio"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Aprende Jugando",
      description: "Una experiencia educativa que se siente como un juego"
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 opacity-50"></div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10"
      >
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="text-4xl">🐍</div>
            <span className="text-3xl font-bold gradient-text">PyLingo</span>
          </motion.div>
          
          <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                Comenzar Ahora
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-effect">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold gradient-text">
                  {isSignup ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAuth} className="space-y-4 mt-4">
                {isSignup && (
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full btn-primary">
                  {isSignup ? 'Registrarse' : 'Entrar'}
                </Button>
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {isSignup ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </nav>

        <section className="container mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
              Aprende <span className="gradient-text">Python</span>
              <br />
              Jugando 🎮
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto">
              La forma más divertida e interactiva de dominar Python desde cero
            </p>
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary text-lg px-8 py-6 group">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </DialogTrigger>
            </Dialog>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <img 
              className="rounded-3xl shadow-2xl mx-auto max-w-4xl w-full"
              alt="PyLingo dashboard preview"
             src="https://images.unsplash.com/photo-1690683789978-3cf73960d650" />
          </motion.div>
        </section>

        <section className="container mx-auto px-6 py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
          >
            ¿Por qué PyLingo?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-3xl p-8 card-hover"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              ¿Listo para comenzar tu aventura? 🚀
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Únete a miles de estudiantes que ya están aprendiendo Python de forma divertida
            </p>
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary text-lg px-8 py-6">
                  Empezar Ahora - Es Gratis
                </Button>
              </DialogTrigger>
            </Dialog>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
};

export default LandingPage;