"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, ClipboardList, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"

// Mock data for tasks
const mockTasks = [
  {
    id: "task1",
    title: "Prepare presentation slides",
    description: "Create slides for the upcoming workshop",
    dueDate: "2023-11-10",
    event: "Web Development Workshop",
    club: "Web Development",
    status: "pending",
    priority: "high",
  },
  {
    id: "task2",
    title: "Design event poster",
    description: "Create a promotional poster for social media",
    dueDate: "2023-11-05",
    event: "UI/UX Design Principles",
    club: "UI/UX Design",
    status: "completed",
    priority: "medium",
  },
  {
    id: "task3",
    title: "Coordinate with speakers",
    description: "Confirm availability and requirements with guest speakers",
    dueDate: "2023-11-08",
    event: "Web Development Workshop",
    club: "Web Development",
    status: "pending",
    priority: "high",
  },
]

export default function DashboardTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState(mockTasks)
  const [filter, setFilter] = useState("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "pending") return task.status === "pending"
    if (filter === "completed") return task.status === "completed"
    if (filter === "high") return task.priority === "high"
    return true
  })

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: task.status === "pending" ? "completed" : "pending",
          }
        }
        return task
      }),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Your Tasks</h2>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            Create Task
          </Button>
          <div className="flex gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
            <Button variant={filter === "high" ? "default" : "outline"} size="sm" onClick={() => setFilter("high")}>
              High Priority
            </Button>
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No tasks found</p>
            <p className="text-muted-foreground text-center mb-4">
              {filter !== "all" ? `You don't have any ${filter} tasks` : "You haven't been assigned any tasks yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className={task.status === "completed" ? "opacity-70" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.status === "completed"}
                    onCheckedChange={() => toggleTaskStatus(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <CardTitle
                        className={`text-lg ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : task.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {task.priority}
                        </Badge>
                        <Badge variant={task.status === "completed" ? "outline" : "secondary"}>{task.status}</Badge>
                      </div>
                    </div>
                    <CardDescription>
                      {task.club} • {task.event}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{task.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/tasks/${task.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

