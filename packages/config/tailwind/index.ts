import type { Config } from "tailwindcss";

export default {
  content: [""],
  theme: {
    extend: {
      colors: {
        geraldine: {
          DEFAULT: "#F88B8B",
          50: "#FDF1E0",
          100: "#FCE8D4",
          200: "#FBD1BC",
          300: "#FAB2A3",
          400: "#F88B8B",
          500: "#F55B75",
          600: "#F32B6E",
          700: "#DE0D75",
          800: "#AE0A77",
          900: "#7D076A",
          950: "#65065D",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
