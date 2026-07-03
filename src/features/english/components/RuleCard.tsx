import { Link } from "react-router-dom";
import { Clock, CheckCircle2, BookOpen, AlertCircle } from "lucide-react";
import type { Rule, RuleProgress } from "@/features/english/types/rule.types";
import { DifficultyBadge, ImportanceBadge } from "@/features/english/components/Badges";
import { cn } from "@/shared/utils/cn";

interface RuleCardProps {
  rule: Rule;
  categorySlug: string;
  chapterSlug: string;
  progress?: RuleProgress;
}

const statusIcon: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 size={14} className="text-margin-green" />,
  "in-progress": <BookOpen size={14} className="text-amber" />,
  "needs-revision": <AlertCircle size={14} className="text-margin-red" />,
};

export function RuleCard({ rule, categorySlug, chapterSlug, progress }: RuleCardProps) {
  const status = progress?.status ?? "unread";
  const isRead = status !== "unread";

  return (
    <Link
      to={`/category/${categorySlug}/${chapterSlug}/${rule.slug}`}
      className={cn(
        "group block rounded-lg border p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm",
        isRead
          ? "border-ink/10 bg-paper dark:border-paper/10 dark:bg-nightpaper"
          : "border-ink/10 bg-paper dark:border-paper/10 dark:bg-nightpaper",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="rule-stamp mt-0.5 shrink-0">#{rule.ruleNumber}</span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-sm font-semibold text-ink group-hover:text-ink-soft dark:text-paper dark:group-hover:text-paper/80">
              {rule.title}
            </h3>
            {status !== "unread" && (
              <span className="flex items-center gap-1">{statusIcon[status]}</span>
            )}
          </div>

          <p className="mt-1 line-clamp-2 text-xs text-ink-faint">{rule.summary}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <DifficultyBadge level={rule.difficulty} />
            <ImportanceBadge level={rule.importance} />
            <span className="ml-auto flex items-center gap-1 text-[10px] text-ink-faint">
              <Clock size={11} />
              {rule.readingTimeMinutes} min
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
