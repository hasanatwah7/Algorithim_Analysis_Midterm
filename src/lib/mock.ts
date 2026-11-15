import type { UnifiedQuestion } from "@/lib/questions";
import { allQuestions } from "@/lib/questions";

const MOCK_DURATION_SEC = 45 * 60;

interface ChapterRecipe {
  quiz: number;
  theory: number;
  practical: number;
}

const recipes: Record<number, ChapterRecipe> = {
  1: { quiz: 1, theory: 2, practical: 2 },
  2: { quiz: 2, theory: 1, practical: 2 },
  3: { quiz: 2, theory: 1, practical: 2 },
  4: { quiz: 2, theory: 1, practical: 2 },
  5: { quiz: 2, theory: 1, practical: 2 },
  6: { quiz: 0, theory: 3, practical: 2 },
};

function take(
  candidates: UnifiedQuestion[],
  count: number,
  used: Set<string>,
): UnifiedQuestion[] {
  const picked: UnifiedQuestion[] = [];
  for (const candidate of candidates) {
    if (picked.length >= count) break;
    if (used.has(candidate.id)) continue;
    used.add(candidate.id);
    picked.push(candidate);
  }
  return picked;
}

function buildMock(): UnifiedQuestion[] {
  const used = new Set<string>();
  const selected: UnifiedQuestion[] = [];

  for (let chapter = 1; chapter <= 6; chapter += 1) {
    const recipe = recipes[chapter];
    const inChapter = allQuestions.filter(
      (question) => question.chapterNumber === chapter,
    );
    const byPriority = (a: UnifiedQuestion, b: UnifiedQuestion) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.id.localeCompare(b.id);
    };

    const quiz = take(
      inChapter.filter((q) => q.origin === "quiz").sort(byPriority),
      recipe.quiz,
      used,
    );
    const theory = take(
      inChapter.filter((q) => q.origin === "ai-theory").sort(byPriority),
      recipe.theory,
      used,
    );
    const practical = take(
      inChapter.filter((q) => q.origin === "ai-practical").sort(byPriority),
      recipe.practical,
      used,
    );

    selected.push(...quiz, ...theory, ...practical);
  }

  // Safety net: if a recipe could not be filled, complete from the remaining pool.
  if (selected.length < 30) {
    selected.push(
      ...take(
        [...allQuestions].sort((a, b) => a.priority - b.priority),
        30 - selected.length,
        used,
      ),
    );
  }

  return selected.slice(0, 30);
}

export const mockQuestions: UnifiedQuestion[] = buildMock();
export const mockQuestionIds = new Set(mockQuestions.map((q) => q.id));
export const mockDurationSec = MOCK_DURATION_SEC;

export interface MockChapterBreakdown {
  chapter: number;
  total: number;
  correct: number;
}

export function mockBreakdown(
  answers: Record<string, number>,
): MockChapterBreakdown[] {
  const map = new Map<number, MockChapterBreakdown>();
  for (const question of mockQuestions) {
    if (typeof question.chapterNumber !== "number") continue;
    const entry = map.get(question.chapterNumber) ?? {
      chapter: question.chapterNumber,
      total: 0,
      correct: 0,
    };
    entry.total += 1;
    if (answers[question.id] === question.correctIndex) entry.correct += 1;
    map.set(question.chapterNumber, entry);
  }
  return [...map.values()].sort((a, b) => a.chapter - b.chapter);
}
