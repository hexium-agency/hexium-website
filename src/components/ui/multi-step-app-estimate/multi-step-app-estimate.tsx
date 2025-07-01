import { useMultiStep } from '@/components/hooks/use-multi-step';
import ProgressBar from '@/components/ui/multi-step-app-estimate/progress-bar';
import StepContainer from '@/components/ui/multi-step-app-estimate/step-container';
import StepNavigation from '@/components/ui/multi-step-app-estimate/step-navigation';
import FinalSummary from '@/components/ui/multi-step-app-estimate/final-summary';
import FeaturedApplication from '@/components/ui/featured-application';
import DevicePhoneMobileIcon from '@/components/icons/device-phone-mobile-icon';
import ComputerDesktopIcon from '@/components/icons/computer-desktop-icon';
import RectangleStackIcon from '@/components/icons/rectangle-stack-icon';
import { useState } from 'react';
import { generateSteps } from '@/utils/generate-steps';
import type { StepConfig, Option } from '@/config/steps-config';
import { mobileStepsConfig, pwaStepsConfig, webAppStepsConfig } from '@/config/steps-config';

interface StepConfigMultiplier {
  stepConfig: StepConfig[];
  multiplier: number;
}

const technologies = [
  {
    name: 'Application Mobile',
    icon: DevicePhoneMobileIcon,
    color: '#3B82F6',
    description:
      'Concrétisez votre vision avec une application mobile livrée en quelques semaines !',
  },
  {
    name: 'PWA',
    icon: RectangleStackIcon,
    color: '#000000',
    description: 'Déployez votre idée en une app unique, accessible sur tous les écrans.',
  },
  {
    name: 'Application Web',
    icon: ComputerDesktopIcon,
    color: '#b51341',
    description:
      'Passez de l’idée à l’action avec une application web sur-mesure, rapide et innovante.',
  },
];

export default function MultiStepAppEstimate() {
  const [selectedTechnology, setSelectedTechnology] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, Option | Option[] | null>>(
    {}
  );
  const [showFinalSummary, setShowFinalSummary] = useState(false);

  const handleSelect = (stepId: string, option: Option | Option[]) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [stepId]: option,
    }));
  };

  const handleTechnologySelect = (index: number) => {
    setSelectedTechnology(index);
  };

  const getConfigForTechnology = (techIndex: number): StepConfigMultiplier => {
    const configs = [
      { stepConfig: mobileStepsConfig, multiplier: 1 },
      { stepConfig: pwaStepsConfig, multiplier: 0.8 },
      { stepConfig: webAppStepsConfig, multiplier: 1 },
    ];
    return configs[techIndex];
  };

  const selectedConfig =
    selectedTechnology !== null ? getConfigForTechnology(selectedTechnology) : null;

  const filteredStepsConfig = selectedConfig
    ? selectedConfig.stepConfig.filter((_, index) => {
        if (index === 0) return true;

        const previousStep = selectedConfig.stepConfig[index - 1];
        const previousOption = selectedOptions[previousStep.id];

        if (Array.isArray(previousOption)) {
          return !previousOption.some((opt) => opt.pass_next_step);
        }
        return !previousOption?.pass_next_step;
      })
    : [];

  const steps = selectedConfig
    ? generateSteps(filteredStepsConfig, selectedOptions, handleSelect)
    : [];

  const allSteps = [
    <div className="flex flex-col items-center justify-center">
      <h2 className="mt-4 mb-2 text-center text-2xl font-bold text-white">
        Choisissez le type d'application
      </h2>
      <p className="mb-8 text-center text-white/70">
        Sélectionnez le type d'application que vous souhaitez développer
      </p>
      <FeaturedApplication
        applicationType={technologies.map((tech, index) => ({
          ...tech,
          onClick: () => handleTechnologySelect(index),
        }))}
      />
    </div>,
    ...steps,
  ];

  const totalSteps = allSteps.length;
  const { currentStepIndex, isLastStep, next, back, direction } = useMultiStep(allSteps);

  const isCurrentStepValid = () => {
    if (currentStepIndex === 0) {
      return selectedTechnology !== null;
    }

    if (!selectedConfig) return false;

    const actualStepIndex = currentStepIndex - 1;
    const currentStep = filteredStepsConfig[actualStepIndex];

    if (currentStep.type === 'slider') {
      return true;
    }

    const currentSelection = selectedOptions[currentStep.id];

    if (currentStep.type === 'select') {
      return currentSelection !== null && currentSelection !== undefined;
    }

    if (currentStep.type === 'multi-select') {
      return Array.isArray(currentSelection) && currentSelection.length > 0;
    }

    return false;
  };

  const handleNext = () => {
    if (isLastStep) {
      setShowFinalSummary(true);
    } else {
      next();
    }
  };

  return (
    <div className="mx-auto rounded-3xl bg-gray-950 shadow-2xl md:px-10">
      {!showFinalSummary ? (
        <div className="px-6 py-8">
          <ProgressBar
            progress={Math.round((currentStepIndex / (totalSteps - 1)) * 100)}
            currentStep={currentStepIndex}
            totalSteps={totalSteps}
          />

          <div className="relative mt-2 h-[340px] overflow-hidden">
            {allSteps.map((stepContent, index) => (
              <StepContainer
                key={`step-${index}`}
                isActive={currentStepIndex === index}
                direction={direction}
              >
                <div className="text-white">{stepContent}</div>
              </StepContainer>
            ))}
          </div>

          <StepNavigation
            currentStep={currentStepIndex}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrevious={back}
            isNextDisabled={!isCurrentStepValid()}
          />
        </div>
      ) : (
        selectedConfig && (
          <FinalSummary
            selectedOptions={selectedOptions}
            stepsConfig={selectedConfig.stepConfig}
            multiplier={selectedConfig.multiplier}
          />
        )
      )}
    </div>
  );
}
