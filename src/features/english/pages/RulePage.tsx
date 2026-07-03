import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Bookmark, BookmarkCheck, CheckCircle2, RefreshCcw,
  BookOpen, Lightbulb, AlertTriangle, Target, HelpCircle, ListChecks,
  Languages, ChevronRight,
} from "lucide-react";
import {
  getRuleBySlug,
  getCategoryBySlug,
  getChapterBySlug,
  getProgress,
  getRelatedRules,
} from "@/features/english/services/ruleRepository";
import { useUserDataStore } from "@/features/english/store/userDataStore";
import type { Rule, ReadStatus } from "@/features/english/types/rule.types";
import { DifficultyBadge, ImportanceBadge } from "@/features/english/components/Badges";
import { Quiz } from "@/features/english/components/Quiz";
import { cn } from "@/shared/utils/cn";

function Section({ title, icon: Icon, children, accent = false }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section className={cn("space-y-2 rounded-lg border p-4", accent ? "border-amber/30 bg-amber-soft/30" : "border-ink/10 dark:border-paper/10")}>
      <div className="flex items-center gap-2">
        <Icon size={15} className={accent ? "text-amber" : "text-ink-faint"} />
        <h3 className="font-display text-sm font-semibold text-ink dark:text-paper">{title}</h3>
      </div>
      <div className="text-sm text-ink-soft dark:text-paper/80">{children}</div>
    </section>
  );
}

export function RulePage() {
  const { categorySlug, chapterSlug, ruleSlug } = useParams<{
    categorySlug: string; chapterSlug: string; ruleSlug: string;
  }>();
  const navigate = useNavigate();

  const [rule, setRule] = useState<Rule | null>(null);
  const [catName, setCatName] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [status, setStatus] = useState<ReadStatus>("unread");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showHindi, setShowHindi] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [relatedRules, setRelatedRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  const { toggleBookmark, markStatus, bookmarkedIds, refreshStats } = useUserDataStore();
  const articleRef = useRef<HTMLElement>(null);

  // Track scroll position for the reading progress bar
  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollable = el.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 100;
      setScrollPct(pct);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [rule]);

  useEffect(() => {
    if (!categorySlug || !chapterSlug || !ruleSlug) return;
    (async () => {
      setLoading(true);
      const [cat, chapter, r] = await Promise.all([
        getCategoryBySlug(categorySlug),
        getChapterBySlug(
          (await getCategoryBySlug(categorySlug))?.id ?? "",
          chapterSlug,
        ),
        getRuleBySlug(ruleSlug),
      ]);
      if (!r) { navigate("/", { replace: true }); return; }

      setCatName(cat?.name ?? "");
      setChapterName(chapter?.title ?? "");
      setRule(r);

      const [prog, related] = await Promise.all([
        getProgress(r.id),
        getRelatedRules(r),
      ]);
      setStatus(prog?.status ?? "unread");
      setRelatedRules(related);

      // Check bookmark store
      setIsBookmarked(bookmarkedIds[r.id] ?? false);

      // Auto-mark as in-progress on open
      if (!prog || prog.status === "unread") {
        await markStatus(r.id, "in-progress");
        setStatus("in-progress");
      }

      setLoading(false);
    })();
  }, [categorySlug, chapterSlug, ruleSlug, navigate, markStatus, bookmarkedIds]);

  const handleBookmark = async () => {
    if (!rule) return;
    await toggleBookmark(rule.id);
    setIsBookmarked(!isBookmarked);
  };

  const handleMark = async (s: ReadStatus) => {
    if (!rule) return;
    await markStatus(rule.id, s);
    setStatus(s);
    await refreshStats();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-5 w-36" />
        <div className="skeleton h-8 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>
    );
  }

  if (!rule) return null;

  const statusColor: Record<ReadStatus, string> = {
    unread: "text-ink-faint",
    "in-progress": "text-amber",
    completed: "text-margin-green",
    "needs-revision": "text-margin-red",
  };

  return (
    <>
      {/* Reading progress bar — sticky at the very top */}
      <div className="fixed left-0 top-0 z-50 h-0.5 w-full bg-ink/5 dark:bg-paper/5">
        <div
          className="h-full bg-amber transition-[width] duration-200"
          style={{ width: `${scrollPct}%` }}
        />
      </div>

      <article ref={articleRef} className="mx-auto max-w-2xl space-y-6 pb-24">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1 text-xs text-ink-faint">
          <Link to="/" className="hover:text-ink dark:hover:text-paper">Dashboard</Link>
          <ChevronRight size={12} />
          <Link to={`/category/${categorySlug}`} className="hover:text-ink dark:hover:text-paper">{catName}</Link>
          <ChevronRight size={12} />
          <span>{chapterName}</span>
        </nav>

        {/* Rule header */}
        <header className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="rule-stamp">#{rule.ruleNumber}</span>
            <DifficultyBadge level={rule.difficulty} />
            <ImportanceBadge level={rule.importance} />
          </div>

          <h1 className="font-display text-2xl font-bold leading-snug text-ink dark:text-paper">
            {rule.title}
          </h1>

          {/* Action row */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBookmark}
              className="flex items-center gap-1.5 rounded-md border border-ink/15 px-3 py-1.5 text-xs hover:bg-ink/5 dark:border-paper/15"
            >
              {isBookmarked
                ? <BookmarkCheck size={13} className="text-amber" />
                : <Bookmark size={13} />}
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </button>

            <button
              onClick={() => handleMark("completed")}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors",
                status === "completed"
                  ? "border-margin-green/30 bg-margin-greenSoft text-margin-green"
                  : "border-ink/15 hover:bg-ink/5 dark:border-paper/15",
              )}
            >
              <CheckCircle2 size={13} /> Mark Done
            </button>

            <button
              onClick={() => handleMark("needs-revision")}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors",
                status === "needs-revision"
                  ? "border-margin-red/30 bg-margin-redSoft text-margin-red"
                  : "border-ink/15 hover:bg-ink/5 dark:border-paper/15",
              )}
            >
              <RefreshCcw size={13} /> Revise Later
            </button>

            <span className={cn("ml-auto flex items-center gap-1 text-[11px]", statusColor[status])}>
              <BookOpen size={12} />
              {status === "unread" && "Unread"}
              {status === "in-progress" && "Reading…"}
              {status === "completed" && "Completed"}
              {status === "needs-revision" && "Needs Revision"}
            </span>
          </div>
        </header>

        {/* ── Explanation ── */}
        <section className="ledger-page space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-ink dark:text-paper">Explanation</h2>
            <button
              onClick={() => setShowHindi((h) => !h)}
              className="flex items-center gap-1.5 rounded-md border border-ink/15 px-2.5 py-1 text-[11px] hover:bg-ink/5 dark:border-paper/15"
            >
              <Languages size={12} />
              {showHindi ? "English" : "हिंदी में"}
            </button>
          </div>
          <p className={cn("text-sm leading-relaxed text-ink-soft dark:text-paper/80", showHindi && "font-body")}>
            {showHindi ? rule.hindiExplanation : rule.englishExplanation}
          </p>
        </section>

        {/* ── Memory Trick ── */}
        {rule.memoryTrick && (
          <Section title="Memory Trick" icon={Lightbulb} accent>
            <p>{rule.memoryTrick}</p>
          </Section>
        )}

        {/* ── Important Points ── */}
        {rule.importantPoints.length > 0 && (
          <Section title="Key Points" icon={Target}>
            <ul className="space-y-1.5">
              {rule.importantPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  {pt}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ── Examples ── */}
        {(rule.correctExamples.length > 0 || rule.wrongExamples.length > 0) && (
          <section className="space-y-2">
            <h2 className="font-display text-sm font-semibold text-ink dark:text-paper">Examples</h2>
            <div className="space-y-2">
              {rule.correctExamples.map((ex) => (
                <div key={ex.id} className="example-correct">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-margin-green" />
                  <div>
                    <p>{ex.text}</p>
                    {ex.note && <p className="mt-0.5 text-[11px] text-margin-green/80">{ex.note}</p>}
                  </div>
                </div>
              ))}
              {rule.wrongExamples.map((ex) => (
                <div key={ex.id} className="example-wrong">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0 text-margin-red/70 no-underline" style={{ textDecoration: "none" }} />
                  <div className="flex-1">
                    <p>{ex.text}</p>
                    {ex.note && <p className="mt-0.5 text-[11px] text-margin-red/80 line-through-none" style={{ textDecoration: "none" }}>{ex.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Exceptions ── */}
        {rule.exceptions.length > 0 && (
          <Section title="Exceptions" icon={HelpCircle}>
            <ul className="space-y-1.5">
              {rule.exceptions.map((e, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 font-mono text-[10px] text-ink-faint">{i + 1}.</span>
                  {e}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ── Common Mistakes ── */}
        {rule.commonMistakes.length > 0 && (
          <Section title="Common Mistakes" icon={AlertTriangle}>
            <ul className="space-y-1.5">
              {rule.commonMistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-margin-red">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-margin-red" />
                  <span className="text-ink-soft dark:text-paper/80">{m}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ── SSC Tips ── */}
        {rule.sscTips.length > 0 && (
          <Section title="SSC Exam Tips" icon={Target} accent>
            <ul className="space-y-1.5">
              {rule.sscTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 shrink-0 text-amber">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ── Previous Year Questions ── */}
        {rule.previousYearQuestions.length > 0 && (
          <Section title="Previous Year Questions" icon={ListChecks}>
            <ul className="space-y-2">
              {rule.previousYearQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 font-mono text-[10px] text-ink-faint">{i + 1}.</span>
                  {q}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ── Practice Quiz ── */}
        {rule.practiceQuestions.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-display text-sm font-semibold text-ink dark:text-paper">Practice Quiz</h2>
            <Quiz questions={rule.practiceQuestions} ruleId={rule.id} />
          </section>
        )}

        {/* ── Summary ── */}
        <section className="rounded-lg bg-ink px-5 py-4 dark:bg-paper">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-paper/60 dark:text-ink/60">Rule Summary</p>
          <p className="font-display text-base font-semibold text-paper dark:text-ink">{rule.summary}</p>
        </section>

        {/* ── Keywords ── */}
        {rule.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {rule.keywords.map((kw, i) => (
              <span key={i} className="rounded-full border border-ink/10 px-2.5 py-0.5 font-mono text-[11px] text-ink-faint dark:border-paper/10">
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* ── Related Rules ── */}
        {relatedRules.length > 0 && (
          <section className="space-y-2">
            <h2 className="font-display text-sm font-semibold text-ink dark:text-paper">Related Rules</h2>
            <div className="space-y-2">
              {relatedRules.map((r) => (
                <Link
                  key={r.id}
                  to={`/category/${categorySlug}/${chapterSlug}/${r.slug}`}
                  className="flex items-center gap-2 rounded-md border border-ink/10 px-3 py-2.5 text-sm hover:bg-ink/5 dark:border-paper/10 dark:hover:bg-paper/5"
                >
                  <span className="rule-stamp">#{r.ruleNumber}</span>
                  <span className="flex-1 text-ink dark:text-paper">{r.title}</span>
                  <ChevronRight size={14} className="text-ink-faint" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer nav */}
        <div className="flex items-center justify-between border-t border-ink/10 pt-4 dark:border-paper/10">
          <Link
            to={`/category/${categorySlug}`}
            className="flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink dark:hover:text-paper"
          >
            <ArrowLeft size={14} /> Back to {catName}
          </Link>
          <span className="font-mono text-[10px] text-ink-faint">
            ~{rule.readingTimeMinutes} min read
          </span>
        </div>
      </article>
    </>
  );
}
