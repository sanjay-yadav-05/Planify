"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Users, Settings, Calendar } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"

// Mock data for clubs
const mockClubs = [
  {
    id: "club1",
    name: "Web Development",
    community: "Tech Enthusiasts",
    description: "Learn and collaborate on web development projects",
    memberCount: 45,
    eventCount: 12,
    role: "lead",
  },
  {
    id: "club2",
    name: "UI/UX Design",
    community: "Creative Minds",
    description: "Explore user interface and experience design",
    memberCount: 32,
    eventCount: 8,
    role: "member",
  },
]

export default function DashboardClubs() {
  const { user } = useAuth()
  const [clubs] = useState(mockClubs)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Clubs</h2>
        <Link href="/clubs/create">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Club
          </Button>
        </Link>
      </div>

      {clubs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No clubs yet</p>
            <p className="text-muted-foreground text-center mb-4">
              {user?.role === "community_admin"
                ? "Create a club in your community"
                : "You haven't joined any clubs yet"}
            </p>
            {user?.role === "community_admin" && (
              <Link href="/clubs/create">
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
            <Card key={club.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{club.name}</CardTitle>
                  <Badge variant={club.role === "lead" ? "default" : "secondary"}>
                    {club.role === "lead" ? "Lead" : "Member"}
                  </Badge>
                </div>
                <CardDescription>Part of {club.community}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{club.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{club.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{club.eventCount} events</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/clubs/${club.id}`}>
                  <Button variant="outline">View</Button>
                </Link>
                {club.role === "lead" && (
                  <Link href={`/clubs/${club.id}/manage`}>
                    <Button variant="outline" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Manage
                    </Button>
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

