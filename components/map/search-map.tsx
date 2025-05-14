"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Icon } from "leaflet"
import type { Pet } from "@/types/pet"
import Link from "next/link"

// Fix for default marker icon in Leaflet with Next.js
const defaultIcon = new Icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface SearchMapProps {
  pets: Pet[]
}

export default function SearchMap({ pets }: SearchMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Add marker icon files to public directory
    const addMarkerIcons = async () => {
      try {
        // These would normally be static files in your public directory
        // For this example, we're creating them dynamically
        const iconResponse = await fetch("https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png")
        const shadowResponse = await fetch("https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png")

        if (iconResponse.ok && shadowResponse.ok) {
          const iconBlob = await iconResponse.blob()
          const shadowBlob = await shadowResponse.blob()

          // Save blobs to IndexedDB or similar for client-side storage
          // This is a simplified example
          localStorage.setItem("leaflet-marker-icon-loaded", "true")
        }
      } catch (error) {
        console.error("Failed to load marker icons:", error)
      }
    }

    if (typeof window !== "undefined" && !localStorage.getItem("leaflet-marker-icon-loaded")) {
      addMarkerIcons()
    }
  }, [])

  // Filter out pets without valid coordinates
  const petsWithCoordinates = pets.filter((pet) => pet.location?.latitude && pet.location?.longitude)

  // Calculate center of the map based on pet locations or default to a central location in Sri Lanka
  const calculateCenter = () => {
    if (petsWithCoordinates.length === 0) {
      return [7.8731, 80.7718] // Default to central Sri Lanka (near Dambulla)
    }

    const sumLat = petsWithCoordinates.reduce((sum, pet) => sum + (pet.location?.latitude || 0), 0)
    const sumLng = petsWithCoordinates.reduce((sum, pet) => sum + (pet.location?.longitude || 0), 0)

    return [sumLat / petsWithCoordinates.length, sumLng / petsWithCoordinates.length]
  }

  const center = calculateCenter() as [number, number]

  if (!isMounted) {
    return <div className="h-96 bg-gray-100 flex items-center justify-center">Loading map...</div>
  }

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-md">
      <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {petsWithCoordinates.map((pet) => (
          <Marker
            key={pet.id}
            position={[pet.location?.latitude || 0, pet.location?.longitude || 0]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold">{pet.name || "Unnamed Pet"}</h3>
                <p className="text-sm">
                  {pet.type} - {pet.breed}
                </p>
                <p className="text-xs text-gray-600">{pet.status}</p>
                <Link href={`/pets/${pet.id}`} className="text-primary-600 hover:underline text-sm block mt-2">
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
