import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ChevronRight, Trash2 } from "lucide-react";
import { getBookmarkedRules, toggleBookmark } from "@/features/english/services/ruleRepository";
import { useUserDataStore } from "@/features/english/store/userDataStore";
import { db } from "@/features/english/services/db";
import type { Rule } from "@/features/english/types/rule.types";
import { DifficultyBadge, ImportanceBadge } from "@/features/english/components/Badges";
import { EmptyState } from "@/shared/components/EmptyState";

export function BookmarksPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [catSlugs, setCatSlugs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { refreshStats } = useUserDataStore();

  const load = async () => {
    setLoading(true);
    const [bookmarked, cats] = await Promise.all([
      getBookmarkedRules(),
      db.categories.toArray(),
    ]);
    setRules(bookmarked);
    const map: Record<string, string> = {};
    cats.forEach((c) => { map[c.id] = c.slug; });
    setCatSlugs(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRemove = async (ruleId: string) => {
    await toggleBookmark(ruleId);
    await refreshStats();
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center gap-2">
        <Bookmark size={18} className="text-amber" />
        <h1 className="font-display text-xl font-bold text-ink dark:text-paper">Bookmarks</h1>
        {rules.length > 0 && (
          <span className="ml-auto font-mono text-sm text-ink-faint">{rules.length} saved</span>
        )}
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!loading && rules.length === 0 && (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Tap the bookmark button on any rule page to save it here for quick revision."
          action={
            <Link to="/" className="rounded-md bg-ink px-4 py-2 text-sm text-paper dark:bg-paper dark:text-ink">
              Browse rules
            </Link>
          }
        />
      )}

      {!loading && rules.length > 0 && (
        <div className="space-y-3">
          {rules.map((rule) => {
            const catSlug = catSlugs[rule.categoryId] ?? "";
            return (
              <div key={rule.id} className="flex items-start gap-2 rounded-lg border border-ink/10 p-4 dark:border-paper/10">
                <Link
                  to={`/category/${catSlug}/-/${rule.slug}`}
                  className="flex flex-1 items-start gap-3 group"
                >
                  <span className="rule-stamp mt-0.5 shrink-0">#{rule.ruleNumber}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold text-ink group-hover:text-amber dark:text-paper">
                      {rule.title}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-ink-faint">{rule.summary}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <DifficultyBadge level={rule.difficulty} />
                      <ImportanceBadge level={rule.importance} />
                    </div>
                  </div>
                  <ChevronRight size={15} className="mt-1 shrink-0 text-ink-faint" />
                </Link>

                <button
                  onClick={() => handleRemove(rule.id)}
                  className="ml-1 mt-1 rounded-md p-1 text-ink-faint hover:bg-margin-redSoft hover:text-margin-red"
                  title="Remove bookmark"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
