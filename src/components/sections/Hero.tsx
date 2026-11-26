import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { XrMark } from "@/components/brand/XrMark";
import { ArrowIcon } from "@/components/ui/SectionLink";
import { HeroVisual } from "@/components/sections/hero/HeroVisual";
import type { Company, Portfolio } from "@/db/schema";
import { cn } from "@/lib/utils";

/**
 * Renders the tagline with every literal "XR" replaced by the brand mark.
 * Falls through untouched when the tagline contains no "XR", so an edit in the
 * admin panel can never break the heading.
 */
function taglineWithMark(text: string) {
  const parts = text.split("XR");
  if (parts.length === 1) return text;
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <XrMark />}
    </Fragment>
  ));
}

/**
 * 見出しを読点「、」の直後で行に分ける。行ごとに色の帯で覆ってから見せる
 * ため。読点が無ければ1行のまま（管理画面でどう書き換えても崩れない）。
 */
function taglineLines(text: string) {
  return text
    .split(/(?<=、)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function delay(ms: number) {
  return { "--d": `${ms}ms` } as React.CSSProperties;
}

/** 事例の画像。管理画面で登録された順に、使えるものを選ぶ。 */
function pickupImage(item: Portfolio) {
  return item.thumbnailUrl || item.imageUrl || item.workImageUrl;
}

/**
 * ファーストビュー。
 *
 * - 構成: 左に「線つきのラベル → 見出し → 説明 → 2つのボタン」、右に動く
 *   図、右端に注目の事例のカードを縦に重ねる（狭い画面では順に積む）。
 * - 背景: 斜めに切った2枚の面（左は細い斜線の入った淡い面、右は青みの
 *   面）が左右から滑り込み、少し遅れて下の青い帯が左から走る。その上に
 *   つながる点と粒子の図（HeroVisual）を描く。
 * - 見出しは行ごとに色の帯が左から伸びて覆い、右へ抜けると文字が現れる。
 *
 * どの動きも CSS だけで最初の描画から始まるので、読み込みを待たない。
 */
export function Hero({
  company,
  pickups = [],
}: {
  company: Company | null;
  /** 右端に出す事例（先頭の2件）。無ければカードの列ごと出さない。 */
  pickups?: Portfolio[];
}) {
  const tagline =
    company?.tagline || "Web・アプリ・AIで、事業の次の一手をつくる。";
  const lines = taglineLines(tagline);
  const cards = pickups.slice(0, 2);

  return (
    // The header is `fixed` and transparent at rest, so the stage runs up
    // behind it — no top margin. The top padding keeps the copy clear of it.
    <section className="hero-bg relative isolate overflow-hidden text-on-stage">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="hero-plane hero-plane--l" />
        <div className="hero-plane hero-plane--r" />
        <div className="hero-stripe" />
      </div>

      <div
        className={cn(
          "mx-auto grid min-h-[100svh] w-full max-w-[90rem] items-center gap-x-10 gap-y-14 px-5 pb-28 pt-32 sm:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:px-10 lg:pt-36",
          cards.length > 0 &&
            "xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)_16.5rem] xl:gap-x-8",
        )}
      >
        <div className="relative z-10">
          <p
            className="hero-fade flex items-center gap-4 font-display text-[0.72rem] font-medium tracking-[0.34em] text-stage-accent sm:text-xs"
            style={delay(150)}
          >
            <span aria-hidden className="h-px w-10 bg-current" />
            WEB · SYSTEM · APP · AI
          </p>

          {/* `aria-label` carries the plain string so screen readers announce
              the tagline as text, not as prose interrupted by an image or
              split into lines. */}
          <h1
            aria-label={tagline}
            className="mt-7 text-[clamp(1.85rem,7.2vw,3rem)] font-black leading-[1.36] tracking-[0.02em] lg:text-[3.1rem] xl:text-[3.45rem]"
          >
            {lines.map((line, i) => (
              <span key={i} aria-hidden className="block">
                <span
                  className={cn(
                    "hero-block",
                    // 1行目を色で立て、何をする会社かを先に伝える。
                    i === 0 && lines.length > 1 && "text-stage-accent",
                  )}
                  style={delay(320 + i * 200)}
                >
                  <span>{taglineWithMark(line)}</span>
                </span>
              </span>
            ))}
          </h1>

          <p
            className="hero-fade jp-phrase mt-8 max-w-[34rem] text-[0.95rem] leading-[2.05] text-on-stage/75 sm:text-[1.05rem]"
            style={delay(900)}
          >
            株式会社WEB-XR.studioは、お客様のビジネス成長を加速させるITパートナーです。豊富なWeb制作実績を強みに、システム構築からアプリ開発、AI実装までワンストップで最適なソリューションをご提供いたします。
          </p>

          {/* 相談の入口と、サービスの一覧。等幅の2列にして、狭い画面では
              積み上げる。 */}
          <div
            className="hero-fade mt-10 grid max-w-[34rem] gap-3 sm:grid-cols-2"
            style={delay(1050)}
          >
            <Link
              href="/contact"
              className="group/cta relative inline-flex h-[3.75rem] items-center justify-between gap-3 overflow-hidden rounded-full bg-stage-cta pl-7 pr-2 text-base font-bold tracking-wide text-on-stage-cta shadow-[0_12px_40px_rgb(0_102_255_/_0.3)] transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgb(0_102_255_/_0.42)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stage-accent/50"
            >
              {/* 光の筋がホバーで横切る。 */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-accent/15 to-transparent transition-transform duration-700 ease-out group-hover/cta:translate-x-[520%] light:via-white/30"
              />
              <span className="flex items-center gap-2.5">
                <Mail
                  aria-hidden
                  strokeWidth={1.9}
                  className="h-5 w-5 shrink-0 text-accent light:text-white"
                />
                お問い合わせ
              </span>
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-transform duration-300 group-hover/cta:translate-x-0.5 light:bg-white light:text-accent-ink"
              >
                <ArrowIcon />
              </span>
            </Link>

            <Link
              href="/service"
              className="group/more inline-flex h-[3.75rem] items-center justify-between gap-3 rounded-full border border-on-stage/25 bg-stage/60 pl-7 pr-2 text-base font-bold tracking-wide text-on-stage backdrop-blur-sm transition-colors duration-300 hover:border-on-stage hover:bg-on-stage/[0.06] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stage-accent/50"
            >
              サービスを見る
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-on-stage/30 transition-colors duration-300 group-hover/more:border-on-stage group-hover/more:bg-on-stage group-hover/more:text-stage"
              >
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>

        {/* 動く図。この列には position・transform・opacity を付けない
            （描画面が <section> を基準に全面へ広がるように）。出現の動きは
            HeroVisual の中の枠に付けている。 */}
        <div>
          <HeroVisual />
        </div>

        {cards.length > 0 && (
          <aside
            aria-labelledby="hero-pickup"
            className="hero-fade relative z-10 lg:col-span-2 xl:col-span-1"
            style={delay(1250)}
          >
            <p
              id="hero-pickup"
              className="flex items-center gap-3 font-display text-[0.72rem] font-medium tracking-[0.3em] text-on-stage/60"
            >
              <span aria-hidden className="h-px w-6 bg-current" />
              PICK UP
              <span className="sr-only">注目の事例</span>
            </p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {cards.map((item) => {
                const src = pickupImage(item);
                return (
                  <li key={item.id}>
                    <Link
                      href={`/case-study/${item.id}`}
                      className="group block overflow-hidden rounded-xl border border-on-stage/10 bg-stage-card shadow-[0_18px_44px_-18px_rgb(6_20_48_/_0.35)] backdrop-blur-md transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-stage-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage-accent/60"
                    >
                      <span className="relative block aspect-[16/8] overflow-hidden bg-on-stage/5">
                        {src && (
                          <Image
                            src={src}
                            alt=""
                            fill
                            sizes="(min-width: 1280px) 16.5rem, (min-width: 640px) 45vw, 90vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        )}
                        <span
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950/45 to-transparent"
                        />
                      </span>
                      <span className="block p-4">
                        <span className="block text-[0.7rem] font-bold tracking-[0.12em] text-stage-accent">
                          {item.industry || "CASE STUDY"}
                        </span>
                        <span className="mt-1.5 flex items-start justify-between gap-3">
                          <span className="line-clamp-2 text-sm font-bold leading-snug text-on-stage">
                            {item.title}
                          </span>
                          <ArrowUpRight
                            aria-hidden
                            strokeWidth={2}
                            className="mt-0.5 h-4 w-4 shrink-0 text-on-stage/60 transition-[translate,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-stage-accent"
                          />
                        </span>
                        {item.companyName && (
                          <span className="mt-1.5 block truncate text-xs text-on-stage/60">
                            {item.companyName}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}
      </div>

      {/* SCROLL の合図。下の中央に置く。 */}
      <div
        aria-hidden
        className="hero-fade absolute bottom-0 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-on-stage/55 lg:flex"
        style={delay(1500)}
      >
        <span className="font-display text-[0.65rem] font-medium tracking-[0.4em]">
          SCROLL
        </span>
        <span className="scroll-cue block h-14 w-px bg-on-stage/20 text-stage-accent" />
      </div>
    </section>
  );
}
