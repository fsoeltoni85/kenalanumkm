import { bindings, defineConfig } from "cf/config";
import * as entrypoint from "vinext/server/fetch-handler" with { type: "cf-worker" };

export default defineConfig(({ mode }) => ({
  accountId: "311649d38b2aa47efbff87cae6921e2a",
  worker: {
    name: mode === "preview" ? "kenalanumkm-preview" : "kenalanumkm",
    compatibilityDate: "2026-10-31",
    compatibilityFlags: ["nodejs_compat"],
    env: {
      SUPABASE_URL: bindings.text("https://okhqfowcystfilivfjgc.supabase.co"),
      SUPABASE_PUBLISHABLE_KEY: bindings.text("sb_publishable_NeqxoSvLRDoTgWKPmytGnw_FVuvM_yj"),
    },
    workersDev: true,
    entrypoint,
  },
}));
