import { defineConfig } from "cf/config";
import * as entrypoint from "vinext/server/fetch-handler" with { type: "cf-worker" };

export default defineConfig(({ mode }) => ({
  worker: {
    name: mode === "preview" ? "kenalanumkm-preview" : "kenalanumkm",
    compatibilityDate: "2026-10-31",
    compatibilityFlags: ["nodejs_compat"],
    entrypoint,
  },
}));
