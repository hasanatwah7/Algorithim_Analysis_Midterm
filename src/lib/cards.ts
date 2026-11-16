import {
  chapters,
  type PracticalPattern,
} from "@/data/data";
import { aiPracticalProblems } from "@/data/ai_questions";
import { aiTheoryDeck, quizDeck } from "@/lib/questions";
import {
  aiTheoryExplanationEn,
  conceptEn,
  quizExplanationEn,
} from "@/data/study_en";
import { drillStepsEn, patternEn } from "@/data/patterns_en";

export type CardKind = "concept" | "formula" | "theory-qa" | "problem-steps";

export interface StudyCardEn {
  body?: string;
  note?: string;
  steps?: string[];
  exampleProblem?: string;
  answer?: string;
}

export interface StudyCard {
  id: string;
  kind: CardKind;
  chapterNumber: number;
  title: string;
  prompt: string;
  promptAr?: string;
  bodyAr?: string;
  keyTerms?: string[];
  formulas?: string[];
  noteAr?: string;
  code?: string;
  answer?: string;
  stepsAr?: string[];
  source?: string;
  exampleProblem?: string;
  en?: StudyCardEn;
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
    chapter.theory.map((concept) => {
      const en = conceptEn[concept.id];
      return {
        id: `concept-${concept.id}`,
        kind: "concept" as const,
        chapterNumber: chapter.number,
        title: concept.title,
        prompt: `Explain: ${concept.title}`,
        promptAr: `اشرح: ${concept.title}`,
        bodyAr: concept.contentAr,
        keyTerms: concept.keyTerms,
        formulas: concept.formulas,
        noteAr: concept.importantNoteAr,
        source: "Theory",
        en: en ? { body: en.body, note: en.note } : undefined,
      };
    }),
  );
}

function formulaCards(): StudyCard[] {
  const cards: StudyCard[] = [];
  for (const chapter of chapters) {
    for (const concept of chapter.theory) {
      if (!concept.formulas?.length) continue;
      concept.formulas.forEach((formula, index) => {
        const en = conceptEn[concept.id];
        cards.push({
          id: `formula-${concept.id}-${index + 1}`,
          kind: "formula",
          chapterNumber: chapter.number,
          title: concept.title,
          prompt: `Recall formula ${index + 1} from: ${concept.title}`,
          promptAr: `استرجع القانون ${index + 1} من: ${concept.title}`,
          formulas: [formula],
          bodyAr: concept.contentAr,
          noteAr: concept.importantNoteAr,
          source: "Theory formula",
          en: en ? { body: en.body, note: en.note } : undefined,
        });
      });
    }
  }
  return cards;
}

function theoryQaCards(): StudyCard[] {
  return [...quizDeck, ...aiTheoryDeck].map((question) => {
    const explanation =
      quizExplanationEn[question.id] ?? aiTheoryExplanationEn[question.id];
    return {
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
      en: explanation ? { body: explanation } : undefined,
    };
  });
}

function patternSteps(pattern: PracticalPattern, chapterNumber: number): StudyCard {
  const en = patternEn[pattern.id];
  const englishType = en?.problemType ?? pattern.problemType;
  return {
    id: `steps-${pattern.id}`,
    kind: "problem-steps",
    chapterNumber,
    title: englishType,
    prompt: `How do you solve: ${englishType}?`,
    promptAr: `إزاي تحل: ${pattern.problemType}?`,
    stepsAr: pattern.stepsAr,
    answer: pattern.workedExample.finalAnswer,
    exampleProblem: pattern.workedExample.problem,
    source: "Lecture pattern",
    en: en
      ? {
          steps: en.steps,
          answer: en.workedExample.finalAnswer,
          exampleProblem: en.workedExample.problem,
        }
      : undefined,
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
    promptAr: `إزاي تحل: ${problem.problemType}?`,
    stepsAr: problem.solutionStepsAr,
    answer: problem.correctAnswer,
    exampleProblem: problem.question,
    code: problem.codeOrFormula,
    source: `AI Practical · ${problem.difficulty}`,
    en: drillStepsEn[problem.id]
      ? { steps: drillStepsEn[problem.id] }
      : undefined,
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
