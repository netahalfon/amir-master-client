"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useApi } from "@/services/use-api";
import { useEffect, useState } from "react";
import type { ProgressSummary } from "@/types/chapter-types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Progress() {
  const { getUserProgressSummary } = useApi();
  const [summary, setSummary] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserProgressSummary();
        setSummary(data);
      } catch (error) {
        console.error("Error fetching progress summary:", error);
      }
    };

    fetchData();
  }, []);

  if (!summary)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500" />
      </div>
    );

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey and see your improvement over time
        </p>
      </div>

      <Tabs defaultValue="vocabulary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
          <TabsTrigger value="practice">Practice Stats</TabsTrigger>
          <TabsTrigger value="simulations">Simulation Scores</TabsTrigger>
        </TabsList>

        <TabsContent value="vocabulary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Words by Level</CardTitle>
                <CardDescription>
                  Distribution of vocabulary words by difficulty level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    mastered: {
                      label: "Mastered",
                      color: "hsl(var(--chart-1))",
                    },
                    learning: {
                      label: "Learning",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={summary.vocabularyByLevel}
                      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="level"
                        label={{
                          value: "Level",
                          position: "insideBottom",
                          offset: -5,
                        }}
                      />
                      <YAxis
                        label={{
                          value: "Words",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="mastered"
                        stackId="a"
                        fill="var(--color-mastered)"
                        name="Mastered"
                      />
                      <Bar
                        dataKey="learning"
                        stackId="a"
                        fill="var(--color-learning)"
                        name="Learning"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mastery Distribution</CardTitle>
                <CardDescription>
                  Distribution of words by mastery level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summary.masteryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {summary.masteryDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} words`, "Count"]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Practice Performance by Type</CardTitle>
              <CardDescription>
                Correct vs. incorrect answers across different practice types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  correct: {
                    label: "Correct",
                    color: "hsl(var(--chart-1))",
                  },
                  incorrect: {
                    label: "Incorrect",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={summary.practiceStats}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      label={{
                        value: "Percentage (%)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar
                      dataKey="correct"
                      stackId="a"
                      fill="var(--color-correct)"
                      name="Correct"
                    />
                    <Bar
                      dataKey="incorrect"
                      stackId="a"
                      fill="var(--color-incorrect)"
                      name="Incorrect"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Scores Over Time</CardTitle>
              <CardDescription>
                Your progress in simulation tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  score: {
                    label: "Score",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={summary.simulationScores}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      domain={[0, 100]}
                      label={{
                        value: "Score (%)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="var(--color-score)"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
