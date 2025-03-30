import { NextResponse } from "next/server"
import { createClub, getClubs, getCommunityClubs, getUserClubs } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const communityId = searchParams.get("communityId")
    const userId = searchParams.get("userId")

    if (communityId) {
      const clubs = await getCommunityClubs(communityId)
      return NextResponse.json(clubs)
    } else if (userId) {
      const clubs = await getUserClubs(userId)
      return NextResponse.json(clubs)
    } else {
      const clubs = await getClubs()
      return NextResponse.json(clubs)
    }
  } catch (error) {
    console.error("Error fetching clubs:", error)
    return NextResponse.json({ error: "An error occurred while fetching clubs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const club = await createClub({
      ...data,
      members: [{ userId: data.leadId, role: "lead", joinedAt: new Date() }],
      createdAt: new Date(),
    })

    return NextResponse.json(club)
  } catch (error) {
    console.error("Error creating club:", error)
    return NextResponse.json({ error: "An error occurred while creating the club" }, { status: 500 })
  }
}

