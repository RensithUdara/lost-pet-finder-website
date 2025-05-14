import { put, del } from "@vercel/blob"
import { v4 as uuidv4 } from "uuid"

/**
 * Uploads an image to Vercel Blob Storage
 * @param file The file to upload
 * @param folder The folder to store the file in (e.g., 'pets')
 * @returns The URL of the uploaded image
 */
export async function uploadImage(file: File, folder = "pets"): Promise<string> {
  try {
    // Generate a unique filename
    const filename = `${folder}/${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`

    // Upload the file to Vercel Blob
    const { url } = await put(filename, file, {
      access: "public",
      addRandomSuffix: false, // We're already adding a UUID
    })

    return url
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error("Failed to upload image")
  }
}

/**
 * Deletes an image from Vercel Blob Storage
 * @param url The URL of the image to delete
 * @returns True if the image was deleted successfully, false otherwise
 */
export async function deleteImage(url: string): Promise<boolean> {
  try {
    // Skip if the URL is not a blob URL
    if (!url || !url.includes("blob.vercel-storage.com")) {
      return false
    }

    // Extract the pathname from the URL
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    if (!pathname || pathname === "/") {
      return false
    }

    // Delete the file from Vercel Blob
    await del(pathname)
    return true
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}

/**
 * Validates if a file is an acceptable image
 * @param file The file to validate
 * @returns True if the file is valid, false otherwise
 */
export function validateImage(file: File): boolean {
  // Check file type
  const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  if (!acceptedTypes.includes(file.type)) {
    return false
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return false
  }

  return true
}
