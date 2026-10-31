"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Crown,
  Eye,
  MapPin,
  Medal,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Trophy,
  X,
} from "lucide-react";
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

function compactNumber(value: number) {
  return new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

// Prototype-only quote step. Final minimum increment remains a pricing decision.
const DEMO_CLAIM_INCREMENT = 10_000;

function periodLabel(period: Period, dailyDate: string) {
  if (period === "all-time") return "All Time";
  if (period === "today") return "Hari Ini";
  return DAILY_DATES.find((item) => item.value === dailyDate)?.label ?? dailyDate;
}


type GeoDropdownProps = {
  label: string;
  value: string;
  options: readonly string[];
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

function GeoDropdown({ label, value, options, placeholder, disabled = false, onChange }: GeoDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const labelId = useId();

  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    const optionButtons = root?.querySelectorAll<HTMLButtonElement>('[role="option"]');
    const selectedOption = Array.from(optionButtons ?? []).find((option) => option.getAttribute("aria-selected") === "true");
    const initialOption = selectedOption ?? optionButtons?.[0];
    initialOption?.focus();
    initialOption?.scrollIntoView({ block: "nearest" });

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector<HTMLButtonElement>(".geo-trigger")?.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function moveFocus(index: number, direction: "next" | "previous" | "first" | "last") {
    const optionsInMenu = Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? []);
    const targetIndex = direction === "first"
      ? 0
      : direction === "last"
        ? optionsInMenu.length - 1
        : index + (direction === "next" ? 1 : -1);
    optionsInMenu[Math.max(0, Math.min(optionsInMenu.length - 1, targetIndex))]?.focus();
  }

  return (
    <div className={open ? "geo-dropdown is-open" : "geo-dropdown"} ref={rootRef}>
      <span className="sr-only" id={labelId}>{label}</span>
      <button
        type="button"
        className="geo-trigger"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className={!value ? "geo-placeholder" : ""}>{value || placeholder}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="geo-menu" id={listboxId} role="listbox" aria-label={label}>
          {options.map((option, index) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
              className={value === option ? "geo-option selected" : "geo-option"}
              onClick={() => {
                onChange(option);
                setOpen(false);
                rootRef.current?.querySelector<HTMLButtonElement>(".geo-trigger")?.focus();
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  moveFocus(index, "next");
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  moveFocus(index, "previous");
                } else if (event.key === "Home") {
                  event.preventDefault();
                  moveFocus(index, "first");
                } else if (event.key === "End") {
                  event.preventDefault();
                  moveFocus(index, "last");
                }
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [scope, setScope] = useState<Scope>("indonesia");
  const [province, setProvince] = useState("Jawa Barat");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("Makanan & Minuman");
  const [period, setPeriod] = useState<Period>("all-time");
  const [dailyDate, setDailyDate] = useState("2026-11-01");
  const [search, setSearch] = useState("");
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [claimProvince, setClaimProvince] = useState(province);
  const [claimCity, setClaimCity] = useState(city);

  useEffect(() => {
    if (!registrationOpen) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRegistrationOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    document.getElementById("registration-close")?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [registrationOpen]);

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

  const selectedCategory = CATEGORIES.find((item) => item.name === category);
  const claimCityOptions = useMemo(
    () => champions.filter((champion) => champion.province === claimProvince).map((champion) => champion.city),
    [champions, claimProvince],
  );
  const claimChampion = useMemo(
    () => champions.find((champion) => champion.province === claimProvince && champion.city === claimCity) ?? null,
    [champions, claimProvince, claimCity],
  );
  const claimCurrentStake = claimChampion
    ? period === "today"
      ? claimChampion.todayStake
      : period === "daily"
        ? claimChampion.dailyStake[dailyDate] ?? 0
        : claimChampion.allTimeStake
    : null;
  const claimPrice = claimCurrentStake === null ? null : claimCurrentStake + DEMO_CLAIM_INCREMENT;
  const boardTitle = scope === "indonesia"
    ? "Top 20 Indonesia"
    : scope === "province"
      ? "Juara kota di " + province
      : "Juara " + city;
  const boardDescription = scope === "indonesia"
    ? "Juara dari tiap kabupaten/kota bersaing di papan nasional. Urutan ditentukan stake terkonfirmasi."
    : scope === "province"
      ? "Lihat siapa yang sedang #1 di tiap kabupaten/kota di provinsi ini."
      : "Lihat UMKM yang sedang memimpin di kabupaten/kota ini.";

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

  const selectedBusiness = rows.find((row) => row.id === selectedBusinessId) ?? null;
  const topThree = scope === "city" || search.trim() ? [] : rows.slice(0, 3);
  const showCityChampion = scope === "city" && !search.trim() && rows.length > 0;
  const listRows = topThree.length > 0 ? rows.slice(3) : showCityChampion ? [] : rows;
  const totalStake = rows.reduce((sum, row) => sum + row.stake, 0);
  const totalClicks = rows.reduce((sum, row) => sum + row.periodClicks, 0);

  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <a href="/" className="brand" aria-label="KenalanUMKM beranda">
            <span className="brand-mark"><span>K</span><i /></span>
            <span className="brand-name">Kenalan<span>UMKM</span></span>
          </a>
          <div className="header-right">
            <span className="demo-pill"><i /> DATA SIMULASI</span>
            <button
              type="button"
              className="join-button"
              onClick={() => {
                setClaimProvince(province);
                setClaimCity(city);
                setRegistrationOpen(true);
              }}
              aria-haspopup="dialog"
              aria-expanded={registrationOpen}
            >
              <Store size={15} />
              Klaim #1
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </header>

      <section className="page-content">
        <section className="intro">
          <div className="intro-kicker"><span className="kicker-icon"><Trophy size={14} /></span> PAY-TO-RANK UMKM INDONESIA</div>
          <h1>Rebut <span>#1 di kotamu.</span></h1>
          <p>Pasang stake, incar posisi teratas. Ini papan pay-to-rank yang terbuka: makin tinggi stake terkonfirmasi, makin tinggi posisi. Juara kota ikut bersaing di papan nasional.</p>
          <div className="intro-tags">
            <span><CheckCircle2 size={13} /> Stake menentukan posisi</span>
            <span><Sparkles size={13} /> Klik cuma statistik</span>
            <span><Trophy size={13} /> Satu juara per kota</span>
          </div>
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
              <GeoDropdown
                label="Pilih provinsi"
                value={province}
                options={PROVINCES}
                placeholder="Pilih Provinsi"
                onChange={chooseProvince}
              />
              <GeoDropdown
                label="Pilih kabupaten atau kota"
                value={city}
                options={cityOptions}
                placeholder="Pilih Kabupaten/Kota"
                disabled={cityOptions.length === 0}
                onChange={chooseCity}
              />
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
                <CalendarDays size={14} />
                <select aria-label="Tanggal leaderboard harian" value={dailyDate} onChange={(event) => setDailyDate(event.target.value)}>
                  {DAILY_DATES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <ChevronDown size={13} />
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

          {topThree.length > 0 && (
            <section className="podium-section" aria-label="Tiga peringkat teratas">
              <div className="podium-heading">
                <div>
                  <span className="podium-kicker"><Sparkles size={13} /> THE TOP THREE</span>
                  <h3>Podium juara</h3>
                </div>
                <span className="podium-period">{periodLabel(period, dailyDate)}</span>
              </div>
              <div className="podium-grid">
                {topThree.map((row) => (
                  <button key={row.id} type="button" className={"podium-card podium-" + row.rank} onClick={() => setSelectedBusinessId(row.id)} aria-label={`Lihat detail ${row.name}`}>
                    <div className="podium-card-top">
                      <span className="podium-medal">
                        {row.rank === 1 ? <Crown size={20} fill="currentColor" /> : <Medal size={19} />}
                      </span>
                      <span className="podium-rank-label">{row.rank === 1 ? "JUARA UTAMA" : row.rank === 2 ? "JUARA KEDUA" : "JUARA KETIGA"}</span>
                      <strong>#{row.rank}</strong>
                    </div>
                    <div className="podium-business">
                      <span className="podium-avatar">{row.initial}</span>
                      <strong>{row.name}</strong>
                      <span className="podium-city"><MapPin size={12} /> {row.city}</span>
                    </div>
                    <div className="podium-stake">
                      <span>STAKE TERKONFIRMASI</span>
                      <strong>{rupiah(row.stake)}</strong>
                    </div>
                    <div className="podium-footer">
                      <span>{scope === "indonesia" ? "Peringkat Indonesia" : "Peringkat nasional"}</span>
                      <strong>#{row.nationalRank}</strong>
                    </div>
                  </button>
                ))}
              </div>
              <div className="podium-note"><ShieldCheck size={13} /> Peringkat ditentukan oleh stake terkonfirmasi, bukan jumlah klik.</div>
            </section>
          )}

          {scope === "city" && rows[0] && (
            <section className="city-champion-card" aria-label="Juara kabupaten atau kota">
              <div className="city-champion-icon"><Trophy size={22} /></div>
              <div className="city-champion-copy">
                <span>PEMEGANG POSISI #1 DI KOTA INI</span>
                <strong>{rows[0].name}</strong>
                <small><MapPin size={12} /> {rows[0].city} · {rows[0].province}</small>
                <small className="city-champion-clicks"><Eye size={11} /> {compactNumber(rows[0].periodClicks)} klik</small>
              </div>
              <div className="city-champion-value">
                <span>STAKE</span>
                <strong>{rupiah(rows[0].stake)}</strong>
                <small>Peringkat #{rows[0].nationalRank} Indonesia</small>
              </div>
            </section>
          )}

          {!showCityChampion && (
            <>
              <div className="list-tools">
                <div className="list-heading">
                  <strong>{search.trim() ? "Hasil pencarian" : topThree.length > 0 ? "Peringkat berikutnya" : "Peringkat juara kota"}</strong>
                  <span>{rows.length} hasil · {periodLabel(period, dailyDate)}</span>
                </div>
                <label className="search-box">
                  <Search size={15} />
                  <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari UMKM atau kota…" aria-label="Cari UMKM atau kota" />
                </label>
              </div>

              <div className="column-head">
                <span>POSISI</span><span>UMKM / KOTA</span><span>STAKE</span><span><Eye size={12} /> KLIK</span><span aria-hidden="true" />
              </div>
              <div className="ranking-list" aria-live="polite">
                {listRows.length > 0 ? listRows.map((row) => (
                  <button key={row.id} type="button" className="ranking-row" onClick={() => setSelectedBusinessId(row.id)} aria-label={`Lihat detail ${row.name}`}>
                    <div className="rank-cell"><span className="rank-number">{String(row.rank).padStart(2, "0")}</span></div>
                    <div className="business-cell">
                      <span className="business-avatar">{row.initial}</span>
                      <div className="business-main">
                        <strong>{row.name}</strong>
                        <div className="business-meta">
                          <span className="city-pill"><MapPin size={11} /> {row.city}</span>
                          <span className="national-rank-chip">#{row.nationalRank} Indonesia</span>
                        </div>
                      </div>
                    </div>
                    <strong className="stake-value">{shortRupiah(row.stake)}</strong>
                    <span className="click-value">{compactNumber(row.periodClicks)}</span>
                    <span className="row-open"><ArrowUpRight size={15} /></span>
                  </button>
                )) : (
                  <div className="empty-state">
                    <span className="empty-icon"><Sparkles size={21} /></span>
                    <strong>{search.trim() ? "UMKM atau kota tidak ditemukan." : "Belum ada juara simulasi di wilayah ini."}</strong>
                    <span>{search.trim() ? "Coba kata kunci lain untuk menemukan juara kota." : "Data contoh saat ini hanya mencakup beberapa kabupaten/kota. Wilayah lain akan menampilkan papan kosong sampai data tersedia."}</span>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="board-bottom">
            <span>Menampilkan {rows.length} <span className="muted">juara kota</span></span>
            <span className="board-total">Total stake <strong>{shortRupiah(totalStake)}</strong><i /> <Eye size={12} /> {compactNumber(totalClicks)} klik</span>
          </div>
        </section>

        <section className="rules-strip">
          <div><span className="rule-icon rule-green"><Trophy size={15} /></span><strong>Stake terkonfirmasi</strong><span>penentu posisi di papan</span></div>
          <i />
          <div><span className="rule-icon rule-blue"><Eye size={15} /></span><strong>Klik</strong><span>statistik saja, bukan ranking</span></div>
          <i />
          <div><span className="rule-icon rule-pink"><MapPin size={15} /></span><strong>Satu kota</strong><span>satu juara, satu wakil nasional</span></div>
        </section>

        <div className="page-footnote">Data pada preview bersifat simulasi, bukan UMKM, transaksi, atau ranking terverifikasi.</div>
      </section>

      {selectedBusiness && (
        <div className="modal-backdrop detail-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedBusinessId(null);
        }}>
          <section className="business-detail-modal" role="dialog" aria-modal="true" aria-labelledby="business-detail-title">
            <button type="button" className="modal-close" onClick={() => setSelectedBusinessId(null)} aria-label="Tutup detail">
              <X size={19} />
            </button>
            <div className="detail-hero">
              <span className="detail-hero-orbit orbit-one" />
              <span className="detail-hero-orbit orbit-two" />
              <span className="detail-avatar">{selectedBusiness.initial}</span>
              <span className="detail-champion-label"><Trophy size={13} /> JUARA KABUPATEN / KOTA</span>
            </div>
            <div className="detail-content">
              <div className="detail-kicker">{selectedCategory?.icon} {category} <span>·</span> {periodLabel(period, dailyDate)}</div>
              <h2 id="business-detail-title">{selectedBusiness.name}</h2>
              <p className="detail-location"><MapPin size={14} /> {selectedBusiness.city}, {selectedBusiness.province}</p>
              <div className="detail-rank-strip">
                <div><span>POSISI DI WILAYAH</span><strong>#1</strong></div>
                <div><span>RANK NASIONAL</span><strong>#{selectedBusiness.nationalRank}</strong></div>
                <div><span>PERIODE</span><strong>{periodLabel(period, dailyDate)}</strong></div>
              </div>
              <div className="detail-stake-card">
                <div><span>STAKE TERKONFIRMASI</span><strong>{rupiah(selectedBusiness.stake)}</strong></div>
                <div className="detail-stake-icon"><Crown size={23} /></div>
              </div>
              <div className="detail-stats">
                <div><Eye size={16} /><span>Total klik periode ini</span><strong>{compactNumber(selectedBusiness.periodClicks)}</strong></div>
                <div><Medal size={16} /><span>Wilayah kompetisi</span><strong>{selectedBusiness.city}</strong></div>
              </div>
              <div className="detail-simulation-note"><ShieldCheck size={16} /><span>Ini adalah detail data simulasi. Angka stake dan klik bukan transaksi atau aktivitas UMKM sungguhan.</span></div>
              <button type="button" className="detail-close-button" onClick={() => setSelectedBusinessId(null)}>Kembali ke leaderboard <ArrowRight size={16} /></button>
            </div>
          </section>
        </div>
      )}

      {registrationOpen && (
        <div className="modal-backdrop">
          <section className="registration-modal" role="dialog" aria-modal="true" aria-labelledby="registration-title" aria-describedby="registration-description">
            <button type="button" className="modal-close" id="registration-close" onClick={() => setRegistrationOpen(false)} aria-label="Tutup dialog">
              <X size={19} />
            </button>
            <div className="modal-art">
              <span className="modal-art-star star-one"><Sparkles size={20} /></span>
              <span className="modal-art-store"><Store size={31} /></span>
              <span className="modal-art-star star-two"><Trophy size={18} /></span>
            </div>
            <span className="modal-kicker">KLAIM POSISI · PAY-TO-RANK</span>
            <h2 id="registration-title">Mau rebut <span>#1 di kotamu?</span></h2>
            <p id="registration-description">Pilih wilayah untuk melihat harga klaimnya. Posisi ditentukan oleh stake terkonfirmasi—bukan voting, jumlah klik, atau penilaian editorial.</p>

            <div className="claim-location-fields">
              <GeoDropdown
                label="Provinsi untuk klaim"
                value={claimProvince}
                options={PROVINCES}
                placeholder="Pilih Provinsi"
                onChange={(nextProvince) => {
                  setClaimProvince(nextProvince);
                  setClaimCity("");
                }}
              />
              <GeoDropdown
                label="Kabupaten atau kota untuk klaim"
                value={claimCity}
                options={claimCityOptions}
                placeholder="Pilih Kabupaten/Kota"
                disabled={claimCityOptions.length === 0}
                onChange={setClaimCity}
              />
            </div>

            {claimChampion && claimCurrentStake !== null && claimPrice !== null ? (
              <div className="claim-price-card">
                <div className="claim-price-topline">
                  <span>CONTOH HARGA KLAIM #1</span>
                  <span className="claim-simulation-pill">SIMULASI</span>
                </div>
                <strong className="claim-price-value">{rupiah(claimPrice)}</strong>
                <span className="claim-price-explanation">
                  Juara saat ini {shortRupiah(claimCurrentStake)} + kenaikan minimum contoh {rupiah(DEMO_CLAIM_INCREMENT)}.
                </span>
                <span className="claim-price-period">Papan {periodLabel(period, dailyDate)} · {claimChampion.city}</span>
              </div>
            ) : (
              <div className="claim-price-empty">
                Pilih kabupaten/kota untuk melihat contoh harga klaim #1.
              </div>
            )}

            <div className="registration-steps">
              <div className="registration-step">
                <span className="step-number">01</span>
                <span className="step-icon"><MapPin size={18} /></span>
                <div><strong>Pilih kota & kategori</strong><small>Tentukan papan tempat UMKM-mu akan bersaing.</small></div>
                <CheckCircle2 size={16} />
              </div>
              <div className="registration-step">
                <span className="step-number">02</span>
                <span className="step-icon"><Sparkles size={18} /></span>
                <div><strong>Cek harga klaim</strong><small>Nominal minimum terlihat sebelum lanjut bayar.</small></div>
                <CheckCircle2 size={16} />
              </div>
              <div className="registration-step">
                <span className="step-number">03</span>
                <span className="step-icon"><ShieldCheck size={18} /></span>
                <div><strong>Pasang stake</strong><small>Posisi berubah setelah pembayaran terkonfirmasi.</small></div>
                <CheckCircle2 size={16} />
              </div>
              <div className="registration-step">
                <span className="step-number">04</span>
                <span className="step-icon"><Trophy size={18} /></span>
                <div><strong>Masuk papan nasional</strong><small>Juara kota jadi wakil daerah di ranking Indonesia.</small></div>
                <CheckCircle2 size={16} />
              </div>
            </div>

            <div className="registration-notice">
              <ShieldCheck size={17} />
              <p><strong>Ini masih simulasi.</strong> Contoh harga memakai stake juara saat ini + Rp10.000. Pendaftaran dan pembayaran di preview belum aktif; nilai kenaikan minimum masih perlu ditetapkan.</p>
            </div>
            <button type="button" className="modal-done" onClick={() => setRegistrationOpen(false)}>
              Mengerti <ArrowRight size={16} />
            </button>
            <span className="modal-footnote">Pada versi aktif, nominal klaim akan dihitung ulang sebelum pembayaran agar harga yang ditampilkan tetap jelas.</span>
          </section>
        </div>
      )}
    </main>
  );
}
