/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";

module.exports = {
  content: ["./**/*.tsx"],
  presets: [baseConfig],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["winter"],
  },
  plugins: [require("daisyui")],
};
