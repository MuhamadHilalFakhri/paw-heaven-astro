export type PetSpecies = "cat" | "dog";

const files = import.meta.glob<string>("../../assets/clear/companions/*/*.webp", {
  eager: true,
  import: "default",
  query: "?url",
});
const walkingFiles = import.meta.glob<string>("../../assets/clear/companions/walk-v2/*/*.webp", {
  eager: true,
  import: "default",
  query: "?url",
});

function framesFor(name: string) {
  return Object.entries(files)
    .filter(([path]) => path.includes(`/companions/${name}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);
}

export const petFrames: Record<PetSpecies, string[]> = {
  cat: framesFor("milo"),
  dog: framesFor("coco"),
};
export const petWalkFrames: Record<PetSpecies, string[]> = {
  cat: Object.entries(walkingFiles).filter(([path]) => path.includes("/milo/"))
    .sort(([a], [b]) => a.localeCompare(b)).map(([, url]) => url),
  dog: Object.entries(walkingFiles).filter(([path]) => path.includes("/coco/"))
    .sort(([a], [b]) => a.localeCompare(b)).map(([, url]) => url),
};

export type PetTravel = { distance: number };
