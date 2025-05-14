import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EditPetNotFound() {
  return (
    <div className="container py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Pet Not Found</h1>
      <p className="mb-6 text-muted-foreground max-w-md mx-auto">
        The pet you're trying to edit doesn't exist or you don't have permission to edit it.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/profile">Go to My Profile</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
