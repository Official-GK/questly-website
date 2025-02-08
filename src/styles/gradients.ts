export const gradients = {
  // Blue theme (Flashcards, Learning)
  blue: {
    gradient: "from-[#2E3192] to-[#1BFFFF]",
    hoverGradient: "hover:from-[#3D42B0] hover:to-[#38FFFF]",
    iconColor: "#60DFFF",
    iconBg: "rgba(96, 223, 255, 0.15)",
    borderGlow: "rgba(27, 255, 255, 0.2)",
    progressGradient: "linear-gradient(to right, #2E3192, #1BFFFF)"
  },
  // Green theme (Quiz, Progress)
  green: {
    gradient: "from-[#00B09B] to-[#96C93D]",
    hoverGradient: "hover:from-[#00C4AC] hover:to-[#A8DB44]",
    iconColor: "#96C93D",
    iconBg: "rgba(150, 201, 61, 0.15)",
    borderGlow: "rgba(150, 201, 61, 0.2)",
    progressGradient: "linear-gradient(to right, #00B09B, #96C93D)"
  },
  // Purple theme (Mock Tests, Advanced)
  purple: {
    gradient: "from-[#8E2DE2] to-[#4A00E0]",
    hoverGradient: "hover:from-[#9F3CF3] hover:to-[#5B00FF]",
    iconColor: "#B388FF",
    iconBg: "rgba(179, 136, 255, 0.15)",
    borderGlow: "rgba(179, 136, 255, 0.2)",
    progressGradient: "linear-gradient(to right, #8E2DE2, #4A00E0)"
  },
  // Orange theme (Summary, Featured)
  orange: {
    gradient: "from-[#FF512F] to-[#DD2476]",
    hoverGradient: "hover:from-[#FF6347] hover:to-[#F62E8E]",
    iconColor: "#FF8F70",
    iconBg: "rgba(255, 143, 112, 0.15)",
    borderGlow: "rgba(255, 143, 112, 0.2)",
    progressGradient: "linear-gradient(to right, #FF512F, #DD2476)"
  },
  // Gold theme (Premium, Special)
  gold: {
    gradient: "from-[#FFD700] to-[#FFA500]",
    hoverGradient: "hover:from-[#FFE55C] hover:to-[#FFB52E]",
    iconColor: "#FFD700",
    iconBg: "rgba(255, 215, 0, 0.15)",
    borderGlow: "rgba(255, 215, 0, 0.2)",
    progressGradient: "linear-gradient(to right, #FFD700, #FFA500)"
  },
  // Teal theme (Stats, Analytics)
  teal: {
    gradient: "from-[#0ED2F7] to-[#0052D4]",
    hoverGradient: "hover:from-[#20E3FF] hover:to-[#0066FF]",
    iconColor: "#0ED2F7",
    iconBg: "rgba(14, 210, 247, 0.15)",
    borderGlow: "rgba(14, 210, 247, 0.2)",
    progressGradient: "linear-gradient(to right, #0ED2F7, #0052D4)"
  },
  // Rose theme (Community, Social)
  rose: {
    gradient: "from-[#FF0080] to-[#7928CA]",
    hoverGradient: "hover:from-[#FF1493] hover:to-[#8A2BE2]",
    iconColor: "#FF69B4",
    iconBg: "rgba(255, 105, 180, 0.15)",
    borderGlow: "rgba(255, 105, 180, 0.2)",
    progressGradient: "linear-gradient(to right, #FF0080, #7928CA)"
  }
} as const;

// Common card styles
export const cardStyles = {
  glassBackground: "linear-gradient(to bottom right, rgba(40, 40, 40, 0.9), rgba(30, 30, 30, 0.9))",
  glassEffect: "backdrop-filter: blur(10px)",
  baseText: "text-white",
  mutedText: "text-[#B3B3B3]",
  darkBg: "bg-[#3E3E3E]"
} as const;
