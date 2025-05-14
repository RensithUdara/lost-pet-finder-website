"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, AlertCircle, RefreshCw } from "lucide-react"
import type { Pet } from "@/lib/pet-service"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { useClientAnimation } from "@/lib/motion"

// Fallback data in case the API fails
const fallbackLostPets: Pet[] = [
  {
    id: "1",
    name: "Max",
    type: "Dog",
    breed: "Golden Retriever",
    color: "Golden",
    gender: "male",
    lastSeen: "2023-05-10",
    location: "Central Park, New York",
    description: "Friendly dog with a red collar. Responds to his name.",
    status: "lost",
    images: ["/golden-retriever.png"],
    contactName: "John Smith",
    contactEmail: "john@example.com",
    contactPhone: "(555) 123-4567",
    createdAt: Date.now(),
  },
  {
    id: "2",
    name: "Luna",
    type: "Cat",
    breed: "Siamese",
    color: "Cream with brown points",
    gender: "female",
    lastSeen: "2023-05-12",
    location: "Main Street, Boston",
    description: "Shy cat with blue eyes. Has a pink collar with a bell.",
    status: "lost",
    images: ["/siamese-cat.png"],
    contactName: "Sarah Johnson",
    contactEmail: "sarah@example.com",
    contactPhone: "(555) 987-6543",
    createdAt: Date.now(),
  },
  {
    id: "3",
    name: "Buddy",
    type: "Dog",
    breed: "Labrador",
    color: "Black",
    gender: "male",
    lastSeen: "2023-05-15",
    location: "Lincoln Park, Chicago",
    description: "Energetic dog with a blue collar. Has a small white spot on chest.",
    status: "lost",
    images: ["/black-labrador.png"],
    contactName: "Michael Brown",
    contactEmail: "michael@example.com",
    contactPhone: "(555) 456-7890",
    createdAt: Date.now(),
  },
]

const fallbackFoundPets: Pet[] = [
  {
    id: "4",
    type: "Cat",
    breed: "Tabby",
    color: "Orange and white",
    gender: "unknown",
    foundDate: "2023-05-11",
    location: "Riverside Park, New York",
    description: "Friendly cat found wandering in the park. No collar.",
    status: "found",
    images: ["/orange-tabby-cat.png"],
    contactName: "Emily Davis",
    contactEmail: "emily@example.com",
    contactPhone: "(555) 234-5678",
    createdAt: Date.now(),
  },
  {
    id: "5",
    type: "Dog",
    breed: "Beagle",
    color: "Tricolor",
    gender: "male",
    foundDate: "2023-05-13",
    location: "Downtown, San Francisco",
    description: "Small beagle with brown collar, no tags. Very friendly.",
    status: "found",
    images: ["/beagle-dog.png"],
    contactName: "David Wilson",
    contactEmail: "david@example.com",
    contactPhone: "(555) 345-6789",
    createdAt: Date.now(),
  },
  {
    id: "6",
    type: "Cat",
    breed: "Unknown",
    color: "Black and white",
    gender: "female",
    foundDate: "2023-05-16",
    location: "Memorial Park, Houston",
    description: "Tuxedo cat found near the playground. Has a red collar with bell.",
    status: "found",
    images: ["/tuxedo-cat.png"],
    contactName: "Jessica Martinez",
    contactEmail: "jessica@example.com",
    contactPhone: "(555) 567-8901",
    createdAt: Date.now(),
  },
]

export default function RecentPets() {
  const [activeTab, setActiveTab] = useState("lost")
  const [lostPets, setLostPets] = useState<Pet[]>(fallbackLostPets) // Start with fallback data
  const [foundPets, setFoundPets] = useState<Pet[]>(fallbackFoundPets) // Start with fallback data
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const { toast } = useToast()

  // Function to handle retrying the fetch
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    setError(null)
    setIsLoading(true)
    toast({
      title: "Retrying...",
      description: "Attempting to fetch pets again.",
    })
  }

  useEffect(() => {
    let isMounted = true

    async function fetchPets() {
      try {
        if (!isMounted) return

        setIsLoading(true)

        // Fetch lost pets with a timeout and error handling
        let lostPets = fallbackLostPets
        try {
          const lostResponse = await fetch("/api/pets?status=lost&limit=3", {
            signal: AbortSignal.timeout(3000), // 3 second timeout
          })

          if (lostResponse.ok) {
            const data = await lostResponse.json()
            if (data.pets && data.pets.length > 0) {
              lostPets = data.pets
            }
          } else {
            console.warn(`Failed to fetch lost pets: ${lostResponse.status}`)
          }
        } catch (err) {
          console.error("Error fetching lost pets:", err)
          // Continue with fallback data
        }

        // Fetch found pets with a timeout and error handling
        let foundPets = fallbackFoundPets
        try {
          const foundResponse = await fetch("/api/pets?status=found&limit=3", {
            signal: AbortSignal.timeout(3000), // 3 second timeout
          })

          if (foundResponse.ok) {
            const data = await foundResponse.json()
            if (data.pets && data.pets.length > 0) {
              foundPets = data.pets
            }
          } else {
            console.warn(`Failed to fetch found pets: ${foundResponse.status}`)
          }
        } catch (err) {
          console.error("Error fetching found pets:", err)
          // Continue with fallback data
        }

        // Update state if component is still mounted
        if (isMounted) {
          setLostPets(lostPets)
          setFoundPets(foundPets)
          setIsLoading(false)
          setError(null)
        }
      } catch (err) {
        console.error("Unexpected error in fetchPets:", err)

        if (isMounted) {
          setIsLoading(false)
          setError("Unable to load pets. Using sample data instead.")
        }
      }
    }

    fetchPets()

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false
    }
  }, [retryCount])

  return (
    <Tabs defaultValue="lost" className="w-full" onValueChange={setActiveTab}>
      <div className="flex justify-center mb-8">
        <TabsList>
          <TabsTrigger value="lost" className="px-8">
            Lost Pets
          </TabsTrigger>
          <TabsTrigger value="found" className="px-8">
            Found Pets
          </TabsTrigger>
        </TabsList>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-amber-800">{error}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Retry
            </Button>
          </div>
        </div>
      )}

      <TabsContent value="lost" className="mt-0">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => <PetCardSkeleton key={i} />)
            : lostPets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
        </div>
      </TabsContent>

      <TabsContent value="found" className="mt-0">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => <PetCardSkeleton key={i} />)
            : foundPets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
        </div>
      </TabsContent>
    </Tabs>
  )
}

function PetCard({ pet }: { pet: Pet }) {
  const shouldAnimate = useClientAnimation()
  // Get the first image from the images array, or use the legacy image field, or use a placeholder
  const imageUrl = pet.images && pet.images.length > 0 ? pet.images[0] : pet.image || "/placeholder.svg"

  const CardComponent = shouldAnimate ? motion.div : "div"

  return (
    <CardComponent
      initial={shouldAnimate ? { opacity: 0, y: 20 } : undefined}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.3 }}
      whileHover={shouldAnimate ? { y: -5, transition: { duration: 0.2 } } : undefined}
      className="overflow-hidden"
    >
      <Card className="overflow-hidden h-full">
        <div className="aspect-square relative">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={pet.name || `${pet.type} - ${pet.breed}`}
            fill
            className="object-cover"
          />
          <Badge
            className={`absolute top-2 right-2 ${
              pet.status === "lost" ? "bg-coral-500 hover:bg-coral-600" : "bg-brand-500 hover:bg-brand-600"
            }`}
          >
            {pet.status === "lost" ? "Lost" : "Found"}
          </Badge>
        </div>
        <CardHeader className="p-4">
          <CardTitle className="flex justify-between items-center">
            <span>{pet.name || `${pet.type} - ${pet.breed}`}</span>
            <Badge variant="outline">{pet.type}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            {pet.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            {pet.status === "lost"
              ? `Last seen: ${new Date(pet.lastSeen || "").toLocaleDateString()}`
              : `Found on: ${new Date(pet.foundDate || "").toLocaleDateString()}`}
          </div>
          <p className="text-sm line-clamp-2">{pet.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button asChild className="w-full bg-brand-600 hover:bg-brand-700 transition-colors duration-300">
            <Link href={`/pets/${pet.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </CardComponent>
  )
}

function PetCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}
