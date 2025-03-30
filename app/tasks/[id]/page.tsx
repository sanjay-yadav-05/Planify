"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function TaskDetailPage() {
  const { id } = useParams()
  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch task")
        }

        const data = await response.json()
        setTask(data)
      } catch (error) {
        console.error("Error fetching task:", error)
        toast({
          title: "Error",
          description: "Failed to load task details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [id, user, router])

  const toggleTaskStatus = async () => {
    try {
      const newStatus = task.status === "pending" ? "completed" : "pending"

      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      const updatedTask = await response.json()
      setTask(updatedTask)

      toast({
        title: newStatus === "completed" ? "Task completed" : "Task reopened",
        description: newStatus === "completed" ? "The task has been marked as completed" : "The task has been reopened",
      })
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading task details...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
          <p className="mb-6">The task you're looking for doesn't exist or you don't have access to it.</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-2">
              <Checkbox
                id={`task-${task._id}`}
                checked={task.status === "completed"}
                onCheckedChange={toggleTaskStatus}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <CardTitle
                    className={`text-2xl ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge
                      variant={
                        task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                      }
                    >
                      {task.priority}
                    </Badge>
                    <Badge variant={task.status === "completed" ? "outline" : "secondary"}>{task.status}</Badge>
                  </div>
                </div>
                <CardDescription>
                  {task.club?.name} • {task.event?.name}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <p>{task.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Assigned to: {task.assignee?.name}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Back to Tasks
            </Button>
            <Button onClick={toggleTaskStatus}>
              {task.status === "completed" ? "Mark as Pending" : "Mark as Completed"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

