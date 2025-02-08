import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Search, BarChart, Crown, Lock } from "lucide-react";
import { courses } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import SubscriptionPlans from "@/components/subscription/SubscriptionPlans";

interface CourseCardProps {
  course: (typeof courses)[0];
  isPremiumUser: boolean;
  onSubscribe: () => void;
}

function CourseCard({ course, isPremiumUser, onSubscribe }: CourseCardProps) {
  const navigate = useNavigate();
  
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
        <div className="text-sm text-muted-foreground">
          By {course.instructor}
        </div>
      </div>
    </Card>
  );
}

export default function Courses() {
  const [search, setSearch] = useState("");
  const [showSubscription, setShowSubscription] = useState(false);
  const { userProfile } = useAuth();
  const isPremiumUser = userProfile?.isPremium || false;

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Courses</h2>
          <p className="text-muted-foreground">
            Browse our collection of courses
          </p>
        </div>
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
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isPremiumUser={isPremiumUser}
            onSubscribe={() => setShowSubscription(true)}
          />
        ))}
      </div>
    </div>
  );
}
