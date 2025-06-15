"use client";

import React, { use, useEffect, useState } from "react";
import type { JSX } from "react";
import type { ChapterData } from "@/types/chapter-types";
import {
  SimulationBar,
  QuestionState,
} from "@/components/simulation/simulation-bar";
import CompletionExerciseCard from "@/components/completion-exercise-card";
import RephrasingExerciseCard from "../rephrasing-exercise-card";

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
  const [questionStates, setQuestionStates] = useState<QuestionState[]>(Array(22).fill("unanswered"));


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
    function getChapterOrderByQuestionIndex(): number {
      if (currentQuestionIndex < 8) return 1;
      if (currentQuestionIndex < 12) return 2;
      if (currentQuestionIndex < 17) return 3;
      if (currentQuestionIndex < 22) return 4;
      return -1;
    }

    const order = getChapterOrderByQuestionIndex();
    setCurrentChapterIndex(order - 1);
  }, [currentQuestionIndex]);

  //define and fill the current chapter and exercise based on indices
  const currentChapter = chapters[currentChapterIndex];
  const currentExercise = currentChapter?.questions.find(
    (q) => q.order === currentQuestionIndex + 1
  );

  const handleAnswerSelect = (option: string) => {
    if (!currentExercise) return;
    const isCorrect = option === currentExercise.correctOption;
    currentExercise.selectedOption = option;
    currentExercise.answeredCorrectly = isCorrect;
    setQuestionStates((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = "answered";
      return updated;
    });
  };

  const handleReset = () => {
    if (!currentExercise) return;
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
          totalQuestions={22}
          onQuestionClick={(index) => setCurrentQuestionIndex(index)}
        />

        <button
          onClick={onSectionComplete}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Finish Section
        </button>
      </div>
      {chapters[currentChapterIndex]?.type === "completion" && currentExercise && (
        <CompletionExerciseCard
          currentExercise={currentExercise}
          handleAnswerSelect={handleAnswerSelect}
          handleReset={handleReset}
          handlePreviousExercise={handlePreviousExercise}
          handleNextExercise={handleNextExercise}
          showFeedback={false}
          totalQuestions={22}
        />
      )}
      {chapters[currentChapterIndex]?.type === "rephrasing" && currentExercise && (
        <RephrasingExerciseCard
          currentExercise={currentExercise}
          handleAnswerSelect={handleAnswerSelect}
          handleReset={handleReset}
          handlePreviousExercise={handlePreviousExercise}
          handleNextExercise={handleNextExercise}
          showFeedback={false}
          totalQuestions={22}
        />
      )}
    </div>
  );
}
