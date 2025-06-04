import Link from "next/link"
import { BookOpen, Brain, FileText, Repeat, BookText, FlaskConical, LineChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const features = [
    {
      title: "Word Notebook",
      description: "Manage your vocabulary list and track your progress.",
      icon: BookOpen,
      href: "/protected/word-notebook",
      color: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-600 dark:text-blue-300",
    },
    {
      title: "Word Practice",
      description: "Practice your vocabulary with flashcards and quizzes.",
      icon: Brain,
      href: "/protected/word-practice",
      color: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-600 dark:text-green-300",
    },
    {
      title: "Sentence Completion",
      description: "Complete sentences with the correct words.",
      icon: FileText,
      href: "/protected/sentence-completion",
      color: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-600 dark:text-purple-300",
    },
    {
      title: "Rephrasing",
      description: "Practice rephrasing sentences in different ways.",
      icon: Repeat,
      href: "/protected/rephrasing",
      color: "bg-orange-100 dark:bg-orange-900",
      textColor: "text-orange-600 dark:text-orange-300",
    },
    {
      title: "Reading Comprehension",
      description: "Read passages and answer questions to improve understanding.",
      icon: BookText,
      href: "/protected/reading",
      color: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-600 dark:text-red-300",
    },
    {
      title: "Simulations",
      description: "Take full test simulations with mixed question types.",
      icon: FlaskConical,
      href: "/protected/simulations",
      color: "bg-indigo-100 dark:bg-indigo-900",
      textColor: "text-indigo-600 dark:text-indigo-300",
    },
    {
      title: "Progress",
      description: "Track your learning progress and statistics.",
      icon: LineChart,
      href: "/protected/progress",
      color: "bg-teal-100 dark:bg-teal-900",
      textColor: "text-teal-600 dark:text-teal-300",
    },
  ]

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to AmirMaster</h1>
        <p className="text-muted-foreground">Your comprehensive English learning system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href} className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className={`${feature.color} rounded-t-lg`}>
                <div className="flex items-center gap-3">
                  <feature.icon className={`h-6 w-6 ${feature.textColor}`} />
                  <CardTitle className={feature.textColor}>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-start">
                  Open {feature.title}
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
