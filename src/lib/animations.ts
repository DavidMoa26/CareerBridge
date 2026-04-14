/**
 * CareerBridge — Animation Primitives
 *
 * Framer Motion variant objects used across the app.
 * Import the variant you need; pass it to `variants` prop on a `motion.*` element.
 * All variants respect `prefers-reduced-motion` via the `reducedMotion` prop on
 * <MotionConfig> — set globally in the root layout.
 */

import type { Variants } from "framer-motion"

// ---------------------------------------------------------------------------
// Page / Section Entrance
// ---------------------------------------------------------------------------

/** Fade up from 16px below. Use on page-level containers or major sections. */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/** Fade in without vertical movement. Use on overlays or inline elements. */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

// ---------------------------------------------------------------------------
// List / Stagger Orchestration
// ---------------------------------------------------------------------------

/**
 * Wrap a list container with this variant; pair child items with
 * `staggerItemVariants` to get a cascading entrance effect.
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.05,
    },
  },
}

/** Individual item inside a `staggerContainerVariants` parent. */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// ---------------------------------------------------------------------------
// Card Hover Lift
// ---------------------------------------------------------------------------

/**
 * Pass to `whileHover` (not `variants`) on a `motion.div` card.
 * Pair with `whileTap={cardTapState}` for press feedback.
 *
 * @example
 * <motion.div whileHover={cardHoverState} whileTap={cardTapState}>
 */
export const cardHoverState = {
  y: -3,
  transition: { duration: 0.2, ease: "easeOut" },
}

export const cardTapState = {
  y: 0,
  scale: 0.99,
  transition: { duration: 0.1 },
}

// ---------------------------------------------------------------------------
// Modal / Dialog Scale
// ---------------------------------------------------------------------------

/** Use on the inner content element of dialogs and sheets. */
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.18, ease: "easeIn" },
  },
}

// ---------------------------------------------------------------------------
// Button Micro-interaction
// ---------------------------------------------------------------------------

/** Apply to `whileTap` on interactive buttons for press-down feedback. */
export const buttonPressState = {
  scale: 0.97,
  transition: { duration: 0.08 },
}

// ---------------------------------------------------------------------------
// Sidebar Collapse / Expand
// ---------------------------------------------------------------------------

/** Spring-based sidebar width transition config. Pass to `transition` prop. */
export const sidebarSpringTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
}

// ---------------------------------------------------------------------------
// Status Badge Entrance Pulse
// ---------------------------------------------------------------------------

/** One-shot mount animation for status badges. Use with `animate` prop. */
export const badgePulseVariants: Variants = {
  hidden: { scale: 0.85, opacity: 0 },
  visible: {
    scale: [0.85, 1.08, 1],
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
}
