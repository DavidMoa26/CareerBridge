"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ReactNode } from "react"

/**
 * Client-side motion wrapper for individual job listing cards.
 * Provides the "Lift & Glow" hover effect without polluting the
 * server-component data-fetching layer.
 */
export function AnimatedJobCard({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <motion.div
      whileHover={{
        y: -2,
        boxShadow:
          "0 20px 30px -6px rgba(37, 99, 235, 0.12), 0 8px 12px -4px rgba(0,0,0,0.06)",
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.99, transition: { duration: 0.1 } }}
    >
      <Link href={href} className="block">
        {children}
      </Link>
    </motion.div>
  )
}
