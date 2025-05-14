"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, ExternalLink, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface SimpleLocationDisplayProps {
  location: {
    address?: string
    latitude: number
    longitude: number
  }
}

export default function SimpleLocationDisplay({ location }: SimpleLocationDisplayProps) {
  const { address, latitude, longitude } = location
  const [expanded, setExpanded] = useState(false)

  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, "_blank")
  }

  const openInOpenStreetMap = () => {
    window.open(`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`, "_blank")
  }

  // Generate static map URL
  const mapWidth = 600
  const mapHeight = 300
  const zoom = 15
  const staticMapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=${mapWidth}&height=${mapHeight}&center=lonlat:${longitude},${latitude}&zoom=${zoom}&marker=lonlat:${longitude},${latitude};color:%23ff0000;size:large&apiKey=15e7bd2dbe4c4cde9d3dc4c6fadf4895`

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium mb-1">Location</h3>
            {address && <p className="text-sm text-muted-foreground mb-1">{address}</p>}
            <p className="text-xs text-muted-foreground mb-3">
              Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={openInGoogleMaps} variant="outline" size="sm" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                Google Maps
              </Button>
              <Button onClick={openInOpenStreetMap} variant="outline" size="sm" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                OpenStreetMap
              </Button>
              <Button onClick={() => setExpanded(!expanded)} variant="outline" size="sm" className="text-xs">
                {expanded ? (
                  <>
                    <Minimize2 className="h-3 w-3 mr-1" />
                    Hide Map
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3 w-3 mr-1" />
                    Show Map
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 rounded-md overflow-hidden border">
            <div className="relative w-full aspect-[2/1]">
              <Image
                src={staticMapUrl || "/placeholder.svg"}
                alt={`Map showing location at ${latitude}, ${longitude}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-muted p-2 text-xs text-muted-foreground">
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}
