"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, ClipboardList, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

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
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    event: "",
    club: "",
    status: "pending",
    priority: "medium",
  })

  const handleCreateDialogOpen = () => setCreateDialogOpen(true)
  const handleCreateDialogClose = () => setCreateDialogOpen(false)

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "pending") return task.status === "pending"
    if (filter === "completed") return task.status === "completed"
    if (filter === "high") return task.priority === "high"
    return true
  })

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "pending" ? "completed" : "pending" } : task
      )
    )
  }

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description || !newTask.dueDate || !newTask.event || !newTask.club) {
      alert("All fields are required!")
      return
    }

    setTasks([...tasks, { ...newTask, id: `task-${tasks.length + 1}` }])
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      event: "",
      club: "",
      status: "pending",
      priority: "medium",
    })
    handleCreateDialogClose()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Your Tasks</h2>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={handleCreateDialogOpen}>
            <PlusCircle className="h-4 w-4" />
            Create Task
          </Button>
          <div className="flex gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All
            </Button>
            <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>
              Pending
            </Button>
            <Button variant={filter === "completed" ? "default" : "outline"} size="sm" onClick={() => setFilter("completed")}>
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
                  <Checkbox checked={task.status === "completed"} onCheckedChange={() => toggleTaskStatus(task.id)} />
                  <div className="flex-1">
                    <CardTitle className={task.status === "completed" ? "line-through text-muted-foreground" : ""}>
                      {task.title}
                    </CardTitle>
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
                {/* <Link href={`/tasks/${task.id}`}> */}
                <Link href={`/tasks/67e9725affeb660ab144ea29`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
            <Textarea placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
            <Input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
            <Input placeholder="Event" value={newTask.event} onChange={(e) => setNewTask({ ...newTask, event: e.target.value })} />
            <Input placeholder="Club" value={newTask.club} onChange={(e) => setNewTask({ ...newTask, club: e.target.value })} />
            <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
              <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCreateDialogClose}>Cancel</Button>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
