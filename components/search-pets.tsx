"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { MapPin, Calendar, SearchIcon, Loader2, MapIcon, Info } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { DistrictSelector } from "@/components/district-selector"
import type { Pet, PetStatus } from "@/lib/pet-service"

// DEMO MODE CONFIGURATION
// Set this to false when the API is fixed to re-enable real data fetching
const DEMO_MODE = true
const DEMO_MODE_MESSAGE = "Demo Mode: Using sample data while we improve our database connection."

export default function SearchPets() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<PetStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [petType, setPetType] = useState("all")
  const [location, setLocation] = useState("")
  const [district, setDistrict] = useState("")
  const [distance, setDistance] = useState([25])
  const [dateRange, setDateRange] = useState("any")
  const [showMap, setShowMap] = useState(false)

  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(3)
  const [isSearching, setIsSearching] = useState(false)

  const petsPerPage = 9

  // Initial data load
  useEffect(() => {
    loadPets()
  }, [activeTab, currentPage])

  // Function to load pets (either from API or mock data)
  const loadPets = async () => {
    setIsLoading(true)

    try {
      if (DEMO_MODE) {
        // In demo mode, use mock data with a slight delay to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 500))
        const mockPets = getMockPets(activeTab, petsPerPage, currentPage)
        setPets(mockPets)
      } else {
        // Only try to fetch from API if not in demo mode
        await fetchFromAPI()
      }
    } catch (error) {
      console.error("Error loading pets:", error)
      // Fallback to mock data if API fails
      const mockPets = getMockPets(activeTab, petsPerPage, currentPage)
      setPets(mockPets)

      // Show toast only if we were trying to use the real API
      if (!DEMO_MODE) {
        toast({
          title: "Connection issue",
          description: "Using sample data due to connection issues.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Function to fetch from API (only used when DEMO_MODE is false)
  const fetchFromAPI = async () => {
    // Build the query parameters
    const params = new URLSearchParams()

    // Add status filter if not "all"
    if (activeTab !== "all") {
      params.append("status", activeTab)
    }

    // Add pagination
    const offset = (currentPage - 1) * petsPerPage
    params.append("limit", petsPerPage.toString())
    params.append("offset", offset.toString())

    // Fetch the data
    const response = await fetch(`/api/pets?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch pets: ${response.status}`)
    }

    const data = await response.json()
    setPets(data.pets || [])

    // Calculate total pages
    const total = data.pagination?.total || 30
    setTotalPages(Math.max(1, Math.ceil(total / petsPerPage)))
  }

  // Function to search pets with filters
  const searchPets = async () => {
    try {
      setIsSearching(true)

      // In demo mode or if API fails, use filtered mock data
      const filteredPets = getMockPets(activeTab, petsPerPage, 1, {
        query: searchQuery,
        type: petType,
        location: location,
        district: district,
        dateRange: dateRange,
      })

      // Reset to first page when searching
      setCurrentPage(1)
      setPets(filteredPets)

      // Show toast if no results
      if (filteredPets.length === 0) {
        toast({
          title: "No results found",
          description: "Try adjusting your search filters.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error searching pets:", error)
      toast({
        title: "Search Error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Function to get mock pets for demo mode or fallback
  const getMockPets = (
    status: string,
    limit: number,
    page = 1,
    filters: {
      query?: string
      type?: string
      location?: string
      district?: string
      dateRange?: string
    } = {},
  ): Pet[] => {
    // Create a large pool of mock pets to filter from
    const mockPool: Pet[] = []

    // Use filters or default values
    const searchTerm = filters.query?.toLowerCase() || ""
    const petTypeFilter = filters.type === "all" ? "" : filters.type?.toLowerCase() || ""
    const locationFilter = filters.district ? `${filters.district}, Sri Lanka` : filters.location || ""

    // Create different types of pets
    const petTypes = ["Dog", "Cat", "Bird", "Rabbit", "Other"]
    const dogBreeds = [
      "Labrador",
      "German Shepherd",
      "Golden Retriever",
      "Bulldog",
      "Poodle",
      "Beagle",
      "Husky",
      "Rottweiler",
    ]
    const catBreeds = [
      "Persian",
      "Siamese",
      "Maine Coon",
      "Ragdoll",
      "Bengal",
      "Sphynx",
      "British Shorthair",
      "Abyssinian",
    ]
    const birdBreeds = ["Parrot", "Canary", "Finch", "Budgerigar", "Cockatiel", "Lovebird"]
    const rabbitBreeds = ["Holland Lop", "Mini Rex", "Netherland Dwarf", "Flemish Giant", "Dutch"]
    const colors = ["Black", "White", "Brown", "Golden", "Gray", "Cream", "Orange", "Spotted", "Striped", "Mixed"]

    // Sri Lankan locations
    const locations = [
      "Colombo, Sri Lanka",
      "Kandy, Sri Lanka",
      "Galle, Sri Lanka",
      "Jaffna, Sri Lanka",
      "Negombo, Sri Lanka",
      "Batticaloa, Sri Lanka",
      "Trincomalee, Sri Lanka",
      "Anuradhapura, Sri Lanka",
      "Matara, Sri Lanka",
      "Nuwara Eliya, Sri Lanka",
    ]

    // Generate 50 mock pets for a larger pool
    for (let i = 0; i < 50; i++) {
      const type = petTypes[i % petTypes.length]
      let breed = "Mixed"

      // Select breed based on pet type
      if (type === "Dog") breed = dogBreeds[i % dogBreeds.length]
      else if (type === "Cat") breed = catBreeds[i % catBreeds.length]
      else if (type === "Bird") breed = birdBreeds[i % birdBreeds.length]
      else if (type === "Rabbit") breed = rabbitBreeds[i % rabbitBreeds.length]

      const color = colors[i % colors.length]
      const location = locationFilter || locations[i % locations.length]

      // Create date within the last 30 days
      const daysAgo = i % 30
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)
      const dateStr = date.toISOString().split("T")[0]

      // Create lost pet
      if (status === "lost" || status === "all") {
        mockPool.push({
          id: `mock-lost-${i}`,
          name: `${breed} ${i + 1}`,
          type,
          breed,
          color,
          gender: i % 2 === 0 ? "male" : ("female" as const),
          status: "lost" as const,
          location,
          description: `Lost ${color} ${breed} ${type.toLowerCase()}. Very friendly and responds to their name. Last seen near ${location.split(",")[0]}.`,
          images: ["/placeholder.svg"],
          contactName: "Sample Contact",
          contactEmail: "sample@example.com",
          contactPhone: "123-456-7890",
          createdAt: Date.now() - daysAgo * 24 * 60 * 60 * 1000,
          lastSeen: dateStr,
          microchipped: ["yes", "no", "unknown"][i % 3] as "yes" | "no" | "unknown",
          age: `${(i % 10) + 1} ${(i % 10) + 1 === 1 ? "year" : "years"}`,
        })
      }

      // Create found pet
      if (status === "found" || status === "all") {
        mockPool.push({
          id: `mock-found-${i}`,
          type,
          breed,
          color,
          gender: i % 2 === 0 ? "male" : ("female" as const),
          status: "found" as const,
          location,
          description: `Found ${color} ${breed} ${type.toLowerCase()} in the ${location.split(",")[0]} area. ${i % 2 === 0 ? "Has a collar." : "No collar or identification."}`,
          images: ["/placeholder.svg"],
          contactName: "Sample Finder",
          contactEmail: "finder@example.com",
          contactPhone: "123-456-7890",
          createdAt: Date.now() - daysAgo * 24 * 60 * 60 * 1000,
          foundDate: dateStr,
          collar: i % 2 === 0 ? "yes" : ("no" as const),
          collarDetails: i % 2 === 0 ? "Standard collar with no tags" : undefined,
        })
      }
    }

    // Apply filters
    const filteredPets = mockPool.filter((pet) => {
      // Filter by search term
      if (
        searchTerm &&
        !pet.breed.toLowerCase().includes(searchTerm) &&
        !pet.color.toLowerCase().includes(searchTerm) &&
        !pet.description.toLowerCase().includes(searchTerm) &&
        !(pet.name && pet.name.toLowerCase().includes(searchTerm))
      ) {
        return false
      }

      // Filter by pet type
      if (petTypeFilter && !pet.type.toLowerCase().includes(petTypeFilter)) {
        return false
      }

      // Filter by location
      if (locationFilter && !pet.location.includes(locationFilter)) {
        return false
      }

      // Filter by date range
      if (filters.dateRange && filters.dateRange !== "any") {
        const petDate = new Date(pet.createdAt)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - petDate.getTime()) / (1000 * 60 * 60 * 24))

        if (filters.dateRange === "today" && daysDiff > 1) return false
        if (filters.dateRange === "week" && daysDiff > 7) return false
        if (filters.dateRange === "month" && daysDiff > 30) return false
        if (filters.dateRange === "year" && daysDiff > 365) return false
      }

      return true
    })

    // Sort by date (newest first)
    filteredPets.sort((a, b) => b.createdAt - a.createdAt)

    // Apply pagination
    const startIndex = (page - 1) * limit
    return filteredPets.slice(startIndex, startIndex + limit)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    setCurrentPage(page)
    // The useEffect will trigger loadPets
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchPets()
  }

  // Handle district change
  const handleDistrictChange = (value: string) => {
    setDistrict(value)
    console.log("District selected:", value)
    // If a district is selected, clear the manual location input
    if (value) {
      setLocation("")
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="lg:col-span-1">
        <div className="sticky top-4 space-y-6">
          <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-4">
            <h3 className="mb-4 text-lg font-medium">Search Filters</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by breed, color, etc."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pet-type">Pet Type</Label>
                <Select value={petType} onValueChange={setPetType}>
                  <SelectTrigger id="pet-type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="dog">Dogs</SelectItem>
                    <SelectItem value="cat">Cats</SelectItem>
                    <SelectItem value="bird">Birds</SelectItem>
                    <SelectItem value="rabbit">Rabbits</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <DistrictSelector value={district} onChange={handleDistrictChange} className="bg-card" />
                <p className="text-xs text-muted-foreground mt-1">Select a district to search within Sri Lanka</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, neighborhood, etc."
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                    // If location is entered manually, clear the district selection
                    if (e.target.value) {
                      setDistrict("")
                    }
                  }}
                  disabled={!!district}
                />
                {district && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Clear district selection to enter a custom location
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="distance">Distance</Label>
                  <span className="text-sm text-muted-foreground">{distance[0]} km</span>
                </div>
                <Slider id="distance" min={1} max={100} step={1} value={distance} onValueChange={setDistance} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-range">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger id="date-range">
                    <SelectValue placeholder="Any Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                    <SelectItem value="year">Past Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700" disabled={isSearching}>
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
                  </>
                ) : (
                  "Apply Filters"
                )}
              </Button>
            </div>
          </form>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-4 text-lg font-medium">Need Help?</h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Not sure where to start? Check out our resources for tips on finding lost pets in Sri Lanka.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/resources">View Resources</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3">
        {DEMO_MODE && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6 flex items-center">
            <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-800">
                <strong>{DEMO_MODE_MESSAGE}</strong> All features are fully functional with sample data.
              </p>
            </div>
          </div>
        )}

        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as PetStatus | "all")}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All Pets</TabsTrigger>
              <TabsTrigger value="lost">Lost Pets</TabsTrigger>
              <TabsTrigger value="found">Found Pets</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-1"
              >
                <MapIcon className="h-4 w-4" />
                {showMap ? "Hide Map" : "Show Map"}
              </Button>
              <div className="text-sm text-muted-foreground">
                {isLoading ? "Loading..." : `Showing ${pets.length} results`}
              </div>
            </div>
          </div>

          {showMap && (
            <div className="mb-6">
              <div className="w-full h-64 bg-slate-100 rounded-md flex items-center justify-center">
                {district ? (
                  <div className="text-center">
                    <p className="font-medium">Map view for {district} District</p>
                    <p className="text-sm text-muted-foreground">Showing pets within {distance[0]} km radius</p>
                    {DEMO_MODE && <p className="text-xs text-blue-600 mt-2">Map functionality limited in demo mode</p>}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Select a district to see pets on the map</p>
                )}
              </div>
              <div className="flex justify-end mt-2">
                <Button variant="outline" size="sm" onClick={() => setShowMap(false)}>
                  Hide Map View
                </Button>
              </div>
            </div>
          )}

          <TabsContent value="all" className="mt-0">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <PetCardSkeleton key={i} />
                  ))}
              </div>
            ) : pets.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} isDemoMode={DEMO_MODE} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No pets found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="lost" className="mt-0">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <PetCardSkeleton key={i} />
                  ))}
              </div>
            ) : pets.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} isDemoMode={DEMO_MODE} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No lost pets found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="found" className="mt-0">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <PetCardSkeleton key={i} />
                  ))}
              </div>
            ) : pets.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} isDemoMode={DEMO_MODE} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No found pets found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters</p>
              </div>
            )}
          </TabsContent>

          {pets.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                className="mx-1"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  className="mx-1"
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                className="mx-1"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  )
}

function PetCard({ pet, isDemoMode = false }: { pet: Pet; isDemoMode?: boolean }) {
  return (
    <Card className={`overflow-hidden ${isDemoMode ? "border-blue-100" : ""}`}>
      <div className="aspect-square relative">
        <Image
          src={pet.image || pet.images?.[0] || "/placeholder.svg"}
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

        {isDemoMode && (
          <div className="absolute bottom-2 left-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Demo</div>
        )}
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
        {isDemoMode ? (
          <Button
            className="w-full bg-brand-600 hover:bg-brand-700"
            onClick={() => alert("This is a demo pet. In the full version, you would see detailed information.")}
          >
            View Demo Details
          </Button>
        ) : (
          <Button className="w-full bg-brand-600 hover:bg-brand-700" asChild>
            <Link href={`/pets/${pet.id}`}>View Details</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
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
