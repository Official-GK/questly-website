import { useRef, useState } from "react";
import { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export function SectionCard({
  title,
  description,
  icon: Icon,
  onClick,
  className,
}: SectionCardProps) {
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
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-lg bg-[#282828] p-6 transition-all duration-300 hover:bg-[#3E3E3E] ${className}`}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(29, 185, 84, 0.4), transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-start gap-4">
        {/* Icon */}
        <div className="rounded-full bg-[#1DB954]/10 p-3">
          <Icon className="h-6 w-6 text-[#1DB954]" />
        </div>

        {/* Text Content */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-[#1DB954] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-[#B3B3B3]">{description}</p>
        </div>
      </div>

      {/* Background Icon */}
      <div className="absolute right-4 top-4 opacity-5">
        <Icon className="h-24 w-24 text-white" />
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-lg transition-opacity duration-500 group-hover:opacity-100 opacity-0" 
           style={{ 
             boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.1)" 
           }} 
      />
    </div>
  );
}
