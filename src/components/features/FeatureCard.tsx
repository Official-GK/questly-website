import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  badges?: string[];
  isNew?: boolean;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  path,
  badges = [],
  isNew = false
}: FeatureCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="group relative overflow-hidden border-2 hover:border-primary/50 transition-colors cursor-pointer"
      onClick={() => navigate(path)}
    >
      {isNew && (
        <Badge
          className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600"
          variant="secondary"
        >
          New
        </Badge>
      )}
      <div className="w-full p-6 text-left transition-transform group-hover:scale-[0.98] group-active:scale-[0.97]">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <Badge key={index} variant="outline">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
          <div className="pt-2">
            <Button className="w-full">
              Try Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
