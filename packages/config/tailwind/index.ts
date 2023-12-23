import type { Config } from "tailwindcss";

export default {
  content: [""],
  theme: {
    extend: {
      colors: {
        primary: "#fb923c",
        secondary: "#E8BB96",
        accent: "#65D2A6",
        abbey: {
          "50": "#f6f6f6",
          "100": "#e7e7e7",
          "200": "#d1d1d1",
          "300": "#b0b0b0",
          "400": "#888888",
          "500": "#6d6d6d",
          "600": "#5d5d5d",
          "700": "#4c4c4c",
          "800": "#454545",
          "900": "#3d3d3d",
          "950": "#262626",
        },
        lightBackground: "#F9F8F6",
      },
    },
  },
  plugins: [],
} satisfies Config;
