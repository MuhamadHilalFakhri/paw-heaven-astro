"""Extract isolated subjects from a generated 4x4 sheet and optimize WebP frames.

Requires Pillow, numpy, scipy. No background is added to the source artwork.
Usage: python scripts/prepare-pet-frames.py --milo sheet.png --coco sheet.png
"""

import argparse
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SIZE = 192
BASELINE = 171


def extract(path):
    source = Image.open(path).convert("RGBA")
    pixels = np.array(source)
    labels, _ = ndimage.label(pixels[:, :, 3] > 32)
    areas = np.bincount(labels.ravel())
    subjects = [[] for _ in range(16)]
    for label_id, bounds in enumerate(ndimage.find_objects(labels), 1):
        if bounds is None or areas[label_id] < 60:
            continue
        ys, xs = bounds
        x, y = (xs.start + xs.stop) / 2, (ys.start + ys.stop) / 2
        cell = min(3, int(y * 4 / source.height)) * 4 + min(3, int(x * 4 / source.width))
        subjects[cell].append(label_id)

    frames = []
    for index, candidates in enumerate(subjects):
        if not candidates:
            raise ValueError(f"No subject found in frame {index}: {path}")
        largest = max(candidates, key=lambda label: areas[label])
        selected = [largest]
        if index == 14:
            selected += [label for label in candidates if label != largest and areas[label] > areas[largest] * 0.02]
        mask = ndimage.binary_dilation(np.isin(labels, selected), iterations=2)
        rgba = pixels.copy()
        rgba[:, :, 3] = np.where(mask, rgba[:, :, 3], 0)
        isolated = Image.fromarray(rgba)
        frames.append(isolated.crop(isolated.getbbox()))
    return frames


def pack(name, path):
    frames = extract(path)
    scale = min(150 / max(frame.width for frame in frames), 150 / max(frame.height for frame in frames))
    output = ROOT / "src/assets/clear/companions" / name
    output.mkdir(parents=True, exist_ok=True)
    for index, frame in enumerate(frames):
        frame = frame.resize((round(frame.width * scale), round(frame.height * scale)), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (SIZE, SIZE))
        canvas.alpha_composite(frame, ((SIZE - frame.width) // 2, BASELINE - frame.height))
        canvas.save(output / f"frame-{index:02}.webp", "WEBP", quality=90, method=6, exact=True)
    print(f"{name}: {len(frames)} isolated transparent frames, {sum(p.stat().st_size for p in output.glob('*.webp')):,} bytes")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--milo", required=True, type=Path)
    parser.add_argument("--coco", required=True, type=Path)
    args = parser.parse_args()
    pack("milo", args.milo)
    pack("coco", args.coco)
