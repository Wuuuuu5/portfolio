import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Headlines only. Tight and athletic — it carries the display sizes. */
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: site.name,
  description:
    "Computer Science student at the University of Auckland building full-stack and computer vision projects. Seeking a 2026 software engineering internship.",
  openGraph: {
    title: `${site.name} ${site.nameZh} — Software Engineer`,
    description:
      "CS student in Auckland building full-stack and computer vision projects. Seeking a 2026 internship.",
    type: "website",
  },
};

/**
 * Runs before first paint so the page never flashes the wrong palette.
 * Must be inline and blocking to beat hydration.
 */
const themeScript = `
(function(){
  try {
    // Light (white and blue) is the default; dark mode is opt-in via the toggle.
    var stored = localStorage.getItem("theme");
    document.documentElement.dataset.theme = stored === "dark" ? "dark" : "light";
  } catch (e) {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
