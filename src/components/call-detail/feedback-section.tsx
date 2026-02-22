"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function FeedbackSection() {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [amountPaid, setAmountPaid] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    const feedback = {
      isHelpful,
      amountPaid: amountPaid ? parseFloat(amountPaid) : null,
      rating,
      notes: notes || null,
    };
    console.log(feedback);
  };

  return (
    <div className="bg-white border rounded-xl p-5 space-y-5">
      <div>
        <p className="text-sm font-medium text-navy-700 mb-3">
          Was this analysis helpful?
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsHelpful(true)}
            className={
              isHelpful === true
                ? "bg-emerald-50 border-emerald-500 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-600"
                : ""
            }
          >
            <ThumbsUp
              className={`h-4 w-4 ${isHelpful === true ? "fill-emerald-500" : ""}`}
            />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsHelpful(false)}
            className={
              isHelpful === false
                ? "bg-red-50 border-red-500 text-red-500 hover:bg-red-100 hover:text-red-600"
                : ""
            }
          >
            <ThumbsDown
              className={`h-4 w-4 ${isHelpful === false ? "fill-red-500" : ""}`}
            />
          </Button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-navy-700 mb-2 block">
          What did the caller actually end up paying?
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500">
            $
          </span>
          <Input
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            placeholder="0.00"
            className="pl-7"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-navy-700 mb-2 block">
          Rate the AI conversation quality
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  rating && star <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-navy-200"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-navy-700 mb-2 block">
          Notes
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes..."
          className="min-h-[80px] resize-none"
        />
      </div>

      <Button
        onClick={handleSave}
        className="w-full bg-accent-500 hover:bg-accent-600 text-white"
      >
        Save Feedback
      </Button>
    </div>
  );
}
