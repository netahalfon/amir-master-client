"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"


// Sample data
const vocabularyByLevel = [
  { level: 1, count: 45, mastered: 40, learning: 5 },
  { level: 2, count: 38, mastered: 30, learning: 8 },
  { level: 3, count: 32, mastered: 20, learning: 12 },
  { level: 4, count: 28, mastered: 15, learning: 13 },
  { level: 5, count: 25, mastered: 10, learning: 15 },
  { level: 6, count: 20, mastered: 5, learning: 15 },
  { level: 7, count: 15, mastered: 3, learning: 12 },
  { level: 8, count: 12, mastered: 2, learning: 10 },
  { level: 9, count: 8, mastered: 1, learning: 7 },
  { level: 10, count: 5, mastered: 0, learning: 5 },
]

const masteryDistribution = [
  { name: "Know Well", value: 126 },
  { name: "Partially Know", value: 87 },
  { name: "Don't Know", value: 45 },
  { name: "None", value: 20 },
]

const practiceStats = [
  { name: "Flashcards", correct: 85, incorrect: 15 },
  { name: "Multiple Choice", correct: 75, incorrect: 25 },
  { name: "Sentence Completion", correct: 65, incorrect: 35 },
  { name: "Rephrasing", correct: 60, incorrect: 40 },
  { name: "Reading", correct: 70, incorrect: 30 },
]

const simulationScores = [
  { date: "Jan 1", score: 65 },
  { date: "Jan 8", score: 68 },
  { date: "Jan 15", score: 72 },
  { date: "Jan 22", score: 75 },
  { date: "Jan 29", score: 73 },
  { date: "Feb 5", score: 78 },
  { date: "Feb 12", score: 82 },
  { date: "Feb 19", score: 85 },
  { date: "Feb 26", score: 88 },
  { date: "Mar 5", score: 92 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function Progress() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-muted-foreground">Track your learning journey and see your improvement over time</p>
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
                <CardDescription>Distribution of vocabulary words by difficulty level</CardDescription>
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
                    <BarChart data={vocabularyByLevel} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" label={{ value: "Level", position: "insideBottom", offset: -5 }} />
                      <YAxis label={{ value: "Words", angle: -90, position: "insideLeft" }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="mastered" stackId="a" fill="var(--color-mastered)" name="Mastered" />
                      <Bar dataKey="learning" stackId="a" fill="var(--color-learning)" name="Learning" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mastery Distribution</CardTitle>
                <CardDescription>Distribution of words by mastery level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={masteryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {masteryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} words`, "Count"]} />
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
              <CardDescription>Correct vs. incorrect answers across different practice types</CardDescription>
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
                  <BarChart data={practiceStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="correct" stackId="a" fill="var(--color-correct)" name="Correct" />
                    <Bar dataKey="incorrect" stackId="a" fill="var(--color-incorrect)" name="Incorrect" />
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
              <CardDescription>Your progress in simulation tests</CardDescription>
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
                  <LineChart data={simulationScores} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} label={{ value: "Score (%)", angle: -90, position: "insideLeft" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="var(--color-score)" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
