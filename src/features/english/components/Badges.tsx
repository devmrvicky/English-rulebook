import { cn } from "@/shared/utils/cn";
import type { Difficulty, ExamImportance } from "@/features/english/types/rule.types";

const difficultyConfig: Record<Difficulty, { label: string; classes: string }> = {
  easy: { label: "Easy", classes: "bg-margin-greenSoft text-margin-green border-margin-green/25" },
  medium: { label: "Medium", classes: "bg-amber-soft text-amber border-amber/25" },
  hard: { label: "Hard", classes: "bg-margin-redSoft text-margin-red border-margin-red/25" },
};

const importanceConfig: Record<ExamImportance, { label: string; classes: string }> = {
  low: { label: "Low importance", classes: "bg-paper-dim text-ink-faint border-ink/15" },
  medium: { label: "Medium", classes: "bg-paper-dim text-ink-soft border-ink/15" },
  high: { label: "High ★", classes: "bg-amber-soft text-amber border-amber/25" },
  "very-high": { label: "Must Know ★★", classes: "bg-margin-redSoft text-margin-red border-margin-red/25" },
};

interface BadgeProps {
  className?: string;
}

export function DifficultyBadge({ level, className }: { level: Difficulty } & BadgeProps) {
  const cfg = difficultyConfig[level];
  return (
    <span className={cn("inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-medium", cfg.classes, className)}>
      {cfg.label}
    </span>
  );
}

export function ImportanceBadge({ level, className }: { level: ExamImportance } & BadgeProps) {
  const cfg = importanceConfig[level];
  return (
    <span className={cn("inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-medium", cfg.classes, className)}>
      {cfg.label}
    </span>
  );
}
