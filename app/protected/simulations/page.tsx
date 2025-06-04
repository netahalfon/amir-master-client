"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function convertEnglishRawScoreToScaled(rawScore: number): number {
  const scoreMap = [
    50, 52, 54, 57, 59, 61, 63, 65, 68, 70,
    72, 74, 76, 79, 81, 83, 85, 87, 90, 92,
    94, 96, 99, 101, 104, 106, 108, 110, 113, 115,
    117, 119, 121, 123, 126, 128, 130, 133, 135, 138,
    140, 142, 145, 147, 150
  ];

  if (rawScore < 0 || rawScore > 44) {
    throw new Error("Raw score must be between 0 and 44.");
  }
  return scoreMap[rawScore];
}


// Sample data - mix of different question types
const simulationQuestions = [
  // Sentence Completion
  {
    id: 1,
    type: "sentence-completion",
    question: "The teacher asked the students to _____ their homework before class.",
    options: ["complete", "completing", "completed", "completes"],
    correctAnswer: "complete",
  },
  {
    id: 2,
    type: "sentence-completion",
    question: "She _____ to the store yesterday to buy groceries.",
    options: ["go", "goes", "went", "going"],
    correctAnswer: "went",
  },
  // Rephrasing
  {
    id: 3,
    type: "rephrasing",
    question: "She doesn't like coffee.",
    instruction: "Choose the sentence with the same meaning:",
    options: [
      "She dislikes coffee.",
      "She isn't liking coffee.",
      "She don't like coffee.",
      "She doesn't liking coffee.",
    ],
    correctAnswer: "She dislikes coffee.",
  },
  {
    id: 4,
    type: "rephrasing",
    question: "Despite the rain, they went for a walk.",
    instruction: "Choose the sentence with the same meaning:",
    options: [
      "They went for a walk because it was raining.",
      "Although it was raining, they went for a walk.",
      "They went for a walk during the rain.",
      "They went for a walk after the rain.",
    ],
    correctAnswer: "Although it was raining, they went for a walk.",
  },
  // Reading Comprehension
  {
    id: 5,
    type: "reading",
    passage: `Climate change refers to significant, long-term changes in the global climate. The global average surface temperature has increased over the last century by about 1 degree Celsius. While this change may seem small, it has significant impacts on the Earth's climate systems and ecosystems.

The primary cause of climate change is the burning of fossil fuels, such as coal, oil, and natural gas, which releases carbon dioxide and other greenhouse gases into the atmosphere. These gases trap heat from the sun, causing the Earth's temperature to rise.`,
    questions: [
      {
        id: "5a",
        question: "By how much has the global average surface temperature increased over the last century?",
        options: ["0.5 degrees Celsius", "1 degree Celsius", "2 degrees Celsius", "3 degrees Celsius"],
        correctAnswer: "1 degree Celsius",
      },
      {
        id: "5b",
        question: "What is the primary cause of climate change according to the passage?",
        options: ["Deforestation", "Industrial processes", "Agricultural practices", "Burning of fossil fuels"],
        correctAnswer: "Burning of fossil fuels",
      },
    ],
  },
  // More sentence completion
  {
    id: 6,
    type: "sentence-completion",
    question: "If I _____ more time, I would have finished the project.",
    options: ["have", "had", "having", "has"],
    correctAnswer: "had",
  },
  {
    id: 7,
    type: "sentence-completion",
    question: "The concert was _____ that we could hear it from blocks away.",
    options: ["so loud", "such loud", "so loudly", "such loudly"],
    correctAnswer: "so loud",
  },
  // More rephrasing
  {
    id: 8,
    type: "rephrasing",
    question: "The movie was very good.",
    instruction: "Choose the sentence with the same meaning:",
    options: [
      "The movie was too good.",
      "The movie is very good.",
      "The movie was extremely good.",
      "The movie were very good.",
    ],
    correctAnswer: "The movie was extremely good.",
  },
  {
    id: 9,
    type: "rephrasing",
    question: "He said he would finish the project on time.",
    instruction: "Choose the sentence with the same meaning:",
    options: [
      "He said the project will be finished on time.",
      "He promised to finish the project on time.",
      "He says he will finish the project on time.",
      "He is saying he would finish the project on time.",
    ],
    correctAnswer: "He promised to finish the project on time.",
  },
]

// Get a random subset of questions
const getRandomQuestions = (count: number) => {
  const shuffled = [...simulationQuestions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export default function Simulations() {
  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showingPassage, setShowingPassage] = useState(true)
  const [timeLeft, setTimeLeft] = useState(20 * 60) // 20 minutes in seconds
  const [answers, setAnswers] = useState<{ id: string | number; correct: boolean }[]>([])



  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Start the simulation
  const startSimulation = () => {
    setQuestions(getRandomQuestions(10)) // Get 10 random questions
    setIsStarted(true)
    setIsFinished(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setShowingPassage(true)
    setTimeLeft(20 * 60)
    setAnswers([])
  }

  // Handle timer
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isStarted && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setIsFinished(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isStarted, isFinished, timeLeft])

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)

    let correct = false
    if (currentQuestion.type === "reading") {
      const subQuestion = currentQuestion.questions[0] // For simplicity, we're only showing the first sub-question
      correct = answer === subQuestion.correctAnswer
    } else {
      correct = answer === currentQuestion.correctAnswer
    }

    setIsCorrect(correct)

    // Record the answer
    setAnswers((prev) => [
      ...prev,
      {
        id: currentQuestion.type === "reading" ? currentQuestion.questions[0].id : currentQuestion.id,
        correct,
      },
    ])
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
      setShowingPassage(true)
    } else {
      // End of simulation
      setIsFinished(true)
    }
  }

  const toggleView = () => {
    setShowingPassage(!showingPassage)
  }

  // Calculate results
  const correctAnswers = answers.filter((a) => a.correct).length
  const totalQuestions = answers.length
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Simulations</CardTitle>
          <CardDescription>Take full test simulations with mixed question types.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isStarted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-medium mb-4">Ready to start a simulation?</h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                This simulation will include 10 mixed questions (sentence completion, rephrasing, reading) with a
                20-minute timer.
              </p>
              <Button onClick={startSimulation} size="lg">
                Start Simulation
              </Button>
            </div>
          ) : isFinished ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Simulation Complete!</h3>

              <div className="w-full max-w-md mb-8">
                <div className="flex justify-between mb-2">
                  <span>Score: {score}%</span>
                  <span>
                    {correctAnswers} / {totalQuestions} correct
                  </span>
                </div>
                <Progress value={score} className="h-3" />
              </div>

              <div className="grid gap-4 w-full max-w-md mb-8">
                <div className="flex justify-between p-3 bg-muted rounded-md">
                  <span className="font-medium">Time used:</span>
                  <span>{formatTime(20 * 60 - timeLeft)} / 20:00</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded-md">
                  <span className="font-medium">Questions answered:</span>
                  <span>
                    {totalQuestions} / {questions.length}
                  </span>
                </div>
              </div>

              <Button onClick={startSimulation} size="lg">
                Start New Simulation
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
                <div>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
              </div>

              <Card className="border-2">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {currentQuestion?.type === "sentence-completion" && "Sentence Completion"}
                      {currentQuestion?.type === "rephrasing" && "Rephrasing"}
                      {currentQuestion?.type === "reading" && "Reading Comprehension"}
                    </CardTitle>
                    {currentQuestion?.type === "reading" && (
                      <Button variant="outline" size="sm" onClick={toggleView}>
                        {showingPassage ? "Show Question" : "Show Passage"}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  {currentQuestion?.type === "reading" && showingPassage ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-line">{currentQuestion?.passage}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                      {currentQuestion?.type === "sentence-completion" && (
                        <div className="text-lg mb-8">
                          {currentQuestion.question.split("_____")[0]}
                          <span className="inline-block min-w-[80px] px-2 mx-1 border-b-2 border-primary font-bold">
                            {selectedAnswer || "_____"}
                          </span>
                          {currentQuestion.question.split("_____")[1]}
                        </div>
                      )}

                      {currentQuestion?.type === "rephrasing" && (
                        <>
                          <p className="text-lg font-bold mb-2 px-4 py-2 bg-muted rounded-md">
                            "{currentQuestion.question}"
                          </p>
                          <p className="mb-6">{currentQuestion.instruction}</p>
                        </>
                      )}

                      {currentQuestion?.type === "reading" && !showingPassage && (
                        <p className="text-lg mb-8 px-4 py-2 bg-muted rounded-md max-w-2xl">
                          {currentQuestion.questions[0].question}
                        </p>
                      )}

                      <div className="grid grid-cols-1 gap-3 w-full max-w-md">
                        {(currentQuestion?.type === "reading"
                          ? currentQuestion.questions[0].options
                          : currentQuestion?.options
                        ).map((option: string, index: number) => (
                          <Button
                            key={index}
                            variant={selectedAnswer === option ? (isCorrect ? "default" : "destructive") : "outline"}
                            className={`justify-start h-auto py-3 px-4 text-left ${
                              selectedAnswer &&
                              option ===
                                (currentQuestion?.type === "reading"
                                  ? currentQuestion.questions[0].correctAnswer
                                  : currentQuestion?.correctAnswer) &&
                              !isCorrect
                                ? "border-green-500 dark:border-green-500"
                                : ""
                            }`}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={selectedAnswer !== null}
                          >
                            {option}
                            {selectedAnswer === option && isCorrect && (
                              <CheckCircle className="ml-auto h-5 w-5 text-green-500 shrink-0" />
                            )}
                            {selectedAnswer === option && !isCorrect && (
                              <XCircle className="ml-auto h-5 w-5 text-red-500 shrink-0" />
                            )}
                            {selectedAnswer !== option &&
                              option ===
                                (currentQuestion?.type === "reading"
                                  ? currentQuestion.questions[0].correctAnswer
                                  : currentQuestion?.correctAnswer) &&
                              selectedAnswer !== null && (
                                <CheckCircle className="ml-auto h-5 w-5 text-green-500 shrink-0" />
                              )}
                          </Button>
                        ))}
                      </div>

                      {selectedAnswer && (
                        <div className="mt-6">
                          {isCorrect ? (
                            <p className="text-green-500 dark:text-green-400 font-medium">Correct!</p>
                          ) : (
                            <p className="text-red-500 dark:text-red-400 font-medium">
                              Incorrect. The correct answer is: "
                              {currentQuestion?.type === "reading"
                                ? currentQuestion.questions[0].correctAnswer
                                : currentQuestion?.correctAnswer}
                              "
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  {(currentQuestion?.type !== "reading" || !showingPassage) && (
                    <Button onClick={handleNextQuestion} disabled={!selectedAnswer}>
                      Next Question
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
