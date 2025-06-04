//app/protected/reading/page.tsx
"use client";

import { use, useEffect, useState } from "react";
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

import { useApi } from "@/services/use-api";
import type { ChapterData, QuestionData } from "@/types/chapter-types";

export default function Reading() {
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
        const chapters = await getChaptersByType("reading");
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

  useEffect(() => {
    if (selectedChapter) {
      const chapter = chaptersData.find(
        (ch) => ch.order === Number.parseInt(selectedChapter)
      );
      if (chapter) { 
        const index = chapter.questions.findIndex((q) =>q.answeredCorrectly == null);
        if (index !== -1) {
          setCurrentExerciseIndex(index);
        } else {
          setCurrentExerciseIndex(0);
        }
      }
    }
  }, [selectedChapter]);

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

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reading</CardTitle>
          <CardDescription>
            Read passages and answer questions to improve understanding.
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
            <div className="flex gap-4 items-start">
              {/* כרטיס 1 – passage עם סקרול */}
              <Card className="w-1/2 border-2 py-3 max-h-[500px] overflow-y-auto">
                <CardContent>
                  <p className="whitespace-pre-line">
                    {filteredChapter?.passage}
                  </p>
                </CardContent>
              </Card>

              {/* כרטיס 2 – תרגיל עם תשובות */}
              <Card className="w-1/2 border-2 h-[500px] ">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                    <p className="text-lg font-bold mb-8 px-4 py-2 bg-muted rounded-md">
                      "{currentExercise.question}"
                    </p>
                    <div className="grid grid-cols-1 gap-3 w-full max-w--fit mx-auto">
                      {options.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrectOption =
                          option === currentExercise?.correctOption;
                        let buttonClass = "justify-start h-auto py-3 px-4";
                        if (selectedAnswer === option) {
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
                            {selectedAnswer === option && isCorrect && (
                              <CheckCircle className="ml-auto h-5 w-5 text-green-500 shrink-0" />
                            )}
                            {selectedAnswer === option &&
                              isCorrect === false && (
                                <XCircle className="ml-auto h-5 w-5 text-red-500 shrink-0" />
                              )}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="relative flex w-full items-center justify-between px-4 py-3">
                  {currentExerciseIndex > 0 && (
                    <div className="mr-auto">
                      <Button
                        variant="outline"
                        onClick={handlePreviousExercise}
                      >
                        <ArrowLeft className="mr h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {selectedAnswer && (
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
                      {isCorrect ? (
                        <p className="text-green-500 dark:text-green-400 font-medium">
                          Correct!
                        </p>
                      ) : (
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

                  {currentExerciseIndex < filteredExercises.length - 1 && (
                    <div className="ml-auto">
                      <Button variant="outline" onClick={handleNextExercise}>
                        <ArrowRight className="ml h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
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
