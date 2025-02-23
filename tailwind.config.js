// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     // extend: {
//     //   colors: {
//     //     "red-500": "#f87171", // Light red
//     //     "green-500": "#34d399", // Light green
//     //     "blue-500": "#3b82f6", // Light blue
//     //     "yellow-500": "#facc15", // Light yellow
//     //     "bold-red": "#b91c1c", // Bold red
//     //     "bold-blue": "#1d4ed8", // Bold blue
//     //     "bold-green": "#059669", // Bold green
//     //   },
//     //   fontWeight: {
//     //     bold: "bold",
//     //   },
//     //   keyframes: {
//     //     typing: {
//     //       "0%": {
//     //         width: "0%",
//     //         visibility: "hidden",
//     //       },
//     //       "100%": {
//     //         width: "100%",
//     //       },
//     //     },
//     //     blink: {
//     //       "50%": {
//     //         borderColor: "transparent",
//     //       },
//     //       "100%": {
//     //         borderColor: "white",
//     //       },
//     //     },
//     //   },
//     //   animation: {
//     //     typing: "typing 10s steps(20)  alternate, blink .7s infinite",
//     //   },
//     // },

//     extend: {},
//   },
//   plugins: [],
// };
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Set Poppins as the default font
      },
      colors: {
        bright: {
          red: "#FF4C4C",
          blue: "#4C9BFF",
          green: "#4CFF77",
          yellow: "#FFD93D",
          pink: "#FF66CC",
        },
      },
      fontWeight: {
        bold: "700",
        extraBold: "800",
      },
    },
  },
  plugins: [],
};
