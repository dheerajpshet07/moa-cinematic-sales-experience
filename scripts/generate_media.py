from __future__ import annotations

import math
import os
import random
import shutil
import subprocess
from pathlib import Path
from typing import Iterable, Tuple

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "public" / "media"
FRAMES = MEDIA / "frames"

WIDE = (1600, 1060)
VIDEO = (1280, 720)


def lerp(a: int, b: int, t: float) -> int:
    return int(a + (b - a) * t)


def gradient(size: Tuple[int, int], stops: Iterable[Tuple[float, Tuple[int, int, int]]]) -> Image.Image:
    width, height = size
    stop_list = sorted(stops, key=lambda item: item[0])
    img = Image.new("RGB", size)
    px = img.load()
    for y in range(height):
      p = y / max(height - 1, 1)
      left = stop_list[0]
      right = stop_list[-1]
      for index in range(len(stop_list) - 1):
          if stop_list[index][0] <= p <= stop_list[index + 1][0]:
              left = stop_list[index]
              right = stop_list[index + 1]
              break
      span = max(right[0] - left[0], 0.001)
      local = (p - left[0]) / span
      color = tuple(lerp(left[1][c], right[1][c], local) for c in range(3))
      for x in range(width):
          px[x, y] = color
    return img


def glow(base: Image.Image, center: Tuple[int, int], radius: int, color: Tuple[int, int, int], alpha: int) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    cx, cy = center
    for step in range(12, 0, -1):
        r = radius * step / 12
        a = int(alpha * (step / 12) ** 2)
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(*color, a))
    layer = layer.filter(ImageFilter.GaussianBlur(radius / 6))
    base.alpha_composite(layer)


def beams(base: Image.Image, colors: list[Tuple[int, int, int]], drift: float = 0.0) -> None:
    width, height = base.size
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer, "RGBA")
    for index, color in enumerate(colors):
        x = int(width * (0.2 + 0.16 * index + math.sin(drift + index) * 0.035))
        draw.polygon(
            [
                (x, int(height * 0.02)),
                (x + int(width * 0.06), int(height * 0.02)),
                (x + int(width * (0.21 + index * 0.015)), height),
                (x - int(width * (0.16 - index * 0.01)), height),
            ],
            fill=(*color, 34),
        )
    layer = layer.filter(ImageFilter.GaussianBlur(18))
    base.alpha_composite(layer)


def draw_atrium(base: Image.Image, accent: Tuple[int, int, int], mode: str, phase: float = 0.0) -> None:
    width, height = base.size
    draw = ImageDraw.Draw(base, "RGBA")
    cx = width // 2
    horizon = int(height * 0.36)

    for i in range(9):
        y = horizon + i * int(height * 0.055)
        span = int(width * (0.18 + i * 0.085))
        draw.line((cx - span, y, cx + span, y), fill=(255, 240, 205, 24 + i * 3), width=2)

    for side in [-1, 1]:
        for i in range(11):
            x0 = cx + side * int(width * (0.13 + i * 0.043))
            x1 = cx + side * int(width * (0.29 + i * 0.065))
            draw.line((x0, horizon, x1, height), fill=(255, 255, 255, 18), width=2)

    for floor in range(4):
        y = int(height * (0.48 + floor * 0.095))
        box = (
            int(width * (0.22 - floor * 0.035)),
            y,
            int(width * (0.78 + floor * 0.035)),
            y + int(height * (0.17 + floor * 0.025)),
        )
        draw.arc(box, start=0, end=180, fill=(*accent, 86 - floor * 9), width=5)
        draw.arc((box[0] + 18, box[1] + 12, box[2] - 18, box[3] + 18), start=0, end=180, fill=(255, 255, 255, 35), width=2)

    for i in range(54):
        side = -1 if i % 2 == 0 else 1
        depth = i // 2
        x = cx + side * int(width * (0.2 + (depth % 14) * 0.035))
        y = int(height * (0.43 + (depth % 12) * 0.038))
        w = int(width * (0.024 + (depth % 3) * 0.006))
        h = int(height * (0.042 + (depth % 4) * 0.008))
        color = (28, 24, 20, 210)
        draw.rounded_rectangle((x - w, y, x + w, y + h), radius=5, fill=color, outline=(*accent, 42), width=1)
        if i % 3 == 0:
            draw.rectangle((x - w + 5, y + 5, x + w - 5, y + 9), fill=(*accent, 82))

    if mode in {"events", "sponsor", "hero"}:
        stage_y = int(height * 0.51)
        draw.rounded_rectangle(
            (int(width * 0.36), stage_y, int(width * 0.64), stage_y + int(height * 0.075)),
            radius=8,
            fill=(8, 8, 9, 220),
            outline=(*accent, 120),
            width=2,
        )
        for i in range(210 if mode == "hero" else 160):
            angle = (i * 137.5 + phase * 40) * math.pi / 180
            radius = (0.035 + (i % 21) * 0.006) * width
            x = int(cx + math.cos(angle) * radius * 1.25)
            y = int(height * 0.68 + math.sin(angle) * radius * 0.52 + (i % 5) * 2)
            draw.ellipse((x - 2, y - 2, x + 2, y + 2), fill=(246, 242, 234, 58 + (i % 5) * 10))

    if mode == "dining":
        for i in range(18):
            x = int(width * (0.18 + (i % 6) * 0.13))
            y = int(height * (0.58 + (i // 6) * 0.09))
            draw.ellipse((x - 38, y - 16, x + 38, y + 16), fill=(255, 232, 178, 46), outline=(*accent, 76))
            draw.rectangle((x - 4, y - 2, x + 4, y + 48), fill=(120, 70, 44, 120))

    if mode == "attractions":
        for i in range(3):
            box = (
                int(width * (0.25 + i * 0.14)),
                int(height * (0.41 - i * 0.03)),
                int(width * (0.72 + i * 0.04)),
                int(height * (0.86 - i * 0.06)),
            )
            draw.arc(box, start=195, end=335, fill=(141, 211, 95, 126), width=8)
            draw.arc((box[0] + 24, box[1] + 24, box[2] - 24, box[3] - 18), start=205, end=330, fill=(81, 210, 205, 90), width=4)

    if mode == "access":
        for i in range(5):
            y = int(height * (0.42 + i * 0.09))
            draw.line((int(width * 0.14), y, int(width * 0.88), y - int(height * 0.18)), fill=(81, 210, 205, 76), width=3)
        draw.ellipse((int(width * 0.44), int(height * 0.42), int(width * 0.56), int(height * 0.58)), outline=(*accent, 140), width=5)


def make_scene(name: str, accent: Tuple[int, int, int], mode: str, size: Tuple[int, int] = WIDE) -> None:
    random.seed(name)
    img = gradient(size, [(0, (3, 4, 5)), (0.5, (10, 9, 8)), (1, (3, 3, 4))]).convert("RGBA")
    glow(img, (int(size[0] * 0.22), int(size[1] * 0.18)), int(size[0] * 0.34), accent, 74)
    glow(img, (int(size[0] * 0.82), int(size[1] * 0.28)), int(size[0] * 0.26), (81, 210, 205), 42)
    beams(img, [accent, (81, 210, 205), (228, 88, 53)], 0.7)
    draw_atrium(img, accent, mode)

    noise = Image.effect_noise(size, 18).convert("L")
    noise_layer = Image.new("RGBA", size, (255, 255, 255, 0))
    noise_layer.putalpha(noise.point(lambda p: int(p * 0.08)))
    img.alpha_composite(noise_layer)
    img = img.convert("RGB")
    img.save(MEDIA / name, quality=88, method=6)


def make_hero_frame(index: int, total: int) -> Image.Image:
    t = index / max(total - 1, 1)
    width, height = VIDEO
    img = gradient(VIDEO, [(0, (2, 3, 5)), (0.42, (9, 8, 7)), (1, (4, 4, 5))]).convert("RGBA")
    accent = (213, 165, 70)
    glow(img, (int(width * (0.28 + math.sin(t * math.tau) * 0.03)), int(height * 0.24)), int(width * 0.34), accent, 84)
    glow(img, (int(width * 0.74), int(height * (0.3 + math.cos(t * math.tau) * 0.04))), int(width * 0.24), (81, 210, 205), 56)
    beams(img, [accent, (81, 210, 205), (228, 88, 53)], t * math.tau)
    draw_atrium(img, accent, "hero", phase=t)

    draw = ImageDraw.Draw(img, "RGBA")
    sweep_x = int(width * (0.08 + t * 0.84))
    draw.polygon(
        [
            (sweep_x - 80, 0),
            (sweep_x + 26, 0),
            (sweep_x + 220, height),
            (sweep_x + 80, height),
        ],
        fill=(255, 245, 220, 20),
    )
    vignette = Image.new("RGBA", VIDEO, (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    for i in range(24):
        alpha = int(i * 4.5)
        vdraw.rectangle((i * 10, i * 6, width - i * 10, height - i * 6), outline=(0, 0, 0, alpha), width=12)
    img.alpha_composite(vignette.filter(ImageFilter.GaussianBlur(18)))
    return img.convert("RGB")


def ffmpeg_path() -> str | None:
    env_path = os.environ.get("FFMPEG_BIN")
    if env_path and Path(env_path).exists():
        return env_path

    try:
        result = subprocess.run(
            ["node", "-e", "console.log(require('ffmpeg-static'))"],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        )
        candidate = result.stdout.strip()
        if candidate and Path(candidate).exists():
            return candidate
    except Exception:
        pass

    system = shutil.which("ffmpeg")
    return system


def make_video() -> None:
    total = 108
    if FRAMES.exists():
        shutil.rmtree(FRAMES)
    FRAMES.mkdir(parents=True, exist_ok=True)

    for index in range(total):
        make_hero_frame(index, total).save(FRAMES / f"frame_{index:04d}.png", optimize=True)

    ffmpeg = ffmpeg_path()
    if not ffmpeg:
        print("ffmpeg not found; generated posters and stills only.")
        return

    pattern = str(FRAMES / "frame_%04d.png")
    mp4 = str(MEDIA / "moa-cinematic.mp4")
    webm = str(MEDIA / "moa-cinematic.webm")

    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-framerate",
            "30",
            "-i",
            pattern,
            "-vf",
            "format=yuv420p",
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "25",
            "-movflags",
            "+faststart",
            mp4,
        ],
        check=True,
    )
    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-framerate",
            "30",
            "-i",
            pattern,
            "-c:v",
            "libvpx-vp9",
            "-b:v",
            "0",
            "-crf",
            "34",
            "-pix_fmt",
            "yuva420p",
            webm,
        ],
        check=True,
    )
    shutil.rmtree(FRAMES)


def main() -> None:
    MEDIA.mkdir(parents=True, exist_ok=True)
    make_scene("moa-poster.webp", (213, 165, 70), "hero", VIDEO)
    make_scene("retail-luxury.webp", (213, 165, 70), "retail")
    make_scene("dining-lifestyle.webp", (228, 88, 53), "dining")
    make_scene("attractions-night.webp", (141, 211, 95), "attractions")
    make_scene("events-platform.webp", (81, 210, 205), "events")
    make_scene("leasing-module.webp", (213, 165, 70), "retail")
    make_scene("sponsorship-module.webp", (228, 88, 53), "sponsor")
    make_scene("events-module.webp", (81, 210, 205), "events")
    make_scene("access-module.webp", (141, 211, 95), "access")
    make_video()
    print(f"Media generated in {MEDIA}")


if __name__ == "__main__":
    main()
