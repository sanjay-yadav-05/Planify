import { NextResponse } from "next/server"
import { createEvent, getEvents, getClubEvents, getUserEvents } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get("clubId")
    const userId = searchParams.get("userId")

    if (clubId) {
      const events = await getClubEvents(clubId)
      return NextResponse.json(events)
    } else if (userId) {
      const events = await getUserEvents(userId)
      return NextResponse.json(events)
    } else {
      const events = await getEvents()
      return NextResponse.json(events)
    }
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "An error occurred while fetching events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const event = await createEvent({
      ...data,
      attendees: [],
      createdAt: new Date(),
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "An error occurred while creating the event" }, { status: 500 })
  }
}

