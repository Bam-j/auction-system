import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3F99F5",
          light: "#46b9fe",
          dark: "#2566a7",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#059669",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
          dark: "#B45309",
        },
        danger: {
          DEFAULT: "#F43F5E",
          light: "#FB7185",
          dark: "#E11D48",
        },
        font: {
          main: "#444444",
          sub: "#888888",
          muted: "#BDBDBD",
          blue: "#3F99F5",
          dark_blue: "#2566a7",
          white: "#F9F9F9",
          alert: "#F43F5E",
          warning: "#F59E0B",
          success: "#10B981",
        },
        background: "#FAFAFA",
        surface: "#FFFFFF",
      },
    },
  },
  plugins: [],
});