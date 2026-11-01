import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

type SupabaseConfig = {
  url: string;
  publishableKey: string;
};

function readSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !parsed.hostname.endsWith(".supabase.co")) {
      return null;
    }
  } catch {
    return null;
  }

  return { url, publishableKey };
}

function createRequestClient(config: SupabaseConfig, accessToken?: string): SupabaseClient {
  return createClient(config.url, config.publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined,
  });
}

export function createPublicSupabaseClient(): SupabaseClient | null {
  const config = readSupabaseConfig();
  return config ? createRequestClient(config) : null;
}

export function getBearerToken(request: Request): string | null {
  const value = request.headers.get("authorization");
  if (!value) return null;

  const match = /^Bearer\s+([A-Za-z0-9._~-]+)$/i.exec(value.trim());
  return match?.[1] ?? null;
}

export type AuthenticatedSupabase = {
  client: SupabaseClient;
  user: User;
};

export async function createAuthenticatedSupabaseClient(
  request: Request,
): Promise<AuthenticatedSupabase | null> {
  const config = readSupabaseConfig();
  const accessToken = getBearerToken(request);
  if (!config || !accessToken) return null;

  const client = createRequestClient(config, accessToken);
  const { data, error } = await client.auth.getUser(accessToken);

  if (error || !data.user || data.user.is_anonymous) return null;

  return { client, user: data.user };
}

export function apiJson(
  body: Record<string, unknown>,
  status = 200,
  headers: HeadersInit = {},
): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("content-type", "application/json; charset=utf-8");
  responseHeaders.set("cache-control", "no-store");
  responseHeaders.set("x-content-type-options", "nosniff");

  return new Response(JSON.stringify(body), { status, headers: responseHeaders });
}

export function isMissingSupabaseConfig(): boolean {
  return readSupabaseConfig() === null;
}
