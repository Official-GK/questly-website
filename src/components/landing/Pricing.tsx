import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const tiers = [
  {
    name: 'Basic',
    id: 'basic',
    priceMonthly: 'Free',
    description: 'Perfect for getting started',
    features: [
      'Access to basic flashcards',
      'Limited quiz generation',
      'Basic progress tracking',
      '2 mock tests per month',
    ],
  },
  {
    name: 'Pro',
    id: 'pro',
    priceMonthly: '$9.99',
    description: 'For serious learners',
    features: [
      'Unlimited AI-powered flashcards',
      'Advanced quiz customization',
      'Detailed analytics',
      'Unlimited mock tests',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    id: 'enterprise',
    priceMonthly: '$29.99',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Team management',
      'Custom learning paths',
      'API access',
      'Dedicated support',
      'Custom integrations',
    ],
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Choose the right plan for you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-muted-foreground">
          Start for free and upgrade as you grow. All plans include a 14-day free trial.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={`flex flex-col justify-between rounded-3xl bg-card p-8 ring-1 ring-muted ${
                tierIdx === 1 ? 'lg:z-10 lg:rounded-b-none' : ''
              } ${tierIdx === 0 ? 'lg:rounded-r-none' : ''} ${
                tierIdx === 2 ? 'lg:rounded-l-none' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8">{tier.name}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight">{tier.priceMonthly}</span>
                  {tier.priceMonthly !== 'Free' && (
                    <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
                  )}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className="mt-8"
                variant={tierIdx === 1 ? "default" : "outline"}
                onClick={() => navigate("/register")}
              >
                Get started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
