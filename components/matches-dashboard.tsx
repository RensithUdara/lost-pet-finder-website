"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Pet } from "@/lib/pet-service"
import type { PetMatch } from "@/lib/pet-matching"

interface MatchesDashboardProps {
  userPets: Pet[]
}

export default function MatchesDashboard({ userPets }: MatchesDashboardProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost")
  const [matches, setMatches] = useState<Record<string, PetMatch[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const lostPets = userPets.filter((pet) => pet.status === "lost")
  const foundPets = userPets.filter((pet) => pet.status === "found")

  useEffect(() => {
    async function fetchMatches() {
      try {
        setIsLoading(true)
        setError(null)

        const petsToFetch = activeTab === "lost" ? lostPets : foundPets
        const newMatches: Record<string, PetMatch[]> = {}

        // Fetch matches for each pet
        for (const pet of petsToFetch) {
          const response = await fetch(`/api/pets/matches?petId=${pet.id}&petType=${pet.status}&threshold=50&limit=5`)

          if (!response.ok) {
            console.error(`Failed to fetch matches for pet ${pet.id}: ${response.statusText}`)
            continue
          }

          const data = await response.json()
          newMatches[pet.id] = data.matches || []
        }

        setMatches(newMatches)
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

    if (userPets.length > 0) {
      fetchMatches()
    } else {
      setIsLoading(false)
    }
  }, [userPets, activeTab, toast, lostPets, foundPets])

  const activePets = activeTab === "lost" ? lostPets : foundPets

  if (activePets.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No {activeTab} pets found</h3>
            <p className="text-muted-foreground mb-4">You haven't reported any {activeTab} pets yet.</p>
            <Button asChild className="bg-brand-600 hover:bg-brand-700">
              <Link href={`/${activeTab}`}>Report {activeTab === "lost" ? "a Lost" : "a Found"} Pet</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="lost" className="w-full" onValueChange={(value) => setActiveTab(value as "lost" | "found")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="lost">Lost Pets</TabsTrigger>
          <TabsTrigger value="found">Found Pets</TabsTrigger>
        </TabsList>

        <TabsContent value="lost" className="mt-0 space-y-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            lostPets.map((pet) => <PetMatchesSection key={pet.id} pet={pet} matches={matches[pet.id] || []} />)
          )}
        </TabsContent>

        <TabsContent value="found" className="mt-0 space-y-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            foundPets.map((pet) => <PetMatchesSection key={pet.id} pet={pet} matches={matches[pet.id] || []} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PetMatchesSection({ pet, matches }: { pet: Pet; matches: PetMatch[] }) {
  // Ensure pet.images is an array
  const petImage = Array.isArray(pet.images) && pet.images.length > 0 ? pet.images[0] : pet.image || "/placeholder.svg"

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 relative rounded-full overflow-hidden">
          <Image
            src={petImage || "/placeholder.svg"}
            alt={pet.name || `${pet.type} - ${pet.breed}`}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium">{pet.name || `${pet.type} - ${pet.breed}`}</h3>
          <p className="text-sm text-muted-foreground">
            {pet.status === "lost"
              ? `Lost on ${new Date(pet.lastSeen || "").toLocaleDateString()}`
              : `Found on ${new Date(pet.foundDate || "").toLocaleDateString()}`}
          </p>
        </div>
        <div className="ml-auto">
          <Button asChild variant="outline" size="sm">
            <Link href={`/pets/${pet.id}`}>View Pet</Link>
          </Button>
        </div>
      </div>

      {matches.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => {
            const matchPet = pet.status === "lost" ? match.foundPet : match.lostPet

            // Ensure matchPet.images is an array
            const matchPetImage =
              Array.isArray(matchPet.images) && matchPet.images.length > 0
                ? matchPet.images[0]
                : matchPet.image || "/placeholder.svg"

            return (
              <Card key={matchPet.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={matchPetImage || "/placeholder.svg"}
                    alt={matchPet.name || `${matchPet.type} - ${matchPet.breed}`}
                    fill
                    className="object-cover"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${
                      matchPet.status === "lost" ? "bg-coral-500 hover:bg-coral-600" : "bg-brand-500 hover:bg-brand-600"
                    }`}
                  >
                    {matchPet.status === "lost" ? "Lost" : "Found"}
                  </Badge>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs">Match Score</span>
                      <span className="text-white text-xs font-bold">{match.matchScore.score}%</span>
                    </div>
                    <Progress value={match.matchScore.score} className="h-1 mt-1" />
                  </div>
                </div>
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm">{matchPet.name || `${matchPet.type} - ${matchPet.breed}`}</h4>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MapPin className="mr-1 h-3 w-3" />
                    {matchPet.location}
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button asChild size="sm" className="bg-brand-600 hover:bg-brand-700">
                      <Link href={`/pets/${matchPet.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <p className="text-center text-sm text-muted-foreground py-4">
              No potential matches found for this pet yet. Check back later as more pets are reported.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
