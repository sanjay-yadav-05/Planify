"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Search, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch("/api/communities")
        if (!response.ok) {
          throw new Error("Failed to fetch communities")
        }

        const data = await response.json()
        setCommunities(data)
      } catch (error) {
        console.error("Error fetching communities:", error)
        toast({
          title: "Error",
          description: "Failed to load communities",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCommunities()
  }, [])

  const filteredCommunities = communities.filter(
    (community) =>
      community.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading communities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communities</h1>
          <p className="text-muted-foreground">Discover and join communities</p>
        </div>
        <div className="flex gap-2">
          <Link href="/communities/join">
            <Button variant="outline">Join Community</Button>
          </Link>
          <Link href="/communities/create">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Community
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search communities..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredCommunities.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No communities found</h2>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? "No communities match your search criteria" : "There are no communities yet"}
          </p>
          <Link href="/communities/create">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Community
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCommunities.map((community) => (
            <Card key={community._id}>
              <CardHeader>
                <CardTitle>{community.name}</CardTitle>
                <CardDescription>{community.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{community.members?.length || 0} members</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/communities/${community._id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Community
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

