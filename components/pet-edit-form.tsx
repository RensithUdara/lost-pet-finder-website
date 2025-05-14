"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUpload from "@/components/image-upload"
import SimpleLocationPicker from "@/components/map/simple-location-picker"

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Pet name must be at least 2 characters.",
    })
    .optional(),
  species: z.string().min(1, {
    message: "Please select a species.",
  }),
  breed: z.string().optional(),
  color: z.string().min(1, {
    message: "Please enter the pet's color.",
  }),
  age: z.string().optional(),
  gender: z.string().optional(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  lastSeenDate: z.string().optional(),
  foundDate: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

interface PetEditFormProps {
  petId: string
  petData: any
}

export default function PetEditForm({ petId, petData }: PetEditFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(
    petData.images && petData.images.length > 0 ? petData.images[0] : null,
  )
  const [location, setLocation] = useState<{ address?: string; latitude: number; longitude: number } | null>(
    petData.location
      ? {
          address: petData.location.address,
          latitude: petData.location.latitude,
          longitude: petData.location.longitude,
        }
      : null,
  )

  const defaultValues = {
    name: petData.name || "",
    species: petData.species || "",
    breed: petData.breed || "",
    color: petData.color || "",
    age: petData.age || "",
    gender: petData.gender || "",
    description: petData.description || "",
    lastSeenDate: petData.lastSeenDate ? new Date(petData.lastSeenDate).toISOString().split("T")[0] : "",
    foundDate: petData.foundDate ? new Date(petData.foundDate).toISOString().split("T")[0] : "",
    contactPhone: petData.contactPhone || "",
    contactEmail: petData.contactEmail || "",
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please select a location for the pet.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const updatedPetData = {
        ...values,
        status: petData.status,
        images: imageUrl ? [imageUrl] : [],
        location: {
          address: location.address || "",
          latitude: location.latitude,
          longitude: location.longitude,
        },
      }

      const response = await fetch(`/api/pets/${petId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPetData),
      })

      if (!response.ok) {
        throw new Error("Failed to update pet information")
      }

      toast({
        title: "Pet Updated",
        description: "Your pet information has been updated successfully.",
      })

      router.push(`/pets/${petId}`)
      router.refresh()
    } catch (error) {
      console.error("Error updating pet:", error)
      toast({
        title: "Error",
        description: "There was a problem updating your pet information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUploaded = (url: string) => {
    setImageUrl(url)
  }

  const handleLocationChange = (newLocation: { address?: string; latitude: number; longitude: number }) => {
    setLocation(newLocation)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Pet Information</CardTitle>
        <CardDescription>
          Update the details for your {petData.status === "lost" ? "lost" : "found"} pet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {petData.status === "lost" && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pet name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="species"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Species</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="bird">Bird</SelectItem>
                        <SelectItem value="rabbit">Rabbit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breed (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter breed" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pet color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pet age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {petData.status === "lost" ? (
                <FormField
                  control={form.control}
                  name="lastSeenDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Seen Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="foundDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Found</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description of the pet, including any distinctive features or markings"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              {petData.status === "lost" && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Pet Image</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a clear image of your pet to help others identify it.
                  </p>
                  <ImageUpload onImageUploaded={handleImageUploaded} defaultImage={imageUrl} />
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium mb-2">
                  {petData.status === "lost" ? "Last Seen Location" : "Found Location"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {petData.status === "lost"
                    ? "Provide the location where your pet was last seen."
                    : "Provide the location where you found the pet."}
                </p>
                <SimpleLocationPicker onLocationChange={handleLocationChange} defaultLocation={location || undefined} />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Pet Information"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
