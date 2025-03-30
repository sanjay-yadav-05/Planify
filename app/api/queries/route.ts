import { NextResponse } from "next/server"
import { createQuery, getEventQueries } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    const queries = await getEventQueries(eventId)
    return NextResponse.json(queries)
  } catch (error) {
    console.error("Error fetching queries:", error)
    return NextResponse.json({ error: "An error occurred while fetching queries" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const query = await createQuery({
      ...data,
      createdAt: new Date(),
    })

    return NextResponse.json(query)
  } catch (error) {
    console.error("Error creating query:", error)
    return NextResponse.json({ error: "An error occurred while creating the query" }, { status: 500 })
  }
}

