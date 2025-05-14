import { redirect } from "next/navigation"
import { getUserFromRequest } from "@/lib/auth-utils"
import { cookies } from "next/headers"
import { getPetById } from "@/lib/pet-service"
import PetEditForm from "@/components/pet-edit-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Edit Pet Listing | PetReunite",
  description: "Update your pet listing information.",
}

export default async function EditPetPage({ params }: { params: { id: string } }) {
  // Get the current user
  const token = cookies().get("auth-token")?.value
  if (!token) {
    redirect(`/login?redirect=/pets/${params.id}/edit`)
  }

  const request = {
    cookies: {
      get: (name: string) => (name === "auth-token" ? { value: token } : undefined),
    },
  } as any

  const user = await getUserFromRequest(request)
  if (!user) {
    redirect(`/login?redirect=/pets/${params.id}/edit`)
  }

  // Get the pet
  const pet = await getPetById(params.id)
  if (!pet) {
    redirect("/profile")
  }

  // Check if the user owns this pet
  if (pet.userId && pet.userId !== user.id) {
    redirect("/profile")
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold">Edit Pet Listing</h1>
        <p className="text-muted-foreground">
          Update the information for your {pet.status === "lost" ? "lost" : "found"} pet.
        </p>
      </div>
      <PetEditForm pet={pet} />
    </div>
  )
}
