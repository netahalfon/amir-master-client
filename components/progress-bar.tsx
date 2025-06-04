"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Circle } from "lucide-react";

export type QuestionState = "unanswered" | "correct" | "incorrect";

export interface ProgressBarProps {
  currentQuestionIndex: number;
  questionStates: QuestionState[];
  totalQuestions: number;
  onQuestionClick?: (index: number) => void;
  className?: string;
}

export function ProgressBar({
  currentQuestionIndex,
  questionStates,
  totalQuestions,
  onQuestionClick,
  className,
}: ProgressBarProps) {
  // Ensure we have the correct number of question states
  const normalizedQuestionStates: QuestionState[] = Array.from(
    { length: totalQuestions },
    (_, i) => questionStates[i] || "unanswered"
  );

  return (
    <div className={cn("h-8 w-fit", className)}>
      <div className="flex items-center justify-start min-w-max p-1 border border-input rounded-lg">
        {normalizedQuestionStates.map((state, index) => {
          const isCurrent = index === currentQuestionIndex;

          let baseColor = "bg-transparent"; // unanswered
          if (state === "correct") baseColor = "bg-green-500/20";
          else if (state === "incorrect") baseColor = "bg-red-500/20";

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
