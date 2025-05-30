import { useEffect, useRef } from 'react';
import { DotsHoverBlock } from '@/lib/dots/dots-hover-block';
import hexRgb from 'hex-rgb';

interface ApplicationType {
  name: string;
  logoOutline: string;
  logoFull: string;
  color: string;
  onClick?: () => void;
}

interface FeaturedApplicationProps {
  applicationType: ApplicationType[];
}

export default function FeaturedApplication({ applicationType }: FeaturedApplicationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const applicationsColors = applicationType.map((application) =>
    hexRgb(application.color, { format: 'array' })
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const buttons = containerRef.current.querySelectorAll('button');
    let maxZ = buttons.length;

    buttons.forEach((button, index) => {
      const color = applicationsColors[index];
      new DotsHoverBlock(button, [color]);

      button.addEventListener('mouseenter', () => {
        maxZ += 1;

        buttons.forEach((b) => {
          b.style.setProperty('--focus-z', maxZ.toString());
        });

        button.style.zIndex = (maxZ + 1).toString();
      });

      button.addEventListener('mouseleave', () => {
        button.style.zIndex = '0';
      });
    });
  }, [applicationsColors]);

  return (
    <div
      ref={containerRef}
      className="featured-technologies relative mx-auto flex max-w-4xl flex-auto flex-wrap justify-center pt-px pl-px"
    >
      {applicationType.map((application, index) => (
        <button
          key={application.name}
          className="group relative -mt-px -ml-px flex w-1/2 flex-none cursor-pointer items-center justify-center border border-gray-800 bg-gray-950 py-8 transition-[border-color,z-index] delay-150 hover:border-gray-700 hover:delay-0 hover:duration-300 focus:!z-[--focus-z] focus:transition-none sm:w-1/3"
          style={{ '--focus-z': 0, zIndex: 0 } as React.CSSProperties}
          data-color={applicationsColors[index]}
          onClick={application.onClick}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%]" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(42.89% 50% at 50% 50%, rgba(19, 19, 22, 0.8) 8.57%, rgba(19, 19, 22, 0) 100%)',
            }}
          />
          <div className="relative flex w-full flex-col items-center">
            <div className="no-hover:translate-y-0 relative aspect-[104/42] w-[calc(104/16*1rem)] max-w-full transition-transform duration-300 group-hover:translate-y-0 group-focus:translate-y-0 md:translate-y-4">
              <img
                src={application.logoOutline}
                alt={application.name}
                className="absolute inset-0 h-full w-full text-transparent transition-opacity duration-500 group-hover:opacity-0 group-focus:opacity-0 md:text-white"
              />
              <img
                src={application.logoFull}
                alt={application.name}
                className="absolute inset-0 h-full w-full transition-opacity duration-500 group-hover:opacity-100 group-focus:opacity-100 md:opacity-0 dark:hidden"
              />
            </div>
            <div className="no-hover:opacity-100 mt-2 text-sm font-medium text-white transition-opacity duration-300 group-hover:opacity-100 group-hover:delay-75 group-focus:opacity-100 group-focus:delay-75 md:opacity-0">
              {application.name}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
