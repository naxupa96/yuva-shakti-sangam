import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Participant } from "@/types/registration";
import { eventConfig } from "@/lib/config";
import { downloadBlob } from "@/lib/ticket/generator";

export interface CertificateOptions {
  participant: Participant;
  siteUrl?: string;
}

/**
 * Generate verification QR code data URL for the certificate
 */
export async function generateCertificateQr(qrToken: string, siteUrl?: string): Promise<string> {
  const base = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://yuvashaktisangam.me";
  const target = `${base}/ticket/${qrToken}`;

  return QRCode.toDataURL(target, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 280,
    color: {
      dark: "#1C140E",
      light: "#FFFFFF",
    },
  });
}

/**
 * Generate an official, print-ready A4 Landscape Certificate PDF
 */
export async function generateCertificatePdf(
  participant: Participant,
  siteUrl?: string
): Promise<Blob> {
  const qrDataUrl = await generateCertificateQr(participant.qr_token, siteUrl);

  // A4 Landscape: 297mm width x 210mm height
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // 1. Rich Parchment Background
  doc.setFillColor(253, 248, 238); // Warm ivory parchment #FDF8EE
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // 2. Multi-layered Ornamental Golden & Saffron Borders
  // Outer deep saffron border
  doc.setDrawColor(180, 83, 9); // #B45309
  doc.setLineWidth(1.8);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16, "S");

  // Thin gold hairline
  doc.setDrawColor(217, 119, 6); // #D97706
  doc.setLineWidth(0.5);
  doc.rect(10.5, 10.5, pageWidth - 21, pageHeight - 21, "S");

  // Inner dark border
  doc.setDrawColor(28, 20, 14); // #1C140E
  doc.setLineWidth(0.8);
  doc.rect(12.5, 12.5, pageWidth - 25, pageHeight - 25, "S");

  // Corner decorative marks
  const cornerSize = 14;
  const corners = [
    { x: 12.5, y: 12.5 },
    { x: pageWidth - 12.5 - cornerSize, y: 12.5 },
    { x: 12.5, y: pageHeight - 12.5 - cornerSize },
    { x: pageWidth - 12.5 - cornerSize, y: pageHeight - 12.5 - cornerSize },
  ];
  doc.setFillColor(217, 119, 6);
  corners.forEach((c) => {
    doc.rect(c.x, c.y, cornerSize, 1.2, "F");
    doc.rect(c.x, c.y, 1.2, cornerSize, "F");
  });

  // 3. Top Banner & Organization Title
  doc.setTextColor(180, 83, 9);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("RASHTRIYA SWAYAMSEVAK SANGH (RSS)", pageWidth / 2, 25, { align: "center" });

  doc.setTextColor(28, 20, 14);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("YUVA SHAKTI SANGAM", pageWidth / 2, 35, { align: "center" });

  doc.setTextColor(230, 81, 0); // Bhagwa #E65100
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("YUVA SHAKTI  *  RASHTRA SHAKTI", pageWidth / 2, 41, { align: "center" });

  // Thin separator divider
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.6);
  doc.line(pageWidth / 2 - 55, 45, pageWidth / 2 + 55, 45);

  // 4. Certificate Heading Ribbon
  doc.setFillColor(28, 20, 14);
  doc.roundedRect(pageWidth / 2 - 65, 49, 130, 11, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12.5);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE OF PARTICIPATION", pageWidth / 2, 56.5, { align: "center" });

  // 5. Citation Text
  doc.setTextColor(90, 72, 57);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "normal");
  doc.text("This is proudly presented to", pageWidth / 2, 69, { align: "center" });

  // Participant Name (Prominent & Elegant)
  doc.setTextColor(28, 20, 14);
  doc.setFontSize(21);
  doc.setFont("helvetica", "bold");
  doc.text(participant.name.toUpperCase(), pageWidth / 2, 81, { align: "center" });

  // Underline beneath name
  doc.setDrawColor(230, 81, 0);
  doc.setLineWidth(0.8);
  const nameWidth = Math.min(doc.getTextWidth(participant.name.toUpperCase()) + 14, 180);
  doc.line(pageWidth / 2 - nameWidth / 2, 84, pageWidth / 2 + nameWidth / 2, 84);

  // Citation Body Paragraph
  doc.setTextColor(70, 55, 42);
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "normal");
  const citationLine1 =
    "for active participation and enthusiastic presence in the national youth assembly";
  const citationLine2 =
    "YUVA SHAKTI SANGAM, contributing vibrant energy and ideas towards nation-building.";
  doc.text(citationLine1, pageWidth / 2, 94, { align: "center" });
  doc.text(citationLine2, pageWidth / 2, 100, { align: "center" });

  // Event Details Box
  const boxY = 109;
  doc.setFillColor(245, 235, 220);
  doc.roundedRect(pageWidth / 2 - 85, boxY, 170, 15, 2, 2, "F");
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth / 2 - 85, boxY, 170, 15, 2, 2, "S");

  doc.setTextColor(28, 20, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DATE: 06 September 2026", pageWidth / 2 - 75, boxY + 6.5);
  doc.text("VENUE: Maninagar, Ahmedabad, Gujarat", pageWidth / 2 - 75, boxY + 11.5);

  doc.setTextColor(180, 83, 9);
  doc.text(`REG ID: ${participant.registration_id}`, pageWidth / 2 + 10, boxY + 6.5);
  doc.setTextColor(40, 120, 60);
  doc.text("STATUS: ATTENDANCE VERIFIED [ACTIVE DELEGATE]", pageWidth / 2 + 10, boxY + 11.5);

  // 6. Bottom Signature & Verification Section
  const bottomY = 142;

  // Left: Verification QR
  const qrBoxSize = 26;
  const qrX = 35;
  const qrY = bottomY - 3;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.4);
  doc.roundedRect(qrX, qrY, qrBoxSize, qrBoxSize, 2, 2, "FD");
  doc.addImage(qrDataUrl, "PNG", qrX + 1, qrY + 1, qrBoxSize - 2, qrBoxSize - 2);

  doc.setTextColor(90, 72, 57);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Scan to verify credential", qrX + qrBoxSize / 2, qrY + qrBoxSize + 4.5, {
    align: "center",
  });
  doc.text("yuvashaktisangam.me", qrX + qrBoxSize / 2, qrY + qrBoxSize + 8, {
    align: "center",
  });

  // Center: Golden Verified Medal Seal
  const sealCenterX = pageWidth / 2;
  const sealCenterY = bottomY + 10;
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(1.2);
  doc.circle(sealCenterX, sealCenterY, 15, "S");
  doc.setLineWidth(0.4);
  doc.circle(sealCenterX, sealCenterY, 13.5, "S");
  doc.setFillColor(253, 245, 230);
  doc.circle(sealCenterX, sealCenterY, 13, "F");

  doc.setTextColor(180, 83, 9);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("* OFFICIAL *", sealCenterX, sealCenterY - 4.5, { align: "center" });
  doc.setFontSize(8.5);
  doc.setTextColor(28, 20, 14);
  doc.text("VERIFIED", sealCenterX, sealCenterY - 0.5, { align: "center" });
  doc.setFontSize(7);
  doc.setTextColor(180, 83, 9);
  doc.text("DELEGATE", sealCenterX, sealCenterY + 3.5, { align: "center" });
  doc.setFontSize(6);
  doc.setTextColor(90, 72, 57);
  doc.text("2026", sealCenterX, sealCenterY + 7.5, { align: "center" });

  // Right: Signature Block
  const sigX = pageWidth - 75;
  const sigLineY = bottomY + 16;
  doc.setDrawColor(28, 20, 14);
  doc.setLineWidth(0.6);
  doc.line(sigX, sigLineY, sigX + 48, sigLineY);

  doc.setTextColor(28, 20, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Organizing Committee", sigX + 24, sigLineY + 5, { align: "center" });

  doc.setTextColor(90, 72, 57);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("Yuva Shakti Sangam, Karnavati", sigX + 24, sigLineY + 9, { align: "center" });

  // 7. Security Footnote
  doc.setTextColor(140, 120, 105);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Certificate Token: ${participant.qr_token.slice(0, 24)}... | Issued on 06 September 2026`,
    pageWidth / 2,
    pageHeight - 16,
    { align: "center" }
  );

  return doc.output("blob");
}

/**
 * Render certificate directly on an HTML5 canvas and return as a high-res PNG Blob
 */
export async function generateCertificatePng(
  participant: Participant,
  siteUrl?: string
): Promise<Blob> {
  const qrDataUrl = await generateCertificateQr(participant.qr_token, siteUrl);

  const canvas = document.createElement("canvas");
  // 1920 x 1357 resolution (matches 1.414 aspect ratio of A4 landscape)
  canvas.width = 1920;
  canvas.height = 1358;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not initialize 2D canvas");

  const w = canvas.width;
  const h = canvas.height;

  // Background
  ctx.fillStyle = "#FDF8EE";
  ctx.fillRect(0, 0, w, h);

  // Outer Saffron border
  ctx.strokeStyle = "#B45309";
  ctx.lineWidth = 14;
  ctx.strokeRect(40, 40, w - 80, h - 80);

  // Middle Gold border
  ctx.strokeStyle = "#D97706";
  ctx.lineWidth = 4;
  ctx.strokeRect(58, 58, w - 116, h - 116);

  // Inner Dark border
  ctx.strokeStyle = "#1C140E";
  ctx.lineWidth = 6;
  ctx.strokeRect(72, 72, w - 144, h - 144);

  // Corner Accents
  ctx.fillStyle = "#D97706";
  const cSize = 90;
  const cThick = 10;
  // top-left
  ctx.fillRect(72, 72, cSize, cThick);
  ctx.fillRect(72, 72, cThick, cSize);
  // top-right
  ctx.fillRect(w - 72 - cSize, 72, cSize, cThick);
  ctx.fillRect(w - 72 - cThick, 72, cThick, cSize);
  // bottom-left
  ctx.fillRect(72, h - 72 - cThick, cSize, cThick);
  ctx.fillRect(72, h - 72 - cSize, cThick, cSize);
  // bottom-right
  ctx.fillRect(w - 72 - cSize, h - 72 - cThick, cSize, cThick);
  ctx.fillRect(w - 72 - cThick, h - 72 - cSize, cThick, cSize);

  // Top header
  ctx.fillStyle = "#B45309";
  ctx.font = "bold 26px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("RASHTRIYA SWAYAMSEVAK SANGH (RSS)", w / 2, 160);

  ctx.fillStyle = "#1C140E";
  ctx.font = "900 60px serif, sans-serif";
  ctx.fillText("YUVA SHAKTI SANGAM", w / 2, 235);

  ctx.fillStyle = "#E65100";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("YUVA SHAKTI  ★  RASHTRA SHAKTI", w / 2, 275);

  // Divider line
  ctx.strokeStyle = "#D97706";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 320, 305);
  ctx.lineTo(w / 2 + 320, 305);
  ctx.stroke();

  // Ribbon
  ctx.fillStyle = "#1C140E";
  ctx.beginPath();
  ctx.roundRect(w / 2 - 380, 335, 760, 70, 16);
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 34px sans-serif";
  ctx.fillText("CERTIFICATE OF PARTICIPATION", w / 2, 382);

  // Presented to
  ctx.fillStyle = "#6B533E";
  ctx.font = "28px sans-serif";
  ctx.fillText("This is proudly presented to", w / 2, 470);

  // Name
  ctx.fillStyle = "#1C140E";
  ctx.font = "bold 64px serif, sans-serif";
  ctx.fillText(participant.name.toUpperCase(), w / 2, 560);

  // Name underline
  ctx.strokeStyle = "#E65100";
  ctx.lineWidth = 5;
  const metrics = ctx.measureText(participant.name.toUpperCase());
  const underlineW = Math.min(metrics.width + 60, 1100);
  ctx.beginPath();
  ctx.moveTo(w / 2 - underlineW / 2, 580);
  ctx.lineTo(w / 2 + underlineW / 2, 580);
  ctx.stroke();

  // Citation text
  ctx.fillStyle = "#4A3B32";
  ctx.font = "27px sans-serif";
  ctx.fillText(
    "for active participation and enthusiastic presence in the national youth assembly",
    w / 2,
    645
  );
  ctx.fillText(
    "YUVA SHAKTI SANGAM, contributing vibrant energy and ideas towards nation-building.",
    w / 2,
    690
  );

  // Details box
  const boxTop = 750;
  ctx.fillStyle = "#F5EADC";
  ctx.beginPath();
  ctx.roundRect(w / 2 - 500, boxTop, 1000, 110, 18);
  ctx.fill();
  ctx.strokeStyle = "#D97706";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#1C140E";
  ctx.font = "bold 23px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("DATE: 06 September 2026", w / 2 - 450, boxTop + 45);
  ctx.fillText("VENUE: Maninagar, Ahmedabad, Gujarat", w / 2 - 450, boxTop + 85);

  ctx.fillStyle = "#B45309";
  ctx.fillText(`REG ID: ${participant.registration_id}`, w / 2 + 50, boxTop + 45);
  ctx.fillStyle = "#15803D";
  ctx.fillText("STATUS: ATTENDANCE VERIFIED", w / 2 + 50, boxTop + 85);

  // Footer / Verification items
  // Draw QR Image
  const qrImg = new Image();
  qrImg.src = qrDataUrl;
  await new Promise((resolve) => {
    qrImg.onload = resolve;
  });

  const qrSize = 180;
  const qrLeft = 200;
  const qrTop = 930;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(qrLeft - 10, qrTop - 10, qrSize + 20, qrSize + 20);
  ctx.strokeStyle = "#D97706";
  ctx.lineWidth = 2;
  ctx.strokeRect(qrLeft - 10, qrTop - 10, qrSize + 20, qrSize + 20);
  ctx.drawImage(qrImg, qrLeft, qrTop, qrSize, qrSize);

  ctx.textAlign = "center";
  ctx.fillStyle = "#6B533E";
  ctx.font = "19px sans-serif";
  ctx.fillText("Scan to verify credential", qrLeft + qrSize / 2, qrTop + qrSize + 35);
  ctx.fillText("yuvashaktisangam.me", qrLeft + qrSize / 2, qrTop + qrSize + 60);

  // Middle seal
  const sX = w / 2;
  const sY = 1030;
  ctx.beginPath();
  ctx.arc(sX, sY, 95, 0, Math.PI * 2);
  ctx.fillStyle = "#FDF5E6";
  ctx.fill();
  ctx.strokeStyle = "#D97706";
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(sX, sY, 82, 0, Math.PI * 2);
  ctx.strokeStyle = "#B45309";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#B45309";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("★ OFFICIAL ★", sX, sY - 30);
  ctx.fillStyle = "#1C140E";
  ctx.font = "900 32px sans-serif";
  ctx.fillText("VERIFIED", sX, sY + 8);
  ctx.fillStyle = "#B45309";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText("DELEGATE", sX, sY + 40);
  ctx.fillStyle = "#6B533E";
  ctx.font = "18px sans-serif";
  ctx.fillText("2026", sX, sY + 68);

  // Right Signature Block
  const sigLeft = w - 480;
  const sigY = 1060;
  ctx.strokeStyle = "#1C140E";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(sigLeft, sigY);
  ctx.lineTo(sigLeft + 300, sigY);
  ctx.stroke();

  ctx.fillStyle = "#1C140E";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("Organizing Committee", sigLeft + 150, sigY + 38);

  ctx.fillStyle = "#6B533E";
  ctx.font = "20px sans-serif";
  ctx.fillText("Yuva Shakti Sangam, Karnavati", sigLeft + 150, sigY + 68);

  // Security Footnote
  ctx.fillStyle = "#9C8A7B";
  ctx.font = "17px sans-serif";
  ctx.fillText(
    `Official Participation Certificate | Token: ${participant.qr_token.slice(0, 24)}... | Issued 06 September 2026`,
    w / 2,
    h - 95
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to export canvas to PNG blob"));
    }, "image/png");
  });
}
