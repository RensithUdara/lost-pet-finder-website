import { type NextRequest, NextResponse } from "next/server"
import { uploadImage, validateImage } from "@/lib/blob-storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate the file
    if (!validateImage(file)) {
      return NextResponse.json(
        { error: "Invalid file. Please upload a JPEG, PNG, GIF, or WebP image under 5MB" },
        { status: 400 },
      )
    }

    // Upload the file
    const url = await uploadImage(file)

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error handling image upload:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
