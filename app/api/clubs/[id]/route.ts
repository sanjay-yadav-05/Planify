import { NextResponse } from "next/server"
import { getClubById, updateClub } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const club = await getClubById(params.id)

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    return NextResponse.json(club)
  } catch (error) {
    console.error("Error fetching club:", error)
    return NextResponse.json({ error: "An error occurred while fetching the club" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const club = await updateClub(params.id, data)

    return NextResponse.json(club)
  } catch (error) {
    console.error("Error updating club:", error)
    return NextResponse.json({ error: "An error occurred while updating the club" }, { status: 500 })
  }
}

