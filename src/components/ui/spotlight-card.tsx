import { useRef, useState, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string;
}

export const SpotlightCard = forwardRef<HTMLDivElement, SpotlightCardProps>(({
  children,
  className = "",
  spotlightColor = "rgba(29, 185, 84, 0.25)", // Spotify green with opacity
  style,
  ...props
}, ref) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card p-6 transition-colors hover:bg-muted/50",
        className
      )}
      style={{
        ...style,
        "--spotlight-color": spotlightColor,
        "--spotlight-x": `${position.x}px`,
        "--spotlight-y": `${position.y}px`,
        "--spotlight-opacity": opacity,
      } as React.CSSProperties}
      {...props}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at var(--spotlight-x) var(--spotlight-y), var(--spotlight-color), transparent 40%)`,
          opacity: "var(--spotlight-opacity)",
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" 
           style={{ 
             boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.1)" 
           }} 
      />
    </div>
  );
});