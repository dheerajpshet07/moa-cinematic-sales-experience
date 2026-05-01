from __future__ import annotations

import math
import os
import shutil
import subprocess
from pathlib import Path
from typing import Iterable, Tuple

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "public" / "media"
REAL = MEDIA / "real"
SOURCE_MEDIA = ROOT / "media_sources"
FRAMES = MEDIA / "frames-real"

VIDEO_SIZE = (1280, 720)
STILL_SIZE = (1680, 1080)
VIDEO_MASTER = (1728, 972)


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


def add_vignette(base: Image.Image, strength: int = 92) -> Image.Image:
    width, height = base.size
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    rings = 34
    for i in range(rings):
        inset_x = int(width * 0.018 * i)
        inset_y = int(height * 0.018 * i)
        if inset_x >= width - inset_x or inset_y >= height - inset_y:
            break
        alpha = int(strength * (i / rings) ** 2.2)
        draw.rectangle((inset_x, inset_y, width - inset_x, height - inset_y), outline=(0, 0, 0, alpha), width=16)
    overlay = overlay.filter(ImageFilter.GaussianBlur(30))
    result = base.convert("RGBA")
    result.alpha_composite(overlay)
    return result


def light_leaks(base: Image.Image, accent: Tuple[int, int, int], phase: float) -> Image.Image:
    width, height = base.size
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer, "RGBA")

    for index, color in enumerate([accent, (81, 210, 205), (255, 242, 212)]):
        drift = math.sin(phase + index * 1.7)
        x = int(width * (0.1 + index * 0.28 + drift * 0.05))
        draw.polygon(
            [
                (x, -height * 0.1),
                (x + width * 0.08, -height * 0.1),
                (x + width * (0.18 + index * 0.035), height * 1.1),
                (x - width * (0.10 + index * 0.02), height * 1.1),
            ],
            fill=(*color, 42),
        )

    for i in range(4):
        cx = int(width * (0.18 + i * 0.22 + math.sin(phase * 0.8 + i) * 0.04))
        cy = int(height * (0.28 + math.cos(phase * 0.7 + i) * 0.12))
        radius = int(width * (0.18 + 0.03 * i))
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=(*accent, 24))

    layer = layer.filter(ImageFilter.GaussianBlur(28))
    result = base.convert("RGBA")
    result.alpha_composite(layer)
    return result


def grade(img: Image.Image, accent: Tuple[int, int, int], phase: float = 0.0, darken: float = 0.94) -> Image.Image:
    img = ImageEnhance.Color(img).enhance(1.18)
    img = ImageEnhance.Contrast(img).enhance(1.08)
    img = ImageEnhance.Brightness(img).enhance(darken)
    result = light_leaks(img, accent, phase)
    result = add_vignette(result)
    width, height = result.size
    wash = Image.new("RGBA", result.size, (4, 5, 6, 0))
    draw = ImageDraw.Draw(wash, "RGBA")
    draw.rectangle((0, 0, width, height), fill=(8, 7, 5, 14))
    draw.rectangle((0, int(height * 0.68), width, height), fill=(0, 0, 0, 54))
    result.alpha_composite(wash)
    return result.convert("RGB")


def save_scene(
    source: Path,
    out_name: str,
    accent: Tuple[int, int, int],
    focus: Tuple[float, float] = (0.5, 0.5),
    size: Tuple[int, int] = STILL_SIZE,
    phase: float = 0.0,
) -> None:
    img = cover_crop(Image.open(source), size, focus)
    img = grade(img, accent, phase=phase)
    img.save(MEDIA / out_name, "WEBP", quality=88, method=6)


def source_media(name: str) -> Path:
    private_source = SOURCE_MEDIA / name
    if private_source.exists():
        return private_source
    return REAL / name


def frame_from_image(source: Image.Image, index: int, total: int, accent: Tuple[int, int, int]) -> Image.Image:
    progress = index / max(total - 1, 1)
    # The focus drifts slowly so real still photography behaves like premium destination footage.
    focus_x = 0.42 + math.sin(progress * math.pi * 2) * 0.18
    focus_y = 0.48 + math.cos(progress * math.pi * 1.4) * 0.08
    zoom = 1.0 + progress * 0.12
    master_w, master_h = source.size
    crop_w = int(master_w / zoom)
    crop_h = int(crop_w * VIDEO_SIZE[1] / VIDEO_SIZE[0])
    if crop_h > master_h:
        crop_h = int(master_h / zoom)
        crop_w = int(crop_h * VIDEO_SIZE[0] / VIDEO_SIZE[1])
    left = int((master_w - crop_w) * min(max(focus_x, 0), 1))
    top = int((master_h - crop_h) * min(max(focus_y, 0), 1))
    img = source.crop((left, top, left + crop_w, top + crop_h))
    img = img.resize(VIDEO_SIZE, Image.Resampling.LANCZOS)
    return grade(img, accent, phase=progress * math.pi * 2, darken=0.95)


def make_hero_video() -> None:
    ffmpeg = ffmpeg_path()
    if not ffmpeg:
        print("ffmpeg not found; generated stills only.")
        return

    sizzle = source_media("official-sponsorship-sizzle.mp4")
    if sizzle.exists():
        # Official MOA motion gives the opening an immediate sense of arrival:
        # people, retail scale, entertainment color, and on-property graphics
        # create the "I need to be here" pull faster than abstract footage.
        subprocess.run(
            [
                ffmpeg,
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-i",
                str(sizzle),
                "-t",
                "8",
                "-vf",
                "scale=1280:-2,eq=saturation=1.22:contrast=1.06:brightness=0.035,format=yuv420p",
                "-an",
                "-c:v",
                "libx264",
                "-preset",
                "medium",
                "-crf",
                "28",
                "-movflags",
                "+faststart",
                str(MEDIA / "moa-cinematic.mp4"),
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
                "-i",
                str(sizzle),
                "-t",
                "8",
                "-vf",
                "scale=1280:-2,eq=saturation=1.2:contrast=1.04:brightness=0.03",
                "-an",
                "-c:v",
                "libvpx",
                "-deadline",
                "good",
                "-cpu-used",
                "4",
                "-b:v",
                "680k",
                "-pix_fmt",
                "yuv420p",
                str(MEDIA / "moa-cinematic.webm"),
            ],
            check=True,
        )
        return

    sources = [
        (REAL / "official-leasing-hero.jpg", (213, 165, 70)),
        (REAL / "official-leasing-shop.jpg", (81, 210, 205)),
        (REAL / "official-leasing-attractions.jpg", (141, 211, 95)),
        (REAL / "official-leasing-dine.jpg", (228, 88, 53)),
    ]

    if FRAMES.exists():
        shutil.rmtree(FRAMES)
    FRAMES.mkdir(parents=True, exist_ok=True)

    prepared_sources = [
        (cover_crop(Image.open(source), VIDEO_MASTER, (0.5, 0.5)), accent)
        for source, accent in sources
    ]

    frames_per_scene = 45
    frame_index = 0
    for source, accent in prepared_sources:
        for local in range(frames_per_scene):
            img = frame_from_image(source, local, frames_per_scene, accent)
            if local < 10 and frame_index > 0:
                # Crossfade from the previous scene so the autoplay opening never cuts to a black frame.
                previous = Image.open(FRAMES / f"frame_{frame_index - 1:04d}.jpg").convert("RGB")
                img = Image.blend(previous, img, local / 10)
            img.save(FRAMES / f"frame_{frame_index:04d}.jpg", quality=88, optimize=True)
            frame_index += 1

    pattern = str(FRAMES / "frame_%04d.jpg")
    subprocess.run(
        [
            ffmpeg,
            "-hide_banner",
            "-loglevel",
            "error",
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
            "24",
            "-movflags",
            "+faststart",
            str(MEDIA / "moa-cinematic.mp4"),
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
            "30",
            "-i",
            pattern,
            "-c:v",
            "libvpx",
            "-deadline",
            "good",
            "-cpu-used",
            "4",
            "-b:v",
            "950k",
            "-pix_fmt",
            "yuv420p",
            str(MEDIA / "moa-cinematic.webm"),
        ],
        check=True,
    )
    shutil.rmtree(FRAMES)


def make_signal_video() -> None:
    ffmpeg = ffmpeg_path()
    if not ffmpeg:
        return

    sources = [
        (REAL / "official-leasing-shop.jpg", (213, 165, 70)),
        (REAL / "official-leasing-dine.jpg", (228, 88, 53)),
        (REAL / "official-leasing-attractions.jpg", (81, 210, 205)),
    ]

    if FRAMES.exists():
        shutil.rmtree(FRAMES)
    FRAMES.mkdir(parents=True, exist_ok=True)

    prepared_sources = [
        (cover_crop(Image.open(source), VIDEO_MASTER, (0.5, 0.5)), accent)
        for source, accent in sources
    ]

    frames_per_scene = 60
    frame_index = 0
    previous_frame: Image.Image | None = None
    for source, accent in prepared_sources:
        for local in range(frames_per_scene):
            img = frame_from_image(source, local, frames_per_scene, accent)
            if previous_frame is not None and local < 14:
                img = Image.blend(previous_frame, img, local / 14)
            img.save(FRAMES / f"signal_{frame_index:04d}.jpg", quality=88, optimize=True)
            previous_frame = img
            frame_index += 1

    pattern = str(FRAMES / "signal_%04d.jpg")
    subprocess.run(
        [
            ffmpeg,
            "-hide_banner",
            "-loglevel",
            "error",
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
            str(MEDIA / "moa-live.mp4"),
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
            "30",
            "-i",
            pattern,
            "-c:v",
            "libvpx",
            "-deadline",
            "good",
            "-cpu-used",
            "4",
            "-b:v",
            "900k",
            "-pix_fmt",
            "yuv420p",
            str(MEDIA / "moa-live.webm"),
        ],
        check=True,
    )
    shutil.rmtree(FRAMES)


def make_sponsorship_video() -> None:
    ffmpeg = ffmpeg_path()
    source = source_media("official-sponsorship-sizzle.mp4")
    if not ffmpeg or not source.exists():
        return

    subprocess.run(
        [
            ffmpeg,
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-ss",
            "10",
            "-i",
            str(source),
            "-t",
            "14",
            "-vf",
            "scale=960:-2,format=yuv420p",
            "-an",
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "27",
            "-movflags",
            "+faststart",
            str(MEDIA / "moa-sponsorship.mp4"),
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
            "-ss",
            "10",
            "-i",
            str(source),
            "-t",
            "14",
            "-vf",
            "scale=960:-2",
            "-an",
            "-c:v",
            "libvpx",
            "-deadline",
            "good",
            "-cpu-used",
            "4",
            "-b:v",
            "850k",
            str(MEDIA / "moa-sponsorship.webm"),
        ],
        check=True,
    )


def make_ambient_audio() -> None:
    ffmpeg = ffmpeg_path()
    if not ffmpeg:
        return

    sizzle = source_media("official-sponsorship-sizzle.mp4")
    if sizzle.exists():
        subprocess.run(
            [
                ffmpeg,
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-i",
                str(sizzle),
                "-t",
                "28",
                "-vn",
                "-af",
                "volume=0.32,afade=t=in:st=0:d=1.2,afade=t=out:st=26.6:d=1.4",
                "-c:a",
                "libvorbis",
                "-q:a",
                "3",
                str(MEDIA / "moa-live-audio.ogg"),
            ],
            check=True,
        )
        return

    subprocess.run(
        [
            ffmpeg,
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-f",
            "lavfi",
            "-i",
            "anoisesrc=color=pink:amplitude=0.06:duration=28",
            "-f",
            "lavfi",
            "-i",
            "sine=frequency=62:duration=28",
            "-filter_complex",
            "[0:a]lowpass=f=900,volume=0.18[a0];[1:a]volume=0.035[a1];[a0][a1]amix=inputs=2:duration=longest",
            "-c:a",
            "libvorbis",
            "-q:a",
            "3",
            str(MEDIA / "moa-live-audio.ogg"),
        ],
        check=True,
    )


def required(paths: Iterable[Path]) -> bool:
    missing = [path for path in paths if not path.exists()]
    if missing:
        print("Missing real media:", ", ".join(str(path.relative_to(ROOT)) for path in missing))
        return False
    return True


def main() -> None:
    MEDIA.mkdir(parents=True, exist_ok=True)
    sources = {
        "hero": REAL / "official-leasing-hero.jpg",
        "shop": REAL / "official-leasing-shop.jpg",
        "dine": REAL / "official-leasing-dine.jpg",
        "attractions": REAL / "official-leasing-attractions.jpg",
        "aerial": REAL / "moa-aerial.jpg",
    }
    if not required(sources.values()):
        print("Run the legacy generator or add real source media first.")
        return

    save_scene(sources["hero"], "moa-poster.webp", (213, 165, 70), (0.5, 0.46), VIDEO_SIZE, 0.1)
    save_scene(sources["shop"], "retail-luxury.webp", (213, 165, 70), (0.52, 0.48), phase=0.4)
    save_scene(sources["dine"], "dining-lifestyle.webp", (228, 88, 53), (0.48, 0.52), phase=1.2)
    save_scene(sources["attractions"], "attractions-night.webp", (141, 211, 95), (0.52, 0.48), phase=1.8)
    save_scene(sources["attractions"], "events-platform.webp", (81, 210, 205), (0.46, 0.48), phase=2.4)
    save_scene(sources["shop"], "leasing-module.webp", (213, 165, 70), (0.52, 0.45), phase=0.9)
    save_scene(sources["hero"], "sponsorship-module.webp", (228, 88, 53), (0.46, 0.45), phase=1.7)
    save_scene(sources["attractions"], "events-module.webp", (81, 210, 205), (0.52, 0.46), phase=2.7)
    save_scene(sources["aerial"], "access-module.webp", (141, 211, 95), (0.5, 0.5), phase=3.2)

    make_hero_video()
    make_signal_video()
    make_sponsorship_video()
    make_ambient_audio()
    print(f"Real media generated in {MEDIA}")


if __name__ == "__main__":
    main()
