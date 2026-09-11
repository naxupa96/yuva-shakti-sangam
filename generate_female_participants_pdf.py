import os
import json
from datetime import datetime
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from supabase import create_client

# Supabase Credentials
SUPABASE_URL = 'https://xoxklwtgbrohierzfztj.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGtsd3RnYnJvaGllcnpmenRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQyMDkyOCwiZXhwIjoyMTAyOTk2OTI4fQ.eK5y07rcNTgHes_t1fIrTp2tUV0WcgZT3qAchgg4RAM'

FEMALE_FIRST_NAMES = set([
    'priya', 'tulsi', 'nishtha', 'aenal', 'jignasa', 'priyanshi', 'maahi', 'yashashvi',
    'khushi', 'vijyalaxmi', 'ila', 'bhavna', 'amita', 'sejal', 'kalpana', 'heli', 'mihika',
    'jhanvi', 'ashlesha', 'dixita', 'mauli', 'jyoti', 'aabha', 'puja', 'ritu', 'shital',
    'vishwa', 'pankti', 'pooja', 'sonal', 'tanya', 'natasa', 'kavya', 'eshita', 'heena',
    'purva', 'krisha', 'varsha', 'jeenal', 'ritika', 'swaraa', 'mahek', 'vishwambhara',
    'bhumika', 'kinjal', 'komal', 'dharitri', 'dhara', 'krutika', 'nirali', 'riddhi',
    'siddhi', 'drasti', 'drashti', 'shivani', 'anjali', 'bansi', 'binal', 'tejal',
    'mittal', 'payal', 'rupal', 'sheetal', 'kinari', 'megha', 'neha', 'sneha', 'kajal',
    'ekta', 'nidhi', 'prachi', 'khushboo', 'aparna', 'tanvi', 'avani', 'raveena', 'disha',
    'roshni', 'gargi', 'ishita', 'dharti', 'vaidehi', 'urvashi', 'palak', 'pratima',
    'shreya', 'charmi', 'bansari', 'forum', 'bhoomi', 'dipti', 'dipali', 'hetal',
    'jayshree', 'geeta', 'nirmala', 'pushpa', 'rekha', 'saroj', 'shanta', 'sharda',
    'usha', 'mamta', 'sunita', 'anita', 'kavita'
])

def extract_gender(p):
    if not p:
        return 'Male'
    g = (p.get('gender') or '').strip().lower()
    if g in ['female', 'f']:
        return 'Female'
    if g in ['male', 'm']:
        return 'Male'
    
    ref = p.get('referral_source') or ''
    if 'Gender:' in ref:
        import re
        m = re.search(r'(?:^|\|\s*)Gender:\s*([^|]+)', ref, re.IGNORECASE)
        if m and m.group(1):
            val = m.group(1).strip().lower()
            if val.startswith('f'):
                return 'Female'
            if val.startswith('m'):
                return 'Male'
    
    name = (p.get('name') or '').strip()
    if not name:
        return 'Male'
    
    words = [w for w in name.lower().replace('.', ' ').split() if w]
    for w in words:
        if w in FEMALE_FIRST_NAMES:
            return 'Female'
        if w.endswith('ben') or (len(w) > 3 and w.endswith('ba')):
            return 'Female'
    return 'Male'

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#78350F"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(36, 562, "YUVA SHAKTI SANGAM  |  Registered Female Participants Directory")
            self.setStrokeColor(colors.HexColor("#E5D5C5"))
            self.setLineWidth(0.75)
            self.line(36, 555, 806, 555)

        # Footer
        self.setStrokeColor(colors.HexColor("#E5D5C5"))
        self.setLineWidth(0.75)
        self.line(36, 32, 806, 32)
        
        gen_date = datetime.now().strftime("%d %B %Y, %I:%M %p")
        self.drawString(36, 20, f"Generated: {gen_date}  |  Official Record  |  Confidential")
        self.drawRightString(806, 20, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf():
    print("Fetching participants from Supabase...")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    res = supabase.from_('participants').select('*').order('registration_id', desc=False).execute()
    participants = res.data or []
    
    females = [p for p in participants if extract_gender(p) == 'Female']
    print(f"Total Females found: {len(females)}")
    
    total_females = len(females)
    checked_in_count = sum(1 for p in females if p.get('checked_in'))
    paid_count = sum(1 for p in females if (p.get('payment_status') or '').lower() == 'paid')
    pending_count = total_females - paid_count

    pdf_filename = "Registered_Female_Participants_Yuva_Shakti_Sangam.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=landscape(A4),
        leftMargin=36,
        rightMargin=36,
        topMargin=40,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()

    # Custom typography
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#9A3412'), # Rich saffron / rust
        spaceAfter=2
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#431407'),
        spaceAfter=8
    )

    cell_style = ParagraphStyle(
        'CellText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#1C1917')
    )

    cell_bold_style = ParagraphStyle(
        'CellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#1C1917')
    )

    cell_id_style = ParagraphStyle(
        'CellID',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#9A3412')
    )

    header_cell_style = ParagraphStyle(
        'HeaderCell',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#FAF4EC'),
        alignment=1 # Center
    )

    badge_paid_style = ParagraphStyle(
        'BadgePaid',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor('#166534'),
        alignment=1
    )

    badge_pending_style = ParagraphStyle(
        'BadgePending',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor('#991B1B'),
        alignment=1
    )

    badge_checked_style = ParagraphStyle(
        'BadgeChecked',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor('#15803D'),
        alignment=1
    )

    badge_notchecked_style = ParagraphStyle(
        'BadgeNotChecked',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor('#6B7280'),
        alignment=1
    )

    elements = []

    # Title & Subtitle
    elements.append(Paragraph("YUVA SHAKTI SANGAM", title_style))
    elements.append(Paragraph("DIRECTORY OF REGISTERED FEMALE PARTICIPANTS", subtitle_style))

    # Metrics Summary Bar
    stat_box_data = [
        [
            Paragraph(f"<b>Total Registered Females:</b> <font color='#9A3412'>{total_females}</font>", cell_style),
            Paragraph(f"<b>Checked In:</b> <font color='#15803D'>{checked_in_count}</font> ({(checked_in_count/total_females*100):.1f}%)", cell_style),
            Paragraph(f"<b>Paid Status:</b> <font color='#166534'>{paid_count} Paid</font> | <font color='#991B1B'>{pending_count} Pending</font>", cell_style),
            Paragraph(f"<b>Event Date:</b> 6 September 2026", cell_style),
        ]
    ]
    stat_table = Table(stat_box_data, colWidths=[200, 180, 210, 180])
    stat_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FFF7ED')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#FDBA74')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(stat_table)
    elements.append(Spacer(1, 10))

    # Table columns:
    # 1. Sr (25pt)
    # 2. Registration ID (80pt)
    # 3. Full Name (145pt)
    # 4. Mobile Number (75pt)
    # 5. Age (30pt)
    # 6. City (75pt)
    # 7. College / Institution (140pt)
    # 8. Payment (65pt)
    # 9. Checked In (70pt)
    # Total width = 25+80+145+75+30+75+140+65+70 = 705pt + margins = fits 770pt printable width on A4 landscape (842pt wide - 72pt margins = 770pt)
    # Let's adjust to exactly 770 pt:
    # 25 + 90 + 160 + 85 + 32 + 85 + 155 + 68 + 70 = 770 pt!
    col_widths = [25, 90, 160, 85, 32, 85, 155, 68, 70]

    headers = [
        Paragraph("<b>#</b>", header_cell_style),
        Paragraph("<b>Reg. ID</b>", header_cell_style),
        Paragraph("<b>Full Name</b>", header_cell_style),
        Paragraph("<b>Mobile No.</b>", header_cell_style),
        Paragraph("<b>Age</b>", header_cell_style),
        Paragraph("<b>City</b>", header_cell_style),
        Paragraph("<b>College / Institution</b>", header_cell_style),
        Paragraph("<b>Payment</b>", header_cell_style),
        Paragraph("<b>Checked In</b>", header_cell_style),
    ]

    table_data = [headers]

    for idx, p in enumerate(females, 1):
        reg_id = p.get('registration_id') or ''
        name = (p.get('name') or '').strip()
        phone = (p.get('phone') or '').strip()
        age = str(p.get('age') or '-')
        city = (p.get('city') or '').strip()
        college = (p.get('college') or '').strip()
        if not college:
            college = '-'
        is_paid = (p.get('payment_status') or '').lower() == 'paid'
        is_checked_in = bool(p.get('checked_in'))

        pay_p = Paragraph("PAID" if is_paid else "PENDING", badge_paid_style if is_paid else badge_pending_style)
        check_p = Paragraph("YES" if is_checked_in else "NO", badge_checked_style if is_checked_in else badge_notchecked_style)

        row = [
            Paragraph(str(idx), cell_style),
            Paragraph(reg_id, cell_id_style),
            Paragraph(name, cell_bold_style),
            Paragraph(phone, cell_style),
            Paragraph(age, cell_style),
            Paragraph(city, cell_style),
            Paragraph(college, cell_style),
            pay_p,
            check_p,
        ]
        table_data.append(row)

    main_table = Table(table_data, colWidths=col_widths, repeatRows=1)
    
    t_style = [
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#7C2D12')), # Deep amber/rust header
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('ALIGN', (4, 0), (4, -1), 'CENTER'),
        ('ALIGN', (7, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5D5C5')),
    ]

    for r in range(1, len(table_data)):
        if r % 2 == 0:
            t_style.append(('BACKGROUND', (0, r), (-1, r), colors.HexColor('#FDFBF7'))) # Subtle warm alternating row
        else:
            t_style.append(('BACKGROUND', (0, r), (-1, r), colors.white))

    main_table.setStyle(TableStyle(t_style))
    elements.append(main_table)

    doc.build(elements, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {pdf_filename} with {len(females)} female records.")

if __name__ == "__main__":
    build_pdf()
