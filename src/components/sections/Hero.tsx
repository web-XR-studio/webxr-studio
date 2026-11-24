import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { XrMark } from "@/components/brand/XrMark";
import { ArrowIcon } from "@/components/ui/SectionLink";
import type { Company } from "@/db/schema";
import tokyoNight from "@/assets/photos/tokyo-night.webp";
import tokyoDay from "@/assets/photos/tokyo-day.webp";

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
 * 見出しを読点「、」の直後で行に分ける。行ごとに下からせり上げるため。
 * 読点が無ければ1行のまま（管理画面でどう書き換えても崩れない）。
 */
function taglineLines(text: string) {
  return text
    .split(/(?<=、)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * 背景に漂う光の粒。位置は固定の擬似乱数で決めるので、描画のたびに
 * 変わらない（サーバーで一度描くだけの装飾）。
 */
const PARTICLES = (() => {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return Array.from({ length: 22 }, () => ({
    left: `${(rand() * 100).toFixed(2)}%`,
    top: `${(40 + rand() * 60).toFixed(2)}%`,
    d: `${(-rand() * 16).toFixed(2)}s`,
    dur: `${(12 + rand() * 10).toFixed(2)}s`,
    dx: `${((rand() - 0.5) * 80).toFixed(0)}px`,
    size: rand() > 0.8 ? 3 : 2,
  }));
})();

function delay(ms: number) {
  return { "--d": `${ms}ms` } as React.CSSProperties;
}

/** 写真の表示幅。広い画面では本文の右側だけに写真を敷く。 */
const PHOTO_SIZES = "(min-width: 1024px) 80vw, 100vw";

export function Hero({ company }: { company: Company | null }) {
  const tagline =
    company?.tagline || "Web・アプリ・AIで、事業の次の一手をつくる。";
  const lines = taglineLines(tagline);

  return (
    // The header is `fixed` and transparent at rest, so the stage runs up
    // behind it — no top margin. `pt-36` keeps the copy clear of the header.
    <section className="hero-bg relative isolate flex min-h-[100svh] items-center overflow-hidden text-on-stage">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* 東京の街並み。ダークテーマは夜景、ライトテーマは昼の景色にして、
            テーマの切り替えがそのまま「夜 ↔ 昼」の切り替えに見えるようにする。
            既定（ダーク）の夜景は最初から読み込み、昼の写真は表示されたとき
            だけ読み込む（display:none の遅延画像は取得されない）。 */}
        <div className="absolute inset-0 lg:left-[20%]">
          <Image
            src={tokyoNight}
            alt=""
            fill
            sizes={PHOTO_SIZES}
            placeholder="blur"
            loading="eager"
            fetchPriority="high"
            className="hero-photo object-cover object-[45%_50%] light:hidden"
          />
          <Image
            src={tokyoDay}
            alt=""
            fill
            sizes={PHOTO_SIZES}
            placeholder="blur"
            className="hero-photo hidden object-cover object-[45%_50%] light:block"
          />
        </div>
        {/* 写真の上の幕。本文の側を濃く（ダークはネイビー、ライトは白）して
            文字を読ませ、反対側は街並みを見せる。 */}
        <div className="hero-scrim absolute inset-0" />
        <div className="bg-grid absolute inset-0 opacity-70" />
        <div className="aurora aurora-blue -right-[12%] -top-[18%] h-[46rem] w-[46rem]" />
        <div className="aurora aurora-violet -bottom-[30%] -left-[18%] h-[42rem] w-[42rem]" />
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={
              {
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                "--d": p.d,
                "--dur": p.dur,
                "--dx": p.dx,
              } as React.CSSProperties
            }
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-stage-accent/60 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-28 pt-36 sm:px-8 lg:pb-32 lg:pt-40">
        <div className="relative z-10 max-w-[40rem] xl:max-w-[44rem]">
          <p
            className="hero-fade inline-flex items-center gap-3 font-display text-[0.7rem] font-semibold tracking-[0.34em] text-stage-accent sm:text-xs"
            style={delay(80)}
          >
            <span
              aria-hidden
              className="beacon relative inline-block h-2 w-2 rounded-full bg-stage-accent"
            />
            WEB × SYSTEM × APP × AI
          </p>

          {/* `aria-label` carries the plain string so screen readers announce
              the tagline as text, not as prose interrupted by an image or
              split into lines. */}
          <h1
            aria-label={tagline}
            className="mt-6 text-[clamp(1.75rem,7.4vw,3rem)] font-black leading-[1.28] tracking-[-0.01em] lg:text-[3rem] xl:text-[3.6rem]"
          >
            {lines.map((line, i) => (
              <span key={i} aria-hidden className="hero-line">
                <span style={delay(220 + i * 150)}>{taglineWithMark(line)}</span>
              </span>
            ))}
          </h1>

          <p
            className="hero-fade jp-phrase mt-8 max-w-[36rem] text-[0.95rem] leading-[2.05] text-on-stage/80 sm:text-lg sm:leading-[2]"
            style={delay(620)}
          >
            株式会社WEB-XR.studioは、お客様のビジネス成長を加速させるITパートナーです。豊富なWeb制作実績を強みに、システム構築からアプリ開発、AI実装までワンストップで最適なソリューションをご提供いたします。
          </p>

          {/* 相談の入口と、サービスの一覧。等幅の2列にして、狭い画面では
              積み上げる。 */}
          <div
            className="hero-fade mt-10 grid max-w-[36rem] gap-3 sm:grid-cols-2"
            style={delay(780)}
          >
            <Link
              href="/contact"
              className="group/cta relative inline-flex h-[3.75rem] items-center justify-between gap-3 overflow-hidden rounded-full bg-stage-cta pl-7 pr-2 text-base font-bold tracking-wide text-on-stage-cta shadow-[0_12px_40px_rgb(0_102_255_/_0.35)] transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgb(0_102_255_/_0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stage-accent/50"
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
              className="group/more inline-flex h-[3.75rem] items-center justify-between gap-3 rounded-full border border-on-stage/35 bg-on-stage/[0.06] pl-7 pr-2 text-base font-bold tracking-wide text-on-stage backdrop-blur-sm transition-colors duration-300 hover:border-on-stage hover:bg-on-stage/[0.12] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stage-accent/50"
            >
              サービスを見る
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-on-stage/40 transition-colors duration-300 group-hover/more:border-on-stage group-hover/more:bg-on-stage group-hover/more:text-stage"
              >
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* SCROLL の合図。本文の左に余白が生まれる幅（1400px〜）でだけ出す。
          それより狭いと本文の書き出しと重なる。 */}
      <div
        aria-hidden
        className="hero-fade absolute bottom-0 left-8 hidden flex-col items-center gap-4 text-on-stage/60 min-[1400px]:flex"
        style={delay(1200)}
      >
        <span className="font-display text-[0.65rem] font-semibold tracking-[0.4em] [writing-mode:vertical-rl]">
          SCROLL
        </span>
        <span className="scroll-cue block h-20 w-px bg-on-stage/20 text-stage-accent" />
      </div>
    </section>
  );
}
