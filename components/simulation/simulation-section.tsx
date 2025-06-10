"use client";

import React, { useEffect, useState } from "react";
import type { JSX } from "react";
import type { ChapterData } from "@/types/chapter-types";
import {
  SimulationBar,
  QuestionState,
} from "@/components/simulation/simulation-bar";

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
        <button
          onClick={onSectionComplete}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Finish Section
        </button>
        <SimulationBar
          currentQuestionOrder={currentQuestionIndex}
          questionStates={questionStates}
          totalQuestions={totalQuestions}
          onQuestionClick={(index) => setCurrentQuestionIndex(index)}
        />
        <div className="text-lg font-medium text-muted-foreground">
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>




    </div>
  );
}
