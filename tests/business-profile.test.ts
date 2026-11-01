import { describe, expect, it } from "vitest";
import {
  businessProfileInputSchema,
  normalizeProfileLink,
  slugifyBusinessName,
} from "../app/lib/business-profile";
import { POST } from "../app/api/business-profiles/route";


describe("business profile input validation", () => {
  const base = {
    name: "Martabak Enak",
    description: "Martabak rumahan dengan topping pilihan dan bahan segar setiap hari.",
    categorySlug: "makanan-minuman",
    provinceName: "Jawa Barat",
    regencyName: "Kota Bekasi",
    links: [
      { linkType: "primary" as const, url: "https://www.instagram.com/martabakenak" },
      { linkType: "purchase" as const, url: "https://shopee.co.id/martabakenak" },
      { linkType: "order" as const, url: "https://wa.me/6281234567890" },
    ],
  };

  it("requires a primary, purchase and order link", () => {
    expect(businessProfileInputSchema.safeParse(base).success).toBe(true);
    expect(businessProfileInputSchema.safeParse({
      ...base,
      links: base.links.filter((link) => link.linkType !== "order"),
    }).success).toBe(false);
  });

  it("detects Instagram, Threads and X handles from profile URLs", () => {
    expect(normalizeProfileLink("social", "https://instagram.com/umkm.jaya").handle).toBe("umkm.jaya");
    expect(normalizeProfileLink("social", "https://threads.net/@umkmjaya").handle).toBe("umkmjaya");
    expect(normalizeProfileLink("social", "https://x.com/umkmjaya").handle).toBe("umkmjaya");
  });

  it("rejects HTTP, credentialed and local URLs", () => {
    expect(() => normalizeProfileLink("primary", "http://example.com")).toThrow();
    expect(() => normalizeProfileLink("primary", "https://user:pass@example.com")).toThrow();
    expect(() => normalizeProfileLink("primary", "https://localhost/admin")).toThrow();
  });

  it("rejects non-social domains in a social slot", () => {
    expect(() => normalizeProfileLink("social", "https://example.com/umkm")).toThrow();
  });

  it("normalizes the public business slug", () => {
    expect(slugifyBusinessName("Kedai Kopi & Roti Bekasi")).toBe("kedai-kopi-roti-bekasi");
  });
});

describe("business profile API", () => {
  it("rejects unauthenticated profile submissions", async () => {
    const response = await POST(new Request("https://example.test/api/business-profiles", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    }));
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ error: "authentication_required" });
  });
});
