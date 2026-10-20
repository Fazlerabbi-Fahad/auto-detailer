import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const clash = localFont({
  src: [
    { path: "../fonts/ClashDisplay-200.woff2", weight: "200", style: "normal" },
    { path: "../fonts/ClashDisplay-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
  adjustFontFallback: "Arial",
});

const satoshi = localFont({
  src: [
    { path: "../fonts/Satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Satoshi-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport = {
  themeColor: "#0B0C0E",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${clash.variable} ${satoshi.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
