import Button from '@/components/ui/button';
import type { Option } from '@/config/steps-config';

interface MultiSelectStepProps {
  title: string;
  subtitle?: string;
  options: Option[];
  onSelect: (options: Option[]) => void;
  selectedOptions: Option[];
}

export default function MultiSelectStep({
  title,
  subtitle,
  options,
  onSelect,
  selectedOptions,
}: MultiSelectStepProps) {
  const handleOptionClick = (option: Option) => {
    const isSelected = selectedOptions.some((selected) => selected.label === option.label);

    if (isSelected) {
      onSelect(selectedOptions.filter((selected) => selected.label !== option.label));
    } else {
      onSelect([...selectedOptions, option]);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
        {subtitle && <p className="text-sm text-black/50">{subtitle}</p>}
      </div>

      <div className="grid w-full grid-flow-col grid-rows-3 gap-3 overflow-x-auto px-0.5 pt-0.5 pb-4">
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleOptionClick(option)}
            color={
              selectedOptions.some((selected) => selected.label === option.label)
                ? 'blueFull'
                : 'whiteFull'
            }
            className="h-14 w-full min-w-fit sm:h-16"
          >
            <p className="text-xs font-medium whitespace-nowrap sm:text-base">{option.label}</p>
          </Button>
        ))}
      </div>
    </div>
  );
}
