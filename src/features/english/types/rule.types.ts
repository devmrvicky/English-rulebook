/**
 * Domain types for the English Rule Book feature.
 *
 * These mirror the data model agreed for Phase 1: Category -> Chapter -> Rule.
 * Kept here (rather than scattered across components) so the admin panel,
 * sync layer, and future content types (Vocabulary, Idioms, ...) can all
 * import from one source of truth.
 */

export type Difficulty = "easy" | "medium" | "hard";

export type ExamImportance = "low" | "medium" | "high" | "very-high";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // lucide-react icon name
  description: string;
  order: number;
}

export interface Chapter {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  order: number;
}

export interface RuleExample {
  id: string;
  text: string;
  note?: string;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Rule {
  id: string;
  chapterId: string;
  categoryId: string;
  ruleNumber: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  importance: ExamImportance;
  englishExplanation: string;
  hindiExplanation: string;
  memoryTrick?: string;
  importantPoints: string[];
  exceptions: string[];
  commonMistakes: string[];
  sscTips: string[];
  correctExamples: RuleExample[];
  wrongExamples: RuleExample[];
  previousYearQuestions: string[];
  practiceQuestions: PracticeQuestion[];
  summary: string;
  keywords: string[];
  relatedRuleIds: string[];
  readingTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

/** Per-user, per-rule progress — stored locally first, synced when signed in. */
export type ReadStatus = "unread" | "in-progress" | "completed" | "needs-revision";

export interface RuleProgress {
  ruleId: string;
  status: ReadStatus;
  lastReadAt: string | null;
  timesRevised: number;
  bestQuizScore: number | null;
}

export interface Bookmark {
  ruleId: string;
  createdAt: string;
  note?: string;
}

export interface QuizAttempt {
  id: string;
  ruleId: string;
  score: number;
  totalQuestions: number;
  takenAt: string;
}

export interface PersonalNote {
  ruleId: string;
  content: string;
  updatedAt: string;
}

export interface SearchResult {
  rule: Rule;
  matchedOn: "title" | "keyword" | "example" | "hindi" | "summary";
  snippet: string;
}
