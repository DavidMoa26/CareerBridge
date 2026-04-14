"use client"

import { MotionConfig } from "framer-motion"
import { ReactNode } from "react"

/**
 * Provides global Framer Motion configuration as a client boundary.
 * `reducedMotion="user"` automatically respects the OS accessibility setting.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
