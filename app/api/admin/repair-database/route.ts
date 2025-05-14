import { NextResponse } from "next/server"
import { repairDatabase } from "@/lib/pet-service"

export async function POST() {
  try {
    await repairDatabase()
    return NextResponse.json({ success: true, message: "Database repair completed" })
  } catch (error) {
    console.error("Error repairing database:", error)
    return NextResponse.json({ success: false, error: "Failed to repair database" }, { status: 500 })
  }
}
