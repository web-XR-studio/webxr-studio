import type { Metadata } from "next";
import { Montserrat, Noto_Sans_JP } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Self-hosted by next/font, so no request leaves for Google at runtime.
// Noto Sans JP replaces the OS fallbacks (Yu Gothic renders thin and blurry on
// Windows); only its Latin slice is preloaded — the Japanese slices are split
// by unicode-range and fetched on demand. Montserrat sets the English display
// words and numerals.
const noto = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "WEB-XR.studio｜Web・アプリ・AI開発スタジオ",
    template: "%s｜WEB-XR.studio",
  },
  description:
    "WEB-XR.studioは、Web制作・システム開発・アプリ開発・AIソリューションを一気通貫で提供する開発スタジオです。作って終わりではなく、育て続けるITパートナー。",
  openGraph: {
    title: "WEB-XR.studio｜Web・アプリ・AI開発スタジオ",
    description:
      "Web制作・システム開発・アプリ開発・AIソリューションを一気通貫で提供する開発スタジオ。",
    type: "website",
    locale: "ja_JP",
    siteName: "WEB-XR.studio",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `suppressHydrationWarning` guards against browser extensions that mutate
    // <html> before React hydrates — a common source of spurious warnings.
    <html
      lang="ja"
      className={`h-full antialiased ${noto.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      {/* Extensions (Grammarly and similar) stamp attributes such as
          `bis_register` and `__processed_*` onto <body> before React hydrates,
          which React reports as a mismatch. Suppressing here covers this
          element's own attributes; it does not cascade to descendants. */}
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
