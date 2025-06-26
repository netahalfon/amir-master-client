//app/protected/word-notebook/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApi } from "@/services/use-api";
import { log } from "node:console";
import { Button } from "@/components/ui/button";

const masteryOptions = ["None", "Don't Know", "Partially Know", "Know Well"];
const levelOptions = Array.from({ length: 10 }, (_, i) => i + 1);

export default function WordNotebook() {
  const { getWordsWithMastery, upsertMastery } = useApi();

  const [words, setWords] = useState<any[]>([]);
  // const [filterWords, setfilterWords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [masteryFilter, setMasteryFilter] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  // fetch words and user masteries
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const combined = await getWordsWithMastery();
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
  
  useEffect(() => {
  setCurrentPage(1);
}, [searchText, levelFilter, masteryFilter]);

  const filteredWords = useMemo(() => {
  return words.filter((w) => {
    const matchesSearch =
      w.english.toLowerCase().includes(searchText.toLowerCase()) ||
      w.hebrew.includes(searchText);
    const matchesLevel =
      levelFilter === "all" || w.level === Number(levelFilter);
    const matchesMastery =
      masteryFilter === "all" || w.mastery === masteryFilter;
    return matchesSearch && matchesLevel && matchesMastery;
  });
}, [words, searchText, levelFilter, masteryFilter]);

  const paginatedWords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredWords.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredWords, currentPage]);

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

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Word Notebooks</CardTitle>
          <CardDescription>
            Manage your vocabulary list and track your progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search words..."
                className="pl-8"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
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
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>English</TableHead>
                  <TableHead>Hebrew</TableHead>
                  <TableHead>Difficulty (Level)</TableHead>
                  <TableHead>Mastery</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWords.length > 0 ? (
                  paginatedWords.map((word) => (
                    <TableRow key={word._id}>
                      <TableCell className="font-medium">
                        {word.english}
                      </TableCell>
                      <TableCell>{word.hebrew}</TableCell>
                      <TableCell>Level {word.level}</TableCell>
                      <TableCell>
                        <Select
                          value={word.mastery}
                          onValueChange={(value) =>
                            handleMasteryChange(word._id, value)
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
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No words found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <div className="px-2 pt-2 text-sm text-muted-foreground">
                Page {currentPage} of{" "}
                {Math.ceil(filteredWords.length / itemsPerPage)}
              </div>
              <Button
                variant="outline"
                disabled={currentPage * itemsPerPage >= filteredWords.length}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
