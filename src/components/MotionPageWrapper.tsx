"use client"

import { motion } from "framer-motion"
import { fadeUpVariants } from "@/lib/animations"
import { ReactNode } from "react"

/**
 * Thin client boundary that wraps a page in a Framer Motion fadeUp entrance.
 * Keep layout files as Server Components and slot this in as the children wrapper.
 */
export function MotionPageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="h-full"
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}
