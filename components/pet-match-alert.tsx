"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, X } from "lucide-react"

export default function PetMatchAlert({ pet }: { pet: any }) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  const isLost = pet.status === "lost"

  return (
    <Card className={`mt-12 border-2 ${isLost ? "border-brand-200" : "border-coral-200"}`}>
      <CardHeader className={`pb-2 ${isLost ? "bg-brand-50" : "bg-coral-50"}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <AlertTriangle className={`mr-2 h-5 w-5 ${isLost ? "text-brand-500" : "text-coral-500"}`} />
            <CardTitle>{isLost ? "Looking for similar found pets?" : "Looking for similar lost pets?"}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setDismissed(true)} className="h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
        <CardDescription>
          {isLost
            ? "We can help you find potential matches for your lost pet"
            : "We can help you find potential owners for this found pet"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm">
          {isLost
            ? "Our system can automatically search for found pets that match the description of your lost pet. Get notified when potential matches are found."
            : "Our system can automatically search for lost pets that match the description of this found pet. Help reunite this pet with their owner."}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className={isLost ? "bg-brand-600 hover:bg-brand-700" : "bg-coral-600 hover:bg-coral-700"}>
          <Link href={isLost ? "/search?status=found" : "/search?status=lost"}>
            {isLost ? "Find Potential Matches" : "Find Potential Owners"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
