# PawCare+ companion animation assets

Generated with the built-in imagegen tool using the original Milo/Coco sheets as character references. Production assets are isolated 192 × 192 transparent WebP files in `src/assets/clear/companions/milo/` and `coco/`. No background is added.

`prepare-pet-frames.py` extracts alpha-connected subjects rather than blindly cutting a grid. This removes neighboring poses and detached residue. Each subject receives the same scale and foot baseline, with a transparent gutter. Dependencies: Pillow, numpy, scipy.

Each set contains 16 frames: 0–11 walk phases, 12 standing, 13 blink, 14 ball play, 15 sitting. Coco frame 9 is a generated blink and is excluded from the walking sequence. The animation advances by distance rather than a fixed timer. CSS must not interpolate frame images or sprite sheet positions.

## Milo prompt

Use case: stylized-concept. Asset type: transparent 2D sprite animation sheet for the PawCare+ web companion.
Reference is the existing sprite sheet; preserve exactly Milo, the orange tabby cat with green eyes, cream muzzle and paws, striped upright gently curved tail's character identity, round proportions, soft dark outlines, flat warm pastel cartoon colors, cheerful face and drawing style.
Replace this sheet with an EXACT 4-column by 4-row uniform grid of 16 separate drawings. All cells have generous completely transparent margins of at least 15% on EACH side, no pixel from a character crosses a cell boundary. No text, labels, lines, background, floor or shadows. True alpha background.
Read cells left to right then top to bottom. Frames 0 through 11: TWELVE consecutive evenly spaced phases of one relaxed natural four-legged WALK cycle, side view facing RIGHT, in-place walking. Same body length, head shape, size and position throughout. The body is nearly level. Feet contact the same ground baseline in every frame. At least TWO feet stay planted at all times. Hind and front legs alternate in a physically coherent quadruped walking sequence; gently lift and swing each paw, do not leap or run. Subtle ear/tail follow-through only, no dramatic squash or pose changes. Frame 11 transitions smoothly to frame 0.
Frame 12: calm standing idle, facing right. Frame 13: same idle with eyes closed for blink. Frame 14: playful low pose with a small red rubber ball near front paw. Frame 15: calm sitting pose facing right.
Composition: identical camera, fixed cell centers, identical scale, feet baseline at 82% down each cell, character occupies at most 70% of cell width and height. Make all 16 drawings complete and isolated; do not cut any tail, whisker, ear or foot. Avoid previous layout with oversized drawings leaking into neighboring cells.

## Coco prompt

Use case: stylized-concept. Asset type: transparent 2D sprite animation sheet for the PawCare+ web companion.
Reference is the existing sprite sheet; preserve exactly Coco, the cream dog with tan patches, floppy tan ears, brown eyes and fluffy curved tail's character identity, round proportions, soft dark outlines, flat warm pastel cartoon colors, cheerful face and drawing style.
Replace this sheet with an EXACT 4-column by 4-row uniform grid of 16 separate drawings. All cells have generous completely transparent margins of at least 15% on EACH side, no pixel from a character crosses a cell boundary. No text, labels, lines, background, floor or shadows. True alpha background.
Read cells left to right then top to bottom. Frames 0 through 11: TWELVE consecutive evenly spaced phases of one relaxed natural four-legged WALK cycle, side view facing RIGHT, in-place walking. Same body length, head shape, size and position throughout. The body is nearly level. Feet contact the same ground baseline in every frame. At least TWO feet stay planted at all times. Hind and front legs alternate in a physically coherent quadruped walking sequence; gently lift and swing each paw, do not leap or run. Subtle ear/tail follow-through only, no dramatic squash or pose changes. Frame 11 transitions smoothly to frame 0.
Frame 12: calm standing idle, facing right. Frame 13: same idle with eyes closed for blink. Frame 14: playful low pose with a small red rubber ball near front paw. Frame 15: calm sitting pose facing right.
Composition: identical camera, fixed cell centers, identical scale, feet baseline at 82% down each cell, character occupies at most 70% of cell width and height. Make all 16 drawings complete and isolated; do not cut any tail, whisker, ear or foot. Avoid previous layout with oversized drawings leaking into neighboring cells.

