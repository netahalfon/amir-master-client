//app/protected/sentence-completion/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { ProgressBar, QuestionState } from "@/components/progress-bar";
import CompletionExerciseCard from "@/components/completion-exercise-card";
import { useApi } from "@/services/use-api";
import type { ChapterData, QuestionData } from "@/types/chapter-types";

export default function SentenceCompletion() {
  const { getChaptersByType, upsertAnsweredQuestion } = useApi();

  const [chaptersData, setChaptersData] = useState<ChapterData[]>([]);

  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const [chapterOptions, setChapterOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const chapters = await getChaptersByType("completion");
        setChaptersData(chapters);
        setChapterOptions(
          chapters.map((chapter: ChapterData) => ({
            id: chapter.order,
            name: `Chapter ${chapter.order}`,
          }))
        );
        // אם לא נבחר פרק, נבחר אוטומטית את הראשון
        if (!selectedChapter && chapters.length > 0) {
          setSelectedChapter(chapters[0].order.toString());
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchInitialData();
  }, []);

  const filteredChapter: ChapterData | undefined =
    selectedChapter && selectedChapter !== "all"
      ? chaptersData.find((ch) => ch.order === Number.parseInt(selectedChapter))
      : chaptersData[0];

  const filteredExercises: QuestionData[] = filteredChapter?.questions ?? [];

  const currentExercise = filteredExercises[currentExerciseIndex];

  useEffect(() => {
    if (!currentExercise) {
      setOptions([]);
      return;
    }
    const opts = [
      ...currentExercise.incorrectOptions,
      currentExercise.correctOption,
    ].sort(() => Math.random() - 0.5);
    setOptions(opts);

    // If previously answered, pre-fill answer state
    setSelectedAnswer(currentExercise.selectedOption ?? null);
    setIsCorrect(
      currentExercise.answeredCorrectly !== null
        ? currentExercise.answeredCorrectly
        : null
    );
  }, [currentExerciseIndex, selectedChapter]);

  const handleAnswerSelect = async (answer: string) => {
    if (!currentExercise) return;

    const correct = answer === currentExercise.correctOption;
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    try {
      await upsertAnsweredQuestion(currentExercise._id, correct, answer);
      updateQuestionAnswerLocally(currentExercise._id, answer, correct);
    } catch (err) {
      console.error("Failed to save answer:", err);
    }
  };

  const handleReset = async () => {
    if (!currentExercise) return;

    try {
      await upsertAnsweredQuestion(currentExercise._id, null, null);
      setSelectedAnswer(null);
      setIsCorrect(null);
      updateQuestionAnswerLocally(currentExercise._id, null, null);
    } catch (err) {
      console.error("Failed to reset answer:", err);
    }
  };

  const updateQuestionAnswerLocally = (
    questionId: string,
    selectedOption: string | null,
    answeredCorrectly: boolean | null
  ) => {
    setChaptersData((prevChapters) =>
      prevChapters.map((chapter) => ({
        ...chapter,
        questions: chapter.questions.map((q) =>
          q._id === questionId
            ? {
                ...q,
                selectedOption,
                answeredCorrectly,
              }
            : q
        ),
      }))
    );
  };

  const handleNextExercise = () => {
    setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handlePreviousExercise = () => {
    setCurrentExerciseIndex((prevIndex) => prevIndex - 1);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const questionStates: QuestionState[] = filteredExercises.map((q) => {
    if (q.answeredCorrectly === true) return "correct";
    if (q.answeredCorrectly === false) return "incorrect";
    return "unanswered";
  });

  // Split sentence at the blank
  const rawParts = currentExercise?.question?.includes("____")
    ? currentExercise.question.split("____")
    : [""];

  const sentenceParts: [string, string] = [
    rawParts[0] || "",
    rawParts[1] || "",
  ];

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sentence Completion</CardTitle>
          <CardDescription>
            Complete sentences with the correct words.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
            {/* Select chapter */}
            <Select value={selectedChapter} onValueChange={setSelectedChapter}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a chapter" />
              </SelectTrigger>
              <SelectContent>
                {chapterOptions.map((chapter) => (
                  <SelectItem key={chapter.id} value={chapter.id.toString()}>
                    {chapter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* chapter progress bar */}
            <ProgressBar
              currentQuestionIndex={currentExerciseIndex}
              questionStates={questionStates}
              totalQuestions={filteredExercises.length}
              onQuestionClick={(index) => setCurrentExerciseIndex(index)}
            />
          </div>

          {currentExercise ? (
            <CompletionExerciseCard
              currentExercise={currentExercise}
              handleAnswerSelect={handleAnswerSelect}
              handleReset={handleReset}
              handlePreviousExercise={handlePreviousExercise}
              handleNextExercise={handleNextExercise}
              showFeedback={true}
              totalQuestions={filteredExercises.length}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-medium mb-2">
                No exercises available
              </h3>
              <p className="text-muted-foreground">
                Try selecting a different chapter
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
