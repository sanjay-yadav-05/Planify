import { NextResponse } from "next/server"
import { getCommunityById, updateCommunity } from "@/lib/db"
import { generateInviteCode } from "@/lib/utils"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const community = await getCommunityById(params.id)

    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 })
    }

    const newInviteCode = generateInviteCode()

    await updateCommunity(params.id, {
      ...community,
      inviteCode: newInviteCode,
    })

    return NextResponse.json({ inviteCode: newInviteCode })
  } catch (error) {
    console.error("Error regenerating invite code:", error)
    return NextResponse.json({ error: "An error occurred while regenerating the invite code" }, { status: 500 })
  }
}

