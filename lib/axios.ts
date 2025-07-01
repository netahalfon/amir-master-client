//lib/axios.ts
import axios from "axios";
import { useRouter } from "next/router";

export const REQUESTS = {
  // auth
  GET_USER_INFO: "/user/user-info",
  GET_GOOGLE_CLIENT_ID: "/user/google-configurations",
  LOGIN: "/user/login",
  GOOGLE_LOGIN: "/user/google-login",
  GOOGLE_SIGNUP: "/user/google-signup",
  LOGOUT: "/user/logout",
  SIGNUP: "/user/signup",
  FORGOT_PASSWORD: "/user/forgot-password",
  RESET_PASSWORD: "/user/reset-password",
  REFRESH_TOKEN: "/user/refresh-token",
  // word bank
  GET_WORDS: "/wordBank",
  GET_WORDS_WITH_MASTERY: "/wordBank//with-mastery",
  // user progress
  GET_USER_PROGRESS: "/user/progress",
  GET_USER_PROGRESS_SUMMARY: "/user/progress/summary",
  UPSERT_MASTERY: "/user/progress/upsert-mastery",
  UPSERT_ANSWERED_QUESTION: "/user/progress/upsert-answered-question",
  UPSERT_SIMULATION_GRADE: "/user/progress/upsert-simulation-grade",
  // chapters
  GET_CHAPTERS_BY_TYPE: "/chapters",
  CREATE_CHAPTER: "/chapters",
  //simulation
  GET_SIMULATIONS_OPTIONS: "/simulation/",
  GET_SIMULATION_BY_ID: "/simulation/",
  GET_SIMULATION_GRADE_BY_ID: "/simulation/get-grade/",

};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosInstance;

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let requestsQueue: (() => void)[] = [];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          requestsQueue.push(() => {
            axiosInstance(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      isRefreshing = true;

      try {
        await axiosInstance.get(REQUESTS.REFRESH_TOKEN);
        requestsQueue.forEach(cb => cb());
        requestsQueue = [];
        return axiosInstance(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }else if (error.response?.status === 401) {
      // Handle 401 Unauthorized error
      // This could be a redirect to login or showing an error message
      console.error("Unauthorized access - redirecting to login");
      const router = useRouter();
      router.push("/auth/login");
    }

    return Promise.reject(error);
  }
);
