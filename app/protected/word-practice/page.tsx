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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { useApi } from "@/services/use-api";

const masteryOptions = ["None", "Don't Know", "Partially Know", "Know Well"];
const levelOptions = Array.from({ length: 10 }, (_, i) => i + 1);

export default function WordPractice() {
  const { getWordsWithMastery, upsertMastery } = useApi();

  const [words, setWords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [masteryFilter, setMasteryFilter] = useState<string>("all");

  const [practiceMode, setPracticeMode] = useState<string>("flashcards");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // fetch words and user masteries
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const combined = await getWordsWithMastery()
        setWords(combined);
      } catch (err) {
        console.error("Failed to fetch words or masteries:", err);
        setError("Failed to load words.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // filter words
  const filteredWords = words.filter((w) => {
    console.log(levelFilter, masteryFilter);
    const matchesLevel =
      levelFilter === "all" || w.level === Number(levelFilter);
    const matchesMastery =
      masteryFilter === "all" || w.mastery === masteryFilter;

    return matchesLevel && matchesMastery;
  });

  // handle mastery update
  const handleMasteryChange = async (wordId: string, newMastery: string) => {
    try {
      console.log("Updating mastery for wordId:", wordId, "to:", newMastery);
      await upsertMastery(wordId, newMastery);
      setWords((prev) =>
        prev.map((w) => (w._id === wordId ? { ...w, mastery: newMastery } : w))
      );
      console.log("Mastery updated successfully in the frontend");
    } catch (err) {
      console.error(err);
      setError("Failed to update mastery.");
    }
  };
  const currentWord = filteredWords[currentWordIndex];
  console.log("currentWord:", currentWord);

  //  מגרילים אופציות רק כשמתחלפת currentWord
  useEffect(() => {
    if (!currentWord) return;
    const opts = getMultipleChoiceOptions();
    setChoices(opts);
  }, [currentWord, words]);

  // after your useState declarations:
  useEffect(() => {
    setCurrentWordIndex(0);
  }, [levelFilter, masteryFilter]);

  // Generate multiple choice options (current word + 3 random words)
  const getMultipleChoiceOptions = () => {
    console.log("making 3 more option for:", currentWord);
    if (!currentWord) return [];

    const options = [currentWord.hebrew];
    const otherWords = words.filter(
      (w) =>
        w._id !== currentWord._id &&
        w.english !== currentWord.english &&
        w.hebrew !== currentWord.hebrew
    );

    while (options.length < 4 && otherWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherWords.length);
      const randomWord = otherWords[randomIndex];

      if (!options.includes(randomWord.hebrew)) {
        options.push(randomWord.hebrew);
        otherWords.splice(randomIndex, 1);
      }
    }

    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    console.log("currentWord התעדכן ל:", currentWord);
    if (!currentWord) return;
    // מגרילים רק כשמתחלפת currentWord
    const opts = getMultipleChoiceOptions();
    setChoices(opts);
  }, [currentWord, words]);

  const handleNextWord = () => {
    setCurrentWordIndex((prevIndex) =>
      // אם כבר בסוף, תשאר כמות שהוא
      prevIndex === filteredWords.length - 1 ? prevIndex : prevIndex + 1
    );
    setShowAnswer(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handlePrevWord = () => {
    setCurrentWordIndex((prevIndex) =>
      prevIndex === 0 ? filteredWords.length - 1 : prevIndex - 1
    );
    setShowAnswer(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === currentWord.hebrew);
  };

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Word Practice</CardTitle>
          <CardDescription>
            Practice your vocabulary with flashcards and quizzes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levelOptions.map((level) => (
                  <SelectItem key={level} value={level.toString()}>
                    Level {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={masteryFilter} onValueChange={setMasteryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by mastery" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Mastery Levels</SelectItem>
                {masteryOptions.map((mastery) => (
                  <SelectItem key={mastery} value={mastery}>
                    {mastery}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-center mb-6">
            <p className="text-lg font-medium">
              Word {currentWordIndex + 1} of {filteredWords.length} words
            </p>
          </div>

          <Tabs
            value={practiceMode}
            onValueChange={setPracticeMode}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
              <TabsTrigger value="multiple-choice">Multiple Choice</TabsTrigger>
            </TabsList>

            {filteredWords.length > 0 ? (
              <>
                <TabsContent value="flashcards" className="mt-0">
                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                        <h3 className="text-3xl font-bold mb-4">
                          {currentWord?.english}
                        </h3>
                        {showAnswer ? (
                          <div className="mt-4">
                            <p className="text-2xl">{currentWord?.hebrew}</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Level {currentWord?.level} •{" "}
                              {currentWord?.mastery}
                            </p>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => setShowAnswer(true)}
                            className="mt-4"
                          >
                            Show Translation
                          </Button>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={handlePrevWord}>
                        Previous
                      </Button>

                      <Select
                        value={currentWord.mastery}
                        onValueChange={(value) =>
                          handleMasteryChange(currentWord._id, value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select mastery" />
                        </SelectTrigger>
                        <SelectContent>
                          {masteryOptions.map((mastery) => (
                            <SelectItem key={mastery} value={mastery}>
                              {mastery}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button variant="outline" onClick={handleNextWord}>
                        Next
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="multiple-choice" className="mt-0">
                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                        <h3 className="text-3xl font-bold mb-4">
                          {currentWord?.english}
                        </h3>
                        <p className="mb-6">Select the correct translation:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
                          {choices.map((option: string, index: number) => (
                            <Button
                              key={index}
                              variant={
                                selectedAnswer === option
                                  ? isCorrect
                                    ? "default"
                                    : "destructive"
                                  : "outline"
                              }
                              className={`justify-start h-auto py-3 px-4 ${
                                selectedAnswer &&
                                option === currentWord?.hebrew &&
                                !isCorrect
                                  ? "border-green-500 dark:border-green-500"
                                  : ""
                              }`}
                              onClick={() => handleAnswerSelect(option)}
                              disabled={selectedAnswer !== null}
                            >
                              {option}
                              {selectedAnswer === option && isCorrect && (
                                <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                              )}
                              {selectedAnswer === option && !isCorrect && (
                                <XCircle className="ml-auto h-5 w-5 text-red-500" />
                              )}
                              {selectedAnswer !== option &&
                                option === currentWord?.hebrew &&
                                selectedAnswer !== null && (
                                  <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                                )}
                            </Button>
                          ))}
                        </div>

                        {selectedAnswer && (
                          <div className="mt-6">
                            {isCorrect ? (
                              <p className="text-green-500 dark:text-green-400 font-medium">
                                Correct!
                              </p>
                            ) : (
                              <p className="text-red-500 dark:text-red-400 font-medium">
                                Incorrect. The correct answer is:{" "}
                                {currentWord?.hebrew}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePrevWord}
                        disabled={!selectedAnswer}
                      >
                        Previous
                      </Button>

                      <Select
                        value={currentWord.mastery}
                        onValueChange={(value) =>
                          handleMasteryChange(currentWord._id, value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select mastery" />
                        </SelectTrigger>
                        <SelectContent>
                          {masteryOptions.map((mastery) => (
                            <SelectItem key={mastery} value={mastery}>
                              {mastery}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant={selectedAnswer ? "default" : "outline"}
                        onClick={handleNextWord}
                        disabled={!selectedAnswer}
                      >
                        Next Word
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  No words match your filters
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try selecting different level or mastery filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLevelFilter("all");
                    setMasteryFilter("all");
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
