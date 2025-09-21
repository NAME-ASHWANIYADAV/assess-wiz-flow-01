import React from 'react';
import { motion } from 'framer-motion';

const FloatingShapes: React.FC = () => {
  const shapes = [
    {
      type: 'circle',
      size: 80,
      color: 'bg-primary',
      initialX: -100,
      initialY: -100,
      duration: 20,
    },
    {
      type: 'square',
      size: 60,
      color: 'bg-secondary',
      initialX: 100,
      initialY: -150,
      duration: 25,
    },
    {
      type: 'triangle',
      size: 70,
      color: 'bg-accent',
      initialX: -200,
      initialY: 100,
      duration: 22,
    },
    {
      type: 'circle',
      size: 40,
      color: 'bg-primary/50',
      initialX: 200,
      initialY: 150,
      duration: 18,
    },
    {
      type: 'square',
      size: 50,
      color: 'bg-secondary/60',
      initialX: -150,
      initialY: 200,
      duration: 28,
    },
  ];

  const shapeVariants = {
    animate: (custom: any) => ({
      x: [custom.initialX, custom.initialX + 100, custom.initialX - 50, custom.initialX],
      y: [custom.initialY, custom.initialY + 50, custom.initialY - 100, custom.initialY],
      rotate: [0, 360],
      transition: {
        duration: custom.duration,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  const renderShape = (shape: any) => {
    const baseClasses = `absolute opacity-20 blur-sm`;
    
    switch (shape.type) {
      case 'circle':
        return (
          <motion.div
            key={shape.type + shape.size}
            className={`${baseClasses} ${shape.color} rounded-full`}
            style={{
              width: shape.size,
              height: shape.size,
            }}
            variants={shapeVariants}
            animate="animate"
            custom={shape}
          />
        );
      case 'square':
        return (
          <motion.div
            key={shape.type + shape.size}
            className={`${baseClasses} ${shape.color}`}
            style={{
              width: shape.size,
              height: shape.size,
            }}
            variants={shapeVariants}
            animate="animate"
            custom={shape}
          />
        );
      case 'triangle':
        return (
          <motion.div
            key={shape.type + shape.size}
            className={`${baseClasses}`}
            variants={shapeVariants}
            animate="animate"
            custom={shape}
          >
            <div
              className={`w-0 h-0 ${shape.color.replace('bg-', 'border-b-')}`}
              style={{
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid currentColor`,
              }}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => renderShape(shape))}
    </div>
  );
};

export default FloatingShapes;