import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/onboarding/progress-bar";

export default function OnboardingStep2Page() {
  return (
    <div className="max-w-[640px] mx-auto">
      <ProgressBar currentStep={2} />

      <Card>
        <CardHeader>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">
            Review Content
          </h1>
          <p className="text-muted-foreground mt-2">
            Step 2 coming soon...
          </p>
        </CardHeader>
        <CardContent>
          <p>This step will be built next.</p>
        </CardContent>
      </Card>
    </div>
  );
}
