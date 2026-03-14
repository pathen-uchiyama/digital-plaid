module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        plaid: {
          navy: "#12232E",
          gold: "#D4AF37",
          alabaster: "#FAF9F6",
          cream: "#FEFBF0",
          amber: "#E8A838",
          rose: "#B33951",
          teal: "#006A71",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        header: ["PlayfairDisplay_700Bold"],
        body: ["Inter_400Regular"],
      },
    },
  },
  plugins: [],
};

