import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FooterBanner } from "@/components/layout/FooterBanner";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content";

// This layout reads DB-backed settings (footer email/phone/address/socials).
// `dynamic` does NOT inherit from the child page, so without this the layout
// would be rendered once at build time and admin edits would never appear.
export const dynamic = "force-dynamic";

// SEO fields are admin-editable, so the public site's title/description come
// from the DB. Falls back to the root layout's static defaults when unset.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings?.seoTitle?.trim();
  const description = settings?.seoDescription?.trim();

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(title || description
      ? {
          openGraph: {
            ...(title ? { title } : {}),
            ...(description ? { description } : {}),
          },
        }
      : {}),
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      {/* 管理画面の保存を待ち受ける常時接続は置かない。訪問者ごとに関数が
          開きっぱなしになり、待っている間もずっと課金対象になるため。
          このレイアウトは `force-dynamic` なので、次の遷移や再読み込みで
          最新の内容が出る。 */}
      <Header />
      <main className="flex-1">{children}</main>
      {/* 全ページ共通の問い合わせ導線。フッターの直前に置く。電話番号が
          設定されていれば、フォームと並べて出す。 */}
      <FooterBanner phone={settings?.phone || undefined} />
      <Footer settings={settings} />
      <ScrollToTop />
      {/* スクロールに合わせた出現演出。[data-reveal] を見張るだけで描画はしない。 */}
      <RevealObserver />
      {/* 慣性スクロールと、写真の視差。こちらも描画はしない。 */}
      <SmoothScroll />
    </div>
  );
}
