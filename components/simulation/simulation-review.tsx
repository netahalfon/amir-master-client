"use client";

import { SimulationData, SimulationGradeResult } from "@/types/chapter-types";
import { useState, useEffect } from "react";
import { SimulationBar } from "@/components/simulation/simulation-bar";
import CompletionExerciseCard from "@/components/completion-exercise-card";
import RephrasingExerciseCard from "../rephrasing-exercise-card";
import ReadingExerciseCard from "../reading-exercise-card";
interface SimulationReviewProps {
  onBackToMenu: () => void;
  simulationData: SimulationData | null;
  gradeResult: SimulationGradeResult | null;
}

export default function SimulationReview({
  onBackToMenu,
  simulationData,
  gradeResult,
}: SimulationReviewProps) {
  const [sectionKey, setSectionKey] = useState<
    "chaptersSection1" | "chaptersSection2"
  >("chaptersSection1");
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  useEffect(() => {
    if (currentQuestionIndex < 8) setCurrentChapterIndex(0);
    else if (currentQuestionIndex < 12) setCurrentChapterIndex(1);
    else if (currentQuestionIndex < 17) setCurrentChapterIndex(2);
    else if (currentQuestionIndex < 22) setCurrentChapterIndex(3);
  }, [currentQuestionIndex]);

  const getQuestionIndexInChapter = (): number => {
    if (currentQuestionIndex < 8) return currentQuestionIndex;
    if (currentQuestionIndex < 12) return currentQuestionIndex - 8;
    if (currentQuestionIndex < 17) return currentQuestionIndex - 12;
    if (currentQuestionIndex < 22) return currentQuestionIndex - 17;
    return -1;
  };

  const chapters = simulationData?.[sectionKey];
  const currentChapter = chapters?.[currentChapterIndex];
  const currentQuestion =
    currentChapter?.questions[getQuestionIndexInChapter()];
  const type = currentChapter?.type;
  const passage = currentChapter?.passage;

  const handleQuestionClick = (index: number, section: number) => {
    if (section == 1 && sectionKey != "chaptersSection1") {
      setSectionKey("chaptersSection1");
    } else if (section == 2 && sectionKey != "chaptersSection2") {
      setSectionKey("chaptersSection2");
    }
    setCurrentQuestionIndex(index);
  };

  const handleAnswerSelect = async (option: string | null) => {
    return true;
  };

  const handleReset = () => {
    handleAnswerSelect(null);
  };

  const handlePreviousExercise = () => {
    if (sectionKey === "chaptersSection1" && currentQuestionIndex == 0) {
      setCurrentQuestionIndex(0);
    } else if (currentQuestionIndex == 0) {
      setCurrentQuestionIndex(21);
      setSectionKey("chaptersSection1");
    } else {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNextExercise = () => {
    if (sectionKey === "chaptersSection2" && currentQuestionIndex == 21) {
      setCurrentQuestionIndex(21);
    } else if (currentQuestionIndex == 21) {
      setCurrentQuestionIndex(0);
      setSectionKey("chaptersSection2");
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="text-center py-12">
      <h3 className="text-2xl font-bold mb-4"> Score: {gradeResult?.grade}</h3>
      <div className="flex flex-col md:flex-row items-center justify-start gap-4 mb-6 text-left">
        <div className="text-lg font-medium text-muted-foreground">
          Section 1:
        </div>
        <SimulationBar
          showFeedback={true}
          currentQuestionIndex={
            sectionKey === "chaptersSection1" ? currentQuestionIndex : null
          }
          chapters={simulationData?.chaptersSection1}
          totalQuestions={22}
          onQuestionClick={(index) => handleQuestionClick(index, 1)}
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-start gap-4 mb-6 text-left">
        <div className="text-lg font-medium text-muted-foreground">
          Section 2:
        </div>
        <SimulationBar
          showFeedback={true}
          currentQuestionIndex={
            sectionKey === "chaptersSection2" ? currentQuestionIndex : null
          }
          chapters={simulationData?.chaptersSection2}
          totalQuestions={22}
          onQuestionClick={(index) => handleQuestionClick(index, 2)}
        />
      </div>

      {type === "completion" && currentQuestion && (
        <CompletionExerciseCard
          currentExercise={currentQuestion}
          handleAnswerSelect={handleAnswerSelect}
          handleReset={handleReset}
          handlePreviousExercise={handlePreviousExercise}
          handleNextExercise={handleNextExercise}
          showFeedback={true}
          totalQuestions={22}
        />
      )}
      {type === "rephrasing" && currentQuestion && (
        <RephrasingExerciseCard
          currentExercise={currentQuestion}
          handleAnswerSelect={handleAnswerSelect}
          handleReset={handleReset}
          handlePreviousExercise={handlePreviousExercise}
          handleNextExercise={handleNextExercise}
          showFeedback={true}
          totalQuestions={22}
        />
      )}
      {type === "reading" && currentQuestion && passage && (
        <ReadingExerciseCard
          currentExercise={currentQuestion}
          passage={passage}
          handleAnswerSelect={(option) => true}
          handleReset={handleReset}
          handlePreviousExercise={handlePreviousExercise}
          handleNextExercise={handleNextExercise}
          showFeedback={true}
          totalQuestions={22}
        />
      )}

      <button
        onClick={onBackToMenu}
        className="bg-muted px-4 py-2 rounded border"
      >
        Back to Simulations Menu
      </button>
    </div>
  );
}
