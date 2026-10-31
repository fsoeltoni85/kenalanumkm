"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, ChevronDown, Eye, Flame, MapPin, Trophy } from "lucide-react";
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

function shortRupiah(value: number) {
  if (value >= 1000000) return "Rp" + (value / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jt";
  if (value >= 1000) return "Rp" + (value / 1000).toLocaleString("id-ID", { maximumFractionDigits: 0 }) + " rb";
  return rupiah(value);
}

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
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

  const entryStake = (entry: Entry) => period === "all-time" ? entry.allTime : period === "today" ? entry.today : (entry.daily[dailyDate] ?? 0);
  const entryClicks = (entry: Entry) => period === "all-time" ? entry.clicks : period === "today" ? entry.todayClicks : (entry.dailyClicks[dailyDate] ?? 0);
  const totalStake = rows.reduce((sum, entry) => sum + entryStake(entry), 0);
  const totalClicks = rows.reduce((sum, entry) => sum + entryClicks(entry), 0);
  const mostClicked = [...rows].sort((a, b) => entryClicks(b) - entryClicks(a))[0];
  const categoryEmoji: Record<string, string> = {
    "Makanan & Minuman": "🍜", Fashion: "👕", Retail: "🛍️", Jasa: "🧰",
    Kecantikan: "💅", Kesehatan: "💊", Otomotif: "🛵", Pendidikan: "📚", Lainnya: "✨",
  };

  function chooseProvince(nextProvince: string) {
    setProvince(nextProvince);
    setCity(citiesByProvince[nextProvince]?.[0] ?? "");
  }

  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <a href="/" className="brand" aria-label="KenalanUMKM beranda">
            <span className="brand-mark">K</span>
            <span className="brand-name">Kenalan<span>UMKM</span></span>
          </a>
          <div className="header-right">
            <span className="demo-pill"><i /> DATA SIMULASI</span>
            <button type="button" className="join-button" disabled title="Belum aktif di preview">Ikut bersaing <ArrowUpRight size={15} /></button>
          </div>
        </div>
      </header>

      <section className="page-content">
        <div className="location-line">
          <div className="crumbs">
            <span>INDONESIA</span><span className="crumb-slash">/</span>
            <strong>{province}</strong><span className="crumb-slash">/</span>
            <strong className="current-city">{city || "Pilih Kabupaten/Kota"}</strong>
          </div>
          <div className="location-selects">
            <label className="select-wrap">
              <span className="sr-only">Provinsi</span>
              <select value={province} onChange={(event) => chooseProvince(event.target.value)}>
                {provinces.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <ChevronDown size={13} />
            </label>
            <label className="select-wrap">
              <span className="sr-only">Kabupaten/Kota</span>
              <select value={city} disabled={!cityOptions.length} onChange={(event) => setCity(event.target.value)}>
                {cityOptions.length ? cityOptions.map((item) => <option key={item} value={item}>{item}</option>) : <option value="">Area demo belum tersedia</option>}
              </select>
              <ChevronDown size={13} />
            </label>
          </div>
        </div>

        <div className="main-grid">
          <section className="leaderboard-card" aria-label="Leaderboard UMKM">
            <div className="board-heading">
              <div className="board-heading-top">
                <div>
                  <div className="eyebrow"><Trophy size={13} /> PAPAN PERINGKAT</div>
                  <h1>{city || "Pilih Kota"}</h1>
                  <div className="board-subtitle">{category} <span>·</span> {province}</div>
                </div>
                <span className="demo-sticker">CONTOH UI</span>
              </div>
              <div className="stake-summary">
                <div className="stake-total">
                  <span className="summary-label">TOTAL STAKE DI PAPAN</span>
                  <strong>{rupiah(totalStake)}</strong>
                </div>
                <div className="summary-stats">
                  <div><strong>{rows.length}</strong><span>UMKM</span></div>
                  <div><strong>{new Intl.NumberFormat("id-ID").format(totalClicks)}</strong><span><Eye size={11} /> KLIK</span></div>
                </div>
              </div>
            </div>

            <div className="category-strip" aria-label="Kategori UMKM">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={category === item ? "category-chip active" : "category-chip"}
                >
                  <span>{categoryEmoji[item]}</span>{item}
                </button>
              ))}
            </div>

            <div className="period-row">
              <div className="period-tabs" role="tablist" aria-label="Periode leaderboard">
                <button type="button" role="tab" aria-selected={period === "all-time"} onClick={() => setPeriod("all-time")} className={period === "all-time" ? "period-tab active" : "period-tab"}>All Time</button>
                <button type="button" role="tab" aria-selected={period === "today"} onClick={() => setPeriod("today")} className={period === "today" ? "period-tab active" : "period-tab"}>Hari Ini</button>
                <button type="button" role="tab" aria-selected={period === "daily"} onClick={() => setPeriod("daily")} className={period === "daily" ? "period-tab active" : "period-tab"}>Harian</button>
              </div>
              {period === "today" && <span className="live-pill"><i /> LIVE</span>}
              {period === "daily" && (
                <label className="date-select">
                  <CalendarDays size={13} />
                  <select aria-label="Tanggal leaderboard harian" value={dailyDate} onChange={(event) => setDailyDate(event.target.value)}>
                    {dates.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                  <ChevronDown size={12} />
                </label>
              )}
            </div>

            <div className="column-head">
              <span>POS</span><span>UMKM</span><span>STAKE</span><span>KLIK</span>
            </div>
            <div className="ranking-list">
              {rows.map((entry, index) => {
                const stake = entryStake(entry);
                const clicks = entryClicks(entry);
                const leaderStake = rows[0] ? entryStake(rows[0]) : 0;
                const share = leaderStake ? Math.max(8, (stake / leaderStake) * 100) : 0;
                return (
                  <article key={entry.id} className={"ranking-row rank-" + (index + 1)}>
                    <div className="rank-cell">
                      {index === 0 ? <span className="rank-medal">🥇</span> : index === 1 ? <span className="rank-medal">🥈</span> : index === 2 ? <span className="rank-medal">🥉</span> : <span className="rank-number">{String(index + 1).padStart(2, "0")}</span>}
                    </div>
                    <div className="business-cell">
                      <span className={"business-avatar avatar-" + (index + 1)}>{entry.initial}</span>
                      <div className="business-main">
                        <strong>{entry.name}</strong>
                        <span>{city || "Kabupaten/Kota"}</span>
                        <div className="stake-meter"><i style={{ width: share + "%" }} /></div>
                      </div>
                    </div>
                    <strong className="stake-value">{shortRupiah(stake)}</strong>
                    <span className="click-value">{new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(clicks)}</span>
                  </article>
                );
              })}
            </div>

            <div className="board-bottom">
              <span>1–{rows.length} <span className="muted">dari {rows.length} UMKM</span></span>
              <span>{period === "all-time" ? "Sepanjang waktu" : period === "today" ? "Hari berjalan" : dates.find((item) => item.value === dailyDate)?.label}</span>
            </div>
            {mostClicked && (
              <div className="most-clicked">
                <span className="most-clicked-icon"><Flame size={15} /></span>
                <span className="most-clicked-label">PALING BANYAK DIKLIK</span>
                <strong>{mostClicked.name}</strong>
                <b>{new Intl.NumberFormat("id-ID").format(entryClicks(mostClicked))} klik</b>
              </div>
            )}
          </section>

          <aside className="map-card" aria-label="Peta kompetisi Indonesia">
            <div className="map-card-heading">
              <div>
                <div className="eyebrow"><MapPin size={13} /> JELAJAHI WILAYAH</div>
                <h2>Peta Indonesia</h2>
              </div>
              <span className="province-count">38 PROVINSI</span>
            </div>
            <div className="map-frame">
              <IndonesiaMap activeProvince={province} onProvinceSelect={chooseProvince} />
            </div>
            <div className="map-card-foot">
              <span className="map-key" /><span>{province}</span>
              <span className="map-foot-note">Pilih provinsi di peta</span>
            </div>
            <div className="map-tip">
              <span>📍</span>
              <p>Pilih provinsi, lalu tentukan Kabupaten/Kota untuk melihat papan persaingannya.</p>
            </div>
          </aside>
        </div>
      </section>

      <footer id="daftarkan" className="site-footer">
        <div><strong>KenalanUMKM</strong><span> · Indonesia</span></div>
        <span>Seluruh angka pada preview adalah data simulasi.</span>
      </footer>
    </main>
  );
}
