import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: `${site.name} — Software Engineer`,
  description:
    "Computer Science student at the University of Auckland building full-stack and computer vision projects. Seeking a 2026 software engineering internship.",
  openGraph: {
    title: `${site.name} — Software Engineer`,
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
    var stored = localStorage.getItem("theme");
    var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    document.documentElement.dataset.theme = stored || (prefersLight ? "light" : "dark");
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
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
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
