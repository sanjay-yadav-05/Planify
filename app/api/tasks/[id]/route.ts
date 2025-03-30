import { NextResponse } from "next/server"
import { getTaskById, updateTask } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const task = await getTaskById(params.id)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ error: "An error occurred while fetching the task" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const task = await updateTask(params.id, data)

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "An error occurred while updating the task" }, { status: 500 })
  }
}

