import { Slider } from '@/components/ui/slider';

interface SliderStepProps {
  title: string;
  label: string;
  subtitle?: string;
  value: number;
  min?: number;
  max?: number;
  onValueChange: (value: number) => void;
}

export default function SliderStep({
  title,
  subtitle,
  value,
  min,
  max,
  label,
  onValueChange,
}: SliderStepProps) {
  return (
    <div className="flex h-80 w-full flex-col">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
        {subtitle && <p className="text-sm text-black/50">{subtitle}</p>}
      </div>

      <div className="flex h-full flex-col justify-center gap-y-4 px-5">
        <Slider
          value={[value]}
          onValueChange={(values) => onValueChange(values[0])}
          min={min}
          max={max}
          step={1}
          className="w-full"
        />
        <div className="text-center font-medium text-black">
          {value === 0 ? 'Aucune' : value}
          {value === max ? '+' : ''} {label}
          {value > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
