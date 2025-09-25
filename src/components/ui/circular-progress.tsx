interface CircularProgressProps {
  value: number; // từ 0 - 100
  size?: number;
  strokeWidth?: number;
  max?: number;
}

export function CircularProgress({
  value,
  size = 80,
  strokeWidth = 6,
  max = 100,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        stroke="#e9ebec"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="oklch(74.6% 0.16 232.661)"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        className="transition-all duration-300 ease-out"
      />
    </svg>
  );
}
