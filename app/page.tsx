"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, ChevronDown, Crosshair, Eye, MapPin, Trophy } from "lucide-react";
import IndonesiaMap, { type UserCoordinates } from "./components/IndonesiaMap";

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
  { name: "Makanan & Minuman", icon: "🍜" }, { name: "Fashion", icon: "👕" },
  { name: "Retail", icon: "🛍️" }, { name: "Jasa", icon: "🧰" },
  { name: "Kecantikan", icon: "💅" }, { name: "Kesehatan", icon: "💊" },
  { name: "Otomotif", icon: "🛵" }, { name: "Pendidikan", icon: "📚" },
  { name: "Lainnya", icon: "✨" },
];

const categoryNames: Record<string, string[]> = {
  "Makanan & Minuman": ["Martabak", "Kedai Kopi", "Bakso", "Ayam Bakar", "Roti Bakar", "Soto", "Pempek", "Nasi Padang", "Mie Ayam", "Seblak", "Es Teh", "Rujak", "Sate", "Ayam Geprek", "Dimsum", "Pecel", "Sop Iga", "Bubur", "Jus Buah", "Lontong Sayur"],
  Fashion: ["Butik", "Hijab Store", "Streetwear", "Batik", "Sepatu", "Tas", "Baju Anak", "Thrift Store", "Konveksi", "Kebaya", "Jeans", "Aksesoris", "Seragam", "Sandal", "Busana Muslim", "Jersey", "Pakaian Pria", "Pakaian Wanita", "Rajut", "Fashion Anak"],
  Retail: ["Toko Kelontong", "Minimarket", "Toko Plastik", "Toko ATK", "Toko Elektronik", "Toko Bangunan", "Toko Buah", "Toko Beras", "Toko Frozen Food", "Toko Mainan", "Toko Pancing", "Toko Pertanian", "Toko Perabot", "Toko Kosmetik", "Toko Ponsel", "Toko Buku", "Toko Listrik", "Toko Kue", "Toko Oleh-Oleh", "Toko Hewan"],
  Jasa: ["Laundry", "Percetakan", "Salon", "Studio Foto", "Jasa Jahit", "Cuci Sepatu", "Service AC", "Tukang Kunci", "Rental Mobil", "Barbershop", "Cuci Karpet", "Servis Elektronik", "Bengkel Las", "Jasa Pindahan", "Dekorasi", "Wedding Organizer", "Jasa Kebersihan", "Reparasi Tas", "Jasa Antar", "Servis Komputer"],
  Kecantikan: ["Beauty Studio", "Barbershop", "Nail Art", "Skincare Store", "Makeup Artist", "Salon Muslimah", "Eyelash Studio", "Spa", "Brow Studio", "Hair Treatment", "Facial Studio", "Lash & Brow", "Skin Clinic", "Body Care", "Makeup Studio", "Waxing Studio", "Hair Color", "Nail Studio", "Beauty Lounge", "Parfum Store"],
  Kesehatan: ["Apotek", "Klinik", "Optik", "Praktik Gigi", "Toko Herbal", "Lab Kesehatan", "Klinik Ibu Anak", "Fisioterapi", "Toko Alat Medis", "Praktik Bidan", "Klinik Kulit", "Toko Vitamin", "Klinik Mata", "Klinik Pratama", "Terapi Wicara", "Klinik Hewan", "Praktik Dokter", "Toko Kacamata", "Pusat Bekam", "Klinik Gigi"],
  Otomotif: ["Bengkel Motor", "Cuci Mobil", "Bengkel Mobil", "Toko Ban", "Variasi Motor", "Bengkel AC Mobil", "Salon Mobil", "Toko Oli", "Toko Sparepart", "Bengkel Las", "Derek Mobil", "Toko Helm", "Rental Motor", "Tambal Ban", "Bengkel Knalpot", "Car Audio", "Toko Aki", "Bengkel Vespa", "Bengkel Body", "Cuci Motor"],
  Pendidikan: ["Bimbel", "Kursus Bahasa", "Kursus Musik", "Toko Buku", "Les Privat", "Kursus Komputer", "Kursus Mengemudi", "Taman Baca", "Kursus Menjahit", "Kursus Tari", "Kursus Menggambar", "Kursus Coding", "Kursus Fotografi", "Bimbel SD", "Bimbel UTBK", "Kursus Kerajinan", "Kursus Memasak", "Kursus Public Speaking", "Playgroup", "Kursus Kaligrafi"],
  Lainnya: Array.from({ length: 20 }, (_, i) => "Usaha Lokal " + (i + 1)),
};

const dates = [
  { value: "2026-10-31", label: "31 Okt 2026 · Live", factor: 1.0 },
  { value: "2026-10-30", label: "30 Okt 2026", factor: 1.22 },
  { value: "2026-10-29", label: "29 Okt 2026", factor: 0.78 },
  { value: "2026-10-28", label: "28 Okt 2026", factor: 1.08 },
  { value: "2026-10-27", label: "27 Okt 2026", factor: 0.92 },
  { value: "2026-10-26", label: "26 Okt 2026", factor: 0.72 },
];

type Period = "all-time" | "today" | "daily";
type Scope = "indonesia" | "province" | "city";
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

const scopeFactors: Record<Scope, number> = { indonesia: 2.6, province: 1.55, city: 1 };
function makeEntries(category: string, scope: Scope): Entry[] {
  const names = categoryNames[category] ?? categoryNames.Lainnya;
  const factor = scopeFactors[scope];
  return names.map((prefix, index) => {
    const taper = Math.pow(0.865, index);
    const allTime = Math.round((15_000_000 * taper + 180_000) * factor);
    const today = Math.round((2_050_000 * Math.pow(0.83, index) + 28_000) * factor);
    const daily = Object.fromEntries(dates.map((date) => [
      date.value,
      Math.round((1_400_000 * Math.pow(0.82, index) + 25_000) * date.factor * factor),
    ]));
    const clicks = Math.round((2_460 * Math.pow(0.84, index) + 20) * Math.sqrt(factor));
    const todayClicks = Math.round((170 * Math.pow(0.84, index) + 2) * Math.sqrt(factor));
    const dailyClicks = Object.fromEntries(dates.map((date) => [
      date.value,
      Math.round((105 * Math.pow(0.82, index) + 1) * date.factor * Math.sqrt(factor)),
    ]));
    return {
      id: index + 1,
      name: prefix + " Simulasi",
      initial: prefix.charAt(0).toUpperCase(),
      allTime, today, daily, clicks, todayClicks, dailyClicks,
    };
  });
}

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value).replace(/\u00a0/g, " ");
}
function shortRupiah(value: number) {
  if (value >= 1_000_000) return "Rp" + (value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jt";
  if (value >= 1_000) return "Rp" + (value / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 }) + " rb";
  return rupiah(value);
}

type LocationStatus = "checking" | "located" | "denied" | "unavailable" | "error";

export default function HomePage() {
  const [province, setProvince] = useState("Jawa Barat");
  const [city, setCity] = useState("Kota Bekasi");
  const [scope, setScope] = useState<Scope>("indonesia");
  const [category, setCategory] = useState("Makanan & Minuman");
  const [period, setPeriod] = useState<Period>("all-time");
  const [dailyDate, setDailyDate] = useState("2026-10-30");
  const [userLocation, setUserLocation] = useState<UserCoordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("checking");
  const [locationMessage, setLocationMessage] = useState("Memeriksa lokasi perangkat…");

  const cityOptions = useMemo(() => citiesByProvince[province] ?? [], [province]);
  const rows = useMemo(() => makeEntries(category, scope).sort((a, b) => {
    const valueA = period === "all-time" ? a.allTime : period === "today" ? a.today : (a.daily[dailyDate] ?? 0);
    const valueB = period === "all-time" ? b.allTime : period === "today" ? b.today : (b.daily[dailyDate] ?? 0);
    return valueB - valueA;
  }), [category, scope, period, dailyDate]);

  const entryStake = (entry: Entry) => period === "all-time" ? entry.allTime : period === "today" ? entry.today : (entry.daily[dailyDate] ?? 0);
  const entryClicks = (entry: Entry) => period === "all-time" ? entry.clicks : period === "today" ? entry.todayClicks : (entry.dailyClicks[dailyDate] ?? 0);
  const totalStake = rows.reduce((sum, entry) => sum + entryStake(entry), 0);
  const totalClicks = rows.reduce((sum, entry) => sum + entryClicks(entry), 0);
  const scopeTitle = scope === "indonesia" ? "Indonesia" : scope === "province" ? province : city;
  const scopeSubtitle = scope === "indonesia" ? "Seluruh Indonesia" : scope === "province" ? "Provinsi" : province;
  const selectedCategory = categories.find((item) => item.name === category);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      setLocationMessage("Browser tidak mendukung deteksi lokasi");
      return;
    }
    setLocationStatus("checking");
    setLocationMessage("Memeriksa lokasi perangkat…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocationStatus("located");
        setLocationMessage("Posisi perangkat ditemukan · mencari provinsi…");
      },
      (error) => {
        setUserLocation(null);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("denied");
          setLocationMessage("Izin lokasi belum diberikan");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationStatus("unavailable");
          setLocationMessage("Lokasi perangkat tidak tersedia");
        } else {
          setLocationStatus("error");
          setLocationMessage("Deteksi lokasi belum berhasil");
        }
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 5 * 60_000 },
    );
  }, []);

  useEffect(() => { detectLocation(); }, [detectLocation]);

  const handleProvinceDetected = useCallback((detectedProvince: string) => {
    if (province !== detectedProvince) setCity("");
    setProvince(detectedProvince);
    setLocationMessage("Kamu terdeteksi di " + detectedProvince);
  }, [province]);

  function chooseProvince(nextProvince: string) {
    setProvince(nextProvince);
    if (nextProvince !== province) setCity("");
    setScope("province");
  }

  function chooseCity(nextCity: string) {
    setCity(nextCity);
    setScope("city");
  }

  const locationTone = locationStatus === "located" ? "located" : locationStatus === "checking" ? "checking" : "needs-permission";
  const listTitle = scope === "indonesia" ? "Top 20 Indonesia" : scope === "province" ? "Top 20 " + province : "Top 20 " + city;

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
        <div className="location-toolbar">
          <div className="location-copy">
            <div className="location-kicker"><Crosshair size={12} /> LOKASI PERANGKAT</div>
            <strong className={locationTone}>{locationMessage}</strong>
            <span>Lokasi dipakai untuk menandai peta dan menyarankan provinsi. Tidak mencari alamat rumah.</span>
          </div>
          <div className="location-actions">
            <span className="crumbs"><span>INDONESIA</span><span>/</span><strong>{province}</strong><span>/</span><strong className="current-city">{city || "Pilih Kabupaten/Kota"}</strong></span>
            {locationStatus !== "checking" && <button type="button" className="locate-button" onClick={detectLocation}><Crosshair size={13} /> {locationStatus === "located" ? "Perbarui lokasi" : "Aktifkan lokasi"}</button>}
          </div>
        </div>

        <div className="main-grid">
          <section className="map-card" aria-label="Peta kompetisi Indonesia">
            <div className="map-card-heading">
              <div>
                <div className="eyebrow"><MapPin size={13} /> PETA KOMPETISI INDONESIA</div>
                <h1>Jelajahi peta UMKM</h1>
              </div>
              <span className="province-count">38 PROVINSI</span>
            </div>
            <div className="map-frame">
              <IndonesiaMap activeProvince={province} userLocation={userLocation} onProvinceSelect={chooseProvince} onProvinceDetected={handleProvinceDetected} />
            </div>
            <div className="map-legend">
              <span><i className="legend-selected" /> Provinsi dipilih</span>
              <span><i className="legend-user" /> Lokasi perangkat</span>
              <small>Klik provinsi untuk melihat Top 20 wilayah</small>
            </div>
            <div className="map-location-strip">
              <span className="map-location-icon"><MapPin size={15} /></span>
              <div><strong>{locationStatus === "located" ? locationMessage : "Pilih wilayah kompetisi"}</strong><small>{userLocation ? "Titik perangkat ditampilkan pada peta" : "Izinkan lokasi untuk menampilkan titik kamu di peta"}</small></div>
              <span className="map-location-arrow">↗</span>
            </div>
          </section>

          <section className="leaderboard-card" aria-label="Leaderboard UMKM">
            <div className="board-heading">
              <div className="board-heading-top">
                <div>
                  <div className="eyebrow"><Trophy size={13} /> LEADERBOARD UMKM</div>
                  <h2>{listTitle}</h2>
                  <div className="board-subtitle">{selectedCategory?.icon} {category} <span>·</span> {scopeSubtitle}</div>
                </div>
                <span className="demo-sticker">TOP 20</span>
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

            <div className="scope-strip" role="tablist" aria-label="Lingkup leaderboard">
              <button type="button" role="tab" aria-selected={scope === "indonesia"} onClick={() => setScope("indonesia")} className={scope === "indonesia" ? "scope-tab active" : "scope-tab"}>🇮🇩 Indonesia</button>
              <button type="button" role="tab" aria-selected={scope === "province"} onClick={() => setScope("province")} className={scope === "province" ? "scope-tab active" : "scope-tab"}>📍 Provinsi</button>
              <button type="button" role="tab" aria-selected={scope === "city"} disabled={!city} onClick={() => setScope("city")} className={scope === "city" ? "scope-tab active" : "scope-tab"}>🏙️ Kota/Kab</button>
            </div>

            <div className="scope-selectors">
              <label className="select-wrap">
                <span className="sr-only">Pilih provinsi</span>
                <select value={province} onChange={(event) => chooseProvince(event.target.value)}>
                  {provinces.map((item) => <option key={item} value={item}>{item}</option>)}
                </select><ChevronDown size={12} />
              </label>
              <label className="select-wrap city-select">
                <span className="sr-only">Pilih Kabupaten/Kota</span>
                <select value={city} onChange={(event) => chooseCity(event.target.value)}>
                  <option value="">Pilih Kabupaten/Kota</option>
                  {cityOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select><ChevronDown size={12} />
              </label>
            </div>

            <div className="category-strip" aria-label="Kategori UMKM">
              {categories.map((item) => (
                <button key={item.name} type="button" onClick={() => setCategory(item.name)} aria-pressed={category === item.name} className={category === item.name ? "category-chip active" : "category-chip"}>
                  <span>{item.icon}</span>{item.name}
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
                  </select><ChevronDown size={12} />
                </label>
              )}
            </div>

            <div className="column-head"><span>POS</span><span>UMKM</span><span>STAKE</span><span>KLIK</span></div>
            <div className="ranking-list">
              {rows.map((entry, index) => {
                const stake = entryStake(entry);
                const clicks = entryClicks(entry);
                const leaderStake = rows[0] ? entryStake(rows[0]) : 0;
                const share = leaderStake ? Math.max(4, (stake / leaderStake) * 100) : 0;
                return (
                  <article key={entry.id} className={"ranking-row rank-" + (index + 1)}>
                    <div className="rank-cell">
                      {index === 0 ? <span className="rank-medal">🥇</span> : index === 1 ? <span className="rank-medal">🥈</span> : index === 2 ? <span className="rank-medal">🥉</span> : <span className="rank-number">{String(index + 1).padStart(2, "0")}</span>}
                    </div>
                    <div className="business-cell">
                      <span className={"business-avatar avatar-" + (index + 1)}>{entry.initial}</span>
                      <div className="business-main">
                        <strong>{entry.name}</strong>
                        <span>{scope === "indonesia" ? "Indonesia" : scope === "province" ? province : city}</span>
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
          </section>
        </div>
      </section>

      <footer className="site-footer">
        <div><strong>KenalanUMKM</strong><span> · Indonesia</span></div>
        <span>Seluruh angka pada preview adalah data simulasi. · Peta: denyherianto / CC BY 4.0</span>
      </footer>
    </main>
  );
}
