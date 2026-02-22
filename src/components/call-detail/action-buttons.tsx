"use client";

import { Phone, MessageSquare, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonsProps {
  phoneNumber: string;
  callerName: string | null;
  serviceRequested: string | null;
  isContacted: boolean;
  onMarkContacted: () => void;
}

export function ActionButtons({
  phoneNumber,
  callerName,
  serviceRequested,
  isContacted,
  onMarkContacted,
}: ActionButtonsProps) {
  const telLink = `tel:${phoneNumber.replace(/\D/g, "")}`;
  const smsLink = `sms:${phoneNumber.replace(/\D/g, "")}?body=Hi ${callerName || "there"}, this is [Your Name] from [Your Business]. Thanks for calling about ${serviceRequested || "our services"}. I'd love to help — are you free to chat?`;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        asChild
        size="lg"
        className="bg-accent-500 hover:bg-accent-600 text-white w-full sm:w-auto"
      >
        <a href={telLink}>
          <Phone className="mr-2 h-5 w-5" />
          Call Back
        </a>
      </Button>

      <Button asChild variant="outline" className="w-full sm:w-auto">
        <a href={smsLink}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Send SMS
        </a>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onMarkContacted}
        disabled={isContacted}
        className={cn(isContacted && "opacity-50")}
      >
        <UserCheck className="h-4 w-4" />
      </Button>
    </div>
  );
}
