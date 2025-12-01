import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Star, Lock, Lightbulb } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { deductUserXp } from '@/services/api'; // Asegúrate de tener esta función en api.js

const ProgressiveHint = ({ exercise, user, updateUser }) => {
    // 1. Definir los niveles de hints
    const defaultHints = [
        { level: 1, cost: 0, text: exercise.hint || "Pista general disponible." },
        { level: 2, cost: 5, text: "Pista avanzada: Revisa la estructura sintáctica." },
        { level: 3, cost: 15, text: "Revelación: La respuesta correcta es un número entero." },
    ];
    const hints = exercise.hints || defaultHints;
    
    const [currentHintLevel, setCurrentHintLevel] = useState(0);
    const [hintText, setHintText] = useState(hints[0].text);

    const availableXp = user?.xp || 0;

    const handleUnlockHint = async (hint) => {
        const cost = hint.cost;
        
        if (cost > 0 && availableXp < cost) {
            toast({
                title: "❌ XP Insuficiente",
                description: `Necesitas ${cost} XP para esta pista.`,
                variant: "destructive"
            });
            return;
        }

        try {
            if (cost > 0) {
                // Llamada a la API para restar XP
                const updatedUser = await deductUserXp(user.email, cost);
                if (updateUser) {
                    updateUser(updatedUser);
                }
                toast({
                    title: "💸 XP Deducido",
                    description: `Se han restado ${cost} XP.`,
                });
            }
            
            setHintText(hint.text);
            setCurrentHintLevel(hint.level);

        } catch (error) {
            console.error('Error al deducir XP:', error);
            // Fallback visual si la API falla (para que no se trabe la UI)
            setHintText(hint.text);
            setCurrentHintLevel(hint.level);
        }
    };
    
    const nextHint = hints[currentHintLevel];
    const isLastHint = currentHintLevel === hints.length;

    if (isLastHint) {
        return (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-lg">
                <p className="font-semibold">💡 Última pista:</p>
                <p>{hints[hints.length - 1].text}</p>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="mt-4 space-y-3"
        >
            {currentHintLevel > 0 && (
                <motion.div 
                    key={currentHintLevel}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded-lg"
                >
                    <p className="font-semibold">{hintText.startsWith('🔑') ? 'Pista Final' : 'Pista Actual'}:</p>
                    <p>{hintText}</p>
                </motion.div>
            )}

            {nextHint && (
                <Button 
                    onClick={() => handleUnlockHint(nextHint)}
                    variant="ghost" 
                    className={`w-full justify-start p-4 border border-dashed rounded-lg transition-all ${nextHint.cost > 0 ? 'hover:bg-red-50/50' : 'hover:bg-blue-50/50'}`}
                >
                    <div className="flex items-center justify-between w-full">
                        <span className="flex items-center space-x-2">
                            {nextHint.cost > 0 ? <Lock className="w-5 h-5 text-red-500" /> : <Lightbulb className="w-5 h-5 text-blue-500" />}
                            <span className="font-semibold">
                                Desbloquear Pista {nextHint.level}
                            </span>
                        </span>
                        
                        {nextHint.cost > 0 && (
                            <span className="flex items-center space-x-1 text-red-600">
                                <Star className="w-4 h-4 fill-red-400" />
                                <span>{nextHint.cost} XP</span>
                            </span>
                        )}
                        {nextHint.cost === 0 && (
                            <span className="text-blue-600 font-semibold">Gratis</span>
                        )}
                    </div>
                </Button>
            )}
        </motion.div>
    );
};

export default ProgressiveHint;