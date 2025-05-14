import Link from "next/link"
import { PawPrint } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col space-y-3">
            <Link href="/" className="flex items-center space-x-2">
              <PawPrint className="h-6 w-6 text-brand-600" />
              <span className="font-bold">PetReunite</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Helping reunite lost pets with their owners across Sri Lanka.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-8 md:col-span-3 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Report</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/lost" className="transition-colors hover:text-foreground/80 text-muted-foreground">
                    Report Lost Pet
                  </Link>
                </li>
                <li>
                  <Link href="/found" className="transition-colors hover:text-foreground/80 text-muted-foreground">
                    Report Found Pet
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Search</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/search?status=lost"
                    className="transition-colors hover:text-foreground/80 text-muted-foreground"
                  >
                    Lost Pets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?status=found"
                    className="transition-colors hover:text-foreground/80 text-muted-foreground"
                  >
                    Found Pets
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="transition-colors hover:text-foreground/80 text-muted-foreground">
                    Advanced Search
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/resources" className="transition-colors hover:text-foreground/80 text-muted-foreground">
                    Pet Care Tips
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="transition-colors hover:text-foreground/80 text-muted-foreground">
                    Lost Pet Guide
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="transition-colors hover:text-foreground/80 text-muted-foreground">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground mb-4 md:mb-0 text-center md:text-left">
            &copy; {new Date().getFullYear()} CodeCraftix Technologies. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
