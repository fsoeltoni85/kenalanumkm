import { z } from "zod";

export const profileLinkTypeSchema = z.enum(["primary", "social", "purchase", "order"]);

const profileLinkInputSchema = z.object({
  linkType: profileLinkTypeSchema,
  url: z.string().trim().min(9).max(2048),
});

export const businessProfileInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(20).max(280),
  categorySlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  provinceName: z.string().trim().min(2).max(80),
  regencyName: z.string().trim().min(2).max(100),
  addressText: z.string().trim().max(240).optional().default(""),
  links: z.array(profileLinkInputSchema).min(3).max(8),
}).superRefine((value, context) => {
  for (const linkType of ["primary", "purchase", "order"] as const) {
    const count = value.links.filter((link) => link.linkType === linkType).length;
    if (count !== 1) {
      context.addIssue({
        code: "custom",
        path: ["links"],
        message: `Tambahkan tepat satu link ${linkType === "primary" ? "utama" : linkType === "purchase" ? "beli" : "pesan"}.`,
      });
    }
  }
});

export type BusinessProfileInput = z.infer<typeof businessProfileInputSchema>;
export type ProfileLinkType = z.infer<typeof profileLinkTypeSchema>;
export type ProfilePlatform =
  | "website" | "instagram" | "threads" | "x" | "tiktok" | "facebook"
  | "whatsapp" | "shopee" | "tokopedia" | "lazada" | "tiktok_shop"
  | "gofood" | "grabfood" | "shopeefood" | "other";

export type NormalizedProfileLink = {
  link_type: ProfileLinkType;
  platform: ProfilePlatform;
  url: string;
  handle: string | null;
};

function isDomain(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

function isUnsafeHost(host: string): boolean {
  if (
    host === "localhost"
    || host.endsWith(".localhost")
    || host.endsWith(".local")
    || host.endsWith(".internal")
    || host.endsWith(".test")
  ) return true;

  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return true;
  if (host.startsWith("[") || host.includes(":")) return true;
  return false;
}

function detectPlatform(host: string, linkType: ProfileLinkType): ProfilePlatform {
  if (isDomain(host, "instagram.com")) return "instagram";
  if (isDomain(host, "threads.net")) return "threads";
  if (isDomain(host, "x.com") || isDomain(host, "twitter.com")) return "x";
  if (isDomain(host, "tiktok.com")) {
    return host === "shop.tiktok.com" ? "tiktok_shop" : "tiktok";
  }
  if (isDomain(host, "facebook.com") || isDomain(host, "fb.com")) return "facebook";

  if (linkType === "purchase") {
    if (isDomain(host, "shopee.co.id") || isDomain(host, "shopee.com")) return "shopee";
    if (isDomain(host, "tokopedia.com")) return "tokopedia";
    if (isDomain(host, "lazada.co.id") || isDomain(host, "lazada.com")) return "lazada";
    if (isDomain(host, "shop.tiktok.com")) return "tiktok_shop";
    return "other";
  }

  if (linkType === "order") {
    if (isDomain(host, "wa.me") || isDomain(host, "whatsapp.com")) return "whatsapp";
    if (isDomain(host, "gofood.co.id")) return "gofood";
    if (isDomain(host, "grab.com") || isDomain(host, "grabfood.com")) return "grabfood";
    if (isDomain(host, "shopeefood.co.id")) return "shopeefood";
    return "other";
  }

  return "website";
}

function extractSocialHandle(url: URL, platform: ProfilePlatform): string | null {
  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  let candidate = segments[0];
  if (platform === "threads" && candidate.startsWith("@")) candidate = candidate.slice(1);
  if (platform === "tiktok" && candidate.startsWith("@")) candidate = candidate.slice(1);
  if (platform === "x" && ["i", "intent", "share"].includes(candidate.toLowerCase())) return null;
  if (platform === "instagram" && ["p", "reel", "reels", "stories", "explore"].includes(candidate.toLowerCase())) return null;
  if (platform === "facebook" && ["share", "watch", "groups", "events"].includes(candidate.toLowerCase())) return null;

  if (!/^[A-Za-z0-9._-]{1,80}$/.test(candidate)) return null;
  return candidate;
}

export function normalizeProfileLink(
  linkType: ProfileLinkType,
  rawUrl: string,
): NormalizedProfileLink {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    throw new Error("Link harus berupa URL lengkap yang valid.");
  }

  if (url.protocol !== "https:") {
    throw new Error("Gunakan link HTTPS agar aman dibuka.");
  }
  if (url.username || url.password || url.port || isUnsafeHost(url.hostname.toLowerCase())) {
    throw new Error("Link tersebut tidak didukung.");
  }

  url.hash = "";
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const platform = detectPlatform(host, linkType);

  if (linkType === "social" && !["instagram", "threads", "x", "tiktok", "facebook"].includes(platform)) {
    throw new Error("Link sosial harus berasal dari Instagram, Threads, X, TikTok, atau Facebook.");
  }

  if (linkType === "purchase" && !["website", "shopee", "tokopedia", "lazada", "tiktok_shop", "other"].includes(platform)) {
    throw new Error("Gunakan link toko atau produk untuk link beli.");
  }

  if (linkType === "order" && !["website", "whatsapp", "gofood", "grabfood", "shopeefood", "other"].includes(platform)) {
    throw new Error("Gunakan link pemesanan atau kontak untuk link pesan.");
  }

  const handle = ["instagram", "threads", "x", "tiktok", "facebook"].includes(platform)
    ? extractSocialHandle(url, platform)
    : null;

  return {
    link_type: linkType,
    platform,
    url: url.toString(),
    handle,
  };
}

export function slugifyBusinessName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "") || "umkm";
}
