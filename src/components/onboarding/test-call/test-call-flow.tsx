"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { BeforeCall } from "./before-call";
import { CallInProgress } from "./call-in-progress";
import type { TranscriptMessage } from "./call-in-progress";
import { CallComplete } from "./call-complete";
import type { CallAnalysisData } from "./call-complete";
import { MOCK_PHONE_NUMBER, MOCK_TRANSCRIPT, MOCK_ANALYSIS } from "./mock-data";

type CallState = "before" | "in_progress" | "complete";

export function TestCallFlow() {
  const router = useRouter();
  const [callState, setCallState] = useState<CallState>("before");
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [analysis, setAnalysis] = useState<CallAnalysisData | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const simulateCall = useCallback(() => {
    clearTimeouts();
    setCallState("in_progress");
    setMessages([]);
    setIsTyping(true);

    let delay = 800;

    MOCK_TRANSCRIPT.forEach((msg) => {
      const tid1 = setTimeout(() => {
        setIsTyping(true);
      }, delay);
      timeoutsRef.current.push(tid1);

      delay += msg.role === "ai" ? 1200 : 800;

      const tid2 = setTimeout(() => {
        setMessages((prev) => [...prev, msg]);
        setIsTyping(false);
      }, delay);
      timeoutsRef.current.push(tid2);

      delay += 600;
    });

    const tid3 = setTimeout(() => {
      setAnalysis(MOCK_ANALYSIS);
      setCallState("complete");
    }, delay + 1000);
    timeoutsRef.current.push(tid3);
  }, [clearTimeouts]);

  const handleFinishSetup = useCallback(() => {
    router.push("/onboarding/success");
  }, [router]);

  const handleAnotherCall = useCallback(() => {
    clearTimeouts();
    setCallState("before");
    setMessages([]);
    setAnalysis(null);
    setIsTyping(false);
  }, [clearTimeouts]);

  if (callState === "in_progress") {
    return (
      <CallInProgress
        phoneNumber={MOCK_PHONE_NUMBER}
        messages={messages}
        isTyping={isTyping}
      />
    );
  }

  if (callState === "complete" && analysis) {
    return (
      <CallComplete
        analysis={analysis}
        onFinishSetup={handleFinishSetup}
        onAnotherCall={handleAnotherCall}
      />
    );
  }

  return (
    <BeforeCall
      phoneNumber={MOCK_PHONE_NUMBER}
      onSimulateCall={simulateCall}
    />
  );
}
