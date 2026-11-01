import { apiJson, createPublicSupabaseClient } from "@/app/lib/supabase/server";

const selection = [
  "id", "slug", "name", "description", "province_name", "regency_name",
  "address_text", "avatar_path", "approved_at", "created_at",
  "category:business_categories(slug,name,icon)",
  "links:business_profile_links(id,link_type,platform,url,handle,profile_display_name,profile_image_url,resolution_status)",
].join(",");

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> | { slug: string } },
): Promise<Response> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return apiJson({ error: "backend_not_configured" }, 503);

  const { slug } = await context.params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80) {
    return apiJson({ error: "not_found" }, 404);
  }

  const { data, error } = await supabase
    .from("business_profiles")
    .select(selection)
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (error) return apiJson({ error: "could_not_load_business_profile" }, 500);
  if (!data) return apiJson({ error: "not_found" }, 404);

  let avatarUrl: string | null = null;
  if (data.avatar_path) {
    const { data: signed, error: signedError } = await supabase
      .storage.from("business-avatars")
      .createSignedUrl(data.avatar_path, 15 * 60);
    if (!signedError) avatarUrl = signed.signedUrl;
  }

  return apiJson({ data: { ...data, avatar_url: avatarUrl, avatar_path: undefined } });
}
