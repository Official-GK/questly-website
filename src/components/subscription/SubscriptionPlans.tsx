import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const plans = [
  {
    id: "free",
    name: "Free Plan",
    price: "$0",
    description: "Basic access to learning resources",
    features: [
      "Access to free courses",
      "Basic quizzes",
      "Community support",
      "Limited flashcards",
    ],
    badge: "",
    icon: Zap,
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: "$9.99",
    period: "monthly",
    description: "Enhanced learning experience",
    features: [
      "All free features",
      "Access to premium courses",
      "Advanced quizzes",
      "Unlimited flashcards",
      "Priority support",
      "Progress tracking",
    ],
    badge: "Popular",
    icon: Crown,
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "$89.99",
    period: "yearly",
    description: "Complete learning suite",
    features: [
      "All pro features",
      "1-on-1 mentoring",
      "Career guidance",
      "Certificate of completion",
      "Custom learning path",
      "Team collaboration",
    ],
    badge: "Best Value",
    icon: Crown,
  },
];

export default function SubscriptionPlans() {
  const { userProfile, updateUserPremium } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const isPremiumUser = userProfile?.isPremium || false;

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    try {
      // Here you would typically integrate with a payment processor
      // For now, we'll just update the premium status
      const success = await updateUserPremium(planId !== "free");
      if (success) {
        setSelectedPlan(planId);
      }
    } catch (error) {
      console.error("Failed to process subscription:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;
          const isCurrentPlan = isPremiumUser ? (plan.id !== "free") : (plan.id === "free");
          
          return (
            <Card 
              key={plan.id} 
              className={`p-6 space-y-6 cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'ring-2 ring-amber-500 shadow-lg' : ''
              } ${isCurrentPlan ? 'bg-muted/50' : ''}`}
              onClick={() => !isProcessing && setSelectedPlan(plan.id)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${plan.id !== "free" ? "text-amber-500" : ""}`} />
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  {plan.badge && (
                    <Badge className={plan.id === "premium" ? "bg-gradient-to-r from-amber-500 to-amber-600" : ""}>
                      {plan.badge}
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Button 
                  className={`w-full ${
                    plan.id !== "free" 
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white" 
                      : ""
                  }`}
                  variant={plan.id === "free" ? "outline" : "default"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(plan.id);
                  }}
                  disabled={isProcessing || isCurrentPlan}
                >
                  {isProcessing && isSelected ? (
                    "Processing..."
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : plan.id === "free" ? (
                    "Switch to Free Plan"
                  ) : (
                    `Buy ${plan.name} ${plan.period ? `(${plan.price}/${plan.period === 'monthly' ? 'mo' : 'yr'})` : ''}`
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedPlan && !isProcessing && (
        <p className="text-sm text-center text-muted-foreground">
          Click the button above to {selectedPlan === "free" ? "switch to" : "purchase"} your selected plan
        </p>
      )}
    </div>
  );
}
