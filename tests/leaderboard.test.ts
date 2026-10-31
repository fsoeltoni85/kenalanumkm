import { describe, expect, it } from "vitest";
import { buildLeaderboard, createDemoCityChampions } from "../app/lib/leaderboard";

const filter = { scope: "indonesia" as const, period: "all-time" as const, dailyDate: "2026-11-01" };

describe("city champion leaderboard", () => {
  it("creates exactly one demo champion for each represented city", () => {
    const champions = createDemoCityChampions("Makanan & Minuman");
    const cityKeys = champions.map((item) => item.city + "|" + item.province);
    expect(champions).toHaveLength(20);
    expect(new Set(cityKeys).size).toBe(20);
    expect(champions.every((item) => item.isDemo)).toBe(true);
  });

  it("shows one champion per city on the Indonesia board, ordered by stake", () => {
    const rows = buildLeaderboard(createDemoCityChampions("Makanan & Minuman"), filter);
    expect(rows).toHaveLength(20);
    expect(rows[0].city).toBe("Kota Bekasi");
    expect(rows[0].rank).toBe(1);
    expect(rows.every((row, index) => index === 0 || rows[index - 1].stake >= row.stake)).toBe(true);
    expect(new Set(rows.map((row) => row.city)).size).toBe(rows.length);
  });

  it("filters province boards to that province's city champions", () => {
    const rows = buildLeaderboard(createDemoCityChampions("Makanan & Minuman"), {
      ...filter, scope: "province", province: "Jawa Barat",
    });
    expect(rows).toHaveLength(6);
    expect(rows.every((row) => row.province === "Jawa Barat")).toBe(true);
    expect(rows[0].rank).toBe(1);
    expect(rows[0].nationalRank).toBe(1);
  });

  it("shows exactly one local champion and preserves its national rank in city scope", () => {
    const rows = buildLeaderboard(createDemoCityChampions("Makanan & Minuman"), {
      ...filter, scope: "city", city: "Kabupaten Bekasi",
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].city).toBe("Kabupaten Bekasi");
    expect(rows[0].rank).toBe(1);
    expect(rows[0].nationalRank).toBe(3);
  });

  it("uses stake, not clicks, to determine the ranking", () => {
    const champions = createDemoCityChampions("Makanan & Minuman");
    const before = buildLeaderboard(champions, filter).map((row) => row.id);
    const inflatedClicks = champions.map((item, index) => ({
      ...item,
      clicks: index === 19 ? Number.MAX_SAFE_INTEGER : item.clicks,
      todayClicks: index === 19 ? Number.MAX_SAFE_INTEGER : item.todayClicks,
    }));
    const after = buildLeaderboard(inflatedClicks, filter).map((row) => row.id);
    expect(after).toEqual(before);
  });

  it("reorders the board for the selected period without duplicating city champions", () => {
    const rows = buildLeaderboard(createDemoCityChampions("Makanan & Minuman"), { ...filter, period: "today" });
    expect(rows).toHaveLength(20);
    expect(rows[0].city).toBe("Kota Bandung");
    expect(new Set(rows.map((row) => row.city)).size).toBe(20);
    expect(rows.every((row, index) => index === 0 || rows[index - 1].stake >= row.stake)).toBe(true);
  });
});
