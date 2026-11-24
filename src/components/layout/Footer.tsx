import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import type { SiteSettings } from "@/db/schema";

// Mirrors the header nav (English label + Japanese reading).
const NAV = [
  { href: "/", en: "HOME", label: "トップ" },
  { href: "/about", en: "ABOUT US", label: "私たちについて" },
  { href: "/company", en: "COMPANY", label: "会社案内" },
  { href: "/service", en: "SERVICE", label: "サービス" },
  { href: "/case-study", en: "CASE STUDY", label: "お客様事例" },
  { href: "/faq", en: "FAQ", label: "よくある質問" },
  { href: "/contact", en: "CONTACT", label: "お問い合わせ" },
];

/**
 * サイト共通のフッター。ステージの最も深い色（ダークはネイビー、ライトは
 * 淡い青）で締める。
 *
 * メールアドレスは出さない。問い合わせはフォームへ誘導する（設定値そのもの
 * は残してあり、他の用途では使える）。
 */
export function Footer({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-stage-deep text-on-stage">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-60"
      />
      <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <Logo
              href={null}
              className="text-on-stage"
              markClassName="h-12 w-12"
              nameClassName="text-xl"
            />
            <p className="jp-phrase mt-6 max-w-sm text-sm leading-[2] text-on-stage/75">
              Web制作・システム開発・アプリ開発・AIソリューションを一気通貫で。作って終わりではなく、育て続けるITパートナーです。
            </p>
            {(settings?.address || settings?.phone) && (
              <dl className="mt-8 space-y-3 text-sm">
                {settings?.address && (
                  <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3">
                    <dt className="font-display text-xs font-semibold leading-6 tracking-[0.2em] text-stage-accent">
                      ADDRESS
                    </dt>
                    <dd className="leading-6 text-on-stage/85">
                      {settings.address}
                    </dd>
                  </div>
                )}
                {settings?.phone && (
                  <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3">
                    <dt className="font-display text-xs font-semibold leading-6 tracking-[0.2em] text-stage-accent">
                      TEL
                    </dt>
                    <dd className="leading-6">
                      <a
                        href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                        className="font-semibold text-on-stage underline-offset-4 hover:underline"
                      >
                        {settings.phone}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>

          <nav aria-label="サイトマップ">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="group inline-block">
                    <span className="block font-display text-[0.7rem] font-semibold tracking-[0.22em] text-on-stage/60 transition-colors group-hover:text-stage-accent">
                      {item.en}
                    </span>
                    <span className="mt-1 flex items-center gap-2 text-sm font-medium text-on-stage">
                      {item.label}
                      <ArrowRight
                        aria-hidden
                        strokeWidth={2.4}
                        className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* 社名を大きく敷いて締める。装飾なので読み上げない。 */}
        <p
          aria-hidden
          className="mt-20 select-none whitespace-nowrap bg-gradient-to-b from-on-stage/[0.14] to-on-stage/[0.02] bg-clip-text font-display text-[min(8rem,calc((100vw_-_2.5rem)/8.9))] font-extrabold leading-none tracking-[-0.02em] text-transparent"
        >
          WEB-XR.studio
        </p>

        <div className="mt-8 flex flex-col gap-2 border-t border-on-stage/10 pt-6 text-xs text-on-stage/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} WEB-XR.studio. All rights reserved.</p>
          <p className="font-display tracking-[0.2em]">
            WEB × SYSTEM × APP × AI
          </p>
        </div>
      </div>
    </footer>
  );
}
