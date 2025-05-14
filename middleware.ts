import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

// In a real app, you would use a proper secret key stored in environment variables
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

// Paths that require authentication
const protectedPaths = ["/profile", "/my-pets"]

// Paths that are accessible only to non-authenticated users
const authPaths = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value

  // Check if user is authenticated
  const isAuthenticated = token ? await verifyToken(token) : false

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authPaths.some((authPath) => path.startsWith(authPath))) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Redirect unauthenticated users away from protected pages
  if (!isAuthenticated && protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

async function verifyToken(token: string) {
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch (error) {
    return false
  }
}

export const config = {
  matcher: ["/profile/:path*", "/my-pets/:path*", "/login", "/register"],
}
