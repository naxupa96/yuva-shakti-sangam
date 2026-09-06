import os
import sys
from PIL import Image, ImageDraw
import qrcode
import img2pdf
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch, mm

ROOT_DIR = r"c:\Users\naksh\Desktop\yuva shakti sangam"
BASE_ARTWORK_PATH = os.path.join(ROOT_DIR, "temp_cards", "id_card-11.png")
OUTPUT_DIR = os.path.join(ROOT_DIR, "final_id_cards")
os.makedirs(OUTPUT_DIR, exist_ok=True)

TARGET_W, TARGET_H = 1050, 1500
DPI = 300

QR_TARGET_URL = "https://yuvashaktisangam.me"

print(f"1. Generating QR code pointing to: {QR_TARGET_URL}")
qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=1,
)
qr.add_data(QR_TARGET_URL)
qr.make(fit=True)
qr_img = qr.make_image(fill_color="#17130E", back_color="#FFFFFF").convert("RGBA")

# Resize QR to 256x256 using nearest neighbor for maximum sharpness
qr_size = 256
qr_resized = qr_img.resize((qr_size, qr_size), Image.Resampling.NEAREST)

# 2. Prepare Base Card Artwork
print(f"2. Loading base artwork: {BASE_ARTWORK_PATH}")
base_img = Image.open(BASE_ARTWORK_PATH).convert("RGBA")
card = base_img.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)

# 3. Create Badge Container for QR code
badge_size = 266
qr_pad = (badge_size - qr_size) // 2

badge = Image.new("RGBA", (badge_size, badge_size), (0, 0, 0, 0))
bdraw = ImageDraw.Draw(badge)
bdraw.rounded_rectangle(
    [(0, 0), (badge_size - 1, badge_size - 1)],
    radius=10,
    fill=(255, 255, 255, 255),
    outline=(240, 90, 18),
    width=2,
)
badge.paste(qr_resized, (qr_pad, qr_pad), qr_resized)

# Center badge at (860, 1217) matching the official ID cards
badge_x = int(860 - badge_size // 2)
badge_y = int(1217 - badge_size // 2)
card.paste(badge, (badge_x, badge_y), badge)

card_rgb = card.convert("RGB")

# 4. Save PNG File
out_png_path = os.path.join(ROOT_DIR, "Yuva_Shakti_Sangam_Blank_ID_Card.png")
card_rgb.save(out_png_path, dpi=(DPI, DPI), format="PNG")
print(f"Saved High-Res PNG (300 DPI): {out_png_path}")

# Also save in final_id_cards folder
out_png_final = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_Blank_ID_Card.png")
card_rgb.save(out_png_final, dpi=(DPI, DPI), format="PNG")

# 5. Generate Single Card PDF (Lossless 300 DPI, exact 3.5" x 5.0")
out_pdf_path = os.path.join(ROOT_DIR, "Yuva_Shakti_Sangam_Blank_ID_Card.pdf")
layout_300dpi = img2pdf.get_fixed_dpi_layout_fun((300, 300))
with open(out_pdf_path, "wb") as f:
    f.write(img2pdf.convert([out_png_path], layout_fun=layout_300dpi))

out_pdf_final = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_Blank_ID_Card.pdf")
with open(out_pdf_final, "wb") as f:
    f.write(img2pdf.convert([out_png_path], layout_fun=layout_300dpi))

print(f"Saved Single ID Card PDF: {out_pdf_path} ({os.path.getsize(out_pdf_path) / 1024:.1f} KB)")

# 6. Generate A4 Printable Sheet PDF (4 ID Cards per page with cut guides)
out_a4_pdf_path = os.path.join(ROOT_DIR, "Yuva_Shakti_Sangam_Blank_ID_Cards_A4_Print_Sheet.pdf")
out_a4_final = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_Blank_ID_Cards_A4_Print_Sheet.pdf")

a4_w, a4_h = A4 # 595.27 points x 841.89 points (8.27" x 11.69")
card_pt_w = 3.5 * inch # 252 points
card_pt_h = 5.0 * inch # 360 points

# Calculate margins to center 2 columns x 2 rows
gap_x = 0.25 * inch # 18 pt
gap_y = 0.3 * inch # 21.6 pt
total_w = 2 * card_pt_w + gap_x
total_h = 2 * card_pt_h + gap_y
margin_x = (a4_w - total_w) / 2
margin_y = (a4_h - total_h) / 2

c = canvas.Canvas(out_a4_pdf_path, pagesize=A4)
c.setTitle("Yuva Shakti Sangam - Blank ID Cards (A4 Print Sheet)")

# Add header title in margin
c.setFont("Helvetica-Bold", 10)
c.setFillColor(colors.HexColor("#17130E"))
c.drawCentredString(a4_w / 2, a4_h - margin_y / 2 + 5, "YUVA SHAKTI SANGAM — OFFICIAL BLANK ATTENDEE ID CARDS (PRINT SHEET)")
c.setFont("Helvetica", 7.5)
c.setFillColor(colors.HexColor("#5A4839"))
c.drawCentredString(a4_w / 2, a4_h - margin_y / 2 - 6, "Standard 3.5\" × 5.0\" ID Badges (300 DPI) • Cut along the dotted guides")

positions = [
    (margin_x, margin_y + card_pt_h + gap_y),                         # Top-Left
    (margin_x + card_pt_w + gap_x, margin_y + card_pt_h + gap_y),     # Top-Right
    (margin_x, margin_y),                                            # Bottom-Left
    (margin_x + card_pt_w + gap_x, margin_y),                        # Bottom-Right
]

for x, y in positions:
    # Draw card image
    c.drawImage(out_png_path, x, y, width=card_pt_w, height=card_pt_h, preserveAspectRatio=True)
    
    # Draw subtle crop/cut guide rectangle around each card
    c.setStrokeColor(colors.HexColor("#D97706"))
    c.setLineWidth(0.5)
    c.setDash(2, 2)
    c.rect(x, y, card_pt_w, card_pt_h)
    c.setDash()

# Add corner tick marks for guillotine cutting
tick_len = 10
c.setStrokeColor(colors.HexColor("#B45309"))
c.setLineWidth(0.7)

# Horizontal lines across rows
for y in [margin_y, margin_y + card_pt_h, margin_y + card_pt_h + gap_y, margin_y + total_h]:
    c.line(margin_x - tick_len, y, margin_x - 2, y)
    c.line(margin_x + total_w + 2, y, margin_x + total_w + tick_len, y)

# Vertical lines across columns
for x in [margin_x, margin_x + card_pt_w, margin_x + card_pt_w + gap_x, margin_x + total_w]:
    c.line(x, margin_y - tick_len, x, margin_y - 2)
    c.line(x, margin_y + total_h + 2, x, margin_y + total_h + tick_len)

c.showPage()
c.save()

# Copy to final_id_cards
import shutil
shutil.copyfile(out_a4_pdf_path, out_a4_final)

print(f"Saved A4 Printable Sheet PDF: {out_a4_pdf_path} ({os.path.getsize(out_a4_pdf_path) / 1024:.1f} KB)")
print("=== GENERATION COMPLETE ===")
