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
import ReadingExerciseCard from "../reading-exercise-card";

interface SimulationSectionProps {
  sectionNum: number;
  chapters: ChapterData[];
  onSectionComplete: () => void;
  updateQuestionAnswer: ( // Function to update a specific question's answer
    sectionNum: 1 | 2,
    chapterIdx: number,
    questionIdx: number,
    selectedOption: string | null
  ) => void;
}

export default function SimulationSection({
  sectionNum,
  chapters,
  onSectionComplete,
  updateQuestionAnswer,
}: SimulationSectionProps) {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [questionStates, setQuestionStates] = useState<QuestionState[]>(
    Array(22).fill("unanswered")
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

  const handleAnswerSelect = async (option: string | null) => {
    if (!currentExercise) return;

    const questionIdxInChapter = getQuestionIndexInChapter(currentQuestionIndex);
    if (questionIdxInChapter === -1) return;

    try {
    // שולחת את האינדקסים האמיתיים לעדכון בשרת ובסטייט
    await updateQuestionAnswer(
      sectionNum as 1 | 2,
      currentChapterIndex,
      questionIdxInChapter,
      option
    );

// Update the local state with the selected answer
    setQuestionStates((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = option ? "answered" : "unanswered";
      return updated;
    });
  } catch (err) {
    console.error("❌ Failed to save answer:", err);
  }
  };

  const handleReset = () => {
    handleAnswerSelect(null);
  };

  const handlePreviousExercise = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleNextExercise = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  function getQuestionIndexInChapter(questionIndex: number): number {
    //להעזר בפונקציה בעוד מקומות שמנסים למצוא את השאלה לפי אורדר 
  if (questionIndex < 8) return questionIndex;       
  if (questionIndex < 12) return questionIndex - 8;  
  if (questionIndex < 17) return questionIndex - 12; 
  if (questionIndex < 22) return questionIndex - 17; 
  return -1; 
}
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
      {chapters[currentChapterIndex]?.type === "completion" &&
        currentExercise && (
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
      {chapters[currentChapterIndex]?.type === "rephrasing" &&
        currentExercise && (
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
      {chapters[currentChapterIndex]?.type === "reading" && currentExercise && currentChapter.passage&& (
        <ReadingExerciseCard
          currentExercise={currentExercise}
          passage={currentChapter.passage} // הנחה שיש פרופרטי כזה ב־chapter
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
