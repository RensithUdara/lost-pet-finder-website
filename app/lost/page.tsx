import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import LostPetForm from "@/components/lost-pet-form"

export default function LostPetPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <LostPetForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
