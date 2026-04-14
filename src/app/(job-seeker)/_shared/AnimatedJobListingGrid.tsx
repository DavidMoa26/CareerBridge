"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations"

/**
 * Stagger-animates its children (job cards) on mount.
 * Server-rendered card content is passed as children — the animation
 * wrapper is the only client-side concern here.
 */
export function AnimatedJobListingGrid({
  children,
}: {
  children: ReactNode
}) {
  return (
    <motion.div
      className="space-y-4"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

/**
 * Individual stagger item — wraps each card so it fades+slides up
 * with a cascading delay driven by the parent stagger container.
 */
export function AnimatedJobListingItem({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={staggerItemVariants}>
      {children}
    </motion.div>
  )
}
