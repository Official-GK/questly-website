import { useState } from "react";
import { CreditCard, Check, Star, Crown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/contexts/AuthContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const plans = [
  {
    id: "price_basic",
    name: "Basic",
    price: "$0",
    priceId: "free_tier",
    description: "Perfect for getting started",
    features: ["5 quizzes per month", "Basic analytics", "Community support"],
    icon: CreditCard,
    popular: false,
  },
  {
    id: "price_premium",
    name: "Premium",
    price: "$15",
    priceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
    description: "Great for regular learners",
    features: ["Unlimited quizzes", "Detailed analytics", "Priority support", "Ad-free experience"],
    icon: Star,
    popular: true,
  },
  {
    id: "price_pro",
    name: "Pro",
    price: "$30",
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    description: "For professional educators",
    features: [
      "Everything in Premium",
      "Custom branding",
      "API access",
      "Team collaboration",
      "Advanced analytics",
    ],
    icon: Crown,
    popular: false,
  },
];

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(plan.id);
      
      if (plan.priceId === 'free_tier') {
        toast({
          title: "Free Plan Selected",
          description: "You're now on the Basic plan. Enjoy!",
        });
        setSelectedPlan(plan.name);
        return;
      }

      if (!plan.priceId) {
        throw new Error('Invalid price ID');
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planName: plan.name,
          email: user.email,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Network response was not ok');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your learning journey. All plans include access to our core features.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <SpotlightCard key={plan.id} className={plan.popular ? 'border-primary' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <plan.icon className="h-8 w-8 text-primary" />
                {plan.popular && (
                  <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                    Most Popular
                  </span>
                )}
              </div>
              <CardTitle className="text-2xl font-bold mt-4">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.price !== "$0" && <span className="text-muted-foreground">/month</span>}
              </div>
              <p className="text-muted-foreground mt-2">{plan.description}</p>
            </CardHeader>
            <CardContent className="mt-4">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.id || selectedPlan === plan.name}
              >
                {loading === plan.id ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    Processing...
                  </div>
                ) : selectedPlan === plan.name ? (
                  "Current Plan"
                ) : (
                  "Subscribe"
                )}
              </Button>
            </CardFooter>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
};

export default Subscription;