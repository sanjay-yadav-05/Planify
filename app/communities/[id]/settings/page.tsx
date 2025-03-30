"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import { Copy, ArrowLeft } from "lucide-react"

export default function CommunitySettingsPage() {
  const { id } = useParams()
  const [community, setCommunity] = useState<any>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
        setName(data.name || "")
        setDescription(data.description || "")
        setInviteCode(data.inviteCode || "")

        // Check if user is admin
        const member = data.members.find((m: any) => m.userId === user.id)
        if (!member || member.role !== "admin") {
          toast({
            title: "Access denied",
            description: "You don't have permission to manage this community",
            variant: "destructive",
          })
          router.push(`/communities/${id}`)
        }
      } catch (error) {
        console.error("Error fetching community:", error)
        toast({
          title: "Error",
          description: "Failed to load community details",
          variant: "destructive",
        })
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchCommunity()
  }, [id, user, router])

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/communities/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update community")
      }

      const updatedCommunity = await response.json()
      setCommunity(updatedCommunity)

      toast({
        title: "Community updated",
        description: "Community settings have been updated successfully",
      })
    } catch (error) {
      console.error("Error updating community:", error)
      toast({
        title: "Error",
        description: "Failed to update community settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const regenerateInviteCode = async () => {
    try {
      const response = await fetch(`/api/communities/${id}/regenerate-invite`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to regenerate invite code")
      }

      const data = await response.json()
      setInviteCode(data.inviteCode)
      setCommunity({ ...community, inviteCode: data.inviteCode })

      toast({
        title: "Invite code regenerated",
        description: "A new invite code has been generated",
      })
    } catch (error) {
      console.error("Error regenerating invite code:", error)
      toast({
        title: "Error",
        description: "Failed to regenerate invite code",
        variant: "destructive",
      })
    }
  }

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode)
    toast({
      title: "Invite code copied",
      description: "The invite code has been copied to your clipboard",
    })
  }

  const deleteCommunity = async () => {
    if (!confirm("Are you sure you want to delete this community? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/communities/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete community")
      }

      toast({
        title: "Community deleted",
        description: "The community has been deleted successfully",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error deleting community:", error)
      toast({
        title: "Error",
        description: "Failed to delete community",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading community settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="gap-2 mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Community Settings</h1>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="invite">Invite Code</TabsTrigger>
            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <form onSubmit={handleSaveGeneral}>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Update your community's basic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Community Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="invite">
            <Card>
              <CardHeader>
                <CardTitle>Invite Code</CardTitle>
                <CardDescription>Manage your community's invite code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Invite Code</Label>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm flex-1">{inviteCode}</code>
                    <Button variant="outline" size="sm" onClick={copyInviteCode}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Share this code with people you want to invite to your community
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={regenerateInviteCode}>
                  Regenerate Invite Code
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="danger">
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Actions here can't be undone. Be careful.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-destructive rounded-md p-4">
                  <h3 className="font-medium mb-2">Delete this community</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete a community, there is no going back. All clubs, events, and data will be permanently
                    deleted.
                  </p>
                  <Button variant="destructive" onClick={deleteCommunity}>
                    Delete Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

