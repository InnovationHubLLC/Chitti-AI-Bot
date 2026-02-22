"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Check, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type IntegrationType = "none" | "google" | "manual";

export function CalendarIntegration() {
  const [integrationType, setIntegrationType] = useState<IntegrationType>("none");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = (type: IntegrationType) => {
    setIsConnecting(true);
    setTimeout(() => {
      setIntegrationType(type);
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Connect Your Calendar</h3>
        <p className="text-sm text-gray-600 mb-6">
          Connect your calendar so Chitti can check availability and schedule appointments automatically.
        </p>
      </div>

      <div className="grid gap-4">
        <Card className={integrationType === "google" ? "border-accent-500 border-2" : ""}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Google Calendar</CardTitle>
                  <CardDescription>Sync with your Google Calendar</CardDescription>
                </div>
              </div>
              {integrationType === "google" && (
                <Badge className="bg-green-500">
                  <Check className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {integrationType === "google" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">user@example.com</p>
                    <p className="text-xs text-gray-500">Primary Calendar</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Disconnect
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => handleConnect("google")}
                disabled={isConnecting}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Google Calendar"}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className={integrationType === "manual" ? "border-accent-500 border-2" : ""}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Manual Management</CardTitle>
                  <CardDescription>I&apos;ll manage appointments myself</CardDescription>
                </div>
              </div>
              {integrationType === "manual" && (
                <Badge className="bg-green-500">
                  <Check className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {integrationType === "manual" ? (
              <p className="text-sm text-gray-600">
                Chitti will collect caller information and you&apos;ll manage appointments manually.
              </p>
            ) : (
              <Button
                variant="outline"
                onClick={() => handleConnect("manual")}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? "Setting up..." : "Choose Manual Management"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {integrationType !== "none" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appointment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Default Appointment Duration</Label>
              <Input type="number" defaultValue="60" className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">Minutes</p>
            </div>
            <div>
              <Label>Buffer Time Between Appointments</Label>
              <Input type="number" defaultValue="15" className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">Minutes</p>
            </div>
            <div>
              <Label>How far in advance can customers book?</Label>
              <Input type="number" defaultValue="30" className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">Days</p>
            </div>
            <div>
              <Label>Same-day booking cutoff</Label>
              <Input type="time" defaultValue="16:00" className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">
                Latest time customers can book appointments for today
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
