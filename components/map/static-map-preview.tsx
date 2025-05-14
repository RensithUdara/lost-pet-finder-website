import { getStaticMapUrl } from "@/lib/static-map-utils"

interface StaticMapPreviewProps {
  latitude: number
  longitude: number
  zoom?: number
  width?: string | number
  height?: string | number
  className?: string
}

export function StaticMapPreview({
  latitude,
  longitude,
  zoom = 14,
  width = 600,
  height = 300,
  className,
}: StaticMapPreviewProps) {
  const mapUrl = getStaticMapUrl({
    latitude,
    longitude,
    zoom,
    width: typeof width === "number" ? width : 600,
    height: typeof height === "number" ? height : 300,
  })

  return (
    <div
      className={className}
      style={{
        width: width,
        height: height,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={mapUrl || "/placeholder.svg"}
        alt={`Map showing location at ${latitude},${longitude}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "5px",
          right: "5px",
          background: "rgba(255, 255, 255, 0.7)",
          padding: "2px 5px",
          fontSize: "10px",
          borderRadius: "3px",
        }}
      >
        © OpenStreetMap contributors
      </div>
    </div>
  )
}
