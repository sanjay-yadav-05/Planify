"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

interface CommunityClubsProps {
  communityId: string
  isAdmin: boolean
}

export default function CommunityClubs({ communityId, isAdmin }: CommunityClubsProps) {
  const [clubs, setClubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(`/api/clubs?communityId=${communityId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch clubs")
        }

        const data = await response.json()
        setClubs(data)
      } catch (error) {
        console.error("Error fetching clubs:", error)
        toast({
          title: "Error",
          description: "Failed to load clubs",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClubs()
  }, [communityId])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2">Loading clubs...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Clubs</h2>
        {isAdmin && (
          <Link href={`/clubs/create?communityId=${communityId}`}>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Club
            </Button>
          </Link>
        )}
      </div>

      {clubs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No clubs yet</p>
            <p className="text-muted-foreground text-center mb-4">
              {isAdmin ? "Create a club to organize events and activities" : "There are no clubs in this community yet"}
            </p>
            {isAdmin && (
              <Link href={`/clubs/create?communityId=${communityId}`}>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Club
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <Card key={club._id}>
              <CardHeader>
                <CardTitle>{club.name}</CardTitle>
                <CardDescription>{club.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{club.members?.length || 0} members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{club.eventCount || 0} events</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/clubs/${club._id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Club
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

