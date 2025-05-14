import { type NextRequest, NextResponse } from "next/server"
import { getMockLostPets, getMockFoundPets } from "@/lib/pet-service"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Try to find the pet in mock data
    const allMockPets = [...getMockLostPets(10), ...getMockFoundPets(10)]
    const pet = allMockPets.find((p) => p.id === id)

    if (pet) {
      return NextResponse.json({ pet })
    }

    // If not found, create a mock pet with the requested ID
    const mockPet = {
      id,
      name: "Sample Pet",
      type: Math.random() > 0.5 ? "Dog" : "Cat",
      breed: "Mixed",
      color: "Brown",
      gender: "unknown" as const,
      status: Math.random() > 0.5 ? ("lost" as const) : ("found" as const),
      location: "Sample Location",
      description: "This is a sample pet description.",
      images: ["/placeholder.svg"],
      contactName: "Sample Contact",
      contactEmail: "contact@example.com",
      contactPhone: "(555) 123-4567",
      createdAt: Date.now(),
      lastSeen: new Date().toISOString().split("T")[0],
      foundDate: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json({ pet: mockPet })
  } catch (error) {
    console.error(`Error getting pet with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to get pet details" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updateData = await request.json()

    // Get the current user
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Return a mock updated pet
    return NextResponse.json({
      pet: {
        ...updateData,
        id,
        userId: user.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      message: "Pet updated successfully (mock)",
    })
  } catch (error) {
    console.error(`Error updating pet with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update pet" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Get the current user
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: "Pet deleted successfully (mock)",
    })
  } catch (error) {
    console.error(`Error deleting pet with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete pet" }, { status: 500 })
  }
}
