import { type NextRequest, NextResponse } from "next/server"
import {
  createPet,
  searchPets,
  initializeDatabase,
  getMockLostPets,
  getMockFoundPets,
  getPets,
  repairDatabase,
} from "@/lib/pet-service"
import { getUserFromRequest } from "@/lib/auth-utils"
import { sriLankaDistricts } from "@/lib/sri-lanka-data"

// Initialize database in a more controlled way
let databaseInitialized = false

// Function to safely initialize the database
async function safelyInitializeDatabase() {
  if (databaseInitialized) return

  try {
    console.log("Attempting to repair and initialize database...")
    await repairDatabase()
    await initializeDatabase()
    databaseInitialized = true
    console.log("Database successfully repaired and initialized")
  } catch (error) {
    console.error("Failed to initialize/repair database:", error)
    // Don't throw here, just log the error
  }
}

// Try to initialize database but don't block the API
safelyInitializeDatabase().catch((err) => {
  console.error("Background database initialization failed:", err)
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Log the search parameters for debugging
    console.log("Search parameters:", Object.fromEntries(searchParams.entries()))

    // Check if it's a search or just getting recent pets
    if (
      searchParams.has("query") ||
      searchParams.has("petType") ||
      searchParams.has("location") ||
      searchParams.has("status") ||
      searchParams.has("userId") ||
      searchParams.has("latitude") ||
      searchParams.has("longitude")
    ) {
      // It's a search request
      const query = searchParams.get("query") || undefined
      const petType = searchParams.get("petType") || undefined
      const location = searchParams.get("location") || undefined
      const status = (searchParams.get("status") as any) || undefined
      const userId = searchParams.get("userId") || undefined
      const limit = Number.parseInt(searchParams.get("limit") || "20")
      const offset = Number.parseInt(searchParams.get("offset") || "0")

      // Handle district-based search with coordinates
      let coordinates = undefined
      let radius = undefined

      if (searchParams.has("latitude") && searchParams.has("longitude")) {
        coordinates = {
          latitude: Number.parseFloat(searchParams.get("latitude") || "0"),
          longitude: Number.parseFloat(searchParams.get("longitude") || "0"),
        }
        radius = Number.parseInt(searchParams.get("radius") || "25")
      }

      // Check if the location is a Sri Lankan district
      if (location) {
        const districtName = location.split(",")[0].trim()
        const district = sriLankaDistricts.find((d) => d.name.toLowerCase() === districtName.toLowerCase())

        if (district && !coordinates) {
          coordinates = {
            latitude: district.latitude,
            longitude: district.longitude,
          }
          radius = 25 // Default radius in km
        }
      }

      try {
        // Try to search pets using the database
        const pets = await searchPets({
          query,
          petType,
          location,
          status,
          userId,
          coordinates,
          radius,
          limit,
          offset,
        })

        return NextResponse.json({
          pets,
          pagination: {
            total: pets.length + offset, // This is a simplification
            limit,
            offset,
            hasMore: pets.length === limit, // Assume there's more if we got a full page
          },
        })
      } catch (error) {
        console.error("Error searching pets:", error)

        // Return mock data based on status
        if (status === "lost") {
          return NextResponse.json({
            pets: getMockLostPets(limit),
            pagination: {
              total: 20, // Mock total
              limit,
              offset,
              hasMore: offset + limit < 20,
            },
          })
        } else if (status === "found") {
          return NextResponse.json({
            pets: getMockFoundPets(limit),
            pagination: {
              total: 15, // Mock total
              limit,
              offset,
              hasMore: offset + limit < 15,
            },
          })
        } else {
          const combinedPets = [...getMockLostPets(Math.floor(limit / 2)), ...getMockFoundPets(Math.floor(limit / 2))]
          return NextResponse.json({
            pets: combinedPets,
            pagination: {
              total: 35, // Mock total
              limit,
              offset,
              hasMore: offset + limit < 35,
            },
          })
        }
      }
    } else {
      // Just get recent pets
      const limit = Number.parseInt(searchParams.get("limit") || "6")
      const offset = Number.parseInt(searchParams.get("offset") || "0")

      try {
        // Try to get pets using the database
        const pets = await getPets({ limit, offset })

        return NextResponse.json({
          pets,
          pagination: {
            total: pets.length + offset, // This is a simplification
            limit,
            offset,
            hasMore: pets.length === limit, // Assume there's more if we got a full page
          },
        })
      } catch (error) {
        console.error("Error getting recent pets:", error)

        // Return combined mock data
        const combinedPets = [...getMockLostPets(Math.floor(limit / 2)), ...getMockFoundPets(Math.floor(limit / 2))]
        return NextResponse.json({
          pets: combinedPets,
          pagination: {
            total: 35, // Mock total
            limit,
            offset,
            hasMore: offset + limit < 35,
          },
        })
      }
    }
  } catch (error) {
    console.error("Error processing request:", error)

    // Return mock data as fallback
    const combinedPets = [...getMockLostPets(3), ...getMockFoundPets(3)]
    return NextResponse.json({
      pets: combinedPets,
      pagination: {
        total: 35, // Mock total
        limit: 6,
        offset: 0,
        hasMore: true,
      },
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const petData = await request.json()

    // Validate required fields
    const requiredFields = [
      "type",
      "breed",
      "color",
      "gender",
      "status",
      "location",
      "description",
      "contactName",
      "contactEmail",
      "contactPhone",
    ]

    for (const field of requiredFields) {
      if (!petData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Additional validation for lost/found specific fields
    if (petData.status === "lost" && !petData.lastSeen) {
      return NextResponse.json({ error: "Missing required field for lost pet: lastSeen" }, { status: 400 })
    }

    if (petData.status === "found" && !petData.foundDate) {
      return NextResponse.json({ error: "Missing required field for found pet: foundDate" }, { status: 400 })
    }

    // Get the current user if authenticated
    const user = await getUserFromRequest(request)
    if (user) {
      // Associate the pet with the user
      petData.userId = user.id
    }

    // Convert single image to images array if needed
    if (petData.image && !petData.images) {
      petData.images = [petData.image]
      delete petData.image
    }

    // Check if location is a Sri Lankan district and add coordinates
    if (petData.location) {
      const districtName = petData.location.split(",")[0].trim()
      const district = sriLankaDistricts.find((d) => d.name.toLowerCase() === districtName.toLowerCase())

      if (district) {
        petData.coordinates = {
          latitude: district.latitude,
          longitude: district.longitude,
        }
      }
    }

    try {
      // Try to create the pet in the database
      const pet = await createPet(petData)
      return NextResponse.json({ pet }, { status: 201 })
    } catch (error) {
      console.error("Error creating pet in database:", error)

      // Create a mock pet with the submitted data
      const id = Math.random().toString(36).substring(2, 15)
      const pet = {
        ...petData,
        id,
        createdAt: Date.now(),
      }

      return NextResponse.json(
        {
          pet,
          warning: "Pet was created in mock mode. It will not be persisted in the database.",
        },
        { status: 201 },
      )
    }
  } catch (error) {
    console.error("Error creating pet:", error)
    return NextResponse.json({ error: "Failed to create pet due to server error" }, { status: 500 })
  }
}
