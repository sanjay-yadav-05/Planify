"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function CreateTaskPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState("medium")
  const [clubId, setClubId] = useState("")
  const [eventId, setEventId] = useState("")
  const [assigneeId, setAssigneeId] = useState("")
  const [clubs, setClubs] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Get clubId from URL if provided
    const urlClubId = searchParams.get("clubId")
    if (urlClubId) {
      setClubId(urlClubId)
    }

    // Fetch clubs where user is a lead
    const fetchData = async () => {
      try {
        // Fetch clubs
        const clubsResponse = await fetch(`/api/clubs?userId=${user.id}`)
        if (!clubsResponse.ok) {
          throw new Error("Failed to fetch clubs")
        }

        const clubsData = await clubsResponse.json()
        // Filter clubs where user is a lead
        const leadClubs = clubsData.filter((club: any) => {
          const member = club.members.find((m: any) => m.userId === user.id)
          return member && member.role === "lead"
        })

        setClubs(leadClubs)

        // If we have a clubId, fetch events and members for that club
        if (urlClubId) {
          // Fetch events
          const eventsResponse = await fetch(`/api/events?clubId=${urlClubId}`)
          if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json()
            setEvents(eventsData)
          }

          // Fetch club details to get members
          const clubResponse = await fetch(`/api/clubs/${urlClubId}`)
          if (clubResponse.ok) {
            const clubData = await clubResponse.json()
            setMembers(clubData.members || [])
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        })
      } finally {
        setFetchingData(false)
      }
    }

    fetchData()
  }, [user, router, searchParams])

  // When club changes, fetch events and members
  const handleClubChange = async (value: string) => {
    setClubId(value)
    setEventId("")
    setAssigneeId("")

    if (!value) return

    try {
      setFetchingData(true)

      // Fetch events
      const eventsResponse = await fetch(`/api/events?clubId=${value}`)
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        setEvents(eventsData)
      }

      // Fetch club details to get members
      const clubResponse = await fetch(`/api/clubs/${value}`)
      if (clubResponse.ok) {
        const clubData = await clubResponse.json()
        setMembers(clubData.members || [])
      }
    } catch (error) {
      console.error("Error fetching club data:", error)
      toast({
        title: "Error",
        description: "Failed to load club data",
        variant: "destructive",
      })
    } finally {
      setFetchingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          dueDate,
          priority,
          clubId,
          eventId: eventId || null,
          assigneeId,
          creatorId: user?.id,
          status: "pending",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      const task = await response.json()

      toast({
        title: "Task created",
        description: `${title} has been created successfully.`,
      })

      router.push(`/tasks/${task._id}`)
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetchingData) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (clubs.length === 0) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create a Task</h1>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-medium mb-2">You need to be a club lead to create a task</p>
              <p className="text-muted-foreground text-center mb-6">
                You must first create a club or be promoted to lead in an existing club.
              </p>
              <Link href="/clubs/create">
                <Button>Create a Club</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a Task</h1>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Fill in the information below to create your task</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="club">Club</Label>
                <Select value={clubId} onValueChange={handleClubChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a club" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubs.map((club) => (
                      <SelectItem key={club._id} value={club._id}>
                        {club.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event">Related Event (Optional)</Label>
                <Select value={eventId} onValueChange={setEventId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event._id} value={event._id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the task"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select value={assigneeId} onValueChange={setAssigneeId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.userId} value={member.userId}>
                        {member.name || member.userId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !clubId || !title || !description || !dueDate || !assigneeId}>
                {loading ? "Creating..." : "Create Task"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

