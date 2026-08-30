/**
 * Volunteer Authentication & Session Management using WebCrypto
 * Works in both Edge Runtime (Middleware) and Node.js Serverless Functions
 */

const VOLUNTEER_COOKIE_NAME = "volunteer_session";
const DEFAULT_SECRET = "yuva-shakti-volunteer-secret-2026";
export const VOLUNTEER_SESSION_DURATION = 60 * 60 * 24 * 30; // 30 days

export function getVolunteerCookieName() {
  return VOLUNTEER_COOKIE_NAME;
}

export function getVolunteerCredentials() {
  return {
    usernames: [
      (process.env.VOLUNTEER_USERNAME || "volunteer").toLowerCase(),
      "swayamsevak",
      "gate",
      "volunteer@yuvashakti",
      "yuva@2047", // Admin username is also allowed
    ],
    password: process.env.VOLUNTEER_PASSWORD || "seva2026",
    adminPassword: process.env.ADMIN_PASSWORD || "bharatmatakijai",
  };
}

async function getCryptoKey(): Promise<CryptoKey> {
  const secret = process.env.VOLUNTEER_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SECRET;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);

  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

/**
 * Creates a signed session token for volunteer
 */
export async function createVolunteerToken(
  username: string,
  durationSeconds: number = VOLUNTEER_SESSION_DURATION
): Promise<string> {
  const exp = Date.now() + durationSeconds * 1000;
  const payload = JSON.stringify({ u: username, exp, role: "volunteer" });
  const encoder = new TextEncoder();
  const payloadBase64 = btoa(payload);

  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadBase64)
  );

  const signatureHex = bufferToHex(signatureBuffer);
  return `${payloadBase64}.${signatureHex}`;
}

/**
 * Verifies a volunteer session token
 */
export async function verifyVolunteerToken(
  token: string | undefined | null
): Promise<{ valid: boolean; username?: string }> {
  if (!token || !token.includes(".")) {
    return { valid: false };
  }

  try {
    const [payloadBase64, signatureHex] = token.split(".");
    if (!payloadBase64 || !signatureHex) {
      return { valid: false };
    }

    const key = await getCryptoKey();
    const encoder = new TextEncoder();
    const signatureBuffer = hexToBuffer(signatureHex);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      encoder.encode(payloadBase64)
    );

    if (!isValid) {
      return { valid: false };
    }

    const payload = JSON.parse(atob(payloadBase64));
    if (payload.exp && payload.exp < Date.now()) {
      return { valid: false }; // Expired
    }

    return { valid: true, username: payload.u };
  } catch (err) {
    return { valid: false };
  }
}
