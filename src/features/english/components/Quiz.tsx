import { useState, useCallback } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import type { PracticeQuestion } from "@/features/english/types/rule.types";
import { cn } from "@/shared/utils/cn";

interface QuizProps {
  questions: PracticeQuestion[];
  ruleId: string;
}

type AnswerState = Record<string, number | null>;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Quiz({ questions }: QuizProps) {
  const [shuffled] = useState(() => shuffle(questions));
  const [answers, setAnswers] = useState<AnswerState>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const answer = useCallback((qId: string, idx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  }, [submitted]);

  const allAnswered = shuffled.every((q) => answers[q.id] !== undefined);
  const score = submitted
    ? shuffled.filter((q) => answers[q.id] === q.correctOptionIndex).length
    : 0;

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setShowResults(false);
  };

  if (shuffled.length === 0) return null;

  return (
    <div className="space-y-5">
      {shuffled.map((q, qi) => {
        const chosen = answers[q.id] ?? null;
        const isCorrect = chosen === q.correctOptionIndex;

        return (
          <div key={q.id} className="rounded-lg border border-ink/10 p-4 dark:border-paper/10">
            <p className="mb-3 text-sm font-medium text-ink dark:text-paper">
              <span className="mr-2 font-mono text-xs text-ink-faint">Q{qi + 1}.</span>
              {q.question}
            </p>

            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isChosen = chosen === oi;
                const isRightAnswer = oi === q.correctOptionIndex;
                let optClass =
                  "flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-sm transition-colors cursor-pointer select-none";

                if (!submitted) {
                  optClass += isChosen
                    ? " border-amber bg-amber-soft text-ink"
                    : " border-ink/10 hover:border-amber/40 dark:border-paper/10";
                } else {
                  if (isRightAnswer) {
                    optClass += " border-margin-green bg-margin-greenSoft text-margin-green";
                  } else if (isChosen && !isRightAnswer) {
                    optClass += " border-margin-red bg-margin-redSoft text-margin-red";
                  } else {
                    optClass += " border-ink/10 text-ink-faint dark:border-paper/10";
                  }
                }

                return (
                  <div key={oi} className={optClass} onClick={() => answer(q.id, oi)}>
                    <span className="mt-0.5 shrink-0 font-mono text-xs">
                      {submitted && isRightAnswer && <CheckCircle2 size={14} className="text-margin-green" />}
                      {submitted && isChosen && !isRightAnswer && <XCircle size={14} className="text-margin-red" />}
                      {!submitted && <span className="text-ink-faint">{String.fromCharCode(65 + oi)}.</span>}
                    </span>
                    <span>{opt}</span>
                  </div>
                );
              })}
            </div>

            {submitted && showResults && (
              <div className="mt-3 rounded-md border border-ink/10 bg-paper-dim px-3 py-2 text-xs text-ink-soft dark:border-paper/10 dark:bg-nightpaper">
                <span className="font-semibold">Explanation:</span> {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {/* Action row */}
      <div className="flex flex-wrap items-center gap-3">
        {!submitted && (
          <button
            disabled={!allAnswered}
            onClick={() => { setSubmitted(true); setShowResults(true); }}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              allAnswered
                ? "bg-ink text-paper hover:bg-ink-soft dark:bg-paper dark:text-nightpaper"
                : "cursor-not-allowed bg-ink/10 text-ink-faint",
            )}
          >
            Submit answers
          </button>
        )}

        {submitted && (
          <>
            <div className="rounded-md bg-amber-soft px-3 py-2 font-mono text-sm text-amber">
              {score}/{shuffled.length} correct
            </div>
            {!showResults && (
              <button
                onClick={() => setShowResults(true)}
                className="rounded-md border border-ink/15 px-3 py-2 text-sm hover:bg-ink/5"
              >
                Show explanations
              </button>
            )}
            <button onClick={reset} className="ml-auto flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink dark:hover:text-paper">
              <RotateCcw size={13} /> Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
}
