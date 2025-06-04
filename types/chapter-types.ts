// src/types/chapter-types.ts

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
  