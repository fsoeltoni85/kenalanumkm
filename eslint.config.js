import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      ".cloudflare/**",
      ".vinext/**",
      ".wrangler/**",
    ],
  },
  ...tseslint.configs.recommended,
);
