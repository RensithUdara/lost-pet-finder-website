import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Pet Resources | PetReunite",
  description: "Resources and advice for pet owners on what to do if a pet is lost or found.",
}

export default function ResourcesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <h1 className="text-3xl font-bold mb-4">Pet Resources</h1>
          <p className="text-muted-foreground mb-8">
            Helpful resources for pet owners and those who have found or lost a pet.
          </p>

          {/* Resources content would go here */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold mb-2">Lost Pet Guide</h2>
              <p className="text-muted-foreground mb-4">Steps to take when your pet goes missing.</p>
              <ul className="space-y-2 list-disc pl-5">
                <li>File a report on PetReunite</li>
                <li>Contact local animal shelters</li>
                <li>Post flyers in your neighborhood</li>
                <li>Use social media to spread the word</li>
              </ul>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold mb-2">Found Pet Guide</h2>
              <p className="text-muted-foreground mb-4">What to do when you find a lost pet.</p>
              <ul className="space-y-2 list-disc pl-5">
                <li>Check for ID tags or microchips</li>
                <li>Report the found pet on PetReunite</li>
                <li>Contact local animal shelters</li>
                <li>Provide temporary care if possible</li>
              </ul>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold mb-2">Pet Care Tips</h2>
              <p className="text-muted-foreground mb-4">Essential tips for keeping your pet safe and healthy.</p>
              <ul className="space-y-2 list-disc pl-5">
                <li>Regular veterinary check-ups</li>
                <li>Proper identification (tags, microchip)</li>
                <li>Secure fencing and leash training</li>
                <li>Balanced diet and exercise</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
