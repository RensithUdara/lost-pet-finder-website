"use client"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ScrollAnimation } from "@/components/ui/scroll-animation"

interface SectionHeaderProps {
  title: string
  description?: string
  centered?: boolean
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function SectionHeader({
  title,
  description,
  centered = false,
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <ScrollAnimation variant="fadeInUp" className={cn("space-y-2", centered && "text-center", className)}>
      <motion.h2
        className={cn("text-3xl font-bold tracking-tighter md:text-4xl", titleClassName)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          className={cn("max-w-[600px] text-muted-foreground md:text-xl", centered && "mx-auto", descriptionClassName)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {description}
        </motion.p>
      )}
    </ScrollAnimation>
  )
}
