import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Mail, Phone, AlertTriangle, Heart } from "lucide-react"
import { getPetById } from "@/lib/pet-service"
import { notFound } from "next/navigation"
import ImageGallery from "@/components/image-gallery"
import { getUserFromRequest } from "@/lib/auth-utils"
import { cookies } from "next/headers"
import PetMatches from "@/components/pet-matches"
import MapComponent from "@/components/map/map-component"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { PageTransition } from "@/components/page-transition"

// Add this function to check if the current user owns the pet
async function userOwnsPet(petId: string) {
  try {
    const token = cookies().get("auth-token")?.value
    if (!token) return false

    const request = {
      cookies: {
        get: (name: string) => (name === "auth-token" ? { value: token } : undefined),
      },
    } as any

    const user = await getUserFromRequest(request)
    if (!user) return false

    const pet = await getPetById(petId)
    if (!pet) return false

    return pet.userId === user.id
  } catch (error) {
    console.error("Error checking pet ownership:", error)
    return false
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const pet = await getPetById(params.id)

  if (!pet) {
    return {
      title: "Pet Not Found",
      description: "The pet you are looking for could not be found.",
    }
  }

  const status = pet.status === "lost" ? "Lost" : "Found"
  const name = pet.name || `${pet.type} - ${pet.breed}`

  return {
    title: `${status} Pet: ${name} | PetReunite`,
    description: pet.description.substring(0, 160),
    openGraph: {
      title: `${status} Pet: ${name}`,
      description: pet.description.substring(0, 160),
      images: pet.images && pet.images.length > 0 ? [pet.images[0]] : ["/placeholder.svg"],
    },
  }
}

export default async function PetDetailPage({ params }: { params: { id: string } }) {
  try {
    // This is a server component, so we can fetch the pet data directly
    const pet = await getPetById(params.id)

    if (!pet) {
      notFound()
    }

    const isLost = pet.status === "lost"
    const isOwner = await userOwnsPet(params.id)

    // Ensure pet.images is an array
    const petImages = Array.isArray(pet.images) ? pet.images : pet.image ? [pet.image] : ["/placeholder.svg"]

    // The rest of your pet detail page component...
    return (
      <PageTransition>
        <AnimatedContainer className="container mx-auto px-4 py-8 space-y-8">
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
              <div className="container py-8 md:py-12">
                <div className="mb-6 flex justify-between items-center">
                  <Link href="/search" className="text-teal-600 hover:underline flex items-center">
                    ← Back to Search Results
                  </Link>
                  {isOwner && (
                    <Button asChild className="bg-teal-600 hover:bg-teal-700">
                      <Link href={`/pets/${params.id}/edit`}>Edit Listing</Link>
                    </Button>
                  )}
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                  <AnimatedContainer variant="scale" delay={0.2}>
                    <div>
                      <ImageGallery images={petImages} alt={pet.name || `${pet.type} - ${pet.breed}`} />
                    </div>
                  </AnimatedContainer>

                  <AnimatedContainer variant="scale" delay={0.2}>
                    <div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h1 className="text-3xl font-bold">{pet.name || `${pet.type} - ${pet.breed}`}</h1>
                          <Badge variant="outline" className="text-base py-1">
                            {pet.type}
                          </Badge>
                        </div>

                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="mr-2 h-5 w-5" />
                          {pet.location}
                        </div>

                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="mr-2 h-5 w-5" />
                          {isLost
                            ? `Last seen: ${new Date(pet.lastSeen || "").toLocaleDateString()}`
                            : `Found on: ${new Date(pet.foundDate || "").toLocaleDateString()}`}
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div>
                            <h3 className="font-medium text-muted-foreground">Breed</h3>
                            <p>{pet.breed}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-muted-foreground">Color</h3>
                            <p>{pet.color}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-muted-foreground">Gender</h3>
                            <p>{pet.gender}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-muted-foreground">Status</h3>
                            <p className={isLost ? "text-red-500" : "text-green-500"}>{isLost ? "Lost" : "Found"}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium text-muted-foreground mb-2">Description</h3>
                          <p className="text-sm">{pet.description}</p>
                        </div>

                        <div className="pt-4">
                          <h3 className="font-medium text-muted-foreground mb-2">Contact Information</h3>
                          <Card>
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <p className="font-medium">{pet.contactName}</p>
                                <div className="flex items-center text-sm">
                                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <a href={`mailto:${pet.contactEmail}`} className="text-teal-600 hover:underline">
                                    {pet.contactEmail}
                                  </a>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <a href={`tel:${pet.contactPhone}`} className="text-teal-600 hover:underline">
                                    {pet.contactPhone}
                                  </a>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          {isLost ? (
                            <>
                              <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                                <Heart className="mr-2 h-4 w-4" /> I've Seen This Pet
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <AlertTriangle className="mr-2 h-4 w-4" /> Report Sighting
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                                <Heart className="mr-2 h-4 w-4" /> This Is My Pet
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <AlertTriangle className="mr-2 h-4 w-4" /> Similar to My Pet
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </AnimatedContainer>
                </div>

                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Location</h2>
                  <div className="w-full h-96 bg-slate-100 rounded-lg flex items-center justify-center">
                    {pet.latitude && pet.longitude ? (
                      <MapComponent center={{ lat: pet.latitude, lng: pet.longitude }} />
                    ) : (
                      <p className="text-muted-foreground">Map view would go here</p>
                    )}
                  </div>
                </div>

                <PetMatches pet={pet} />
              </div>
            </main>
            <SiteFooter />
          </div>
        </AnimatedContainer>
      </PageTransition>
    )
  } catch (error) {
    console.error("Error fetching pet:", error)
    notFound()
  }
}
