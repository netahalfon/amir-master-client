// src/types/chapter-types.ts
export interface SimulationGradeResult {
  grade: number;
  correctAnswers: number;
  totalQuestions: number;
}

export type QuestionState = "unanswered" | "correct" | "incorrect" | "answered";

export interface QuestionData {
    _id: string
    question: string;
    incorrectOptions: string[];
    correctOption: string;
    order: number;
    answeredCorrectly: boolean | null;
    selectedOption: string | null;
  }
  
  export interface ChapterData {
    type: "completion" | "rephrasing" | "reading" ;
    order: number;
    questions: QuestionData[];
    passage?: string | null;
  }

  export interface SimulationData {
  _id: string;
  name: string;
  type: "Psychometrics" | "Amirnet";
  order: number;
  chaptersSection1: ChapterData[];
  chaptersSection2: ChapterData[];
}

export type ProgressSummary ={
  vocabularyByLevel: { level: number; count: number; mastered: number; learning: number }[];
   masteryDistribution: { name: string; value: number }[];
  practiceStats: { name: string; correct: number; incorrect: number }[];
  simulationScores: { date: string; score: number }[];
}