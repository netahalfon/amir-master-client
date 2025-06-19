// hooks/use-api.ts
import axiosInstance, { REQUESTS } from "@/lib/axios";

export const useApi = () => {
  //progress:
  const getUserProgress = async () => {
    const { data } = await axiosInstance.get(REQUESTS.GET_USER_PROGRESS);
    return data;
  };

  //word-notebook && word-practice
  const getWordBank = async () => {
    const { data } = await axiosInstance.get(REQUESTS.GET_WORDS);
    return data;
  };

  const getWordMasteries = async () => {//not in use 
    const data = await getUserProgress();
    return data.masteries;
  };

  const upsertMastery = async (wordId: string, mastery: string) => {
    const { data } = await axiosInstance.post(REQUESTS.UPSERT_MASTERY, {
      wordId,
      mastery,
    });
    return data;
  };

  // chapters:
  const getChaptersByType = async (
    type: "completion" | "rephrasing" | "reading"
  ) => {
    const { data } = await axiosInstance.get(REQUESTS.GET_CHAPTERS_BY_TYPE, {
      params: { type },
    });
    return data;
  };

  const getAnsweredQuestions = async () => {
    const data = await getUserProgress();
    return data.answeredQuestions;
  };

  const upsertAnsweredQuestion = async (
    questionId: string,
    answeredCorrectly: boolean | null,
    selectedOption: string | null
  ) => {
    const { data } = await axiosInstance.post(
      REQUESTS.UPSERT_ANSWERED_QUESTION,
      {
        questionId,
        answeredCorrectly,
        selectedOption,
      }
    );
    return data;
  };

  //simulation:

  const getSimulationGrades = async () => {
    const data = await getUserProgress();
    return data.simulationGrades;
  };

  const getSimulationOptions = async () => {
    const { data } = await axiosInstance.get(REQUESTS.GET_SIMULATIONS_OPTIONS);
    return data;
  };

  const getSimulation = async (simulationId: string) => {
    const { data } = await axiosInstance.get(
      `${REQUESTS.GET_SIMULATION_BY_ID}${simulationId}`
    );
    return data;
  };

  const getSimulationGrade = async (simulationId: string) => {
    const { data } = await axiosInstance.get(
      `${REQUESTS.GET_SIMULATION_GRADE_BY_ID}${simulationId}`
    );
    return data; // { grade, correctAnswers, totalQuestions }
  };

  //ADMIN: NOT YET IMPLEMENTED
  const createChapter = async (chapterPayload: {
    // למחוק בעתיד כרגע כי זה פעולה שתתאפשר רק לאדמין
    type: string;
    title?: string;
    passage?: string;
    order: number;
    simulationId?: string;
    questions?: Array<{
      question: string;
      incorrectOptions: string[];
      correctOption: string;
      order: number;
    }>;
  }) => {
    const { data } = await axiosInstance.post(
      REQUESTS.CREATE_CHAPTER,
      chapterPayload
    );
    return data; // הפרק החדש
  };

     const getWordsWithMastery = async () => {
    const { data } = await axiosInstance.get(REQUESTS.GET_WORDS_WITH_MASTERY);
    return data;
  };

  return {
    getUserProgress,
    getWordBank,
    getWordMasteries,
    getWordsWithMastery,
    upsertMastery,
    getChaptersByType,
    getAnsweredQuestions,
    upsertAnsweredQuestion,
    getSimulationGrades,
    getSimulationOptions,
    getSimulation,
    getSimulationGrade,
    createChapter,
  };
};
