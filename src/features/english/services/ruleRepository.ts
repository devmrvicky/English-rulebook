import { db } from "@/features/english/services/db";
import type {
  Category,
  Chapter,
  Rule,
  RuleProgress,
  ReadStatus,
  SearchResult,
} from "@/features/english/types/rule.types";

export async function getCategories(): Promise<Category[]> {
  return db.categories.orderBy("order").toArray();
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return db.categories.where("slug").equals(slug).first();
}

export async function getChaptersForCategory(categoryId: string): Promise<Chapter[]> {
  return db.chapters.where("categoryId").equals(categoryId).sortBy("order");
}

export async function getChapterBySlug(categoryId: string, slug: string): Promise<Chapter | undefined> {
  return db.chapters.where({ categoryId, slug }).first();
}

export async function getRulesForChapter(chapterId: string): Promise<Rule[]> {
  const list = await db.rules.where("chapterId").equals(chapterId).toArray();
  return list.sort((a, b) => a.ruleNumber - b.ruleNumber);
}

export async function getRuleBySlug(slug: string): Promise<Rule | undefined> {
  return db.rules.where("slug").equals(slug).first();
}

export async function getRuleById(id: string): Promise<Rule | undefined> {
  return db.rules.get(id);
}

export async function getRelatedRules(rule: Rule): Promise<Rule[]> {
  if (rule.relatedRuleIds.length === 0) return [];
  const found = await db.rules.bulkGet(rule.relatedRuleIds);
  return found.filter((r): r is Rule => Boolean(r));
}

/** Simple, fast client-side search across title, keywords, summary, and Hindi text. */
export async function searchRules(query: string): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const all = await db.rules.toArray();
  const results: SearchResult[] = [];

  for (const rule of all) {
    if (rule.title.toLowerCase().includes(q)) {
      results.push({ rule, matchedOn: "title", snippet: rule.title });
      continue;
    }
    const keywordHit = rule.keywords.find((k) => k.toLowerCase().includes(q));
    if (keywordHit) {
      results.push({ rule, matchedOn: "keyword", snippet: keywordHit });
      continue;
    }
    if (rule.summary.toLowerCase().includes(q)) {
      results.push({ rule, matchedOn: "summary", snippet: rule.summary });
      continue;
    }
    if (rule.hindiExplanation.includes(query.trim())) {
      results.push({ rule, matchedOn: "hindi", snippet: rule.hindiExplanation.slice(0, 80) });
    }
  }

  return results;
}

// ---- Bookmarks ----

export async function isBookmarked(ruleId: string): Promise<boolean> {
  return (await db.bookmarks.get(ruleId)) !== undefined;
}

export async function toggleBookmark(ruleId: string): Promise<boolean> {
  const existing = await db.bookmarks.get(ruleId);
  if (existing) {
    await db.bookmarks.delete(ruleId);
    return false;
  }
  await db.bookmarks.put({ ruleId, createdAt: new Date().toISOString() });
  return true;
}

export async function getBookmarkedRules(): Promise<Rule[]> {
  const marks = await db.bookmarks.orderBy("createdAt").reverse().toArray();
  const found = await db.rules.bulkGet(marks.map((m) => m.ruleId));
  return found.filter((r): r is Rule => Boolean(r));
}

// ---- Progress ----

export async function getProgress(ruleId: string): Promise<RuleProgress | undefined> {
  return db.progress.get(ruleId);
}

export async function setReadStatus(ruleId: string, status: ReadStatus): Promise<void> {
  const existing = await db.progress.get(ruleId);
  await db.progress.put({
    ruleId,
    status,
    lastReadAt: new Date().toISOString(),
    timesRevised: existing ? existing.timesRevised + (status === "needs-revision" ? 1 : 0) : 0,
    bestQuizScore: existing?.bestQuizScore ?? null,
  });
}

export async function getAllProgress(): Promise<RuleProgress[]> {
  return db.progress.toArray();
}

export interface DashboardStats {
  totalRules: number;
  completedRules: number;
  bookmarkedCount: number;
  needsRevisionCount: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalRules, allProgress, bookmarkedCount] = await Promise.all([
    db.rules.count(),
    db.progress.toArray(),
    db.bookmarks.count(),
  ]);

  return {
    totalRules,
    completedRules: allProgress.filter((p) => p.status === "completed").length,
    bookmarkedCount,
    needsRevisionCount: allProgress.filter((p) => p.status === "needs-revision").length,
  };
}

export interface CategoryWithStats extends Category {
  ruleCount: number;
  completedCount: number;
}

export async function getCategoriesWithStats(): Promise<CategoryWithStats[]> {
  const [cats, allRules, allProgress] = await Promise.all([
    getCategories(),
    db.rules.toArray(),
    db.progress.toArray(),
  ]);

  const completedRuleIds = new Set(allProgress.filter((p) => p.status === "completed").map((p) => p.ruleId));

  return cats.map((cat) => {
    const ruleIds = allRules.filter((r) => r.categoryId === cat.id).map((r) => r.id);
    return {
      ...cat,
      ruleCount: ruleIds.length,
      completedCount: ruleIds.filter((id) => completedRuleIds.has(id)).length,
    };
  });
}
