import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { searchRules } from "@/features/english/services/ruleRepository";
import { useCatalogStore } from "@/features/english/store/catalogStore";
import { db } from "@/features/english/services/db";
import type { SearchResult } from "@/features/english/types/rule.types";
import { DifficultyBadge, ImportanceBadge } from "@/features/english/components/Badges";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

const matchLabel: Record<string, string> = {
  title: "Title",
  keyword: "Keyword",
  summary: "Summary",
  hindi: "Hindi",
  example: "Example",
};

export function SearchPage() {
  const { init } = useCatalogStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [catSlugs, setCatSlugs] = useState<Record<string, string>>({});

  const debounced = useDebouncedValue(query, 250);

  useEffect(() => {
    init().then(async () => {
      const cats = await db.categories.toArray();
      const map: Record<string, string> = {};
      cats.forEach((c) => { map[c.id] = c.slug; });
      setCatSlugs(map);
    });
  }, [init]);

  useEffect(() => {
    if (!debounced.trim()) { setResults([]); setSearched(false); return; }
    searchRules(debounced).then((r) => { setResults(r); setSearched(true); });
  }, [debounced]);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="font-display text-xl font-bold text-ink dark:text-paper">Search Rules</h1>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          autoFocus
          type="search"
          placeholder="Search by rule, keyword, Hindi word…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-ink/20 bg-paper py-3 pl-9 pr-9 text-sm outline-none focus:border-amber dark:border-paper/20 dark:bg-nightpaper dark:text-paper"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink dark:hover:text-paper"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {searched && results.length === 0 && (
        <p className="py-8 text-center text-sm text-ink-faint">
          No rules matched <em>"{debounced}"</em>. Try a different keyword.
        </p>
      )}

      {results.length > 0 && (
        <p className="text-xs text-ink-faint">{results.length} result{results.length !== 1 ? "s" : ""}</p>
      )}

      <div className="space-y-3">
        {results.map(({ rule, matchedOn, snippet }) => {
          const catSlug = catSlugs[rule.categoryId] ?? "";
          return (
            <Link
              key={rule.id}
              to={`/category/${catSlug}/-/${rule.slug}`}
              className="block rounded-lg border border-ink/10 p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm dark:border-paper/10"
            >
              <div className="flex items-start gap-2">
                <span className="rule-stamp mt-0.5 shrink-0">#{rule.ruleNumber}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold text-ink dark:text-paper">{rule.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-ink-faint">{snippet}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <DifficultyBadge level={rule.difficulty} />
                    <ImportanceBadge level={rule.importance} />
                    <span className="ml-auto rounded border border-ink/10 px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
                      matched: {matchLabel[matchedOn] ?? matchedOn}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {!searched && (
        <div className="py-10 text-center">
          <p className="text-sm text-ink-faint">Start typing to search across all rules, keywords, and examples.</p>
        </div>
      )}
    </div>
  );
}
