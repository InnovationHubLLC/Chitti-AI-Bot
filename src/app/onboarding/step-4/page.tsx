"use client";

import { ProgressBar } from "@/components/onboarding/progress-bar";
import { TestCallFlow } from "@/components/onboarding/test-call/test-call-flow";

export default function OnboardingStep4() {
  return (
    <>
      <ProgressBar currentStep={4} />
      <div className="max-w-[640px] mx-auto">
        <TestCallFlow />
      </div>
    </>
  );
}
