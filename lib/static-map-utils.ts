interface StaticMapOptions {
  latitude: number
  longitude: number
  zoom?: number
  width?: number
  height?: number
  markers?: Array<{
    latitude: number
    longitude: number
    color?: string
    label?: string
  }>
}

export function getStaticMapUrl(options: StaticMapOptions): string {
  const { latitude, longitude, zoom = 14, width = 600, height = 300, markers = [{ latitude, longitude }] } = options

  // Base URL for the Geoapify Static Maps API
  const baseUrl = "https://maps.geoapify.com/v1/staticmap"

  // API key - in a real app, this would be an environment variable
  // For this demo, we'll use a placeholder
  const apiKey = "YOUR_GEOAPIFY_API_KEY"

  // Build the marker string
  const markerString = markers
    .map((marker) => {
      const color = marker.color || "red"
      const label = marker.label || ""
      return `lonlat:${marker.longitude},${marker.latitude};color:%23${color.replace("#", "")};size:medium${label ? `;text:${label}` : ""}`
    })
    .join("|")

  // Build the URL
  const url = `${baseUrl}?style=osm-carto&width=${width}&height=${height}&center=lonlat:${longitude},${latitude}&zoom=${zoom}&marker=${markerString}&apiKey=${apiKey}`

  // For demo purposes, if no API key is provided, use a placeholder image
  if (apiKey === "YOUR_GEOAPIFY_API_KEY") {
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+f00(${longitude},${latitude})/${longitude},${latitude},${zoom},0/${width}x${height}?access_token=pk.placeholder`
  }

  return url
}

// Function to get a static map with multiple markers
export function getMultiMarkerMapUrl(
  markers: Array<{ latitude: number; longitude: number; color?: string; label?: string }>,
  width = 600,
  height = 300,
): string {
  if (markers.length === 0) {
    return ""
  }

  // Calculate the center point and zoom level to fit all markers
  const bounds = getBounds(markers)
  const center = {
    latitude: (bounds.north + bounds.south) / 2,
    longitude: (bounds.east + bounds.west) / 2,
  }

  // Calculate appropriate zoom level based on bounds
  const zoom = calculateZoom(bounds, { width, height })

  return getStaticMapUrl({
    latitude: center.latitude,
    longitude: center.longitude,
    zoom,
    width,
    height,
    markers,
  })
}

// Helper function to calculate bounds from a set of markers
function getBounds(markers: Array<{ latitude: number; longitude: number }>): {
  north: number
  south: number
  east: number
  west: number
} {
  let north = -90
  let south = 90
  let east = -180
  let west = 180

  markers.forEach((marker) => {
    if (marker.latitude > north) north = marker.latitude
    if (marker.latitude < south) south = marker.latitude
    if (marker.longitude > east) east = marker.longitude
    if (marker.longitude < west) west = marker.longitude
  })

  return { north, south, east, west }
}

// Helper function to calculate an appropriate zoom level
function calculateZoom(
  bounds: { north: number; south: number; east: number; west: number },
  viewport: { width: number; height: number },
): number {
  const WORLD_DIM = { height: 256, width: 256 }
  const ZOOM_MAX = 18

  const latRad = (lat: number) => {
    const sin = Math.sin((lat * Math.PI) / 180)
    const radX2 = Math.log((1 + sin) / (1 - sin)) / 2
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2
  }

  const latDiff = bounds.north - bounds.south
  const lngDiff = bounds.east - bounds.west

  const latZoom = Math.log2((viewport.height * 0.9) / WORLD_DIM.height / latDiff)
  const lngZoom = Math.log2((viewport.width * 0.9) / WORLD_DIM.width / lngDiff)

  const zoom = Math.min(latZoom, lngZoom, ZOOM_MAX)

  return Math.floor(zoom)
}
