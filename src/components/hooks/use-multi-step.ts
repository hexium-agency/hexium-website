'use client';

import { type ReactElement, useState } from 'react';

interface UseMultiStepReturn {
  back: () => void;
  currentStepIndex: number;
  direction: 'next' | 'prev';
  goTo: (index: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  next: () => void;
  step: ReactElement;
  steps: ReactElement[];
}

export function useMultiStep(steps: ReactElement[]): UseMultiStepReturn {
  if (steps.length === 0) {
    throw new Error('useMultiStep requires at least one step');
  }

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  function next() {
    setDirection('next');
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) {
        return i;
      }
      return i + 1;
    });
  }

  function back() {
    setDirection('prev');
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  }

  function goTo(index: number) {
    if (index < 0 || index >= steps.length) {
      throw new Error(`Invalid step index: ${index}`);
    }
    setDirection(index > currentStepIndex ? 'next' : 'prev');
    setCurrentStepIndex(index);
  }

  return {
    back,
    currentStepIndex,
    direction,
    goTo,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    next,
    step: steps[currentStepIndex],
    steps,
  };
}
