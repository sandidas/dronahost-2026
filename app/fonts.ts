import { Geist_Mono, Manrope, Sora } from "next/font/google";

// Body font: rounded, readable, strong at all weights
export const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap", weight: ["400", "500", "600", "700", "800"] });

// Heading / display font: geometric, bold, premium at large sizes. 300 and 500 serve the light display headlines on Home
// (a light statement with a heavier closing phrase, docs/components/README.md "Home sections").
export const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap", weight: ["300", "400", "500", "600", "700", "800"] });

// Monospace is used only for code samples, so it is not preloaded on every page.
export const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap", preload: false });
