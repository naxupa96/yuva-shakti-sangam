/**
 * Helper utilities for normalizing and extracting participant data
 * Handles both direct column values and fallback encoded formats in referral_source
 */

export interface ParticipantLike {
  name?: string | null;
  gender?: string | null;
  samvaad_question?: string | null;
  referral_source?: string | null;
  interests?: string[] | string | null;
}

const FEMALE_FIRST_NAMES = new Set([
  "priya", "tulsi", "nishtha", "aenal", "jignasa", "priyanshi", "maahi", "yashashvi",
  "khushi", "vijyalaxmi", "ila", "bhavna", "amita", "sejal", "kalpana", "heli", "mihika",
  "jhanvi", "ashlesha", "dixita", "mauli", "jyoti", "aabha", "puja", "ritu", "shital",
  "vishwa", "pankti", "pooja", "sonal", "tanya", "natasa", "kavya", "eshita", "heena",
  "purva", "krisha", "varsha", "jeenal", "ritika", "swaraa", "mahek", "vishwambhara",
  "bhumika", "kinjal", "komal", "dharitri", "dhara", "krutika", "nirali", "riddhi",
  "siddhi", "drasti", "drashti", "shivani", "anjali", "bansi", "binal", "tejal",
  "mittal", "payal", "rupal", "sheetal", "kinari", "megha", "neha", "sneha", "kajal",
  "ekta", "nidhi", "prachi", "khushboo", "aparna", "tanvi", "avani", "raveena", "disha",
  "roshni", "gargi", "ishita", "dharti", "vaidehi", "urvashi", "palak", "pratima",
  "shreya", "charmi", "bansari", "forum", "bhoomi", "dipti", "dipali", "hetal",
  "jayshree", "geeta", "nirmala", "pushpa", "rekha", "saroj", "shanta", "sharda",
  "usha", "mamta", "sunita", "anita", "kavita"
]);

/**
 * Extracts or accurately infers the Gender (Male | Female) of a participant.
 * Checks explicit field/tag first, then applies robust linguistic rules and Indian naming lexicon.
 */
export function extractGender(p: ParticipantLike | null | undefined): "Male" | "Female" {
  if (!p) return "Male";

  if (p.gender && typeof p.gender === "string") {
    const g = p.gender.trim().toLowerCase();
    if (g === "female" || g === "f") return "Female";
    if (g === "male" || g === "m") return "Male";
  }

  if (p.referral_source && typeof p.referral_source === "string") {
    const match = p.referral_source.match(/(?:^|\|\s*)Gender:\s*([^|]+)/i);
    if (match && match[1]) {
      const g = match[1].trim().toLowerCase();
      if (g.startsWith("f")) return "Female";
      if (g.startsWith("m")) return "Male";
    }
  }

  const name = (p.name || "").trim();
  if (!name) return "Male";

  const words = name.toLowerCase().split(/[\s.]+/).filter(Boolean);

  for (const w of words) {
    if (FEMALE_FIRST_NAMES.has(w)) return "Female";
    if (w.endsWith("ben") || (w.length > 3 && w.endsWith("ba"))) return "Female";
  }

  return "Male";
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
 * Extracts pure referral source by stripping out embedded `Q: ...`, `Interests: ...`, and `Gender: ...` segments.
 */
export function extractReferralSource(p: ParticipantLike | null | undefined): string {
  if (!p || !p.referral_source || typeof p.referral_source !== "string") return "";

  const segments = p.referral_source.split("|").map((s) => s.trim());
  const cleanSegments = segments.filter(
    (seg) =>
      !seg.toLowerCase().startsWith("q:") &&
      !seg.toLowerCase().startsWith("interests:") &&
      !seg.toLowerCase().startsWith("gender:")
  );

  return cleanSegments.join(" | ");
}
