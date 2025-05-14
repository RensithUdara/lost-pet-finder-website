"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { cn } from "@/lib/utils"

type AnimationVariant = "fadeIn" | "fadeInUp" | "fadeInDown" | "fadeInLeft" | "fadeInRight" | "zoomIn" | "scaleUp"

interface ScrollAnimationProps {
  children: React.ReactNode
  className?: string
  variant?: AnimationVariant
  delay?: number
  duration?: number
  threshold?: number
  rootMargin?: string
  once?: boolean
}

const variants = {
  hidden: {
    opacity: 0,
  },
  fadeIn: {
    opacity: 1,
  },
  fadeInUp: {
    opacity: 1,
    y: 0,
  },
  fadeInDown: {
    opacity: 1,
    y: 0,
  },
  fadeInLeft: {
    opacity: 1,
    x: 0,
  },
  fadeInRight: {
    opacity: 1,
    x: 0,
  },
  zoomIn: {
    opacity: 1,
    scale: 1,
  },
  scaleUp: {
    opacity: 1,
    scale: 1,
  },
}

const initialStates = {
  fadeIn: { opacity: 0 },
  fadeInUp: { opacity: 0, y: 50 },
  fadeInDown: { opacity: 0, y: -50 },
  fadeInLeft: { opacity: 0, x: -50 },
  fadeInRight: { opacity: 0, x: 50 },
  zoomIn: { opacity: 0, scale: 0.9 },
  scaleUp: { opacity: 0, scale: 0.8 },
}

export function ScrollAnimation({
  children,
  className,
  variant = "fadeIn",
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  rootMargin = "0px",
  once = true,
}: ScrollAnimationProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: once,
  })

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={initialStates[variant]}
      animate={isVisible ? variants[variant] : "hidden"}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
