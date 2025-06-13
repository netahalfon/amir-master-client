"use client";

import React, { use, useEffect, useState } from "react";
import type { JSX } from "react";
import type { ChapterData } from "@/types/chapter-types";
import {
  SimulationBar,
  QuestionState,
} from "@/components/simulation/simulation-bar";
import CompletionExerciseCard from "@/components/completion-exercise-card";

interface SimulationSectionProps {
  sectionNum: number;
  chapters: ChapterData[];
  onSectionComplete: () => void;
}

export default function SimulationSection({
  sectionNum,
  chapters,
  onSectionComplete,
}: SimulationSectionProps) {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Calculate total questions and answered state array
  const totalQuestions = chapters.reduce(
    (sum, chapter) => sum + chapter.questions.length,
    0
  );
  const [questionStates, setQuestionStates] = useState<QuestionState[]>(
    Array(totalQuestions).fill("unanswered")
  );

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      onSectionComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onSectionComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Update current chapter index based on question index
  useEffect(() => {
    function getChapterIndexByQuestionIndex(
      chapters: ChapterData[],
      questionIndex: number
    ): number {
      if (questionIndex < 8) return chapters.findIndex((ch) => ch.order === 1);
      if (questionIndex < 12) return chapters.findIndex((ch) => ch.order === 2);
      if (questionIndex < 17) return chapters.findIndex((ch) => ch.order === 3);
      if (questionIndex < 22) return chapters.findIndex((ch) => ch.order === 4);
      return -1;
    }

    const index = getChapterIndexByQuestionIndex(
      chapters,
      currentQuestionIndex
    );
    setCurrentChapterIndex(index);
  }, [currentQuestionIndex, chapters]);

const currentChapter = chapters[currentChapterIndex];
const startIndex = chapters
  .slice(0, currentChapterIndex)
  .reduce((sum, ch) => sum + ch.questions.length, 0);
const localIndex = currentQuestionIndex - startIndex;
const currentExercise = currentChapter.questions[localIndex];


const questionState: QuestionState = selectedAnswer ? "answered" : "unanswered";

const sentenceParts: [string, string] =
  currentExercise.question.includes("____")
    ? currentExercise.question.split("____") as [string, string]
    : ["", ""];

const options = [
  ...currentExercise.incorrectOptions,
  currentExercise.correctOption,
];

const handleAnswerSelect = (option: string) => {
  const isCorrect = option === currentExercise.correctOption;
  currentExercise.selectedOption = option;
  currentExercise.answeredCorrectly = isCorrect;
  setQuestionStates((prev) => {
    const updated = [...prev];
    updated[currentQuestionIndex] = "answered";
    return updated;
  });
  setSelectedAnswer(option);
};

const handleReset = () => {
  currentExercise.selectedOption = null;
  currentExercise.answeredCorrectly = null;
  setQuestionStates((prev) => {
    const updated = [...prev];
    updated[currentQuestionIndex] = "unanswered";
    return updated;
  });
};

const handlePreviousExercise = () => {
  setCurrentQuestionIndex((prev) => prev - 1);
};

const handleNextExercise = () => {
  setCurrentQuestionIndex((prev) => prev + 1);
};
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
        <div className="text-lg font-medium text-muted-foreground">
          ⏱ {formatTime(timeLeft)}
        </div>

        <SimulationBar
          currentQuestionOrder={currentQuestionIndex}
          questionStates={questionStates}
          totalQuestions={totalQuestions}
          onQuestionClick={(index) => setCurrentQuestionIndex(index)}
        />

        <button
          onClick={onSectionComplete}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Finish Section
        </button>
      </div>
      {chapters[currentChapterIndex]?.type === "completion" && (
        <CompletionExerciseCard
                      currentExercise={currentExercise}
                      handleAnswerSelect={handleAnswerSelect}
                      handleReset={handleReset}
                      handlePreviousExercise={handlePreviousExercise}
                      handleNextExercise={handleNextExercise}
                      questionState={questionState}
                      currentExerciseIndex={currentQuestionIndex}
                      totalQuestions={22}
                      sentenceParts={sentenceParts}
                      options={options}
                    />
      )}
    </div>
  );
}
