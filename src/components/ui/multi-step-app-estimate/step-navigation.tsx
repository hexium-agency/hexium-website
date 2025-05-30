import Button from '@/components/ui/button';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isNextDisabled?: boolean;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isNextDisabled = false,
}: StepNavigationProps) {
  return (
    <div className="mt-7 flex justify-between gap-x-2">
      <div className="flex gap-x-2 sm:gap-x-4">
        <Button
          onClick={onPrevious}
          disabled={currentStep === 0}
          color={currentStep === 0 ? 'disabled' : 'blackFull'}
        >
          Précédent
        </Button>

        <Button
          onClick={() => {
            window.location.href = '/app';
          }}
          color="whiteFull"
        >
          Annuler
        </Button>
      </div>
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        color={isNextDisabled ? 'disabled' : 'blueFull'}
      >
        {currentStep === totalSteps - 1 ? 'Terminer' : 'Suivant'}
      </Button>
    </div>
  );
}
