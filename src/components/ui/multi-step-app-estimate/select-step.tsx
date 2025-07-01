import Button from '@/components/ui/button';
import type { Option } from '@/config/steps-config';
import { cn } from '@/lib/utils';

interface SelectStepProps {
  title: string;
  subtitle?: string;
  options: Option[];
  onSelect: (option: Option) => void;
  selectedOption: Option | null;
}

export default function SelectStep({
  title,
  subtitle,
  options,
  onSelect,
  selectedOption,
}: SelectStepProps) {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h2 className="mt-4 text-xl font-semibold sm:text-2xl">{title}</h2>
        {subtitle && <p className="text-sm text-white/90">{subtitle}</p>}
      </div>

      <div className={cn('mx-0.5', options.length >= 4 ? 'grid grid-cols-2 gap-3' : 'space-y-3')}>
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onSelect(option)}
            color={option.label === selectedOption?.label ? 'blueFull' : 'whiteFull'}
            className="h-14 w-full sm:h-16"
          >
            <p className="text-xs font-medium sm:text-base">{option.label}</p>
          </Button>
        ))}
      </div>
    </div>
  );
}
