"use client"

import { useEffect, useState } from "react"

/**
 * Custom hook to determine if the client should render animations
 * This helps prevent hydration mismatches and allows for motion preferences
 */
export function useClientAnimation() {
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    // Only enable animations after component has mounted on client
    setShouldAnimate(true)
  }, [])

  return shouldAnimate
}

/**
 * Animation variants for staggered list items
 */
export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

/**
 * Animation variants for container with staggered children
 */
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

/**
 * Animation variants for page transitions
 */
export const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

/**
 * Animation variants for fade in
 */
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

/**
 * Animation variants for slide up
 */
export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

/**
 * Animation variants for scale up
 */
export const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
}
