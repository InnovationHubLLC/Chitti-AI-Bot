"use client";

import { Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface TranscriptMessage {
  id: string;
  role: "ai" | "caller";
  content: string;
}

interface CallInProgressProps {
  phoneNumber: string;
  messages: TranscriptMessage[];
  isTyping: boolean;
}

export function CallInProgress({
  phoneNumber,
  messages,
  isTyping,
}: CallInProgressProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">
          Call in progress
        </h1>
        <p className="text-navy-500">
          Listen along as Chitti handles the call
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1.5 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Live
        </Badge>
        <span className="text-sm text-navy-500">{phoneNumber}</span>
      </div>

      <Card className="border-navy-100">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "caller" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.role === "caller"
                      ? "bg-accent-500 text-white rounded-br-md"
                      : "bg-gray-100 text-navy-800 rounded-bl-md"
                  }`}
                >
                  <p className="text-xs font-medium mb-1 opacity-70">
                    {msg.role === "caller" ? "You (Caller)" : "Chitti AI"}
                  </p>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <p className="text-xs font-medium mb-1 text-navy-400">
                    Chitti AI
                  </p>
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-navy-300 animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 rounded-full bg-navy-300 animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-navy-300 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-2 text-navy-400">
        <Phone className="w-4 h-4" />
        <p className="text-sm">Call will complete automatically...</p>
      </div>
    </div>
  );
}
