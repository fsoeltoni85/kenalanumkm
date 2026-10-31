"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, ChevronDown, Eye, Search, Trophy } from "lucide-react";
import {
  buildLeaderboard,
  CATEGORIES,
  createDemoCityChampions,
  DAILY_DATES,
  PROVINCES,
  type Period,
  type Scope,
} from "./lib/leaderboard";

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value).replace(/\u00a0/g, " ");
}

function shortRupiah(value: number) {
  if (value >= 1_000_000) return "Rp" + (value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jt";
  if (value >= 1_000) return "Rp" + (value / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 }) + " rb";
  return rupiah(value);
}

export default function HomePage() {
  const [scope, setScope] = useState<Scope>("indonesia");
  const [province, setProvince] = useState("Jawa Barat");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("Makanan & Minuman");
  const [period, setPeriod] = useState<Period>("all-time");
  const [dailyDate, setDailyDate] = useState("2026-11-01");
  const [search, setSearch] = useState("");

  const champions = useMemo(() => createDemoCityChampions(category), [category]);
  const cityOptions = useMemo(
    () => champions.filter((champion) => champion.province === province).map((champion) => champion.city),
    [champions, province],
  );
  const allRows = useMemo(
    () => buildLeaderboard(champions, { scope, province, city, period, dailyDate }),
    [champions, scope, province, city, period, dailyDate],
  );
  const rows = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id-ID");
    if (!query) return allRows;
    return allRows.filter((row) =>
      row.name.toLocaleLowerCase("id-ID").includes(query) ||
      row.city.toLocaleLowerCase("id-ID").includes(query) ||
      row.province.toLocaleLowerCase("id-ID").includes(query),
    );
  }, [allRows, search]);

  const leader = rows[0];
  const boardTitle = scope === "indonesia"
    ? "Top 20 Indonesia"
    : scope === "province"
      ? "Juara kota di " + province
      : "Juara " + city;
  const boardDescription = scope === "indonesia"
    ? "Satu wakil juara dari setiap kabupaten/kota, diurutkan berdasarkan stake."
    : scope === "province"
      ? "Setiap baris adalah juara #1 dari satu kabupaten/kota di provinsi ini."
      : "Satu UMKM memegang posisi #1 di kabupaten/kota ini.";
  const selectedCategory = CATEGORIES.find((item) => item.name === category);

  function chooseProvince(nextProvince: string) {
    setProvince(nextProvince);
    setCity("");
    setScope("province");
    setSearch("");
  }

  function chooseCity(nextCity: string) {
    setCity(nextCity);
    setScope("city");
    setSearch("");
  }

  function chooseScope(nextScope: Scope) {
    setScope(nextScope);
    setSearch("");
  }

  const totalStake = rows.reduce((sum, row) => sum + row.stake, 0);
  const totalClicks = rows.reduce((sum, row) => sum + row.periodClicks, 0);

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
            <button type="button" className="join-button" disabled title="Pendaftaran dan aturan stake belum dibuka">
              Punya UMKM? Segera hadir <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </header>

      <section className="page-content">
        <section className="intro">
          <div className="intro-kicker"><Trophy size={13} /> PAPAN PERSAINGAN UMKM INDONESIA</div>
          <h1>Setiap kota punya <span>juara.</span></h1>
          <p>Para juara kabupaten/kota bersaing di papan Indonesia. Stake terkonfirmasi menentukan peringkat; klik hanya statistik.</p>
        </section>

        <section className="leaderboard-card" aria-label="Leaderboard UMKM Indonesia">
          <div className="board-toolbar">
            <div className="scope-tabs" role="tablist" aria-label="Lingkup leaderboard">
              <button type="button" role="tab" aria-selected={scope === "indonesia"} onClick={() => chooseScope("indonesia")} className={scope === "indonesia" ? "scope-tab active" : "scope-tab"}>
                Indonesia
              </button>
              <button type="button" role="tab" aria-selected={scope === "province"} onClick={() => chooseScope("province")} className={scope === "province" ? "scope-tab active" : "scope-tab"}>
                Provinsi
              </button>
              <button type="button" role="tab" aria-selected={scope === "city"} disabled={!city} onClick={() => chooseScope("city")} className={scope === "city" ? "scope-tab active" : "scope-tab"}>
                Kab/Kota
              </button>
            </div>
            <div className="geo-selectors">
              <label className="select-wrap">
                <span className="sr-only">Pilih provinsi</span>
                <select value={province} onChange={(event) => chooseProvince(event.target.value)}>
                  {PROVINCES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <ChevronDown size={13} />
              </label>
              <label className="select-wrap">
                <span className="sr-only">Pilih kabupaten atau kota</span>
                <select value={city} onChange={(event) => chooseCity(event.target.value)} disabled={cityOptions.length === 0}>
                  <option value="">Pilih Kabupaten/Kota</option>
                  {cityOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <ChevronDown size={13} />
              </label>
            </div>
          </div>

          <div className="category-row" aria-label="Kategori UMKM">
            {CATEGORIES.map((item) => (
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
            {period === "daily" && (
              <label className="date-select">
                <CalendarDays size={13} />
                <select aria-label="Tanggal leaderboard harian" value={dailyDate} onChange={(event) => setDailyDate(event.target.value)}>
                  {DAILY_DATES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <ChevronDown size={12} />
              </label>
            )}
            {period === "today" && <span className="period-note">Periode hari ini</span>}
          </div>

          <div className="board-heading">
            <div>
              <div className="eyebrow">LEADERBOARD UMKM <span>·</span> {selectedCategory?.icon} {category}</div>
              <h2>{boardTitle}</h2>
              <p>{boardDescription}</p>
            </div>
            <div className="board-count">
              <strong>{rows.length}</strong>
              <span>JUARA KOTA</span>
            </div>
          </div>

          {leader && (
            <div className="leader-spotlight">
              <div className="spotlight-rank">
                <span>{scope === "city" ? "JUARA #1 KOTA" : "PEMIMPIN PAPAN"}</span>
                <strong>{scope === "city" ? "1" : leader.rank}</strong>
              </div>
              <div className="spotlight-business">
                <span className="spotlight-avatar">{leader.initial}</span>
                <div>
                  <strong>{leader.name}</strong>
                  <span>{leader.city} · {leader.province}</span>
                </div>
              </div>
              <div className="spotlight-stake">
                <span>STAKE</span>
                <strong>{rupiah(leader.stake)}</strong>
                <small>{scope === "city" ? "Peringkat #" + leader.nationalRank + " Indonesia" : scope === "province" ? "Juara #1 kota · peringkat #" + leader.nationalRank + " Indonesia" : "Stake tertinggi di papan Indonesia"}</small>
              </div>
            </div>
          )}

          <div className="list-tools">
            <div className="list-heading">
              <strong>{scope === "city" ? "Juara kota" : "Peringkat juara kota"}</strong>
              <span>{rows.length} hasil · {period === "all-time" ? "All Time" : period === "today" ? "Hari Ini" : DAILY_DATES.find((item) => item.value === dailyDate)?.label}</span>
            </div>
            <label className="search-box">
              <Search size={14} />
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari UMKM atau kota…" aria-label="Cari UMKM atau kota" />
            </label>
          </div>

          <div className="column-head">
            <span>POS</span><span>JUARA KOTA</span><span>STAKE</span><span><Eye size={11} /> KLIK</span>
          </div>
          <div className="ranking-list" aria-live="polite">
            {rows.length > 0 ? rows.map((row) => (
              <article key={row.id} className={"ranking-row rank-" + Math.min(row.rank, 3)}>
                <div className="rank-cell">
                  {row.rank === 1 ? <span className="rank-medal">🥇</span> : row.rank === 2 ? <span className="rank-medal">🥈</span> : row.rank === 3 ? <span className="rank-medal">🥉</span> : <span className="rank-number">{String(row.rank).padStart(2, "0")}</span>}
                </div>
                <div className="business-cell">
                  <span className={"business-avatar avatar-" + Math.min(row.rank, 3)}>{row.initial}</span>
                  <div className="business-main">
                    <strong>{row.name}</strong>
                    <span>Juara #1 · {row.city} · {row.province} · #{row.nationalRank} Indonesia</span>
                  </div>
                </div>
                <strong className="stake-value">{shortRupiah(row.stake)}</strong>
                <span className="click-value">{new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(row.periodClicks)}</span>
              </article>
            )) : (
              <div className="empty-state">
                <strong>Belum ada juara simulasi di wilayah ini.</strong>
                <span>Data contoh saat ini hanya mencakup beberapa kabupaten/kota. Wilayah lain akan menampilkan papan kosong sampai data tersedia.</span>
              </div>
            )}
          </div>

          <div className="board-bottom">
            <span>1–{rows.length} <span className="muted">dari {rows.length} juara kota</span></span>
            <span className="board-total">Total stake {shortRupiah(totalStake)} · {new Intl.NumberFormat("id-ID").format(totalClicks)} klik</span>
          </div>
        </section>

        <section className="rules-strip">
          <div><strong>Stake terkonfirmasi</strong><span>satu-satunya dasar peringkat</span></div>
          <i />
          <div><strong>Klik</strong><span>statistik saja, bukan ranking</span></div>
          <i />
          <div><strong>Satu kota</strong><span>satu juara di papan nasional</span></div>
        </section>

        <div className="page-footnote">Data pada preview bersifat simulasi, bukan UMKM, transaksi, atau ranking terverifikasi.</div>
      </section>
    </main>
  );
}
