import { Brain, ScrollText, GraduationCap, LineChart } from "lucide-react";

const features = [
  {
    name: 'AI-Powered Flashcards',
    description: 'Generate smart flashcards instantly using our advanced AI technology.',
    icon: ScrollText,
  },
  {
    name: 'Adaptive Quizzes',
    description: 'Take personalized quizzes that adapt to your learning progress.',
    icon: Brain,
  },
  {
    name: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics and insights.',
    icon: LineChart,
  },
  {
    name: 'Mock Tests',
    description: 'Practice with realistic mock tests to prepare for your exams.',
    icon: GraduationCap,
  },
];

export default function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Learn Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to accelerate your learning
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our platform combines the power of AI with proven learning techniques to help you master any subject.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
