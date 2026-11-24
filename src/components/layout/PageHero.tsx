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
        {image && (
          <>
            {/* ダーク: 写真の明るさだけを拾ってネイビーに染める（luminosity）。
                ライト: 写真の色のまま。どちらも左から右へ溶かし込み、文字の
                背後はステージの色で覆う。 */}
            <div
              style={{ backgroundImage: `url(${image})` }}
              className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-luminosity [mask-image:linear-gradient(180deg,transparent,#000_30%)] lg:left-[30%] lg:[mask-image:linear-gradient(90deg,transparent,#000_45%)] light:opacity-95 light:mix-blend-normal"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-field via-field/70 to-field/20 lg:bg-gradient-to-r lg:from-field lg:via-field/75 lg:to-transparent" />
          </>
        )}
        <div className="bg-grid absolute inset-0" />
        <div className="aurora aurora-blue -right-[10%] -top-[40%] h-[36rem] w-[36rem]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-stage-accent/50 to-transparent" />
      </div>

      {/* The top padding clears the fixed header (h-24 = 96px). */}
      <div className="mx-auto flex min-h-[24rem] w-full max-w-6xl flex-col justify-end px-5 pb-14 pt-36 sm:min-h-[30rem] sm:pb-16 sm:pt-44">
        <p
          aria-hidden
          className="hero-fade text-gradient-stage break-words pb-1 font-display text-[2.6rem] font-extrabold uppercase leading-[1.02] tracking-[-0.01em] sm:text-7xl lg:text-[5.5rem]"
          style={{ "--d": "60ms" } as React.CSSProperties}
        >
          {en}
        </p>
        <h1
          className="hero-fade mt-5 flex items-center gap-3 text-xl font-bold tracking-wide sm:text-2xl"
          style={{ "--d": "200ms" } as React.CSSProperties}
        >
          <span aria-hidden className="h-[3px] w-8 shrink-0 rounded-full bg-stage-accent" />
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
        <ol className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 px-5 py-4 text-xs text-on-stage/70 sm:text-[0.8rem]">
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
