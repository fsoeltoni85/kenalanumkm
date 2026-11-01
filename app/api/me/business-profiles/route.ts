import { apiJson, createAuthenticatedSupabaseClient } from "@/app/lib/supabase/server";

export async function GET(request: Request): Promise<Response> {
  const auth = await createAuthenticatedSupabaseClient(request);
  if (!auth) return apiJson({ error: "authentication_required" }, 401);

  const { data, error } = await auth.client
    .from("business_profiles")
    .select("id,slug,name,description,province_name,regency_name,address_text,avatar_path,status,rejection_reason,reviewed_at,approved_at,created_at,updated_at,category:business_categories(slug,name,icon),links:business_profile_links(id,link_type,platform,url,handle,profile_display_name,profile_image_url,resolution_status,resolution_error_code)")
    .eq("owner_user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return apiJson({ error: "could_not_load_owned_profiles" }, 500);

  const profiles = await Promise.all((data ?? []).map(async (profile) => {
    let avatarUrl: string | null = null;
    if (profile.avatar_path) {
      const { data: signed, error: signedError } = await auth.client
        .storage.from("business-avatars")
        .createSignedUrl(profile.avatar_path, 15 * 60);
      if (!signedError) avatarUrl = signed.signedUrl;
    }
    return { ...profile, avatar_url: avatarUrl, avatar_path: undefined };
  }));

  return apiJson({ data: profiles, count: profiles.length });
}
