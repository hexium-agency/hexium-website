import { useMultiStep } from '@/components/hooks/use-multi-step';
import ProgressBar from '@/components/ui/multi-step-app-estimate/progress-bar';
import StepContainer from '@/components/ui/multi-step-app-estimate/step-container';
import StepNavigation from '@/components/ui/multi-step-app-estimate/step-navigation';
import FinalSummary from '@/components/ui/multi-step-app-estimate/final-summary';
import { useState } from 'react';
import { generateSteps } from '@/utils/generate-steps';
import type { StepConfig, Option } from '@/config/steps-config';

interface MultiStepProps {
  stepsConfig: StepConfig[];
  multiplier: number;
}

export default function MultiStepAppEstimate({ stepsConfig, multiplier }: MultiStepProps) {
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

  // Filter steps to ignore those that should be passed
  const filteredStepsConfig = stepsConfig.filter((_, index) => {
    if (index === 0) return true;

    // Check if the previous step has an option with pass_next_step set to true
    const previousStep = stepsConfig[index - 1];
    const previousOption = selectedOptions[previousStep.id];

    // If the previous option has pass_next_step set to true, ignore this step
    if (Array.isArray(previousOption)) {
      return !previousOption.some((opt) => opt.pass_next_step);
    }
    return !previousOption?.pass_next_step;
  });

  const steps = generateSteps(filteredStepsConfig, selectedOptions, handleSelect);

  const { currentStepIndex, isLastStep, next, back, direction } = useMultiStep(steps);

  // Verify if the current step has a valid selection
  const isCurrentStepValid = () => {
    const currentStep = filteredStepsConfig[currentStepIndex];

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
    <div className="mx-auto rounded-3xl px-6 py-8 shadow-2xl md:px-10">
      {!showFinalSummary ? (
        <>
          <ProgressBar
            progress={Math.round((currentStepIndex / (filteredStepsConfig.length - 1)) * 100)}
          />

          <div className="relative mt-2 h-[340px] overflow-hidden">
            {steps.map((stepContent, index) => (
              <StepContainer
                key={`step-${index}`}
                isActive={currentStepIndex === index}
                direction={direction}
              >
                {stepContent}
              </StepContainer>
            ))}
          </div>

          <StepNavigation
            currentStep={currentStepIndex}
            totalSteps={filteredStepsConfig.length}
            onNext={handleNext}
            onPrevious={back}
            isNextDisabled={!isCurrentStepValid()}
          />
        </>
      ) : (
        <FinalSummary
          selectedOptions={selectedOptions}
          stepsConfig={stepsConfig}
          multiplier={multiplier}
        />
      )}
    </div>
  );
}
