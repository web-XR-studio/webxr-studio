import { Fragment } from "react";
import { XrMark } from "@/components/brand/XrMark";
import { ProjectMatch } from "@/components/sections/ProjectMatch";
import { JapanNetwork } from "@/components/sections/hero/JapanNetwork";
import type { Company } from "@/db/schema";

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
  return Array.from({ length: 26 }, () => ({
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

export function Hero({ company }: { company: Company | null }) {
  const tagline =
    company?.tagline || "Web・アプリ・AIで、事業の次の一手をつくる。";
  const lines = taglineLines(tagline);

  return (
    // The header is `fixed` and transparent at rest, so the navy field runs up
    // behind it — no top margin. `pt-36` keeps the copy clear of the header.
    <section className="hero-bg relative isolate flex min-h-[100svh] items-center overflow-hidden text-white">
      {/* 背景: 格子・光のにじみ・漂う粒・下端の光の線。 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="bg-grid-dark absolute inset-0" />
        <div className="aurora aurora-blue -right-[12%] -top-[18%] h-[46rem] w-[46rem]" />
        <div className="aurora aurora-violet -bottom-[30%] -left-[18%] h-[42rem] w-[42rem]" />
        <div className="aurora aurora-cyan -bottom-[24%] right-[18%] h-[30rem] w-[30rem]" />
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
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center px-5 pb-28 pt-36 sm:px-8 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.78fr)] lg:gap-x-4 lg:pb-32 lg:pt-40">
        <div className="relative z-10 min-w-0">
          <p
            className="hero-fade inline-flex items-center gap-3 font-display text-[0.7rem] font-semibold tracking-[0.34em] text-cyan sm:text-xs"
            style={delay(80)}
          >
            <span
              aria-hidden
              className="beacon relative inline-block h-2 w-2 rounded-full bg-cyan"
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
            className="hero-fade jp-phrase mt-8 max-w-[36rem] text-[0.95rem] leading-[2.05] text-white/80 sm:text-lg sm:leading-[2]"
            style={delay(620)}
          >
            株式会社WEB-XR.studioは、お客様のビジネス成長を加速させるITパートナーです。豊富なWeb制作実績を強みに、システム構築からアプリ開発、AI実装までワンストップで最適なソリューションをご提供いたします。
          </p>

          {/* 相談の入口。1つ目はその場で担当チームを判定するモーダルを開き、
              2つ目は問い合わせページへ送る。 */}
          <div className="hero-fade max-w-[36rem]" style={delay(780)}>
            <ProjectMatch />
          </div>
        </div>

        {/* 拠点マップ。広い画面では右の列に置き、狭い画面では本文の背後に
            薄く敷く（縦に積むとヒーローが間延びするため）。xl 以上では左へ
            はみ出させて大きく見せる（lg ではボタンに重なるので、列に収める）。 */}
        <div className="pointer-events-none absolute -right-[30%] top-28 w-[110%] max-w-[34rem] opacity-30 sm:-right-[10%] sm:top-24 sm:w-[78%] sm:opacity-20 lg:pointer-events-auto lg:relative lg:right-auto lg:top-auto lg:w-full lg:max-w-none lg:opacity-100 xl:-ml-[30%] xl:w-[132%]">
          <JapanNetwork className="map-in" />
        </div>
      </div>

      {/* SCROLL の合図。本文の左に余白が生まれる幅（1400px〜）でだけ出す。
          それより狭いと本文の書き出しと重なる。 */}
      <div
        aria-hidden
        className="hero-fade absolute bottom-0 left-8 hidden flex-col items-center gap-4 text-white/60 min-[1400px]:flex"
        style={delay(1200)}
      >
        <span className="font-display text-[0.65rem] font-semibold tracking-[0.4em] [writing-mode:vertical-rl]">
          SCROLL
        </span>
        <span className="scroll-cue block h-20 w-px bg-white/20 text-cyan" />
      </div>
    </section>
  );
}
