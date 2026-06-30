import re
import struct
import zipfile
from pathlib import Path


path = Path("updated_report.docx")
with zipfile.ZipFile(path) as docx:
    names = docx.namelist()
    media = [name for name in names if name.startswith("word/media/")]
    document = docx.read("word/document.xml").decode("utf-8")
    rels = docx.read("word/_rels/document.xml.rels").decode("utf-8")

    extents = [
        tuple(map(int, match))
        for match in re.findall(r'<wp:extent cx="(\d+)" cy="(\d+)"/>', document)
    ]

    print(f"docx entries = {len(names)}")
    print(f"media files = {len(media)}")
    print(f"image extents = {len(extents)}")
    print(f"image relationships = {rels.count('Relationship Id=\"rIdImage')}")

    ok = len(media) == len(extents)
    for index, (media_name, (cx, cy)) in enumerate(zip(media, extents), start=1):
        data = docx.read(media_name)
        width, height = struct.unpack(">II", data[16:24])
        source_aspect = width / height
        placed_aspect = cx / cy
        aspect_delta = abs(source_aspect - placed_aspect)
        fits_page = cx <= 5669280 and cy <= 7315200
        ok = ok and aspect_delta < 0.001 and fits_page
        print(
            f"{index}: {media_name} source={width}x{height} "
            f"placed_emu={cx}x{cy} aspect_delta={aspect_delta:.6f} fits_page={fits_page}"
        )

    print(f"image sizing ok = {ok}")
