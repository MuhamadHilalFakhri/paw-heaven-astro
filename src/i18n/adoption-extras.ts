import type { Locale } from "./config";

const en = {
  favorites: "Favorites", addFavorite: "Add {name} to favorites", removeFavorite: "Remove {name} from favorites",
  emptyFavorites: "Your favorites will appear here", favoriteHint: "Tap a heart on a profile to build your shortlist for this visit.",
  showAll: "Browse all companions", position: "{start} of {total}", range: "{start}–{end} of {total}",
  goTo: "Go to carousel position {position}", matchBadge: "Your sample match",
  quizTitle: "Find a companion that fits your day", quizHint: "Three quick questions to explore our fictional profiles.",
  step: "Question {step} of 3", choose: "Choose an answer", next: "Next", back: "Back", find: "Find my match",
  home: "What is your home like?", apartment: "An apartment or smaller home", house: "A home with outdoor space",
  activity: "What pace do you prefer?", calm: "Quiet company and gentle play", playful: "Active play and daily adventures",
  species: "Which companion are you drawn to?", any: "Happy to meet either", cat: "A cat", dog: "A dog",
  result: "Meet {name}", view: "Show {name}'s profile", retry: "Change my answers",
  demo: "This match uses fictional preferences for the prototype. It does not assess adoption suitability.",
  noMatch: "There are no sample profiles to match yet.",
};
const id: typeof en = {
  favorites: "Favorit", addFavorite: "Tambahkan {name} ke favorit", removeFavorite: "Hapus {name} dari favorit",
  emptyFavorites: "Sahabat favorit Anda akan muncul di sini", favoriteHint: "Tekan ikon love pada profil untuk membuat daftar pilihan selama halaman terbuka.",
  showAll: "Lihat semua sahabat", position: "{start} dari {total}", range: "{start}–{end} dari {total}",
  goTo: "Ke posisi carousel {position}", matchBadge: "Pilihan contoh untuk Anda",
  quizTitle: "Temukan sahabat yang cocok dengan keseharian Anda", quizHint: "Tiga pertanyaan singkat untuk mengenali profil contoh kami.",
  step: "Pertanyaan {step} dari 3", choose: "Pilih jawaban", next: "Lanjut", back: "Kembali", find: "Cari sahabat saya",
  home: "Seperti apa tempat tinggal Anda?", apartment: "Apartemen atau rumah lebih kecil", house: "Rumah dengan ruang luar",
  activity: "Suasana apa yang Anda sukai?", calm: "Teman yang tenang dan permainan santai", playful: "Bermain aktif dan kegiatan setiap hari",
  species: "Sahabat seperti apa yang Anda inginkan?", any: "Terbuka untuk keduanya", cat: "Kucing", dog: "Anjing",
  result: "Kenali {name}", view: "Tampilkan profil {name}", retry: "Ubah jawaban saya",
  demo: "Hasil memakai preferensi fiktif untuk prototype dan tidak menentukan kelayakan adopsi.",
  noMatch: "Belum ada profil contoh untuk dicocokkan.",
};
export const getAdoptionExtras = (locale: Locale) => locale === "id" ? id : en;
