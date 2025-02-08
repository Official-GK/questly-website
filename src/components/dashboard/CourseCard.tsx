import { Book } from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

interface CourseCardProps {
  courses: Course[];
  className?: string;
}

export function CourseCard({ courses, className }: CourseCardProps) {
  return (
    <GradientCard theme="green" className={cn("group relative overflow-hidden", className)}>
      <div className="relative z-10 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-white">Your Courses</h3>
            <p className="text-[#B3B3B3]">Continue where you left off</p>
          </div>
          <Book className="h-8 w-8 text-emerald-400" />
        </div>

        {/* Course List */}
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group/item rounded-lg bg-[#1E1E1E] p-4 transition-all hover:bg-emerald-500/10"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-medium text-white">{course.title}</h4>
                  <p className="text-sm text-[#B3B3B3]">{course.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Progress 
                      value={course.progress} 
                      className="h-2 bg-[#1E1E1E]"
                      indicatorClassName="bg-gradient-to-r from-emerald-500 to-emerald-400"
                    />
                    <div className="absolute inset-0 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.2)] transition-opacity duration-300 group-hover/item:shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400">{course.progress}% Complete</span>
                    <span className="text-[#B3B3B3]">
                      {course.completedLessons} of {course.totalLessons} lessons
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/5 py-2 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/10 hover:shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          View All Courses
        </button>
      </div>

      {/* Background Book Icon */}
      <div className="absolute -right-8 -top-8 h-48 w-48 opacity-[0.05]">
        <Book className="h-full w-full text-emerald-500" />
      </div>
    </GradientCard>
  );
}
