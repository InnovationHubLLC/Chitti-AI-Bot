import Link from "next/link";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FEATURES = [
  "300 minutes included",
  "Full deal intelligence on every call",
  "Price threshold analysis",
  "Appointment booking",
  "Instant SMS for hot leads",
  "Dashboard with call analytics",
  "Works for any service industry",
];

export function PricingSection(): React.ReactElement {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-navy-900 mb-4">
          One plan. Everything included. No feature gates.
        </h2>

        <Card className="max-w-md mx-auto mt-12 p-8 shadow-xl border-2 border-accent-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-navy-900 mb-4">
              Everything You Need
            </CardTitle>
            <div className="mt-4">
              <span className="text-5xl font-bold text-navy-900">$99</span>
              <span className="text-navy-600">/month</span>
            </div>
            <p className="text-sm text-accent-600 mt-2 font-semibold">
              Billed annually (save $600/year)
            </p>
            <p className="text-navy-500 text-sm">or $149/month billed monthly</p>
          </CardHeader>

          <CardContent>
            <ul className="space-y-3 mt-6">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="size-5 text-accent-500 flex-shrink-0" />
                  <span className="text-navy-700">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full bg-accent-500 hover:bg-accent-600 text-white py-6 text-lg">
              <Link href="/sign-up">Start Free Trial</Link>
            </Button>
            <p className="text-xs text-navy-500 text-center mt-2">
              14-day free trial. No credit card. Cancel anytime.
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
