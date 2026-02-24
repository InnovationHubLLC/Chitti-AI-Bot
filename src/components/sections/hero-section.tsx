import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection(): React.ReactElement {
  return (
    <section className="relative bg-gradient-to-br from-navy-50 via-white to-accent-50 py-20 md:py-28 lg:py-36">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 mb-6 leading-tight">
          Every missed call is a missed deal. Chitti catches both.
        </h1>

        <p className="text-lg md:text-xl text-navy-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          AI voice assistant that answers your calls, qualifies leads, and tells
          you exactly what each caller is willing to pay — so every follow-up is
          a strategic conversation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Button
            asChild
            size="lg"
            className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-6 text-lg"
          >
            <Link href="/onboarding/step-1">Start Free Trial</Link>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="text-navy-700 hover:text-navy-900 hover:bg-navy-100 px-8 py-6 text-lg"
          >
            <Play className="size-5 mr-2" />
            Watch Demo
          </Button>
        </div>

        <p className="text-sm text-navy-500">
          14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
