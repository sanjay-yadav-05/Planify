"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Calendar, MapPin, Users, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"

// Mock data for events
const mockEvents = [
  {
    id: "event1",
    title: "Web Development Workshop",
    club: "Web Development",
    community: "Tech Enthusiasts",
    date: "2023-11-15T14:00:00",
    location: "Online",
    attendees: 28,
    status: "upcoming",
    isOrganizer: true,
  },
  {
    id: "event2",
    title: "UI/UX Design Principles",
    club: "UI/UX Design",
    community: "Creative Minds",
    date: "2023-11-20T10:00:00",
    location: "Community Center",
    attendees: 15,
    status: "upcoming",
    isOrganizer: false,
  },
  {
    id: "event3",
    title: "JavaScript Fundamentals",
    club: "Web Development",
    community: "Tech Enthusiasts",
    date: "2023-10-25T15:00:00",
    location: "Online",
    attendees: 32,
    status: "past",
    isOrganizer: true,
  },
]

export default function DashboardEvents() {
  const { user } = useAuth()
  const [events] = useState(mockEvents)
  const [filter, setFilter] = useState("all")

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true
    if (filter === "upcoming") return event.status === "upcoming"
    if (filter === "past") return event.status === "past"
    if (filter === "organizing") return event.isOrganizer
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Your Events</h2>
        <div className="flex gap-2">
          <Link href="/events/create">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All
            </Button>
            <Button
              variant={filter === "upcoming" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </Button>
            <Button variant={filter === "past" ? "default" : "outline"} size="sm" onClick={() => setFilter("past")}>
              Past
            </Button>
            <Button
              variant={filter === "organizing" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("organizing")}
            >
              Organizing
            </Button>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No events found</p>
            <p className="text-muted-foreground text-center mb-4">
              {filter !== "all"
                ? `You don't have any ${filter} events`
                : "You haven't created or joined any events yet"}
            </p>
            {user?.role === "community_admin" && (
              <Link href="/events/create">
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Event
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className={event.status === "past" ? "opacity-70" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                    {event.status === "upcoming" ? "Upcoming" : "Past"}
                  </Badge>
                </div>
                <CardDescription>
                  {event.club} • {event.community}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/events/${event.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
                {event.isOrganizer && event.status === "upcoming" && (
                  <Link href={`/events/${event.id}/manage`}>
                    <Button>Manage</Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

