"use client"

// This is a simplified version for the example
import { useState } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts((prev) => [...prev, props])
    // In a real implementation, we would also handle removing toasts after a timeout
    console.log("Toast:", props.title, props.description)
  }

  return { toast, toasts }
}

export const toast = (props: ToastProps) => {
  // This is a simplified version that just logs to console
  console.log("Toast:", props.title, props.description)
}

