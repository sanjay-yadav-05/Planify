"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Calendar, Users, ClipboardList, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "event",
    title: "New Event: Web Development Workshop",
    message: "A new event has been scheduled for next week",
    date: "2023-11-10T10:00:00",
    read: false,
  },
  {
    id: "2",
    type: "task",
    title: "Task Assigned: Prepare Presentation",
    message: "You have been assigned a new task",
    date: "2023-11-09T14:30:00",
    read: true,
  },
  {
    id: "3",
    type: "community",
    title: "New Member Joined",
    message: "Alice Smith has joined Tech Enthusiasts community",
    date: "2023-11-08T09:15:00",
    read: true,
  },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4" />
      case "task":
        return <ClipboardList className="h-4 w-4" />
      case "community":
        return <Users className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  if (!user) return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>}
          <span className="sr-only">Notifications</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Notifications</SheetTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No notifications</p>
              <p className="text-muted-foreground">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
                <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
                  <div className="flex gap-2">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <CardTitle className="text-base">{notification.title}</CardTitle>
                  </div>
                  {!notification.read && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => markAsRead(notification.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(notification.date).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

