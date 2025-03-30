import { NextResponse } from "next/server"
import { createCommunity, getCommunities, getUserCommunities } from "@/lib/db"
import { generateInviteCode } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      const communities = await getUserCommunities(userId)
      return NextResponse.json(communities)
    } else {
      const communities = await getCommunities()
      return NextResponse.json(communities)
    }
  } catch (error) {
    console.error("Error fetching communities:", error)
    return NextResponse.json({ error: "An error occurred while fetching communities" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const inviteCode = generateInviteCode()

    const community = await createCommunity({
      ...data,
      inviteCode,
      members: [{ userId: data.adminId, role: "admin", joinedAt: new Date() }],
      createdAt: new Date(),
    })

    return NextResponse.json(community)
  } catch (error) {
    console.error("Error creating community:", error)
    return NextResponse.json({ error: "An error occurred while creating the community" }, { status: 500 })
  }
}

