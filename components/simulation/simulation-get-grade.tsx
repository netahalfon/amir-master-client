"use client";
import type { SimulationGradeResult } from "@/types/chapter-types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
interface SimulationGetGradeProps {
  onReviewClick: () => void;
  onBackToMenu: () => void;
  gradeResult: SimulationGradeResult | null;
}

export default function SimulationGetGrade({
  onReviewClick,
  onBackToMenu,
  gradeResult,
}: SimulationGetGradeProps) {
  const progress = gradeResult?.grade ? (gradeResult?.grade / 150) * 100 : 0;
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <h3 className="text-2xl font-bold mb-4">Simulation Complete!</h3>

      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between mb-2">
          <span>Score: {gradeResult?.grade}</span>
          <span>
            {gradeResult?.correctAnswers} / {gradeResult?.totalQuestions}{" "}
            correct
          </span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <div className="flex gap-4">
        <Button onClick={onBackToMenu} size="lg">
          Start New Simulation
        </Button>

        <Button onClick={onReviewClick} size="lg">
          View Simulation
        </Button>
      </div>
    </div>
  );
}
