import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { generateMultiMarkerMapUrl } from "@/lib/static-map-utils"

interface SearchResultsMapProps {
  pets: Array<{
    id: string
    name?: string
    location?: {
      latitude: number
      longitude: number
    }
  }>
}

export default function SearchResultsMap({ pets }: SearchResultsMapProps) {
  // Filter pets that have location data
  const petsWithLocation = pets.filter((pet) => pet.location?.latitude && pet.location?.longitude)

  if (petsWithLocation.length === 0) {
    return null
  }

  // Extract location data for the map
  const markers = petsWithLocation.map((pet) => ({
    latitude: pet.location!.latitude,
    longitude: pet.location!.longitude,
  }))

  // Generate the static map URL
  const mapUrl = generateMultiMarkerMapUrl(markers, 800, 400)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Pet Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-[2/1] rounded-md overflow-hidden">
          <Image src={mapUrl || "/placeholder.svg"} alt="Map showing pet locations" fill className="object-cover" />
        </div>
        <div className="bg-muted p-2 text-xs text-muted-foreground mt-1 rounded-md">
          ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            OpenStreetMap
          </a>{" "}
          contributors
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Showing locations for {petsWithLocation.length} of {pets.length} pets
        </p>
      </CardContent>
    </Card>
  )
}
