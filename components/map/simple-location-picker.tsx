"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StaticMapPreview } from "./static-map-preview"

interface SimpleLocationPickerProps {
  onLocationChange: (address: string, latitude: number, longitude: number) => void
  defaultLocation?: string
  defaultCoordinates?: { latitude: number; longitude: number }
}

export default function SimpleLocationPicker({
  onLocationChange,
  defaultLocation = "",
  defaultCoordinates,
}: SimpleLocationPickerProps) {
  const [address, setAddress] = useState(defaultLocation)
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(
    defaultCoordinates || null,
  )
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (defaultCoordinates) {
      setCoordinates(defaultCoordinates)
    }
  }, [defaultCoordinates])

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }

  const searchLocation = async () => {
    if (!address.trim()) {
      setError("Please enter an address to search")
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0]
        const latitude = Number.parseFloat(lat)
        const longitude = Number.parseFloat(lon)

        setCoordinates({ latitude, longitude })
        setAddress(display_name)
        onLocationChange(display_name, latitude, longitude)
      } else {
        setError("Location not found. Please try a different address.")
      }
    } catch (error) {
      console.error("Error searching for location:", error)
      setError("Error searching for location. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setCoordinates({ latitude, longitude })

          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            )
            const data = await response.json()
            const address = data.display_name
            setAddress(address)
            onLocationChange(address, latitude, longitude)
          } catch (error) {
            console.error("Error getting address:", error)
            setError("We got your location, but couldn't determine the address.")
            onLocationChange("", latitude, longitude)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          setError("Unable to get your current location. Please enter it manually.")
        },
      )
    } else {
      setError("Your browser doesn't support geolocation. Please enter the location manually.")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      searchLocation()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2">
          <Input
            value={address}
            onChange={handleAddressChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter address or location description"
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={searchLocation} disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
        <Button type="button" variant="outline" onClick={handleUseCurrentLocation} className="w-full sm:w-auto">
          Use My Current Location
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="w-full h-64 bg-slate-100 rounded-md overflow-hidden">
        {coordinates ? (
          <StaticMapPreview
            latitude={coordinates.latitude}
            longitude={coordinates.longitude}
            zoom={15}
            width="100%"
            height="100%"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Enter an address or use your current location
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">Be as specific as possible with the location.</p>
    </div>
  )
}
