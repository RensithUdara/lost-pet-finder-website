"use client"

import { useEffect, useState, useRef } from "react"

interface UseIntersectionObserverProps {
  threshold?: number
  rootMargin?: string
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = "0px",
  freezeOnceVisible = true,
}: UseIntersectionObserverProps = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting

        // Update visible state
        if (isIntersecting) {
          setIsVisible(true)
          setHasAnimated(true)

          // Unobserve if we only want to animate once
          if (freezeOnceVisible && ref.current) {
            observer.unobserve(ref.current)
          }
        } else {
          // If we don't freeze once visible, toggle the visibility
          if (!freezeOnceVisible) {
            setIsVisible(false)
          }
        }
      },
      { threshold, rootMargin },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin, freezeOnceVisible])

  return { ref, isVisible, hasAnimated }
}
