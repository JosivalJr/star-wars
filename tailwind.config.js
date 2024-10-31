/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "death-star": "url('/src/assets/images/death_star_bg.jpg')",
        species: "url('/src/assets/images/gorgu_bg.png')",
        planets: "url('/src/assets/images/planet_bg.png')",
        character: "url('/src/assets/images/character_bg.jpg')",
        vehicle: "url('/src/assets/images/vehicle_bg.png')",
        starship: "url('/src/assets/images/starship_bg.png')",
        movie: "url('/src/assets/images/movie_bg.jpg')",
      },
      fontFamily: {
        starjedi: ["Sf Distant Galaxy", "sans-serif"],
        kodemono: ["Kode Mono", "sans-serif"],
      },
      fontSize: {
        logo: "40px",
      },
      colors: {
        "gray-default": "#0F0F0F",
      },
    },
  },
  plugins: [],
};
