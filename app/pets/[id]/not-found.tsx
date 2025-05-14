import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PetNotFound() {
  return (
    <div className="container py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Pet Not Found</h1>
      <p className="mb-6 text-muted-foreground max-w-md mx-auto">
        The pet you're looking for doesn't exist or has been removed from our database.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/search">Search for Pets</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
