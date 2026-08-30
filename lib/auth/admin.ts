/**
 * Admin Authentication & Session Management using WebCrypto
 * Works in both Edge Runtime (Middleware) and Node.js Serverless Functions
 */

const SESSION_COOKIE_NAME = "admin_session";
const DEFAULT_SECRET = "yuva-shakti-sangam-secure-admin-secret-2026";

export function getAdminCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    // Also accepts alias usernames
    aliases: ["yuvashakti", "organizer", "yuvashakti@admin.com", "admin@yuvashaktisangam.org"],
    password: process.env.ADMIN_PASSWORD || "YuvaShakti@2026",
  };
}

async function getCryptoKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SECRET;
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
 * Creates a cryptographically signed session token for admin
 */
export async function createAdminToken(username: string, durationSeconds: number = 60 * 60 * 24 * 7): Promise<string> {
  const exp = Date.now() + durationSeconds * 1000;
  const payload = JSON.stringify({ u: username, exp, role: "admin" });
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
 * Verifies an admin session token
 */
export async function verifyAdminToken(token: string | undefined | null): Promise<{ valid: boolean; username?: string }> {
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
