export type PetSpecies = "cat" | "dog";

const files = import.meta.glob<string>("../../assets/clear/companions/*/*.webp", {
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

export type PetTravel = { distance: number };
