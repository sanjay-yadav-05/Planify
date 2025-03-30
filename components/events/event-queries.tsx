"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import { MessageSquare } from "lucide-react"

type Query = {
  id: string
  user: {
    id: string
    name: string
    image?: string
  }
  question: string
  answer?: string
  timestamp: string
}

interface EventQueriesProps {
  queries: Query[]
  eventId: string
}

export default function EventQueries({ queries: initialQueries, eventId }: EventQueriesProps) {
  const [queries, setQueries] = useState<Query[]>(initialQueries)
  const [newQuery, setNewQuery] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to submit a query",
        variant: "destructive",
      })
      return
    }

    if (!newQuery.trim()) return

    setSubmitting(true)

    try {
      // API call to submit query
      const response = await fetch("/api/queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          userId: user.id,
          userName: user.name,
          userImage: user.image,
          question: newQuery,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit query")
      }

      const data = await response.json()

      const query: Query = {
        id: data._id,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        question: newQuery,
        timestamp: new Date().toISOString(),
      }

      setQueries([...queries, query])
      setNewQuery("")

      toast({
        title: "Query submitted",
        description: "Your query has been submitted to the organizer",
      })
    } catch (error) {
      console.error("Failed to submit query:", error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting your query. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmitQuery} className="space-y-4">
        <Textarea
          placeholder="Ask a question about this event..."
          value={newQuery}
          onChange={(e) => setNewQuery(e.target.value)}
          rows={3}
        />
        <Button type="submit" disabled={submitting || !newQuery.trim()}>
          {submitting ? "Submitting..." : "Submit Question"}
        </Button>
      </form>

      <div className="space-y-6">
        {queries.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No questions yet</p>
            <p className="text-muted-foreground">Be the first to ask a question about this event</p>
          </div>
        ) : (
          queries.map((query) => (
            <div key={query.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={query.user.image} alt={query.user.name} />
                  <AvatarFallback>{query.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{query.user.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(query.timestamp).toLocaleDateString()}</p>
                  </div>
                  <p className="mt-1">{query.question}</p>
                </div>
              </div>

              {query.answer && (
                <div className="ml-11 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-1">Response from organizer:</p>
                  <p className="text-sm">{query.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

