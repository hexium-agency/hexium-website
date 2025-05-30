import type { Option } from '@/config/steps-config';

function calculateOptionValue(
  option: Option,
  multiplier: number
): { total: number; multiplier: number } {
  if (option.value_type === 'additive') {
    return { total: option.value, multiplier };
  } else if (option.value_type === 'multiplicative') {
    return { total: 0, multiplier: multiplier * (1 + option.value) };
  }
  return { total: 0, multiplier };
}

function calculateDesignValue(
  designOption: Option | null,
  designComplexityOption: Option | null,
  pagesOption: Option | null
): number {
  if (!designOption || !designComplexityOption || !pagesOption) return 0;

  const hadDesign = designOption.had_design;
  const pagesValue = pagesOption.value;
  const designMultiplier = hadDesign
    ? designComplexityOption.value
    : designComplexityOption.secondary_value || 1;

  return pagesValue * designMultiplier;
}

function calculateMultiplierValue(option: Option | null): number {
  if (!option || !option.multiplier) return 0;
  return option.value * option.multiplier;
}

export function calculateTotalEstimate(
  selectedOptions: Record<string, Option | Option[] | null>,
  multiplier: number
): number {
  let total = 0;
  let currentMultiplier = multiplier;

  // Manage simple and multiple options
  Object.entries(selectedOptions).forEach(([_, option]) => {
    if (!option) return;

    if (Array.isArray(option)) {
      option.forEach((opt) => {
        const { total: optionTotal, multiplier: optionMultiplier } = calculateOptionValue(
          opt,
          currentMultiplier
        );
        total += optionTotal;
        currentMultiplier = optionMultiplier;
      });
    } else {
      const { total: optionTotal, multiplier: optionMultiplier } = calculateOptionValue(
        option,
        currentMultiplier
      );
      total += optionTotal;
      currentMultiplier = optionMultiplier;
    }
  });

  // Add special values
  total += calculateDesignValue(
    selectedOptions['design'] as Option | null,
    selectedOptions['design-complexity'] as Option | null,
    selectedOptions['pages'] as Option | null
  );

  total += calculateMultiplierValue(selectedOptions['api-number'] as Option | null);
  total += calculateMultiplierValue(selectedOptions['payment-methods'] as Option | null);

  return Math.round(total * currentMultiplier);
}
