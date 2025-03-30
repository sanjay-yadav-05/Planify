import { NextResponse } from "next/server"
import { createTask, getTasks, getClubTasks, getUserTasks } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get("clubId")
    const userId = searchParams.get("userId")

    if (clubId) {
      const tasks = await getClubTasks(clubId)
      return NextResponse.json(tasks)
    } else if (userId) {
      const tasks = await getUserTasks(userId)
      return NextResponse.json(tasks)
    } else {
      const tasks = await getTasks()
      return NextResponse.json(tasks)
    }
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "An error occurred while fetching tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const task = await createTask({
      ...data,
      status: "pending",
      createdAt: new Date(),
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "An error occurred while creating the task" }, { status: 500 })
  }
}

