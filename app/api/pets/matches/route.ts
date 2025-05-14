import { type NextRequest, NextResponse } from "next/server"
import { getPetById, getRecentLostPets, getRecentFoundPets } from "@/lib/pet-service"
import { findMatchesForLostPet, findMatchesForFoundPet } from "@/lib/pet-matching"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const petId = searchParams.get("petId")
    const petType = searchParams.get("petType") as "lost" | "found" | null
    const threshold = Number(searchParams.get("threshold") || "50")
    const limit = Number(searchParams.get("limit") || "5")
    const skipImageAnalysis = searchParams.get("skipImageAnalysis") === "true"

    if (!petId) {
      return NextResponse.json({ error: "Pet ID is required" }, { status: 400 })
    }

    if (!petType || (petType !== "lost" && petType !== "found")) {
      return NextResponse.json({ error: "Valid pet type (lost or found) is required" }, { status: 400 })
    }

    // Get the pet
    const pet = await getPetById(petId)
    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    // Verify the pet type matches what was requested
    if (pet.status !== petType) {
      return NextResponse.json({ error: `Pet is not a ${petType} pet` }, { status: 400 })
    }

    let matches = []

    if (petType === "lost") {
      // Find matches for a lost pet among found pets
      const foundPets = await getRecentFoundPets(100) // Get a larger pool for better matching
      matches = await findMatchesForLostPet(pet, foundPets, threshold, !skipImageAnalysis)
    } else {
      // Find matches for a found pet among lost pets
      const lostPets = await getRecentLostPets(100) // Get a larger pool for better matching
      matches = await findMatchesForFoundPet(pet, lostPets, threshold, !skipImageAnalysis)
    }

    // Limit the number of matches returned
    const limitedMatches = matches.slice(0, limit)

    return NextResponse.json({ matches: limitedMatches })
  } catch (error) {
    console.error("Error finding pet matches:", error)
    return NextResponse.json({ error: "Failed to find pet matches" }, { status: 500 })
  }
}
