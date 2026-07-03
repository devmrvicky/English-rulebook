import { Link } from "react-router-dom";
import {
  Tag, UserRound, Zap, Link2, Clock, GitCompare, ArrowLeftRight,
  type LucideIcon,
} from "lucide-react";
import type { CategoryWithStats } from "@/features/english/services/ruleRepository";

const ICON_MAP: Record<string, LucideIcon> = {
  Tag, UserRound, Zap, Link2, Clock, GitCompare, ArrowLeftRight,
};

interface CategoryCardProps {
  category: CategoryWithStats;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon: LucideIcon = ICON_MAP[category.icon] ?? Tag;
  const pct = category.ruleCount > 0 ? (category.completedCount / category.ruleCount) * 100 : 0;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-ink/10 bg-paper p-4 transition-all hover:-translate-y-0.5 hover:border-amber/50 hover:shadow-sm dark:border-paper/10 dark:bg-nightpaper"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-soft text-amber">
          <Icon size={18} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold text-ink line-clamp-1 dark:text-paper">{category.name}</p>
          <p className="text-[11px] text-ink-faint">{category.ruleCount} rules</p>
        </div>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-[10px] text-ink-faint">
          <span>{category.completedCount} done</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="h-1 rounded-full bg-ink/10 dark:bg-paper/10">
          <div
            className="h-full rounded-full bg-amber transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
