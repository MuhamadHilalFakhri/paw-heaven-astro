import type { Locale } from "./config";

const en = {
  title: "Small paws. Big love.",
  description: "From everyday grooming to wellness visits, we make caring for your companion feel easy.",
  benefits: ["Gentle care", "Happy companions", "Feel-at-home comfort"],
  explore: "Explore services",
};
const id: typeof en = {
  title: "Sahabat kecil. Kasih yang besar.",
  description: "Dari grooming harian hingga pemeriksaan kesehatan, kami membantu merawat sahabat Anda dengan mudah.",
  benefits: ["Perawatan lembut", "Sahabat bahagia", "Nyaman seperti di rumah"],
  explore: "Jelajahi layanan",
};
export const getIntroContent = (locale: Locale) => locale === "id" ? id : en;
