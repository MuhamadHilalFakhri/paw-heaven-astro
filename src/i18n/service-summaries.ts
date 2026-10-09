import type { Locale } from "./config";

const en: Record<string, string> = {
  grooming: "Gentle baths, trims, and grooming for happy paws.",
  checkup: "Health checks and vaccinations with thoughtful care.",
  emergency: "Explore care options for urgent health concerns.",
  boarding: "A comfortable, supervised stay while you are away.",
  homeVisit: "Care for your companion in the comfort of home.",
  preventive: "Regular care routines for your pet’s wellbeing.",
};
const id: Record<string, string> = {
  grooming: "Mandi, potong kuku, dan grooming dengan lembut.",
  checkup: "Pemeriksaan kesehatan dan vaksinasi penuh perhatian.",
  emergency: "Kenali pilihan perawatan untuk kondisi mendesak.",
  boarding: "Penitipan nyaman dengan pendampingan saat Anda pergi.",
  homeVisit: "Perawatan sahabat Anda di rumah yang nyaman.",
  preventive: "Perawatan rutin untuk kesehatan sahabat Anda.",
};
export const getServiceSummaries = (locale: Locale) => locale === "id" ? id : en;
