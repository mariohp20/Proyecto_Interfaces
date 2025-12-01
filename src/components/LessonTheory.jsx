import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 💥 Importamos el hook de navegación
import { Button } from '@/components/ui/button';
import { Play, BookOpen, Clock, ArrowLeft } from 'lucide-react'; // 💥 Importamos la flecha

const LessonTheory = ({ lesson, onComplete }) => {
  const { title, theory } = lesson;
  const navigate = useNavigate(); // 💥 Inicializamos navegación

  if (!theory) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      
      {/* 💥 NUEVO: Header de Navegación (Igual que en ejercicios) */}
      <nav className="glass-effect sticky top-0 z-50 border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="rounded-full hover:bg-white/50"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </Button>
            <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                <BookOpen className="w-4 h-4" /> Introducción Teórica
            </span>
            <h1 className="text-4xl font-extrabold text-slate-800">
                {theory.videoTitle || title}
            </h1>
            <p className="text-xl text-slate-600">
                Antes de practicar, entendamos los conceptos.
            </p>
          </div>

          {/* Tarjeta de información */}
          <div className="flex justify-center gap-6">
            <div className="flex items-center space-x-2 text-slate-600 bg-white/60 px-4 py-2 rounded-full border border-white/50 shadow-sm">
              <Clock className="w-5 h-5 text-emerald-500" />
              <span className="font-medium">{theory.readingTime}</span>
            </div>
          </div>

          {/* Contenedor del Video */}
          <div className="relative aspect-video rounded-2xl shadow-2xl overflow-hidden border-4 border-white">
            <iframe
              src={`${theory.videoUrl}?autoplay=0&controls=1&modestbranding=1&rel=0`}
              title={theory.videoTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>

          {/* Puntos Clave */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 border-emerald-400 inline-block">
              Conceptos Clave
            </h2>
            <div className="grid gap-4">
                {theory.concepts.map((concept, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (0.1 * index) }}
                    className="flex items-start space-x-4 bg-white/80 backdrop-blur p-5 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-all"
                >
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                    </div>
                    <div>
                    <h3 className="font-bold text-slate-800 text-lg">{concept.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{concept.text}</p>
                    </div>
                </motion.div>
                ))}
            </div>
          </div>

          {/* Botón para iniciar ejercicios */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <Button
              onClick={onComplete}
              className="btn-primary w-full text-xl py-8 flex items-center justify-center space-x-3 shadow-xl hover:scale-[1.02] transition-transform"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>¡Entendido! Comenzar Ejercicios</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LessonTheory;