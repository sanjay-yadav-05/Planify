"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MapPin, Users } from "lucide-react"

// Mock data for featured events
const featuredEvents = [
  {
    id: "event1",
    title: "Tech Conference 2023",
    community: "Tech Enthusiasts",
    date: "2023-11-15",
    location: "San Francisco, CA",
    attendees: 120,
    tags: ["Technology", "Networking"],
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "event2",
    title: "Design Workshop",
    community: "Creative Minds",
    date: "2023-11-20",
    location: "New York, NY",
    attendees: 45,
    tags: ["Design", "Workshop"],
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "event3",
    title: "Startup Pitch Night",
    community: "Entrepreneur Hub",
    date: "2023-11-25",
    location: "Austin, TX",
    attendees: 75,
    tags: ["Startup", "Networking"],
    image: "/placeholder.svg?height=200&width=400",
  },
]

export default function FeaturedEvents() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {featuredEvents.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              className="object-cover w-full h-full transition-transform hover:scale-105"
            />
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <div className="flex gap-1">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">By {event.community}</div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
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
          <CardFooter>
            <Link href={`/events/${event.id}`} className="w-full">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

