"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SimulationSection from "@/components/simulation/simulation-section";
import SimulationGetGrade from "@/components/simulation/simulation-get-grade";
import SimulationReview from "@/components/simulation/simulation-review";

import { useApi } from "@/services/use-api";
import type {
  SimulationData,
  SimulationGradeResult,
  ChapterData,
  QuestionData,
} from "@/types/chapter-types";
import { set } from "date-fns";

export default function Simulations() {
  const {
    getSimulationOptions,
    getSimulation,
    upsertAnsweredQuestion,
    getSimulationGrade,
  } = useApi();
  const [simulationOptions, setSimulationOptions] = useState<any[]>([]);
  const [selectedSimulationId, setSelectedSimulationId] = useState<
    string | undefined
  >(undefined);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(
    null
  );
  const [simulationStage, setSimulationStage] = useState<
    null | "section1" | "section2" | "get grade" | "review"
  >(null);


  const [gradeResult, setGradeResult] = useState<SimulationGradeResult | null>(
    null
  );

  useEffect(() => {
    const fetchSimulationOptions = async () => {
      try {
        const simulations = await getSimulationOptions();
        setSimulationOptions(simulations);
        console.log("Fetched simulations:", simulations);
      } catch (err) {
        console.error("Error fetching simulations:", err);
      }
    };
    fetchSimulationOptions();
  }, []);

  const startSimulation = async () => {
    //start sec 1
    if (!selectedSimulationId) return;
    const simulation = await getSimulation(selectedSimulationId);
    setSimulationData(simulation);
    setSimulationStage("section1");
  };

  const returnToMenu = () => {
    setSimulationStage(null);
    setSimulationData(null);
    setSelectedSimulationId(undefined);
  };

  //update the simulation answers in the state and in the server
  const updateQuestionAnswer = async (
    sectionNum: 1 | 2,
    chapterIdx: number,
    questionIdx: number,
    selectedOption: string | null
  ) => {
    if (!simulationData) return;

    const sectionKey =
      sectionNum === 1 ? "chaptersSection1" : "chaptersSection2";

    const question =
      simulationData[sectionKey][chapterIdx]?.questions[questionIdx];

    const isCorrect = selectedOption
      ? question.correctOption === selectedOption
      : null;

    try {
      // Save the answer to the server
      await upsertAnsweredQuestion(question._id, isCorrect, selectedOption);
      // Update the local state
      setSimulationData((prev) => {
        if (!prev) return prev;

        const updatedChapters = prev[sectionKey].map((chapter, cIdx) => {
          if (cIdx !== chapterIdx) return chapter;

          const updatedQuestions = chapter.questions.map((q, qIdx) => {
            if (qIdx !== questionIdx) return q;

            return {
              ...q,
              selectedOption,
              answeredCorrectly: isCorrect,
            };
          });

          return {
            ...chapter,
            questions: updatedQuestions,
          };
        });

        return {
          ...prev,
          [sectionKey]: updatedChapters,
        };
      });
    } catch (err) {
      console.error("❌ Failed to save answer to server:", err);
    }
  };

  const getGrade = async (): Promise<SimulationGradeResult | undefined> => {
    if (!selectedSimulationId) return;

    try {
      const gradeData = await getSimulationGrade(selectedSimulationId);
      const result: SimulationGradeResult = {
        grade: gradeData.grade,
        correctAnswers: gradeData.correctAnswers,
        totalQuestions: gradeData.totalQuestions,
      };
      setGradeResult(result);
      return result;
    } catch (err) {
      console.error("❌ Failed to fetch simulation grade:", err);
    }
  };

  useEffect(() => {
    if (simulationStage === "get grade") {
      getGrade();
    }
  }, [simulationStage]);

  return (
    <div className="container py-8">
      {simulationStage == null ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Simulations</CardTitle>
            <CardDescription>
              Take full test simulations with mixed question types.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              {/* Select Simulation */}
              <Select
                value={selectedSimulationId}
                onValueChange={setSelectedSimulationId}
              >
                <SelectTrigger className="w-full md:w-[300px] mb-8">
                  <SelectValue placeholder="Select a simulation" />
                </SelectTrigger>
                <SelectContent>
                  {simulationOptions.map((sim) => (
                    <SelectItem key={sim._id} value={sim._id}>
                      {sim.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <h3 className="text-xl font-medium mb-4">
                Ready to start a simulation?
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                This simulation will include 10 mixed questions (sentence
                completion, rephrasing, reading) with a 20-minute timer.
              </p>
              <Button
                onClick={startSimulation}
                size="lg"
                disabled={!selectedSimulationId}
              >
                Start Simulation
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : simulationStage == "section1" && simulationData ? (
        <SimulationSection
          sectionNum={1}
          chapters={simulationData?.chaptersSection1}
          updateQuestionAnswer={updateQuestionAnswer}
          onSectionComplete={() => setSimulationStage("section2")}
        />
      ) : simulationStage == "section2" && simulationData ? (
        <SimulationSection
          sectionNum={2}
          chapters={simulationData?.chaptersSection2}
          updateQuestionAnswer={updateQuestionAnswer}
          onSectionComplete={() => setSimulationStage("get grade")}
        />
      ) : simulationStage == "get grade" ? (
        <SimulationGetGrade
          gradeResult={gradeResult}
          onReviewClick={() => setSimulationStage("review")}
          onBackToMenu={() => returnToMenu()}
        />
      ) : simulationStage == "review" ? (
        <SimulationReview onBackToMenu={() => returnToMenu()} />
      ) : null}
    </div>
  );
}
