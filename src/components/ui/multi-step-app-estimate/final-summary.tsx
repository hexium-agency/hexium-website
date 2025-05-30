import type { Option, StepConfig } from '@/config/steps-config';
import { motion } from 'framer-motion';
import { calculateTotalEstimate } from '@/utils/calculate-total-estimate';
import Button from '@/components/ui/button';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center"
    >
      <h2 className="text-xl font-bold text-black sm:text-2xl">Résumé de votre estimation</h2>

      <div className="mt-8 w-full rounded-3xl bg-white p-6">
        <h3 className="text-xl font-semibold text-gray-700">Options sélectionnées :</h3>
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
                className="flex flex-col gap-5 border-b border-gray-200 pb-2 last:border-b-0 sm:flex-row sm:justify-between"
              >
                <span className="font-mono text-gray-500">{step.title}</span>
                <span className="text-right font-mono break-words text-black">{optionLabel}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8 mb-8 w-full space-y-4 rounded-3xl bg-white p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-600">Estimation totale</h3>
        <p className="text-3xl font-bold text-blue-600">{total} jours</p>
        <p className="text-sm text-gray-600">
          Cette estimation est basée sur les options que vous avez sélectionnées.
        </p>
      </div>
      <Button
        color="blueFull"
        onClick={() => {
          window.location.href = '/app';
        }}
      >
        Retour à l'accueil
      </Button>
    </motion.div>
  );
}
