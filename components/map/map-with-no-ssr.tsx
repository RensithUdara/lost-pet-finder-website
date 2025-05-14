"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet icon issues
const icon = L.icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface MapWithNoSSRProps {
  location: { latitude: number; longitude: number }
  popupContent?: string
  height: string
  zoom: number
}

export default function MapWithNoSSR({ location, popupContent, height, zoom }: MapWithNoSSRProps) {
  const position: [number, number] = [location.latitude, location.longitude]

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer center={position} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon}>
          {popupContent && <Popup>{popupContent}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  )
}
