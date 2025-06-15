"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
    Dot,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { QuestionData, QuestionState } from "@/types/chapter-types";

interface ReadingExerciseCardProps {
  showFeedback: boolean;
  currentExercise: QuestionData;
  totalQuestions: number;
  handleAnswerSelect: (option: string) => void;
  handleReset: () => void;
  handlePreviousExercise: () => void;
  handleNextExercise: () => void;
passage: string;
}

export default function ReadingExerciseCard({
  showFeedback,
  currentExercise,
  totalQuestions,
  handleAnswerSelect,
  handleReset,
  handlePreviousExercise,
  handleNextExercise,
  passage,
  
}: ReadingExerciseCardProps) {
    const selectedAnswer = currentExercise.selectedOption || null;
    
      let questionState: QuestionState;
      // Determine the question state based on the current exercise and feedback visibility
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
    
      const options = [
        ...currentExercise.incorrectOptions,
        currentExercise.correctOption,
      ].sort((a,b)=> a.localeCompare(b));
    
  return (
    <div className="flex gap-4 items-start">
      {/* כרטיס 1 – passage עם סקרול */}
      <Card className="w-1/2 border-2 py-3 max-h-[500px] overflow-y-auto">
        <CardContent>
          <p className="whitespace-pre-line">{passage}</p>
        </CardContent>
      </Card>

      {/* כרטיס 2 – תרגיל עם תשובות */}
      <Card className="w-1/2 border-2 h-[500px]">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <p className="text-lg font-bold mb-8 px-4 py-2 bg-muted rounded-md">
              "{currentExercise.question}"
            </p>
            <div className="grid grid-cols-1 gap-3 w-full max-w--fit mx-auto">
              {options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption =
                  option === currentExercise.correctOption;
                let buttonClass = "justify-start h-auto py-3 px-4";
                if (isSelected) {
                  if (isCorrectOption) {
                    buttonClass +=
                      " bg-green-100 text-green-700 border-green-500 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700";
                  } else {
                    buttonClass +=
                      " bg-red-100 text-red-700 border-red-500 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700";
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
                      <CheckCircle className="ml-auto h-5 w-5 text-green-500 shrink-0" />
                    )}
                    {isSelected && questionState === "incorrect" && (
                      <XCircle className="ml-auto h-5 w-5 text-red-500 shrink-0" />
                    )}
                    {isSelected && questionState === "answered" && (
                    <Dot className="ml-auto h-5 w-5 text-blue-700 dark:text-blue-300 shrink-0" />
                  )}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="relative flex w-full items-center justify-between px-4 py-3">
          {currentExercise.order - 1 > 0 && (
            <Button variant="outline" onClick={handlePreviousExercise}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          {selectedAnswer && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
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

          {currentExercise.order - 1 > 0 && (
            <Button variant="outline" onClick={handleNextExercise}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
