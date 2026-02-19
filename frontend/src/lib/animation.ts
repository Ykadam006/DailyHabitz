export const transition = {
  fast: { duration: 0.15 },
  normal: { duration: 0.2 },
  gentle: { duration: 0.25 },
} as const;

export const spring = {
  snappy: { type: "spring" as const, stiffness: 400, damping: 25 },
  gentle: { type: "spring" as const, stiffness: 300, damping: 30 },
} as const;

/** Pop effect for done check - scale 1 -> 1.2 -> 1 */
export const popVariants = {
  initial: { scale: 1 },
  pop: { scale: [1, 1.25, 1], transition: { duration: 0.25 } },
} as const;

/** XP +10 micro animation - float up and fade */
export const xpBurstVariants = {
  initial: { opacity: 0, scale: 0.9, y: 0 },
  animate: { opacity: 1, scale: 1, y: -6 },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
} as const;
