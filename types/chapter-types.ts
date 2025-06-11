// src/types/chapter-types.ts
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
    type: "completion" | "rephrasing" | "grammar";
    order: number;
    questions: QuestionData[];
    passage?: string |null;
  }

  export interface SimulationData {
  _id: string;
  name: string;
  type: "Psychometrics" | "Amirnet";
  order: number;
  chaptersSection1: ChapterData[];
  chaptersSection2: ChapterData[];
}
  