interface ProgressRingProps {
  percent: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ProgressRing({ percent, size = 64, strokeWidth = 6, label }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-ink/10" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-amber transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span className="-mt-12 font-mono text-sm font-semibold text-ink dark:text-paper" style={{ marginTop: -size / 2 - 2 }}>
        {Math.round(percent)}%
      </span>
      <div style={{ height: size / 2 - 8 }} />
      {label && <span className="text-xs text-ink-faint">{label}</span>}
    </div>
  );
}
