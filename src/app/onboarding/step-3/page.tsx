"use client";

import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/onboarding/progress-bar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessHoursEditor } from "@/components/onboarding/business-hours-editor";
import { CalendarIntegration } from "@/components/onboarding/calendar-integration";

export default function OnboardingStep3() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/onboarding/step-2");
  };

  const handleContinue = () => {
    router.push("/");
  };

  return (
    <>
      <ProgressBar currentStep={3} />

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Set your hours and calendar</CardTitle>
          <CardDescription>
            Configure your business hours and connect your calendar so Chitti can schedule appointments intelligently.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="hours" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="hours">Business Hours</TabsTrigger>
              <TabsTrigger value="calendar">Calendar & Appointments</TabsTrigger>
            </TabsList>

            <TabsContent value="hours" className="space-y-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  When are you open?
                </h3>
                <p className="text-sm text-gray-500">
                  Set your regular business hours. You can add split shifts by clicking &quot;Add hours&quot;.
                </p>
              </div>
              <BusinessHoursEditor />
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <CalendarIntegration />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6 mt-6 border-t">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleContinue}>Continue</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
