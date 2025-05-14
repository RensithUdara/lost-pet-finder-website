"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, Loader2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MultiImageUploadProps {
  onImagesUploaded: (urls: string[]) => void
  defaultImages?: string[]
  maxImages?: number
  className?: string
}

export default function MultiImageUpload({
  onImagesUploaded,
  defaultImages = [],
  maxImages = 5,
  className = "",
}: MultiImageUploadProps) {
  const [images, setImages] = useState<string[]>(defaultImages)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the maximum
    if (images.length + files.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images`)
      toast({
        title: "Too many images",
        description: `You can only upload a maximum of ${maxImages} images`,
        variant: "destructive",
      })
      return
    }

    setError(null)
    setIsUploading(true)

    const newImageUrls: string[] = []
    const failedUploads: string[] = []

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!acceptedTypes.includes(file.type)) {
        failedUploads.push(`${file.name} (invalid type)`)
        continue
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        failedUploads.push(`${file.name} (too large)`)
        continue
      }

      try {
        // Create a local preview for immediate feedback
        const reader = new FileReader()
        reader.onload = (event) => {
          // This is just for preview, we'll replace it with the actual URL later
          const previewUrl = event.target?.result as string
          setImages((prev) => [...prev, previewUrl])
        }
        reader.readAsDataURL(file)

        // Upload the file
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to upload image")
        }

        const data = await response.json()
        newImageUrls.push(data.url)
      } catch (error) {
        console.error("Error uploading image:", error)
        failedUploads.push(file.name)
      }
    }

    // Update the state with the new images
    if (newImageUrls.length > 0) {
      const updatedImages = [...images, ...newImageUrls]
      setImages(updatedImages)
      onImagesUploaded(updatedImages)

      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${newImageUrls.length} image(s)`,
      })
    }

    // Show error for failed uploads
    if (failedUploads.length > 0) {
      toast({
        title: "Some uploads failed",
        description: `Failed to upload: ${failedUploads.join(", ")}`,
        variant: "destructive",
      })
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    setIsUploading(false)
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    onImagesUploaded(newImages)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
        disabled={isUploading || images.length >= maxImages}
        multiple
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="aspect-square relative">
              <Image src={image || "/placeholder.svg"} alt={`Pet image ${index + 1}`} fill className="object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={() => handleRemoveImage(index)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          </Card>
        ))}

        {images.length < maxImages && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-gray-500 animate-spin" />
            ) : (
              <Plus className="h-8 w-8 text-gray-500" />
            )}
            <p className="mt-2 text-sm text-gray-500">Add Image</p>
          </div>
        )}
      </div>

      {images.length < maxImages && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 mb-2 text-gray-500 animate-spin" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF or WebP (MAX. 5MB) • {images.length}/{maxImages} images
              </p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
