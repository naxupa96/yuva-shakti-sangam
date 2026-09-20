"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Send,
  CheckCircle2,
  Loader2,
  Sparkles,
  MessageSquareHeart,
  Edit3,
  ThumbsUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Participant } from "@/types/registration";
import { EventFeedback } from "@/types/feedback";
import { CornerOrnament } from "@/components/Decorations";

interface EventFeedbackFormProps {
  participant: Participant;
}

const RATING_LABELS: Record<number, { title: string; subtitle: string }> = {
  1: { title: "Needs Improvement", subtitle: "सुधार आवश्यक" },
  2: { title: "Fair Experience", subtitle: "ठीक-ठाक अनुभव" },
  3: { title: "Good Event", subtitle: "सराहनीय आयोजन" },
  4: { title: "Very Good!", subtitle: "अति उत्तम अनुभव!" },
  5: { title: "Outstanding & Inspiring!", subtitle: "अद्भुत व प्रेरणादायी राष्ट्र संगम!" },
};

export default function EventFeedbackForm({ participant }: EventFeedbackFormProps) {
  const [rating, setRating] = useState<number>(1);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [existingFeedback, setExistingFeedback] = useState<EventFeedback | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Fetch existing feedback if already submitted
  useEffect(() => {
    if (!participant?.qr_token) return;

    fetch(`/api/feedback?token=${encodeURIComponent(participant.qr_token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.feedback) {
          setExistingFeedback(data.feedback);
          setRating(data.feedback.rating);
          setFeedbackText(data.feedback.feedback_text);
        }
      })
      .catch((err) => {
        console.warn("Feedback fetch warning:", err);
      })
      .finally(() => setLoadingInitial(false));
  }, [participant?.qr_token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      setErrorMessage("Please select a star rating (1 to 5 stars).");
      return;
    }
    if (!feedbackText.trim() || feedbackText.trim().length < 3) {
      setErrorMessage("Please write a few words about your experience.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qr_token: participant.qr_token,
          rating,
          feedback_text: feedbackText.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.feedback) {
        setExistingFeedback(data.feedback);
        setIsEditing(false);
        setSuccessMessage("Thank you! Your feedback has been recorded.");

        // Confetti celebration
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 },
            colors: ["#E65100", "#FFA000", "#15803D", "#FFFFFF"],
          });
        } catch {}
      } else {
        setErrorMessage(data.error || "Could not submit feedback. Please try again.");
      }
    } catch (err) {
      console.error("Feedback submit error:", err);
      setErrorMessage("Network error. Please check connection and retry.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeRating = hoverRating || rating;
  const ratingDetails = RATING_LABELS[activeRating] || RATING_LABELS[1];

  if (loadingInitial) {
    return (
      <div className="p-6 rounded-3xl bg-[#F5EBE1] border-2 border-[#1C1917]/15 flex items-center justify-center gap-2 text-xs font-bold text-[#5A4839]">
        <Loader2 className="w-4 h-4 animate-spin text-[#E65100]" />
        <span>Loading feedback section...</span>
      </div>
    );
  }

  // Already submitted state (unless user clicked Edit)
  if (existingFeedback && !isEditing) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-[#F5EBE1] border-2 border-[#1C1917]/20 shadow-parchment-deep relative overflow-hidden text-center space-y-4">
        <CornerOrnament className="absolute top-3 left-3 text-[#E65100]/30" />
        <CornerOrnament className="absolute top-3 right-3 text-[#E65100]/30 -scale-x-100" />
        <CornerOrnament className="absolute bottom-3 left-3 text-[#E65100]/30 -scale-y-100" />
        <CornerOrnament className="absolute bottom-3 right-3 text-[#E65100]/30 -scale-100" />

        <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#E65100]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FEEDBACK SUBMITTED</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-[#1C1917] uppercase tracking-tight">
            Thank You, {participant.name.split(" ")[0]}!
          </h3>
          <p className="text-xs text-[#5A4839] max-w-md mx-auto">
            Your evaluation and thoughts help the organizers strengthen upcoming youth initiatives and nation-building assemblies.
          </p>
        </div>

        {/* Display Submitted Stars */}
        <div className="py-2 flex flex-col items-center justify-center gap-1">
          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((starVal) => (
              <Star
                key={starVal}
                className={`w-7 h-7 ${
                  starVal <= existingFeedback.rating
                    ? "text-[#FFA000] fill-[#FFA000]"
                    : "text-zinc-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-[#E65100] mt-1">
            {RATING_LABELS[existingFeedback.rating]?.title || `${existingFeedback.rating} Stars`}
          </span>
        </div>

        {/* Display Feedback Quote */}
        {existingFeedback.feedback_text && (
          <div className="p-4 rounded-2xl bg-white/80 border border-[#292524]/10 shadow-inner max-w-lg mx-auto">
            <p className="text-xs sm:text-sm font-serif italic text-[#1C1917] leading-relaxed">
              &ldquo;{existingFeedback.feedback_text}&rdquo;
            </p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A4839] hover:text-[#E65100] transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update / Edit Your Feedback</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Feedback Form
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#F5EBE1] border-2 border-[#1C1917]/20 shadow-parchment-deep relative overflow-hidden">
      <CornerOrnament className="absolute top-3 left-3 text-[#E65100]/30" />
      <CornerOrnament className="absolute top-3 right-3 text-[#E65100]/30 -scale-x-100" />
      <CornerOrnament className="absolute bottom-3 left-3 text-[#E65100]/30 -scale-y-100" />
      <CornerOrnament className="absolute bottom-3 right-3 text-[#E65100]/30 -scale-100" />

      <div className="max-w-lg mx-auto space-y-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#E65100]">
            <MessageSquareHeart className="w-4 h-4" />
            <span>EVENT FEEDBACK &amp; REVIEW</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-[#1C1917] uppercase tracking-tight">
            How Was Your Sangam Experience?
          </h3>
          <p className="text-xs text-[#5A4839]">
            Rate the event out of 5 stars and share your feedback with the organizers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 5-Star Interactive Rating Selector */}
          <div className="p-4 rounded-2xl bg-[#FAF4EC] border border-[#292524]/15 flex flex-col items-center justify-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#5A4839]">
              TAP TO RATE (1 TO 5 STARS)
            </span>

            <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isSelected = starVal <= activeRating;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 rounded-xl hover:scale-125 focus:outline-none transition-transform cursor-pointer"
                    aria-label={`Rate ${starVal} out of 5 stars`}
                  >
                    <Star
                      className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors duration-200 ${
                        isSelected
                          ? "text-[#FFA000] fill-[#FFA000] drop-shadow-sm"
                          : "text-zinc-300 hover:text-[#FFA000]/60"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Dynamic Star Feedback Badge */}
            <div className="text-center transition-all">
              <div className="text-xs font-black uppercase tracking-wider text-[#E65100]">
                {ratingDetails.title}
              </div>
              <div className="text-[11px] font-devanagari text-[#5A4839]">
                {ratingDetails.subtitle}
              </div>
            </div>
          </div>

          {/* Feedback Text Area */}
          <div className="space-y-1 text-left">
            <label
              htmlFor="feedback_text"
              className="block text-xs font-bold uppercase tracking-wider text-[#1C1917]"
            >
              Your Feedback &amp; Suggestions <span className="text-[#E65100]">*</span>
            </label>
            <textarea
              id="feedback_text"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What did you like the most about Yuva Shakti Sangam? Any highlights, sessions, or ideas for future events?"
              rows={4}
              maxLength={1000}
              className="w-full p-3.5 rounded-2xl bg-[#FAF4EC] border border-[#292524]/20 text-xs sm:text-sm text-[#1C1917] placeholder:text-[#5A4839]/60 focus:outline-none focus:border-[#E65100] focus:ring-1 focus:ring-[#E65100] transition-all resize-none"
            />
            <div className="flex items-center justify-between text-[10px] text-[#5A4839] px-1">
              <span>Help the organizers make future events even better</span>
              <span>{feedbackText.length}/1000</span>
            </div>
          </div>

          {/* Status Notifications */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-medium text-center">
              {successMessage}
            </div>
          )}

          {/* Submit Action Button */}
          <div className="flex items-center gap-2 pt-1">
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-3 px-4 rounded-xl bg-[#FAF4EC] border border-[#292524]/20 text-xs font-bold text-[#5A4839] hover:text-[#1C1917] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 px-6 rounded-2xl btn-bhagwa-primary text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isEditing ? "UPDATE FEEDBACK" : "SUBMIT FEEDBACK &amp; RATING"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
