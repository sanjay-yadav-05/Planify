"use client"

import { useAuth } from "@/hooks/use-auth"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Users, Calendar, ClipboardList } from "lucide-react"
import DashboardCommunities from "@/components/dashboard/communities"
import DashboardClubs from "@/components/dashboard/clubs"
import DashboardEvents from "@/components/dashboard/events"
import DashboardTasks from "@/components/dashboard/tasks"

export default function DashboardPage() {
  const { user, loading } = useAuth()

  // If not logged in, redirect to login page
  if (!loading && !user) {
    redirect("/login")
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Manage your communities, clubs, and events.
          </p>
        </div>
        <div className="flex gap-2">
          {user?.role === "audience" && (
            <Link href="/communities/create">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Community
              </Button>
            </Link>
          )}
          {user?.role === "community_admin" && (
            <Link href="/clubs/create">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Club
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Tabs defaultValue="communities" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="communities" className="gap-2">
            <Users className="h-4 w-4" />
            Communities
          </TabsTrigger>
          <TabsTrigger value="clubs" className="gap-2">
            <Users className="h-4 w-4" />
            Clubs
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
        <TabsContent value="communities" className="space-y-4">
          <DashboardCommunities />
        </TabsContent>
        <TabsContent value="clubs" className="space-y-4">
          <DashboardClubs />
        </TabsContent>
        <TabsContent value="events" className="space-y-4">
          <DashboardEvents />
        </TabsContent>
        <TabsContent value="tasks" className="space-y-4">
          <DashboardTasks />
        </TabsContent>
      </Tabs>
    </div>
  )
}

