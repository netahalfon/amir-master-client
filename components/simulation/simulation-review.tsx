"use client";

interface SimulationReviewProps {
  onBackToMenu: () => void;
}

export default function SimulationReview({ onBackToMenu }: SimulationReviewProps) {
  return (
    <div className="text-center py-12">
      <h3 className="text-2xl font-bold mb-4">Review Your Answers</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        Here you will see all your answers, the correct answers, and explanations.
      </p>
      <button
        onClick={onBackToMenu}
        className="bg-muted px-4 py-2 rounded border"
      >
        Back to Simulations Menu
      </button>
    </div>
  );
}
