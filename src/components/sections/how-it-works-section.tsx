import { Phone, Brain, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    icon: Phone,
    title: "Catches Your Calls",
    description:
      "Chitti answers when you can't — after hours, weekends, during appointments. Natural conversation, not a robot menu.",
  },
  {
    icon: Brain,
    title: "Reads the Buyer",
    description:
      "Qualifies every caller and detects their price willingness. You'll know their budget range before you call back.",
  },
  {
    icon: Target,
    title: "Delivers the Play",
    description:
      "Get an SMS with the caller's info, deal score, and exactly how to price your follow-up. Close more, guess less.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-navy-900 mb-4">
          How It Works
        </h2>
        <p className="text-center text-navy-600 mb-12 max-w-2xl mx-auto">
          Three simple steps to never miss another opportunity
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="text-center p-6 border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mb-4">
                  <step.icon className="w-8 h-8 text-accent-500" />
                </div>
                <CardTitle className="text-xl text-navy-900">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-navy-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
