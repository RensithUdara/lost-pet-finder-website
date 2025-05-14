"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Pet } from "@/lib/pet-service"
import MatchesDashboard from "@/components/matches-dashboard"

interface UserProfileProps {
  user: {
    id: string
    name: string
    email: string
  }
  pets: Pet[]
}

export default function UserProfile({ user, pets }: UserProfileProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("pets")
  const [isUpdating, setIsUpdating] = useState(false)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const lostPets = pets.filter((pet) => pet.status === "lost")
  const foundPets = pets.filter((pet) => pet.status === "found")

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      // In a real app, you would update the user profile here
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeletePet = async () => {
    if (!deletingPetId) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/pets/${deletingPetId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete pet")
      }

      toast({
        title: "Pet deleted",
        description: "The pet listing has been deleted successfully.",
      })

      // Refresh the page to update the pet list
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete pet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeletingPetId(null)
    }
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email alerts for potential matches</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="email-notifications" className="rounded" defaultChecked />
                  <Label htmlFor="email-notifications" className="sr-only">
                    Email Notifications
                  </Label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive text alerts for potential matches</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="sms-notifications" className="rounded" />
                  <Label htmlFor="sms-notifications" className="sr-only">
                    SMS Notifications
                  </Label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Public Profile</p>
                  <p className="text-sm text-muted-foreground">Allow others to see your contact information</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="public-profile" className="rounded" />
                  <Label htmlFor="public-profile" className="sr-only">
                    Public Profile
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="pets" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pets">My Pets</TabsTrigger>
              <TabsTrigger value="matches">Potential Matches</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="pets" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">My Pet Listings</h2>
                  <Button asChild className="bg-brand-600 hover:bg-brand-700">
                    <Link href="/lost">
                      <Plus className="mr-2 h-4 w-4" /> Add New Listing
                    </Link>
                  </Button>
                </div>

                {pets.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <p className="text-muted-foreground mb-4">You haven't created any pet listings yet.</p>
                      <Button asChild className="bg-brand-600 hover:bg-brand-700">
                        <Link href="/lost">
                          <Plus className="mr-2 h-4 w-4" /> Report Lost Pet
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {lostPets.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Lost Pets</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {lostPets.map((pet) => (
                            <PetCard
                              key={pet.id}
                              pet={pet}
                              onDelete={() => setDeletingPetId(pet.id)}
                              onEdit={() => router.push(`/pets/${pet.id}/edit`)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {foundPets.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Found Pets</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {foundPets.map((pet) => (
                            <PetCard
                              key={pet.id}
                              pet={pet}
                              onDelete={() => setDeletingPetId(pet.id)}
                              onEdit={() => router.push(`/pets/${pet.id}/edit`)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="matches">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Potential Matches</h2>
                  <MatchesDashboard userPets={pets} />
                </div>
              </TabsContent>
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent actions and notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <p className="font-medium">New potential match found</p>
                        <p className="text-sm text-muted-foreground">
                          A found pet matching your lost pet "Max" has been reported.
                        </p>
                        <div className="flex justify-end mt-2">
                          <Button variant="outline" size="sm">
                            View Match
                          </Button>
                        </div>
                      </div>
                      <div className="border-b pb-4">
                        <p className="font-medium">Pet listing updated</p>
                        <p className="text-sm text-muted-foreground">
                          You updated the details for your lost pet "Max".
                        </p>
                        <div className="flex justify-end mt-2">
                          <Button variant="outline" size="sm">
                            View Listing
                          </Button>
                        </div>
                      </div>
                      <div className="border-b pb-4">
                        <p className="font-medium">New pet listing created</p>
                        <p className="text-sm text-muted-foreground">You reported a lost pet "Max".</p>
                        <div className="flex justify-end mt-2">
                          <Button variant="outline" size="sm">
                            View Listing
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={!!deletingPetId} onOpenChange={(open) => !open && setDeletingPetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this pet listing and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePet}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function PetCard({
  pet,
  onDelete,
  onEdit,
}: {
  pet: Pet
  onDelete: () => void
  onEdit: () => void
}) {
  const isLost = pet.status === "lost"

  // Ensure pet.images is an array
  const petImage = Array.isArray(pet.images) && pet.images.length > 0 ? pet.images[0] : pet.image || "/placeholder.svg"

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <Image
          src={petImage || "/placeholder.svg"}
          alt={pet.name || `${pet.type} - ${pet.breed}`}
          fill
          className="object-cover"
        />
        <Badge
          className={`absolute top-2 right-2 ${
            isLost ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isLost ? "Lost" : "Found"}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium">{pet.name || `${pet.type} - ${pet.breed}`}</h3>
        <div className="flex items-center text-xs text-muted-foreground mt-1 mb-1">
          <MapPin className="mr-1 h-3 w-3" />
          {pet.location}
        </div>
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <Calendar className="mr-1 h-3 w-3" />
          {isLost
            ? `Last seen: ${new Date(pet.lastSeen || "").toLocaleDateString()}`
            : `Found on: ${new Date(pet.foundDate || "").toLocaleDateString()}`}
        </div>
        <p className="text-sm line-clamp-2 mb-4">{pet.description}</p>
        <div className="flex justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/pets/${pet.id}/edit`}>
              <Pencil className="mr-1 h-3 w-3" /> Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="text-red-600" onClick={onDelete}>
            <Trash2 className="mr-1 h-3 w-3" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
