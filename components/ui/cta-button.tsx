"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  label: string
  variant?: "default" | "brand" | "coral" | "secondary"
  size?: "default" | "lg" | "sm"
  withPulse?: boolean
}

export function CTAButton({
  icon,
  label,
  variant = "brand",
  size = "lg",
  withPulse = false,
  className,
  ...props
}: CTAButtonProps) {
  return (
    <div className="relative">
      {withPulse && <span className="absolute inset-0 rounded-md animate-pulse bg-brand-400/20 dark:bg-brand-400/10" />}
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          variant={variant}
          size={size}
          className={cn("font-semibold relative", withPulse && "z-10", className)}
          {...props}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </Button>
      </motion.div>
    </div>
  )
}
