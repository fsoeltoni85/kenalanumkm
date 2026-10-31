"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, ChevronDown, MapPin } from "lucide-react";
import IndonesiaMap from "./components/IndonesiaMap";

const provinces = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau",
  "Jambi", "Sumatera Selatan", "Kepulauan Bangka Belitung", "Bengkulu", "Lampung",
  "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Daerah Istimewa Yogyakarta", "Jawa Timur", "Banten", "Bali",
  "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah",
  "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara",
  "Gorontalo", "Sulawesi Tengah", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tenggara",
  "Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Selatan", "Papua Tengah",
  "Papua Pegunungan", "Papua Barat Daya",
];

const citiesByProvince: Record<string, string[]> = {
  "Jawa Barat": ["Kota Bekasi", "Kabupaten Bekasi", "Kota Bandung", "Kabupaten Bandung", "Kota Depok", "Kota Bogor", "Kabupaten Bogor", "Kota Cirebon"],
  "DKI Jakarta": ["Kota Administrasi Jakarta Pusat", "Kota Administrasi Jakarta Barat", "Kota Administrasi Jakarta Selatan", "Kota Administrasi Jakarta Timur", "Kota Administrasi Jakarta Utara"],
  "Jawa Tengah": ["Kota Semarang", "Kota Surakarta", "Kabupaten Banyumas", "Kabupaten Tegal"],
  "Jawa Timur": ["Kota Surabaya", "Kota Malang", "Kabupaten Sidoarjo", "Kabupaten Jember"],
  Banten: ["Kota Tangerang", "Kota Tangerang Selatan", "Kabupaten Tangerang", "Kota Serang"],
  Bali: ["Kota Denpasar", "Kabupaten Badung", "Kabupaten Gianyar"],
  "Sumatera Utara": ["Kota Medan", "Kota Binjai", "Kabupaten Deli Serdang"],
  "Sulawesi Selatan": ["Kota Makassar", "Kota Parepare", "Kabupaten Gowa"],
};

const categories = [
  "Makanan & Minuman", "Fashion", "Retail", "Jasa", "Kecantikan",
  "Kesehatan", "Otomotif", "Pendidikan", "Lainnya",
];

const categoryNames: Record<string, string[]> = {
  "Makanan & Minuman": ["Martabak Simulasi", "Kedai Kopi Simulasi", "Bakso Simulasi", "Ayam Bakar Simulasi", "Roti Bakar Simulasi"],
  Fashion: ["Butik Simulasi", "Hijab Store Simulasi", "Streetwear Simulasi", "Batik Simulasi", "Sepatu Simulasi"],
  Retail: ["Toko Kelontong Simulasi", "Minimarket Simulasi", "Toko Plastik Simulasi", "Toko ATK Simulasi", "Toko Elektronik Simulasi"],
  Jasa: ["Laundry Simulasi", "Percetakan Simulasi", "Salon Simulasi", "Studio Foto Simulasi", "Jasa Jahit Simulasi"],
  Kecantikan: ["Beauty Studio Simulasi", "Barbershop Simulasi", "Nail Art Simulasi", "Skincare Store Simulasi", "Makeup Artist Simulasi"],
  Kesehatan: ["Apotek Simulasi", "Klinik Simulasi", "Optik Simulasi", "Praktik Gigi Simulasi", "Toko Herbal Simulasi"],
  Otomotif: ["Bengkel Motor Simulasi", "Cuci Mobil Simulasi", "Bengkel Mobil Simulasi", "Toko Ban Simulasi", "Variasi Motor Simulasi"],
  Pendidikan: ["Bimbel Simulasi", "Kursus Bahasa Simulasi", "Kursus Musik Simulasi", "Toko Buku Simulasi", "Les Privat Simulasi"],
  Lainnya: ["Usaha Lokal Simulasi 1", "Usaha Lokal Simulasi 2", "Usaha Lokal Simulasi 3", "Usaha Lokal Simulasi 4", "Usaha Lokal Simulasi 5"],
};

const dates = [
  { value: "2026-10-31", label: "31 Okt 2026 · Live" },
  { value: "2026-10-30", label: "30 Okt 2026" },
  { value: "2026-10-29", label: "29 Okt 2026" },
  { value: "2026-10-28", label: "28 Okt 2026" },
  { value: "2026-10-27", label: "27 Okt 2026" },
  { value: "2026-10-26", label: "26 Okt 2026" },
];

type Period = "all-time" | "today" | "daily";

type Entry = {
  id: number;
  name: string;
  initial: string;
  allTime: number;
  today: number;
  daily: Record<string, number>;
  clicks: number;
  todayClicks: number;
  dailyClicks: Record<string, number>;
};

const allTimeValues = [14500000, 12200000, 9700000, 7800000, 6200000];
const todayValues = [1900000, 1450000, 980000, 720000, 510000];
const clicksValues = [2481, 1940, 1620, 1190, 870];
const todayClicksValues = [172, 143, 98, 76, 51];

function makeEntries(category: string): Entry[] {
  const names = categoryNames[category] ?? categoryNames["Lainnya"];
  return names.map((name, index) => ({
    id: index + 1,
    name,
    initial: name.charAt(0).toUpperCase(),
    allTime: allTimeValues[index],
    today: todayValues[index],
    daily: {
      "2026-10-31": [1250000, 980000, 750000, 420000, 310000][index],
      "2026-10-30": [1700000, 1120000, 910000, 680000, 440000][index],
      "2026-10-29": [980000, 850000, 640000, 520000, 290000][index],
      "2026-10-28": [1450000, 920000, 770000, 510000, 380000][index],
      "2026-10-27": [1100000, 940000, 690000, 470000, 350000][index],
      "2026-10-26": [890000, 780000, 610000, 430000, 280000][index],
    },
    clicks: clicksValues[index],
    todayClicks: todayClicksValues[index],
    dailyClicks: {
      "2026-10-31": [105, 82, 66, 41, 30][index],
      "2026-10-30": [128, 91, 71, 53, 38][index],
      "2026-10-29": [83, 69, 55, 44, 25][index],
      "2026-10-28": [102, 76, 62, 39, 29][index],
      "2026-10-27": [91, 73, 58, 36, 24][index],
      "2026-10-26": [75, 61, 47, 32, 20][index],
    },
  }));
}

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function compactNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export default function HomePage() {
  const [province, setProvince] = useState("Jawa Barat");
  const [city, setCity] = useState("Kota Bekasi");
  const [category, setCategory] = useState("Makanan & Minuman");
  const [period, setPeriod] = useState<Period>("all-time");
  const [dailyDate, setDailyDate] = useState("2026-10-30");

  const cityOptions = useMemo(() => citiesByProvince[province] ?? [], [province]);
  const rows = useMemo(() => makeEntries(category).sort((a, b) => {
    const valueA = period === "all-time" ? a.allTime : period === "today" ? a.today : (a.daily[dailyDate] ?? 0);
    const valueB = period === "all-time" ? b.allTime : period === "today" ? b.today : (b.daily[dailyDate] ?? 0);
    return valueB - valueA;
  }), [category, period, dailyDate]);

  function chooseProvince(nextProvince: string) {
    setProvince(nextProvince);
    setCity(citiesByProvince[nextProvince]?.[0] ?? "");
  }

  function entryStake(entry: Entry) {
    return period === "all-time" ? entry.allTime : period === "today" ? entry.today : (entry.daily[dailyDate] ?? 0);
  }

  function entryClicks(entry: Entry) {
    return period === "all-time" ? entry.clicks : period === "today" ? entry.todayClicks : (entry.dailyClicks[dailyDate] ?? 0);
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-[#202a24]">
      <header className="sticky top-0 z-20 border-b border-[#e8ece8] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="/" className="flex shrink-0 items-center gap-2.5" aria-label="KenalanUMKM beranda">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#147b51] text-sm font-black text-white">K</span>
            <span className="text-[17px] font-extrabold tracking-[-0.05em]">Kenalan<span className="text-[#16845a]">UMKM</span></span>
          </a>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-[#fff5df] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.1em] text-[#94681b] sm:inline-flex">Data simulasi</span>
            <a href="#daftarkan" className="inline-flex items-center gap-1.5 rounded-full bg-[#147b51] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#0d6843]">
              Daftarkan UMKM <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1600px] px-3 py-4 sm:px-5 lg:px-7">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#758078]">
            <span>Indonesia</span><span className="text-[#bbc4bd]">/</span>
            <span>{province}</span><span className="text-[#bbc4bd]">/</span>
            <strong className="text-[#29372e]">{city || "Pilih Kabupaten/Kota"}</strong>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select aria-label="Provinsi" value={province} onChange={(event) => chooseProvince(event.target.value)} className="max-w-[145px] appearance-none rounded-full border border-[#e1e7e2] bg-white py-2 pl-3 pr-8 text-[11px] font-semibold outline-none focus:border-[#16845a]">
                {provinces.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#748179]" />
            </div>
            <div className="relative">
              <select aria-label="Kabupaten/Kota" value={city} disabled={!cityOptions.length} onChange={(event) => setCity(event.target.value)} className="max-w-[165px] appearance-none rounded-full border border-[#e1e7e2] bg-white py-2 pl-3 pr-8 text-[11px] font-semibold outline-none focus:border-[#16845a] disabled:opacity-50">
                {cityOptions.length ? cityOptions.map((item) => <option key={item} value={item}>{item}</option>) : <option value="">Pilih area demo</option>}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#748179]" />
            </div>
          </div>
        </div>

        <div className="grid items-stretch gap-3 xl:grid-cols-[minmax(0,1fr)_430px]">
          <section className="relative min-h-[400px] overflow-hidden rounded-[1.35rem] border border-[#dce7df] bg-[#e8f2f3] shadow-sm lg:min-h-[640px]" aria-label="Peta Indonesia">
            <IndonesiaMap activeProvince={province} onProvinceSelect={chooseProvince} />
            <div className="absolute bottom-4 right-4 z-[2] rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] text-[#66766d] shadow-sm">
              <MapPin size={11} className="mr-1 inline-block" />38 provinsi
            </div>
          </section>

          <aside className="flex min-h-[580px] flex-col overflow-hidden rounded-[1.35rem] border border-[#e3e9e4] bg-white shadow-sm">
            <div className="border-b border-[#edf0ed] px-4 pb-3 pt-4 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#87938b]">{city ? "Leaderboard kota" : "Leaderboard"}</div>
                  <h1 className="mt-1 truncate text-[22px] font-black leading-tight tracking-[-.045em]">{city || "Pilih Kota"}</h1>
                </div>
                </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={category === item
                      ? "rounded-full bg-[#187a51] px-3 py-1.5 text-[10px] font-bold text-white"
                      : "rounded-full bg-[#f3f5f3] px-3 py-1.5 text-[10px] font-semibold text-[#65736a] transition hover:bg-[#e9efeb]"}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-b border-[#edf0ed] px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-1 rounded-full bg-[#f3f5f3] p-1" role="tablist" aria-label="Periode leaderboard">
                <button type="button" role="tab" aria-selected={period === "all-time"} onClick={() => setPeriod("all-time")} className={period === "all-time" ? "rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold text-[#202a24] shadow-sm" : "rounded-full px-3 py-1.5 text-[10px] font-semibold text-[#77837b]"}>All Time</button>
                <button type="button" role="tab" aria-selected={period === "today"} onClick={() => setPeriod("today")} className={period === "today" ? "rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold text-[#202a24] shadow-sm" : "rounded-full px-3 py-1.5 text-[10px] font-semibold text-[#77837b]"}>Hari Ini</button>
                <button type="button" role="tab" aria-selected={period === "daily"} onClick={() => setPeriod("daily")} className={period === "daily" ? "rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold text-[#202a24] shadow-sm" : "rounded-full px-3 py-1.5 text-[10px] font-semibold text-[#77837b]"}>Harian</button>
              </div>
              {period === "today" && <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-[#238455]"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#20a15c]" />LIVE</span>}
              {period === "daily" && (
                <div className="relative">
                  <CalendarDays size={12} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#758078]" />
                  <select aria-label="Tanggal leaderboard harian" value={dailyDate} onChange={(event) => setDailyDate(event.target.value)} className="max-w-[115px] appearance-none rounded-full border border-[#e3e9e4] bg-white py-1.5 pl-7 pr-2 text-[9px] font-semibold text-[#4f5b53] outline-none">
                    {dates.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-2 bg-[#fafbfa] px-4 py-2 text-[9px] font-extrabold uppercase tracking-[.1em] text-[#929c95] sm:px-5">
              <span>#</span><span>UMKM</span><span className="text-right">Stake</span>
            </div>

            <div className="flex-1">
              {rows.map((entry, index) => (
                <article key={entry.id} className={index < 3 ? "grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-2 border-b border-[#edf0ed] bg-[#f8fbf8] px-4 py-3 sm:px-5" : "grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-2 border-b border-[#edf0ed] px-4 py-3 sm:px-5"}>
                  <span className={index === 0 ? "text-[16px] font-black tabular-nums text-[#187a51]" : "text-[13px] font-bold tabular-nums text-[#8c9790]"}>{String(index + 1).padStart(2, "0")}</span>
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className={index === 0 ? "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e0f0e5] text-[12px] font-black text-[#187a51]" : "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f0f3f0] text-[12px] font-bold text-[#68766e]"}>
                      {entry.initial}
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-[12px] font-extrabold text-[#26342b]">{entry.name}</h2>
                      <p className="mt-0.5 truncate text-[9px] text-[#87928b]">{city || "Kabupaten/Kota"}</p>
                    </div>
                  </div>
                  <div className="whitespace-nowrap text-right">
                    <div className="text-[12px] font-extrabold tabular-nums text-[#187a51]">{rupiah(entryStake(entry))}</div>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-[#edf0ed] px-4 py-3 text-[9px] text-[#929c95] sm:px-5">
              <span>1–{rows.length} dari {rows.length}</span>
              <span>{period === "all-time" ? "Sepanjang waktu" : period === "today" ? "Hari berjalan" : dates.find((item) => item.value === dailyDate)?.label}</span>
            </div>
          </aside>
        </div>
      </section>

      <footer id="daftarkan" className="border-t border-[#e8ece8] bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-4 text-[10px] text-[#849087] sm:px-6 lg:px-8">
          <span><strong className="text-[#415147]">KenalanUMKM</strong> · Indonesia</span>
          <span className="font-semibold text-[#147b51]">Daftarkan usaha ↗</span>
        </div>
      </footer>
    </main>
  );
}
