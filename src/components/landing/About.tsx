import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="py-24 sm:py-32 bg-muted/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">About Me</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Hi, I'm Gaurav Kulkarni, a passionate developer dedicated to creating innovative learning solutions.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <p className="text-lg leading-8 text-muted-foreground">
            I created Questly with the vision of making learning more engaging and effective through AI-powered tools.
            With experience in educational technology, I understand the challenges students face and build solutions to address them.
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="mailto:your.email@example.com">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
