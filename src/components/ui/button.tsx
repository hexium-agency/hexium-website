import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?:
    | 'blackFull'
    | 'blackLink'
    | 'grayFull'
    | 'blueFull'
    | 'whiteFull'
    | 'whiteLink'
    | 'disabled';
  className?: string;
}

export default function Button({
  children,
  className,
  color = 'blackFull',
  ...props
}: ButtonProps) {
  const styles = {
    blackFull: 'bg-gray-900 text-white ring-gray-900 ring-1',
    blackLink: 'bg-none ring-0 after:hidden shadow-none before:hidden after:hidden',
    grayFull: 'bg-gray-700 text-white ring-gray-700 ring-1',
    blueFull: 'bg-blue-600 text-white ring-blue-600 ring-1',
    whiteFull:
      'bg-white text-gray-950 ring-black ring-1 before:from-gray-600/20 after:from-gray-600/20',
    whiteLink: 'bg-none text-white ring-0 after:hidden shadow-none before:hidden after:hidden',
    disabled: 'cursor-not-allowed bg-gray-400 text-gray-500 ring-gray-400 ring-1',
  };

  return (
    <button
      className={cn(
        'group before:transtion-opacity relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-md px-3 py-1 text-left text-sm font-medium shadow-[0_1px_theme(colors.white/0.07)_inset,0_1px_3px_theme(colors.gray.900/0.2)] transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:from-white/20 before:opacity-50 before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:from-white/10 after:from-[46%] after:to-[54%] after:mix-blend-overlay hover:before:opacity-100',
        styles[color],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
