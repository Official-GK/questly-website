import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { UserProfile } from "@/types/user";

interface ProfileSetupFormProps {
  onComplete: (data: Partial<UserProfile>) => void;
  initialData?: Partial<UserProfile>;
}

export function ProfileSetupForm({ onComplete, initialData }: ProfileSetupFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: initialData?.name || "",
    bio: initialData?.bio || "",
    interests: initialData?.interests || "",
    goals: initialData?.goals || "",
    profileImage: initialData?.profileImage || null,
    socials: {
      github: initialData?.socials?.github || "",
      linkedin: initialData?.socials?.linkedin || "",
      instagram: initialData?.socials?.instagram || "",
      twitter: initialData?.socials?.twitter || "",
    }
  });

  const questions = [
    {
      title: "What's your name?",
      description: "This is how you'll appear to other learners",
      field: "name",
      component: (
        <Input
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      ),
    },
    {
      title: "Tell us about yourself",
      description: "Share a brief bio with the community",
      field: "bio",
      component: (
        <Textarea
          placeholder="Write a short bio..."
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
      ),
    },
    {
      title: "What are your interests?",
      description: "What topics are you most excited to learn about?",
      field: "interests",
      component: (
        <Textarea
          placeholder="E.g., Web Development, Machine Learning, Data Science..."
          value={formData.interests}
          onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
        />
      ),
    },
    {
      title: "What are your learning goals?",
      description: "What do you hope to achieve?",
      field: "goals",
      component: (
        <Textarea
          placeholder="Share your learning goals..."
          value={formData.goals}
          onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
        />
      ),
    },
    {
      title: "Add your social media links",
      description: "Connect with other learners through your social profiles",
      field: "socials",
      component: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              placeholder="https://github.com/yourusername"
              value={formData.socials?.github}
              onChange={(e) => setFormData({
                ...formData,
                socials: { ...formData.socials, github: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/in/yourusername"
              value={formData.socials?.linkedin}
              onChange={(e) => setFormData({
                ...formData,
                socials: { ...formData.socials, linkedin: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              placeholder="https://instagram.com/yourusername"
              value={formData.socials?.instagram}
              onChange={(e) => setFormData({
                ...formData,
                socials: { ...formData.socials, instagram: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              placeholder="https://twitter.com/yourusername"
              value={formData.socials?.twitter}
              onChange={(e) => setFormData({
                ...formData,
                socials: { ...formData.socials, twitter: e.target.value }
              })}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Add a profile picture",
      description: "Upload a photo of yourself",
      field: "profileImage",
      component: (
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-32 h-32">
            {formData.profileImage ? (
              <AvatarImage src={formData.profileImage} />
            ) : (
              <AvatarFallback>
                <Upload className="w-8 h-8" />
              </AvatarFallback>
            )}
          </Avatar>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFormData({ ...formData, profileImage: reader.result as string });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <Card className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{currentQuestion.title}</h2>
        <p className="text-muted-foreground">{currentQuestion.description}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={currentQuestion.field}>{currentQuestion.title}</Label>
          {currentQuestion.component}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === questions.length - 1 ? "Complete" : "Next"}
          </Button>
        </div>

        <div className="flex justify-center gap-2 pt-4">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentStep
                  ? "bg-primary"
                  : index < currentStep
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
