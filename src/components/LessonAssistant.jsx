import React from 'react';
import { motion } from 'framer-motion';
import ProgressiveHint from './ProgressiveHint';

const LessonAssistant = ({ exercise, user, updateUser }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start mt-8 space-x-4"
        >
            {/* 1. ICONO DE ASISTENTE (Emoji) */}
            <div className="flex-shrink-0 pt-4">
                <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center 
                               bg-emerald-100 border-2 border-emerald-500 shadow-lg text-4xl select-none cursor-help" 
                    title="Pythie, tu asistente de Python"
                >
                    {/* 💥 Usamos un Emoji estándar en lugar del ícono SVG */}
                    🐍
                </div>
            </div>

            {/* 2. BURBUJA DE DIÁLOGO / PISTA */}
            <div className="flex-grow">
                <div className="relative p-4 rounded-xl shadow-lg bg-white border border-gray-200">
                    
                    {/* El pico de la burbuja (Tail) */}
                    <div className="absolute top-4 -left-2 w-4 h-4 transform rotate-45 bg-white border-b border-r border-gray-200"></div>

                    {/* El contenido de ProgressiveHint se renderiza aquí */}
                    <ProgressiveHint 
                        exercise={exercise} 
                        user={user} 
                        updateUser={updateUser} 
                    />
                </div>
            </div>
            
        </motion.div>
    );
};

export default LessonAssistant;