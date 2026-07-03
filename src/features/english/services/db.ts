import Dexie, { type Table } from "dexie";
import type {
  Category,
  Chapter,
  Rule,
  RuleProgress,
  Bookmark,
  QuizAttempt,
  PersonalNote,
} from "@/features/english/types/rule.types";

/**
 * Offline-first storage. IndexedDB (via Dexie) is the primary store for the
 * whole app — content tables (categories/chapters/rules) are populated from
 * seed data today and will be populated by a Supabase sync job later, without
 * any change to how the UI reads them. User-data tables (progress, bookmarks,
 * notes, quiz attempts) are local-first and sync up when a user signs in.
 */
class RuleBookDatabase extends Dexie {
  categories!: Table<Category, string>;
  chapters!: Table<Chapter, string>;
  rules!: Table<Rule, string>;
  progress!: Table<RuleProgress, string>;
  bookmarks!: Table<Bookmark, string>;
  quizAttempts!: Table<QuizAttempt, string>;
  notes!: Table<PersonalNote, string>;

  constructor() {
    super("english-rule-book");

    this.version(1).stores({
      categories: "id, slug, order",
      chapters: "id, categoryId, slug, order",
      rules: "id, chapterId, categoryId, ruleNumber, slug, *keywords",
      progress: "ruleId, status",
      bookmarks: "ruleId, createdAt",
      quizAttempts: "id, ruleId, takenAt",
      notes: "ruleId, updatedAt",
    });
  }
}

export const db = new RuleBookDatabase();

/** Populates content tables from seed data on first run only. Idempotent. */
export async function ensureSeeded(): Promise<void> {
  const existing = await db.categories.count();
  if (existing > 0) return;

  const { categories, chapters, rules } = await import("@/features/english/data/seedData");

  await db.transaction("rw", db.categories, db.chapters, db.rules, async () => {
    await db.categories.bulkPut(categories);
    await db.chapters.bulkPut(chapters);
    await db.rules.bulkPut(rules);
  });
}
