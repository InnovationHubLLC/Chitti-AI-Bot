import { useState, useCallback } from "react";

interface WebsiteScanState {
  status: "idle" | "scanning" | "success" | "error";
  servicesCount: number | null;
  faqsCount: number | null;
  error: string | null;
}

export function useWebsiteScanner() {
  const [state, setState] = useState<WebsiteScanState>({
    status: "idle",
    servicesCount: null,
    faqsCount: null,
    error: null,
  });

  const scan = useCallback(async (url: string) => {
    if (!url) {
      setState({
        status: "idle",
        servicesCount: null,
        faqsCount: null,
        error: null,
      });
      return;
    }

    setState({
      status: "scanning",
      servicesCount: null,
      faqsCount: null,
      error: null,
    });

    try {
      const response = await fetch("/api/onboarding/scan-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to scan website");
      }

      const data = await response.json();

      setState({
        status: "success",
        servicesCount: data.servicesCount,
        faqsCount: data.faqsCount,
        error: null,
      });
    } catch {
      setState({
        status: "error",
        servicesCount: null,
        faqsCount: null,
        error: "Failed to scan website. Please check the URL and try again.",
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      status: "idle",
      servicesCount: null,
      faqsCount: null,
      error: null,
    });
  }, []);

  return { ...state, scan, reset };
}
