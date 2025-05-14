"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Calendar, AlertCircle, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Pet } from "@/lib/pet-service"
import type { PetMatch } from "@/lib/pet-matching"

interface PetMatchesProps {
  pet: Pet
  limit?: number
  threshold?: number
  skipImageAnalysis?: boolean
}

export default function PetMatches({ pet, limit = 3, threshold = 50, skipImageAnalysis = false }: PetMatchesProps) {
  const { toast } = useToast()
  const [matches, setMatches] = useState<PetMatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatches() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(
          `/api/pets/matches?petId=${pet.id}&petType=${pet.status}&threshold=${threshold}&limit=${limit}&skipImageAnalysis=${skipImageAnalysis}`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch matches: ${response.statusText}`)
        }

        const data = await response.json()
        setMatches(data.matches || [])
      } catch (error) {
        console.error("Error fetching pet matches:", error)
        setError("Failed to load potential matches")
        toast({
          title: "Error",
          description: "Failed to load potential matches. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (pet && pet.id) {
      fetchMatches()
    }
  }, [pet, limit, threshold, skipImageAnalysis, toast])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Potential Matches</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(limit)
            .fill(0)
            .map((_, i) => (
              <MatchCardSkeleton key={i} />
            ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Potential Matches</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Potential Matches</h2>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No potential matches found</h3>
              <p className="text-muted-foreground">
                We couldn't find any potential matches for this pet at this time. Check back later as more pets are
                reported.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Potential Matches</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <MatchCard key={match.lostPet.id + match.foundPet.id} match={match} currentPetStatus={pet.status} />
        ))}
      </div>
    </div>
  )
}

function MatchCard({ match, currentPetStatus }: { match: PetMatch; currentPetStatus: "lost" | "found" }) {
  // Determine which pet to display based on the current pet status
  const displayPet = currentPetStatus === "lost" ? match.foundPet : match.lostPet
  const matchType = currentPetStatus === "lost" ? "found" : "lost"

  // Ensure pet.images is an array
  const petImage =
    Array.isArray(displayPet.images) && displayPet.images.length > 0
      ? displayPet.images[0]
      : displayPet.image || "/placeholder.svg"

  // Check if we have image similarity data
  const hasImageSimilarity = match.matchScore.imageSimilarity !== undefined

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <Image
          src={petImage || "/placeholder.svg"}
          alt={displayPet.name || `${displayPet.type} - ${displayPet.breed}`}
          fill
          className="object-cover"
        />
        <Badge
          className={`absolute top-2 right-2 ${
            matchType === "lost" ? "bg-coral-500 hover:bg-coral-600" : "bg-brand-500 hover:bg-brand-600"
          }`}
        >
          {matchType === "lost" ? "Lost" : "Found"}
        </Badge>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Match Score</span>
            <span className="text-white font-bold">{match.matchScore.score}%</span>
          </div>
          <Progress value={match.matchScore.score} className="h-2 mt-1" />
        </div>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="flex justify-between items-center">
          <span>{displayPet.name || `${displayPet.type} - ${displayPet.breed}`}</span>
          <Badge variant="outline">{displayPet.type}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          {displayPet.location}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          {matchType === "lost"
            ? `Last seen: ${new Date(displayPet.lastSeen || "").toLocaleDateString()}`
            : `Found on: ${new Date(displayPet.foundDate || "").toLocaleDateString()}`}
        </div>

        {/* Image similarity section */}
        {hasImageSimilarity && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-sm font-medium">
                <Camera className="mr-1 h-4 w-4" />
                Visual Similarity
              </div>
              <span className="text-sm font-bold">{Math.round(match.matchScore.imageSimilarity!.score * 100)}%</span>
            </div>
            <Progress value={match.matchScore.imageSimilarity!.score * 100} className="h-2 mb-2" />
            {match.matchScore.imageSimilarity!.reasons.length > 0 && (
              <p className="text-xs text-muted-foreground">{match.matchScore.imageSimilarity!.reasons[0]}</p>
            )}
          </div>
        )}

        <div className="mt-2">
          <p className="text-sm font-medium">Why this is a match:</p>
          <ul className="text-xs text-muted-foreground list-disc list-inside">
            {match.matchScore.reasons.slice(0, 3).map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
            {match.matchScore.reasons.length > 3 && <li>...and {match.matchScore.reasons.length - 3} more reasons</li>}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-brand-600 hover:bg-brand-700">
          <Link href={`/pets/${displayPet.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function MatchCardSkeleton() {
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
        <Skeleton className="h-4 w-full mt-3" />
        <Skeleton className="h-2 w-full" />
        <div className="mt-2">
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}
