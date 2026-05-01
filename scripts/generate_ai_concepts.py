from __future__ import annotations

import math
import os
import shutil
import subprocess
from pathlib import Path
from typing import Iterable, Tuple

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "public" / "media"
REAL = MEDIA / "real"
FRAMES = MEDIA / "frames-ai"

STILL = (1680, 1080)
VIDEO = (1280, 720)


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

    return shutil.which("ffmpeg")


def cover_crop(img: Image.Image, size: Tuple[int, int], focus: Tuple[float, float]) -> Image.Image:
    img = ImageOps.exif_transpose(img).convert("RGB")
    src_w, src_h = img.size
    dst_w, dst_h = size
    scale = max(dst_w / src_w, dst_h / src_h)
    new_w = int(src_w * scale + 0.5)
    new_h = int(src_h * scale + 0.5)
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    max_x = max(new_w - dst_w, 0)
    max_y = max(new_h - dst_h, 0)
    left = int(max_x * min(max(focus[0], 0), 1))
    top = int(max_y * min(max(focus[1], 0), 1))
    return resized.crop((left, top, left + dst_w, top + dst_h))


def source(name: str) -> Image.Image:
    path = REAL / name
    if not path.exists():
        fallback = MEDIA / "events-platform.webp"
        return Image.open(fallback)
    return Image.open(path)


def glow(base: Image.Image, center: Tuple[int, int], radius: int, color: Tuple[int, int, int], alpha: int) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer, "RGBA")
    cx, cy = center
    for step in range(18, 0, -1):
        r = radius * step / 18
        a = int(alpha * (step / 18) ** 2.4)
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(*color, a))
    base.alpha_composite(layer.filter(ImageFilter.GaussianBlur(radius / 8)))


def draw_vignette(base: Image.Image, strength: int = 118) -> None:
    width, height = base.size
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for i in range(30):
        alpha = int(strength * (i / 30) ** 2.1)
        inset_x = int(width * 0.018 * i)
        inset_y = int(height * 0.018 * i)
        if inset_x >= width - inset_x or inset_y >= height - inset_y:
            break
        draw.rectangle((inset_x, inset_y, width - inset_x, height - inset_y), outline=(0, 0, 0, alpha), width=18)
    base.alpha_composite(layer.filter(ImageFilter.GaussianBlur(28)))


def draw_light_architecture(base: Image.Image, accent: Tuple[int, int, int], phase: float, density: float) -> None:
    width, height = base.size
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer, "RGBA")
    cx = width * 0.52
    cy = height * 0.52

    for index in range(9):
        t = index / 8
        span = width * (0.16 + t * 0.36)
        y = cy + math.sin(phase + index * 0.42) * height * 0.018 + t * height * 0.18
        box = (cx - span, y - height * 0.13, cx + span, y + height * 0.13)
        draw.arc(box, 185, 355, fill=(*accent, int(58 * density)), width=4)
        draw.arc((box[0] + 22, box[1] + 16, box[2] - 22, box[3] + 10), 188, 352, fill=(255, 255, 255, 28), width=2)

    for index, color in enumerate([accent, (64, 216, 208), (243, 107, 63), (255, 248, 236)]):
        drift = math.sin(phase * 0.9 + index * 1.2)
        x = width * (0.16 + index * 0.17 + drift * 0.035)
        draw.polygon(
            [
                (x, -height * 0.08),
                (x + width * 0.055, -height * 0.08),
                (x + width * (0.22 + index * 0.02), height * 1.04),
                (x - width * (0.12 + index * 0.012), height * 1.04),
            ],
            fill=(*color, int(36 * density)),
        )

    for index in range(11):
        y = height * (0.28 + index * 0.055)
        offset = math.sin(phase + index * 0.5) * width * 0.018
        draw.line(
            (width * 0.12 + offset, y, width * 0.9 - offset, y + height * 0.09),
            fill=(255, 255, 255, int(12 + index * density)),
            width=1,
        )

    base.alpha_composite(layer.filter(ImageFilter.GaussianBlur(2)))


def draw_media_surfaces(base: Image.Image, accent: Tuple[int, int, int], phase: float) -> None:
    width, height = base.size
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer, "RGBA")

    surfaces = [
        (0.18, 0.34, 0.18, 0.12, -7),
        (0.62, 0.28, 0.2, 0.13, 6),
        (0.41, 0.56, 0.22, 0.14, 0),
    ]
    for index, (x, y, w, h, tilt) in enumerate(surfaces):
        left = int(width * x)
        top = int(height * y)
        right = int(left + width * w)
        bottom = int(top + height * h)
        alpha = 108 + int(math.sin(phase + index) * 24)
        draw.rounded_rectangle(
            (left, top, right, bottom),
            radius=16,
            fill=(7, 9, 12, 130),
            outline=(*accent, alpha),
            width=3,
        )
        for line in range(5):
            yy = top + int((line + 1) * (bottom - top) / 6)
            draw.line((left + 18, yy, right - 18, yy + int(math.sin(phase + line) * 5)), fill=(255, 255, 255, 36), width=2)
        glow(layer, ((left + right) // 2, (top + bottom) // 2), int(width * 0.05), accent, 32)

    base.alpha_composite(layer.filter(ImageFilter.GaussianBlur(0.4)))


def draw_crowd_and_paths(base: Image.Image, accent: Tuple[int, int, int], phase: float, count: int) -> None:
    width, height = base.size
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer, "RGBA")
    center_x = width * 0.51
    base_y = height * 0.72
    for i in range(count):
        angle = (i * 137.508 + phase * 32) * math.pi / 180
        radius = width * (0.035 + (i % 37) * 0.0046)
        x = center_x + math.cos(angle) * radius * 1.45
        y = base_y + math.sin(angle) * radius * 0.38 + (i % 7) * 2
        color = accent if i % 7 == 0 else (255, 248, 236)
        alpha = 52 + (i % 5) * 12
        draw.ellipse((x - 2.2, y - 2.2, x + 2.2, y + 2.2), fill=(*color, alpha))

    for path in range(4):
        start_x = width * (0.18 + path * 0.16)
        end_x = width * (0.42 + path * 0.12)
        draw.line(
            (start_x, height * 0.94, end_x, height * (0.58 + path * 0.02)),
            fill=(*accent, 54),
            width=4,
        )

    base.alpha_composite(layer.filter(ImageFilter.GaussianBlur(0.25)))


def draw_prompt_tag(base: Image.Image, label: str, accent: Tuple[int, int, int]) -> None:
    width, height = base.size
    draw = ImageDraw.Draw(base, "RGBA")
    font = ImageFont.load_default()
    margin = int(width * 0.035)
    tag = f"GENERATIVE CONCEPT // {label.upper()}"
    box = (margin, margin, margin + int(width * 0.35), margin + 48)
    draw.rounded_rectangle(box, radius=24, fill=(0, 0, 0, 118), outline=(*accent, 120), width=2)
    draw.text((box[0] + 20, box[1] + 17), tag, fill=(255, 248, 236, 210), font=font)


def grade(img: Image.Image, accent: Tuple[int, int, int]) -> Image.Image:
    img = ImageEnhance.Color(img).enhance(1.22)
    img = ImageEnhance.Contrast(img).enhance(1.08)
    img = ImageEnhance.Brightness(img).enhance(0.9)
    rgba = img.convert("RGBA")
    overlay = Image.new("RGBA", rgba.size, (5, 8, 10, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    draw.rectangle((0, 0, rgba.size[0], rgba.size[1]), fill=(3, 4, 5, 18))
    draw.rectangle((0, int(rgba.size[1] * 0.68), rgba.size[0], rgba.size[1]), fill=(0, 0, 0, 76))
    glow(overlay, (int(rgba.size[0] * 0.22), int(rgba.size[1] * 0.2)), int(rgba.size[0] * 0.28), accent, 38)
    rgba.alpha_composite(overlay)
    return rgba


def concept_frame(
    base_source: Image.Image,
    size: Tuple[int, int],
    focus: Tuple[float, float],
    accent: Tuple[int, int, int],
    label: str,
    phase: float,
    crowd: int,
    density: float,
) -> Image.Image:
    img = cover_crop(base_source, size, focus)
    img = grade(img, accent)
    draw_light_architecture(img, accent, phase, density)
    draw_media_surfaces(img, accent, phase)
    draw_crowd_and_paths(img, accent, phase, crowd)
    draw_vignette(img)
    noise = Image.effect_noise(size, 12).convert("L")
    noise_layer = Image.new("RGBA", size, (255, 255, 255, 0))
    noise_layer.putalpha(noise.point(lambda p: int(p * 0.045)))
    img.alpha_composite(noise_layer)
    return img.convert("RGB")


def save_concepts() -> None:
    concepts = [
        ("ai-scale-concept.webp", "scale model", "official-leasing-hero.jpg", (241, 189, 79), (0.46, 0.48), 0.6, 180),
        ("ai-energy-concept.webp", "live energy", "official-leasing-attractions.jpg", (64, 216, 208), (0.48, 0.44), 1.05, 260),
        ("ai-ownership-concept.webp", "brand ownership", "official-leasing-shop.jpg", (243, 107, 63), (0.45, 0.5), 1.35, 320),
    ]
    for out_name, label, source_name, accent, focus, density, crowd in concepts:
        frame = concept_frame(source(source_name), STILL, focus, accent, label, 1.2, crowd, density)
        frame.save(MEDIA / out_name, "WEBP", quality=86, method=6)


def save_motion() -> None:
    ffmpeg = ffmpeg_path()
    if not ffmpeg:
        return

    if FRAMES.exists():
        shutil.rmtree(FRAMES)
    FRAMES.mkdir(parents=True, exist_ok=True)

    base = source("official-leasing-attractions.jpg")
    total = 132
    for i in range(total):
        t = i / max(total - 1, 1)
        focus = (0.42 + math.sin(t * math.tau) * 0.08, 0.48 + math.cos(t * math.tau) * 0.04)
        frame = concept_frame(
            base,
            VIDEO,
            focus,
            (64, 216, 208),
            "live takeover",
            t * math.tau,
            260,
            1.2,
        )
        frame.save(FRAMES / f"frame_{i:04d}.jpg", quality=86, optimize=True)

    pattern = str(FRAMES / "frame_%04d.jpg")
    subprocess.run(
        [
            ffmpeg,
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-framerate",
            "24",
            "-i",
            pattern,
            "-vf",
            "format=yuv420p",
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "29",
            "-movflags",
            "+faststart",
            str(MEDIA / "ai-activation-loop.mp4"),
        ],
        check=True,
    )
    subprocess.run(
        [
            ffmpeg,
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-framerate",
            "24",
            "-i",
            pattern,
            "-c:v",
            "libvpx",
            "-deadline",
            "good",
            "-cpu-used",
            "4",
            "-b:v",
            "820k",
            "-pix_fmt",
            "yuv420p",
            str(MEDIA / "ai-activation-loop.webm"),
        ],
        check=True,
    )


def main() -> None:
    MEDIA.mkdir(parents=True, exist_ok=True)
    save_concepts()
    save_motion()


if __name__ == "__main__":
    main()
