import Button from '@/components/ui/button';
import MultiStepAppEstimate from '@/components/ui/multi-step-app-estimate/multi-step-app-estimate';
import FeaturedApplication from '@/components/ui/featured-application';
import { useState } from 'react';

export default function AppEstimate() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStart = () => {
    setIsTransitioning(true);
    // Wait for the fade out animation to complete before showing the next component
    setTimeout(() => {
      setHasStarted(true);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="mx-3 py-10 md:mx-auto md:max-w-7xl">
      {!hasStarted && (
        <div
          className={`relative mx-auto flex min-h-[512px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-gray-950 px-6 py-10 text-white shadow-2xl transition-all duration-500 ease-in-out md:px-10 ${
            isTransitioning
              ? 'translate-y-4 scale-95 opacity-0'
              : 'translate-y-0 scale-100 opacity-100'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 from-10% via-transparent to-gray-950 to-90%"></div>
          <div className="absolute bottom-1/4 left-1/2 h-[1000px] w-[600px] -translate-x-1/2 rounded-b-full bg-gradient-to-b from-gray-950 to-gray-950/80 to-80% blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/2 h-[1000px] w-[600px] -translate-x-1/2 rounded-b-full bg-blue-500/60 blur-3xl"></div>
          <div className="pointer-events-none absolute inset-0 bg-[url('../images/noise.png')] bg-repeat opacity-60 mix-blend-soft-light"></div>
          <div className="z-50 mx-auto max-w-lg">
            <h2 className="text-center font-mono text-xs leading-none font-medium text-gray-200 uppercase">
              Vous cherchez à faire estimer votre application ?
            </h2>
            <h3 className="font-heading mt-8 text-center text-3xl font-semibold tracking-tight text-pretty md:text-4xl">
              Nous vous proposons de faire une estimation de votre application gratuitement.
            </h3>
            <div className="mx-auto mt-8 text-center text-[0.875rem]/5 text-gray-200">
              Notre logiciel vous permet de faire une estimation de votre application en quelques
              minutes et vous donne une idée de la complexité de votre projet.
            </div>
          </div>

          <div className="z-50 mt-8">
            <Button onClick={handleStart} color="blueFull" disabled={isTransitioning}>
              C'est parti
            </Button>
          </div>
        </div>
      )}
      {hasStarted && (
        <div className="animate-slide-up-fade-in">
          <MultiStepAppEstimate />
        </div>
      )}
    </div>
  );
}
