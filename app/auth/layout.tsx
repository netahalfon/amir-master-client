"use client";
import { ReactNode, useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useApi } from "@/services/use-api";
import axiosInstance, { REQUESTS } from "@/lib/axios";

export default function Layout({ children }: { children: ReactNode }) {
  const [clientId, setClientId] = useState<string | undefined>();
  useEffect(() => {
    axiosInstance
      .get(REQUESTS.GET_GOOGLE_CLIENT_ID)
      .then((res) => {
        console.log("Google Client ID:", res.data.clientId);
        setClientId(res.data.clientId);
      })
      .catch((err) => {
        console.error("Error fetching Google Client ID:", err);
      });
  }, []);

  if (!clientId) return <div>Loading...</div>;

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}
