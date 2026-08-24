import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Participant } from "@/types/registration";
import { eventConfig } from "@/lib/config";

export interface GenerateTicketOptions {
  participant: Participant;
  siteUrl?: string;
}

/**
 * Generate a high-resolution QR code Data URL from token
 */
export async function generateQrDataUrl(qrToken: string, siteUrl?: string): Promise<string> {
  const base = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://yuvashaktisangam.org";
  // The QR code contains the secure ticket link
  const qrTarget = `${base}/ticket/${qrToken}`;

  return QRCode.toDataURL(qrTarget, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 400,
    color: {
      dark: "#17130E",
      light: "#FFFFFF",
    },
  });
}

/**
 * Generate a branded PDF ticket document matching the Yuva Shakti Sangam visual identity
 */
export async function generateTicketPdf(participant: Participant, siteUrl?: string): Promise<Blob> {
  const qrDataUrl = await generateQrDataUrl(participant.qr_token, siteUrl);

  // A6 Portrait sized pass (105mm x 148mm)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [105, 155],
  });

  const pageWidth = 105;
  const pageHeight = 155;

  // 1. Parchment Background fill
  doc.setFillColor(242, 223, 189); // #F2DFBD
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Inner card border
  doc.setDrawColor(23, 19, 14); // #17130E
  doc.setLineWidth(0.8);
  doc.roundedRect(4, 4, pageWidth - 8, pageHeight - 8, 3, 3, "S");

  // Double thin ornamental accent border
  doc.setDrawColor(240, 90, 18); // #F05A12
  doc.setLineWidth(0.3);
  doc.roundedRect(6, 6, pageWidth - 12, pageHeight - 12, 2, 2, "S");

  // 2. Header Bar - Dark Ink
  doc.setFillColor(23, 19, 14);
  doc.roundedRect(8, 8, pageWidth - 16, 22, 2, 2, "F");

  // Header Typography
  doc.setTextColor(242, 223, 189);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("YUVA SHAKTI SANGAM", pageWidth / 2, 16, { align: "center" });

  doc.setTextColor(240, 90, 18);
  doc.setFontSize(8.5);
  doc.text("YUVA SHAKTI * RASHTRA SHAKTI", pageWidth / 2, 22, { align: "center" });

  doc.setTextColor(200, 180, 150);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text("MANINAGAR, AHMEDABAD * 06 SEPT 2026", pageWidth / 2, 26.5, { align: "center" });

  // 3. Participant Details Section
  let currentY = 36;
  doc.setTextColor(90, 72, 57);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("PARTICIPANT NAME", pageWidth / 2, currentY, { align: "center" });

  currentY += 5;
  doc.setTextColor(23, 19, 14);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(participant.name.toUpperCase(), pageWidth / 2, currentY, { align: "center" });

  currentY += 6;
  doc.setTextColor(90, 72, 57);
  doc.setFontSize(7);
  doc.text("REGISTRATION ID", pageWidth / 2, currentY, { align: "center" });

  currentY += 5;
  doc.setTextColor(240, 90, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(participant.registration_id, pageWidth / 2, currentY, { align: "center" });

  // 4. Central QR Code with frame
  const qrSize = 44;
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = currentY + 3;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(23, 19, 14);
  doc.setLineWidth(0.4);
  doc.roundedRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, 2, 2, "FD");

  doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

  // 5. Payment Status Badge
  const statusY = qrY + qrSize + 7;
  const isPaid = participant.payment_status === "paid";
  const isCashPending = participant.payment_method === "cash" && participant.payment_status === "pending";

  if (isPaid) {
    doc.setFillColor(23, 100, 40); // Rich forest green
    doc.roundedRect(12, statusY, pageWidth - 24, 9, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    const methodText = participant.payment_method === "online" ? "ONLINE" : "CASH";
    doc.text(`ENTRY PASS: Rs. 50 -- ${methodText} PAID [VERIFIED]`, pageWidth / 2, statusY + 6, { align: "center" });
  } else if (isCashPending) {
    doc.setFillColor(180, 50, 10); // Terracotta warning
    doc.roundedRect(12, statusY, pageWidth - 24, 9, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT PENDING: Rs. 50 CASH AT ENTRY", pageWidth / 2, statusY + 5.8, { align: "center" });
  } else {
    doc.setFillColor(180, 30, 30);
    doc.roundedRect(12, statusY, pageWidth - 24, 9, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT NOT COMPLETED", pageWidth / 2, statusY + 5.8, { align: "center" });
  }

  // 6. Footer event instructions
  const footerY = statusY + 13;
  doc.setTextColor(23, 19, 14);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.text("SHREE SAURASHTRA PATEL SAMAJ, MANINAGAR", pageWidth / 2, footerY, { align: "center" });

  doc.setTextColor(240, 90, 18);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("* ID CARD PROVIDED AT DESK  *  HIGH TEA INCLUDED *", pageWidth / 2, footerY + 3.8, { align: "center" });

  doc.setTextColor(90, 72, 57);
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "normal");
  doc.text("06 Sept 2026 (4 PM - 8 PM) | Helpline: +91 90547 37915 / +91 70462 32003", pageWidth / 2, footerY + 7.2, { align: "center" });

  return doc.output("blob");
}

/**
 * Trigger browser file download helper
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
