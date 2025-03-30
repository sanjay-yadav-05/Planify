import { NextResponse } from "next/server"
import { getCommunityByInviteCode, addMemberToCommunity } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { inviteCode, userId } = await request.json()

    // Find community by invite code
    const community = await getCommunityByInviteCode(inviteCode)
    if (!community) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 400 })
    }

    // Check if user is already a member
    const isMember = community.members.some((member: any) => member.userId === userId)
    if (isMember) {
      return NextResponse.json({ error: "You are already a member of this community" }, { status: 400 })
    }

    // Add user to community
    await addMemberToCommunity(community._id.toString(), {
      userId,
      role: "member",
      joinedAt: new Date(),
    })

    return NextResponse.json({ success: true, communityId: community._id })
  } catch (error) {
    console.error("Error joining community:", error)
    return NextResponse.json({ error: "An error occurred while joining the community" }, { status: 500 })
  }
}

