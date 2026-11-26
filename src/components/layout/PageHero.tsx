import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "@/lib/site";

type Crumb = { label: string; href: string };

/**
 * Banner for the standalone tab pages. Mirrors the top page's stage field so
 * the fixed header (which is transparent while over `.hero-bg`) stays
 * legible, and gives each page a bilingual title in the site's nav idiom.
 *
 * 写真は右側に敷き、文字の乗る左側はステージの色で覆う。ダークテーマでは
 * ネイビーに溶かした単色調、ライトテーマでは写真の色のまま見せる。下端に
 * パンくずを置き、同じ内容を構造化データ（BreadcrumbList）でも出す。
 */
export function PageHero({
  en,
  title,
  description,
  image,
  trail = [],
  current,
}: {
  en: string;
  title: string;
  description?: string;
  /** Optional photo behind the stage field. */
  image?: string;
  /** パンくずの中間の階層。HOME と現在のページは自動で付く。 */
  trail?: Crumb[];
  /** パンくずの末尾に出す名前。既定は title。 */
  current?: string;
}) {
  const last = current ?? title;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "HOME", item: `${SITE_URL}/` },
      ...trail.map((c) => ({ name: c.label, item: `${SITE_URL}${c.href}` })),
      { name: last },
    ].map((c, i) => ({ "@type": "ListItem", position: i + 1, ...c })),
  };

  return (
    // `hero-bg` is the shared stage field. The header keys its transparent
    // state off this class, so every inner page must carry it.
    <section className="hero-bg relative isolate overflow-hidden text-on-stage">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* トップのヒーローと同じ、斜めに切った面（写真より奥に敷く）。 */}
        <div className="hero-plane hero-plane--l" />
        {image && (
          <>
            {/* ダーク: 写真の明るさだけを拾ってネイビーに染める（luminosity）。
                ライト: 写真の色のまま。どちらも左から右へ溶かし込み、文字の
                背後はステージの色で覆う。 */}
            <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(180deg,transparent,#000_30%)] lg:left-[30%] lg:[mask-image:linear-gradient(90deg,transparent,#000_45%)]">
              {/* スクロールに合わせて写真をゆっくり沈める（視差）。動くぶん
                  だけ上下に大きくしておく。 */}
              <div
                data-parallax="8"
                style={{ backgroundImage: `url(${image})` }}
                className="absolute inset-x-0 -inset-y-[10%] bg-cover bg-center opacity-45 mix-blend-luminosity light:opacity-95 light:mix-blend-normal"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-field via-field/70 to-field/20 lg:bg-gradient-to-r lg:from-field lg:via-field/75 lg:to-transparent" />
          </>
        )}
        <div className="bg-grid absolute inset-0 opacity-60" />
        {/* 下を走る帯。 */}
        <div className="hero-stripe !bottom-[3.4rem] !h-[5px] !w-[36vw]" />
      </div>

      {/* The top padding clears the fixed header (h-24 = 96px). */}
      <div className="mx-auto flex min-h-[24rem] w-full max-w-[74.5rem] flex-col justify-end px-5 pb-14 pt-36 sm:min-h-[30rem] sm:pb-16 sm:pt-44">
        {/* 英字は色の帯が左から覆って右へ抜けると現れる。 */}
        <p
          aria-hidden
          className="break-words font-display text-[2.8rem] font-medium uppercase leading-[1.05] tracking-[0.05em] sm:text-7xl lg:text-[5.75rem]"
        >
          <span
            className="hero-block"
            style={{ "--d": "120ms" } as React.CSSProperties}
          >
            <span>{en}</span>
          </span>
        </p>
        <h1
          className="hero-fade mt-5 flex items-center gap-3 text-lg font-bold tracking-[0.12em] text-stage-accent sm:text-xl"
          style={{ "--d": "520ms" } as React.CSSProperties}
        >
          <span aria-hidden className="h-px w-10 shrink-0 bg-current" />
          {title}
        </h1>
        {description && (
          <p
            className="hero-fade mt-5 max-w-2xl text-base leading-[1.95] text-on-stage/80 sm:text-lg"
            style={{ "--d": "320ms" } as React.CSSProperties}
          >
            {description}
          </p>
        )}
      </div>

      <nav aria-label="パンくずリスト" className="relative border-t border-on-stage/10">
        <ol className="mx-auto flex w-full max-w-[74.5rem] flex-wrap items-center gap-x-3 gap-y-1 px-5 py-4 text-xs text-on-stage/70 sm:text-[0.8rem]">
          <li>
            <Link
              href="/"
              className="font-display font-semibold tracking-[0.12em] transition-colors hover:text-on-stage"
            >
              HOME
            </Link>
          </li>
          {trail.map((c) => (
            <li key={c.href} className="flex items-center gap-3">
              <Sep />
              <Link href={c.href} className="transition-colors hover:text-on-stage">
                {c.label}
              </Link>
            </li>
          ))}
          <li className="flex min-w-0 items-center gap-3">
            <Sep />
            <span aria-current="page" className="truncate text-on-stage">
              {last}
            </span>
          </li>
        </ol>
      </nav>

      <script
        type="application/ld+json"
        // `<` はエスケープして、文字列中の `</script>` で閉じられないようにする。
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </section>
  );
}

function Sep() {
  return (
    <ChevronRight
      aria-hidden
      strokeWidth={2}
      className="h-3.5 w-3.5 shrink-0 text-on-stage/40"
    />
  );
}
