import { redirect } from "next/navigation"
import { getUserFromRequest } from "@/lib/auth-utils"
import { cookies } from "next/headers"
import { getUserPets } from "@/lib/pet-service"
import UserProfile from "@/components/user-profile"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Profile | PetReunite",
  description: "Manage your profile and pet listings on PetReunite.",
}

export default async function ProfilePage() {
  // Get the current user
  const token = cookies().get("auth-token")?.value
  if (!token) {
    redirect("/login?redirect=/profile")
  }

  const request = {
    cookies: {
      get: (name: string) => (name === "auth-token" ? { value: token } : undefined),
    },
  } as any

  const user = await getUserFromRequest(request)
  if (!user) {
    redirect("/login?redirect=/profile")
  }

  // Get the user's pets
  const pets = await getUserPets(user.id)

  return <UserProfile user={user} pets={pets} />
}
