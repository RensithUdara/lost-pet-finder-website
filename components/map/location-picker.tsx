"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import the map component with SSR disabled
const LocationPickerMap = dynamic(() => import("./location-picker-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] rounded-md overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  ),
})

interface LocationPickerProps {
  onLocationChange: (location: { address?: string; latitude: number; longitude: number }) => void
  defaultLocation?: { address?: string; latitude: number; longitude: number }
}

export default function LocationPicker({ onLocationChange, defaultLocation }: LocationPickerProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-[300px] rounded-md overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    )
  }

  return <LocationPickerMap onLocationChange={onLocationChange} defaultLocation={defaultLocation} />
}
