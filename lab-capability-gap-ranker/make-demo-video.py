import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "reports" / "demo.mp4"
TMP = ROOT / "reports" / "video-tmp"

TMP.mkdir(parents=True, exist_ok=True)

slides = [
    {
        "title": "Match the lab first",
        "subtitle": "Interests and project history seed the opportunity feed",
        "body": "Topic, method, and history overlap lift relevant frontier questions",
        "action": "Signal: profile fit",
        "color": "0x166534",
    },
    {
        "title": "Gate on real capability",
        "subtitle": "Methods, instruments, datasets, model systems, time, and budget",
        "body": "Missing MRI, data access, ethics, or budget moves work to partner or hold",
        "action": "Signal: capability fit",
        "color": "0x075985",
    },
    {
        "title": "Rank actionable gaps",
        "subtitle": "Evidence strength and novelty decide the next research bet",
        "body": "The feed emits start-next, partner-first, watchlist, or hold lanes",
        "action": "Output: ranked opportunity feed",
        "color": "0x7c2d12",
    },
]

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/Library/Fonts/Arial.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
]
FONT = next((font for font in FONT_CANDIDATES if Path(font).exists()), None)


def drawtext(text, x, y, size, color="white"):
    escaped = text.replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'")
    parts = []
    if FONT:
        parts.append(f"fontfile='{FONT}'")
    parts.extend([
        f"text='{escaped}'",
        f"x={x}",
        f"y={y}",
        f"fontsize={size}",
        f"fontcolor={color}",
    ])
    return "drawtext=" + ":".join(parts)


segments = []
for index, slide in enumerate(slides):
    segment = TMP / f"segment_{index}.mp4"
    filters = [
        "drawbox=x=48:y=48:w=864:h=444:color=white@0.12:t=fill",
        drawtext("Lab Capability Gap Ranker", 76, 78, 27),
        drawtext(slide["title"], 76, 150, 56),
        drawtext(slide["subtitle"], 80, 230, 31),
        drawtext(slide["body"], 80, 306, 22),
        drawtext(slide["action"], 80, 360, 25),
    ]
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "lavfi",
            "-i",
            f"color=c={slide['color']}:s=960x540:d=3",
            "-vf",
            ",".join(filters),
            "-pix_fmt",
            "yuv420p",
            str(segment),
        ],
        cwd=str(ROOT),
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    segments.append(segment)

concat_file = TMP / "segments.txt"
concat_file.write_text("".join(f"file '{segment}'\n" for segment in segments), encoding="utf-8")

subprocess.run(
    [
        "ffmpeg",
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(concat_file),
        "-c",
        "copy",
        str(OUT),
    ],
    cwd=str(ROOT),
    check=True,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)

for file in TMP.glob("*"):
    file.unlink()
TMP.rmdir()

print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
