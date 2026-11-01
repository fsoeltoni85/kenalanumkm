import { businessProfileInputSchema, normalizeProfileLink, slugifyBusinessName } from "@/app/lib/business-profile";
import {
  apiJson,
  createAuthenticatedSupabaseClient,
  createPublicSupabaseClient,
  isMissingSupabaseConfig,
} from "@/app/lib/supabase/server";

const publicProfileSelection = [
  "id", "slug", "name", "description", "province_name", "regency_name",
  "address_text", "avatar_path", "approved_at", "created_at",
  "category:business_categories(slug,name,icon)",
  "links:business_profile_links(id,link_type,platform,url,handle,profile_display_name,profile_image_url,resolution_status)",
].join(",");

export async function GET(request: Request): Promise<Response> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return apiJson({ error: "backend_not_configured" }, 503);

  const url = new URL(request.url);
  const province = url.searchParams.get("province");
  const regency = url.searchParams.get("regency");
  const category = url.searchParams.get("category");
  const limitInput = Number(url.searchParams.get("limit") ?? "30");
  const limit = Number.isFinite(limitInput) ? Math.min(50, Math.max(1, Math.trunc(limitInput))) : 30;

  let query = supabase
    .from("business_profiles")
    .select(publicProfileSelection)
    .eq("status", "approved")
    .order("approved_at", { ascending: false })
    .limit(limit);

  if (province) query = query.eq("province_name", province.slice(0, 80));
  if (regency) query = query.eq("regency_name", regency.slice(0, 100));
  if (category) query = query.eq("category.slug", category.slice(0, 80));

  const { data, error } = await query;
  if (error) return apiJson({ error: "could_not_load_business_profiles" }, 500);

  const profiles = await Promise.all((data ?? []).map(async (profile) => {
    let avatarUrl: string | null = null;
    if (profile.avatar_path) {
      const { data: signed, error: signedError } = await supabase
        .storage.from("business-avatars")
        .createSignedUrl(profile.avatar_path, 15 * 60);
      if (!signedError) avatarUrl = signed.signedUrl;
    }

    return { ...profile, avatar_url: avatarUrl, avatar_path: undefined };
  }));

  return apiJson({ data: profiles, count: profiles.length });
}

export async function POST(request: Request): Promise<Response> {
  const tokenClient = await createAuthenticatedSupabaseClient(request);
  if (!tokenClient) {
    return apiJson({ error: "authentication_required", message: "Masuk dulu untuk mendaftarkan UMKM." }, 401);
  }

  if (isMissingSupabaseConfig()) return apiJson({ error: "backend_not_configured" }, 503);

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 24_000) return apiJson({ error: "payload_too_large" }, 413);

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (rawBody.length > 24_000) return apiJson({ error: "payload_too_large" }, 413);
    body = JSON.parse(rawBody);
  } catch {
    return apiJson({ error: "invalid_json" }, 400);
  }

  const parsed = businessProfileInputSchema.safeParse(body);
  if (!parsed.success) {
    return apiJson({ error: "invalid_profile", details: parsed.error.flatten() }, 422);
  }

  let links;
  try {
    links = parsed.data.links.map((link) => normalizeProfileLink(link.linkType, link.url));
  } catch (error) {
    return apiJson({
      error: "invalid_profile_link",
      message: error instanceof Error ? error.message : "Link tidak valid.",
    }, 422);
  }

  const slug = `${slugifyBusinessName(parsed.data.name)}-${crypto.randomUUID().slice(0, 8)}`;
  const { data, error } = await tokenClient.client.rpc("submit_business_profile", {
    p_profile: {
      slug,
      name: parsed.data.name,
      description: parsed.data.description,
      category_slug: parsed.data.categorySlug,
      province_name: parsed.data.provinceName,
      regency_name: parsed.data.regencyName,
      address_text: parsed.data.addressText || null,
    },
    p_links: links,
  });

  if (error) {
    if (error.code === "23505") {
      return apiJson({ error: "profile_conflict", message: "Profil dengan data tersebut sudah terdaftar." }, 409);
    }
    if (error.code === "42501") return apiJson({ error: "not_allowed" }, 403);
    if (error.message.includes("limit_reached")) {
      return apiJson({ error: "submission_limit_reached", message: "Maksimal tiga pendaftaran aktif per akun." }, 429);
    }
    if (["22023", "23514"].includes(error.code)) {
      return apiJson({ error: "invalid_profile", message: "Data profil atau pilihan link belum sesuai." }, 422);
    }
    return apiJson({ error: "could_not_submit_profile" }, 500);
  }

  return apiJson({
    data: {
      id: data,
      slug,
      status: "pending_review",
      message: "Profil masuk antrean peninjauan. Profil belum tampil di leaderboard sampai disetujui.",
    },
  }, 201);
}
