"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { QuestionData, QuestionState } from "@/types/chapter-types";

interface CompletionExerciseCardProps {
  showFeedback: boolean;
  currentExercise: QuestionData;
  totalQuestions: number;
  handleAnswerSelect: (option: string) => void;
  handleReset: () => void;
  handlePreviousExercise: () => void;
  handleNextExercise: () => void;
}

export default function CompletionExerciseCard({
  showFeedback,
  currentExercise,
  totalQuestions: filteredExercisesLength,
  handleAnswerSelect,
  handleReset,
  handlePreviousExercise,
  handleNextExercise,
}: CompletionExerciseCardProps) {
  const selectedAnswer = currentExercise.selectedOption || null;
  // Determine the question state based on the current exercise and feedback visibility
  let questionState: QuestionState;
  if (currentExercise.selectedOption === null) {
    questionState = "unanswered";
  } else if (!showFeedback) {
    questionState = "answered";
  } else if (currentExercise.answeredCorrectly === true) {
    questionState = "correct";
  } else if (currentExercise.answeredCorrectly === false) {
    questionState = "incorrect";
  } else {
    questionState = "answered";
  }

  //Extract the question options
  const options = [
    ...currentExercise.incorrectOptions,
    currentExercise.correctOption,
  ].sort((a, b) => a.localeCompare(b));

  // Split the question into parts
  var [before, after] = currentExercise.question.includes("____")
    ? currentExercise.question.split("____")
    : ["", ""];
  after = after.replace(/_+/g, "").trim();

  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          {/* question */}
          <div className="text-lg mb-8">
            {before}
            <span className="inline-block min-w-[80px] px-2 mx-1 border-b-2 border-primary font-bold">
              {selectedAnswer || ""}
            </span>
            {after}
          </div>

          {/* options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
            {options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              let buttonClass = "justify-start h-auto py-3 px-4 !opacity-100";

              if (isSelected) {
                if (showFeedback) {
                  if (currentExercise.answeredCorrectly === true) {
                    buttonClass +=
                      " bg-green-100 border-green-500 dark:bg-green-900 dark:text-400 dark:border-green-700";
                  } else if (questionState === "incorrect") {
                    buttonClass +=
                      " bg-red-100 border-red-500 dark:bg-red-900 dark:text-400 dark:border-red-700";
                  }
                } else if (questionState === "answered") {
                  buttonClass +=
                    " bg-blue-100 border-blue-500 dark:bg-blue-900 dark:text-400 dark:border-blue-700";
                }
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={buttonClass}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isSelected}
                >
                  {option}
                  {isSelected && questionState === "correct" && (
                    <CheckCircle className="ml-auto" />
                  )}
                  {isSelected && questionState === "incorrect" && (
                    <XCircle className="ml-auto" />
                  )}
                </Button>
              );
            })}
          </div>
          {/* Answer Feedback  */}
          {selectedAnswer && (
            <div className="mt-6 flex items-center gap-4">
              {questionState === "correct" && (
                <p className="text-green-500 dark:text-green-400 font-medium">
                  Correct!
                </p>
              )}
              {questionState === "incorrect" && (
                <p className="text-red-500 dark:text-red-400 font-medium">
                  Try again.
                </p>
              )}

              <Button
                variant="ghost"
                className="text-muted-foreground flex items-center gap-2"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" /> Reset Answer
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex w-full items-center">
        {currentExercise.order - 1 > 0 && (
          <div className="mr-auto">
            <Button variant="outline" onClick={handlePreviousExercise}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Question
            </Button>
          </div>
        )}
        {currentExercise.order < filteredExercisesLength && (
          <div className="ml-auto">
            <Button variant="outline" onClick={handleNextExercise}>
              Next Question
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
