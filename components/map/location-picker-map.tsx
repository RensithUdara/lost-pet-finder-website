"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

// Fix Leaflet icon issues
const icon = L.icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface LocationPickerMapProps {
  onLocationChange: (location: { address?: string; latitude: number; longitude: number }) => void
  defaultLocation?: { address?: string; latitude: number; longitude: number }
}

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function LocationPickerMap({ onLocationChange, defaultLocation }: LocationPickerMapProps) {
  const [position, setPosition] = useState<[number, number]>(
    defaultLocation ? [defaultLocation.latitude, defaultLocation.longitude] : [6.9271, 79.8612], // Colombo, Sri Lanka
  )
  const [address, setAddress] = useState<string>(defaultLocation?.address || "")
  const [searchInput, setSearchInput] = useState<string>("")
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    // Try to get user's location if no default location
    if (!defaultLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setPosition([latitude, longitude])
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13)
          }
        },
        (error) => {
          console.error("Error getting user location:", error)
        },
      )
    }
  }, [defaultLocation])

  const handleLocationSelect = (lat: number, lng: number) => {
    setPosition([lat, lng])

    // Reverse geocode to get address
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then((response) => response.json())
      .then((data) => {
        const addressText = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        setAddress(addressText)
        onLocationChange({ address: addressText, latitude: lat, longitude: lng })
      })
      .catch((error) => {
        console.error("Error reverse geocoding:", error)
        setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        onLocationChange({ latitude: lat, longitude: lng })
      })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) return

    // Geocode the address
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { lat, lon, display_name } = data[0]
          const latitude = Number.parseFloat(lat)
          const longitude = Number.parseFloat(lon)

          setPosition([latitude, longitude])
          setAddress(display_name)
          onLocationChange({ address: display_name, latitude, longitude })

          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13)
          }
        }
      })
      .catch((error) => {
        console.error("Error geocoding address:", error)
      })
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for an address"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>

      <div className="h-[300px] rounded-md overflow-hidden border">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(map) => {
            mapRef.current = map
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={icon} />
          <MapEvents onLocationSelect={handleLocationSelect} />
        </MapContainer>
      </div>

      {address && (
        <div className="text-sm">
          <p className="font-medium">Selected Location:</p>
          <p className="text-muted-foreground">{address}</p>
        </div>
      )}
    </div>
  )
}
