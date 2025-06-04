"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useAuth from "@/hooks/use-auth"

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { auth } = useAuth()

  useEffect(() => {
    if (!auth?.accessToken) {
      router.push("/auth/login")
    }
  }, [auth, router])

  if (!auth?.accessToken) return null

  return <>{children}</>
}

export default RequireAuth
