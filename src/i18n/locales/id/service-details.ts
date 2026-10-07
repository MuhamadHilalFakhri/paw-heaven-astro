export const serviceDetails: Record<string, { includes: string[]; preparation: string }> = {
  grooming: {
    includes: ["Diskusikan kondisi bulu dan gaya grooming yang diinginkan", "Tanyakan layanan mandi, potong bulu, dan perawatan kuku", "Informasikan sensitivitas hewan sebelum berkunjung"],
    preparation: "Sampaikan ras, kondisi bulu, dan gaya grooming yang Anda inginkan.",
  },
  checkup: {
    includes: ["Diskusikan kesehatan dan rutinitas harian hewan", "Tanyakan pemeriksaan kesehatan dan vaksinasi", "Bawa catatan perawatan sebelumnya jika ada"],
    preparation: "Ceritakan perubahan terbaru dan pertanyaan yang ingin Anda diskusikan.",
  },
  emergency: {
    includes: ["Hubungi klinik untuk membahas kondisi mendesak", "Pastikan tim dapat menerima hewan Anda", "Tanyakan tempat rujukan jika klinik belum dapat membantu segera"],
    preparation: "Untuk kondisi mendesak, hubungi tim secara langsung tanpa menunggu balasan permintaan janji.",
  },
  boarding: {
    includes: ["Diskusikan tanggal dan durasi penitipan", "Sampaikan rutinitas makan dan instruksi perawatan", "Konfirmasikan persyaratan penitipan kepada tim"],
    preparation: "Siapkan tanggal penitipan dan instruksi perawatan khusus jika diperlukan.",
  },
  homeVisit: {
    includes: ["Pastikan alamat Anda berada di area layanan", "Diskusikan layanan yang sesuai untuk kunjungan rumah", "Sepakati waktu dan persiapan dengan tim"],
    preparation: "Sampaikan area tempat tinggal dan perawatan yang ingin dilakukan di rumah.",
  },
  preventive: {
    includes: ["Bandingkan manfaat paket perawatan", "Diskusikan rutinitas dan kebutuhan hewan", "Konfirmasikan harga dan ketentuan paket sebelum bergabung"],
    preparation: "Gunakan pencari paket untuk mengenali pilihan sebelum menghubungi tim.",
  },
};
