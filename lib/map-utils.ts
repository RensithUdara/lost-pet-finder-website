/**
 * Geocodes an address to get latitude and longitude
 * @param address The address to geocode
 * @returns Promise with latitude and longitude or null if geocoding fails
 */
export async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
    )
    const data = await response.json()

    if (data && data.length > 0) {
      const { lat, lon } = data[0]
      return {
        latitude: Number.parseFloat(lat),
        longitude: Number.parseFloat(lon),
      }
    }
    return null
  } catch (error) {
    console.error("Error geocoding address:", error)
    return null
  }
}

/**
 * Reverse geocodes coordinates to get an address
 * @param latitude The latitude coordinate
 * @param longitude The longitude coordinate
 * @returns Promise with address string or null if reverse geocoding fails
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
    )
    const data = await response.json()

    if (data && data.display_name) {
      return data.display_name
    }
    return null
  } catch (error) {
    console.error("Error reverse geocoding:", error)
    return null
  }
}

/**
 * Calculates the distance between two coordinates in kilometers
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return distance
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}
