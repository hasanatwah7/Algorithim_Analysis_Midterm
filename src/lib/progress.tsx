import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  allQuestions,
  chapterList,
  type UnifiedQuestion,
} from "@/lib/questions";
import type { CardKind } from "@/lib/cards";

export type TimerMode = "off" | "question" | "group";
export type TimerPreset = 30 | 45 | 60 | 90;
export type PatternMark = "known" | "shaky";

export interface AnswerRecord {
  selectedIndex: number;
  correct: boolean;
  at: number;
}

export interface CardRecord {
  status: "new" | "learning" | "mastered";
  right: number;
  wrong: number;
  lastSeen: number;
}

export interface MockResult {
  at: number;
  total: number;
  correct: number;
  durationSec: number;
  byChapter: Record<string, { total: number; correct: number }>;
  answers: Record<string, number>;
}

export interface ProgressPrefs {
  timerMode: TimerMode;
  timerPreset: TimerPreset;
  sfx: boolean;
  lastChapter: number;
  lastCardKind: CardKind | "mixed";
  speedrunDeck: string;
  speedrunShuffle: boolean;
}

export interface ProgressState {
  version: 1;
  answers: Record<string, AnswerRecord>;
  saved: string[];
  cards: Record<string, CardRecord>;
  patterns: Record<string, PatternMark>;
  prefs: ProgressPrefs;
  mock: MockResult | null;
}

const STORAGE_KEY = "vectr-algo:v1:progress";

export const defaultPrefs: ProgressPrefs = {
  timerMode: "off",
  timerPreset: 60,
  sfx: true,
  lastChapter: 1,
  lastCardKind: "mixed",
  speedrunDeck: "master",
  speedrunShuffle: false,
};

export function createDefaultState(): ProgressState {
  return {
    version: 1,
    answers: {},
    saved: [],
    cards: {},
    patterns: {},
    prefs: { ...defaultPrefs },
    mock: null,
  };
}

function loadState(): ProgressState {
  if (typeof window === "undefined") return createDefaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      ...createDefaultState(),
      ...parsed,
      answers: parsed.answers ?? {},
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      cards: parsed.cards ?? {},
      patterns: parsed.patterns ?? {},
      prefs: { ...defaultPrefs, ...(parsed.prefs ?? {}) },
      mock: parsed.mock ?? null,
    };
  } catch {
    return createDefaultState();
  }
}

function persist(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be full or disabled. The session still works in memory.
  }
}

interface ProgressApi {
  state: ProgressState;
  answerQuestion: (
    questionId: string,
    selectedIndex: number,
    correct: boolean,
  ) => void;
  bulkAnswer: (
    records: Array<{ id: string; selectedIndex: number; correct: boolean }>,
  ) => void;
  toggleSaved: (questionId: string) => void;
  setCardResult: (cardId: string, correct: boolean) => void;
  resetCard: (cardId: string) => void;
  setPatternMark: (patternId: string, mark: PatternMark | null) => void;
  updatePrefs: (patch: Partial<ProgressPrefs>) => void;
  saveMockResult: (result: MockResult) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadState);

  useEffect(() => {
    persist(state);
  }, [state]);

  const answerQuestion = useCallback(
    (questionId: string, selectedIndex: number, correct: boolean) => {
      setState((previous) => ({
        ...previous,
        answers: {
          ...previous.answers,
          [questionId]: { selectedIndex, correct, at: Date.now() },
        },
      }));
    },
    [],
  );

  const bulkAnswer = useCallback(
    (records: Array<{ id: string; selectedIndex: number; correct: boolean }>) => {
      setState((previous) => {
        const at = Date.now();
        const answers = { ...previous.answers };
        for (const record of records) {
          answers[record.id] = {
            selectedIndex: record.selectedIndex,
            correct: record.correct,
            at,
          };
        }
        return { ...previous, answers };
      });
    },
    [],
  );

  const toggleSaved = useCallback((questionId: string) => {
    setState((previous) => {
      const saved = previous.saved.includes(questionId)
        ? previous.saved.filter((id) => id !== questionId)
        : [...previous.saved, questionId];
      return { ...previous, saved };
    });
  }, []);

  const setCardResult = useCallback((cardId: string, correct: boolean) => {
    setState((previous) => {
      const current = previous.cards[cardId] ?? {
        status: "new" as const,
        right: 0,
        wrong: 0,
        lastSeen: 0,
      };
      const next: CardRecord = {
        status: correct ? "mastered" : "learning",
        right: current.right + (correct ? 1 : 0),
        wrong: current.wrong + (correct ? 0 : 1),
        lastSeen: Date.now(),
      };
      return {
        ...previous,
        cards: { ...previous.cards, [cardId]: next },
      };
    });
  }, []);

  const resetCard = useCallback((cardId: string) => {
    setState((previous) => {
      const cards = { ...previous.cards };
      delete cards[cardId];
      return { ...previous, cards };
    });
  }, []);

  const setPatternMark = useCallback(
    (patternId: string, mark: PatternMark | null) => {
      setState((previous) => {
        const patterns = { ...previous.patterns };
        if (mark === null) delete patterns[patternId];
        else patterns[patternId] = mark;
        return { ...previous, patterns };
      });
    },
    [],
  );

  const updatePrefs = useCallback((patch: Partial<ProgressPrefs>) => {
    setState((previous) => ({
      ...previous,
      prefs: { ...previous.prefs, ...patch },
    }));
  }, []);

  const saveMockResult = useCallback((result: MockResult) => {
    setState((previous) => ({ ...previous, mock: result }));
  }, []);

  const resetProgress = useCallback(() => {
    setState(createDefaultState());
  }, []);

  const api = useMemo<ProgressApi>(
    () => ({
      state,
      answerQuestion,
      bulkAnswer,
      toggleSaved,
      setCardResult,
      resetCard,
      setPatternMark,
      updatePrefs,
      saveMockResult,
      resetProgress,
    }),
    [
      state,
      answerQuestion,
      bulkAnswer,
      toggleSaved,
      setCardResult,
      resetCard,
      setPatternMark,
      updatePrefs,
      saveMockResult,
      resetProgress,
    ],
  );

  return (
    <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>
  );
}

export function useProgress(): ProgressApi {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return context;
}

export interface ChapterStat {
  number: number;
  title: string;
  titleAr: string;
  total: number;
  answered: number;
  correct: number;
  wrong: number;
  accuracy: number;
  mastery: number;
}

export function getChapterStats(state: ProgressState): ChapterStat[] {
  return chapterList.map((chapter) => {
    const questions = allQuestions.filter(
      (question) => question.chapterNumber === chapter.number,
    );
    let answered = 0;
    let correct = 0;
    let wrong = 0;
    for (const question of questions) {
      const record = state.answers[question.id];
      if (!record) continue;
      answered += 1;
      if (record.correct) correct += 1;
      else wrong += 1;
    }
    return {
      number: chapter.number,
      title: chapter.title,
      titleAr: chapter.titleAr,
      total: questions.length,
      answered,
      correct,
      wrong,
      accuracy: answered ? correct / answered : 0,
      mastery: questions.length ? correct / questions.length : 0,
    };
  });
}

export interface OverallStats {
  total: number;
  answered: number;
  correct: number;
  wrong: number;
  accuracy: number;
  mastery: number;
  saved: number;
  cardsMastered: number;
  cardsSeen: number;
  mockBest: number | null;
}

export function getOverallStats(state: ProgressState): OverallStats {
  const records = Object.values(state.answers);
  const correct = records.filter((record) => record.correct).length;
  const answered = records.length;
  const cards = Object.values(state.cards);
  const mockBest =
    state.mock && state.mock.total > 0
      ? Math.round((state.mock.correct / state.mock.total) * 100)
      : null;
  return {
    total: allQuestions.length,
    answered,
    correct,
    wrong: answered - correct,
    accuracy: answered ? correct / answered : 0,
    mastery: allQuestions.length ? correct / allQuestions.length : 0,
    saved: state.saved.length,
    cardsMastered: cards.filter((card) => card.status === "mastered").length,
    cardsSeen: cards.length,
    mockBest,
  };
}

export interface WeakTopic {
  topic: string;
  chapterNumber: number | "general";
  wrong: number;
  total: number;
}

export function getWeakTopics(state: ProgressState, limit = 6): WeakTopic[] {
  const grouped = new Map<string, WeakTopic>();
  for (const question of allQuestions) {
    const record = state.answers[question.id];
    if (!record || record.correct) continue;
    const key = `${question.chapterNumber}::${question.topic}`;
    const existing = grouped.get(key);
    if (existing) existing.wrong += 1;
    else {
      grouped.set(key, {
        topic: question.topic,
        chapterNumber: question.chapterNumber,
        wrong: 1,
        total: allQuestions.filter(
          (candidate) =>
            candidate.chapterNumber === question.chapterNumber &&
            candidate.topic === question.topic,
        ).length,
      });
    }
  }
  return [...grouped.values()]
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, limit);
}

export function getWeakChapters(
  state: ProgressState,
  limit = 4,
): ChapterStat[] {
  return getChapterStats(state)
    .filter((chapter) => chapter.wrong > 0)
    .sort((a, b) => {
      const byWrong = b.wrong - a.wrong;
      if (byWrong !== 0) return byWrong;
      return a.accuracy - b.accuracy;
    })
    .slice(0, limit);
}

export function getMistakeQuestions(state: ProgressState): UnifiedQuestion[] {
  return allQuestions.filter(
    (question) => state.answers[question.id]?.correct === false,
  );
}

export function getWeakQuestionPool(state: ProgressState): UnifiedQuestion[] {
  const weakChapterNumbers = new Set(
    getChapterStats(state)
      .filter((chapter) => chapter.wrong > 0)
      .map((chapter) => chapter.number),
  );
  const pool = allQuestions.filter((question) => {
    if (typeof question.chapterNumber !== "number") return false;
    if (!weakChapterNumbers.has(question.chapterNumber)) return false;
    return state.answers[question.id]?.correct !== true;
  });
  if (pool.length > 0) return pool;
  return getMistakeQuestions(state);
}

export function getDeck(
  state: ProgressState,
  deck: string,
): UnifiedQuestion[] {
  switch (deck) {
    case "weak":
      return getWeakQuestionPool(state);
    case "saved":
      return allQuestions.filter((question) => state.saved.includes(question.id));
    case "quiz":
      return allQuestions.filter((question) => question.origin === "quiz");
    case "ai-theory":
      return allQuestions.filter((question) => question.origin === "ai-theory");
    case "ai-practical":
      return allQuestions.filter(
        (question) => question.origin === "ai-practical",
      );
    case "mistakes":
      return getMistakeQuestions(state);
    case "master":
      return [...allQuestions].sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        if (a.chapterNumber === "general") return 1;
        if (b.chapterNumber === "general") return -1;
        return Number(a.chapterNumber) - Number(b.chapterNumber);
      });
    default: {
      if (deck.startsWith("chapter-")) {
        const number = Number(deck.replace("chapter-", ""));
        return allQuestions.filter(
          (question) => question.chapterNumber === number,
        );
      }
      return [...allQuestions];
    }
  }
}
