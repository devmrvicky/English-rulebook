import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown, ArrowLeft } from "lucide-react";
import * as Icons from "lucide-react";
import {
  getCategoryBySlug,
  getChaptersForCategory,
  getRulesForChapter,
  getAllProgress,
} from "@/features/english/services/ruleRepository";
import { useCatalogStore } from "@/features/english/store/catalogStore";
import type { Chapter, Rule, RuleProgress } from "@/features/english/types/rule.types";
import { RuleCard } from "@/features/english/components/RuleCard";
import { SkeletonCard } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";

interface ChapterWithRules {
  chapter: Chapter;
  rules: Rule[];
}

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const { init } = useCatalogStore();

  const [loading, setLoading] = useState(true);
  const [catName, setCatName] = useState("");
  const [catIcon, setCatIcon] = useState("Tag");
  const [catId, setCatId] = useState("");
  const [chaptersWithRules, setChaptersWithRules] = useState<ChapterWithRules[]>([]);
  const [progress, setProgress] = useState<Record<string, RuleProgress>>({});
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!categorySlug) return;
    (async () => {
      setLoading(true);
      await init();
      const cat = await getCategoryBySlug(categorySlug);
      if (!cat) { navigate("/", { replace: true }); return; }

      setCatName(cat.name);
      setCatIcon(cat.icon);
      setCatId(cat.id);

      const chapters = await getChaptersForCategory(cat.id);
      const allRulesPerChapter = await Promise.all(
        chapters.map((ch) => getRulesForChapter(ch.id)),
      );
      const combined = chapters.map((ch, i) => ({ chapter: ch, rules: allRulesPerChapter[i] }));
      setChaptersWithRules(combined);

      // Open the first chapter by default
      if (combined.length > 0) {
        setOpenChapters({ [combined[0].chapter.id]: true });
      }

      const allProg = await getAllProgress();
      const map: Record<string, RuleProgress> = {};
      allProg.forEach((p) => { map[p.ruleId] = p; });
      setProgress(map);

      setLoading(false);
    })();
  }, [categorySlug, init, navigate]);

  const toggleChapter = (id: string) =>
    setOpenChapters((prev) => ({ ...prev, [id]: !prev[id] }));

  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[catIcon] ?? Icons.Tag;
  const totalRules = chaptersWithRules.reduce((s, c) => s + c.rules.length, 0);
  const completedRules = chaptersWithRules.reduce(
    (s, c) => s + c.rules.filter((r) => progress[r.id]?.status === "completed").length,
    0,
  );
  const pct = totalRules > 0 ? Math.round((completedRules / totalRules) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink dark:hover:text-paper"
        >
          <ArrowLeft size={14} /> Dashboard
        </Link>

        {loading ? (
          <div className="skeleton h-8 w-48" />
        ) : (
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-soft">
              <Icon size={20} className="text-amber" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold text-ink dark:text-paper">{catName}</h1>
              <p className="text-xs text-ink-faint">{completedRules}/{totalRules} rules completed · {pct}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {!loading && totalRules > 0 && (
        <div className="h-1.5 rounded-full bg-ink/10 dark:bg-paper/10">
          <div className="h-full rounded-full bg-amber transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      )}

      {/* Chapters accordion */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && chaptersWithRules.length === 0 && (
        <EmptyState
          icon={Icons.BookOpen}
          title="No chapters yet"
          description="Content for this category will appear here once added."
        />
      )}

      {!loading && chaptersWithRules.map(({ chapter, rules }) => {
        const isOpen = openChapters[chapter.id] ?? false;
        const done = rules.filter((r) => progress[r.id]?.status === "completed").length;

        return (
          <div key={chapter.id} className="overflow-hidden rounded-lg border border-ink/10 dark:border-paper/10">
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="flex w-full items-center gap-3 bg-paper-dim px-4 py-3 text-left hover:bg-ink/5 dark:bg-nightpaper dark:hover:bg-paper/5"
            >
              <span className="font-display text-sm font-semibold text-ink dark:text-paper flex-1">
                {chapter.title}
              </span>
              <span className="font-mono text-[11px] text-ink-faint">{done}/{rules.length}</span>
              {isOpen ? (
                <ChevronDown size={16} className="text-ink-faint" />
              ) : (
                <ChevronRight size={16} className="text-ink-faint" />
              )}
            </button>

            {isOpen && (
              <div className="divide-y divide-ink/5 dark:divide-paper/5">
                {rules.length === 0 && (
                  <p className="px-4 py-4 text-sm text-ink-faint">No rules in this chapter yet.</p>
                )}
                {rules.map((rule) => (
                  <div key={rule.id} className="px-4 py-3">
                    <RuleCard
                      rule={rule}
                      categorySlug={categorySlug!}
                      chapterSlug={chapter.slug}
                      progress={progress[rule.id]}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
