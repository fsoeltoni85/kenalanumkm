export type Period = "all-time" | "today" | "daily";
export type Scope = "indonesia" | "province" | "city";

export const PROVINCES = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau",
  "Jambi", "Sumatera Selatan", "Kepulauan Bangka Belitung", "Bengkulu", "Lampung",
  "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Daerah Istimewa Yogyakarta", "Jawa Timur", "Banten", "Bali",
  "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah",
  "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara",
  "Gorontalo", "Sulawesi Tengah", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tenggara",
  "Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Selatan", "Papua Tengah",
  "Papua Pegunungan", "Papua Barat Daya",
] as const;

export const CATEGORIES = [
  { name: "Makanan & Minuman", icon: "🍜" },
  { name: "Fashion", icon: "👕" },
  { name: "Retail", icon: "🛍️" },
  { name: "Jasa", icon: "🧰" },
  { name: "Kecantikan", icon: "💅" },
  { name: "Kesehatan", icon: "💊" },
  { name: "Otomotif", icon: "🛵" },
  { name: "Pendidikan", icon: "📚" },
  { name: "Lainnya", icon: "✨" },
] as const;

export const DAILY_DATES = [
  { value: "2026-11-01", label: "1 Nov 2026" },
  { value: "2026-10-31", label: "31 Okt 2026" },
  { value: "2026-10-30", label: "30 Okt 2026" },
  { value: "2026-10-29", label: "29 Okt 2026" },
  { value: "2026-10-28", label: "28 Okt 2026" },
] as const;

export type CityChampion = {
  id: string;
  city: string;
  province: string;
  name: string;
  initial: string;
  allTimeStake: number;
  todayStake: number;
  dailyStake: Record<string, number>;
  clicks: number;
  todayClicks: number;
  dailyClicks: Record<string, number>;
  isDemo: true;
};

export type LeaderboardRow = CityChampion & {
  rank: number;
  nationalRank: number;
  stake: number;
  periodClicks: number;
};

export type LeaderboardFilter = {
  scope: Scope;
  period: Period;
  dailyDate: string;
  province?: string;
  city?: string;
};

const DEMO_CITIES = [
  { id: "kota-bekasi", city: "Kota Bekasi", province: "Jawa Barat" },
  { id: "kota-bandung", city: "Kota Bandung", province: "Jawa Barat" },
  { id: "kabupaten-bekasi", city: "Kabupaten Bekasi", province: "Jawa Barat" },
  { id: "kota-bogor", city: "Kota Bogor", province: "Jawa Barat" },
  { id: "kota-depok", city: "Kota Depok", province: "Jawa Barat" },
  { id: "kota-cirebon", city: "Kota Cirebon", province: "Jawa Barat" },
  { id: "kota-tangerang", city: "Kota Tangerang", province: "Banten" },
  { id: "kota-tangerang-selatan", city: "Kota Tangerang Selatan", province: "Banten" },
  { id: "kabupaten-tangerang", city: "Kabupaten Tangerang", province: "Banten" },
  { id: "kota-serang", city: "Kota Serang", province: "Banten" },
  { id: "kota-semarang", city: "Kota Semarang", province: "Jawa Tengah" },
  { id: "kota-surakarta", city: "Kota Surakarta", province: "Jawa Tengah" },
  { id: "kota-surabaya", city: "Kota Surabaya", province: "Jawa Timur" },
  { id: "kota-malang", city: "Kota Malang", province: "Jawa Timur" },
  { id: "kota-denpasar", city: "Kota Denpasar", province: "Bali" },
  { id: "kota-medan", city: "Kota Medan", province: "Sumatera Utara" },
  { id: "kota-binjai", city: "Kota Binjai", province: "Sumatera Utara" },
  { id: "kota-makassar", city: "Kota Makassar", province: "Sulawesi Selatan" },
  { id: "kota-balikpapan", city: "Kota Balikpapan", province: "Kalimantan Timur" },
  { id: "kota-yogyakarta", city: "Kota Yogyakarta", province: "Daerah Istimewa Yogyakarta" },
] as const;

const BUSINESS_NAMES: Record<string, string[]> = {
  "Makanan & Minuman": ["Martabak", "Kedai Kopi", "Bakso", "Ayam Bakar", "Roti Bakar", "Soto", "Pempek", "Nasi Padang", "Mie Ayam", "Seblak", "Es Teh", "Rujak", "Sate", "Ayam Geprek", "Dimsum", "Pecel", "Sop Iga", "Bubur", "Jus Buah", "Lontong Sayur"],
  Fashion: ["Butik", "Hijab Store", "Streetwear", "Batik", "Sepatu", "Tas", "Baju Anak", "Thrift Store", "Konveksi", "Kebaya", "Jeans", "Aksesoris", "Seragam", "Sandal", "Busana Muslim", "Jersey", "Pakaian Pria", "Pakaian Wanita", "Rajut", "Fashion Anak"],
  Retail: ["Toko Kelontong", "Minimarket", "Toko Plastik", "Toko ATK", "Toko Elektronik", "Toko Bangunan", "Toko Buah", "Toko Beras", "Toko Frozen Food", "Toko Mainan", "Toko Pancing", "Toko Pertanian", "Toko Perabot", "Toko Kosmetik", "Toko Ponsel", "Toko Buku", "Toko Listrik", "Toko Kue", "Toko Oleh-Oleh", "Toko Hewan"],
  Jasa: ["Laundry", "Percetakan", "Salon", "Studio Foto", "Jasa Jahit", "Cuci Sepatu", "Service AC", "Tukang Kunci", "Rental Mobil", "Barbershop", "Cuci Karpet", "Servis Elektronik", "Bengkel Las", "Jasa Pindahan", "Dekorasi", "Wedding Organizer", "Jasa Kebersihan", "Reparasi Tas", "Jasa Antar", "Servis Komputer"],
  Kecantikan: ["Beauty Studio", "Barbershop", "Nail Art", "Skincare Store", "Makeup Artist", "Salon Muslimah", "Eyelash Studio", "Spa", "Brow Studio", "Hair Treatment", "Facial Studio", "Lash & Brow", "Skin Clinic", "Body Care", "Makeup Studio", "Waxing Studio", "Hair Color", "Nail Studio", "Beauty Lounge", "Parfum Store"],
  Kesehatan: ["Apotek", "Klinik", "Optik", "Praktik Gigi", "Toko Herbal", "Lab Kesehatan", "Klinik Ibu Anak", "Fisioterapi", "Toko Alat Medis", "Praktik Bidan", "Klinik Kulit", "Toko Vitamin", "Klinik Mata", "Klinik Pratama", "Terapi Wicara", "Klinik Hewan", "Praktik Dokter", "Toko Kacamata", "Pusat Bekam", "Klinik Gigi"],
  Otomotif: ["Bengkel Motor", "Cuci Mobil", "Bengkel Mobil", "Toko Ban", "Variasi Motor", "Bengkel AC Mobil", "Salon Mobil", "Toko Oli", "Toko Sparepart", "Bengkel Las", "Derek Mobil", "Toko Helm", "Rental Motor", "Tambal Ban", "Bengkel Knalpot", "Car Audio", "Toko Aki", "Bengkel Vespa", "Bengkel Body", "Cuci Motor"],
  Pendidikan: ["Bimbel", "Kursus Bahasa", "Kursus Musik", "Toko Buku", "Les Privat", "Kursus Komputer", "Kursus Mengemudi", "Taman Baca", "Kursus Menjahit", "Kursus Tari", "Kursus Menggambar", "Kursus Coding", "Kursus Fotografi", "Bimbel SD", "Bimbel UTBK", "Kursus Kerajinan", "Kursus Memasak", "Kursus Public Speaking", "Playgroup", "Kursus Kaligrafi"],
  Lainnya: Array.from({ length: 20 }, (_, index) => "Usaha Lokal " + (index + 1)),
};

const ALL_TIME_STAKES = [54_500_000, 48_200_000, 43_700_000, 39_400_000, 35_800_000, 32_500_000, 29_700_000, 27_300_000, 24_900_000, 22_700_000, 20_600_000, 18_800_000, 17_100_000, 15_600_000, 14_200_000, 12_900_000, 11_700_000, 10_600_000, 9_500_000, 8_400_000];
const TODAY_STAKES = [4_800_000, 6_300_000, 3_900_000, 5_700_000, 4_400_000, 5_100_000, 3_600_000, 4_900_000, 3_200_000, 4_200_000, 2_900_000, 3_800_000, 2_600_000, 3_400_000, 2_300_000, 3_000_000, 2_100_000, 2_700_000, 1_900_000, 1_600_000];

export function createDemoCityChampions(category: string): CityChampion[] {
  const names = BUSINESS_NAMES[category] ?? BUSINESS_NAMES.Lainnya;
  return DEMO_CITIES.map((location, index) => {
    const allTimeStake = ALL_TIME_STAKES[index];
    const todayStake = TODAY_STAKES[index];
    const dailyStake = Object.fromEntries(DAILY_DATES.map((date, dateIndex) => {
      const rotatedStake = TODAY_STAKES[(index + dateIndex * 3) % TODAY_STAKES.length];
      return [date.value, Math.round(rotatedStake * (0.64 + dateIndex * 0.075))];
    }));
    const clicks = 3_820 - index * 143;
    const todayClicks = 286 - index * 9;
    const dailyClicks = Object.fromEntries(DAILY_DATES.map((date, dateIndex) => [
      date.value,
      Math.max(4, Math.round((todayClicks + dateIndex * 13) * (0.72 + dateIndex * 0.06))),
    ]));
    const name = names[index % names.length] + " Simulasi";
    return {
      id: location.id,
      city: location.city,
      province: location.province,
      name,
      initial: name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
      allTimeStake,
      todayStake,
      dailyStake,
      clicks,
      todayClicks,
      dailyClicks,
      isDemo: true,
    };
  });
}

function stakeFor(champion: CityChampion, period: Period, dailyDate: string) {
  if (period === "today") return champion.todayStake;
  if (period === "daily") return champion.dailyStake[dailyDate] ?? 0;
  return champion.allTimeStake;
}

function clicksFor(champion: CityChampion, period: Period, dailyDate: string) {
  if (period === "today") return champion.todayClicks;
  if (period === "daily") return champion.dailyClicks[dailyDate] ?? 0;
  return champion.clicks;
}

export function buildLeaderboard(champions: CityChampion[], filter: LeaderboardFilter): LeaderboardRow[] {
  const nationalRows = [...champions]
    .sort((left, right) => stakeFor(right, filter.period, filter.dailyDate) - stakeFor(left, filter.period, filter.dailyDate))
    .map((champion, index) => ({
      ...champion,
      rank: index + 1,
      nationalRank: index + 1,
      stake: stakeFor(champion, filter.period, filter.dailyDate),
      periodClicks: clicksFor(champion, filter.period, filter.dailyDate),
    }));

  let scopedRows = nationalRows;
  if (filter.scope === "province") scopedRows = nationalRows.filter((row) => row.province === filter.province);
  if (filter.scope === "city") scopedRows = nationalRows.filter((row) => row.city === filter.city);

  return scopedRows.map((row, index) => ({ ...row, rank: index + 1 }));
}
