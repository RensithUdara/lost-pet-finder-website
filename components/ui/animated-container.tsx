"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useClientAnimation } from "@/lib/motion"

interface AnimatedContainerProps {
  children: ReactNode
  className?: string
  variant?: "fade" | "slide" | "scale" | "stagger"
  delay?: number
}

export function AnimatedContainer({ children, className = "", variant = "fade", delay = 0 }: AnimatedContainerProps) {
  const shouldAnimate = useClientAnimation()

  // Select the appropriate animation variant
  const getVariants = () => {
    switch (variant) {
      case "slide":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay } },
        }
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay } },
        }
      case "stagger":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delay,
              staggerChildren: 0.1,
            },
          },
        }
      case "fade":
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.4, delay } },
        }
    }
  }

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={getVariants()} className={className}>
      {children}
    </motion.div>
  )
}

export function AnimatedItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  const shouldAnimate = useClientAnimation()

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
