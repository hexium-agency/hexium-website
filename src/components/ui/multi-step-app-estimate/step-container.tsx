import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepContainerProps {
  children: React.ReactNode;
  isActive: boolean;
  direction: 'next' | 'prev';
}

export default function StepContainer({ children, isActive, direction }: StepContainerProps) {
  const variants = {
    enter: (direction: 'next' | 'prev') => ({
      x: direction === 'next' ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'next' | 'prev') => ({
      zIndex: 0,
      x: direction === 'next' ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence initial={false} custom={direction} mode="wait">
      {isActive && (
        <motion.div
          key={direction}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 280, damping: 40 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0 w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
