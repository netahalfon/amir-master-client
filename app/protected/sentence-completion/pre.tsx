//app/protected/sentence-completion/page.tsx
// TODO: DELETE THIS FILE
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
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { useApi } from "@/services/use-api";
import type { ChapterData, QuestionData } from "@/types/chapter-types";

export default function SentenceCompletion() {
  const { getChaptersByType } = useApi();

  const [chaptersData, setChaptersData] = useState<ChapterData[]>([]);
  const [chapterOptions, setChapterOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchCompletionChapters = async () => {
      try {
        const chapters = await getChaptersByType("completion");
        setChaptersData(chapters);
        setChapterOptions(
          chapters.map((chapter: ChapterData) => ({
            id: chapter.order,
            name: `Chapter ${chapter.order}`,
          }))
        );
        console.log("Completion chapters:", chapters);
      } catch (err) {
        console.error("Error fetching completion chapters:", err);
      }
    };

    fetchCompletionChapters();
  }, []);

  // Filter exercises based on selected chapter
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
  }, [currentExercise]);

  // Split sentence at the blank
  const sentenceParts = currentExercise?.question.split("____") || ["", ""];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === currentExercise?.correctOption);
  };

  const handleNextExercise = () => {
    setCurrentExerciseIndex((prevIndex) =>
      prevIndex === filteredExercises.length - 1 ? 0 : prevIndex + 1
    );
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

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
          <div className="mb-6">
            <Select value={selectedChapter} onValueChange={setSelectedChapter}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a chapter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chapters</SelectItem>
                {chapterOptions.map((chapter) => (
                  <SelectItem key={chapter.id} value={chapter.id.toString()}>
                    {chapter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredExercises.length > 0 ? (
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <h3 className="text-xl font-medium mb-8">
                    Complete the sentence:
                  </h3>

                  <div className="text-lg mb-8">
                    {sentenceParts[0]}
                    <span className="inline-block min-w-[80px] px-2 mx-1 border-b-2 border-primary font-bold">
                      {selectedAnswer || "_____"}
                    </span>
                    {sentenceParts[1]}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                    {options.map((option, index) => {
                      // Determine button styling based on selection state
                      const isSelected = selectedAnswer === option;
                      const isCorrectOption =
                        option === currentExercise?.correctOption;

                      let buttonClass = "justify-start h-auto py-3 px-4";

                      if (selectedAnswer) {
                        if (isCorrectOption) {
                          buttonClass +=
                            " bg-green-100 text-green-700 border-green-500 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700";
                        } else if (isSelected) {
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
                          disabled={selectedAnswer !== null}
                        >
                          {option}
                          {isSelected && !isCorrect && (
                            <XCircle className="ml-auto h-5 w-5 text-red-500" />
                          )}
                          {isCorrectOption && selectedAnswer && (
                            <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                          )}
                        </Button>
                      );
                    })}
                  </div>

                  <div className="mt-6">
                    {selectedAnswer ? (
                      isCorrect ? (
                        <p className="text-green-500 dark:text-green-400 font-medium">
                          Correct!
                        </p>
                      ) : (
                        <p className="text-red-500 dark:text-red-400 font-medium">
                          Incorrect. The correct answer is:{" "}
                          {currentExercise?.correctOption}
                        </p>
                      )
                    ) : (
                      // always render a <p>, but keep it empty when no answer selected
                      <p className="font-medium">&nbsp;</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNextExercise} disabled={!selectedAnswer}>
                  Next Question
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
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
