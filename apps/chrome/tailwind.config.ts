import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";

module.exports = {
  content: ["./**/*.tsx"],
  presets: [baseConfig],
  theme: {
    extend: {},
  },
  plugins: [],
};
