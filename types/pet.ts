export interface Location {
  address?: string
  latitude: number
  longitude: number
}

export interface Pet {
  id: string
  type: "lost" | "found"
  name?: string
  species: string
  breed?: string
  color: string
  size: "small" | "medium" | "large"
  gender?: "male" | "female" | "unknown"
  age?: string
  description: string
  date: string
  location?: Location
  contactName: string
  contactEmail: string
  contactPhone?: string
  imageUrls?: string[]
  userId: string
  createdAt: string
  updatedAt: string
}
