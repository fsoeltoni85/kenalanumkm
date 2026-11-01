import { apiJson, createAuthenticatedSupabaseClient } from "@/app/lib/supabase/server";

type AvatarFileInfo = { extension: "jpg" | "png" | "webp"; contentType: string };

async function inspectAvatar(file: File): Promise<AvatarFileInfo | null> {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes.length >= 8
    && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
    && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a;
  const isWebp = bytes.length >= 12
    && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
    && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";

  if (isJpeg && file.type === "image/jpeg") return { extension: "jpg", contentType: "image/jpeg" };
  if (isPng && file.type === "image/png") return { extension: "png", contentType: "image/png" };
  if (isWebp && file.type === "image/webp") return { extension: "webp", contentType: "image/webp" };
  return null;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> | { slug: string } },
): Promise<Response> {
  const auth = await createAuthenticatedSupabaseClient(request);
  if (!auth) return apiJson({ error: "authentication_required" }, 401);

  const { slug: id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return apiJson({ error: "not_found" }, 404);

  const { data: profile, error: profileError } = await auth.client
    .from("business_profiles")
    .select("id,owner_user_id,avatar_path")
    .eq("id", id)
    .eq("owner_user_id", auth.user.id)
    .maybeSingle();

  if (profileError) return apiJson({ error: "could_not_load_business_profile" }, 500);
  if (!profile) return apiJson({ error: "not_found" }, 404);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return apiJson({ error: "invalid_multipart_form" }, 400);
  }

  const file = form.get("avatar");
  if (!(file instanceof File)) return apiJson({ error: "avatar_file_required" }, 400);
  if (file.size < 1 || file.size > 5 * 1024 * 1024) {
    return apiJson({ error: "avatar_file_size_invalid", message: "Avatar maksimal 5 MB." }, 413);
  }

  const fileInfo = await inspectAvatar(file);
  if (!fileInfo) {
    return apiJson({ error: "avatar_format_invalid", message: "Gunakan file JPEG, PNG, atau WebP yang valid." }, 415);
  }

  const path = `${auth.user.id}/${profile.id}/${crypto.randomUUID()}.${fileInfo.extension}`;
  const { error: uploadError } = await auth.client.storage
    .from("business-avatars")
    .upload(path, file, {
      contentType: fileInfo.contentType,
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) return apiJson({ error: "avatar_upload_failed" }, 400);

  const { error: updateError } = await auth.client
    .from("business_profiles")
    .update({ avatar_path: path })
    .eq("id", profile.id)
    .eq("owner_user_id", auth.user.id);

  if (updateError) {
    await auth.client.storage.from("business-avatars").remove([path]);
    return apiJson({ error: "avatar_profile_update_failed" }, 500);
  }

  if (profile.avatar_path && profile.avatar_path !== path) {
    await auth.client.storage.from("business-avatars").remove([profile.avatar_path]);
  }

  const { data: signed, error: signedError } = await auth.client.storage
    .from("business-avatars")
    .createSignedUrl(path, 15 * 60);

  if (signedError) return apiJson({ error: "avatar_saved_but_url_unavailable" }, 500);

  return apiJson({ data: { avatar_url: signed.signedUrl } }, 200);
}
