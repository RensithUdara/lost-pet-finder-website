"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useClientAnimation } from "@/lib/motion"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const shouldAnimate = useClientAnimation()

  if (!shouldAnimate) {
    return <>{children}</>
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  )
}
