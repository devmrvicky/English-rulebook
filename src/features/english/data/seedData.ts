import type { Category, Chapter, Rule } from "@/features/english/types/rule.types";

export const categories: Category[] = [
  { id: "cat-noun", name: "Noun", slug: "noun", icon: "Tag", description: "Naming words and their kinds.", order: 1 },
  { id: "cat-pronoun", name: "Pronoun", slug: "pronoun", icon: "UserRound", description: "Words that stand in for nouns.", order: 2 },
  { id: "cat-verb", name: "Verb", slug: "verb", icon: "Zap", description: "Action and state-of-being words.", order: 3 },
  { id: "cat-conjunction", name: "Conjunction", slug: "conjunction", icon: "Link2", description: "Joining words and their rules.", order: 4 },
  { id: "cat-tense", name: "Tense", slug: "tense", icon: "Clock", description: "Time forms of the verb.", order: 5 },
  { id: "cat-sva", name: "Subject Verb Agreement", slug: "subject-verb-agreement", icon: "GitCompare", description: "Matching subject and verb correctly.", order: 6 },
  { id: "cat-voice", name: "Voice", slug: "voice", icon: "ArrowLeftRight", description: "Active and passive constructions.", order: 7 },
  { id: "cat-error", name: "Error Detection", slug: "error-detection", icon: "Search", description: "Spotting the one wrong part of a sentence.", order: 8 },
];

export const chapters: Chapter[] = [
  { id: "ch-conj-1", categoryId: "cat-conjunction", title: "Definition", slug: "definition", description: "What a conjunction is and why it matters.", order: 1 },
  { id: "ch-conj-2", categoryId: "cat-conjunction", title: "Types", slug: "types", description: "Coordinating, subordinating, and correlative conjunctions.", order: 2 },
  { id: "ch-conj-3", categoryId: "cat-conjunction", title: "Rules", slug: "rules", description: "Pairing rules SSC tests most often.", order: 3 },
  { id: "ch-conj-4", categoryId: "cat-conjunction", title: "Exceptions", slug: "exceptions", description: "Where the standard pairing rules bend.", order: 4 },
  { id: "ch-conj-5", categoryId: "cat-conjunction", title: "Previous Year Questions", slug: "pyqs", description: "Conjunction questions as actually asked.", order: 5 },

  { id: "ch-sva-1", categoryId: "cat-sva", title: "Basic Agreement", slug: "basic-agreement", description: "Singular subject, singular verb.", order: 1 },
  { id: "ch-sva-2", categoryId: "cat-sva", title: "Tricky Subjects", slug: "tricky-subjects", description: "Collective nouns, 'each', 'either', and more.", order: 2 },
];

export const rules: Rule[] = [
  {
    id: "rule-conj-001",
    chapterId: "ch-conj-3",
    categoryId: "cat-conjunction",
    ruleNumber: 1,
    title: "'Neither' pairs only with 'nor', never with 'or'",
    slug: "neither-nor-not-or",
    difficulty: "easy",
    importance: "very-high",
    englishExplanation:
      "'Neither' is a correlative conjunction and must always be completed with 'nor', not 'or'. The two negate two alternatives together as a single unit: neither A nor B.",
    hindiExplanation:
      "'Neither' हमेशा 'nor' के साथ आता है, 'or' के साथ नहीं। यह दो विकल्पों को एक साथ नकारता है: neither A nor B.",
    memoryTrick: "Think of 'neither' and 'nor' as a married pair — they never appear without each other in a sentence.",
    importantPoints: [
      "'Neither...nor' joins two negative alternatives.",
      "The verb agrees with the subject closer to it.",
      "Never mix 'neither' with 'or' or 'either' with 'nor'.",
    ],
    exceptions: ["In informal speech 'neither...or' sometimes appears, but it is always marked wrong in SSC exams."],
    commonMistakes: ["Neither Ram or Shyam is wrong.", "Either Ram nor Shyam is wrong."],
    sscTips: ["Scan for 'neither' in error-detection questions — if 'or' follows anywhere later in the sentence, that's almost always the error."],
    correctExamples: [
      { id: "ex-1", text: "Neither the manager nor the staff was informed." },
      { id: "ex-2", text: "She has neither time nor money for a vacation." },
    ],
    wrongExamples: [
      { id: "wx-1", text: "Neither the manager or the staff was informed.", note: "'or' should be 'nor'." },
    ],
    previousYearQuestions: [
      "SSC CGL 2019: Identify the error — 'Neither the players or the coach were ready.'",
    ],
    practiceQuestions: [
      {
        id: "pq-1",
        question: "Choose the correct sentence.",
        options: [
          "Neither he nor his friends was present.",
          "Neither he nor his friends were present.",
          "Neither he or his friends were present.",
          "Neither he nor his friends are present.",
        ],
        correctOptionIndex: 1,
        explanation: "The verb agrees with 'friends' (closer subject), so 'were' is correct, and 'nor' must pair with 'neither'.",
      },
    ],
    summary: "Neither always pairs with nor. The verb agrees with the nearer subject.",
    keywords: ["neither", "nor", "correlative conjunction"],
    relatedRuleIds: ["rule-conj-002"],
    readingTimeMinutes: 3,
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "rule-conj-002",
    chapterId: "ch-conj-3",
    categoryId: "cat-conjunction",
    ruleNumber: 2,
    title: "'Either' pairs only with 'or'",
    slug: "either-or-not-nor",
    difficulty: "easy",
    importance: "high",
    englishExplanation:
      "'Either' presents two positive alternatives and must be completed with 'or'. It is the positive counterpart of 'neither...nor'.",
    hindiExplanation: "'Either' हमेशा 'or' के साथ आता है — यह दो सकारात्मक विकल्पों में से एक को दर्शाता है।",
    memoryTrick: "E for Either, E for 'or' has no N — remember 'either' has no 'n', so it never takes 'nor'.",
    importantPoints: ["'Either...or' offers a choice between two options.", "Verb agreement follows the subject nearer the verb."],
    exceptions: [],
    commonMistakes: ["Either he nor she is wrong — should be 'either he or she'."],
    sscTips: ["If you see 'either' followed later by 'nor', mark that as the error in spotting questions."],
    correctExamples: [{ id: "ex-3", text: "You can either call me or send an email." }],
    wrongExamples: [{ id: "wx-2", text: "You can either call me nor send an email.", note: "'nor' should be 'or'." }],
    previousYearQuestions: ["SSC CHSL 2021: Spot the error — 'Either the teacher nor the students were late.'"],
    practiceQuestions: [
      {
        id: "pq-2",
        question: "Fill in the blank: Either Sita ___ Gita will represent the class.",
        options: ["nor", "or", "and", "but"],
        correctOptionIndex: 1,
        explanation: "'Either' must be completed with 'or'.",
      },
    ],
    summary: "Either pairs only with or, never with nor.",
    keywords: ["either", "or", "correlative conjunction"],
    relatedRuleIds: ["rule-conj-001"],
    readingTimeMinutes: 2,
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "rule-sva-001",
    chapterId: "ch-sva-1",
    categoryId: "cat-sva",
    ruleNumber: 1,
    title: "A singular subject takes a singular verb",
    slug: "singular-subject-singular-verb",
    difficulty: "easy",
    importance: "very-high",
    englishExplanation:
      "The basic rule of subject-verb agreement: a singular subject is followed by a singular verb form, and a plural subject by a plural verb form, regardless of words that come between them.",
    hindiExplanation: "एकवचन कर्ता के साथ एकवचन क्रिया आती है, भले ही बीच में अन्य शब्द क्यों न आ जाएँ।",
    memoryTrick: "Find the real subject first — ignore everything inside commas or prepositional phrases before checking the verb.",
    importantPoints: [
      "Words between subject and verb (phrases, clauses) do not change agreement.",
      "Look for the head noun of the subject, not the nearest noun.",
    ],
    exceptions: ["Collective nouns can take a plural verb when members are considered individually."],
    commonMistakes: ["The list of items are on the table.", "should be 'is', since 'list' is the singular subject."],
    sscTips: ["Cross out the prepositional phrase ('of items') mentally before checking the verb."],
    correctExamples: [{ id: "ex-4", text: "The list of items is on the table." }],
    wrongExamples: [{ id: "wx-3", text: "The list of items are on the table.", note: "'are' should be 'is'." }],
    previousYearQuestions: ["SSC MTS 2022: Spot the error — 'The bunch of flowers were beautiful.'"],
    practiceQuestions: [
      {
        id: "pq-3",
        question: "Choose the correct sentence.",
        options: [
          "The box of chocolates are on the shelf.",
          "The box of chocolates is on the shelf.",
          "The box of chocolates were on the shelf.",
          "The box of chocolates being on the shelf.",
        ],
        correctOptionIndex: 1,
        explanation: "'Box' is the singular head noun, so the verb must be 'is'.",
      },
    ],
    summary: "Match the verb to the head noun of the subject, not to nearby words.",
    keywords: ["subject verb agreement", "singular", "plural"],
    relatedRuleIds: [],
    readingTimeMinutes: 3,
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
  },
];
