"use client"

import { useContext } from "react"
import { createContext } from "react"

// This is a re-export to avoid circular dependencies
// The actual context is defined in auth-provider.tsx
export const AuthContext = createContext<any>({})

export function useAuth() {
  return useContext(AuthContext)
}

