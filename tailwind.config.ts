import { Config } from "tailwindcss";

export default {
    darkMode: "class",
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./types/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    plugins: [],
    theme: {
        extend: {
            maxWidth: {
                "250": "1000px",
            },
            fontFamily: {
                pretendard: ["Pretendard-Regular", "sans-serif"],
            },
            colors: {

            },
        },
    },
} satisfies Config;