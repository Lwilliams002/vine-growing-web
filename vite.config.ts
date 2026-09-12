// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Static export for GitHub Pages: set GITHUB_PAGES_BASE to the repo path
// (e.g. "/vine-growing-web/") and every route is prerendered to HTML under
// that base. Unset (Lovable / Cloudflare), the app builds as normal SSR.
const pagesBase = process.env["GITHUB_PAGES_BASE"];
const basepath = pagesBase ? pagesBase.replace(/\/+$/, "") || "/" : undefined;

export default defineConfig({
  ...(pagesBase ? { vite: { base: pagesBase } } : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(basepath && basepath !== "/" ? { router: { basepath } } : {}),
    ...(pagesBase
      ? { prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: true } }
      : {}),
  },
});
