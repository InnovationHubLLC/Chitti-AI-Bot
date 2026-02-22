"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TranscriptMessage {
  role: "ai" | "caller";
  content: string;
  timestamp: string;
}

interface TranscriptSectionProps {
  transcript: TranscriptMessage[];
}

export function TranscriptSection({ transcript }: TranscriptSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTranscript = useMemo(() => {
    if (!searchQuery.trim()) {
      return transcript;
    }
    return transcript.filter((message) =>
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transcript, searchQuery]);

  const matchCount = searchQuery.trim() ? filteredTranscript.length : null;

  if (transcript.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transcript available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
        <Input
          type="text"
          placeholder="Search transcript..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
        {matchCount !== null && (
          <div className="mt-2 text-xs text-navy-400">
            {matchCount} {matchCount === 1 ? "message" : "messages"} found
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        {filteredTranscript.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col max-w-[80%] ${
              message.role === "ai" ? "self-start" : "self-end"
            }`}
          >
            <div
              className={`text-xs font-medium mb-1 ${
                message.role === "ai" ? "text-navy-600" : "text-navy-600"
              }`}
            >
              {message.role === "ai" ? "Chitti AI" : "Caller"}
            </div>
            <div
              className={`px-4 py-3 rounded-lg ${
                message.role === "ai"
                  ? "bg-gray-100 text-gray-900"
                  : "bg-navy-100 text-navy-900"
              }`}
            >
              {message.content}
            </div>
            <div className="text-xs text-navy-400 mt-1">
              {message.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
