import { NextResponse } from "next/server"
import { getCommunityById, updateCommunity, deleteCommunity } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const community = await getCommunityById(params.id)

    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 })
    }

    return NextResponse.json(community)
  } catch (error) {
    console.error("Error fetching community:", error)
    return NextResponse.json({ error: "An error occurred while fetching the community" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const community = await updateCommunity(params.id, data)

    return NextResponse.json(community)
  } catch (error) {
    console.error("Error updating community:", error)
    return NextResponse.json({ error: "An error occurred while updating the community" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteCommunity(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting community:", error)
    return NextResponse.json({ error: "An error occurred while deleting the community" }, { status: 500 })
  }
}

