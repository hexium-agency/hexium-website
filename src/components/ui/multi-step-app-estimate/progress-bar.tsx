import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="ml-auto w-full max-w-lg">
      <div className="w-full">
        <div className="h-2 w-full overflow-hidden rounded-full border border-gray-300 bg-gray-50">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
        <div className="mt-2 text-right text-sm font-extrabold text-black">{progress}%</div>
      </div>
    </div>
  );
}
