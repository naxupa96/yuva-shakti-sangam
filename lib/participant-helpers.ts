/**
 * Helper utilities for normalizing and extracting participant data
 * Handles both direct column values and fallback encoded formats in referral_source
 */

export interface ParticipantLike {
  samvaad_question?: string | null;
  referral_source?: string | null;
  interests?: string[] | string | null;
}

/**
 * Extracts the Samvaad Question from a participant record.
 * Checks direct `samvaad_question` field first, then checks for `Q: <text>` in `referral_source`.
 */
export function extractQuestion(p: ParticipantLike | null | undefined): string {
  if (!p) return "";

  if (p.samvaad_question && typeof p.samvaad_question === "string" && p.samvaad_question.trim()) {
    return p.samvaad_question.trim();
  }

  if (p.referral_source && typeof p.referral_source === "string") {
    // Look for Q: <question text> before any subsequent " | Interests:" or end of string
    const match = p.referral_source.match(/(?:^|\|\s*)Q:\s*([^|]+)/i);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return "";
}

/**
 * Extracts the list of interested domains from a participant record.
 * Handles arrays, JSON strings, comma-separated strings, or `Interests: <text>` in `referral_source`.
 */
export function extractInterests(p: ParticipantLike | null | undefined): string[] {
  if (!p) return [];

  if (p.interests) {
    if (Array.isArray(p.interests)) {
      return p.interests.filter((i) => typeof i === "string" && i.trim().length > 0);
    }
    if (typeof p.interests === "string") {
      try {
        const parsed = JSON.parse(p.interests);
        if (Array.isArray(parsed)) {
          return parsed.filter((i) => typeof i === "string" && i.trim().length > 0);
        }
      } catch {
        // Not valid JSON, process as comma-delimited
      }
      return p.interests
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
  }

  if (p.referral_source && typeof p.referral_source === "string") {
    const match = p.referral_source.match(/(?:^|\|\s*)Interests:\s*([^|]+)/i);
    if (match && match[1]) {
      return match[1]
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
  }

  return [];
}

/**
 * Extracts pure referral source by stripping out embedded `Q: ...` and `Interests: ...` segments.
 */
export function extractReferralSource(p: ParticipantLike | null | undefined): string {
  if (!p || !p.referral_source || typeof p.referral_source !== "string") return "";

  const segments = p.referral_source.split("|").map((s) => s.trim());
  const cleanSegments = segments.filter(
    (seg) =>
      !seg.toLowerCase().startsWith("q:") &&
      !seg.toLowerCase().startsWith("interests:")
  );

  return cleanSegments.join(" | ");
}
