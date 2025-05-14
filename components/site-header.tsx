"use client"

import { useState } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import UserDropdown from "@/components/user-dropdown"
import { Button } from "@/components/ui/button"
import { PawPrint, Heart, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <PawPrint className="h-6 w-6 text-brand-600" />
            <span className="font-bold sm:inline-block">PetReunite</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/lost" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Report Lost
            </Link>
            <Link href="/found" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Report Found
            </Link>
            <Link href="/search" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Search
            </Link>
            <Link href="/resources" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Resources
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
              About Us
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80vw] sm:w-[350px]">
                <div className="flex flex-col gap-6 py-6">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                    <PawPrint className="h-6 w-6 text-brand-600" />
                    <span className="font-bold">PetReunite</span>
                  </Link>
                  <nav className="flex flex-col gap-4">
                    <Link
                      href="/lost"
                      className="flex items-center gap-2 text-foreground/60 hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      Report Lost Pet
                    </Link>
                    <Link
                      href="/found"
                      className="flex items-center gap-2 text-foreground/60 hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      Report Found Pet
                    </Link>
                    <Link
                      href="/search"
                      className="flex items-center gap-2 text-foreground/60 hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      Search
                    </Link>
                    <Link
                      href="/resources"
                      className="flex items-center gap-2 text-foreground/60 hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      Resources
                    </Link>
                    <Link
                      href="/about"
                      className="flex items-center gap-2 text-foreground/60 hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center gap-2 text-foreground/60 hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      Contact
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full hidden md:flex">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Favorites</span>
            </Button>
            <ThemeToggle />
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  )
}
