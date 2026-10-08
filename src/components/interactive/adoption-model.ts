import type { PetProfile } from "../../data/community-content";

export type ShowcaseImages = Record<string, string>;
export type ProfileCard = {
  name: string; species: string; age: string; character: string; description: string;
  status?: PetProfile["status"]; photo?: PetProfile["photo"]; imageAlt?: string;
};
export type MatchAnswers = { home: string; activity: string; species: string };

// These preferences describe fictional demo profiles, not animal suitability rules.
const demoPreferences: Record<string, { activity: string; home: string }> = {
  Milo: { activity: "playful", home: "either" }, Mimi: { activity: "calm", home: "either" },
  Bolu: { activity: "playful", home: "house" }, Coco: { activity: "calm", home: "either" },
};
export function findCompanion(profiles: ProfileCard[], answers: MatchAnswers) {
  const candidates = profiles.filter(pet => answers.species === "any" || pet.species === answers.species);
  return candidates.map(pet => {
    const preference = demoPreferences[pet.name];
    const score = (preference?.activity === answers.activity ? 4 : 0)
      + (preference?.home === answers.home || preference?.home === "either" ? 1 : 0);
    return { pet, score };
  }).sort((a, b) => b.score - a.score)[0]?.pet;
}
