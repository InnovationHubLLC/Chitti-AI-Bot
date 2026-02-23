export function buildPriceIntelligencePrompt(transcript: string): string {
  return `Extract all pricing-related signals from the following phone call transcript.

TRANSCRIPT:
${transcript}

For each pricing signal found, provide:
{
  "signals": [
    {
      "signal": "<description of the price signal>",
      "strength": "<strong | moderate | weak>",
      "sourceUtterance": "<exact quote from the transcript>"
    }
  ]
}

SIGNAL TYPES TO LOOK FOR:
- Direct price quotes or mentions
- Price comparisons ("cheaper than", "more expensive")
- Budget mentions or constraints
- Payment plan interest
- Insurance coverage questions
- Discount requests
- Value statements ("worth it", "too much")
- Competitor price references

STRENGTH GUIDELINES:
- strong: Direct statement about price acceptance/rejection, explicit budget number
- moderate: Indirect price reference, comparison, or general concern
- weak: Implied price sensitivity, vague references to cost`;
}
