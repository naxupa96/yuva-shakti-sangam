/**
 * Vision AI OCR and Parser for UPI Payment Screenshots
 * Supports Google Cloud Vision API and Gemini Vision REST APIs.
 */

export interface OcrParseResult {
  success: boolean;
  rawText?: string;
  utr?: string;
  amount?: number;
  isAmountValid?: boolean;
  isPayeeValid?: boolean;
  payeeDetected?: string;
  statusText?: string;
  confidenceScore: number;
  error?: string;
}

const EXPECTED_PAYEE_KEYWORDS = ["kushal", "ghanshyambhai", "7046232003", "yuva shakti sangam"];
const EXPECTED_AMOUNT = 50;

/**
 * Clean Base64 string from data URL header
 */
export function cleanBase64(dataUrlOrBase64: string): string {
  if (dataUrlOrBase64.includes(",")) {
    return dataUrlOrBase64.split(",")[1];
  }
  return dataUrlOrBase64.trim();
}

/**
 * Call Google Cloud Vision API for TEXT_DETECTION
 */
async function callGoogleVisionApi(base64Image: string, apiKey: string): Promise<string> {
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: [
        {
          image: { content: base64Image },
          features: [{ type: "TEXT_DETECTION" }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Vision API failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const fullText =
    data.responses?.[0]?.fullTextAnnotation?.text ||
    data.responses?.[0]?.textAnnotations?.[0]?.description ||
    "";

  return fullText;
}

/**
 * Call Gemini Flash API for Vision extraction
 */
async function callGeminiVisionApi(base64Image: string, apiKey: string): Promise<{
  text: string;
  structured?: any;
}> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const prompt = `Analyze this Indian UPI payment screenshot (Google Pay, PhonePe, Paytm, BHIM, Cred, or NetBanking).
Extract the following information in strict JSON format:
{
  "utr": "12-digit UPI reference number / UTR / Transaction ID (or null if not found)",
  "amount": number (e.g. 50),
  "payee": "Name or UPI ID of receiver (e.g. Kushal Ghanshyambhai or 7046232003@upi)",
  "status": "SUCCESS" | "FAILED" | "PENDING",
  "full_text_summary": "brief summary of detected text"
}
Return ONLY valid JSON.`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini Vision API failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  try {
    const parsed = JSON.parse(candidateText);
    return { text: parsed.full_text_summary || candidateText, structured: parsed };
  } catch {
    return { text: candidateText };
  }
}

/**
 * Parse 12-digit UTR from raw OCR text using regex patterns
 */
export function extractUtrFromText(text: string): string | null {
  if (!text) return null;

  // Specific UPI UTR / Ref No patterns (12 digits)
  const patterns = [
    /(?:UPI\s*Ref(?:\s*No|\s*ID|\s*Number)?|UTR(?:\s*No|\s*Number)?|Ref\s*No|Transaction\s*ID|Txn\s*ID)[:\s#]*([0-9]{12})/i,
    /(?:UPI\s*transaction\s*ID|Google\s*transaction\s*ID)[:\s#]*([0-9]{12})/i,
    /(?:Bank\s*RRN|RRN)[:\s#]*([0-9]{12})/i,
    /\b([0-9]{12})\b/, // Standalone 12 digits
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length === 12) {
      return match[1];
    }
  }

  return null;
}

/**
 * Parse Amount from raw OCR text
 */
export function extractAmountFromText(text: string): number | null {
  if (!text) return null;

  // Patterns for ₹50, Rs. 50, 50.00
  const patterns = [
    /(?:₹|Rs\.?|INR)\s*([0-9]+(?:\.[0-9]{1,2})?)/i,
    /([0-9]+(?:\.[0-9]{1,2})?)\s*(?:paid|sent|transferred|successful)/i,
    /\b(50(?:\.00)?)\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const amt = parseFloat(match[1]);
      if (!isNaN(amt)) return amt;
    }
  }

  return null;
}

/**
 * Main OCR Verification function
 */
export async function parseUpiScreenshot(base64Image: string): Promise<OcrParseResult> {
  const apiKey =
    process.env.GOOGLE_VISION_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      confidenceScore: 0,
      error: "OCR Vision API key is not configured. Please add GOOGLE_VISION_API_KEY in .env.local",
    };
  }

  const cleanImage = cleanBase64(base64Image);

  try {
    let extractedText = "";
    let structuredResult: any = null;

    // Try Google Cloud Vision API first, fallback to Gemini Vision if available
    try {
      extractedText = await callGoogleVisionApi(cleanImage, apiKey);
    } catch (visionErr: any) {
      console.warn("Google Vision API call failed, trying Gemini API...", visionErr.message);
      const geminiRes = await callGeminiVisionApi(cleanImage, apiKey);
      extractedText = geminiRes.text;
      structuredResult = geminiRes.structured;
    }

    if (!extractedText && !structuredResult) {
      return {
        success: false,
        confidenceScore: 0,
        error: "Could not read text from the uploaded screenshot. Please upload a clearer image.",
      };
    }

    // Extract UTR
    let utr = structuredResult?.utr || extractUtrFromText(extractedText);

    // Extract Amount
    let amount =
      typeof structuredResult?.amount === "number"
        ? structuredResult.amount
        : extractAmountFromText(extractedText);

    // Payee check (case-insensitive keyword search)
    const lowerText = (extractedText + " " + (structuredResult?.payee || "")).toLowerCase();
    const isPayeeValid = EXPECTED_PAYEE_KEYWORDS.some((kw) => lowerText.includes(kw));

    // Amount match
    const isAmountValid = amount === EXPECTED_AMOUNT || (amount !== null && Math.abs(amount - EXPECTED_AMOUNT) < 0.01);

    // Status check
    const isSuccessStatus =
      structuredResult?.status === "SUCCESS" ||
      lowerText.includes("paid") ||
      lowerText.includes("success") ||
      lowerText.includes("completed") ||
      lowerText.includes("successful");

    let confidence = 0;
    if (utr && utr.length === 12) confidence += 40;
    if (isAmountValid) confidence += 25;
    if (isPayeeValid) confidence += 25;
    if (isSuccessStatus) confidence += 10;

    return {
      success: !!(utr && utr.length === 12),
      rawText: extractedText.substring(0, 500),
      utr: utr || undefined,
      amount: amount || undefined,
      isAmountValid,
      isPayeeValid,
      payeeDetected: isPayeeValid ? "Kushal Ghanshyambhai / 7046232003" : undefined,
      statusText: isSuccessStatus ? "Payment Successful" : undefined,
      confidenceScore: confidence,
    };
  } catch (err: any) {
    console.error("OCR Processing error:", err);
    return {
      success: false,
      confidenceScore: 0,
      error: err.message || "Failed to process screenshot with Vision AI.",
    };
  }
}
