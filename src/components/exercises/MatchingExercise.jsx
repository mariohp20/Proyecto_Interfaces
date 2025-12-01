import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { shuffleArray } from '@/lib/utils';

// Paleta de colores
const CONNECTION_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", 
  "#3b82f6", "#a855f7", "#ec4899", "#14b8a6"
];

const MatchingExercise = ({ exercise, onAnswer, disabled }) => {
  // 💥 CAMBIO CLAVE: Ahora guardamos { leftIndex: rightIndex } (Posiciones, no valores)
  const [connections, setConnections] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Estado del arrastre
  const [dragStart, setDragStart] = useState(null); 
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoverTarget, setHoverTarget] = useState(null); 

  const containerRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});

  // Desordenar items derechos
  const shuffledRightItems = useMemo(() => {
    const rightItems = exercise.pairs.map(pair => pair.right);
    return shuffleArray(rightItems);
  }, [exercise.pairs]);

  // 1. Iniciar arrastre
  const handleMouseDown = (e, index) => {
    if (disabled || showFeedback) return;
    e.preventDefault(); 

    if (containerRef.current && leftRefs.current[index]) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const itemRect = leftRefs.current[index].getBoundingClientRect();
      
      const startX = (itemRect.right - containerRect.left);
      const startY = (itemRect.top + itemRect.height / 2) - containerRect.top;

      setDragStart({ index, x: startX, y: startY });
      setMousePos({ x: startX, y: startY });
      
      // Borrar conexión previa si existe
      if (connections[index] !== undefined) {
        const newConn = { ...connections };
        delete newConn[index];
        setConnections(newConn);
      }
    }
  };

  // 2. Mover el mouse
  const handleMouseMove = (e) => {
    if (dragStart && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - containerRect.left,
        y: e.clientY - containerRect.top
      });

      // Detección robusta del elemento bajo el cursor
      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      
      if (elementBelow) {
        const targetDiv = elementBelow.closest('[data-right-index]');
        
        if (targetDiv) {
          const index = parseInt(targetDiv.getAttribute('data-right-index'));
          // Ya no necesitamos el value para la lógica, solo el índice
          if (hoverTarget?.index !== index) {
            setHoverTarget({ index });
          }
        } else {
          if (hoverTarget) setHoverTarget(null);
        }
      }
    }
  };

  // 3. Soltar el click
  const handleMouseUp = () => {
    if (dragStart) {
      if (hoverTarget) {
        setConnections(prev => {
            const newConn = { ...prev };
            // Limpiar si este destino (por índice) ya estaba usado
            const existingKey = Object.keys(newConn).find(key => newConn[key] === hoverTarget.index);
            if (existingKey) delete newConn[existingKey];
            
            // Guardar la conexión por ÍNDICES
            newConn[dragStart.index] = hoverTarget.index;
            return newConn;
        });
      }
      setDragStart(null);
      setHoverTarget(null);
    }
  };

  const handleCheck = () => {
    const isAllCorrect = exercise.pairs.every((pair, leftIndex) => {
        const rightIndex = connections[leftIndex];
        // Verificamos si lo que hay en ese índice derecho coincide con la respuesta
        if (rightIndex === undefined) return false;
        return shuffledRightItems[rightIndex] === pair.right;
    });
    setShowFeedback(true);
    onAnswer(isAllCorrect);
  };

  // Renderizado de Líneas
  const renderLines = () => {
    if (!containerRef.current) return null;
    
    const renderedLines = [];
    const containerRect = containerRef.current.getBoundingClientRect();

    Object.entries(connections).forEach(([leftIndexKey, rightIndex]) => {
      const leftIndex = parseInt(leftIndexKey);
      
      if (dragStart && leftIndex === dragStart.index) return;

      // Aquí ya tenemos el rightIndex directo, no necesitamos buscarlo
      const leftEl = leftRefs.current[leftIndex];
      const rightEl = rightRefs.current[rightIndex];

      if (leftEl && rightEl) {
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();

        const x1 = leftRect.right - containerRect.left;
        const y1 = (leftRect.top + leftRect.height / 2) - containerRect.top;
        const x2 = rightRect.left - containerRect.left;
        const y2 = (rightRect.top + rightRect.height / 2) - containerRect.top;

        const color = CONNECTION_COLORS[leftIndex % CONNECTION_COLORS.length];
        let strokeColor = color;
        
        if (showFeedback) {
            const rightValue = shuffledRightItems[rightIndex];
            const isCorrect = exercise.pairs[leftIndex].right === rightValue;
            strokeColor = isCorrect ? "#10b981" : "#ef4444";
        }

        renderedLines.push(
          <motion.line
            key={`conn-${leftIndex}`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
            className="pointer-events-none"
          />,
          <circle key={`c1-${leftIndex}`} cx={x1} cy={y1} r="4" fill={strokeColor} className="pointer-events-none" />,
          <circle key={`c2-${leftIndex}`} cx={x2} cy={y2} r="4" fill={strokeColor} className="pointer-events-none" />
        );
      }
    });

    if (dragStart) {
        const color = CONNECTION_COLORS[dragStart.index % CONNECTION_COLORS.length];
        let targetX = mousePos.x;
        let targetY = mousePos.y;

        if (hoverTarget && rightRefs.current[hoverTarget.index]) {
            const targetRect = rightRefs.current[hoverTarget.index].getBoundingClientRect();
            targetX = targetRect.left - containerRect.left;
            targetY = (targetRect.top + targetRect.height / 2) - containerRect.top;
        }

        renderedLines.push(
            <line
                key="active-drag"
                x1={dragStart.x} y1={dragStart.y} 
                x2={targetX} y2={targetY}
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8,4"
                className="pointer-events-none opacity-80"
            />,
            <circle key="active-dot" cx={dragStart.x} cy={dragStart.y} r="5" fill={color} className="pointer-events-none" />
        );
        
        if (hoverTarget) {
             <circle key="target-dot" cx={targetX} cy={targetY} r="5" fill={color} className="pointer-events-none" />
        }
    }

    return renderedLines;
  };

  const [, setForceUpdate] = useState(0);
  useEffect(() => {
    const handleResize = () => setForceUpdate(n => n + 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="space-y-6 select-none">
      <div 
        className="glass-effect p-8 rounded-2xl border border-slate-200 dark:border-slate-700 relative shadow-sm bg-white/50 dark:bg-slate-900/50"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <h3 className="text-lg font-bold mb-8 text-center text-slate-700 dark:text-slate-200">
            {exercise.question}
        </h3>
        
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            {renderLines()}
        </svg>

        <div className="flex justify-between relative z-10 gap-12">
          
          {/* Izquierda */}
          <div className="space-y-6 flex-1">
            {exercise.pairs.map((pair, index) => {
              const isConnected = connections[index] !== undefined;
              const isDraggingThis = dragStart?.index === index;
              const color = CONNECTION_COLORS[index % CONNECTION_COLORS.length];
              
              let borderColor = "border-slate-200 dark:border-slate-600";
              if (isDraggingThis || isConnected) borderColor = color;

              return (
                <div
                  key={`left-${index}`}
                  ref={el => leftRefs.current[index] = el}
                  onMouseDown={(e) => handleMouseDown(e, index)}
                  className={`
                    p-4 rounded-xl border-2 cursor-grab active:cursor-grabbing transition-all flex items-center justify-between 
                    bg-white dark:bg-slate-800
                    hover:shadow-md
                    ${isDraggingThis ? 'shadow-lg scale-105 ring-2 ring-offset-1 dark:ring-offset-slate-900' : ''}
                  `}
                  style={{ borderColor: (isConnected || isDraggingThis) ? color : '' }}
                >
                  <span className="font-medium text-slate-700 dark:text-slate-200">{pair.left}</span>
                  <div 
                    className="w-3 h-3 rounded-full border-2 bg-white dark:bg-slate-800 ml-2"
                    style={{ borderColor: color, backgroundColor: isConnected || isDraggingThis ? color : '' }} 
                  />
                </div>
              );
            })}
          </div>

          {/* Derecha */}
          <div className="space-y-6 flex-1">
            {shuffledRightItems.map((val, index) => {
              // 💥 LÓGICA DE BÚSQUEDA CORREGIDA: Usamos el ÍNDICE (index) para encontrar si está conectado
              const connectedLeftKey = Object.keys(connections).find(k => connections[k] === index);
              const isConnected = connectedLeftKey !== undefined;
              const isHovered = hoverTarget?.index === index;
              
              let color = "gray";
              if (isConnected) {
                  color = CONNECTION_COLORS[connectedLeftKey % CONNECTION_COLORS.length];
              } else if (isHovered && dragStart) {
                  color = CONNECTION_COLORS[dragStart.index % CONNECTION_COLORS.length];
              }

              let borderClass = "border-slate-200 dark:border-slate-600";
              let bgClass = "bg-white dark:bg-slate-800";
              
              if (showFeedback && isConnected) {
                  const correctVal = exercise.pairs[connectedLeftKey].right;
                  if (val === correctVal) {
                      borderClass = "border-emerald-500";
                      bgClass = "bg-emerald-50 dark:bg-emerald-900/30";
                  } else {
                      borderClass = "border-red-500";
                      bgClass = "bg-red-50 dark:bg-red-900/30";
                  }
              } else if (isHovered) {
                  bgClass = "bg-slate-50 dark:bg-slate-700";
              }

              return (
                <div
                  key={`right-${index}`}
                  ref={el => rightRefs.current[index] = el}
                  data-right-index={index}
                  data-value={val}
                  className={`
                    p-4 rounded-xl border-2 transition-all flex items-center justify-between
                    ${borderClass} ${bgClass}
                    ${isHovered ? 'scale-105 shadow-lg' : ''}
                  `}
                  style={{ 
                      borderColor: (isConnected || isHovered) && !showFeedback ? color : undefined 
                  }}
                >
                  <div 
                    className="w-3 h-3 rounded-full border-2 bg-white dark:bg-slate-800 mr-2"
                    style={{ 
                        borderColor: (isConnected || isHovered) ? color : '#e2e8f0', 
                        backgroundColor: (isConnected || isHovered) ? color : '' 
                    }} 
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-200 text-right flex-1">{val}</span>
                </div>
              );
            })}
          </div>

        </div>
      </div>
      
      <Button
        onClick={handleCheck}
        disabled={Object.keys(connections).length < exercise.pairs.length || showFeedback}
        className="btn-primary w-full text-lg py-6"
      >
        Verificar Conexiones
      </Button>
    </div>
  );
};

export default MatchingExercise;