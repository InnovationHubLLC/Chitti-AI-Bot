export function buildPostCallAnalysisPrompt(transcript: string): string {
  return `Analyze the following phone call transcript and provide a structured assessment.

TRANSCRIPT:
${transcript}

Provide your analysis in the following JSON format:
{
  "leadScore": <0-100, overall lead quality>,
  "dealIntentScore": <0-100, likelihood of booking/purchasing>,
  "confidence": <0-1, your confidence in this analysis>,
  "priceComfort": <0-100, caller's comfort with pricing>,
  "resistance": <0-100, level of objection/resistance>,
  "sentiment": <"positive" | "neutral" | "negative">,
  "qualificationDetails": [
    { "question": "<qualification question asked>", "answer": "<caller's response>", "score": <0-100> }
  ],
  "summary": "<2-3 sentence summary of the call outcome>"
}

SCORING GUIDELINES:
- leadScore: Consider urgency, specificity of needs, and engagement level
- dealIntentScore: Focus on booking intent, timeline mentions, and decision readiness
- priceComfort: High = accepted pricing, Low = expressed concern about cost
- resistance: High = many objections, Low = receptive and agreeable
- Only include qualification details for questions that were actually discussed`;
}
