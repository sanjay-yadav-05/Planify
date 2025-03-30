"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthContext } from "@/hooks/use-auth"

type User = {
  id: string
  name: string
  email: string
  image?: string
  role: "audience" | "community_admin" | "community_member"
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Login failed")
      }

      const userData = await response.json()

      // Transform MongoDB _id to id for consistency
      const user: User = {
        id: userData._id.toString(),
        name: userData.name,
        email: userData.email,
        image: userData.image,
        role: userData.role,
      }

      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/dashboard")
      return user
    } catch (error) {
      console.error("Failed to sign in:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Registration failed")
      }

      const userData = await response.json()

      // Transform MongoDB _id to id for consistency
      const user: User = {
        id: userData._id.toString(),
        name: userData.name,
        email: userData.email,
        image: userData.image,
        role: userData.role,
      }

      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/dashboard")
      return user
    } catch (error) {
      console.error("Failed to sign up:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>{children}</AuthContext.Provider>
}

