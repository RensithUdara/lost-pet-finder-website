import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/user-service"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    const requiredFields = ["name", "email", "password"]

    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (userData.password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    const user = await createUser(userData)

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: any) {
    console.error("Error registering user:", error)

    if (error.message === "User with this email already exists") {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
