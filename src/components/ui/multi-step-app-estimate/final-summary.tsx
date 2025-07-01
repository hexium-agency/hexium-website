import type { Option, StepConfig } from '@/config/steps-config';
import { motion } from 'framer-motion';
import { calculateTotalEstimate } from '@/utils/calculate-total-estimate';
import Button from '@/components/ui/button';
import { useEffect, useRef } from 'react';

interface FinalSummaryProps {
  selectedOptions: Record<string, Option | Option[] | null>;
  stepsConfig: StepConfig[];
  multiplier: number;
}

export default function FinalSummary({
  selectedOptions,
  stepsConfig,
  multiplier,
}: FinalSummaryProps) {
  const total = calculateTotalEstimate(selectedOptions, multiplier);
  const estimationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (estimationRef.current) {
      const yOffset = -300;
      const element = estimationRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mx-auto flex min-h-[512px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-gray-950 px-6 py-10 text-white shadow-2xl"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950 from-10% via-transparent to-gray-950 to-90%"></div>
      <div className="absolute bottom-1/4 left-1/2 h-[1000px] w-[600px] -translate-x-1/2 rounded-b-full bg-gradient-to-b from-gray-950 to-gray-950/80 to-80% blur-3xl"></div>
      <div className="absolute bottom-1/3 left-1/2 h-[1000px] w-[600px] -translate-x-1/2 rounded-b-full bg-blue-500/60 blur-3xl"></div>
      <div className="pointer-events-none absolute inset-0 bg-[url('../images/noise.png')] bg-repeat opacity-60 mix-blend-soft-light"></div>

      {/* Content */}
      <div className="z-50 w-full max-w-2xl">
        <h2 className="mb-8 text-center text-xl font-bold text-white sm:text-2xl">
          Résumé de votre estimation
        </h2>

        <div className="mt-8 w-full rounded-3xl border border-gray-800/50 bg-gray-900/80 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-200">Options sélectionnées :</h3>
          <ul className="mt-6 space-y-3">
            {Object.entries(selectedOptions).map(([stepId, option]) => {
              if (!option) return null;

              const step = stepsConfig.find((s) => s.id === stepId);
              if (!step) return null;

              let optionLabel = '';
              if (Array.isArray(option)) {
                optionLabel = option.map((opt) => opt.label).join(', ');
              } else {
                optionLabel = option.label;
              }

              return (
                <li
                  key={stepId}
                  className="flex flex-col gap-5 border-b border-gray-700/50 pb-2 last:border-b-0 sm:flex-row sm:justify-between"
                >
                  <span className="font-mono text-gray-400">{step.title}</span>
                  <span className="text-right font-mono break-words text-white">{optionLabel}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          ref={estimationRef}
          className="mt-8 mb-8 w-full space-y-4 rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6 text-center backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-gray-200">Estimation totale</h3>
          <p className="text-3xl font-bold text-blue-400">{total} jours</p>
          <p className="text-sm text-gray-400">
            Cette estimation est basée sur les options que vous avez sélectionnées.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            color="blackFull"
            onClick={() => {
              const element = document.querySelector(
                '[data-cal-namespace="etude-de-projet"]'
              ) as HTMLElement;
              element?.click();
            }}
          >
            Planifier un appel
          </Button>
          <Button color="blueFull" asChild>
            <a href="/contact">Prendre contact</a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
