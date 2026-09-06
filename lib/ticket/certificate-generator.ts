import { jsPDF } from "jspdf";
import { Participant } from "@/types/registration";

export interface CertificateOptions {
  participant: Participant;
  siteUrl?: string;
}

/**
 * Format participant names with clean title case and proper period formatting for initials.
 */
export function formatParticipantName(rawName: string): string {
  if (!rawName) return "";
  const words = rawName.trim().split(/\s+/);
  const formatted = words.map((w) => {
    if (w.length === 1) {
      return w.toUpperCase() + ".";
    } else if (w.length === 2 && w.endsWith(".")) {
      return w.toUpperCase();
    } else if (/^[A-Z](\.[A-Z])+\.?$/i.test(w)) {
      return w
        .replace(/\./g, "")
        .split("")
        .map((p) => p.toUpperCase() + ".")
        .join(" ");
    } else {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }
  });
  return formatted.join(" ");
}

/**
 * Loads an image from a URL into an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load certificate template: ${err}`));
    img.src = src;
  });
}

/**
 * Renders the official Yuva Shakti Sangam certificate onto an HTML5 Canvas at 3000x1998 (300 DPI)
 */
export async function renderOfficialCertificateCanvas(
  participant: Participant
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = 3000;
  canvas.height = 1998;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not acquire 2D canvas context");
  }

  // 1. Load official certificate template image
  const templateImg = await loadImage("/certificate_template.jpg");
  ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

  // 2. Format name
  const formattedName = formatParticipantName(participant.name || "Participant");

  // 3. Responsive font sizing for the name
  let fontSize = 78;
  const maxTextWidth = 1250; // Maximum allowed line width before overflowing
  const fontFamily = "'Times New Roman', 'Times', 'Georgia', serif";

  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  let textWidth = ctx.measureText(formattedName).width;

  while (textWidth > maxTextWidth && fontSize > 38) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    textWidth = ctx.measureText(formattedName).width;
  }

  // 4. Render participant name directly above the ornamental dividing line
  ctx.fillStyle = "#0E214C"; // Royal Navy Blue matching official heading
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // Coordinates: Center X = 1500, Baseline Y = 938 (exactly atop the ornamental line)
  ctx.fillText(formattedName, 1500, 938);

  return canvas;
}

/**
 * Generate a high-resolution preview Data URL of the customized certificate
 */
export async function generateCertificateDataUrl(
  participant: Participant
): Promise<string> {
  const canvas = await renderOfficialCertificateCanvas(participant);
  return canvas.toDataURL("image/jpeg", 0.92);
}

/**
 * Generate an official, print-ready A4 Landscape Certificate PDF
 */
export async function generateCertificatePdf(
  participant: Participant
): Promise<Blob> {
  const canvas = await renderOfficialCertificateCanvas(participant);
  const imgData = canvas.toDataURL("image/jpeg", 0.95);

  // Standard A4 Landscape: 297mm x 210mm
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Fit image into A4 Landscape maintaining 1.501 ratio with ~5mm border margins
  const margin = 5;
  const availW = pageWidth - margin * 2;
  const availH = pageHeight - margin * 2;
  const imgRatio = 3000 / 1998;
  const availRatio = availW / availH;

  let drawW = availW;
  let drawH = drawW / imgRatio;
  if (imgRatio < availRatio) {
    drawH = availH;
    drawW = drawH * imgRatio;
  }

  const drawX = (pageWidth - drawW) / 2;
  const drawY = (pageHeight - drawH) / 2;

  doc.addImage(imgData, "JPEG", drawX, drawY, drawW, drawH, undefined, "FAST");
  return doc.output("blob");
}

/**
 * Generate high-resolution PNG Blob of the customized certificate
 */
export async function generateCertificatePng(
  participant: Participant
): Promise<Blob> {
  const canvas = await renderOfficialCertificateCanvas(participant);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/png",
      1.0
    );
  });
}
