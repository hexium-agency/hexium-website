interface RectangleStackIconProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function RectangleStackIcon({ className, style }: RectangleStackIconProps) {
  return (
    <svg
      className={className}
      style={style}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m0 0c.235-.083.487-.128.75-.128A2.25 2.25 0 0 1 21 9v.878m0 0A2.25 2.25 0 0 1 18.75 12H5.25A2.25 2.25 0 0 1 3 9.878v0A2.25 2.25 0 0 1 5.25 7.5h13.5A2.25 2.25 0 0 1 21 9.878Z"
      />
    </svg>
  );
}
