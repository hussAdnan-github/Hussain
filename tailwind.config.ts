/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: {
            50: "#f8fafc",
            100: "#ffffff",
            200: "#e2e8f0",
            300: "#cbd5e1",
          },
          foreground: {
            50: "#f8fafc",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            950: "#0d1b2e",
          },
          primary: {
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#2563eb",
            600: "#1d4ed8",
            700: "#1e40af",
          },
          accent: {
            600: "#0284c7",
          },
        },
      },
    },
    plugins: [],
  }