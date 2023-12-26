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
      fontSize: {
        xs: "13px",
        sm: "0.750rem",
        base: "1rem",
        xl: "1.333rem",
        "2xl": "1.777rem",
        "3xl": "2.369rem",
        "4xl": "3.158rem",
        "5xl": "4.210rem",
      },
      fontWeight: {
        normal: "400",
        bold: "700",
      },
    },
  },
  plugins: [],
} satisfies Config;
