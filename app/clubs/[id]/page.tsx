"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { Users, Calendar, ClipboardList, Settings } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import ClubMembers from "@/components/clubs/club-members"
import ClubEvents from "@/components/clubs/club-events"
import ClubTasks from "@/components/clubs/club-tasks"

export default function ClubPage() {
  const { id } = useParams()
  const [club, setClub] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchClub = async () => {
      try {
        const response = await fetch(`/api/clubs/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch club")
        }

        const data = await response.json()
        setClub(data)

        // Determine user's role in this club
        const member = data.members.find((m: any) => m.userId === user.id)
        setUserRole(member ? member.role : null)
      } catch (error) {
        console.error("Error fetching club:", error)
        toast({
          title: "Error",
          description: "Failed to load club details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClub()
  }, [id, user, router])

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

  if (!club) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Club Not Found</h1>
          <p className="mb-6">The club you're looking for doesn't exist or you don't have access to it.</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isLead = userRole === "lead"

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{club.name}</h1>
          <p className="text-muted-foreground">{club.description}</p>
        </div>
        <div className="flex gap-2">
          {isLead && (
            <Link href={`/clubs/${id}/manage`}>
              <Button className="gap-2">
                <Settings className="h-4 w-4" />
                Manage Club
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid grid-cols-3 gap-2">
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
        </TabsList>
        <TabsContent value="members">
          <ClubMembers clubId={id as string} isLead={isLead} />
        </TabsContent>
        <TabsContent value="events">
          <ClubEvents clubId={id as string} isLead={isLead} />
        </TabsContent>
        <TabsContent value="tasks">
          <ClubTasks clubId={id as string} isLead={isLead} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

