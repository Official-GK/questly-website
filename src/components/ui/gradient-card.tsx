import { cn } from "@/lib/utils";

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: "green" | "blue" | "purple" | "orange" | "red";
  children: React.ReactNode;
  className?: string;
}

export function GradientCard({
  theme = "green",
  children,
  className,
  ...props
}: GradientCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "rounded-[32px] md:rounded-[32px]",
        "bg-gradient-to-b from-[#1E1E1E]/40 to-[#252525]/40",
        "hover:from-[#1E1E1E] hover:to-[#252525]",
        "backdrop-blur-[2px]",
        "border border-white/5 hover:border-white/10",
        {
          "hover:border-emerald-500/30": theme === "green",
          "hover:border-blue-500/30": theme === "blue",
          "hover:border-purple-500/30": theme === "purple",
          "hover:border-orange-500/30": theme === "orange",
          "hover:border-red-500/30": theme === "red",
        },
        "before:absolute before:inset-0 before:opacity-0 before:transition-opacity",
        "before:duration-300 group-hover:before:opacity-100",
        "before:bg-gradient-to-b before:from-transparent before:to-black/10",
        {
          "before:from-emerald-500/5 before:to-transparent": theme === "green",
          "before:from-blue-500/5 before:to-transparent": theme === "blue",
          "before:from-purple-500/5 before:to-transparent": theme === "purple",
          "before:from-orange-500/5 before:to-transparent": theme === "orange",
          "before:from-red-500/5 before:to-transparent": theme === "red",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({
  value,
  className,
  indicatorClassName,
}: ProgressProps) {
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-black/20",
        className
      )}
    >
      <div
        className={cn(
          "h-full w-full flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - Math.min(value, 100)}%)` }}
      />
    </div>
  );
}
