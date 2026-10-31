"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronDown, Info, Trophy } from "lucide-react";
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

export default function HomePage() {
  const [province, setProvince] = useState("Jawa Barat");
  const [city, setCity] = useState("Kota Bekasi");
  const [category, setCategory] = useState("Makanan & Minuman");
  const cityOptions = useMemo(() => citiesByProvince[province] ?? [], [province]);

  function chooseProvince(nextProvince: string) {
    setProvince(nextProvince);
    setCity(citiesByProvince[nextProvince]?.[0] ?? "");
  }

  const locationReady = city.length > 0;

  return (
    <main className="min-h-screen bg-[#f5f7f4] text-[#17251d]">
      <header className="sticky top-0 z-20 border-b border-[#e4ebe5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <a href="/" className="flex shrink-0 items-center gap-2.5" aria-label="KenalanUMKM beranda">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#137b51] text-base font-black text-white">K</span>
            <span className="text-[18px] font-extrabold tracking-[-0.04em]">Kenalan<span className="text-[#16845a]">UMKM</span></span>
          </a>
          <nav className="hidden items-center gap-7 text-[13px] font-semibold text-[#68766e] md:flex">
            <a className="text-[#167d55]" href="#peta">Peta kompetisi</a>
            <a href="#cara-kerja" className="transition hover:text-[#167d55]">Cara kerja</a>
            <a href="#tentang" className="transition hover:text-[#167d55]">Tentang</a>
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-[#fff5df] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#94681b] sm:inline-flex">Preview · data contoh</span>
            <a href="#daftarkan" className="inline-flex items-center gap-1.5 rounded-xl bg-[#137b51] px-3.5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#0d6843] sm:px-4 sm:text-[13px]">
              Daftarkan UMKM <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1600px] px-4 pb-4 pt-7 sm:px-6 lg:px-8 lg:pt-9">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.2em] text-[#16845a]">Peta kompetisi UMKM Indonesia</p>
            <h1 className="text-[32px] font-black leading-[1.06] tracking-[-.055em] sm:text-[42px] lg:text-[48px]">
              Setiap kota punya<br className="hidden sm:block" /> panggungnya sendiri.
            </h1>
            <p className="mt-3 max-w-2xl text-[14px] leading-6 text-[#66746c] sm:text-[15px]">
              Jelajahi usaha lokal berdasarkan lokasi. Lihat siapa yang memimpin di setiap kategori melalui total stake terkonfirmasi.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl border border-[#e2e9e3] bg-white px-3 py-2 text-[11px] text-[#65736b] lg:self-auto">
            <Info size={14} className="text-[#16845a]" />
            Peringkat ditentukan oleh stake, bukan rating atau jumlah klik.
          </div>
        </div>

        <div id="peta" className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_370px]">
          <section className="relative min-h-[520px] overflow-hidden rounded-[1.7rem] border border-[#dce7df] bg-[#e8f2f3] shadow-[0_10px_35px_rgba(27,61,43,.06)] lg:min-h-[650px]" aria-label="Peta Indonesia">
            <IndonesiaMap activeProvince={province} onProvinceSelect={chooseProvince} />
          </section>

          <aside className="flex flex-col rounded-[1.7rem] border border-[#e2e9e3] bg-white p-4 shadow-[0_10px_35px_rgba(27,61,43,.045)] sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.13em] text-[#16845a]">
                <Trophy size={15} /> Leaderboard wilayah
              </div>
              <span className="rounded-full bg-[#fff5df] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#94681b]">Demo</span>
            </div>

            <label className="mb-1.5 text-[11px] font-bold text-[#6c7971]" htmlFor="province">Provinsi</label>
            <div className="relative mb-3">
              <select id="province" value={province} onChange={(event) => chooseProvince(event.target.value)} className="w-full appearance-none rounded-xl border border-[#e1e9e2] bg-[#fbfcfa] px-3.5 py-3 pr-9 text-[13px] font-semibold outline-none transition focus:border-[#16845a]">
                {provinces.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#748179]" />
            </div>

            <label className="mb-1.5 text-[11px] font-bold text-[#6c7971]" htmlFor="city">Kabupaten/Kota</label>
            <div className="relative mb-3">
              <select id="city" value={city} disabled={!cityOptions.length} onChange={(event) => setCity(event.target.value)} className="w-full appearance-none rounded-xl border border-[#e1e9e2] bg-[#fbfcfa] px-3.5 py-3 pr-9 text-[13px] font-semibold outline-none transition focus:border-[#16845a] disabled:cursor-not-allowed disabled:opacity-55">
                {cityOptions.length ? cityOptions.map((item) => <option key={item} value={item}>{item}</option>) : <option value="">Pilihan area demo belum tersedia</option>}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#748179]" />
            </div>

            <label className="mb-1.5 text-[11px] font-bold text-[#6c7971]" htmlFor="category">Kategori</label>
            <div className="relative mb-5">
              <select id="category" value={category} onChange={(event) => setCategory(event.target.value)} className="w-full appearance-none rounded-xl border border-[#e1e9e2] bg-[#fbfcfa] px-3.5 py-3 pr-9 text-[13px] font-semibold outline-none transition focus:border-[#16845a]">
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#748179]" />
            </div>

            <div className="mb-3 flex items-start justify-between gap-2 border-b border-[#edf1ed] pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#87938b]">Papan peringkat</p>
                <h2 className="mt-1 text-[19px] font-extrabold leading-tight tracking-[-.035em]">{locationReady ? city : "Pilih Kabupaten/Kota"}</h2>
                <p className="mt-1 text-[11px] text-[#77847c]">{category}</p>
              </div>
              <span className="mt-1 whitespace-nowrap rounded-lg bg-[#f1f6f2] px-2 py-1.5 text-[9px] font-bold text-[#357759]">Kota + kategori</span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9e5dc] bg-[#fafcf9] px-5 py-8 text-center">
              <span className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-[#eaf4ed] text-[#16845a]"><Trophy size={20} /></span>
              <h3 className="text-[14px] font-extrabold">Leaderboard belum tersedia</h3>
              <p className="mt-2 max-w-[250px] text-[11px] leading-5 text-[#78857d]">
                Tampilan ini belum terhubung ke data peserta dan stake nyata. Tidak ada peringkat atau nominal simulasi yang ditampilkan sebagai data aktif.
              </p>
            </div>

            <div className="mt-4 rounded-xl bg-[#f1f6f2] p-3.5">
              <p className="text-[11px] font-extrabold text-[#315b43]">Bagaimana peringkat ditentukan?</p>
              <p className="mt-1 text-[10px] leading-[1.6] text-[#64756a]">Urutan berdasarkan akumulasi stake yang sudah dikonfirmasi. Klik hanya ditampilkan sebagai statistik dan tidak memengaruhi posisi.</p>
            </div>
          </aside>
        </div>

        <div className="mt-4 flex flex-col justify-between gap-2 rounded-xl border border-[#e2e9e3] bg-white px-4 py-3 text-[10px] text-[#758178] sm:flex-row sm:items-center">
          <span><strong className="text-[#4f6056]">Catatan preview:</strong> geometri provinsi ditampilkan dari dataset GeoJSON; pilihan kota dan leaderboard belum memakai data produksi.</span>
          <span className="whitespace-nowrap">38 provinsi · Indonesia saja</span>
        </div>
      </section>

      <section id="cara-kerja" className="mx-auto max-w-[1600px] px-4 pb-14 pt-7 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#16845a]">Cara kerja</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-.045em] sm:text-[30px]">Kompetisi di tingkat kota.</h2>
          </div>
          <p className="max-w-md text-[12px] leading-5 text-[#748078]">Semua UMKM dalam kota dan kategori yang sama berada di papan peringkat yang sama—tanpa pembagian kompetisi sampai tingkat kecamatan atau kelurahan.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["01", "Jelajahi wilayah", "Mulai dari peta Indonesia, pilih provinsi, lalu Kabupaten/Kota."],
            ["02", "Pilih kategori", "Lihat UMKM yang bersaing dalam kategori yang sama di kota tersebut."],
            ["03", "Naikkan posisi", "Stake terkonfirmasi menentukan peringkat. Pemilik usaha dapat berpartisipasi saat fitur stake diluncurkan."],
          ].map(([number, title, description]) => (
            <article key={number} className="rounded-2xl border border-[#e2e9e3] bg-white p-5">
              <span className="text-[11px] font-black tracking-[.12em] text-[#16845a]">{number}</span>
              <h3 className="mt-3 text-[15px] font-extrabold">{title}</h3>
              <p className="mt-1.5 text-[12px] leading-5 text-[#748078]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="daftarkan" className="mx-auto max-w-[1600px] px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 rounded-[1.6rem] bg-[#123f2d] px-6 py-7 text-white sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#a7d7b9]">Untuk pemilik usaha</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-.04em]">Bawa usaha lokalmu ke peta.</h2>
            <p className="mt-2 max-w-xl text-[12px] leading-5 text-[#d0e3d6]">Pendaftaran dan verifikasi listing belum aktif di preview ini.</p>
          </div>
          <span className="inline-flex items-center gap-2 self-start rounded-xl border border-white/20 px-4 py-3 text-[12px] font-bold text-white/85 sm:self-auto">Segera hadir <ArrowDownRight size={15} /></span>
        </div>
      </section>

      <footer id="tentang" className="border-t border-[#e2e9e3] bg-white">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-6 text-[10px] leading-5 text-[#77847c] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span><strong className="text-[#34443a]">KenalanUMKM</strong> · Peta kompetisi UMKM Indonesia.</span>
          <span>Batas provinsi: denyherianto · <a className="underline" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a> · Sumber dan provenance perlu diverifikasi untuk produksi.</span>
        </div>
      </footer>
    </main>
  );
}
