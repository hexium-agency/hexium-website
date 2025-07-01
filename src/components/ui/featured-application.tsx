import { useState } from 'react';
import { cn } from '../../lib/utils';

interface ApplicationType {
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  description: string;
  onClick?: () => void;
}

interface FeaturedApplicationProps {
  applicationType: ApplicationType[];
}

export default function FeaturedApplication({ applicationType }: FeaturedApplicationProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleClick = (application: ApplicationType, index: number) => {
    setSelectedIndex(index);
    application.onClick?.();
  };

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
      {applicationType.map((application, index) => {
        const isSelected = selectedIndex === index;
        const IconComponent = application.icon;

        return (
          <button
            key={application.name}
            className={cn(
              'group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-white/10 p-6 backdrop-blur-sm transition-all duration-300 ease-out',
              {
                'scale-105 border-white/30 bg-white/90 shadow-2xl': isSelected,
                'bg-white/5 hover:scale-102 hover:bg-white/10 hover:shadow-xl': !isSelected,
              }
            )}
            onClick={() => handleClick(application, index)}
            style={
              {
                '--accent-color': application.color,
              } as React.CSSProperties
            }
          >
            {isSelected && (
              <div
                className="absolute inset-0 -z-10 rounded-2xl opacity-20 blur-xl"
                style={{
                  background: `radial-gradient(circle at center, ${application.color}, transparent 70%)`,
                }}
              />
            )}

            <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
              <div
                className={cn('absolute inset-0 rounded-full transition-all duration-300', {
                  'scale-110 opacity-20': isSelected,
                  'scale-100 opacity-0 group-hover:scale-105 group-hover:opacity-10': !isSelected,
                })}
                style={{
                  backgroundColor: application.color,
                }}
              />

              <IconComponent
                className={cn('h-8 w-8 transition-all duration-300', {
                  'text-gray-800': isSelected,
                  'text-white/80 group-hover:text-white': !isSelected,
                })}
                style={{
                  color: isSelected ? application.color : undefined,
                }}
              />
            </div>

            <h3
              className={cn('mb-2 text-center text-lg font-semibold transition-all duration-300', {
                'text-gray-800': isSelected,
                'text-white/90 group-hover:text-white': !isSelected,
              })}
            >
              {application.name}
            </h3>

            <p
              className={cn('text-center text-sm leading-relaxed transition-all duration-300', {
                'text-gray-600': isSelected,
                'text-white/70 group-hover:text-white/80': !isSelected,
              })}
            >
              {application.description}
            </p>

            {isSelected && (
              <div className="absolute top-3 right-3">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: application.color }}
                >
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}

            <div
              className={cn(
                'absolute bottom-0 left-1/2 h-1 -translate-x-1/2 transform rounded-full transition-all duration-300',
                {
                  'w-2/3 opacity-100': isSelected,
                  'w-0 opacity-0 group-hover:w-1/3 group-hover:opacity-50': !isSelected,
                }
              )}
              style={{ backgroundColor: application.color }}
            />
          </button>
        );
      })}
    </div>
  );
}
