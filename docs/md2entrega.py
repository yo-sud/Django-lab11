"""Convierte docs/ENTREGA_SEMANA_11.md a DOCX y PDF sin dependencias externas de red.

Uso:
    C:\\Python313\\python.exe md2entrega.py
"""

from __future__ import annotations

import re
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor
from fpdf import FPDF

DEST = Path(__file__).resolve().parent
ROOT = DEST.parent
SOURCE = DEST / "ENTREGA_SEMANA_11.md"
DOCX_OUT = ROOT / "docs" / "ENTREGA_SEMANA_11.docx"
PDF_OUT = ROOT / "docs" / "ENTREGA_SEMANA_11.pdf"

BOLD_RE = re.compile(r"\*\*(.+?)\*\*")
CODE_RE = re.compile(r"`([^`]+)`")
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")


def strip_inline(text: str) -> str:
    text = LINK_RE.sub(r"\1 (\2)", text)
    text = BOLD_RE.sub(r"\1", text)
    text = CODE_RE.sub(r"\1", text)
    return text


def parse_markdown(text: str):
    """Devuelve una lista de bloques: ('h', level, txt), ('p', txt), ('ul', txt),
    ('ol', txt), ('code', txt), ('table', rows)."""
    lines = text.splitlines()
    blocks = []
    i = 0
    in_code = False
    code_lines: list[str] = []

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith("```"):
            if in_code:
                blocks.append(("code", "\n".join(code_lines)))
                code_lines = []
                in_code = False
            else:
                in_code = True
            i += 1
            continue
        if in_code:
            code_lines.append(line)
            i += 1
            continue

        if not stripped:
            i += 1
            continue

        if stripped in {"---", "***", "___"}:
            blocks.append(("rule", ""))
            i += 1
            continue

        heading = re.match(r"^(#{1,4})\s+(.*)$", stripped)
        if heading:
            blocks.append(("h", len(heading.group(1)), heading.group(2)))
            i += 1
            continue

        if stripped.startswith("|") and i + 1 < len(lines):
            sep = lines[i + 1].strip()
            if re.match(r"^\|[\s:\-|]+\|$", sep):
                rows = []
                header = [c.strip() for c in stripped.strip("|").split("|")]
                rows.append(header)
                i += 2
                while i < len(lines) and lines[i].strip().startswith("|"):
                    cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                    rows.append(cells)
                    i += 1
                blocks.append(("table", rows))
                continue

        bullet = re.match(r"^[-*]\s+(.*)$", stripped)
        if bullet:
            blocks.append(("ul", bullet.group(1)))
            i += 1
            continue

        numbered = re.match(r"^\d+\.\s+(.*)$", stripped)
        if numbered:
            blocks.append(("ol", numbered.group(1)))
            i += 1
            continue

        # Párrafo: unir líneas consecutivas que no sean otro bloque
        paragraph = [stripped]
        i += 1
        while i < len(lines):
            nxt = lines[i].strip()
            if (
                not nxt
                or nxt.startswith("#")
                or nxt.startswith("|")
                or nxt.startswith("- ")
                or nxt.startswith("* ")
                or re.match(r"^\d+\.\s+", nxt)
                or nxt.startswith("```")
                or nxt in {"---", "***", "___"}
            ):
                break
            paragraph.append(nxt)
            i += 1
        blocks.append(("p", " ".join(paragraph)))

    if in_code and code_lines:
        blocks.append(("code", "\n".join(code_lines)))
    return blocks


def add_runs(paragraph, text: str, base_size=None, mono=False):
    """Agrega runs con negrita y código inline a un párrafo de python-docx."""
    pattern = re.compile(r"(\*\*.+?\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))")
    pos = 0
    for match in pattern.finditer(text):
        if match.start() > pos:
            run = paragraph.add_run(text[pos : match.start()])
            if base_size:
                run.font.size = Pt(base_size)
            if mono:
                run.font.name = "Consolas"
        token = match.group(0)
        if token.startswith("**"):
            run = paragraph.add_run(token[2:-2])
            run.bold = True
        elif token.startswith("`"):
            run = paragraph.add_run(token[1:-1])
            run.font.name = "Consolas"
            run.font.size = Pt((base_size or 11) - 1)
        else:
            link = LINK_RE.match(token)
            run = paragraph.add_run(f"{link.group(1)} ({link.group(2)})")
            run.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)
            run.underline = True
        if base_size and token.startswith("**"):
            run.font.size = Pt(base_size)
        pos = match.end()
    if pos < len(text):
        run = paragraph.add_run(text[pos:])
        if base_size:
            run.font.size = Pt(base_size)
        if mono:
            run.font.name = "Consolas"


def shade(cell, color: str):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), color)
    tc_pr.append(shd)


def build_docx(blocks):
    doc = Document()
    section = doc.sections[0]
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.8)
    section.top_margin = Inches(0.7)
    section.bottom_margin = Inches(0.7)

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10.5)

    for block in blocks:
        kind = block[0]
        if kind == "h":
            _, level, text = block
            paragraph = doc.add_heading(level=min(level, 4))
            add_runs(paragraph, text)
            for run in paragraph.runs:
                run.font.color.rgb = RGBColor(0x11, 0x1B, 0x33)
            paragraph.paragraph_format.space_before = Pt(14)
            paragraph.paragraph_format.space_after = Pt(6)
        elif kind == "p":
            paragraph = doc.add_paragraph()
            add_runs(paragraph, block[1])
            paragraph.paragraph_format.space_after = Pt(6)
            paragraph.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        elif kind == "ul":
            paragraph = doc.add_paragraph(style="List Bullet")
            add_runs(paragraph, block[1])
            paragraph.paragraph_format.space_after = Pt(2)
        elif kind == "ol":
            paragraph = doc.add_paragraph(style="List Number")
            add_runs(paragraph, block[1])
            paragraph.paragraph_format.space_after = Pt(2)
        elif kind == "code":
            paragraph = doc.add_paragraph()
            run = paragraph.add_run(block[1])
            run.font.name = "Consolas"
            run.font.size = Pt(8)
            paragraph.paragraph_format.left_indent = Inches(0.2)
            paragraph.paragraph_format.space_before = Pt(4)
            paragraph.paragraph_format.space_after = Pt(8)
            p_pr = paragraph._p.get_or_add_pPr()
            shd = OxmlElement("w:shd")
            shd.set(qn("w:val"), "clear")
            shd.set(qn("w:color"), "auto")
            shd.set(qn("w:fill"), "F2F3F5")
            p_pr.append(shd)
        elif kind == "table":
            rows = block[1]
            cols = max(len(r) for r in rows)
            table = doc.add_table(rows=0, cols=cols)
            table.style = "Table Grid"
            table.alignment = WD_TABLE_ALIGNMENT.CENTER
            for r_idx, row in enumerate(rows):
                cells = table.add_row().cells
                for c_idx in range(cols):
                    value = row[c_idx] if c_idx < len(row) else ""
                    cell = cells[c_idx]
                    cell.text = ""
                    paragraph = cell.paragraphs[0]
                    add_runs(paragraph, value, base_size=8.5)
                    paragraph.paragraph_format.space_after = Pt(1)
                    if r_idx == 0:
                        for run in paragraph.runs:
                            run.bold = True
                        shade(cell, "E7EAF0")
            doc.add_paragraph().paragraph_format.space_after = Pt(2)
        elif kind == "rule":
            doc.add_paragraph().paragraph_format.space_after = Pt(2)

    doc.save(DOCX_OUT)
    print(f"DOCX: {DOCX_OUT}")


class PDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Arial", "", 8)
        self.set_text_color(120, 120, 120)
        self.cell(130, 5, "Cine Plus - Laboratorio 11 - Hooks del agente", align="L")
        self.cell(0, 5, f"Pagina {self.page_no()}", align="R")
        self.ln(6)
        self.set_text_color(0, 0, 0)

    def footer(self):
        self.set_y(-12)
        self.set_font("Arial", "", 7.5)
        self.set_text_color(140, 140, 140)
        self.cell(0, 5, "https://github.com/yo-sud/Django-lab11", align="C")


def build_pdf(blocks):
    pdf = PDF(format="A4")
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.set_margins(15, 15, 15)
    pdf.add_font("Arial", "", r"C:\Windows\Fonts\arial.ttf")
    pdf.add_font("Arial", "B", r"C:\Windows\Fonts\arialbd.ttf")
    pdf.add_font("Consolas", "", r"C:\Windows\Fonts\consola.ttf")
    pdf.add_font("Consolas", "B", r"C:\Windows\Fonts\consolab.ttf")
    pdf.add_page()

    width = pdf.epw

    for block in blocks:
        kind = block[0]
        if kind == "h":
            _, level, text = block
            sizes = {1: 20, 2: 14.5, 3: 12, 4: 11}
            pdf.ln(3 if level > 1 else 1)
            pdf.set_font("Arial", "B", sizes.get(level, 11))
            pdf.set_text_color(17, 27, 51)
            pdf.multi_cell(width, sizes.get(level, 11) * 0.5, strip_inline(text))
            pdf.ln(1.5)
            pdf.set_text_color(0, 0, 0)
        elif kind == "p":
            pdf.set_font("Arial", "", 9.5)
            pdf.multi_cell(width, 5.1, strip_inline(block[1]))
            pdf.ln(1.8)
        elif kind == "ul":
            pdf.set_font("Arial", "", 9.5)
            pdf.set_x(20)
            pdf.multi_cell(width - 5, 5.0, f"- {strip_inline(block[1])}")
            pdf.set_x(15)
        elif kind == "ol":
            pdf.set_font("Arial", "", 9.5)
            pdf.set_x(20)
            pdf.multi_cell(width - 5, 5.0, f"* {strip_inline(block[1])}")
            pdf.set_x(15)
        elif kind == "code":
            pdf.set_font("Consolas", "", 7.6)
            pdf.set_fill_color(243, 244, 246)
            pdf.multi_cell(width, 4.0, block[1], fill=True)
            pdf.ln(2.5)
        elif kind == "table":
            rows = block[1]
            cols = max(len(r) for r in rows)
            usable = width
            col_width = usable / cols
            pdf.set_font("Arial", "", 7.6)
            pdf.ln(1)
            for r_idx, row in enumerate(rows):
                values = [strip_inline(row[c]) if c < len(row) else "" for c in range(cols)]
                # Altura por la celda más alta
                heights = []
                for value in values:
                    lines = pdf.multi_cell(col_width, 3.9, value, dry_run=True, output="LINES")
                    heights.append(len(lines) * 3.9 + 1.6)
                row_h = max(heights)
                if pdf.get_y() + row_h > pdf.page_break_trigger:
                    pdf.add_page()
                x = pdf.l_margin
                y = pdf.get_y()
                for value in values:
                    pdf.set_xy(x, y)
                    if r_idx == 0:
                        pdf.set_fill_color(231, 234, 240)
                        pdf.set_font("Arial", "B", 7.6)
                    else:
                        pdf.set_fill_color(255, 255, 255)
                        pdf.set_font("Arial", "", 7.6)
                    pdf.multi_cell(col_width, 3.9, value, border=1, fill=True, align="L")
                    x += col_width
                pdf.set_xy(pdf.l_margin, y + row_h)
            pdf.ln(3)
        elif kind == "rule":
            pdf.ln(1)
            pdf.set_draw_color(200, 200, 200)
            pdf.line(15, pdf.get_y(), 195, pdf.get_y())
            pdf.ln(3)

    pdf.output(str(PDF_OUT))
    print(f"PDF: {PDF_OUT}")


def main():
    text = SOURCE.read_text(encoding="utf-8")
    blocks = parse_markdown(text)
    build_docx(blocks)
    build_pdf(blocks)


if __name__ == "__main__":
    main()
