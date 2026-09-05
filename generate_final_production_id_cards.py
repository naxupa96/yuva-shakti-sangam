import os
import sys
import csv
import json
import subprocess
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import inch
from reportlab.pdfgen import canvas

ROOT_DIR = r"c:\Users\naksh\Desktop\yuva shakti sangam"
CSV_PATH = os.path.join(ROOT_DIR, "Yuva_Shakti_Sangam_Canva_Bulk_Create.csv")
QR_DIR = os.path.join(ROOT_DIR, "canva_qr_codes")
BASE_ARTWORK_PATH = os.path.join(ROOT_DIR, "temp_cards", "id_card-11.png")
OUTPUT_DIR = os.path.join(ROOT_DIR, "final_id_cards")
PNG_OUTPUT_DIR = os.path.join(OUTPUT_DIR, "png")
QR_CROP_DIR = os.path.join(OUTPUT_DIR, ".qr_crop_temp")

os.makedirs(PNG_OUTPUT_DIR, exist_ok=True)
os.makedirs(QR_CROP_DIR, exist_ok=True)

TARGET_W, TARGET_H = 1050, 1500
DPI = 300

# 1. Load CSV
participants = []
with open(CSV_PATH, "r", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    for row in reader:
        participants.append(row)

print(f"Loaded {len(participants)} participants from {CSV_PATH}")

# 2. Prepare Base Artwork
base_img = Image.open(BASE_ARTWORK_PATH).convert("RGBA")
base_resized = base_img.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
scale_x = TARGET_W / base_img.width
scale_y = TARGET_H / base_img.height

font_bold = r"C:\Windows\Fonts\arialbd.ttf"
font_regular = r"C:\Windows\Fonts\arial.ttf"

def render_card(p):
    card = base_resized.copy()
    draw = ImageDraw.Draw(card)

    name = p["Name"].strip()
    pid = p["Participant ID"].strip()
    qr_token = p["QR Token"].strip()
    qr_file = os.path.join(QR_DIR, f"{pid}.png")

    if not os.path.exists(qr_file):
        raise FileNotFoundError(f"QR file missing for {pid}: {qr_file}")

    # Name text fitting (flush-left at x=176, max width 490px before right boundary)
    name_x = 176
    name_y = 852
    max_w = 490
    font_size = 42
    while font_size > 24:
        f = ImageFont.truetype(font_bold, font_size)
        bbox = draw.textbbox((name_x, name_y), name, font=f)
        text_w = bbox[2] - bbox[0]
        if text_w <= max_w:
            break
        font_size -= 1

    f_name = ImageFont.truetype(font_bold, font_size)
    draw.text((name_x, name_y), name, fill=(23, 19, 14), font=f_name)

    # Participant ID text (flush-left at x=176, y=980)
    id_x = 176
    id_y = 980
    f_id = ImageFont.truetype(font_bold, 40)
    draw.text((id_x, id_y), pid, fill=(23, 19, 14), font=f_id)

    # QR Code Badge (Enlarged 256px QR in 266px frame with 5px padding)
    badge_size = 266
    qr_size = 256
    qr_pad = (badge_size - qr_size) // 2

    qr_img = Image.open(qr_file).convert("RGBA")
    qr_resized = qr_img.resize((qr_size, qr_size), Image.Resampling.NEAREST)

    badge = Image.new("RGBA", (badge_size, badge_size), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(badge)
    bdraw.rounded_rectangle(
        [(0, 0), (badge_size - 1, badge_size - 1)],
        radius=10,
        fill=(255, 255, 255, 255),
        outline=(240, 90, 18),
        width=2
    )
    badge.paste(qr_resized, (qr_pad, qr_pad), qr_resized)

    badge_x = int(860 - badge_size // 2)
    badge_y = int(1217 - badge_size // 2)
    card.paste(badge, (badge_x, badge_y), badge)

    card_rgb = card.convert("RGB")
    return card_rgb

print("=== RENDERING ALL ID CARDS (HIGHEST PRINT QUALITY) ===")
rendered_files = []
for i, p in enumerate(participants):
    pid = p["Participant ID"]
    c = render_card(p)
    out_name = f"YSS_ID_CARD_{pid}.png"
    out_path = os.path.join(PNG_OUTPUT_DIR, out_name)
    c.save(out_path, dpi=(DPI, DPI), format="PNG")
    rendered_files.append((p, out_path))

    # Crop QR for machine readability verification
    # Badge is centered at (860, 1217) with size 266
    qr_cropped = c.crop((715, 1070, 1005, 1365))
    crop_path = os.path.join(QR_CROP_DIR, f"{pid}.png")
    qr_cropped.save(crop_path)

    if (i + 1) % 50 == 0 or (i + 1) == len(participants):
        print(f"Rendered {i + 1}/{len(participants)} cards...")

print(f"Successfully generated {len(rendered_files)} individual PNG cards.")

# 3. Create Multi-page PDFs using img2pdf (100% lossless, exact 300 DPI, streaming)
import img2pdf

layout_300dpi = img2pdf.get_fixed_dpi_layout_fun((300, 300))

# PDF 1: 199 initial participants as specified in prompt
pdf_199_path = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_199_ID_Cards.pdf")
print("Generating 199 ID Cards PDF (Lossless 300 DPI)...")
files_199 = [png_path for _, png_path in rendered_files[:199]]
with open(pdf_199_path, "wb") as f:
    f.write(img2pdf.convert(files_199, layout_fun=layout_300dpi))
print(f"PDF created: {pdf_199_path} ({os.path.getsize(pdf_199_path) / 1024 / 1024:.1f} MB)")

# PDF 2: Complete all-participants PDF (all 215)
pdf_all_path = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_All_215_ID_Cards.pdf")
print("Generating All 215 ID Cards PDF (Lossless 300 DPI)...")
files_all = [png_path for _, png_path in rendered_files]
with open(pdf_all_path, "wb") as f:
    f.write(img2pdf.convert(files_all, layout_fun=layout_300dpi))
print(f"PDF created: {pdf_all_path} ({os.path.getsize(pdf_all_path) / 1024 / 1024:.1f} MB)")

# 4. Generate Contact Sheet
print("Generating contact sheet of all cards...")
cols = 10
rows = (len(rendered_files) + cols - 1) // cols
thumb_w, thumb_h = 210, 300
padding = 10
margin_top = 80
margin_bottom = 40
sheet_w = cols * (thumb_w + padding) + padding
sheet_h = margin_top + rows * (thumb_h + padding + 24) + margin_bottom

sheet = Image.new("RGB", (sheet_w, sheet_h), (248, 246, 240))
sdraw = ImageDraw.Draw(sheet)

title_font = ImageFont.truetype(font_bold, 36)
caption_font = ImageFont.truetype(font_bold, 14)

sdraw.text((sheet_w // 2, 40), "YUVA SHAKTI SANGAM — ALL ATTENDEE ID CARDS (CONTACT SHEET)", fill=(23, 19, 14), font=title_font, anchor="mm")

for idx, (p, png_path) in enumerate(rendered_files):
    r = idx // cols
    c_idx = idx % cols
    x = padding + c_idx * (thumb_w + padding)
    y = margin_top + r * (thumb_h + padding + 24)

    card_img = Image.open(png_path).convert("RGB")
    thumb = card_img.resize((thumb_w, thumb_h), Image.Resampling.BILINEAR)
    sheet.paste(thumb, (x, y))

    # Caption with participant ID and name
    label = f"{p['Participant ID']} | {p['Name'][:15]}"
    sdraw.text((x + thumb_w // 2, y + thumb_h + 12), label, fill=(50, 45, 40), font=caption_font, anchor="mm")

contact_sheet_path = os.path.join(OUTPUT_DIR, "contact_sheet.png")
sheet.save(contact_sheet_path, dpi=(150, 150))
print(f"Contact sheet created: {contact_sheet_path}")

# 5. Generate QA Sample Sheet (First, Middle, Last, and Longest Names)
print("Generating QA Sample Sheet...")
sample_indices = [
    0, # First
    len(rendered_files) // 4, # 25%
    len(rendered_files) // 2, # Middle
    (len(rendered_files) * 3) // 4, # 75%
    len(rendered_files) - 1, # Last
]
# Add top 3 longest names
sorted_by_len = sorted(range(len(participants)), key=lambda i: len(participants[i]["Name"]), reverse=True)
for idx in sorted_by_len[:3]:
    if idx not in sample_indices:
        sample_indices.append(idx)

qa_cols = len(sample_indices)
qa_thumb_w, qa_thumb_h = 350, 500
qa_sheet_w = qa_cols * (qa_thumb_w + 30) + 30
qa_sheet_h = 100 + qa_thumb_h + 80
qa_sheet = Image.new("RGB", (qa_sheet_w, qa_sheet_h), (248, 246, 240))
qdraw = ImageDraw.Draw(qa_sheet)

qdraw.text((qa_sheet_w // 2, 45), "YUVA SHAKTI SANGAM — QA REPRESENTATIVE SAMPLE CARDS", fill=(23, 19, 14), font=title_font, anchor="mm")

for pos, idx in enumerate(sample_indices):
    p, png_path = rendered_files[idx]
    x = 30 + pos * (qa_thumb_w + 30)
    y = 90
    card_img = Image.open(png_path).convert("RGB")
    thumb = card_img.resize((qa_thumb_w, qa_thumb_h), Image.Resampling.LANCZOS)
    qa_sheet.paste(thumb, (x, y))

    note = f"{p['Participant ID']}\n{p['Name']}"
    qdraw.text((x + qa_thumb_w // 2, y + qa_thumb_h + 35), note, fill=(23, 19, 14), font=caption_font, anchor="mm", align="center")

qa_sheet_path = os.path.join(OUTPUT_DIR, "qa_sample_sheet.png")
qa_sheet.save(qa_sheet_path, dpi=(150, 150))
print(f"QA Sample sheet created: {qa_sheet_path}")

print("=== ALL RENDERING TASKS FINISHED ===")
