import { useSpotlightAnimation } from "@/hooks/useSpotlightAnimation";
import { ReactNode } from "react";

interface LearningToolCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconColor?: string;
  iconBgColor?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  borderGlow?: string;
}

export function LearningToolCard({
  title,
  description,
  icon,
  iconColor = "#1DB954",
  iconBgColor = "rgba(29, 185, 84, 0.1)",
  onClick,
  className,
  style,
  borderGlow,
}: LearningToolCardProps) {
  const { divRef, position, opacity, handlers } = useSpotlightAnimation();

  return (
    <div
      ref={divRef}
      {...handlers}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-lg p-8 transition-all duration-300 hover:-translate-y-2 h-[300px] border border-[#333333] hover:border-[rgba(16,185,129,0.5)] ${className}`}
      style={{
        ...style,
        background: "linear-gradient(145deg, rgba(30, 30, 30, 0.9), rgba(20, 20, 20, 0.95))",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 24px -4px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${borderGlow || "rgba(16,185,129,0.15)"}, transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {/* Icon */}
          <div
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-300 group-hover:bg-[rgba(16,185,129,0.15)]"
            style={{
              backgroundColor: "rgba(30, 30, 30, 0.8)",
              border: "1px solid rgba(51, 51, 51, 0.8)",
            }}
          >
            {icon}
          </div>

          {/* Title and Description */}
          <h3 className="mb-2 text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-[#B3B3B3] text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Get Started Button */}
        <div className="mt-auto pt-6">
          <button className="inline-flex items-center text-[#B3B3B3] hover:text-emerald-400 transition-colors duration-300">
            <span className="mr-2">Get Started</span>
            <svg
              className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Background Icon */}
      <div className="absolute -right-8 -top-8 h-48 w-48 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.05]">
        <div className="h-full w-full" style={{ color: iconColor }}>
          {icon}
        </div>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-lg transition-opacity duration-500 group-hover:opacity-100 opacity-0" 
           style={{ 
             boxShadow: `inset 0 0 0 1px ${borderGlow || "rgba(255, 255, 255, 0.1)"}` 
           }} 
      />
    </div>
  );
}
