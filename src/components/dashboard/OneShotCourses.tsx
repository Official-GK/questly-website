import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Clock, PlayCircle, BarChart, Lock, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { courses } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState } from "react";
import SubscriptionPlans from "../subscription/SubscriptionPlans";

function CourseCard({ course, onSubscribe }: { course: typeof courses[0]; onSubscribe: () => void }) {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const isPremiumUser = userProfile?.isPremium || false;

  const handleClick = () => {
    if (course.isPremium && !isPremiumUser) {
      onSubscribe();
    } else {
      navigate(`/course/${course.id}`);
    }
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        {course.isPremium && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-gradient-to-r from-amber-500 to-amber-600">
              Premium
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{course.title}</h3>
          <p className="text-sm text-muted-foreground">{course.description}</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              {course.level}
            </div>
          </div>
          {course.isPremium && !isPremiumUser && (
            <Lock className="h-4 w-4 text-amber-500" />
          )}
        </div>
      </div>
    </Card>
  );
}

export function OneShotCourses() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [showSubscription, setShowSubscription] = useState(false);
  const isPremiumUser = userProfile?.isPremium || false;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Popular Courses</h2>
          <p className="text-muted-foreground">
            Start learning with these popular courses
          </p>
        </div>
        <div className="flex items-center gap-4">
          {!isPremiumUser && (
            <>
              <Sheet open={showSubscription} onOpenChange={setShowSubscription}>
                <Button 
                  onClick={() => setShowSubscription(true)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Get Premium Access
                </Button>
                <SheetContent side="right" className="w-full sm:w-[540px] overflow-y-auto">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Choose Your Plan</SheetTitle>
                    <SheetDescription>
                      Select the plan that best fits your learning goals
                    </SheetDescription>
                  </SheetHeader>
                  <SubscriptionPlans />
                </SheetContent>
              </Sheet>
            </>
          )}
          <Button onClick={() => navigate("/courses")} variant="outline">
            View All Courses
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.slice(0, 3).map((course) => (
          <CourseCard 
            key={course.id} 
            course={course} 
            onSubscribe={() => setShowSubscription(true)}
          />
        ))}
      </div>
    </div>
  );
}

// Export courses data to be used in CourseContent
export { courses };
