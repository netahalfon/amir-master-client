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
  ChapterData,
  QuestionData,
} from "@/types/chapter-types";
import { set } from "date-fns";

export function convertEnglishRawScoreToScaled(rawScore: number): number {
  const scoreMap = [
    50, 52, 54, 57, 59, 61, 63, 65, 68, 70, 72, 74, 76, 79, 81, 83, 85, 87, 90,
    92, 94, 96, 99, 101, 104, 106, 108, 110, 113, 115, 117, 119, 121, 123, 126,
    128, 130, 133, 135, 138, 140, 142, 145, 147, 150,
  ];
  if (rawScore < 0 || rawScore > 44) {
    throw new Error("Raw score must be between 0 and 44.");
  }
  return scoreMap[rawScore];
}

export default function Simulations() {
  const { getSimulationOptions, getSimulation } = useApi();
  const [simulationOptions, setSimulationOptions] = useState<any[]>([]);
  const [selectedSimulationId, setSelectedSimulationId] = useState<string | undefined>(undefined);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [simulationStage, setSimulationStage] = useState<
    null | "section1" | "section2" | "get grade" | "review"
  >(null);

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
        onSectionComplete={() => setSimulationStage("section2")}
      />
    ) : simulationStage == "section2" && simulationData ? (
      <SimulationSection
        sectionNum={2}
        chapters={simulationData?.chaptersSection2}
        onSectionComplete={() => setSimulationStage("get grade")}
      />
    ) : simulationStage == "get grade" ? (
      <SimulationGetGrade
        onReviewClick={() => setSimulationStage("review")}
        onBackToMenu={() => returnToMenu()}
      />
    ) : simulationStage == "review" ? (
      <SimulationReview onBackToMenu={() => returnToMenu()} />
    ) : null}
  </div>
);

}
