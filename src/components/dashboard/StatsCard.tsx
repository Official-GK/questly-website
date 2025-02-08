import { GradientCard } from "@/components/ui/gradient-card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  theme?: "blue" | "green" | "purple" | "orange";
  className?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  theme = "green",
  className,
}: StatsCardProps) {
  const getThemeColors = (theme: string) => {
    const colors = {
      green: "text-emerald-400 bg-emerald-500/10",
      blue: "text-blue-400 bg-blue-500/10",
      purple: "text-purple-400 bg-purple-500/10",
      orange: "text-orange-400 bg-orange-500/10"
    };
    return colors[theme as keyof typeof colors] || colors.green;
  };

  return (
    <GradientCard theme={theme} className={cn("group", className)}>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold text-white group-hover:text-white transition-colors">
              {value}
            </h3>
            <p className="text-[#B3B3B3] group-hover:text-[#B3B3B3] transition-colors">
              {title}
            </p>
          </div>
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300",
            "bg-[#252525]/40 border border-white/5",
            "group-hover:bg-[#252525]",
            {
              "group-hover:border-emerald-500/30": theme === "green",
              "group-hover:border-blue-500/30": theme === "blue",
              "group-hover:border-purple-500/30": theme === "purple",
              "group-hover:border-orange-500/30": theme === "orange",
            },
            getThemeColors(theme)
          )}>
            <Icon className="h-7 w-7" />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-[#B3B3B3] group-hover:text-[#B3B3B3] transition-colors">
          {subtitle}
        </p>
      </div>
    </GradientCard>
  );
}
