import {
  chapters,
  type PracticalPattern,
} from "@/data/data";
import { aiPracticalProblems } from "@/data/ai_questions";
import { aiTheoryDeck, quizDeck } from "@/lib/questions";

export type CardKind = "concept" | "formula" | "theory-qa" | "problem-steps";

export interface StudyCard {
  id: string;
  kind: CardKind;
  chapterNumber: number;
  title: string;
  prompt: string;
  bodyAr?: string;
  keyTerms?: string[];
  formulas?: string[];
  noteAr?: string;
  code?: string;
  answer?: string;
  stepsAr?: string[];
  source?: string;
  exampleProblem?: string;
}

export const cardKindMeta: Record<
  CardKind,
  { label: string; description: string }
> = {
  concept: {
    label: "Concepts",
    description: "Define and explain every theory concept.",
  },
  formula: {
    label: "Formulas",
    description: "Recall the formula before you reveal it.",
  },
  "theory-qa": {
    label: "Theory Q&A",
    description: "Question and answer from the theory bank.",
  },
  "problem-steps": {
    label: "Problem Steps",
    description: "The problem type and its abstract solution steps.",
  },
};

function conceptCards(): StudyCard[] {
  return chapters.flatMap((chapter) =>
    chapter.theory.map((concept) => ({
      id: `concept-${concept.id}`,
      kind: "concept" as const,
      chapterNumber: chapter.number,
      title: concept.title,
      prompt: `Explain: ${concept.title}`,
      bodyAr: concept.contentAr,
      keyTerms: concept.keyTerms,
      formulas: concept.formulas,
      noteAr: concept.importantNoteAr,
      source: "Theory",
    })),
  );
}

function formulaCards(): StudyCard[] {
  const cards: StudyCard[] = [];
  for (const chapter of chapters) {
    for (const concept of chapter.theory) {
      if (!concept.formulas?.length) continue;
      concept.formulas.forEach((formula, index) => {
        cards.push({
          id: `formula-${concept.id}-${index + 1}`,
          kind: "formula",
          chapterNumber: chapter.number,
          title: concept.title,
          prompt: `Recall formula ${index + 1} from: ${concept.title}`,
          formulas: [formula],
          bodyAr: concept.contentAr,
          noteAr: concept.importantNoteAr,
          source: "Theory formula",
        });
      });
    }
  }
  return cards;
}

function theoryQaCards(): StudyCard[] {
  return [...quizDeck, ...aiTheoryDeck].map((question) => ({
    id: `qa-${question.id}`,
    kind: "theory-qa" as const,
    chapterNumber:
      question.chapterNumber === "general" ? 0 : question.chapterNumber,
    title: question.topic,
    prompt: question.question,
    code: question.code,
    answer: question.correctAnswer,
    bodyAr: question.explanationAr,
    source: `${question.sourceLabel} · ${question.topic}`,
  }));
}

function patternSteps(pattern: PracticalPattern, chapterNumber: number): StudyCard {
  return {
    id: `steps-${pattern.id}`,
    kind: "problem-steps",
    chapterNumber,
    title: pattern.problemType,
    prompt: `How do you solve: ${pattern.problemType}?`,
    stepsAr: pattern.stepsAr,
    answer: pattern.workedExample.finalAnswer,
    exampleProblem: pattern.workedExample.problem,
    source: "Lecture pattern",
  };
}

function problemStepCards(): StudyCard[] {
  const lectureCards = chapters.flatMap((chapter) =>
    chapter.practical.map((pattern) => patternSteps(pattern, chapter.number)),
  );

  const aiCards: StudyCard[] = aiPracticalProblems.map((problem) => ({
    id: `steps-${problem.id}`,
    kind: "problem-steps",
    chapterNumber: problem.chapterNumber,
    title: problem.problemType,
    prompt: `How do you solve: ${problem.problemType}?`,
    stepsAr: problem.solutionStepsAr,
    answer: problem.correctAnswer,
    exampleProblem: problem.question,
    code: problem.codeOrFormula,
    source: `AI Practical · ${problem.difficulty}`,
  }));

  return [...lectureCards, ...aiCards];
}

export const allCards: StudyCard[] = [
  ...conceptCards(),
  ...formulaCards(),
  ...theoryQaCards(),
  ...problemStepCards(),
];

export const cardCountByKind: Record<CardKind, number> = {
  concept: allCards.filter((card) => card.kind === "concept").length,
  formula: allCards.filter((card) => card.kind === "formula").length,
  "theory-qa": allCards.filter((card) => card.kind === "theory-qa").length,
  "problem-steps": allCards.filter((card) => card.kind === "problem-steps")
    .length,
};

export const totalCardCount = allCards.length;

export function cardsFor(
  chapterNumber: number | "all",
  kind: CardKind | "mixed",
): StudyCard[] {
  return allCards.filter((card) => {
    if (chapterNumber !== "all" && card.chapterNumber !== chapterNumber) {
      return false;
    }
    if (kind !== "mixed" && card.kind !== kind) return false;
    return true;
  });
}

export function shuffleCards<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
