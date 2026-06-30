from __future__ import annotations

import html
import os
import re
import shutil
import struct
import zipfile
from pathlib import Path


BASE = Path(__file__).resolve().parent
OUT_FILE = BASE / "updated_report.docx"
WORK_DIR = BASE / ".docx_build"

FILES = [
    "main_report.md",
    "feature_A_FR04_profile.md",
    "feature_B_FR08_checkout.md",
    "feature_C_FR18_admin_order_management.md",
    "feature_D_mobile_selected.md",
    "bug_report.md",
]

MAX_CX = 5669280
MAX_CY = 7315200

body: list[str] = []
rels: list[str] = []
image_index = 0


def xml(text: str | None) -> str:
    return html.escape(text or "", quote=True)


def clean_inline(text: str) -> str:
    text = text.replace("<br>", "; ")
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1 (\2)", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    return text.strip()


def add_paragraph(text: str, style: str = "") -> None:
    text = clean_inline(text)
    if not text:
        return
    if style:
        body.append(
            f'<w:p><w:pPr><w:pStyle w:val="{style}"/></w:pPr>'
            f'<w:r><w:t xml:space="preserve">{xml(text)}</w:t></w:r></w:p>'
        )
    else:
        body.append(f'<w:p><w:r><w:t xml:space="preserve">{xml(text)}</w:t></w:r></w:p>')


def add_code(text: str) -> None:
    body.append(
        '<w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>'
        '<w:r><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/>'
        f'<w:sz w:val="18"/></w:rPr><w:t xml:space="preserve">{xml(text)}</w:t></w:r></w:p>'
    )


def add_table(lines: list[str]) -> None:
    rows: list[list[str]] = []
    separator = re.compile(r"^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$")
    for line in lines:
        if separator.match(line):
            continue
        trimmed = line.strip()
        if trimmed.startswith("|"):
            trimmed = trimmed[1:]
        if trimmed.endswith("|"):
            trimmed = trimmed[:-1]
        rows.append(trimmed.split("|"))
    if not rows:
        return

    parts = [
        '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/>'
        '<w:tblBorders>'
        '<w:top w:val="single" w:sz="4" w:space="0" w:color="999999"/>'
        '<w:left w:val="single" w:sz="4" w:space="0" w:color="999999"/>'
        '<w:bottom w:val="single" w:sz="4" w:space="0" w:color="999999"/>'
        '<w:right w:val="single" w:sz="4" w:space="0" w:color="999999"/>'
        '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="999999"/>'
        '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="999999"/>'
        '</w:tblBorders></w:tblPr>'
    ]
    for row in rows:
        parts.append("<w:tr>")
        for cell in row:
            cell_text = xml(clean_inline(cell))
            parts.append(
                '<w:tc><w:tcPr><w:tcW w:w="2200" w:type="dxa"/></w:tcPr>'
                f'<w:p><w:r><w:t xml:space="preserve">{cell_text}</w:t></w:r></w:p></w:tc>'
            )
        parts.append("</w:tr>")
    parts.append("</w:tbl>")
    body.append("".join(parts))


def png_size(path: Path) -> tuple[int, int]:
    with path.open("rb") as f:
        header = f.read(24)
    if header[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"Unsupported image format: {path}")
    return struct.unpack(">II", header[16:24])


def add_image(relative_path: str, alt_text: str) -> None:
    global image_index
    source = BASE / relative_path
    if not source.exists():
        add_paragraph(f"Missing image: {relative_path}")
        return

    image_index += 1
    rid = f"rIdImage{image_index}"
    target_name = f"image{image_index}.png"
    shutil.copyfile(source, WORK_DIR / "word" / "media" / target_name)
    rels.append(
        f'<Relationship Id="{rid}" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" '
        f'Target="media/{target_name}"/>'
    )

    width, height = png_size(source)
    cx = width * 9525
    cy = height * 9525
    scale = min(MAX_CX / cx, MAX_CY / cy, 1)
    cx = int(cx * scale)
    cy = int(cy * scale)
    descr = xml(alt_text)

    body.append(
        '<w:p><w:r><w:drawing>'
        '<wp:inline distT="0" distB="0" distL="0" distR="0" '
        'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">'
        f'<wp:extent cx="{cx}" cy="{cy}"/>'
        f'<wp:docPr id="{image_index}" name="Picture {image_index}" descr="{descr}"/>'
        '<wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1" '
        'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/></wp:cNvGraphicFramePr>'
        '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
        '<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
        '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">'
        f'<pic:nvPicPr><pic:cNvPr id="{image_index}" name="{target_name}"/><pic:cNvPicPr/></pic:nvPicPr>'
        f'<pic:blipFill><a:blip r:embed="{rid}" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>'
        '<a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
        f'<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm>'
        '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>'
        '</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>'
    )


def convert_markdown_file(file_name: str) -> None:
    add_paragraph(file_name, "Heading1")
    lines = (BASE / file_name).read_text(encoding="utf-8").splitlines()
    table_lines: list[str] = []
    in_code = False

    for line in lines:
        if line.strip().startswith("```"):
            if table_lines:
                add_table(table_lines)
                table_lines = []
            in_code = not in_code
            continue

        if in_code:
            add_code(line)
            continue

        if re.match(r"^\s*\|.*\|\s*$", line):
            table_lines.append(line)
            continue
        if table_lines:
            add_table(table_lines)
            table_lines = []

        image_match = re.match(r"^!\[(.*)\]\((.*)\)\s*$", line)
        heading_match = re.match(r"^(#{1,6})\s+(.*)$", line)
        bullet_match = re.match(r"^\s*[-*]\s+(.*)$", line)

        if image_match:
            add_image(image_match.group(2), image_match.group(1))
        elif heading_match:
            level = min(len(heading_match.group(1)), 3)
            add_paragraph(heading_match.group(2), f"Heading{level}")
        elif bullet_match:
            add_paragraph("- " + bullet_match.group(1))
        elif re.match(r"^\s*\d+\.\s+", line):
            add_paragraph(line.strip())
        elif line.strip():
            add_paragraph(line)

    if table_lines:
        add_table(table_lines)


def write_docx() -> None:
    if WORK_DIR.exists():
        resolved = WORK_DIR.resolve()
        if BASE.resolve() not in resolved.parents:
            raise RuntimeError(f"Refusing to remove unexpected path: {resolved}")
        shutil.rmtree(WORK_DIR)
    (WORK_DIR / "_rels").mkdir(parents=True)
    (WORK_DIR / "word" / "_rels").mkdir(parents=True)
    (WORK_DIR / "word" / "media").mkdir(parents=True)

    for file_name in FILES:
        convert_markdown_file(file_name)

    document_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f'<w:body>{"".join(body)}'
        '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/>'
        '<w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" '
        'w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>'
        '</w:body></w:document>'
    )
    (WORK_DIR / "word" / "document.xml").write_text(document_xml, encoding="utf-8")

    doc_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        f'{"".join(rels)}</Relationships>'
    )
    (WORK_DIR / "word" / "_rels" / "document.xml.rels").write_text(doc_rels, encoding="utf-8")

    root_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
        'Target="word/document.xml"/></Relationships>'
    )
    (WORK_DIR / "_rels" / ".rels").write_text(root_rels, encoding="utf-8")

    content_types = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Default Extension="png" ContentType="image/png"/>'
        '<Override PartName="/word/document.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
        '</Types>'
    )
    (WORK_DIR / "[Content_Types].xml").write_text(content_types, encoding="utf-8")

    if OUT_FILE.exists():
        OUT_FILE.unlink()
    with zipfile.ZipFile(OUT_FILE, "w", zipfile.ZIP_DEFLATED) as docx:
        for root, _, files in os.walk(WORK_DIR):
            for file in files:
                path = Path(root) / file
                docx.write(path, path.relative_to(WORK_DIR).as_posix())

    print(f"Created {OUT_FILE}")
    print(f"Embedded images: {image_index}")


if __name__ == "__main__":
    write_docx()
