import type { Metadata } from "next";
import { Montserrat, Noto_Sans_JP } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { DEFAULT_THEME, THEME_INIT_SCRIPT } from "@/lib/theme";
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
    // `suppressHydrationWarning` lets the theme script below (and browser
    // extensions) change <html> attributes before React hydrates: React keeps
    // what is in the DOM instead of reporting a mismatch.
    <html
      lang="ja"
      data-theme={DEFAULT_THEME}
      className={`h-full antialiased ${noto.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* 保存済みの配色テーマを描画前に反映する。<head> で同期的に走るので、
            既定のテーマが一瞬見えてから切り替わる「ちらつき」が起きない。 */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
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
