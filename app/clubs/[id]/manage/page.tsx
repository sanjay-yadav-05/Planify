"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { PlusCircle, Users, Calendar, ClipboardList, Wand2 } from "lucide-react"
import Link from "next/link"
import ClubMembers from "@/components/clubs/club-members"
import ClubEvents from "@/components/clubs/club-events"
import ClubTasks from "@/components/clubs/club-tasks"
import AITools from "@/components/clubs/ai-tools"

// Mock club data
const mockClub = {
  id: "club1",
  name: "Web Development",
  community: "Tech Enthusiasts",
  description: "Learn and collaborate on web development projects",
  memberCount: 45,
  eventCount: 12,
  role: "lead",
}

export default function ManageClubPage() {
  const { id } = useParams()
  const [club, setClub] = useState(mockClub)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Mock API call to fetch club details
    const fetchClub = async () => {
      try {
        // In a real app, you would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 500))
        setClub(mockClub)
      } catch (error) {
        console.error("Failed to fetch club:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClub()
  }, [id])

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading club details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Club: {club.name}</h1>
          <p className="text-muted-foreground">
            Part of {club.community} • {club.memberCount} members
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/clubs/${id}/events/create`}>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="ai-tools" className="gap-2">
            <Wand2 className="h-4 w-4" />
            AI Tools
          </TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <ClubMembers clubId={id as string} />
        </TabsContent>
        <TabsContent value="events">
          <ClubEvents clubId={id as string} />
        </TabsContent>
        <TabsContent value="tasks">
          <ClubTasks clubId={id as string} />
        </TabsContent>
        <TabsContent value="ai-tools">
          <AITools clubId={id as string} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

