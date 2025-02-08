import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Course {
  id: number;
  title: string;
  description: string;
  path: string;
}

export function CourseSearch({ courses }: { courses: Course[] }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative w-full">
        <Input
          readOnly
          className="pl-10 bg-muted cursor-pointer"
          placeholder="Search courses... (⌘K)"
          onClick={() => setOpen(true)}
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput placeholder="Search all courses..." />
        <CommandList>
          <CommandEmpty>No courses found.</CommandEmpty>
          <CommandGroup heading="Courses">
            {courses.map((course) => (
              <CommandItem
                key={course.id}
                onSelect={() => {
                  setOpen(false);
                  navigate(course.path);
                }}
              >
                <div className="flex flex-col">
                  <span>{course.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {course.description}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
