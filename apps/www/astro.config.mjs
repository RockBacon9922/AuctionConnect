import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import sentry from "@sentry/astro";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: vercel({
    output: "server",
  }),
  integrations: [
    tailwind(),
    preact(),
    sentry({
      dsn: "https://dd85801f9a41b134dfec814bb66307b3@o4504764919185408.ingest.sentry.io/4506622085169152",
      sourceMapsUploadOptions: {
        project: "gavelconnect",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
      replaysSessionSampleRate: 1,
    }),
  ],
});
