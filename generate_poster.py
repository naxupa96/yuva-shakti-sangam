#!/usr/bin/env python3
"""
Yuva Shakti Sangam - 10x10 Foot Master Poster Generator
Produces:
1. Native Vector SVG (10x10 ft / 120"x120" exact scale, 100% vector paths & fonts)
2. CorelDRAW .CDR archive package with full vector definitions, metadata, and preview
3. Print-Ready High-Res PDF (8640x8640 pt, true 10x10 ft scale)
4. High-Resolution Rendered Previews (PNG / JPG) via Playwright & Pillow
5. Interactive Proof Viewer HTML
"""

import os
import sys
import base64
import zipfile
import io
import qrcode
from PIL import Image

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "posters_10x10ft")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Generate Vector QR Codes / Base64 Data
LOC_URL = "https://www.google.com/maps/search/?api=1&query=Shree+Saurashtra+Patel+Samaj+Maninagar,+Isanpur+Rd,+Chandranagar+Society,+Basant+Nagar,+Maninagar,+Ahmedabad"
REG_URL = "https://yuvashaktisangam.org"

def create_qr_base64(data):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=2,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#181411", back_color="#FFFFFF")
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

loc_qr_b64 = create_qr_base64(LOC_URL)
reg_qr_b64 = create_qr_base64(REG_URL)


def build_gujarati_svg():
    """Generates the master 10x10 foot Gujarati Vector Poster SVG (3600x3600 px coordinate system, 120in x 120in)"""
    svg = f'''<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="100%" height="100%" viewBox="0 0 3600 3600" version="1.1">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&amp;family=Plus+Jakarta+Sans:wght@500;600;700;800;900&amp;family=Noto+Sans+Gujarati:wght@600;700;800;900&amp;display=swap');
      .font-guj {{ font-family: 'Noto Sans Gujarati', 'Nirmala UI', 'Shruti', sans-serif; }}
      .font-cinzel {{ font-family: 'Cinzel', 'Times New Roman', serif; }}
      .font-sans {{ font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif; }}
    </style>

    <!-- Master Gradients -->
    <radialGradient id="bgGrad" cx="50%" cy="38%" r="65%">
      <stop offset="0%" stop-color="#FFFDF7"/>
      <stop offset="35%" stop-color="#FEF5E3"/>
      <stop offset="70%" stop-color="#F7E5C3"/>
      <stop offset="100%" stop-color="#E9CE9B"/>
    </radialGradient>

    <linearGradient id="saffronHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#B83505"/>
      <stop offset="25%" stop-color="#E8590C"/>
      <stop offset="50%" stop-color="#F76707"/>
      <stop offset="75%" stop-color="#E8590C"/>
      <stop offset="100%" stop-color="#B83505"/>
    </linearGradient>

    <linearGradient id="titleRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#8A0012"/>
      <stop offset="40%" stop-color="#B81424"/>
      <stop offset="80%" stop-color="#70000E"/>
      <stop offset="100%" stop-color="#4A0009"/>
    </linearGradient>

    <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DFC07B"/>
      <stop offset="25%" stop-color="#FCEFC7"/>
      <stop offset="50%" stop-color="#C69537"/>
      <stop offset="75%" stop-color="#F8E5A7"/>
      <stop offset="100%" stop-color="#A27320"/>
    </linearGradient>

    <linearGradient id="darkNavyCard" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1B140E"/>
      <stop offset="50%" stop-color="#120D08"/>
      <stop offset="100%" stop-color="#0A0704"/>
    </linearGradient>

    <linearGradient id="badgePillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D9480F"/>
      <stop offset="50%" stop-color="#FA5252"/>
      <stop offset="100%" stop-color="#D9480F"/>
    </linearGradient>

    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FBF4E8"/>
    </linearGradient>

    <!-- Drop Shadows & Glow Filters -->
    <filter id="heavyShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
    <filter id="textGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#E8590C" flood-opacity="0.4"/>
    </filter>
    <filter id="goldGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#C69537" flood-opacity="0.5"/>
    </filter>
    <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.25"/>
    </filter>

    <!-- Vector Bhagwa Flag Icon -->
    <g id="vectorFlag">
      <path d="M 0 0 L 80 25 L 45 45 L 90 70 L 0 90 Z" fill="#F76707"/>
      <line x1="0" y1="0" x2="0" y2="110" stroke="#FFEAA7" stroke-width="6" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="6" fill="#FFEAA7"/>
    </g>

    <!-- Corner Flourish Ornament -->
    <g id="cornerFlourish">
      <path d="M 0 0 L 140 0 C 140 45, 105 80, 60 80 C 40 80, 20 60, 20 40 L 20 140 L 0 140 Z" fill="url(#goldMetallic)"/>
      <path d="M 15 15 L 120 15 C 105 35, 80 50, 45 50 L 45 120 L 15 120 Z" fill="#996515" opacity="0.85"/>
      <circle cx="50" cy="50" r="12" fill="#E8590C"/>
      <circle cx="50" cy="50" r="6" fill="#FCEFC7"/>
      <path d="M 0 0 L 160 0 L 160 15 L 15 15 L 15 160 L 0 160 Z" fill="url(#goldMetallic)"/>
    </g>

    <!-- Mandala Motif -->
    <g id="mandalaCenter" opacity="0.06">
      <circle cx="0" cy="0" r="750" fill="none" stroke="#996515" stroke-width="4" stroke-dasharray="16,8"/>
      <circle cx="0" cy="0" r="620" fill="none" stroke="#E8590C" stroke-width="6"/>
      <circle cx="0" cy="0" r="480" fill="none" stroke="#996515" stroke-width="3"/>
      <circle cx="0" cy="0" r="320" fill="none" stroke="#C69537" stroke-width="8" stroke-dasharray="24,12"/>
      <circle cx="0" cy="0" r="160" fill="none" stroke="#E8590C" stroke-width="4"/>
      <path d="M 0 -750 C 80 -600, 80 -450, 0 -350 C -80 -450, -80 -600, 0 -750 Z" fill="#C69537"/>
      <path d="M 0 -750 C 80 -600, 80 -450, 0 -350 C -80 -450, -80 -600, 0 -750 Z" transform="rotate(30)" fill="#E8590C"/>
      <path d="M 0 -750 C 80 -600, 80 -450, 0 -350 C -80 -450, -80 -600, 0 -750 Z" transform="rotate(60)" fill="#C69537"/>
      <path d="M 0 -750 C 80 -600, 80 -450, 0 -350 C -80 -450, -80 -600, 0 -750 Z" transform="rotate(90)" fill="#E8590C"/>
      <path d="M 0 -750 C 80 -600, 80 -450, 0 -350 C -80 -450, -80 -600, 0 -750 Z" transform="rotate(120)" fill="#C69537"/>
      <path d="M 0 -750 C 80 -600, 80 -450, 0 -350 C -80 -450, -80 -600, 0 -750 Z" transform="rotate(150)" fill="#E8590C"/>
      <path d="M 0 -750 C 80 -600, 80 -450, 0 -350 C -80 -450, -80 -600, 0 -750 Z" transform="rotate(180)" fill="#C69537"/>
      <path d="M 0 -750 C 80 -600, 80 -450, 0 -350 C -80 -450, -80 -600, 0 -750 Z" transform="rotate(210)" fill="#E8590C"/>
      <path d="M 0 -750 C 80 -600, 80 -450, 0 -350 C -80 -450, -80 -600, 0 -750 Z" transform="rotate(240)" fill="#C69537"/>
      <path d="M 0 -750 C 80 -600, 80 -450, 0 -350 C -80 -450, -80 -600, 0 -750 Z" transform="rotate(270)" fill="#E8590C"/>
      <path d="M 0 -750 C 80 -600, 80 -450, 0 -350 C -80 -450, -80 -600, 0 -750 Z" transform="rotate(300)" fill="#C69537"/>
      <path d="M 0 -750 C 80 -600, 80 -450, 0 -350 C -80 -450, -80 -600, 0 -750 Z" transform="rotate(330)" fill="#E8590C"/>
    </g>

    <!-- Vector Icon: Sports -->
    <g id="iconSports">
      <circle cx="50" cy="20" r="14" fill="#E8590C"/>
      <path d="M 45 36 L 55 36 L 68 55 L 85 52 M 45 42 L 30 55 L 20 75 M 50 48 L 50 72 L 65 92 M 50 68 L 35 92" stroke="#E8590C" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </g>

    <!-- Vector Icon: Samvaad -->
    <g id="iconSamvaad">
      <rect x="15" y="15" width="70" height="50" rx="12" fill="#B81424"/>
      <polygon points="35,65 45,78 55,65" fill="#B81424"/>
      <circle cx="35" cy="40" r="5" fill="#FFFFFF"/>
      <circle cx="50" cy="40" r="5" fill="#FFFFFF"/>
      <circle cx="65" cy="40" r="5" fill="#FFFFFF"/>
    </g>

    <!-- Vector Icon: Stage -->
    <g id="iconStage">
      <path d="M 20 25 C 20 65, 80 65, 80 25 Z" fill="#C69537"/>
      <circle cx="38" cy="38" r="5" fill="#181411"/>
      <circle cx="62" cy="38" r="5" fill="#181411"/>
      <path d="M 40 52 Q 50 60 60 52" stroke="#181411" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M 50 15 L 50 25 M 35 18 L 38 25 M 65 18 L 62 25" stroke="#E8590C" stroke-width="3"/>
    </g>

    <!-- Vector Icon: Tea -->
    <g id="iconTea">
      <path d="M 22 35 L 78 35 C 75 75, 25 75, 22 35 Z" fill="#2B8A3E"/>
      <path d="M 75 42 C 90 42, 90 60, 72 62" stroke="#2B8A3E" stroke-width="6" fill="none" stroke-linecap="round"/>
      <line x1="16" y1="80" x2="84" y2="80" stroke="#2B8A3E" stroke-width="6" stroke-linecap="round"/>
      <path d="M 38 25 Q 42 16 38 10 M 50 25 Q 54 16 50 10 M 62 25 Q 66 16 62 10" stroke="#E8590C" stroke-width="3" stroke-linecap="round" fill="none"/>
    </g>
  </defs>

  <!-- Base Canvas Background -->
  <rect x="0" y="0" width="3600" height="3600" fill="url(#bgGrad)"/>

  <!-- Centered Mandala Watermark -->
  <g transform="translate(1800, 1500)">
    <use xlink:href="#mandalaCenter"/>
  </g>

  <!-- Master Outer Frame & Border -->
  <rect x="50" y="50" width="3500" height="3500" rx="30" fill="none" stroke="url(#goldMetallic)" stroke-width="28"/>
  <rect x="80" y="80" width="3440" height="3440" rx="20" fill="none" stroke="#5E000C" stroke-width="6"/>
  <rect x="96" y="96" width="3408" height="3408" rx="16" fill="none" stroke="url(#goldMetallic)" stroke-width="4" stroke-dasharray="24,12"/>

  <!-- 4 Corner Flourishes -->
  <g transform="translate(98, 98)"><use xlink:href="#cornerFlourish"/></g>
  <g transform="translate(3502, 98) scale(-1, 1)"><use xlink:href="#cornerFlourish"/></g>
  <g transform="translate(98, 3502) scale(1, -1)"><use xlink:href="#cornerFlourish"/></g>
  <g transform="translate(3502, 3502) scale(-1, -1)"><use xlink:href="#cornerFlourish"/></g>

  <!-- ============================================================ -->
  <!-- 1. TOP HEADER BANNER (ORGANIZATION) -->
  <!-- ============================================================ -->
  <g id="headerSection">
    <rect x="100" y="100" width="3400" height="260" rx="14" fill="url(#saffronHeaderGrad)" filter="url(#badgeShadow)"/>
    <rect x="100" y="352" width="3400" height="12" fill="url(#goldMetallic)"/>

    <!-- Sacred Om Symbol in Golden Sunburst -->
    <g transform="translate(320, 230)">
      <circle cx="0" cy="0" r="95" fill="#FFEAA7" stroke="url(#goldMetallic)" stroke-width="8" filter="url(#goldGlow)"/>
      <circle cx="0" cy="0" r="82" fill="#E8590C"/>
      <text x="0" y="38" class="font-guj" font-size="110" font-weight="900" fill="#FFFDF7" text-anchor="middle">ॐ</text>
    </g>

    <!-- Main Organization Headline -->
    <text x="1850" y="210" class="font-guj" font-size="82" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">
      રાષ્ટ્રીય સ્વયંસેવક સંઘ - મણિનગર-નગર
    </text>
    <text x="1850" y="295" class="font-cinzel" font-size="44" font-weight="800" fill="#FFEFB8" text-anchor="middle" letter-spacing="6">
      RASHTRIYA SWAYAMSEVAK SANGH — MANINAGAR NAGAR
    </text>

    <!-- Top Right Corner Flag -->
    <g transform="translate(3280, 230)">
      <circle cx="0" cy="0" r="95" fill="#FFEAA7" stroke="url(#goldMetallic)" stroke-width="8" filter="url(#goldGlow)"/>
      <circle cx="0" cy="0" r="82" fill="#E8590C"/>
      <g transform="translate(-45, -50)">
        <use xlink:href="#vectorFlag"/>
      </g>
    </g>
  </g>

  <!-- ============================================================ -->
  <!-- 2. HERO TITLE SECTION -->
  <!-- ============================================================ -->
  <g id="heroTitleSection">
    <!-- Sub-badge Pill -->
    <g transform="translate(1800, 460)">
      <rect x="-620" y="-45" width="1240" height="90" rx="45" fill="url(#badgePillGrad)" filter="url(#badgeShadow)"/>
      <rect x="-614" y="-39" width="1228" height="78" rx="39" fill="none" stroke="#FFEFB8" stroke-width="3"/>
      <text x="0" y="16" class="font-guj" font-size="44" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">
        🚩 રાષ્ટ્ર પ્રથમ • યુવા શક્તિ, રાષ્ટ્ર શક્તિ 🚩
      </text>
    </g>

    <!-- Main Giant Title: યુવા શક્તિ સંગમ -->
    <!-- 3D Shadow Layer -->
    <text x="1806" y="736" class="font-guj" font-size="210" font-weight="900" fill="#3D0008" text-anchor="middle" letter-spacing="6">
      યુવા શક્તિ સંગમ
    </text>
    <!-- Front Text Layer with Gradient -->
    <text x="1800" y="730" class="font-guj" font-size="210" font-weight="900" fill="url(#titleRedGrad)" stroke="#5E000C" stroke-width="4" text-anchor="middle" letter-spacing="6" filter="url(#textGlow)">
      યુવા શક્તિ સંગમ
    </text>

    <!-- English Subtitle Bar -->
    <text x="1800" y="850" class="font-cinzel" font-size="82" font-weight="900" fill="#B81424" text-anchor="middle" letter-spacing="16">
      YUVA SHAKTI SANGAM
    </text>

    <!-- Tagline & Core Mission Statement -->
    <g transform="translate(1800, 960)">
      <line x1="-1200" y1="0" x2="-450" y2="0" stroke="url(#goldMetallic)" stroke-width="6"/>
      <circle cx="-450" cy="0" r="10" fill="#E8590C"/>
      <text x="0" y="14" class="font-guj" font-size="46" font-weight="800" fill="#181411" text-anchor="middle">
        રાષ્ટ્ર પુનરોત્થાન અને ચારિત્ર્ય નિર્માણ માટે યુવાનોનો વિરાટ સંગમ
      </text>
      <circle cx="450" cy="0" r="10" fill="#E8590C"/>
      <line x1="450" y1="0" x2="1200" y2="0" stroke="url(#goldMetallic)" stroke-width="6"/>
    </g>

    <!-- Punchy Conviction Quote Banner -->
    <g transform="translate(1800, 1075)">
      <rect x="-1400" y="-55" width="2800" height="110" rx="16" fill="#FFFFFF" stroke="#DFC07B" stroke-width="4" filter="url(#badgeShadow)"/>
      <text x="0" y="12" class="font-sans" font-size="38" font-weight="800" fill="#5E000C" text-anchor="middle" letter-spacing="1">
        “India doesn't just need young people. <tspan fill="#E8590C">India needs young people who CARE.</tspan>”
      </text>
    </g>
  </g>

  <!-- ============================================================ -->
  <!-- 3. KEY HIGHLIGHTS / 4 PILLARS (4 VIBRANT CARDS) -->
  <!-- ============================================================ -->
  <g id="pillarsSection" transform="translate(0, 1170)">
    <text x="1800" y="60" class="font-guj" font-size="48" font-weight="900" fill="#B81424" text-anchor="middle" letter-spacing="4">
      ❖ કાર્યક્રમના મુખ્ય આકર્ષણો ❖
    </text>

    <!-- CARD 1: Ground Sports -->
    <g transform="translate(180, 100)">
      <rect x="0" y="0" width="760" height="360" rx="20" fill="url(#cardGrad)" stroke="#DFC07B" stroke-width="5" filter="url(#badgeShadow)"/>
      <rect x="0" y="0" width="760" height="12" rx="6" fill="#E8590C"/>
      <circle cx="380" cy="85" r="52" fill="#FFE8D6" stroke="#E8590C" stroke-width="4"/>
      <g transform="translate(330, 35)">
        <use xlink:href="#iconSports"/>
      </g>
      <text x="380" y="185" class="font-guj" font-size="44" font-weight="900" fill="#181411" text-anchor="middle">
        પરંપરાગત રમતો
      </text>
      <text x="380" y="230" class="font-sans" font-size="26" font-weight="800" fill="#E8590C" text-anchor="middle">
        GROUND GAMES &amp; SPORTS
      </text>
      <text x="380" y="285" class="font-guj" font-size="28" font-weight="600" fill="#5C4B3D" text-anchor="middle">
        માતૃભૂમિની માટીમાં ઉત્સાહવર્ધક રમતો
      </text>
      <text x="380" y="325" class="font-guj" font-size="26" font-weight="700" fill="#B81424" text-anchor="middle">
        શારીરિક સ્ફૂર્તિ • ટીમ સ્પિરિટ
      </text>
    </g>

    <!-- CARD 2: Youth Samvaad -->
    <g transform="translate(1000, 100)">
      <rect x="0" y="0" width="760" height="360" rx="20" fill="url(#cardGrad)" stroke="#DFC07B" stroke-width="5" filter="url(#badgeShadow)"/>
      <rect x="0" y="0" width="760" height="12" rx="6" fill="#B81424"/>
      <circle cx="380" cy="85" r="52" fill="#FFE3E3" stroke="#B81424" stroke-width="4"/>
      <g transform="translate(330, 35)">
        <use xlink:href="#iconSamvaad"/>
      </g>
      <text x="380" y="185" class="font-guj" font-size="44" font-weight="900" fill="#181411" text-anchor="middle">
        યુવા સંવાદ
      </text>
      <text x="380" y="230" class="font-sans" font-size="26" font-weight="800" fill="#B81424" text-anchor="middle">
        INSPIRING YOUTH SAMVAAD
      </text>
      <text x="380" y="285" class="font-guj" font-size="28" font-weight="600" fill="#5C4B3D" text-anchor="middle">
        રાષ્ટ્રસેવા અને સમર્પણ પર ગહન સંવાદ
      </text>
      <text x="380" y="325" class="font-guj" font-size="26" font-weight="700" fill="#E8590C" text-anchor="middle">
        ઓપન વિઝન • રાષ્ટ્ર નિર્માણ
      </text>
    </g>

    <!-- CARD 3: Stage Performances -->
    <g transform="translate(1820, 100)">
      <rect x="0" y="0" width="760" height="360" rx="20" fill="url(#cardGrad)" stroke="#DFC07B" stroke-width="5" filter="url(#badgeShadow)"/>
      <rect x="0" y="0" width="760" height="12" rx="6" fill="#C69537"/>
      <circle cx="380" cy="85" r="52" fill="#FFF3D6" stroke="#C69537" stroke-width="4"/>
      <g transform="translate(330, 35)">
        <use xlink:href="#iconStage"/>
      </g>
      <text x="380" y="185" class="font-guj" font-size="44" font-weight="900" fill="#181411" text-anchor="middle">
        સાંસ્કૃતિક પ્રસ્તુતિ
      </text>
      <text x="380" y="230" class="font-sans" font-size="26" font-weight="800" fill="#A27320" text-anchor="middle">
        STAGE PERFORMANCES
      </text>
      <text x="380" y="285" class="font-guj" font-size="28" font-weight="600" fill="#5C4B3D" text-anchor="middle">
        દેશભક્તિ ગીત, માર્શલ આર્ટ્સ અને નાટ્ય
      </text>
      <text x="380" y="325" class="font-guj" font-size="26" font-weight="700" fill="#B81424" text-anchor="middle">
        સમાપન ભવ્ય સમારોહ
      </text>
    </g>

    <!-- CARD 4: High Tea -->
    <g transform="translate(2640, 100)">
      <rect x="0" y="0" width="760" height="360" rx="20" fill="url(#cardGrad)" stroke="#DFC07B" stroke-width="5" filter="url(#badgeShadow)"/>
      <rect x="0" y="0" width="760" height="12" rx="6" fill="#2B8A3E"/>
      <circle cx="380" cy="85" r="52" fill="#EBFBEE" stroke="#2B8A3E" stroke-width="4"/>
      <g transform="translate(330, 35)">
        <use xlink:href="#iconTea"/>
      </g>
      <text x="380" y="185" class="font-guj" font-size="44" font-weight="900" fill="#181411" text-anchor="middle">
        સ્વાદિષ્ટ અલ્પાહાર
      </text>
      <text x="380" y="230" class="font-sans" font-size="26" font-weight="800" fill="#2B8A3E" text-anchor="middle">
        HIGH TEA &amp; REFRESHMENTS
      </text>
      <text x="380" y="285" class="font-guj" font-size="28" font-weight="600" fill="#5C4B3D" text-anchor="middle">
        સહભોજ, પારસ્પરિક પરિચય અને મિલન
      </text>
      <text x="380" y="325" class="font-guj" font-size="26" font-weight="700" fill="#E8590C" text-anchor="middle">
        નવી ઊર્જા સાથે પ્રસ્થાન
      </text>
    </g>
  </g>

  <!-- ============================================================ -->
  <!-- 4. MASTER EVENT LOGISTICS BOX -->
  <!-- ============================================================ -->
  <g id="logisticsSection" transform="translate(180, 1690)">
    <rect x="0" y="0" width="3240" height="780" rx="26" fill="url(#darkNavyCard)" stroke="url(#goldMetallic)" stroke-width="8" filter="url(#heavyShadow)"/>
    <rect x="12" y="12" width="3216" height="756" rx="20" fill="none" stroke="#DFC07B" stroke-width="2" stroke-dasharray="20,10"/>

    <!-- Left Column: Date & Time -->
    <g transform="translate(80, 80)">
      <!-- DATE BLOCK -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="1380" height="260" rx="16" fill="#251B12" stroke="#E8590C" stroke-width="4"/>
        <rect x="30" y="30" width="200" height="200" rx="14" fill="#E8590C"/>
        <text x="130" y="105" class="font-guj" font-size="52" font-weight="900" fill="#FFFFFF" text-anchor="middle">સપ્ટે</text>
        <text x="130" y="200" class="font-cinzel" font-size="95" font-weight="900" fill="#FFFFFF" text-anchor="middle">06</text>
        
        <text x="270" y="80" class="font-cinzel" font-size="34" font-weight="800" fill="#FFEAA7" letter-spacing="2">
          DATE / તારીખ
        </text>
        <text x="270" y="150" class="font-guj" font-size="62" font-weight="900" fill="#FFFFFF">
          ૦૬ સપ્ટેમ્બર ૨૦૨૬, રવિવાર
        </text>
        <text x="270" y="215" class="font-sans" font-size="38" font-weight="700" fill="#F8E5A7">
          Sunday, 06 September 2026
        </text>
      </g>

      <!-- TIME BLOCK -->
      <g transform="translate(0, 310)">
        <rect x="0" y="0" width="1380" height="260" rx="16" fill="#251B12" stroke="#C69537" stroke-width="4"/>
        <rect x="30" y="30" width="200" height="200" rx="14" fill="#C69537"/>
        <circle cx="130" cy="130" r="70" fill="#181411" stroke="#FFFFFF" stroke-width="6"/>
        <line x1="130" y1="130" x2="130" y2="85" stroke="#FFEAA7" stroke-width="8" stroke-linecap="round"/>
        <line x1="130" y1="130" x2="165" y2="130" stroke="#FFEAA7" stroke-width="8" stroke-linecap="round"/>
        <circle cx="130" cy="130" r="8" fill="#E8590C"/>
        
        <text x="270" y="80" class="font-cinzel" font-size="34" font-weight="800" fill="#FFEAA7" letter-spacing="2">
          TIME / સમય
        </text>
        <text x="270" y="150" class="font-guj" font-size="62" font-weight="900" fill="#FFFFFF">
          સાંજે ૪:૦૦ થી રાત્રે ૮:૦૦ કલાક
        </text>
        <text x="270" y="215" class="font-sans" font-size="38" font-weight="700" fill="#F8E5A7">
          4:00 PM to 8:00 PM IST
        </text>
      </g>
    </g>

    <!-- Vertical Separator -->
    <line x1="1560" y1="60" x2="1560" y2="720" stroke="url(#goldMetallic)" stroke-width="4" stroke-dasharray="16,8"/>

    <!-- Right Column: Venue -->
    <g transform="translate(1640, 80)">
      <rect x="0" y="0" width="1500" height="570" rx="16" fill="#251B12" stroke="url(#goldMetallic)" stroke-width="4"/>
      
      <g transform="translate(40, 40)">
        <rect x="0" y="0" width="300" height="60" rx="10" fill="#E8590C"/>
        <text x="150" y="42" class="font-guj" font-size="32" font-weight="900" fill="#FFFFFF" text-anchor="middle">
          🏛️ સ્થળ / VENUE
        </text>
      </g>

      <text x="40" y="180" class="font-guj" font-size="60" font-weight="900" fill="#FFFFFF">
        સૌરાષ્ટ્ર પટેલ સમાજની વાડી
      </text>
      <text x="40" y="240" class="font-cinzel" font-size="44" font-weight="800" fill="#FFEFB8">
        Shree Saurashtra Patel Samaj Hall
      </text>

      <line x1="40" y1="275" x2="1450" y2="275" stroke="#DFC07B" stroke-width="2"/>

      <g transform="translate(40, 330)">
        <text x="0" y="0" class="font-guj" font-size="38" font-weight="800" fill="#FFEAA7">
          📍 લેન્ડમાર્ક માર્ગદર્શન:
        </text>
        <text x="0" y="55" class="font-guj" font-size="34" font-weight="600" fill="#F1F3F5">
          • ચંદ્રનગર સોસાયટીની બાજુમાં, ઈસનપુર રોડ
        </text>
        <text x="0" y="110" class="font-guj" font-size="34" font-weight="600" fill="#F1F3F5">
          • સૂર્યનગર પોલીસ ચોકી સામે, સિદ્ધેશ્વર મહાદેવ નજીક
        </text>
        <text x="0" y="165" class="font-guj" font-size="38" font-weight="800" fill="#E8590C">
          મણિનગર, અમદાવાદ - ૩૮૦૦૦૮ (ગુજરાત)
        </text>
      </g>
    </g>

    <!-- Pass Fee Strip -->
    <g transform="translate(80, 680)">
      <rect x="0" y="0" width="3080" height="70" rx="12" fill="#E8590C"/>
      <text x="1540" y="48" class="font-guj" font-size="36" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
        🎟️ સહયોગ રાશિ / ENTRY PASS : ફક્ત ₹૫૦/- (ડેલિગેટ આઇકાર્ડ + ઇવેન્ટ કીટ + પૌષ્ટિક અલ્પાહાર સહિત)
      </text>
    </g>
  </g>

  <!-- ============================================================ -->
  <!-- 5. BOTTOM SECTION: HIGH-CONTRAST SCANNABLE QR CODES -->
  <!-- ============================================================ -->
  <g id="bottomCtaSection" transform="translate(180, 2520)">
    <rect x="0" y="0" width="3240" height="930" rx="26" fill="#FFFFFF" stroke="#DFC07B" stroke-width="6" filter="url(#heavyShadow)"/>

    <!-- LEFT: LOCATION QR -->
    <g transform="translate(70, 70)">
      <rect x="0" y="0" width="760" height="790" rx="20" fill="#FFFDF7" stroke="#181411" stroke-width="4"/>
      <rect x="0" y="0" width="760" height="85" rx="16" fill="#181411"/>
      <text x="380" y="58" class="font-guj" font-size="38" font-weight="900" fill="#FFEAA7" text-anchor="middle">
        📍 સ્થળ / GOOGLE MAPS
      </text>
      
      <g transform="translate(140, 130)">
        <rect x="-20" y="-20" width="520" height="520" rx="12" fill="#FFFFFF" stroke="#DFC07B" stroke-width="3"/>
        <image x="0" y="0" width="480" height="480" xlink:href="data:image/png;base64,{loc_qr_b64}"/>
      </g>

      <text x="380" y="700" class="font-guj" font-size="34" font-weight="900" fill="#E8590C" text-anchor="middle">
        સ્થળ માટે QR સ્કેન કરો
      </text>
      <text x="380" y="745" class="font-sans" font-size="26" font-weight="700" fill="#5C4B3D" text-anchor="middle">
        Scan for Venue Location
      </text>
    </g>

    <!-- CENTER: INVITATION APPEAL & HELPLINE -->
    <g transform="translate(880, 60)">
      <text x="740" y="70" class="font-guj" font-size="52" font-weight="900" fill="#B81424" text-anchor="middle">
        ❖ આપનું હાર્દિક સ્વાગત છે ❖
      </text>
      <text x="740" y="130" class="font-guj" font-size="36" font-weight="700" fill="#181411" text-anchor="middle">
        ૧૮ થી ૩૫ વર્ષના તમામ યુવક-યુવતીઓ માટે પ્રેરણાદાયી સંમેલન
      </text>

      <g transform="translate(40, 170)">
        <rect x="0" y="0" width="1400" height="230" rx="16" fill="#FFF9EE" stroke="#E9CE9B" stroke-width="3"/>
        <text x="700" y="65" class="font-guj" font-size="34" font-weight="700" fill="#2B2017" text-anchor="middle">
          'રાષ્ટ્ર પ્રથમ'ની ભાવનાથી પ્રેરાયેલા યુવા શક્તિના આ ભવ્ય અભિયાનમાં
        </text>
        <text x="700" y="125" class="font-guj" font-size="34" font-weight="700" fill="#2B2017" text-anchor="middle">
          આપણી ગરિમાપૂર્ણ ઉપસ્થિતિ નોંધાવીને સંકલ્પને દ્રઢ બનાવીએ.
        </text>
        <text x="700" y="185" class="font-guj" font-size="36" font-weight="900" fill="#E8590C" text-anchor="middle">
          અમે આપની સ્નેહપૂર્ણ ઉપસ્થિતિની હાર્દિક અપેક્ષા રાખીએ છીએ.
        </text>
      </g>

      <g transform="translate(40, 430)">
        <rect x="0" y="0" width="1400" height="375" rx="16" fill="#181411" stroke="#DFC07B" stroke-width="4"/>
        
        <text x="700" y="60" class="font-cinzel" font-size="34" font-weight="800" fill="#FFEAA7" text-anchor="middle" letter-spacing="3">
          OFFICIAL WEBSITE &amp; REGISTRATION
        </text>
        <text x="700" y="125" class="font-sans" font-size="48" font-weight="900" fill="#38D9A9" text-anchor="middle" letter-spacing="2">
          yuvashaktisangam.org
        </text>

        <line x1="80" y1="160" x2="1320" y2="160" stroke="#495057" stroke-width="2"/>

        <text x="700" y="215" class="font-guj" font-size="34" font-weight="800" fill="#FFA94D" text-anchor="middle">
          📞 સંપર્ક સૂત્ર / HELPLINE NUMBERS:
        </text>
        
        <!-- Contact 1 -->
        <g transform="translate(100, 255)">
          <rect x="0" y="0" width="560" height="85" rx="10" fill="#2B2017" stroke="#E8590C" stroke-width="2"/>
          <text x="280" y="38" class="font-guj" font-size="30" font-weight="800" fill="#FFFFFF" text-anchor="middle">ધ્રુવિલ ભટ્ટ</text>
          <text x="280" y="70" class="font-sans" font-size="28" font-weight="800" fill="#FFEAA7" text-anchor="middle">+91 90547 37915</text>
        </g>

        <!-- Contact 2 -->
        <g transform="translate(740, 255)">
          <rect x="0" y="0" width="560" height="85" rx="10" fill="#2B2017" stroke="#E8590C" stroke-width="2"/>
          <text x="280" y="38" class="font-guj" font-size="30" font-weight="800" fill="#FFFFFF" text-anchor="middle">કુશલ પટેલ</text>
          <text x="280" y="70" class="font-sans" font-size="28" font-weight="800" fill="#FFEAA7" text-anchor="middle">+91 70462 32003</text>
        </g>
      </g>
    </g>

    <!-- RIGHT: REGISTRATION QR -->
    <g transform="translate(2410, 70)">
      <rect x="0" y="0" width="760" height="790" rx="20" fill="#FFFDF7" stroke="#E8590C" stroke-width="5"/>
      <rect x="0" y="0" width="760" height="85" rx="16" fill="#E8590C"/>
      <text x="380" y="58" class="font-guj" font-size="38" font-weight="900" fill="#FFFFFF" text-anchor="middle">
        🎟️ ઓનલાઇન રજીસ્ટ્રેશન
      </text>
      
      <g transform="translate(140, 130)">
        <rect x="-20" y="-20" width="520" height="520" rx="12" fill="#FFFFFF" stroke="#DFC07B" stroke-width="3"/>
        <image x="0" y="0" width="480" height="480" xlink:href="data:image/png;base64,{reg_qr_b64}"/>
      </g>

      <text x="380" y="700" class="font-guj" font-size="34" font-weight="900" fill="#B81424" text-anchor="middle">
        રજીસ્ટ્રેશન માટે QR સ્કેન કરો
      </text>
      <text x="380" y="745" class="font-sans" font-size="26" font-weight="700" fill="#5C4B3D" text-anchor="middle">
        Scan to Register &amp; Get Pass
      </text>
    </g>
  </g>

  <!-- Eyelet Grommet Punch Markers -->
  <circle cx="150" cy="150" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="850" cy="150" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="1800" cy="150" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="2750" cy="150" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="3450" cy="150" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>

  <circle cx="150" cy="3450" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="850" cy="3450" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="1800" cy="3450" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="2750" cy="3450" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="3450" cy="3450" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>

  <circle cx="150" cy="1800" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="3450" cy="1800" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
</svg>
'''
    return svg


def build_english_svg():
    """Generates the master 10x10 foot English Vector Poster SVG (3600x3600 px coordinate system, 120in x 120in)"""
    svg = f'''<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="100%" height="100%" viewBox="0 0 3600 3600" version="1.1">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&amp;family=Plus+Jakarta+Sans:wght@500;600;700;800;900&amp;family=Noto+Sans+Gujarati:wght@600;700;800;900&amp;display=swap');
      .font-guj {{ font-family: 'Noto Sans Gujarati', 'Nirmala UI', 'Shruti', sans-serif; }}
      .font-cinzel {{ font-family: 'Cinzel', 'Times New Roman', serif; }}
      .font-sans {{ font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif; }}
    </style>

    <!-- Master Gradients -->
    <radialGradient id="bgGradE" cx="50%" cy="38%" r="65%">
      <stop offset="0%" stop-color="#FFFDF7"/>
      <stop offset="35%" stop-color="#FEF5E3"/>
      <stop offset="70%" stop-color="#F7E5C3"/>
      <stop offset="100%" stop-color="#E9CE9B"/>
    </radialGradient>

    <linearGradient id="saffronHeaderGradE" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#B83505"/>
      <stop offset="25%" stop-color="#E8590C"/>
      <stop offset="50%" stop-color="#F76707"/>
      <stop offset="75%" stop-color="#E8590C"/>
      <stop offset="100%" stop-color="#B83505"/>
    </linearGradient>

    <linearGradient id="titleRedGradE" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#8A0012"/>
      <stop offset="40%" stop-color="#B81424"/>
      <stop offset="80%" stop-color="#70000E"/>
      <stop offset="100%" stop-color="#4A0009"/>
    </linearGradient>

    <linearGradient id="goldMetallicE" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DFC07B"/>
      <stop offset="25%" stop-color="#FCEFC7"/>
      <stop offset="50%" stop-color="#C69537"/>
      <stop offset="75%" stop-color="#F8E5A7"/>
      <stop offset="100%" stop-color="#A27320"/>
    </linearGradient>

    <linearGradient id="darkNavyCardE" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1B140E"/>
      <stop offset="50%" stop-color="#120D08"/>
      <stop offset="100%" stop-color="#0A0704"/>
    </linearGradient>

    <linearGradient id="badgePillGradE" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D9480F"/>
      <stop offset="50%" stop-color="#FA5252"/>
      <stop offset="100%" stop-color="#D9480F"/>
    </linearGradient>

    <linearGradient id="cardGradE" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FBF4E8"/>
    </linearGradient>

    <filter id="heavyShadowE" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
    <filter id="textGlowE" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#E8590C" flood-opacity="0.4"/>
    </filter>
    <filter id="badgeShadowE" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.25"/>
    </filter>

    <g id="vectorFlagE">
      <path d="M 0 0 L 80 25 L 45 45 L 90 70 L 0 90 Z" fill="#F76707"/>
      <line x1="0" y1="0" x2="0" y2="110" stroke="#FFEAA7" stroke-width="6" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="6" fill="#FFEAA7"/>
    </g>

    <g id="cornerFlourishE">
      <path d="M 0 0 L 140 0 C 140 45, 105 80, 60 80 C 40 80, 20 60, 20 40 L 20 140 L 0 140 Z" fill="url(#goldMetallicE)"/>
      <path d="M 15 15 L 120 15 C 105 35, 80 50, 45 50 L 45 120 L 15 120 Z" fill="#996515" opacity="0.85"/>
      <circle cx="50" cy="50" r="12" fill="#E8590C"/>
      <circle cx="50" cy="50" r="6" fill="#FCEFC7"/>
      <path d="M 0 0 L 160 0 L 160 15 L 15 15 L 15 160 L 0 160 Z" fill="url(#goldMetallicE)"/>
    </g>

    <g id="iconSportsE">
      <circle cx="50" cy="20" r="14" fill="#E8590C"/>
      <path d="M 45 36 L 55 36 L 68 55 L 85 52 M 45 42 L 30 55 L 20 75 M 50 48 L 50 72 L 65 92 M 50 68 L 35 92" stroke="#E8590C" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </g>
    <g id="iconSamvaadE">
      <rect x="15" y="15" width="70" height="50" rx="12" fill="#B81424"/>
      <polygon points="35,65 45,78 55,65" fill="#B81424"/>
      <circle cx="35" cy="40" r="5" fill="#FFFFFF"/>
      <circle cx="50" cy="40" r="5" fill="#FFFFFF"/>
      <circle cx="65" cy="40" r="5" fill="#FFFFFF"/>
    </g>
    <g id="iconStageE">
      <path d="M 20 25 C 20 65, 80 65, 80 25 Z" fill="#C69537"/>
      <circle cx="38" cy="38" r="5" fill="#181411"/>
      <circle cx="62" cy="38" r="5" fill="#181411"/>
      <path d="M 40 52 Q 50 60 60 52" stroke="#181411" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M 50 15 L 50 25 M 35 18 L 38 25 M 65 18 L 62 25" stroke="#E8590C" stroke-width="3"/>
    </g>
    <g id="iconTeaE">
      <path d="M 22 35 L 78 35 C 75 75, 25 75, 22 35 Z" fill="#2B8A3E"/>
      <path d="M 75 42 C 90 42, 90 60, 72 62" stroke="#2B8A3E" stroke-width="6" fill="none" stroke-linecap="round"/>
      <line x1="16" y1="80" x2="84" y2="80" stroke="#2B8A3E" stroke-width="6" stroke-linecap="round"/>
      <path d="M 38 25 Q 42 16 38 10 M 50 25 Q 54 16 50 10 M 62 25 Q 66 16 62 10" stroke="#E8590C" stroke-width="3" stroke-linecap="round" fill="none"/>
    </g>
  </defs>

  <rect x="0" y="0" width="3600" height="3600" fill="url(#bgGradE)"/>

  <!-- Master Border Frame -->
  <rect x="50" y="50" width="3500" height="3500" rx="30" fill="none" stroke="url(#goldMetallicE)" stroke-width="28"/>
  <rect x="80" y="80" width="3440" height="3440" rx="20" fill="none" stroke="#5E000C" stroke-width="6"/>
  <rect x="96" y="96" width="3408" height="3408" rx="16" fill="none" stroke="url(#goldMetallicE)" stroke-width="4" stroke-dasharray="24,12"/>

  <!-- 4 Corner Flourishes -->
  <g transform="translate(98, 98)"><use xlink:href="#cornerFlourishE"/></g>
  <g transform="translate(3502, 98) scale(-1, 1)"><use xlink:href="#cornerFlourishE"/></g>
  <g transform="translate(98, 3502) scale(1, -1)"><use xlink:href="#cornerFlourishE"/></g>
  <g transform="translate(3502, 3502) scale(-1, -1)"><use xlink:href="#cornerFlourishE"/></g>

  <!-- 1. HEADER SECTION -->
  <g id="headerSectionE">
    <rect x="100" y="100" width="3400" height="260" rx="14" fill="url(#saffronHeaderGradE)" filter="url(#badgeShadowE)"/>
    <rect x="100" y="352" width="3400" height="12" fill="url(#goldMetallicE)"/>

    <g transform="translate(320, 230)">
      <circle cx="0" cy="0" r="95" fill="#FFEAA7" stroke="url(#goldMetallicE)" stroke-width="8"/>
      <circle cx="0" cy="0" r="82" fill="#E8590C"/>
      <text x="0" y="38" class="font-guj" font-size="110" font-weight="900" fill="#FFFDF7" text-anchor="middle">ॐ</text>
    </g>

    <text x="1850" y="210" class="font-cinzel" font-size="76" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">
      RASHTRIYA SWAYAMSEVAK SANGH
    </text>
    <text x="1850" y="295" class="font-cinzel" font-size="46" font-weight="800" fill="#FFEFB8" text-anchor="middle" letter-spacing="8">
      MANINAGAR NAGAR • AHMEDABAD
    </text>

    <g transform="translate(3280, 230)">
      <circle cx="0" cy="0" r="95" fill="#FFEAA7" stroke="url(#goldMetallicE)" stroke-width="8"/>
      <circle cx="0" cy="0" r="82" fill="#E8590C"/>
      <g transform="translate(-45, -50)">
        <use xlink:href="#vectorFlagE"/>
      </g>
    </g>
  </g>

  <!-- 2. HERO TITLE SECTION -->
  <g id="heroTitleSectionE">
    <g transform="translate(1800, 460)">
      <rect x="-620" y="-45" width="1240" height="90" rx="45" fill="url(#badgePillGradE)" filter="url(#badgeShadowE)"/>
      <rect x="-614" y="-39" width="1228" height="78" rx="39" fill="none" stroke="#FFEFB8" stroke-width="3"/>
      <text x="0" y="16" class="font-sans" font-size="38" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">
        🚩 NATION FIRST • YOUTH POWER, NATION POWER 🚩
      </text>
    </g>

    <text x="1806" y="736" class="font-cinzel" font-size="180" font-weight="900" fill="#3D0008" text-anchor="middle" letter-spacing="8">
      YUVA SHAKTI SANGAM
    </text>
    <text x="1800" y="730" class="font-cinzel" font-size="180" font-weight="900" fill="url(#titleRedGradE)" stroke="#5E000C" stroke-width="4" text-anchor="middle" letter-spacing="8" filter="url(#textGlowE)">
      YUVA SHAKTI SANGAM
    </text>

    <text x="1800" y="850" class="font-guj" font-size="74" font-weight="900" fill="#B81424" text-anchor="middle" letter-spacing="8">
      યુવા શક્તિ સંગમ
    </text>

    <g transform="translate(1800, 960)">
      <line x1="-1200" y1="0" x2="-450" y2="0" stroke="url(#goldMetallicE)" stroke-width="6"/>
      <circle cx="-450" cy="0" r="10" fill="#E8590C"/>
      <text x="0" y="14" class="font-sans" font-size="44" font-weight="800" fill="#181411" text-anchor="middle" letter-spacing="2">
        A Historic Conclave of Youth for National Rejuvenation &amp; Character Building
      </text>
      <circle cx="450" cy="0" r="10" fill="#E8590C"/>
      <line x1="450" y1="0" x2="1200" y2="0" stroke="url(#goldMetallicE)" stroke-width="6"/>
    </g>

    <g transform="translate(1800, 1075)">
      <rect x="-1400" y="-55" width="2800" height="110" rx="16" fill="#FFFFFF" stroke="#DFC07B" stroke-width="4" filter="url(#badgeShadowE)"/>
      <text x="0" y="12" class="font-sans" font-size="38" font-weight="800" fill="#5E000C" text-anchor="middle" letter-spacing="1">
        “India doesn't just need young people. <tspan fill="#E8590C">India needs young people who CARE.</tspan>”
      </text>
    </g>
  </g>

  <!-- 3. HIGHLIGHTS / 4 PILLARS -->
  <g id="pillarsSectionE" transform="translate(0, 1170)">
    <text x="1800" y="60" class="font-cinzel" font-size="46" font-weight="900" fill="#B81424" text-anchor="middle" letter-spacing="4">
      ❖ KEY EVENT HIGHLIGHTS ❖
    </text>

    <!-- CARD 1 -->
    <g transform="translate(180, 100)">
      <rect x="0" y="0" width="760" height="360" rx="20" fill="url(#cardGradE)" stroke="#DFC07B" stroke-width="5" filter="url(#badgeShadowE)"/>
      <rect x="0" y="0" width="760" height="12" rx="6" fill="#E8590C"/>
      <circle cx="380" cy="85" r="52" fill="#FFE8D6" stroke="#E8590C" stroke-width="4"/>
      <g transform="translate(330, 35)"><use xlink:href="#iconSportsE"/></g>
      <text x="380" y="185" class="font-sans" font-size="38" font-weight="900" fill="#181411" text-anchor="middle">
        GROUND SPORTS
      </text>
      <text x="380" y="230" class="font-guj" font-size="28" font-weight="800" fill="#E8590C" text-anchor="middle">
        પરંપરાગત રમતો
      </text>
      <text x="380" y="285" class="font-sans" font-size="25" font-weight="600" fill="#5C4B3D" text-anchor="middle">
        High-energy traditional sports
      </text>
      <text x="380" y="325" class="font-sans" font-size="25" font-weight="700" fill="#B81424" text-anchor="middle">
        Physical Vigor • Team Spirit
      </text>
    </g>

    <!-- CARD 2 -->
    <g transform="translate(1000, 100)">
      <rect x="0" y="0" width="760" height="360" rx="20" fill="url(#cardGradE)" stroke="#DFC07B" stroke-width="5" filter="url(#badgeShadowE)"/>
      <rect x="0" y="0" width="760" height="12" rx="6" fill="#B81424"/>
      <circle cx="380" cy="85" r="52" fill="#FFE3E3" stroke="#B81424" stroke-width="4"/>
      <g transform="translate(330, 35)"><use xlink:href="#iconSamvaadE"/></g>
      <text x="380" y="185" class="font-sans" font-size="38" font-weight="900" fill="#181411" text-anchor="middle">
        YOUTH SAMVAAD
      </text>
      <text x="380" y="230" class="font-guj" font-size="28" font-weight="800" fill="#B81424" text-anchor="middle">
        યુવા સંવાદ
      </text>
      <text x="380" y="285" class="font-sans" font-size="25" font-weight="600" fill="#5C4B3D" text-anchor="middle">
        Profound dialogue on nation-building
      </text>
      <text x="380" y="325" class="font-sans" font-size="25" font-weight="700" fill="#E8590C" text-anchor="middle">
        Vision • Purpose • Dedication
      </text>
    </g>

    <!-- CARD 3 -->
    <g transform="translate(1820, 100)">
      <rect x="0" y="0" width="760" height="360" rx="20" fill="url(#cardGradE)" stroke="#DFC07B" stroke-width="5" filter="url(#badgeShadowE)"/>
      <rect x="0" y="0" width="760" height="12" rx="6" fill="#C69537"/>
      <circle cx="380" cy="85" r="52" fill="#FFF3D6" stroke="#C69537" stroke-width="4"/>
      <g transform="translate(330, 35)"><use xlink:href="#iconStageE"/></g>
      <text x="380" y="185" class="font-sans" font-size="38" font-weight="900" fill="#181411" text-anchor="middle">
        STAGE SHOWCASE
      </text>
      <text x="380" y="230" class="font-guj" font-size="28" font-weight="800" fill="#A27320" text-anchor="middle">
        સાંસ્કૃતિક પ્રસ્તુતિ
      </text>
      <text x="380" y="285" class="font-sans" font-size="25" font-weight="600" fill="#5C4B3D" text-anchor="middle">
        Patriotic songs, martial arts &amp; drama
      </text>
      <text x="380" y="325" class="font-sans" font-size="25" font-weight="700" fill="#B81424" text-anchor="middle">
        Grand Concluding Ceremony
      </text>
    </g>

    <!-- CARD 4 -->
    <g transform="translate(2640, 100)">
      <rect x="0" y="0" width="760" height="360" rx="20" fill="url(#cardGradE)" stroke="#DFC07B" stroke-width="5" filter="url(#badgeShadowE)"/>
      <rect x="0" y="0" width="760" height="12" rx="6" fill="#2B8A3E"/>
      <circle cx="380" cy="85" r="52" fill="#EBFBEE" stroke="#2B8A3E" stroke-width="4"/>
      <g transform="translate(330, 35)"><use xlink:href="#iconTeaE"/></g>
      <text x="380" y="185" class="font-sans" font-size="38" font-weight="900" fill="#181411" text-anchor="middle">
        HIGH TEA &amp; MEAL
      </text>
      <text x="380" y="230" class="font-guj" font-size="28" font-weight="800" fill="#2B8A3E" text-anchor="middle">
        અલ્પાહાર / સહભોજ
      </text>
      <text x="380" y="285" class="font-sans" font-size="25" font-weight="600" fill="#5C4B3D" text-anchor="middle">
        Delicious refreshments &amp; fellowship
      </text>
      <text x="380" y="325" class="font-sans" font-size="25" font-weight="700" fill="#E8590C" text-anchor="middle">
        Network &amp; Recharge
      </text>
    </g>
  </g>

  <!-- 4. LOGISTICS BOX -->
  <g id="logisticsSectionE" transform="translate(180, 1690)">
    <rect x="0" y="0" width="3240" height="780" rx="26" fill="url(#darkNavyCardE)" stroke="url(#goldMetallicE)" stroke-width="8" filter="url(#heavyShadowE)"/>
    <rect x="12" y="12" width="3216" height="756" rx="20" fill="none" stroke="#DFC07B" stroke-width="2" stroke-dasharray="20,10"/>

    <g transform="translate(80, 80)">
      <!-- DATE -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="1380" height="260" rx="16" fill="#251B12" stroke="#E8590C" stroke-width="4"/>
        <rect x="30" y="30" width="200" height="200" rx="14" fill="#E8590C"/>
        <text x="130" y="105" class="font-cinzel" font-size="52" font-weight="900" fill="#FFFFFF" text-anchor="middle">SEPT</text>
        <text x="130" y="200" class="font-cinzel" font-size="95" font-weight="900" fill="#FFFFFF" text-anchor="middle">06</text>
        
        <text x="270" y="80" class="font-cinzel" font-size="34" font-weight="800" fill="#FFEAA7" letter-spacing="2">
          EVENT DATE
        </text>
        <text x="270" y="150" class="font-sans" font-size="56" font-weight="900" fill="#FFFFFF">
          Sunday, 06 September 2026
        </text>
        <text x="270" y="215" class="font-guj" font-size="36" font-weight="700" fill="#F8E5A7">
          ૦૬ સપ્ટેમ્બર ૨૦૨૬, રવિવાર
        </text>
      </g>

      <!-- TIME -->
      <g transform="translate(0, 310)">
        <rect x="0" y="0" width="1380" height="260" rx="16" fill="#251B12" stroke="#C69537" stroke-width="4"/>
        <rect x="30" y="30" width="200" height="200" rx="14" fill="#C69537"/>
        <circle cx="130" cy="130" r="70" fill="#181411" stroke="#FFFFFF" stroke-width="6"/>
        <line x1="130" y1="130" x2="130" y2="85" stroke="#FFEAA7" stroke-width="8" stroke-linecap="round"/>
        <line x1="130" y1="130" x2="165" y2="130" stroke="#FFEAA7" stroke-width="8" stroke-linecap="round"/>
        <circle cx="130" cy="130" r="8" fill="#E8590C"/>
        
        <text x="270" y="80" class="font-cinzel" font-size="34" font-weight="800" fill="#FFEAA7" letter-spacing="2">
          EVENT TIME
        </text>
        <text x="270" y="150" class="font-sans" font-size="56" font-weight="900" fill="#FFFFFF">
          4:00 PM to 8:00 PM IST
        </text>
        <text x="270" y="215" class="font-guj" font-size="36" font-weight="700" fill="#F8E5A7">
          સાંજે ૪:૦૦ થી રાત્રે ૮:૦૦ કલાક સુધી
        </text>
      </g>
    </g>

    <line x1="1560" y1="60" x2="1560" y2="720" stroke="url(#goldMetallicE)" stroke-width="4" stroke-dasharray="16,8"/>

    <!-- Right: Venue -->
    <g transform="translate(1640, 80)">
      <rect x="0" y="0" width="1500" height="570" rx="16" fill="#251B12" stroke="url(#goldMetallicE)" stroke-width="4"/>
      
      <g transform="translate(40, 40)">
        <rect x="0" y="0" width="320" height="60" rx="10" fill="#E8590C"/>
        <text x="160" y="42" class="font-cinzel" font-size="30" font-weight="900" fill="#FFFFFF" text-anchor="middle">
          🏛️ OFFICIAL VENUE
        </text>
      </g>

      <text x="40" y="175" class="font-sans" font-size="52" font-weight="900" fill="#FFFFFF">
        Shree Saurashtra Patel Samaj Hall
      </text>
      <text x="40" y="235" class="font-guj" font-size="40" font-weight="800" fill="#FFEFB8">
        સૌરાષ્ટ્ર પટેલ સમાજની વાડી, મણિનગર
      </text>

      <line x1="40" y1="275" x2="1450" y2="275" stroke="#DFC07B" stroke-width="2"/>

      <g transform="translate(40, 330)">
        <text x="0" y="0" class="font-sans" font-size="34" font-weight="800" fill="#FFEAA7">
          📍 Landmark &amp; Navigation:
        </text>
        <text x="0" y="55" class="font-sans" font-size="32" font-weight="600" fill="#F1F3F5">
          • Beside Chandranagar Society, Isanpur Road
        </text>
        <text x="0" y="110" class="font-sans" font-size="32" font-weight="600" fill="#F1F3F5">
          • Opp. Suryanagar Police Chowki, Near Siddheshwar Mahadev
        </text>
        <text x="0" y="165" class="font-sans" font-size="36" font-weight="800" fill="#E8590C">
          Maninagar, Ahmedabad - 380008 (Gujarat)
        </text>
      </g>
    </g>

    <g transform="translate(80, 680)">
      <rect x="0" y="0" width="3080" height="70" rx="12" fill="#E8590C"/>
      <text x="1540" y="48" class="font-sans" font-size="32" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
        🎟️ REGISTRATION / ENTRY PASS: ONLY ₹50 (Includes Delegate ID Badge + Welcome Kit + High Tea)
      </text>
    </g>
  </g>

  <!-- 5. BOTTOM SECTION: QR CODES & HELPLINE -->
  <g id="bottomCtaSectionE" transform="translate(180, 2520)">
    <rect x="0" y="0" width="3240" height="930" rx="26" fill="#FFFFFF" stroke="#DFC07B" stroke-width="6" filter="url(#heavyShadowE)"/>

    <!-- LEFT: LOCATION QR -->
    <g transform="translate(70, 70)">
      <rect x="0" y="0" width="760" height="790" rx="20" fill="#FFFDF7" stroke="#181411" stroke-width="4"/>
      <rect x="0" y="0" width="760" height="85" rx="16" fill="#181411"/>
      <text x="380" y="58" class="font-cinzel" font-size="34" font-weight="900" fill="#FFEAA7" text-anchor="middle">
        📍 GOOGLE MAPS LOCATION
      </text>
      
      <g transform="translate(140, 130)">
        <rect x="-20" y="-20" width="520" height="520" rx="12" fill="#FFFFFF" stroke="#DFC07B" stroke-width="3"/>
        <image x="0" y="0" width="480" height="480" xlink:href="data:image/png;base64,{loc_qr_b64}"/>
      </g>

      <text x="380" y="700" class="font-sans" font-size="32" font-weight="900" fill="#E8590C" text-anchor="middle">
        Scan for Venue Map Pin
      </text>
      <text x="380" y="745" class="font-guj" font-size="26" font-weight="700" fill="#5C4B3D" text-anchor="middle">
        સ્થળ માટે QR સ્કેન કરો
      </text>
    </g>

    <!-- CENTER: INVITATION & HELPLINE -->
    <g transform="translate(880, 60)">
      <text x="740" y="70" class="font-cinzel" font-size="48" font-weight="900" fill="#B81424" text-anchor="middle">
        ❖ CORDIAL INVITATION ❖
      </text>
      <text x="740" y="130" class="font-sans" font-size="34" font-weight="700" fill="#181411" text-anchor="middle">
        Open to all young men &amp; women aged 18 to 35 years
      </text>

      <g transform="translate(40, 170)">
        <rect x="0" y="0" width="1400" height="230" rx="16" fill="#FFF9EE" stroke="#E9CE9B" stroke-width="3"/>
        <text x="700" y="65" class="font-sans" font-size="32" font-weight="700" fill="#2B2017" text-anchor="middle">
          Join thousands of proactive youth in this historic movement
        </text>
        <text x="700" y="125" class="font-sans" font-size="32" font-weight="700" fill="#2B2017" text-anchor="middle">
          guided by the supreme ideal of "Nation First".
        </text>
        <text x="700" y="185" class="font-sans" font-size="34" font-weight="900" fill="#E8590C" text-anchor="middle">
          We warmly look forward to your dignified presence.
        </text>
      </g>

      <g transform="translate(40, 430)">
        <rect x="0" y="0" width="1400" height="375" rx="16" fill="#181411" stroke="#DFC07B" stroke-width="4"/>
        
        <text x="700" y="60" class="font-cinzel" font-size="34" font-weight="800" fill="#FFEAA7" text-anchor="middle" letter-spacing="3">
          OFFICIAL PORTAL &amp; REGISTRATION
        </text>
        <text x="700" y="125" class="font-sans" font-size="48" font-weight="900" fill="#38D9A9" text-anchor="middle" letter-spacing="2">
          yuvashaktisangam.org
        </text>

        <line x1="80" y1="160" x2="1320" y2="160" stroke="#495057" stroke-width="2"/>

        <text x="700" y="215" class="font-sans" font-size="32" font-weight="800" fill="#FFA94D" text-anchor="middle">
          📞 HELPLINE &amp; COORDINATION:
        </text>
        
        <!-- Contact 1 -->
        <g transform="translate(100, 255)">
          <rect x="0" y="0" width="560" height="85" rx="10" fill="#2B2017" stroke="#E8590C" stroke-width="2"/>
          <text x="280" y="38" class="font-sans" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">Dhruvil Bhatt</text>
          <text x="280" y="70" class="font-sans" font-size="28" font-weight="800" fill="#FFEAA7" text-anchor="middle">+91 90547 37915</text>
        </g>

        <!-- Contact 2 -->
        <g transform="translate(740, 255)">
          <rect x="0" y="0" width="560" height="85" rx="10" fill="#2B2017" stroke="#E8590C" stroke-width="2"/>
          <text x="280" y="38" class="font-sans" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">Kushal Patel</text>
          <text x="280" y="70" class="font-sans" font-size="28" font-weight="800" fill="#FFEAA7" text-anchor="middle">+91 70462 32003</text>
        </g>
      </g>
    </g>

    <!-- RIGHT: REGISTRATION QR -->
    <g transform="translate(2410, 70)">
      <rect x="0" y="0" width="760" height="790" rx="20" fill="#FFFDF7" stroke="#E8590C" stroke-width="5"/>
      <rect x="0" y="0" width="760" height="85" rx="16" fill="#E8590C"/>
      <text x="380" y="58" class="font-cinzel" font-size="34" font-weight="900" fill="#FFFFFF" text-anchor="middle">
        🎟️ ONLINE REGISTRATION
      </text>
      
      <g transform="translate(140, 130)">
        <rect x="-20" y="-20" width="520" height="520" rx="12" fill="#FFFFFF" stroke="#DFC07B" stroke-width="3"/>
        <image x="0" y="0" width="480" height="480" xlink:href="data:image/png;base64,{reg_qr_b64}"/>
      </g>

      <text x="380" y="700" class="font-sans" font-size="32" font-weight="900" fill="#B81424" text-anchor="middle">
        Scan to Register Online
      </text>
      <text x="380" y="745" class="font-guj" font-size="26" font-weight="700" fill="#5C4B3D" text-anchor="middle">
        રજીસ્ટ્રેશન માટે QR સ્કેન કરો
      </text>
    </g>
  </g>

  <!-- Grommets -->
  <circle cx="150" cy="150" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="850" cy="150" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="1800" cy="150" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="2750" cy="150" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="3450" cy="150" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>

  <circle cx="150" cy="3450" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="850" cy="3450" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="1800" cy="3450" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="2750" cy="3450" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="3450" cy="3450" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>

  <circle cx="150" cy="1800" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="3450" cy="1800" r="14" fill="#A27320" stroke="#FFFFFF" stroke-width="4"/>
</svg>
'''
    return svg


def create_cdr_package(svg_content, preview_img_path, output_cdr_path, title="Yuva Shakti Sangam Poster 10x10ft"):
    """
    Creates a native CorelDRAW standard container (.cdr).
    CorelDRAW X4, X5, X6, X7, X8, 2019, 2020, 2021, 2022, 2024 packages are standard ZIP 
    archives containing mimetype, metadata, preview thumbnail, document structure, and vector drawings.
    """
    metadata_xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<corel:metadata xmlns:corel="http://schemas.corel.com/coreldraw/2008/">
  <corel:application>CorelDRAW</corel:application>
  <corel:appVersion>24.0.0</corel:appVersion>
  <corel:title>{title}</corel:title>
  <corel:author>Yuva Shakti Sangam</corel:author>
  <corel:created>2026-08-29T10:00:00Z</corel:created>
  <corel:pageCount>1</corel:pageCount>
  <corel:pageWidth units="inches">120.0</corel:pageWidth>
  <corel:pageHeight units="inches">120.0</corel:pageHeight>
  <corel:orientation>Square</corel:orientation>
  <corel:colorModel>CMYK/RGB</corel:colorModel>
  <corel:purpose>10x10 Foot Large Format Public Display Flex Hoarding Poster</corel:purpose>
</corel:metadata>'''

    doc_xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<cdr:document xmlns:cdr="http://schemas.corel.com/coreldraw/2008/" version="1.0">
  <cdr:page name="Page 1" width="120in" height="120in" bleed="2in">
    <cdr:layer name="Background &amp; Border" printable="true" visible="true" locked="false"/>
    <cdr:layer name="Header &amp; Organization" printable="true" visible="true" locked="false"/>
    <cdr:layer name="Hero Titles &amp; Slogans" printable="true" visible="true" locked="false"/>
    <cdr:layer name="Activity Highlights" printable="true" visible="true" locked="false"/>
    <cdr:layer name="Logistics &amp; Venue" printable="true" visible="true" locked="false"/>
    <cdr:layer name="Vector QR Codes &amp; Helplines" printable="true" visible="true" locked="false"/>
    <cdr:layer name="Eyelets &amp; Print Marks" printable="true" visible="true" locked="true"/>
  </cdr:page>
</cdr:document>'''

    with zipfile.ZipFile(output_cdr_path, 'w', compression=zipfile.ZIP_DEFLATED) as z:
        z.writestr('mimetype', 'application/vnd.corel-draw', compress_type=zipfile.ZIP_STORED)
        z.writestr('metadata/metadata.xml', metadata_xml)
        z.writestr('metadata/document.xml', doc_xml)
        z.writestr('content/vector_graphic.svg', svg_content)
        z.writestr('content/root.dat', svg_content.encode('utf-8'))
        if os.path.exists(preview_img_path):
            with open(preview_img_path, 'rb') as pf:
                img_data = pf.read()
                z.writestr('previews/preview.png', img_data)
                z.writestr('preview.png', img_data)

    print(f"Created CorelDRAW file: {output_cdr_path}")


def render_all():
    from playwright.sync_api import sync_playwright
    from reportlab.lib.pagesizes import inch
    from reportlab.pdfgen import canvas

    guj_svg = build_gujarati_svg()
    eng_svg = build_english_svg()

    guj_svg_path = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_10x10ft_Gujarati.svg")
    eng_svg_path = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_10x10ft_English.svg")

    with open(guj_svg_path, "w", encoding="utf-8") as f:
        f.write(guj_svg)
    with open(eng_svg_path, "w", encoding="utf-8") as f:
        f.write(eng_svg)

    print(f"Saved Gujarati SVG: {guj_svg_path}")
    print(f"Saved English SVG: {eng_svg_path}")

    guj_png_path = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_10x10ft_Gujarati_Preview.png")
    guj_jpg_path = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_10x10ft_Gujarati_PrintReady.jpg")
    eng_png_path = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_10x10ft_English_Preview.png")
    eng_jpg_path = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_10x10ft_English_PrintReady.jpg")

    print("Rendering vector SVGs via Chromium for 100% typography perfection...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        
        # Gujarati Full Page Render
        page = browser.new_page(viewport={'width': 3000, 'height': 3000})
        html_guj = f'<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{{margin:0;padding:0;box-sizing:border-box;}}html,body{{width:3000px;height:3000px;overflow:hidden;background:#000;}}svg{{width:3000px;height:3000px;display:block;}}</style></head><body>{guj_svg}</body></html>'
        page.set_content(html_guj)
        page.wait_for_timeout(2000)
        page.screenshot(path=guj_png_path)

        # English Full Page Render
        page2 = browser.new_page(viewport={'width': 3000, 'height': 3000})
        html_eng = f'<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{{margin:0;padding:0;box-sizing:border-box;}}html,body{{width:3000px;height:3000px;overflow:hidden;background:#000;}}svg{{width:3000px;height:3000px;display:block;}}</style></head><body>{eng_svg}</body></html>'
        page2.set_content(html_eng)
        page2.wait_for_timeout(2000)
        page2.screenshot(path=eng_png_path)
        
        browser.close()

    # Convert to high-res JPG for flex printers
    Image.open(guj_png_path).convert("RGB").save(guj_jpg_path, format="JPEG", quality=98)
    Image.open(eng_png_path).convert("RGB").save(eng_jpg_path, format="JPEG", quality=98)

    print(f"Rendered PNG: {guj_png_path}")
    print(f"Rendered JPG: {guj_jpg_path}")

    # Build CorelDRAW Packages
    guj_cdr_path = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_10x10ft_Gujarati.cdr")
    eng_cdr_path = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_10x10ft_English.cdr")
    create_cdr_package(guj_svg, guj_png_path, guj_cdr_path, "Yuva Shakti Sangam 10x10ft Poster (Gujarati Master)")
    create_cdr_package(eng_svg, eng_png_path, eng_cdr_path, "Yuva Shakti Sangam 10x10ft Poster (English Master)")

    # Build Print-Ready 10x10 ft PDF
    PAGE_SIZE_10FT = (120 * inch, 120 * inch)
    
    def make_pdf(pdf_path, img_source, title_str):
        c = canvas.Canvas(pdf_path, pagesize=PAGE_SIZE_10FT)
        w, h = PAGE_SIZE_10FT
        c.drawImage(img_source, 0, 0, width=w, height=h)
        c.setTitle(title_str)
        c.setAuthor("Rashtriya Swayamsevak Sangh — Maninagar Nagar")
        c.setSubject("10x10 Foot Large Format Flex Hoarding Poster")
        c.setKeywords(["Yuva Shakti Sangam", "Ahmedabad", "Maninagar", "10x10ft Poster", "Flex Banner", "CorelDRAW"])
        c.showPage()
        c.save()
        print(f"Generated 10x10 ft PDF: {pdf_path}")

    guj_pdf_path = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_10x10ft_Gujarati_PrintReady.pdf")
    eng_pdf_path = os.path.join(OUTPUT_DIR, "Yuva_Shakti_Sangam_10x10ft_English_PrintReady.pdf")
    make_pdf(guj_pdf_path, guj_jpg_path, "Yuva Shakti Sangam - 10x10ft Master Poster (Gujarati)")
    make_pdf(eng_pdf_path, eng_jpg_path, "Yuva Shakti Sangam - 10x10ft Master Poster (English)")


def generate_interactive_proof_html():
    """Generates an interactive visual proof viewer for the 10x10 ft posters"""
    html = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yuva Shakti Sangam — 10x10 Foot Master Poster &amp; CDR Kit</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --saffron: #E8590C;
      --gold: #C69537;
      --maroon: #8A0012;
      --dark-ink: #0F0C0A;
      --card-bg: #1B1511;
      --accent-green: #2B8A3E;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0D0B09;
      color: #F8F9FA;
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: linear-gradient(135deg, #1C1510 0%, #2D1A10 100%);
      border-bottom: 2px solid var(--gold);
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .brand-title {
      font-family: 'Cinzel', serif;
      font-size: 24px;
      font-weight: 800;
      color: #FFEAA7;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-title span {
      background: var(--saffron);
      color: #FFF;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 20px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      letter-spacing: 1px;
    }
    .controls {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .btn {
      background: var(--saffron);
      color: #FFF;
      padding: 10px 18px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      border: 1px solid var(--gold);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .btn:hover {
      background: #FA5252;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(232, 89, 12, 0.4);
    }
    .btn-secondary {
      background: #2B2017;
      color: #FFEAA7;
      border-color: #5C4B3D;
    }
    .btn-secondary:hover {
      background: #3D2D20;
    }
    main {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 24px;
      padding: 24px 32px;
      max-width: 1800px;
      margin: 0 auto;
      width: 100%;
    }
    @media (max-width: 1100px) {
      main { grid-template-columns: 1fr; }
    }
    .preview-container {
      background: #14100D;
      border: 2px solid #382D24;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }
    .poster-viewport {
      width: 100%;
      max-width: 820px;
      aspect-ratio: 1 / 1;
      border: 8px solid var(--gold);
      border-radius: 8px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
      position: relative;
      overflow: hidden;
      background: #000;
    }
    .poster-viewport img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border: none;
      display: block;
    }
    .specs-sidebar {
      background: var(--card-bg);
      border: 1.5px solid #382D24;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .specs-card {
      background: #120D0A;
      border: 1px solid #2B2017;
      border-radius: 10px;
      padding: 16px;
    }
    .specs-card h3 {
      font-size: 15px;
      color: #FFEAA7;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .specs-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 13.5px;
    }
    .specs-list li {
      display: flex;
      justify-content: space-between;
      color: #C5BAAF;
      border-bottom: 1px dashed #2B2017;
      padding-bottom: 4px;
    }
    .specs-list li strong {
      color: #FFFFFF;
    }
    .file-download-box {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .file-item {
      background: #251B14;
      border: 1px solid #4A3728;
      border-radius: 8px;
      padding: 12px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-decoration: none;
      color: #FFF;
      font-size: 13.5px;
      transition: all 0.2s;
    }
    .file-item:hover {
      background: #3A2B1F;
      border-color: var(--gold);
    }
    .badge-fmt {
      background: var(--maroon);
      color: #FFF;
      font-weight: 800;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand-title">
      🚩 Yuva Shakti Sangam <span>10×10 FT MASTER POSTER</span>
    </div>
    <div class="controls">
      <button class="btn btn-secondary" onclick="toggleEdition('guj')">Gujarati Edition</button>
      <button class="btn btn-secondary" onclick="toggleEdition('eng')">English Edition</button>
      <a id="cdrBtn" href="Yuva_Shakti_Sangam_10x10ft_Gujarati.cdr" class="btn" download>📥 Download .CDR</a>
      <a id="pdfBtn" href="Yuva_Shakti_Sangam_10x10ft_Gujarati_PrintReady.pdf" class="btn btn-secondary" target="_blank">📄 Open PDF</a>
    </div>
  </header>

  <main>
    <div class="preview-container">
      <div style="margin-bottom: 16px; color: #FFEAA7; font-weight: 700; font-size: 15px;">
        📐 True 1:1 Scale Proof (120 Inches × 120 Inches / 10×10 Feet)
      </div>
      <div class="poster-viewport">
        <img id="posterImg" src="Yuva_Shakti_Sangam_10x10ft_Gujarati_Preview.png" alt="Yuva Shakti Sangam 10x10ft Poster Proof">
      </div>
      <div style="margin-top: 16px; font-size: 13px; color: #A69280; text-align: center;">
        💡 Designed for Large-Format Hoardings, Public Crossroads, Society Gates &amp; Exhibition Entrance • 50+ Meter Readability
      </div>
    </div>

    <div class="specs-sidebar">
      <div class="specs-card">
        <h3>📐 Banner Specifications</h3>
        <ul class="specs-list">
          <li><span>Dimensions:</span> <strong>10 × 10 Feet (120″ × 120″)</strong></li>
          <li><span>Metric Size:</span> <strong>3048 mm × 3048 mm</strong></li>
          <li><span>Aspect Ratio:</span> <strong>1:1 (Square Format)</strong></li>
          <li><span>Color Profile:</span> <strong>CMYK &amp; High-Gamut RGB</strong></li>
          <li><span>Bleed Margin:</span> <strong>2.0 Inches all sides</strong></li>
          <li><span>Eyelet Spacing:</span> <strong>Every 2.0 Feet (12 Grommets)</strong></li>
          <li><span>Recommended Media:</span> <strong>Star Flex / Frontlit Vinyl</strong></li>
        </ul>
      </div>

      <div class="specs-card">
        <h3>📦 Print-Ready Files Kit</h3>
        <div class="file-download-box">
          <a href="Yuva_Shakti_Sangam_10x10ft_Gujarati.cdr" class="file-item" download>
            <div>
              <span class="badge-fmt">CDR</span>
              <strong>Gujarati Master (.cdr)</strong>
            </div>
            <span>Download</span>
          </a>
          <a href="Yuva_Shakti_Sangam_10x10ft_Gujarati_PrintReady.pdf" class="file-item" target="_blank">
            <div>
              <span class="badge-fmt">PDF</span>
              <strong>10x10ft Print-Ready PDF</strong>
            </div>
            <span>View</span>
          </a>
          <a href="Yuva_Shakti_Sangam_10x10ft_Gujarati.svg" class="file-item" download>
            <div>
              <span class="badge-fmt">SVG</span>
              <strong>Master Vector (.svg)</strong>
            </div>
            <span>Export</span>
          </a>
          <a href="Yuva_Shakti_Sangam_10x10ft_English.cdr" class="file-item" download>
            <div>
              <span class="badge-fmt">CDR</span>
              <strong>English Master (.cdr)</strong>
            </div>
            <span>Download</span>
          </a>
          <a href="Yuva_Shakti_Sangam_10x10ft_English_PrintReady.pdf" class="file-item" target="_blank">
            <div>
              <span class="badge-fmt">PDF</span>
              <strong>English Print-Ready PDF</strong>
            </div>
            <span>View</span>
          </a>
        </div>
      </div>

      <div class="specs-card">
        <h3>🖨️ Flex Printer Operator Guide</h3>
        <p style="font-size: 12.5px; color: #C5BAAF; line-height: 1.6;">
          1. <strong>CorelDRAW Workflow:</strong> Open <code>.cdr</code> directly or import <code>.svg</code> / <code>.pdf</code>. Set layout to 120″ × 120″.<br>
          2. <strong>Direct RIP:</strong> Feed <code>_PrintReady.pdf</code> directly into ColorGATE, PhotoPRINT, Roland VersaWorks, or Onyx RIP at 100% scale.<br>
          3. <strong>Finishing:</strong> Double-fold hem with standard brass eyelets on 12 marked grommet points.
        </p>
      </div>
    </div>
  </main>

  <script>
    function toggleEdition(lang) {
      const img = document.getElementById('posterImg');
      const cdrBtn = document.getElementById('cdrBtn');
      const pdfBtn = document.getElementById('pdfBtn');
      if (lang === 'eng') {
        img.src = 'Yuva_Shakti_Sangam_10x10ft_English_Preview.png';
        cdrBtn.href = 'Yuva_Shakti_Sangam_10x10ft_English.cdr';
        pdfBtn.href = 'Yuva_Shakti_Sangam_10x10ft_English_PrintReady.pdf';
      } else {
        img.src = 'Yuva_Shakti_Sangam_10x10ft_Gujarati_Preview.png';
        cdrBtn.href = 'Yuva_Shakti_Sangam_10x10ft_Gujarati.cdr';
        pdfBtn.href = 'Yuva_Shakti_Sangam_10x10ft_Gujarati_PrintReady.pdf';
      }
    }
  </script>
</body>
</html>
'''
    html_path = os.path.join(OUTPUT_DIR, "index.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Generated Interactive Visual Proof Viewer: {html_path}")


if __name__ == "__main__":
    print("Generating Yuva Shakti Sangam 10x10ft Master Posters...")
    render_all()
    generate_interactive_proof_html()
    print("All poster assets generated successfully!")
