import { Config } from "tailwindcss";

type CustomConfig = Config & {
    safelist?: Array<string | { pattern: RegExp; variants?: string[] }>;
};

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
                background: {
                    default: "var(--background)",
                    paper: "var(--surface)",
                },
                text: {
                    default: "var(--text)",
                    secondary: "var(--text-secondary)",
                    light: "var(--text-light)",
                },
                divider: "var(--border)",

                primary: {
                    main: "var(--primary)",
                    hover: "var(--hover)",
                    active: "var(--active)",
                    light: "var(--light)",
                    contrast: "var(--text-light)",
                },
                secondary: {
                    main: "var(--secondary)",
                    hover: "var(--secondary-hover)",
                    contrast: "var(--text-light)",
                },
                error: {
                    main: "var(--error)",
                    contrast: "var(--text-light)",
                },
                success: {
                    main: "var(--success)",
                    contrast: "var(--text-light)",
                },
                warning: {
                    main: "var(--warning)",
                    contrast: "var(--text-light)",
                },
            },
        },
    },
    safelist: [
        {
            pattern:
                /(bg|text|border)-(primary|secondary|error|success|warning)-(main|hover|active|light|contrast)/,
        },
    ],
} satisfies CustomConfig;