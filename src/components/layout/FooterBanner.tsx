"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";

/**
 * Full-width call-to-action band sitting directly above the footer.
 *
 * ステージの面に大きな「CONTACT」を置き、右に行動の入口（フォーム／電話）
 * を並べる。帯そのものはリンクにしない — 文字の選択や写真のクリックで
 * 遷移してしまうため、押せるのは右のカードだけ。
 *
 * Hidden on /contact itself, where it would link to the page you are already
 * on. Needs to be a client component only for that path check.
 */
export function FooterBanner({ phone }: { phone?: string }) {
  const pathname = usePathname();
  if (pathname === "/contact") return null;

  const tel = phone?.replace(/[^\d+]/g, "");

  return (
    <section
      aria-labelledby="footer-cta-heading"
      className="stage-field relative isolate overflow-hidden text-on-stage"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* 打ち合わせの写真を右側に敷く。ダークはネイビーに溶かし、ライトは
            写真の色のまま薄く見せる。 */}
        <div className="absolute inset-y-0 right-0 w-full bg-[url(/about/footer-cta.webp)] bg-cover bg-center opacity-30 mix-blend-luminosity [mask-image:linear-gradient(180deg,transparent,#000_60%)] lg:w-[55%] lg:[mask-image:linear-gradient(90deg,transparent,#000_55%)] light:opacity-35 light:mix-blend-normal" />
        <div className="bg-grid absolute inset-0" />
        <div className="aurora aurora-blue -left-[10%] -top-[30%] h-[40rem] w-[40rem]" />
        <div className="aurora aurora-violet -bottom-[40%] right-[10%] h-[34rem] w-[34rem]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-stage-accent/50 to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-24 sm:py-32 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div data-reveal>
          <p
            aria-hidden
            className="text-gradient-stage font-display text-[3.4rem] font-extrabold uppercase leading-none tracking-[-0.01em] sm:text-8xl"
          >
            CONTACT
          </p>
          <h2
            id="footer-cta-heading"
            className="mt-6 flex items-center gap-3 text-2xl font-bold leading-snug tracking-wide sm:text-3xl"
          >
            <span aria-hidden className="h-[3px] w-8 shrink-0 rounded-full bg-stage-accent" />
            まずはお気軽にご相談ください
          </h2>
          <p className="jp-phrase mt-6 max-w-lg text-base leading-[2] text-on-stage/75 sm:text-lg">
            Web制作・システム開発・アプリ開発・AI開発まで、お客様の課題に最適な形をご提案します。ご相談・お見積もりは無料です。
          </p>
        </div>

        <div data-reveal className="space-y-4" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
          <Link
            href="/contact"
            className="group flex items-center justify-between gap-6 rounded-2xl bg-accent p-7 text-white shadow-[0_20px_60px_rgb(0_102_255_/_0.35)] transition-[background-color,translate] duration-300 hover:-translate-y-1 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stage-accent/50 sm:p-8"
          >
            <span>
              <span className="block font-display text-xs font-semibold tracking-[0.24em] text-white/80">
                CONTACT FORM
              </span>
              <span className="jp-phrase mt-2 block text-lg font-bold sm:text-2xl">
                お問い合わせフォーム
              </span>
              <span className="jp-phrase mt-1 block text-sm text-white/85">
                ご相談内容をお送りください。担当者より折り返しご連絡します。
              </span>
            </span>
            <span
              aria-hidden
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-accent-ink transition-transform duration-300 group-hover:translate-x-1"
            >
              <ArrowRight strokeWidth={2.2} className="h-5 w-5" />
            </span>
          </Link>

          {phone && tel && (
            <a
              href={`tel:${tel}`}
              className="group flex items-center justify-between gap-6 rounded-2xl border border-on-stage/15 bg-stage-card p-7 backdrop-blur-sm transition-colors duration-300 hover:border-on-stage/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stage-accent/50 sm:p-8 light:shadow-[0_12px_36px_rgb(0_45_120_/_0.08)]"
            >
              <span>
                <span className="block font-display text-xs font-semibold tracking-[0.24em] text-stage-accent">
                  TEL
                </span>
                <span className="mt-2 block text-base font-bold">
                  お電話でのご相談
                </span>
                <span className="mt-1 block font-display text-2xl font-bold tracking-wide sm:text-3xl">
                  {phone}
                </span>
              </span>
              <span
                aria-hidden
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-on-stage/30 transition-colors duration-300 group-hover:border-stage-cta group-hover:bg-stage-cta group-hover:text-on-stage-cta"
              >
                <Phone strokeWidth={1.8} className="h-5 w-5" />
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
