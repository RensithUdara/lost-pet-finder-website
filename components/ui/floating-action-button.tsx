"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  variant?: "default" | "brand" | "coral" | "secondary"
}

export function FloatingActionButton({
  icon,
  label,
  position = "bottom-right",
  variant = "brand",
  className,
  ...props
}: FloatingActionButtonProps) {
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  }

  return (
    <motion.div
      className={cn("fixed z-50", positionClasses[position])}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={variant}
        className={cn("rounded-full shadow-lg", label ? "px-4 py-2" : "p-3", className)}
        {...props}
      >
        {icon}
        {label && <span className="ml-2">{label}</span>}
      </Button>
    </motion.div>
  )
}
