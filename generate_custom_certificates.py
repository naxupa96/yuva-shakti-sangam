import os
import sys
import argparse
import re
import json
import io
import time
import urllib.request
from PIL import Image, ImageDraw, ImageFont
import img2pdf

ROOT_DIR = r"c:\Users\naksh\Desktop\yuva shakti sangam"
TEMPLATE_IMAGE_SRC = r"C:\Users\naksh\.gemini\antigravity-ide\brain\807c3b42-ab0d-47c4-a3e2-6d32791cf111\.user_uploaded\media_1788682073552.jpg"
LOCAL_TEMPLATE_PATH = os.path.join(ROOT_DIR, "public", "certificate_template.jpg")
OUTPUT_DIR = os.path.join(ROOT_DIR, "certificates_output")
FONT_PATH = os.path.join(r"C:\Windows\Fonts", "timesbd.ttf")

TARGET_WIDTH = 3000
TARGET_HEIGHT = 1998
MAX_TEXT_WIDTH = 1250 # max allowable width for the name on the line
COLOR_ROYAL_NAVY = (14, 33, 76, 255) # #0E214C matching CERTIFICATE title

def ensure_template():
    """Ensure the high-res template image is cached locally in public folder."""
    os.makedirs(os.path.join(ROOT_DIR, "public"), exist_ok=True)
    if not os.path.exists(LOCAL_TEMPLATE_PATH):
        if os.path.exists(TEMPLATE_IMAGE_SRC):
            img = Image.open(TEMPLATE_IMAGE_SRC)
            img.save(LOCAL_TEMPLATE_PATH, quality=100)
    return LOCAL_TEMPLATE_PATH if os.path.exists(LOCAL_TEMPLATE_PATH) else TEMPLATE_IMAGE_SRC

def format_participant_name(raw_name: str) -> str:
    """Format participant names with clean title case and proper period formatting for initials."""
    if not raw_name:
        return ""
    words = raw_name.strip().split()
    formatted = []
    for w in words:
        if len(w) == 1:
            formatted.append(w.upper() + ".")
        elif len(w) == 2 and w.endswith("."):
            formatted.append(w.upper())
        elif re.match(r"^[A-Z]\.[A-Z]\.?$", w, re.IGNORECASE):
            parts = [p.upper() + "." for p in w.replace(".", "")]
            formatted.append(" ".join(parts))
        else:
            formatted.append(w.capitalize())
    return " ".join(formatted)

def render_certificate_image(name: str, base_template: Image.Image) -> Image.Image:
    """Renders customized participant name onto the certificate template."""
    display_name = format_participant_name(name)
    cert = base_template.copy()
    draw = ImageDraw.Draw(cert)
    
    # Calculate responsive font size to fit MAX_TEXT_WIDTH
    font_size = 78
    font = ImageFont.truetype(FONT_PATH, font_size)
    bbox = font.getbbox(display_name)
    tw = bbox[2] - bbox[0]
    
    while tw > MAX_TEXT_WIDTH and font_size > 40:
        font_size -= 2
        font = ImageFont.truetype(FONT_PATH, font_size)
        bbox = font.getbbox(display_name)
        tw = bbox[2] - bbox[0]
        
    th = bbox[3] - bbox[1]
    
    # Baseline positioned exactly above the decorative line
    baseline_y = 938
    tx = (TARGET_WIDTH - tw) // 2
    ty = baseline_y - th - bbox[1]
    
    draw.text((tx, ty), display_name, font=font, fill=COLOR_ROYAL_NAVY)
    return cert.convert("RGB")

def get_a4_layout():
    """Return an exact A4 landscape layout function with safe 5mm margins."""
    return img2pdf.get_layout_fun(
        pagesize=(img2pdf.mm_to_pt(297), img2pdf.mm_to_pt(210)),
        fit=img2pdf.FitMode.into,
        auto_orient=False
    )

def fetch_participants_from_db():
    """Load Supabase configuration and fetch participants."""
    env_path = os.path.join(ROOT_DIR, ".env.local")
    env = {}
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if "=" in line and not line.startswith("#"):
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip("'\" ")
                    
    url = env.get("NEXT_PUBLIC_SUPABASE_URL")
    key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    if not url or not key:
        print("Supabase credentials not found in .env.local")
        return []
        
    query_url = f"{url}/rest/v1/participants?select=id,registration_id,name,phone,checked_in,payment_status&order=registration_id.asc"
    req = urllib.request.Request(query_url, headers={
        "apikey": key,
        "Authorization": f"Bearer {key}"
    })
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"Failed to fetch participants from database: {e}")
        return []

def generate_sample():
    """Generates the official sample certificate PDF."""
    template_path = ensure_template()
    raw_img = Image.open(template_path).convert("RGBA")
    base_template = raw_img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
    
    sample_name = "Nakshatra K. Pandya"
    cert_img = render_certificate_image(sample_name, base_template)
    
    buf = io.BytesIO()
    cert_img.save(buf, format="JPEG", quality=95)
    jpeg_bytes = buf.getvalue()
    
    pdf_bytes = img2pdf.convert(jpeg_bytes, layout_fun=get_a4_layout())
    pdf_path = os.path.join(ROOT_DIR, "Sample_Customized_Certificate_Yuva_Shakti_Sangam.pdf")
    with open(pdf_path, "wb") as f:
        f.write(pdf_bytes)
        
    png_path = os.path.join(ROOT_DIR, "Sample_Customized_Certificate_Yuva_Shakti_Sangam.png")
    cert_img.save(png_path, dpi=(300, 300), format="PNG")
    
    brain_dir = r"C:\Users\naksh\.gemini\antigravity-ide\brain\807c3b42-ab0d-47c4-a3e2-6d32791cf111"
    cert_img.save(os.path.join(brain_dir, "sample_customized_certificate.png"), dpi=(300, 300), format="PNG")
    
    print(f"Sample PDF created: {pdf_path} ({os.path.getsize(pdf_path)/1024:.1f} KB)")
    print(f"Sample PNG created: {png_path} ({os.path.getsize(png_path)/1024:.1f} KB)")

def generate_all(checked_in_only=False, include_png=False):
    """Batch generate customized certificates for all registered participants."""
    t0 = time.time()
    participants = fetch_participants_from_db()
    if not participants:
        print("No participants found to process.")
        return
        
    if checked_in_only:
        participants = [p for p in participants if p.get("checked_in")]
        print(f"Generating for {len(participants)} checked-in participants.")
    else:
        print(f"Generating for all {len(participants)} registered participants.")
        
    template_path = ensure_template()
    raw_img = Image.open(template_path).convert("RGBA")
    print(f"Upscaling base template to {TARGET_WIDTH}x{TARGET_HEIGHT} (300 DPI)...")
    base_template = raw_img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    a4_layout = get_a4_layout()
    all_jpeg_bytes = []
    
    for i, p in enumerate(participants, 1):
        reg_id = p.get("registration_id") or f"P{i:04d}"
        raw_name = p.get("name") or "Participant"
        formatted_name = format_participant_name(raw_name)
        safe_name = re.sub(r"[^\w\s-]", "", formatted_name).strip().replace(" ", "_")
        
        cert_img = render_certificate_image(raw_name, base_template)
        
        buf = io.BytesIO()
        cert_img.save(buf, format="JPEG", quality=94)
        jpeg_bytes = buf.getvalue()
        
        # Save individual PDF
        out_pdf = os.path.join(OUTPUT_DIR, f"Certificate_{reg_id}_{safe_name}.pdf")
        pdf_bytes = img2pdf.convert(jpeg_bytes, layout_fun=a4_layout)
        with open(out_pdf, "wb") as f:
            f.write(pdf_bytes)
            
        if include_png:
            out_png = os.path.join(OUTPUT_DIR, f"Certificate_{reg_id}_{safe_name}.png")
            cert_img.save(out_png, dpi=(300, 300), format="PNG")
            
        all_jpeg_bytes.append(jpeg_bytes)
        
        if i % 10 == 0 or i == len(participants):
            print(f"Progress: [{i}/{len(participants)}] ({i/len(participants)*100:.1f}%) — Last: {reg_id} ({formatted_name})")
            
    # Generate consolidated single multi-page PDF booklet for the print shop
    print("\nAssembling consolidated multi-page print booklet...")
    booklet_pdf = os.path.join(ROOT_DIR, "All_Participants_Certificates_Consolidated.pdf")
    consolidated_bytes = img2pdf.convert(all_jpeg_bytes, layout_fun=a4_layout)
    with open(booklet_pdf, "wb") as f:
        f.write(consolidated_bytes)
        
    duration = time.time() - t0
    print("\n================ GENERATION COMPLETE ================")
    print(f"Total Certificates Generated: {len(participants)}")
    print(f"Individual PDFs Folder: {OUTPUT_DIR}")
    print(f"Consolidated Print Booklet: {booklet_pdf} ({os.path.getsize(booklet_pdf)/(1024*1024):.1f} MB, {len(participants)} pages)")
    print(f"Total Time: {duration:.1f} seconds ({duration/len(participants):.2f}s per certificate)")
    print("=====================================================")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate customized Yuva Shakti Sangam certificates.")
    parser.add_argument("--sample", action="store_true", help="Generate sample certificate")
    parser.add_argument("--name", type=str, help="Generate certificate for a specific participant name")
    parser.add_argument("--all", action="store_true", help="Batch generate certificates for all participants from database")
    parser.add_argument("--checked-in-only", action="store_true", help="When using --all, only process checked-in participants")
    parser.add_argument("--include-png", action="store_true", help="Also save individual PNGs along with PDFs")
    args = parser.parse_args()
    
    if args.all:
        generate_all(checked_in_only=args.checked_in_only, include_png=args.include_png)
    elif args.name:
        template_path = ensure_template()
        raw_img = Image.open(template_path).convert("RGBA")
        base_template = raw_img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
        cert_img = render_certificate_image(args.name, base_template)
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        safe_name = re.sub(r"[^\w\s-]", "", args.name).strip().replace(" ", "_")
        out_pdf = os.path.join(OUTPUT_DIR, f"Certificate_{safe_name}.pdf")
        
        buf = io.BytesIO()
        cert_img.save(buf, format="JPEG", quality=95)
        pdf_bytes = img2pdf.convert(buf.getvalue(), layout_fun=get_a4_layout())
        with open(out_pdf, "wb") as f:
            f.write(pdf_bytes)
        print(f"PDF Saved: {out_pdf}")
    else:
        generate_all()
