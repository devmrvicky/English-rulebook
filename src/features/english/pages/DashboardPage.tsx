import { useEffect } from "react";
import { BookOpen, Bookmark, RefreshCcw, Library } from "lucide-react";
import { Link } from "react-router-dom";
import { useCatalogStore } from "@/features/english/store/catalogStore";
import { useUserDataStore } from "@/features/english/store/userDataStore";
import { CategoryCard } from "@/features/english/components/CategoryCard";
import { ProgressRing } from "@/shared/components/ProgressRing";
import { SkeletonCard } from "@/shared/components/Skeleton";

function StatPill({
  icon: Icon,
  label,
  value,
  to,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  to?: string;
}) {
  const inner = (
    <div className="flex items-center gap-3 rounded-lg border border-ink/10 bg-paper px-4 py-3 dark:border-paper/10 dark:bg-nightpaper">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-soft">
        <Icon size={16} className="text-amber" />
      </span>
      <div>
        <p className="font-mono text-lg font-semibold text-ink dark:text-paper">{value}</p>
        <p className="text-[11px] text-ink-faint">{label}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export function DashboardPage() {
  const { categories, status, init } = useCatalogStore();
  const { stats, refreshStats } = useUserDataStore();

  useEffect(() => {
    init();
    refreshStats();
  }, [init, refreshStats]);

  const totalRules = stats?.totalRules ?? 0;
  const completed = stats?.completedRules ?? 0;
  const pct = totalRules > 0 ? (completed / totalRules) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Hero stat row */}
      <section>
        <h1 className="mb-1 font-display text-2xl font-bold text-ink dark:text-paper">
          English Rule Book
        </h1>
        <p className="text-sm text-ink-faint">
          Grammar mastery for SSC · Railway · Banking · Defence · State PCS
        </p>
      </section>

      {/* Overall progress + quick stats */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex shrink-0 flex-col items-center gap-2 rounded-lg border border-ink/10 bg-paper px-6 py-4 dark:border-paper/10 dark:bg-nightpaper">
          <ProgressRing percent={pct} size={72} label="Overall" />
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-3">
          <StatPill icon={Library} label="Total rules" value={totalRules} />
          <StatPill icon={BookOpen} label="Completed" value={completed} />
          <StatPill icon={Bookmark} label="Bookmarked" value={stats?.bookmarkedCount ?? 0} to="/bookmarks" />
          <StatPill icon={RefreshCcw} label="Needs revision" value={stats?.needsRevisionCount ?? 0} />
        </div>
      </section>

      {/* Categories grid */}
      <section>
        <h2 className="mb-3 font-display text-base font-semibold text-ink dark:text-paper">
          All Categories
        </h2>
        {status === "loading" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}
        {status === "ready" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => <CategoryCard key={cat.id} category={cat} />)}
          </div>
        )}
      </section>
    </div>
  );
}
