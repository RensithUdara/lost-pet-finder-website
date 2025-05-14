"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import ImageUpload from "@/components/image-upload"
import { StaticMapPreview } from "@/components/map/static-map-preview"
import { AddressAutocomplete } from "@/components/address-autocomplete"

const formSchema = z.object({
  // Pet Details
  name: z.string().optional(),
  species: z.string().min(1, { message: "Please select a species" }),
  breed: z.string().optional(),
  color: z.string().min(1, { message: "Please enter the pet's color" }),
  gender: z.enum(["male", "female", "unknown"], {
    required_error: "Please select a gender",
  }),
  age: z.string().optional(),

  // Last Seen
  lastSeenDate: z.date({
    required_error: "Please select a date",
  }),
  lastSeenLocation: z.string().min(1, { message: "Please enter where your pet was last seen" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),

  // Contact Info
  contactName: z.string().min(1, { message: "Please enter your name" }),
  contactEmail: z.string().email({ message: "Please enter a valid email" }),
  contactPhone: z.string().optional(),
  makePublic: z.boolean().optional(),
  receiveAlerts: z.boolean().optional(),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and privacy policy" }),
  }),
})

export default function LostPetForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("pet-details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      color: "",
      gender: "unknown",
      age: "",
      description: "",
      lastSeenLocation: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      makePublic: false,
      receiveAlerts: false,
      agreeToTerms: false,
    },
  })

  const handleImageUploaded = (url: string) => {
    setImageUrl(url)
  }

  const handleAddressChange = (value: string) => {
    form.setValue("lastSeenLocation", value)
  }

  const handleAddressSelect = (address: string, latitude: number, longitude: number) => {
    form.setValue("lastSeenLocation", address)
    setCoordinates({ latitude, longitude })
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!coordinates) {
      toast({
        title: "Location Required",
        description: "Please select a location on the map or enter an address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const petData = {
        name: values.name,
        type: values.species,
        breed: values.breed || "",
        color: values.color,
        gender: values.gender,
        age: values.age || "",
        status: "lost",
        lastSeen: values.lastSeenDate.toISOString().split("T")[0],
        location: values.lastSeenLocation,
        coordinates: coordinates,
        description: values.description,
        contactName: values.contactName,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone || "",
        makePublic: values.makePublic || false,
        receiveAlerts: values.receiveAlerts || false,
        images: imageUrl ? [imageUrl] : [],
      }

      const response = await fetch("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(petData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit pet report")
      }

      toast({
        title: "Report Submitted",
        description: "Your lost pet report has been successfully submitted.",
      })

      router.push("/")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "There was a problem submitting your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const goToNextTab = () => {
    if (activeTab === "pet-details") {
      // Validate pet details fields
      const petDetailsValid = form.trigger(["name", "species", "breed", "color", "gender", "age"])
      if (petDetailsValid) {
        setActiveTab("last-seen")
      }
    } else if (activeTab === "last-seen") {
      // Validate last seen fields
      const lastSeenValid = form.trigger(["lastSeenDate", "lastSeenLocation", "description"])
      if (lastSeenValid) {
        setActiveTab("contact-info")
      }
    }
  }

  const goToPreviousTab = () => {
    if (activeTab === "last-seen") {
      setActiveTab("pet-details")
    } else if (activeTab === "contact-info") {
      setActiveTab("last-seen")
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">Report a Lost Pet</h1>
      <p className="text-center text-muted-foreground mb-6">
        Please provide as much detail as possible to help others identify your pet.
      </p>

      <Card>
        <CardContent className="p-6">
          <div className="flex mb-6 border-b">
            <button
              className={cn(
                "flex-1 py-3 px-4 text-center font-medium",
                activeTab === "pet-details" ? "border-b-2 border-primary" : "text-muted-foreground",
              )}
              onClick={() => setActiveTab("pet-details")}
            >
              Pet Details
            </button>
            <button
              className={cn(
                "flex-1 py-3 px-4 text-center font-medium",
                activeTab === "last-seen" ? "border-b-2 border-primary" : "text-muted-foreground",
              )}
              onClick={() => setActiveTab("last-seen")}
            >
              Last Seen
            </button>
            <button
              className={cn(
                "flex-1 py-3 px-4 text-center font-medium",
                activeTab === "contact-info" ? "border-b-2 border-primary" : "text-muted-foreground",
              )}
              onClick={() => setActiveTab("contact-info")}
            >
              Contact Info
            </button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Pet Details Tab */}
              {activeTab === "pet-details" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your pet's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="breed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Breed (if known)</FormLabel>
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
                          <FormLabel>Color/Markings</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., Black with white paws" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age (if known)</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., 3 years" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Pet Image</Label>
                    <ImageUpload onImageUploaded={handleImageUploaded} defaultImage={imageUrl || ""} />
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={goToNextTab}>
                      Next Step
                    </Button>
                  </div>
                </div>
              )}

              {/* Last Seen Tab */}
              {activeTab === "last-seen" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="lastSeenDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>When was your pet last seen?</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastSeenLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Where was your pet last seen?</FormLabel>
                        <FormControl>
                          <AddressAutocomplete
                            value={field.value}
                            onChange={handleAddressChange}
                            onSelect={handleAddressSelect}
                            placeholder="Enter address or location description"
                          />
                        </FormControl>
                        <FormDescription>Be as specific as possible with the location.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Location on Map</Label>
                    <div className="w-full h-64 bg-slate-100 rounded-md overflow-hidden">
                      {coordinates ? (
                        <StaticMapPreview
                          latitude={coordinates.latitude}
                          longitude={coordinates.longitude}
                          zoom={15}
                          width="100%"
                          height="100%"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          Enter an address or use your current location
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Click on the map to pinpoint the exact location where your pet was last seen.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe any distinctive features, behavior, circumstances of disappearance, etc."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={goToPreviousTab}>
                      Previous Step
                    </Button>
                    <Button type="button" onClick={goToNextTab}>
                      Next Step
                    </Button>
                  </div>
                </div>
              )}

              {/* Contact Info Tab */}
              {activeTab === "contact-info" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="makePublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Make my contact information public</FormLabel>
                          <FormDescription>
                            If unchecked, people will contact you through our messaging system.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="receiveAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Receive email alerts for potential matches</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the{" "}
                            <a href="/terms" className="text-primary hover:underline">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="/privacy" className="text-primary hover:underline">
                              Privacy Policy
                            </a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={goToPreviousTab}>
                      Previous Step
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
