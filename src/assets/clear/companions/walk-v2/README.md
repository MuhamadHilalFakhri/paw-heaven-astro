# PawCare+ walking frames

Generated with the built-in imagegen tool using the existing Milo and Coco
`frame-00.webp` illustrations as character references.

Prompt specification for each character: a transparent 6-column by 4-row sheet
of 24 successive phases of a natural four-legged walking cycle facing right;
preserve the existing cartoon style, face, coat colors, and markings; alternate
planted and lifted paws with bending joints, subtle tail motion, and minimal
head movement; no backdrop, floor, shadows, labels, or extra objects.

`scripts/pets/extract-walk-frames.mjs` crops each complete silhouette, applies
one consistent scale per character, aligns the ground contact on a transparent
192 by 192 canvas, and saves WebP with alpha. The original pose assets remain
available for idle, blink, play, and treat states.
