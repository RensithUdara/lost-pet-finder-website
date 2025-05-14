import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import RecentPets from "@/components/recent-pets"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { ActionButtons } from "@/components/action-buttons"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <ScrollAnimation variant="fadeInLeft" duration={0.6}>
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                      Reunite Lost Pets with Their Families
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Our platform helps connect lost pets with their owners across Sri Lanka. Report a lost or found
                      pet and help bring them home.
                    </p>
                  </div>
                  <ActionButtons />
                </div>
              </ScrollAnimation>
              <ScrollAnimation variant="fadeInRight" duration={0.6} delay={0.2}>
                <div className="flex items-center justify-center">
                  <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-lg shadow-xl">
                    <img
                      src="/abstract-geometric-shapes.png"
                      alt="Pets collage"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <ScrollAnimation variant="fadeInUp" threshold={0.2}>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Find a Pet</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Search our database of lost and found pets to find a match.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <Button asChild variant="brand" className="w-full">
                    <Link href="/search">
                      <Search className="mr-2 h-4 w-4" />
                      Search Pets
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Recent Pets Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <ScrollAnimation variant="fadeInUp" threshold={0.2}>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Recent Pets</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Browse recently reported lost and found pets.
                  </p>
                </div>
              </div>
            </ScrollAnimation>
            <div className="mt-8">
              <ScrollAnimation variant="fadeInUp" delay={0.2} threshold={0.1}>
                <RecentPets />
              </ScrollAnimation>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
