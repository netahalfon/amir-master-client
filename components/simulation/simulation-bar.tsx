"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Circle } from "lucide-react";
import type { ChapterData } from "@/types/chapter-types";


export interface SimulationBarProps {
  showFeedback: boolean;
  chapters: ChapterData[] |undefined;
  currentQuestionIndex: number |null;
  totalQuestions: number;
  onQuestionClick?: (index: number) => void;
}

export function SimulationBar({
  currentQuestionIndex,
  chapters,
  onQuestionClick,
  showFeedback
}: SimulationBarProps) {


const allQuestions = chapters?.flatMap((ch) => ch.questions);

// יצירת מערך המציין את מצב כל שאלה
  const normalizedQuestionStates = allQuestions?.map((q) => {
    if (showFeedback&& q.answeredCorrectly === true) return "correct";
    else if (showFeedback&& q.answeredCorrectly === false) return "incorrect";
    else if (q.selectedOption === null || q.selectedOption === undefined) return "unanswered";
    return "answered";
  });

  return (
    
    <div className={"h-8 w-fit"}>
      <div className="flex items-center justify-start min-w-max p-1 border border-input rounded-lg">
        {normalizedQuestionStates?.map((state, index) => {
          const isCurrent = index === currentQuestionIndex;

          let baseColor = "bg-transparent"; // unanswered
            if (state === "correct") baseColor = "bg-green-500/20";
          else if (state === "incorrect") baseColor = "bg-red-500/20";
          else if (state === "answered") baseColor = "bg-blue-500/20";

          const border = isCurrent
            ? "border-2 border-black dark:border-white"
            : "border border-muted";

          return (
            <Button
              key={index}
              variant="link"
              size="sm"
              className={cn(
                "w-8 h-8 mx-1 rounded-md",
                baseColor,
                border,
                "text-black font-medium",
                "dark:text-white font-medium",
                onQuestionClick ? "cursor-pointer" : "cursor-default"
              )}
              onClick={() => onQuestionClick?.(index)}
              disabled={!onQuestionClick}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
