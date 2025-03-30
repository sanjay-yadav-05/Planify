"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function CreateClubPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [communityId, setCommunityId] = useState("")
  const [communities, setCommunities] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingCommunities, setFetchingCommunities] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      router.push("/login")
      return
    }

    // Get communityId from URL if provided
    const urlCommunityId = searchParams.get("communityId")
    if (urlCommunityId) {
      setCommunityId(urlCommunityId)
    }

    // Fetch communities where user is an admin
    const fetchCommunities = async () => {
      try {
        const response = await fetch(`/api/communities?userId=${user.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch communities")
        }

        const data = await response.json()
        // Filter communities where user is an admin
        const adminCommunities = data.filter((community: any) => {
          const member = community.members.find((m: any) => m.userId === user.id)
          return member && member.role === "admin"
        })

        setCommunities(adminCommunities)
      } catch (error) {
        console.error("Error fetching communities:", error)
        toast({
          title: "Error",
          description: "Failed to load communities",
          variant: "destructive",
        })
      } finally {
        setFetchingCommunities(false)
      }
    }

    fetchCommunities()
  }, [user, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/clubs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          communityId,
          leadId: user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create club")
      }

      const club = await response.json()

      toast({
        title: "Club created",
        description: `${name} has been created successfully.`,
      })

      router.push(`/clubs/${club._id}`)
    } catch (error) {
      console.error("Error creating club:", error)
      toast({
        title: "Error",
        description: "Failed to create club. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetchingCommunities) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (communities.length === 0) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create a Club</h1>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-medium mb-2">You need to be a community admin to create a club</p>
              <p className="text-muted-foreground text-center mb-6">
                You must first create a community or be promoted to admin in an existing community.
              </p>
              <Link href="/communities/create">
                <Button>Create a Community</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a Club</h1>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Club Details</CardTitle>
              <CardDescription>Fill in the information below to create your club</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="community">Community</Label>
                <Select value={communityId} onValueChange={setCommunityId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a community" />
                  </SelectTrigger>
                  <SelectContent>
                    {communities.map((community) => (
                      <SelectItem key={community._id} value={community._id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Club Name</Label>
                <Input
                  id="name"
                  placeholder="Enter club name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your club"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !communityId || !name || !description}>
                {loading ? "Creating..." : "Create Club"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

