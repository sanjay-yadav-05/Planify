"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { Users, Calendar, Settings, Copy } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import CommunityClubs from "@/components/communities/community-clubs"
import CommunityMembers from "@/components/communities/community-members"
import CommunityEvents from "@/components/communities/community-events"

export default function CommunityPage() {
  const { id } = useParams()
  const [community, setCommunity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchCommunity = async () => {
      try {
        const response = await fetch(`/api/communities/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch community")
        }

        const data = await response.json()
        setCommunity(data)

        // Determine user's role in this community
        const member = data.members.find((m: any) => m.userId === user.id)
        setUserRole(member ? member.role : null)
      } catch (error) {
        console.error("Error fetching community:", error)
        toast({
          title: "Error",
          description: "Failed to load community details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCommunity()
  }, [id, user, router])

  const copyInviteCode = () => {
    if (community?.inviteCode) {
      navigator.clipboard.writeText(community.inviteCode)
      toast({
        title: "Invite code copied",
        description: "The invite code has been copied to your clipboard.",
      })
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading community details...</p>
        </div>
      </div>
    )
  }

  if (!community) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Community Not Found</h1>
          <p className="mb-6">The community you're looking for doesn't exist or you don't have access to it.</p>
          <Link href="/communities">
            <Button>Browse Communities</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isAdmin = userRole === "admin"

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{community.name}</h1>
          <p className="text-muted-foreground">{community.description}</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <Button variant="outline" className="gap-2" onClick={copyInviteCode}>
                <Copy className="h-4 w-4" />
                Copy Invite Code
              </Button>
              <Link href={`/communities/${id}/settings`}>
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Community Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Members</div>
                  <div className="text-sm text-muted-foreground">{community.members?.length || 0} members</div>
                </div>
              </div>

              {isAdmin && (
                <div className="pt-2">
                  <div className="font-medium mb-1">Invite Code:</div>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm flex-1">{community.inviteCode}</code>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyInviteCode}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            {isAdmin && (
              <CardFooter>
                <Link href={`/clubs/create?communityId=${id}`} className="w-full">
                  <Button className="w-full">Create Club</Button>
                </Link>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="clubs" className="space-y-4">
            <TabsList className="grid grid-cols-3 gap-2">
              <TabsTrigger value="clubs" className="gap-2">
                <Users className="h-4 w-4" />
                Clubs
              </TabsTrigger>
              <TabsTrigger value="members" className="gap-2">
                <Users className="h-4 w-4" />
                Members
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2">
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
            </TabsList>
            <TabsContent value="clubs">
              <CommunityClubs communityId={id as string} isAdmin={isAdmin} />
            </TabsContent>
            <TabsContent value="members">
              <CommunityMembers communityId={id as string} isAdmin={isAdmin} members={community.members} />
            </TabsContent>
            <TabsContent value="events">
              <CommunityEvents communityId={id as string} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

