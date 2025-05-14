import type { Pet } from "./pet-service"
import { calculateTextSimilarity } from "./geo-utils"
import { calculatePetImageSimilarity } from "./image-recognition"

export interface MatchScore {
  score: number
  reasons: string[]
  imageSimilarity?: {
    score: number
    confidence: number
    reasons: string[]
  }
}

export interface PetMatch {
  lostPet: Pet
  foundPet: Pet
  matchScore: MatchScore
}

// Configuration for match weights
const MATCH_WEIGHTS = {
  petType: 20, // Pet type is critical - a dog is unlikely to be mistaken for a cat
  breed: 15, // Breed is important but people may misidentify breeds
  color: 10, // Color is important but descriptions may vary
  gender: 5, // Gender is moderately important
  location: 15, // Location is very important - pets are usually found near where they were lost
  timeFrame: 10, // Time frame is important - a pet found months after being lost is less likely to be a match
  imageSimilarity: 25, // Image similarity is very important - visual confirmation is powerful
}

/**
 * Calculate a match score between a lost pet and a found pet
 * @param lostPet The lost pet
 * @param foundPet The found pet
 * @param includeImageAnalysis Whether to include image analysis (default: true)
 * @returns A match score object with a score between 0 and 100 and reasons for the score
 */
export async function calculateMatchScore(
  lostPet: Pet,
  foundPet: Pet,
  includeImageAnalysis = true,
): Promise<MatchScore> {
  const reasons: string[] = []
  let totalScore = 0

  // 1. Match pet type (dog, cat, etc.) - this is a critical factor
  if (lostPet.type.toLowerCase() === foundPet.type.toLowerCase()) {
    totalScore += MATCH_WEIGHTS.petType
    reasons.push(`Pet type matches: ${lostPet.type}`)
  } else {
    return { score: 0, reasons: ["Pet types do not match"] }
  }

  // 2. Match breed
  if (lostPet.breed && foundPet.breed) {
    const breedSimilarity = calculateTextSimilarity(lostPet.breed, foundPet.breed)
    const breedScore = breedSimilarity * MATCH_WEIGHTS.breed
    totalScore += breedScore

    if (breedSimilarity > 0.8) {
      reasons.push(`Breed is a strong match: ${lostPet.breed} and ${foundPet.breed}`)
    } else if (breedSimilarity > 0.5) {
      reasons.push(`Breed is a partial match: ${lostPet.breed} and ${foundPet.breed}`)
    }
  }

  // 3. Match color
  if (lostPet.color && foundPet.color) {
    const colorSimilarity = calculateTextSimilarity(lostPet.color, foundPet.color)
    const colorScore = colorSimilarity * MATCH_WEIGHTS.color
    totalScore += colorScore

    if (colorSimilarity > 0.8) {
      reasons.push(`Color is a strong match: ${lostPet.color} and ${foundPet.color}`)
    } else if (colorSimilarity > 0.5) {
      reasons.push(`Color is a partial match: ${lostPet.color} and ${foundPet.color}`)
    }
  }

  // 4. Match gender
  if (lostPet.gender === foundPet.gender) {
    totalScore += MATCH_WEIGHTS.gender
    reasons.push(`Gender matches: ${lostPet.gender}`)
  } else if (lostPet.gender === "unknown" || foundPet.gender === "unknown") {
    totalScore += MATCH_WEIGHTS.gender * 0.5
    reasons.push("One pet has unknown gender")
  }

  // 5. Match location
  // In a real application, you would use geocoding to convert addresses to coordinates
  // For now, we'll use a simple text similarity approach
  if (lostPet.location && foundPet.location) {
    const locationSimilarity = calculateTextSimilarity(lostPet.location, foundPet.location)
    const locationScore = locationSimilarity * MATCH_WEIGHTS.location
    totalScore += locationScore

    if (locationSimilarity > 0.8) {
      reasons.push(`Location is very close: ${lostPet.location} and ${foundPet.location}`)
    } else if (locationSimilarity > 0.5) {
      reasons.push(`Location is somewhat close: ${lostPet.location} and ${foundPet.location}`)
    }
  }

  // 6. Match time frame
  const lostDate = lostPet.lastSeen ? new Date(lostPet.lastSeen) : null
  const foundDate = foundPet.foundDate ? new Date(foundPet.foundDate) : null

  if (lostDate && foundDate) {
    // Check if found date is after lost date
    if (foundDate >= lostDate) {
      // Calculate days between lost and found
      const daysDifference = Math.floor((foundDate.getTime() - lostDate.getTime()) / (1000 * 60 * 60 * 24))

      // Score based on time proximity
      let timeFrameScore = 0
      if (daysDifference <= 2) {
        timeFrameScore = MATCH_WEIGHTS.timeFrame // Found within 2 days
        reasons.push(`Found very soon after being lost (${daysDifference} days)`)
      } else if (daysDifference <= 7) {
        timeFrameScore = MATCH_WEIGHTS.timeFrame * 0.8 // Found within a week
        reasons.push(`Found within a week of being lost (${daysDifference} days)`)
      } else if (daysDifference <= 30) {
        timeFrameScore = MATCH_WEIGHTS.timeFrame * 0.6 // Found within a month
        reasons.push(`Found within a month of being lost (${daysDifference} days)`)
      } else if (daysDifference <= 90) {
        timeFrameScore = MATCH_WEIGHTS.timeFrame * 0.4 // Found within 3 months
        reasons.push(`Found within 3 months of being lost (${daysDifference} days)`)
      } else {
        timeFrameScore = MATCH_WEIGHTS.timeFrame * 0.2 // Found after 3 months
        reasons.push(`Found after a long time (${daysDifference} days)`)
      }

      totalScore += timeFrameScore
    } else {
      // Found date is before lost date, which doesn't make sense
      reasons.push("Found date is before lost date, which is unusual")
    }
  }

  // 7. Image similarity analysis
  let imageSimilarity = undefined

  if (includeImageAnalysis && lostPet.images?.length && foundPet.images?.length) {
    imageSimilarity = await calculatePetImageSimilarity(lostPet, foundPet)

    // Add image similarity score to total
    const imageScore = imageSimilarity.score * MATCH_WEIGHTS.imageSimilarity
    totalScore += imageScore

    // Add a reason based on the image similarity
    if (imageSimilarity.score > 0.8) {
      reasons.push("Images show very similar pets")
    } else if (imageSimilarity.score > 0.5) {
      reasons.push("Images show moderately similar pets")
    } else if (imageSimilarity.score > 0.3) {
      reasons.push("Images show somewhat similar pets")
    }
  }

  return {
    score: Math.min(Math.round(totalScore), 100), // Cap at 100
    reasons,
    imageSimilarity,
  }
}

/**
 * Find potential matches for a lost pet among found pets
 * @param lostPet The lost pet to find matches for
 * @param foundPets Array of found pets to search through
 * @param threshold Minimum match score to include in results (default: 50)
 * @param includeImageAnalysis Whether to include image analysis (default: true)
 * @returns Array of potential matches sorted by match score (highest first)
 */
export async function findMatchesForLostPet(
  lostPet: Pet,
  foundPets: Pet[],
  threshold = 50,
  includeImageAnalysis = true,
): Promise<PetMatch[]> {
  const matches: PetMatch[] = []

  // First, do a quick pre-filtering without image analysis
  const potentialMatches = await Promise.all(
    foundPets.map(async (foundPet) => {
      const quickMatchScore = await calculateMatchScore(lostPet, foundPet, false)
      return {
        foundPet,
        quickScore: quickMatchScore.score,
      }
    }),
  )

  // Sort by quick score and take the top candidates
  const topCandidates = potentialMatches
    .filter((match) => match.quickScore >= threshold * 0.7) // Lower threshold for pre-filtering
    .sort((a, b) => b.quickScore - a.quickScore)
    .slice(0, 10) // Limit to top 10 candidates for detailed analysis

  // Now do detailed analysis with image recognition on the top candidates
  for (const { foundPet } of topCandidates) {
    const matchScore = await calculateMatchScore(lostPet, foundPet, includeImageAnalysis)

    if (matchScore.score >= threshold) {
      matches.push({
        lostPet,
        foundPet,
        matchScore,
      })
    }
  }

  // Sort matches by score (highest first)
  return matches.sort((a, b) => b.matchScore.score - a.matchScore.score)
}

/**
 * Find potential matches for a found pet among lost pets
 * @param foundPet The found pet to find matches for
 * @param lostPets Array of lost pets to search through
 * @param threshold Minimum match score to include in results (default: 50)
 * @param includeImageAnalysis Whether to include image analysis (default: true)
 * @returns Array of potential matches sorted by match score (highest first)
 */
export async function findMatchesForFoundPet(
  foundPet: Pet,
  lostPets: Pet[],
  threshold = 50,
  includeImageAnalysis = true,
): Promise<PetMatch[]> {
  const matches: PetMatch[] = []

  // First, do a quick pre-filtering without image analysis
  const potentialMatches = await Promise.all(
    lostPets.map(async (lostPet) => {
      const quickMatchScore = await calculateMatchScore(lostPet, foundPet, false)
      return {
        lostPet,
        quickScore: quickMatchScore.score,
      }
    }),
  )

  // Sort by quick score and take the top candidates
  const topCandidates = potentialMatches
    .filter((match) => match.quickScore >= threshold * 0.7) // Lower threshold for pre-filtering
    .sort((a, b) => b.quickScore - a.quickScore)
    .slice(0, 10) // Limit to top 10 candidates for detailed analysis

  // Now do detailed analysis with image recognition on the top candidates
  for (const { lostPet } of topCandidates) {
    const matchScore = await calculateMatchScore(lostPet, foundPet, includeImageAnalysis)

    if (matchScore.score >= threshold) {
      matches.push({
        lostPet,
        foundPet,
        matchScore,
      })
    }
  }

  // Sort matches by score (highest first)
  return matches.sort((a, b) => b.matchScore.score - a.matchScore.score)
}
