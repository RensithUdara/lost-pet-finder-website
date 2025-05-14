import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Pet } from "./pet-service"

/**
 * Compare two pet images and determine their visual similarity
 * @param image1Url URL of the first pet image
 * @param image2Url URL of the second pet image
 * @returns A similarity score between 0 and 1
 */
export async function comparePetImages(image1Url: string, image2Url: string): Promise<number> {
  try {
    // Skip comparison if either URL is missing or is a placeholder
    if (!image1Url || !image2Url || image1Url.includes("placeholder") || image2Url.includes("placeholder")) {
      return 0
    }

    // Use AI SDK to analyze the images
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        I need to compare two pet images to determine if they might be the same animal.
        Image 1: ${image1Url}
        Image 2: ${image2Url}
        
        Analyze both images and determine the likelihood that they show the same pet.
        Consider factors like:
        - Breed characteristics
        - Coat color and pattern
        - Distinctive markings
        - Body shape and size
        - Facial features
        
        Return ONLY a similarity score between 0 and 1, where:
        0 = Definitely different pets
        0.5 = Could be the same pet
        1 = Almost certainly the same pet
        
        Just return the number, nothing else.
      `,
    })

    // Parse the response to get the similarity score
    const score = Number.parseFloat(text.trim())
    return isNaN(score) ? 0 : Math.max(0, Math.min(1, score)) // Ensure score is between 0 and 1
  } catch (error) {
    console.error("Error comparing pet images:", error)
    return 0 // Return 0 if there's an error
  }
}

/**
 * Extract features from a pet image
 * @param imageUrl URL of the pet image
 * @returns An object containing extracted features
 */
export async function extractPetFeatures(imageUrl: string): Promise<{
  detectedBreed: string
  detectedColor: string
  distinctiveFeatures: string[]
  confidence: number
} | null> {
  try {
    // Skip extraction if URL is missing or is a placeholder
    if (!imageUrl || imageUrl.includes("placeholder")) {
      return null
    }

    // Use AI SDK to analyze the image
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Analyze this pet image: ${imageUrl}
        
        Extract the following information:
        1. Most likely breed or breed mix
        2. Coat color and pattern
        3. Any distinctive features or markings
        4. Your confidence level in this assessment (0-1)
        
        Format your response as JSON:
        {
          "detectedBreed": "breed name",
          "detectedColor": "color description",
          "distinctiveFeatures": ["feature1", "feature2"],
          "confidence": 0.8
        }
      `,
    })

    // Parse the JSON response
    try {
      return JSON.parse(text.trim())
    } catch (parseError) {
      console.error("Error parsing pet features response:", parseError)
      return null
    }
  } catch (error) {
    console.error("Error extracting pet features:", error)
    return null
  }
}

/**
 * Calculate image similarity score between two pets
 * @param pet1 First pet
 * @param pet2 Second pet
 * @returns A promise resolving to a similarity score between 0 and 1
 */
export async function calculatePetImageSimilarity(
  pet1: Pet,
  pet2: Pet,
): Promise<{
  score: number
  confidence: number
  reasons: string[]
}> {
  try {
    const reasons: string[] = []

    // Check if both pets have images
    if (!pet1.images?.length || !pet2.images?.length) {
      return { score: 0, confidence: 0, reasons: ["One or both pets don't have images"] }
    }

    // Get the primary images for each pet
    const pet1Image = pet1.images[0]
    const pet2Image = pet2.images[0]

    // Compare the primary images
    const similarityScore = await comparePetImages(pet1Image, pet2Image)

    // Extract features from both images for more detailed comparison
    const pet1Features = await extractPetFeatures(pet1Image)
    const pet2Features = await extractPetFeatures(pet2Image)

    let confidence = 0.5 // Default confidence

    // If we have features for both pets, use them to refine our assessment
    if (pet1Features && pet2Features) {
      confidence = (pet1Features.confidence + pet2Features.confidence) / 2

      // Add reasons based on extracted features
      if (
        pet1Features.detectedBreed.toLowerCase().includes(pet2Features.detectedBreed.toLowerCase()) ||
        pet2Features.detectedBreed.toLowerCase().includes(pet1Features.detectedBreed.toLowerCase())
      ) {
        reasons.push(`Similar detected breed: ${pet1Features.detectedBreed} and ${pet2Features.detectedBreed}`)
      }

      if (
        pet1Features.detectedColor.toLowerCase().includes(pet2Features.detectedColor.toLowerCase()) ||
        pet2Features.detectedColor.toLowerCase().includes(pet1Features.detectedColor.toLowerCase())
      ) {
        reasons.push(`Similar coat color: ${pet1Features.detectedColor} and ${pet2Features.detectedColor}`)
      }

      // Check for common distinctive features
      const commonFeatures = pet1Features.distinctiveFeatures.filter((feature) =>
        pet2Features.distinctiveFeatures.some((f) => f.toLowerCase().includes(feature.toLowerCase())),
      )

      if (commonFeatures.length > 0) {
        reasons.push(`Shared distinctive features: ${commonFeatures.join(", ")}`)
      }
    }

    // Add a reason based on the overall similarity score
    if (similarityScore > 0.8) {
      reasons.push("Images show very similar pets")
    } else if (similarityScore > 0.5) {
      reasons.push("Images show moderately similar pets")
    } else if (similarityScore > 0.3) {
      reasons.push("Images show somewhat similar pets")
    } else {
      reasons.push("Images show different pets")
    }

    return {
      score: similarityScore,
      confidence,
      reasons,
    }
  } catch (error) {
    console.error("Error calculating pet image similarity:", error)
    return { score: 0, confidence: 0, reasons: ["Error processing images"] }
  }
}
