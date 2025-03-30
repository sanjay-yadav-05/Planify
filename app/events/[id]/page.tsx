"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, Share2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import EventQueries from "@/components/events/event-queries"

// Mock event data
const mockEvent = {
  id: "event1",
  title: "Web Development Workshop",
  description:
    "Join us for an interactive workshop on modern web development techniques. We'll cover the latest frameworks, tools, and best practices for building responsive and accessible web applications.",
  longDescription:
    "This workshop is designed for developers of all skill levels who want to improve their web development skills. We'll start with the basics of HTML, CSS, and JavaScript, then move on to more advanced topics like React, Next.js, and serverless functions. You'll learn how to build responsive layouts, implement accessibility features, and optimize your applications for performance. By the end of the workshop, you'll have the knowledge and skills to build modern, professional web applications.",
  date: "2023-11-15T14:00:00",
  endDate: "2023-11-15T17:00:00",
  location: "Online via Zoom",
  club: "Web Development",
  community: "Tech Enthusiasts",
  organizer: {
    id: "user1",
    name: "John Doe",
    image: "/placeholder.svg?height=40&width=40",
  },
  attendees: 28,
  maxAttendees: 50,
  isRegistered: false,
  status: "upcoming",
  tags: ["Web Development", "JavaScript", "React"],
  queries: [
    {
      id: "q1",
      user: {
        id: "user2",
        name: "Alice Smith",
        image: "/placeholder.svg?height=40&width=40",
      },
      question: "Will this workshop cover TypeScript?",
      answer: "Yes, we'll cover TypeScript basics and how to integrate it with React.",
      timestamp: "2023-10-25T10:30:00",
    },
    {
      id: "q2",
      user: {
        id: "user3",
        name: "Bob Johnson",
        image: "/placeholder.svg?height=40&width=40",
      },
      question: "Is this suitable for beginners?",
      answer: "We'll start with the fundamentals and gradually move to more advanced topics.",
      timestamp: "2023-10-26T15:45:00",
    },
  ],
}

export default function EventPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(mockEvent)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Mock API call to fetch event details
    const fetchEvent = async () => {
      try {
        // In a real app, you would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 500))
        setEvent(mockEvent)
      } catch (error) {
        console.error("Failed to fetch event:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  const handleRegister = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    try {
      // Mock API call to register for event
      await new Promise((resolve) => setTimeout(resolve, 500))

      setEvent({
        ...event,
        isRegistered: true,
        attendees: event.attendees + 1,
      })

      toast({
        title: "Registration successful",
        description: `You have registered for ${event.title}`,
      })
    } catch (error) {
      console.error("Failed to register for event:", error)
      toast({
        title: "Registration failed",
        description: "There was an error registering for this event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: `Check out this event: ${event.title}`,
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error)
          fallbackShare()
        })
    } else {
      fallbackShare()
    }
  }

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Event link has been copied to clipboard",
    })
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading event details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <p className="text-muted-foreground">
              Organized by {event.club} • {event.community}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {!event.isRegistered ? (
              <Button onClick={handleRegister}>Register Now</Button>
            ) : (
              <Button variant="outline" disabled>
                Registered
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardDescription className="text-base">{event.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="queries">Queries ({event.queries.length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="space-y-4 mt-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{event.longDescription}</p>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Organizer</h3>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={event.organizer.image} alt={event.organizer.name} />
                          <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{event.organizer.name}</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="queries" className="mt-4">
                    <EventQueries queries={event.queries} eventId={event.id} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Date</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Time</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -
                      {new Date(event.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">{event.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Attendees</div>
                    <div className="text-sm text-muted-foreground">
                      {event.attendees} / {event.maxAttendees} registered
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {!event.isRegistered ? (
                  <Button className="w-full" onClick={handleRegister}>
                    Register Now
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Registered
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

