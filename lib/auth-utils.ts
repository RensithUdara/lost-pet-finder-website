import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { getUserById } from "./user-service"

// In a real app, you would use a proper secret key stored in environment variables
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export async function getUserFromRequest(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return null
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as string

    if (!userId) {
      return null
    }

    // Get user from database
    const user = await getUserById(userId)

    return user
  } catch (error) {
    console.error("Error getting user from request:", error)
    return null
  }
}
