"use client"

import type React from "react"

import Link from "next/link"
import { MapPin, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface ActionButtonProps {
  href: string
  icon: React.ReactNode
  label: string
  className?: string
}

export function ActionButton({ href, icon, label, className }: ActionButtonProps) {
  const isMobile = useMobile()

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-background/80 to-background p-4 text-center shadow-lg border border-border/50 backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-brand-500/50 group",
        isMobile ? "p-3 gap-2" : "p-4 gap-3",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-brand-600/10 text-brand-600 ring-4 ring-brand-600/20 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600/30",
          isMobile ? "h-10 w-10" : "h-12 w-12",
        )}
      >
        {icon}
      </div>
      <span className={cn("font-medium", isMobile ? "text-sm" : "text-base")}>{label}</span>
    </Link>
  )
}

export function ActionButtons() {
  const isMobile = useMobile()

  return (
    <div className={cn("grid gap-4 w-full mx-auto", isMobile ? "grid-cols-2 max-w-xs" : "grid-cols-2 max-w-md")}>
      <ActionButton href="/lost" icon={<MapPin className="h-6 w-6" />} label="Report Lost Pet" />
      <ActionButton href="/found" icon={<Search className="h-6 w-6" />} label="Report Found Pet" />
    </div>
  )
}
