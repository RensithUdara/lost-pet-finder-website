/**
 * Calculate the Levenshtein distance between two strings
 * @param a First string
 * @param b Second string
 * @returns The Levenshtein distance
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(null))

  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[j][0] = j
  }

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + substitutionCost, // substitution
      )
    }
  }

  return matrix[b.length][a.length]
}

/**
 * Calculate text similarity between two strings
 * @param text1 First string
 * @param text2 Second string
 * @returns A similarity score between 0 and 1
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0

  // Normalize strings
  const a = text1.toLowerCase().trim()
  const b = text2.toLowerCase().trim()

  if (a === b) return 1

  // Calculate Levenshtein distance
  const distance = levenshteinDistance(a, b)

  // Calculate similarity score
  const maxLength = Math.max(a.length, b.length)
  if (maxLength === 0) return 1

  return 1 - distance / maxLength
}

/**
 * Calculate distance between two locations
 * This is a placeholder for a more sophisticated geolocation function
 * In a real application, you would use geocoding to convert addresses to coordinates
 * @param location1 First location
 * @param location2 Second location
 * @returns A similarity score between 0 and 1
 */
export function calculateLocationSimilarity(location1: string, location2: string): number {
  return calculateTextSimilarity(location1, location2)
}
