import {
  chapters,
  quizQuestions,
  type ChapterData,
  type QuizQuestion,
} from "@/data/data";
import {
  aiPracticalProblems,
  aiTheoryQuestions,
} from "@/data/ai_questions";

export type QuestionOrigin = "quiz" | "ai-theory" | "ai-practical";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface UnifiedQuestion {
  id: string;
  chapterNumber: number | "general";
  chapterTitle: string;
  origin: QuestionOrigin;
  sourceLabel: string;
  questionNumber?: number;
  priority: 1 | 2 | 3;
  difficulty?: Difficulty;
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  correctAnswer: string;
  explanationAr?: string;
  stepsAr?: string[];
  topic: string;
  problemType?: string;
}

export const chapterList: ChapterData[] = chapters;

export const chapterMap = new Map<number, ChapterData>(
  chapters.map((chapter) => [chapter.number, chapter]),
);

export function getChapter(number: number | "general"): ChapterData | undefined {
  if (number === "general") return undefined;
  return chapterMap.get(number);
}

export function chapterLabel(number: number | "general"): string {
  if (number === "general") return "General";
  return chapterMap.get(number)?.title ?? `Chapter ${number}`;
}

export function chapterArabicLabel(number: number | "general"): string {
  if (number === "general") return "عام";
  return chapterMap.get(number)?.titleAr ?? `الشابتر ${number}`;
}

const difficultyPriority: Record<Difficulty, 1 | 2 | 3> = {
  Hard: 1,
  Medium: 2,
  Easy: 3,
};

function fromQuiz(question: QuizQuestion): UnifiedQuestion {
  return {
    id: question.id,
    chapterNumber: question.chapterNumber,
    chapterTitle: chapterLabel(question.chapterNumber),
    origin: "quiz",
    sourceLabel: `Set ${question.source.replace("Exercise ", "")}`,
    questionNumber: question.questionNumber,
    priority: question.importanceTier,
    question: question.question,
    code: question.codeSnippet,
    options: question.options,
    correctIndex: question.correctIndex,
    correctAnswer: question.correctAnswer,
    explanationAr: question.explanationAr,
    topic: chapterLabel(question.chapterNumber),
  };
}

function fromAiTheory(
  question: (typeof aiTheoryQuestions)[number],
): UnifiedQuestion {
  return {
    id: question.id,
    chapterNumber: question.chapterNumber,
    chapterTitle: chapterLabel(question.chapterNumber),
    origin: "ai-theory",
    sourceLabel: "AI Theory",
    priority: difficultyPriority[question.difficulty],
    difficulty: question.difficulty,
    question: question.question,
    options: question.options,
    correctIndex: question.correctIndex,
    correctAnswer: question.correctAnswer,
    explanationAr: question.explanationAr,
    topic: question.topic,
  };
}

function fromAiPractical(
  question: (typeof aiPracticalProblems)[number],
): UnifiedQuestion {
  return {
    id: question.id,
    chapterNumber: question.chapterNumber,
    chapterTitle: chapterLabel(question.chapterNumber),
    origin: "ai-practical",
    sourceLabel: "AI Practical",
    priority: difficultyPriority[question.difficulty],
    difficulty: question.difficulty,
    question: question.question,
    code: question.codeOrFormula,
    options: question.options,
    correctIndex: question.correctIndex,
    correctAnswer: question.correctAnswer,
    stepsAr: question.solutionStepsAr,
    topic: question.problemType,
    problemType: question.problemType,
  };
}

export const allQuestions: UnifiedQuestion[] = [
  ...quizQuestions.map(fromQuiz),
  ...aiTheoryQuestions.map(fromAiTheory),
  ...aiPracticalProblems.map(fromAiPractical),
];

export const questionMap = new Map<string, UnifiedQuestion>(
  allQuestions.map((question) => [question.id, question]),
);

export const quizDeck = allQuestions.filter((q) => q.origin === "quiz");
export const aiTheoryDeck = allQuestions.filter((q) => q.origin === "ai-theory");
export const aiPracticalDeck = allQuestions.filter(
  (q) => q.origin === "ai-practical",
);

export function questionsForChapter(chapter: number): UnifiedQuestion[] {
  return allQuestions.filter((q) => q.chapterNumber === chapter);
}

export function allChapterNumbers(): number[] {
  return chapters.map((chapter) => chapter.number);
}

export function priorityLabel(question: UnifiedQuestion): string {
  if (question.origin === "quiz") return `Tier ${question.priority}`;
  return question.difficulty ?? "Tier 1";
}

export function originLabel(origin: QuestionOrigin): string {
  switch (origin) {
    case "quiz":
      return "Quiz";
    case "ai-theory":
      return "AI Theory";
    case "ai-practical":
      return "AI Practical";
  }
}

export function originArabic(origin: QuestionOrigin): string {
  switch (origin) {
    case "quiz":
      return "أسئلة الامتحان";
    case "ai-theory":
      return "نظري إضافي";
    case "ai-practical":
      return "مسائل إضافية";
  }
}

export const totalQuestionCount = allQuestions.length;
