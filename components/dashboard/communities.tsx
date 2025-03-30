"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Users, Settings, Copy } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

// Mock data for communities
const mockCommunities = [
  {
    id: "comm1",
    name: "Tech Enthusiasts",
    description: "A community for tech lovers and innovators",
    memberCount: 120,
    role: "admin",
    inviteCode: "TECH123",
  },
  {
    id: "comm2",
    name: "Creative Minds",
    description: "For designers, artists, and creative professionals",
    memberCount: 85,
    role: "member",
    inviteCode: "CREATE456",
  },
]

export default function DashboardCommunities() {
  const { user } = useAuth()
  const [communities] = useState(mockCommunities)

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Invite code copied",
      description: "The invite code has been copied to your clipboard.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Communities</h2>
        <Link href="/communities/create">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Community
          </Button>
        </Link>
      </div>

      {communities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No communities yet</p>
            <p className="text-muted-foreground text-center mb-4">
              Create a community or join one using an invite code
            </p>
            <div className="flex gap-4">
              <Link href="/communities/create">
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Community
                </Button>
              </Link>
              <Link href="/communities/join">
                <Button variant="outline">Join Community</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <Card key={community.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{community.name}</CardTitle>
                  <Badge variant={community.role === "admin" ? "default" : "secondary"}>
                    {community.role === "admin" ? "Admin" : "Member"}
                  </Badge>
                </div>
                <CardDescription>{community.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{community.memberCount} members</span>
                </div>
                {community.role === "admin" && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="text-sm font-medium">Invite Code:</div>
                    <code className="bg-muted px-2 py-1 rounded text-sm">{community.inviteCode}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyInviteCode(community.inviteCode)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/communities/${community.id}`}>
                  <Button variant="outline">View</Button>
                </Link>
                {community.role === "admin" && (
                  <Link href={`/communities/${community.id}/settings`}>
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

