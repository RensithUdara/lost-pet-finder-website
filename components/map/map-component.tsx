"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import the map component with SSR disabled
const MapWithNoSSR = dynamic(() => import("./map-with-no-ssr"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] rounded-md overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  ),
})

interface MapComponentProps {
  location: { latitude: number; longitude: number }
  popupContent?: string
  height?: string
  zoom?: number
}

export default function MapComponent({ location, popupContent, height = "300px", zoom = 13 }: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full rounded-md overflow-hidden" style={{ height }}>
        <Skeleton className="w-full h-full" />
      </div>
    )
  }

  return <MapWithNoSSR location={location} popupContent={popupContent} height={height} zoom={zoom} />
}
