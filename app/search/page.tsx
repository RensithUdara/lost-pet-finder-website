import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import SearchPets from "@/components/search-pets"
import { AnimatedContainer } from "@/components/ui/animated-container"

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <AnimatedContainer variant="fade" className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Search Pets</h1>
            <p className="text-muted-foreground">
              Looking for a lost pet or want to report a found pet? Use our search tools to find matches.
            </p>
            <SearchPets />
          </div>
        </AnimatedContainer>
      </main>
      <SiteFooter />
    </div>
  )
}
