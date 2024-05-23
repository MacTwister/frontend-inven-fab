/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#28296A",
        secondary: "#EC008C",
        
        dark: '#282828',
        royalblue: '#28296A',
        hotpink: '#EC008C',
        sunflower: '#F4A61C',
        teal: '#00A2AF',

        dark: "#1E1E1E",
        light: "#F9F9F9",
        dimBlack: "rgba(0, 0, 0, 0.7)",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
}

