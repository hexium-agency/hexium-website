import MultiStepAppEstimate from '@/components/ui/multi-step-app-estimate/multi-step-app-estimate';
import FeaturedApplication from '@/components/ui/featured-application';
import {
  mobileStepsConfig,
  pwaStepsConfig,
  webAppStepsConfig,
  type StepConfig,
} from '@/config/steps-config';
import { useState } from 'react';

interface StepConfigMultiplier {
  stepConfig: StepConfig[];
  multiplier: number;
}

const technologies = [
  {
    name: 'Application Mobile',
    logoOutline: '/icons/mobile-outline.svg',
    logoFull: '/icons/mobile-full.svg',
    color: '#b51341',
  },
  {
    name: 'PWA',
    logoOutline: '/icons/pwa-outline.svg',
    logoFull: '/icons/pwa-full.svg',
    color: '#4ce813',
  },
  {
    name: 'Application Web',
    logoOutline: '/icons/web-outline.svg',
    logoFull: '/icons/web-full.svg',
    color: '#3B82F6',
  },
];

export default function AppEstimate() {
  const [selectedStepsConfig, setSelectedStepsConfig] = useState<StepConfigMultiplier | null>(null);

  const handleTechnologyClick = (index: number) => {
    const configs = [
      { stepConfig: mobileStepsConfig, multiplier: 1 },
      { stepConfig: pwaStepsConfig, multiplier: 0.8 },
      { stepConfig: webAppStepsConfig, multiplier: 1 },
    ];
    setSelectedStepsConfig(configs[index]);
  };

  return (
    <div className="mx-3 py-10 md:mx-auto md:max-w-7xl">
      {selectedStepsConfig === null && (
        <div className="mx-auto flex flex-col items-center justify-center rounded-3xl bg-gray-950 px-6 py-10 text-white shadow-2xl md:px-10">
          <div className="mx-auto max-w-lg">
            <h2 className="text-center font-mono text-xs leading-none font-medium text-gray-200 uppercase">
              Vous cherchez à faire estimer votre application ?
            </h2>
            <h3 className="font-heading mt-8 text-center text-3xl font-semibold tracking-tight text-pretty md:text-4xl">
              Nous vous proposons de faire une estimation de votre application gratuitement.
            </h3>
            <div className="mx-auto mt-8 text-center text-[0.875rem]/5 text-gray-200">
              Notre logiciel vous permet de faire une estimation de votre application en quelques
              minutes et vous donne une idée de la complexité de votre projet.
            </div>
          </div>
          <div className="mt-8 w-full">
            <FeaturedApplication
              applicationType={technologies.map((tech, index) => ({
                ...tech,
                url: '#',
                onClick: () => handleTechnologyClick(index),
              }))}
            />
          </div>
        </div>
      )}
      {selectedStepsConfig && (
        <MultiStepAppEstimate
          stepsConfig={selectedStepsConfig.stepConfig}
          multiplier={selectedStepsConfig.multiplier}
        />
      )}
    </div>
  );
}
