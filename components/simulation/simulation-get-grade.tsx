"use client";

interface SimulationGetGradeProps {
  onReviewClick: () => void;
  onBackToMenu: () => void;
}

export default function SimulationGetGrade({ onReviewClick }: SimulationGetGradeProps) {
  return (
    <div className="text-center py-12">
      <h3 className="text-2xl font-bold mb-4">Simulation Complete</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        You have completed the simulation. You can now review your answers.
      </p>
      <button
        onClick={onReviewClick}
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Review Answers
      </button>
    </div>
  );
}
