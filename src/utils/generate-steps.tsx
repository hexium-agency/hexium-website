import type { ReactElement } from 'react';
import SelectStep from '@/components/ui/multi-step-app-estimate/select-step';
import SliderStep from '@/components/ui/multi-step-app-estimate/slider-step';
import MultiSelectStep from '@/components/ui/multi-step-app-estimate/multi-select-step';
import type { StepConfig } from '@/config/steps-config';

export const generateSteps = (
  config: StepConfig[],
  selectedOptions: Record<string, any>,
  onSelect: (stepId: string, option: any) => void
): ReactElement[] => {
  return config.map((step) => {
    if (step.type === 'slider') {
      return (
        <SliderStep
          key={step.id}
          title={step.title}
          subtitle={step.subtitle}
          value={selectedOptions[step.id]?.value || step.options?.[0]?.value || 0}
          min={step.options?.[0]?.min}
          max={step.options?.[0]?.max}
          label={step.options?.[0]?.label || ''}
          onValueChange={(value) =>
            onSelect(step.id, {
              value,
              label: `${value} ${step.options?.[0]?.label}`,
              multiplier: step.options?.[0]?.multiplier,
            })
          }
        />
      );
    }

    if (step.type === 'multi-select') {
      return (
        <MultiSelectStep
          key={step.id}
          title={step.title}
          subtitle={step.subtitle}
          options={step.options || []}
          onSelect={(options) => onSelect(step.id, options)}
          selectedOptions={selectedOptions[step.id] || []}
        />
      );
    }

    return (
      <SelectStep
        key={step.id}
        title={step.title}
        subtitle={step.subtitle}
        options={step.options || []}
        onSelect={(option) => onSelect(step.id, option)}
        selectedOption={selectedOptions[step.id] || null}
      />
    );
  });
};
