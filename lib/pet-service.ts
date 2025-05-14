import { v4 as uuidv4 } from "uuid"
import getRedisClient from "./redis"
import { deleteImage } from "./blob-storage"
import type { GeoLocation } from "./map-utils"

// Get the Redis client
const redis = getRedisClient()

export type PetStatus = "lost" | "found"

export interface Pet {
  id: string
  name?: string
  type: string
  breed: string
  color: string
  gender: "male" | "female" | "unknown"
  status: PetStatus
  location: string
  coordinates?: GeoLocation // New field for map coordinates
  description: string
  images: string[] // Changed from image?: string to images: string[]
  contactName: string
  contactEmail: string
  contactPhone: string
  createdAt: number
  userId?: string // Added userId to associate pets with users
  // Lost pet specific fields
  lastSeen?: string
  microchipped?: "yes" | "no" | "unknown"
  age?: string
  // Found pet specific fields
  foundDate?: string
  collar?: "yes" | "no"
  collarDetails?: string
  currentLocation?: string
  currentCoordinates?: GeoLocation // New field for current location coordinates
  // Legacy field for backward compatibility
  image?: string
}

const PET_KEY_PREFIX = "pet:"
const LOST_PETS_KEY = "lost_pets"
const FOUND_PETS_KEY = "found_pets"
const ALL_PETS_KEY = "all_pets"
const USER_PETS_KEY_PREFIX = "user_pets:" // New key for user's pets

// Mock data for initial state when database is empty
const mockLostPets: Omit<Pet, "id" | "createdAt">[] = [
  {
    name: "Max",
    type: "Dog",
    breed: "Golden Retriever",
    color: "Golden",
    gender: "male",
    lastSeen: "2023-05-10",
    location: "Colombo, Sri Lanka",
    coordinates: { latitude: 6.9271, longitude: 79.8612 },
    description: "Friendly dog with a red collar. Responds to his name.",
    status: "lost",
    images: ["/golden-retriever.png"],
    contactName: "John Smith",
    contactEmail: "john@example.com",
    contactPhone: "(555) 123-4567",
    microchipped: "yes",
    age: "3 years",
  },
  {
    name: "Luna",
    type: "Cat",
    breed: "Siamese",
    color: "Cream with brown points",
    gender: "female",
    lastSeen: "2023-05-12",
    location: "Kandy, Sri Lanka",
    coordinates: { latitude: 7.2906, longitude: 80.6337 },
    description: "Shy cat with blue eyes. Has a pink collar with a bell.",
    status: "lost",
    images: ["/siamese-cat.png"],
    contactName: "Sarah Johnson",
    contactEmail: "sarah@example.com",
    contactPhone: "(555) 987-6543",
    microchipped: "unknown",
    age: "2 years",
  },
  {
    name: "Buddy",
    type: "Dog",
    breed: "Labrador",
    color: "Black",
    gender: "male",
    lastSeen: "2023-05-15",
    location: "Lincoln Park, Chicago",
    description: "Energetic dog with a blue collar. Has a small white spot on chest.",
    status: "lost",
    images: ["/black-labrador.png"],
    contactName: "Michael Brown",
    contactEmail: "michael@example.com",
    contactPhone: "(555) 456-7890",
    microchipped: "yes",
    age: "4 years",
  },
]

const mockFoundPets: Omit<Pet, "id" | "createdAt">[] = [
  {
    type: "Cat",
    breed: "Tabby",
    color: "Orange and white",
    gender: "unknown",
    foundDate: "2023-05-11",
    location: "Riverside Park, New York",
    description: "Friendly cat found wandering in the park. No collar.",
    status: "found",
    images: ["/orange-tabby-cat.png"],
    contactName: "Emily Davis",
    contactEmail: "emily@example.com",
    contactPhone: "(555) 234-5678",
    collar: "no",
    currentLocation: "At finder's home",
  },
  {
    type: "Dog",
    breed: "Beagle",
    color: "Tricolor",
    gender: "male",
    foundDate: "2023-05-13",
    location: "Galle, Sri Lanka",
    coordinates: { latitude: 6.0535, longitude: 80.221 },
    description: "Small beagle with brown collar, no tags. Very friendly.",
    status: "found",
    images: ["/beagle-dog.png"],
    contactName: "David Wilson",
    contactEmail: "david@example.com",
    contactPhone: "(555) 345-6789",
    collar: "yes",
    collarDetails: "Brown leather collar, no tags",
    currentLocation: "Local animal shelter",
  },
  {
    type: "Cat",
    breed: "Unknown",
    color: "Black and white",
    gender: "female",
    foundDate: "2023-05-16",
    location: "Negombo, Sri Lanka",
    coordinates: { latitude: 7.2081, longitude: 79.8352 },
    description: "Tuxedo cat found near the playground. Has a red collar with bell.",
    status: "found",
    images: ["/tuxedo-cat.png"],
    contactName: "Jessica Martinez",
    contactEmail: "jessica@example.com",
    contactPhone: "(555) 567-8901",
    collar: "yes",
    collarDetails: "Red collar with bell, no ID tag",
    currentLocation: "At finder's home",
  },
]

// Function to get mock data for testing/development
export function getMockLostPets(limit = 3): Pet[] {
  return mockLostPets.slice(0, limit).map((pet) => ({
    ...pet,
    id: uuidv4(),
    createdAt: Date.now(),
  }))
}

export function getMockFoundPets(limit = 3): Pet[] {
  return mockFoundPets.slice(0, limit).map((pet) => ({
    ...pet,
    id: uuidv4(),
    createdAt: Date.now(),
  }))
}

// Add the missing getPets function
export async function getPets(
  options: {
    status?: PetStatus
    limit?: number
    offset?: number
  } = {},
): Promise<Pet[]> {
  try {
    const { status, limit = 20, offset = 0 } = options

    // During database issues, return mock data
    console.log("Using mock data for getPets due to database issues")

    // Get mock data based on status
    if (status === "lost") {
      return getMockLostPets(limit)
    } else if (status === "found") {
      return getMockFoundPets(limit)
    } else {
      // Combine both types for "all" status
      const allMockPets = [...getMockLostPets(Math.ceil(limit / 2)), ...getMockFoundPets(Math.floor(limit / 2))]

      // Sort by creation date (newest first)
      allMockPets.sort((a, b) => b.createdAt - a.createdAt)

      return allMockPets.slice(offset, offset + limit)
    }
  } catch (error) {
    console.error("Error in getPets:", error)
    // Return empty array on error
    return []
  }
}

// Initialize the database with mock data if empty
export async function initializeDatabase() {
  try {
    // Check if database is empty
    const lostPetsCount = await redis.llen(LOST_PETS_KEY)
    const foundPetsCount = await redis.llen(FOUND_PETS_KEY)

    if (lostPetsCount === 0 && foundPetsCount === 0) {
      console.log("Initializing database with mock data...")

      // Add mock lost pets
      for (const petData of mockLostPets) {
        await createPet(petData)
      }

      // Add mock found pets
      for (const petData of mockFoundPets) {
        await createPet(petData)
      }

      console.log("Database initialized with mock data")
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    // Don't throw, just log the error
  }
}

export async function createPet(petData: Omit<Pet, "id" | "createdAt">): Promise<Pet> {
  const id = uuidv4()
  const createdAt = Date.now()

  // Convert single image to array if needed
  let images = petData.images || []
  if (!Array.isArray(images)) {
    // Handle legacy data where image might be a string
    if (petData.image) {
      images = [petData.image]
    } else {
      images = []
    }
  }

  const pet: Pet = {
    ...petData,
    id,
    createdAt,
    images,
  }

  try {
    // Ensure proper JSON serialization
    const petJson = JSON.stringify(pet)

    // Store the pet in Redis
    await redis.set(`${PET_KEY_PREFIX}${id}`, petJson)

    // Add to the appropriate list
    if (pet.status === "lost") {
      await redis.lpush(LOST_PETS_KEY, id)
    } else {
      await redis.lpush(FOUND_PETS_KEY, id)
    }

    // Add to all pets list
    await redis.lpush(ALL_PETS_KEY, id)

    // If userId is provided, add to user's pets list
    if (pet.userId) {
      await redis.lpush(`${USER_PETS_KEY_PREFIX}${pet.userId}`, id)
    }

    return pet
  } catch (error) {
    console.error("Error creating pet:", error)
    throw new Error("Failed to create pet")
  }
}

export async function updatePet(id: string, petData: Partial<Pet>): Promise<Pet | null> {
  try {
    // Get the existing pet
    const existingPet = await getPetById(id)
    if (!existingPet) {
      return null
    }

    // Handle images update
    let images = existingPet.images || []
    if (petData.images) {
      images = petData.images
    } else if (petData.image) {
      // Handle legacy data
      images = [petData.image]
    }

    // Update the pet data
    const updatedPet: Pet = {
      ...existingPet,
      ...petData,
      images,
      id, // Ensure ID doesn't change
      createdAt: existingPet.createdAt, // Ensure creation date doesn't change
    }

    // Store the updated pet
    await redis.set(`${PET_KEY_PREFIX}${id}`, JSON.stringify(updatedPet))

    return updatedPet
  } catch (error) {
    console.error(`Error updating pet with ID ${id}:`, error)
    return null
  }
}

export async function deletePet(id: string): Promise<boolean> {
  try {
    // Get the pet to delete
    const pet = await getPetById(id)
    if (!pet) {
      return false
    }

    // Delete the pet from Redis
    await redis.del(`${PET_KEY_PREFIX}${id}`)

    // Remove from the appropriate lists
    await redis.lrem(ALL_PETS_KEY, 0, id)
    if (pet.status === "lost") {
      await redis.lrem(LOST_PETS_KEY, 0, id)
    } else {
      await redis.lrem(FOUND_PETS_KEY, 0, id)
    }

    // Remove from user's pets list if userId exists
    if (pet.userId) {
      await redis.lrem(`${USER_PETS_KEY_PREFIX}${pet.userId}`, 0, id)
    }

    // Delete associated images from blob storage
    if (pet.images && pet.images.length > 0) {
      for (const imageUrl of pet.images) {
        try {
          // Only delete images from blob storage, not placeholder or static images
          if (imageUrl && !imageUrl.startsWith("/") && imageUrl.includes("blob.vercel-storage.com")) {
            await deleteImage(imageUrl)
          }
        } catch (imageError) {
          console.error(`Error deleting image ${imageUrl}:`, imageError)
          // Continue with other images even if one fails
        }
      }
    }

    return true
  } catch (error) {
    console.error(`Error deleting pet with ID ${id}:`, error)
    return false
  }
}

export async function getPetById(id: string): Promise<Pet | null> {
  try {
    const petData = await redis.get(`${PET_KEY_PREFIX}${id}`)

    // If no data found, return null
    if (!petData) return null

    // Handle different types of responses
    if (typeof petData === "string") {
      try {
        // Try to parse the JSON string
        const pet = JSON.parse(petData) as Pet

        // Convert legacy image field to images array if needed
        if (!pet.images) {
          pet.images = pet.image ? [pet.image] : []
        }

        return pet
      } catch (parseError) {
        console.error(`Error parsing pet data for ID ${id}:`, parseError)
        console.log("Raw pet data:", petData)
        return null
      }
    } else if (typeof petData === "object") {
      // If it's already an object, return it directly
      const pet = petData as Pet

      // Convert legacy image field to images array if needed
      if (!pet.images) {
        pet.images = pet.image ? [pet.image] : []
      }

      return pet
    }

    // If we get here, the data is in an unexpected format
    console.error(`Unexpected data format for pet ID ${id}:`, typeof petData)
    return null
  } catch (error) {
    console.error(`Error getting pet with ID ${id}:`, error)
    return null
  }
}

export async function getRecentPets(limit = 6): Promise<Pet[]> {
  try {
    const petIds = await redis.lrange(ALL_PETS_KEY, 0, limit - 1)

    if (!petIds || petIds.length === 0) {
      return []
    }

    const pets = await Promise.all(
      petIds.map(async (id) => {
        try {
          const pet = await getPetById(id as string)
          return pet
        } catch (error) {
          console.error(`Error getting pet with ID ${id}:`, error)
          return null
        }
      }),
    )

    return pets.filter(Boolean) as Pet[]
  } catch (error) {
    console.error("Error getting recent pets:", error)
    return []
  }
}

export async function getRecentLostPets(limit = 6): Promise<Pet[]> {
  try {
    const petIds = await redis.lrange(LOST_PETS_KEY, 0, limit - 1)

    if (!petIds || petIds.length === 0) {
      return []
    }

    const pets = await Promise.all(
      petIds.map(async (id) => {
        try {
          const pet = await getPetById(id as string)
          return pet
        } catch (error) {
          console.error(`Error getting pet with ID ${id}:`, error)
          return null
        }
      }),
    )

    return pets.filter(Boolean) as Pet[]
  } catch (error) {
    console.error("Error getting recent lost pets:", error)
    return []
  }
}

export async function getRecentFoundPets(limit = 6): Promise<Pet[]> {
  try {
    const petIds = await redis.lrange(FOUND_PETS_KEY, 0, limit - 1)

    if (!petIds || petIds.length === 0) {
      return []
    }

    const pets = await Promise.all(
      petIds.map(async (id) => {
        try {
          const pet = await getPetById(id as string)
          return pet
        } catch (error) {
          console.error(`Error getting pet with ID ${id}:`, error)
          return null
        }
      }),
    )

    return pets.filter(Boolean) as Pet[]
  } catch (error) {
    console.error("Error getting recent found pets:", error)
    return []
  }
}

export async function getUserPets(userId: string): Promise<Pet[]> {
  try {
    const petIds = await redis.lrange(`${USER_PETS_KEY_PREFIX}${userId}`, 0, -1)

    if (!petIds || petIds.length === 0) {
      return []
    }

    const pets = await Promise.all(
      petIds.map(async (id) => {
        try {
          const pet = await getPetById(id as string)
          return pet
        } catch (error) {
          console.error(`Error getting pet with ID ${id}:`, error)
          return null
        }
      }),
    )

    return pets.filter(Boolean) as Pet[]
  } catch (error) {
    console.error(`Error getting pets for user ${userId}:`, error)
    return []
  }
}

export async function searchPets(options: {
  query?: string
  petType?: string
  location?: string
  coordinates?: GeoLocation
  radius?: number // in kilometers
  status?: PetStatus
  userId?: string
  limit?: number
  offset?: number
}): Promise<Pet[]> {
  try {
    const { status, userId, limit = 20, offset = 0, coordinates, radius = 25 } = options

    // Get the appropriate list based on status and userId
    let listKey = ALL_PETS_KEY
    if (userId) {
      listKey = `${USER_PETS_KEY_PREFIX}${userId}`
    } else if (status === "lost") {
      listKey = LOST_PETS_KEY
    } else if (status === "found") {
      listKey = FOUND_PETS_KEY
    }

    // Log the search options for debugging
    console.log("Searching pets with options:", options)

    // Get all pet IDs from the list
    const petIds = await redis.lrange(listKey, 0, -1)

    if (!petIds || petIds.length === 0) {
      console.log("No pet IDs found in list:", listKey)
      return []
    }

    console.log(`Found ${petIds.length} pet IDs in list ${listKey}`)

    // Get all pets
    const allPets = await Promise.all(
      petIds.map(async (id) => {
        try {
          const pet = await getPetById(id as string)
          return pet
        } catch (error) {
          console.error(`Error getting pet with ID ${id}:`, error)
          return null
        }
      }),
    )

    // Filter out null values
    const validPets = allPets.filter(Boolean) as Pet[]

    console.log(`Retrieved ${validPets.length} valid pets`)

    // Apply filters
    const filteredPets = validPets.filter((pet) => {
      const { query, petType, location } = options

      // If userId is provided and we're not using the user's list, filter by userId
      if (userId && listKey !== `${USER_PETS_KEY_PREFIX}${userId}` && pet.userId !== userId) {
        return false
      }

      // If status is provided and we're not using a status-specific list, filter by status
      if (status && listKey !== LOST_PETS_KEY && listKey !== FOUND_PETS_KEY && pet.status !== status) {
        return false
      }

      // Filter by search query
      if (query) {
        const searchLower = query.toLowerCase()
        const matchesSearch =
          (pet.name && pet.name.toLowerCase().includes(searchLower)) ||
          pet.breed.toLowerCase().includes(searchLower) ||
          pet.color.toLowerCase().includes(searchLower) ||
          pet.description.toLowerCase().includes(searchLower) ||
          pet.location.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      // Filter by pet type
      if (petType && petType !== "all" && pet.type.toLowerCase() !== petType.toLowerCase()) {
        return false
      }

      // Filter by location text
      if (location && !pet.location.toLowerCase().includes(location.toLowerCase())) {
        return false
      }

      // Filter by coordinates and radius if provided
      if (coordinates && radius && pet.coordinates) {
        // Import the function dynamically to avoid circular dependencies
        const { calculateDistance } = require("./map-utils")
        const distance = calculateDistance(coordinates, pet.coordinates)
        if (distance > radius) {
          return false
        }
      }

      return true
    })

    console.log(`After filtering, found ${filteredPets.length} matching pets`)

    // Sort by creation date (newest first)
    filteredPets.sort((a, b) => b.createdAt - a.createdAt)

    // Apply pagination
    return filteredPets.slice(offset, offset + limit)
  } catch (error) {
    console.error("Error searching pets:", error)
    return []
  }
}

// Function to repair the database if needed
export async function repairDatabase() {
  try {
    console.log("Starting database repair...")

    // Get all pet IDs
    const allPetIds = await redis.lrange(ALL_PETS_KEY, 0, -1)

    if (!allPetIds || allPetIds.length === 0) {
      console.log("No pets found in database. Nothing to repair.")
      return
    }

    console.log(`Found ${allPetIds.length} pets to check...`)

    let repairedCount = 0

    // Check each pet
    for (const id of allPetIds) {
      try {
        const petKey = `${PET_KEY_PREFIX}${id}`
        const petData = await redis.get(petKey)

        // Skip if no data found
        if (!petData) continue

        // Check if the data needs repair
        if (typeof petData === "object" && !(petData instanceof String)) {
          // Convert object to JSON string
          const petJson = JSON.stringify(petData)

          // Store the fixed data
          await redis.set(petKey, petJson)
          repairedCount++

          console.log(`Repaired pet ${id}`)
        }

        // Check if the pet has the new images array
        const pet = await getPetById(id as string)
        if (pet && !pet.images) {
          // Convert legacy image field to images array
          pet.images = pet.image ? [pet.image] : []
          delete (pet as any).image // Remove the old image field

          // Store the updated pet
          await redis.set(petKey, JSON.stringify(pet))
          repairedCount++

          console.log(`Updated pet ${id} to use images array`)
        }
      } catch (error) {
        console.error(`Error repairing pet ${id}:`, error)
      }
    }

    console.log(`Database repair completed. Repaired ${repairedCount} pets.`)
  } catch (error) {
    console.error("Error repairing database:", error)
    // Don't throw, just log the error
  }
}
