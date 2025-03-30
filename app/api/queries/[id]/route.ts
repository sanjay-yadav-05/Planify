import { NextResponse } from "next/server"
import { updateQuery } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const query = await updateQuery(params.id, {
      ...data,
      answeredAt: data.answer ? new Date() : null,
    })

    return NextResponse.json(query)
  } catch (error) {
    console.error("Error updating query:", error)
    return NextResponse.json({ error: "An error occurred while updating the query" }, { status: 500 })
  }
}

