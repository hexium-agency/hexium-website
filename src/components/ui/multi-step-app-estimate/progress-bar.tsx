import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ progress, currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }, (_, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const barWidth = isCompleted || isCurrent ? '100%' : '0%';

          return (
            <div key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-gray-800/50">
              <motion.div
                className={cn(
                  'relative h-full rounded-full',
                  isCompleted && 'bg-gradient-to-r from-blue-500 to-blue-600',
                  isCurrent && 'bg-gradient-to-r from-blue-400 to-blue-500'
                )}
                initial={{ width: '0%' }}
                animate={{ width: barWidth }}
                transition={{
                  duration: 0.6,
                  delay: 0,
                  ease: [0.16, 1, 0.3, 1],
                  type: 'spring',
                  stiffness: 140,
                  damping: 18,
                }}
              >
                {/* Shimmer effect for current step */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                )}

                {/* Glow effect */}
                {(isCompleted || isCurrent) && (
                  <motion.div
                    className={cn(
                      'absolute inset-0 rounded-full blur-sm',
                      isCompleted && 'bg-blue-500/40',
                      isCurrent && 'bg-blue-400/50'
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05 + 0.1,
                    }}
                  />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
