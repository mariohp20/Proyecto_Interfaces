import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy, 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { GripVertical, Check, X } from 'lucide-react';
// Asegúrate de que esta función exista en '@/lib/utils'
import { shuffleArray } from '@/lib/utils'; 

// 💥 FUNCIÓN PARA COLORES DINÁMICOS (Integrada para que el componente sea completo)
const getColorClasses = (index) => {
  const colors = [
    // [Fondo, Borde, Sombra]
    ['bg-teal-50', 'border-teal-300', 'shadow-teal-400'],
    ['bg-indigo-50', 'border-indigo-300', 'shadow-indigo-400'],
    ['bg-pink-50', 'border-pink-300', 'shadow-pink-400'],
    ['bg-amber-50', 'border-amber-300', 'shadow-amber-400'],
    ['bg-fuchsia-50', 'border-fuchsia-300', 'shadow-fuchsia-400'],
    ['bg-emerald-50', 'border-emerald-300', 'shadow-emerald-400'],
  ];
  return colors[index % colors.length];
};

// =========================================================================
// COMPONENTE PARA CADA ITEM ARRASTRABLE
// =========================================================================
function SortableItem({ id, code, index, isCorrect, showFeedback, activeId}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const colorIndex = parseInt(id.split('-')[1]); 
  const [bgColor, borderColor, shadowColor] = getColorClasses(colorIndex);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, x: 0 }} // Animación de entrada: cambiamos x:-20 a 0 para mejor compatibilidad horizontal
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        relative group
        transition-all duration-300
        ${isDragging ? 'z-50 opacity-0' : 'z-0'}
      `}
    >
      <div
        className={`
          flex items-center gap-3 p-4 rounded-xl border-2 
          transition-all duration-200 cursor-grab
          
          /* Colores base dinámicos */
          ${bgColor} ${borderColor}
          
          /* Efecto de arrastre del elemento (opacidad, borde) */
          ${isDragging 
            ? `shadow-2xl scale-103 opacity-70 border-4 border-dashed border-gray-500`
            : `shadow-md hover:shadow-lg hover:scale-[1.01] ${shadowColor}/40` 
          }
          
          /* 💥 EFECTO DE HOVER DE DESTINO: Atenuación y borde resaltado */
          ${activeId && !isDragging ? 'hover:opacity-60 hover:border-blue-500' : ''}

          /* Feedback visual */
          ${showFeedback && isCorrect === true 
            ? 'bg-emerald-200 border-emerald-600'
            : ''
          }
          ${showFeedback && isCorrect === false 
            ? 'bg-red-200 border-red-600 animate-shake'
            : ''
          }
        `}
        {...attributes}
        {...listeners}
      >
        {/* Grip handle */}
        <div className="flex-shrink-0 cursor-grab">
          <GripVertical className={`w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors ${isDragging ? 'text-gray-900' : ''}`} />
        </div>

        {/* Número de línea */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-900 text-white font-bold flex items-center justify-center text-sm">
          {index + 1}
        </div>

        {/* Código */}
        <code className="flex-1 font-mono text-sm text-slate-800">
          {code}
        </code>

        {/* Feedback icon (Check/X) - Mantenemos la lógica de su código original */}
        {showFeedback && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex-shrink-0"
          >
            {isCorrect ? (
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// =========================================================================
// COMPONENTE PRINCIPAL DRAG & DROP
// =========================================================================
const DragDropExercise = ({ exercise, onAnswer, disabled }) => {
  // 1. Inicialización con Shuffle
  const initialItems = exercise.items.map((item, index) => ({
    id: `item-${index}`,
    code: item,
    originalIndex: index
  }));

  const [items, setItems] = useState(shuffleArray(initialItems));
  const [activeId, setActiveId] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [feedback, setFeedback] = useState([]);

  // 2. Sensores
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 3. Estrategia Horizontal/Vertical
  const isHorizontal = exercise.layout === 'horizontal';
  
  const strategy = isHorizontal 
    ? horizontalListSortingStrategy 
    : verticalListSortingStrategy;

  // Handlers D&D
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  // Lógica de Validación
  const handleCheck = () => {
    const currentOrder = items.map(item => item.originalIndex);
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(exercise.correctOrder);
    
    // Generar feedback por posición
    const newFeedback = items.map((item, index) => {
      return exercise.correctOrder[index] === item.originalIndex;
    });
    
    setFeedback(newFeedback);
    setHasChecked(true);
    onAnswer(isCorrect);
  };

  const activeItem = items.find((item) => item.id === activeId);

  return (
    <div className="space-y-6">
      {/* ... Instrucciones (código no modificado) ... */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">💡</span>
          </div>
          <div>
            <p className="font-semibold text-blue-900 mb-1">
              ¡Arrastra las líneas para ordenar el código!
            </p>
            <p className="text-sm text-blue-700">
              Usa el ícono de grip (☰) para mover cada línea a su posición correcta.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Área de construcción */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">
            🔨 Construye el código aquí:
          </h3>
          <span className="text-sm text-slate-600 font-mono">
            {items.length} líneas
          </span>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map(item => item.id)}
            strategy={strategy} // Aplica horizontalListSortingStrategy o verticalListSortingStrategy
          >
            {/* 💥 AJUSTE DE LAYOUT: Clases condicionales para horizontal/vertical */}
            <div className={`
              ${isHorizontal 
                ? 'flex flex-wrap space-x-3 space-y-0' 
                : 'flex-col space-y-3'
              }
            `}>
              {items.map((item, index) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  code={item.code}
                  index={index}
                  isCorrect={hasChecked ? feedback[index] : null}
                  showFeedback={hasChecked}
                  activeId={activeId} 
                />
              ))}
            </div>
          </SortableContext>

          {/* 💥 DRAG OVERLAY CORREGIDO (Alineación y estilos) */}
          <DragOverlay>
            {activeItem ? (
              <div 
                className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-500 bg-white/80 shadow-2xl scale-105 opacity-80 pointer-events-none transform-none"
              >
                <GripVertical className="w-5 h-5 text-gray-500" />
                <div className="w-8 h-8 rounded-lg bg-gray-900 text-white font-bold flex items-center justify-center text-sm">
                  {activeItem.originalIndex + 1}
                </div>
                <code className="font-mono text-sm text-slate-800">
                  {activeItem.code}
                </code>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Botón de verificar (código no modificado) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={handleCheck}
          disabled={disabled}
          className="btn-primary w-full text-lg py-6"
        >
          {hasChecked ? 'Verificado' : 'Verificar Orden'}
        </Button>
      </motion.div>

      {/* Hint visual (código no modificado) */}
      {!hasChecked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-slate-500"
        >
          💡 Tip: Piensa en el orden lógico de ejecución del código
        </motion.div>
      )}
    </div>
  );
};

export default DragDropExercise;