import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/onboarding/progress-bar";
import { BusinessInfoForm } from "@/components/onboarding/business-info-form";

export default function OnboardingStep1Page() {
  return (
    <div className="max-w-[640px] mx-auto">
      <ProgressBar currentStep={1} />

      <Card>
        <CardHeader>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">
            Let&apos;s set up your AI assistant
          </h1>
          <p className="text-muted-foreground mt-2">
            We&apos;ll have Chitti ready to answer calls in about 10 minutes.
          </p>
        </CardHeader>
        <CardContent>
          <BusinessInfoForm />
        </CardContent>
      </Card>
    </div>
  );
}
