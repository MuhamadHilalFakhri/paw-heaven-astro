import type { PetSpecies } from "./pet-frames";

// Keep travel speed and stride length together so the paws match the movement.
const gait = {
  cat: { pace: 22, stride: 52 },
  dog: { pace: 24, stride: 56 },
} satisfies Record<PetSpecies, { pace: number; stride: number }>;

export function getPetGait(species: PetSpecies, compact: boolean) {
  const scale = compact ? 68 / 88 : 1;
  return { pace: gait[species].pace * scale, stride: gait[species].stride * scale };
}

export const WALK_RAMP_SECONDS = 1.6;

// Integrating a smooth velocity curve keeps acceleration continuous at joins.
export const walkEaseIn = (t: number) => 5 * t ** 4 - 6 * t ** 5 + 2 * t ** 6;
export const walkEaseOut = (t: number) => 1 - walkEaseIn(1 - t);
