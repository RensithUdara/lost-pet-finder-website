import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import FoundPetForm from "@/components/found-pet-form"

export default function FoundPetPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <FoundPetForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
