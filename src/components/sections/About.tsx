import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SectionLink } from "@/components/ui/SectionLink";
import { CountUp } from "@/components/ui/CountUp";
import { EXPERIENCE } from "@/lib/company-facts";
import { revealDelay } from "@/lib/reveal";

/**
 * ABOUT US — an intro statement, years of experience per domain, and (on
 * /about) a closing summary. The copy is editorial rather than DB-driven, so
 * it lives here.
 */

/**
 * 導入: 大きな一文と本文、右に写真。トップページと /about で共通。
 * 見出しは左の列の頭に置き、縦に長い写真と左右の釣り合いをとる。
 */
function Intro({ showHeader }: { showHeader: boolean }) {
  return (
    <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
      <div>
        {showHeader && (
          <SectionHeading
            eyebrow="ABOUT US"
            title="私たちについて"
            className="mb-12"
          />
        )}
        <p
          data-reveal
          className="text-[1.7rem] font-black leading-[1.55] tracking-[0.01em] text-ink sm:text-4xl sm:leading-[1.5] xl:text-[2.6rem]"
        >
          作って終わりではなく、
          <br />
          <span className="relative whitespace-nowrap">
            <span className="relative z-10 text-accent-ink">育て続ける</span>
            {/* 蛍光ペンのような下線。 */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-[0.08em] -z-0 h-[0.32em] bg-accent/15"
            />
          </span>
          ITパートナー。
        </p>
        <div
          data-reveal
          style={revealDelay(1, 140)}
          className="mt-8 space-y-5 text-base leading-[2.05] text-ink-soft sm:text-lg"
        >
          <p>
            私たちは、Web・システム・アプリ・AIを専門とするエンジニア・デザイナーが集まる開発スタジオです。
          </p>
          <p>
            それぞれの専門領域を持つプロフェッショナルが連携し、企画から設計、開発、運用までワンストップで提供しています。
          </p>
        </div>
      </div>

      {/* 写真は透過の重ね組みなので、白地の上にそのまま置ける。幕が左から
          開くように出し、中の写真はわずかに引きながら落ち着かせる。背後に
          格子の面を敷いて、写真の余白を埋める。 */}
      <div className="relative mx-auto w-full max-w-md lg:max-w-none">
        <div
          aria-hidden
          className="bg-dots-light absolute -right-4 -top-6 h-3/5 w-3/5 sm:-right-8"
        />
        <div
          aria-hidden
          className="absolute -bottom-5 left-[6%] h-2/5 w-2/5 rounded-2xl bg-gradient-to-br from-accent/20 to-cyan/10"
        />
        <div data-reveal="mask" className="relative">
          <Image
            src="/about/intro.webp"
            alt=""
            aria-hidden
            width={960}
            height={1117}
            sizes="(min-width: 1024px) 32rem, 90vw"
            className="reveal-zoom h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}

/** 各領域の経験年数。数字は画面に入ったときに数え上げる。 */
function Numbers() {
  return (
    <div className="mt-24">
      <div data-reveal className="flex items-end justify-between gap-6">
        <p className="flex items-center gap-3 text-sm font-bold tracking-wide text-ink">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-accent" />
          各領域の経験年数
        </p>
        <p className="hidden font-display text-xs font-semibold tracking-[0.24em] text-muted sm:block">
          YEARS OF EXPERIENCE
        </p>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
        {EXPERIENCE.map((e, i) => (
          <div
            key={e.key}
            data-reveal
            style={revealDelay(i, 110)}
            className="flex flex-col bg-card px-6 py-8 sm:px-8 sm:py-10"
          >
            <dt className="order-last mt-3 text-sm font-bold text-ink-soft sm:text-base">
              {e.label}
            </dt>
            <dd className="flex items-baseline gap-1.5">
              <span className="sr-only">{e.label}の経験：</span>
              <CountUp
                value={e.years}
                className="font-display text-[3.25rem] font-extrabold leading-none tracking-tight text-gradient tabular-nums sm:text-7xl"
              />
              <span className="whitespace-nowrap text-sm font-bold text-ink sm:text-lg">
                年以上
              </span>
            </dd>
            <span
              aria-hidden
              className="order-first mb-5 font-display text-[0.7rem] font-semibold tracking-[0.24em] text-accent-ink"
            >
              {e.en}
            </span>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** 締めの「ひとつの窓口、多様な専門性」。/about のみ。 */
function Closing() {
  return (
    <div
      data-reveal
      className="stage-field relative isolate mt-24 overflow-hidden rounded-3xl px-7 py-16 text-center text-on-stage sm:px-12 sm:py-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url(/about/closing.webp)] bg-cover bg-center opacity-25 mix-blend-luminosity light:opacity-[0.14] light:mix-blend-multiply" />
        <div className="bg-grid absolute inset-0" />
        <div className="aurora aurora-blue -left-[20%] -top-[60%] h-[34rem] w-[34rem]" />
      </div>
      {/* 英語を小さなラベル、日本語を主見出しに。 */}
      <p className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-stage-accent sm:text-base">
        One Partner, Multiple Expertise
      </p>
      <h3 className="mt-4 text-[1.75rem] font-black leading-tight tracking-tight sm:text-4xl xl:text-5xl">
        ひとつの窓口、多様な専門性
      </h3>
      <div className="mx-auto mt-8 max-w-3xl space-y-4 text-base leading-[2.05] text-on-stage/80 sm:text-lg">
        <p>
          私たちはWeb・システム・アプリ・AIの専門性を掛け合わせることで、単なる制作会社ではなく、
          <strong className="font-bold text-on-stage">
            「ビジネス課題を技術で解決する開発パートナー」
          </strong>
          として価値を提供しています。
        </p>
        <p>
          Web制作からシステム・アプリ・AIまで、一つの窓口で一貫して対応できることがWEB-XR.studioの強みです。
        </p>
      </div>
    </div>
  );
}

export function About({
  /** Hide the section header on /about, where PageHero already shows it. */
  showHeader = true,
  /**
   * トップページは導入と経験年数だけの "summary" で /about へ誘導する。
   * /about は締めの一文まで載せる "full"。
   */
  variant = "full",
}: {
  showHeader?: boolean;
  variant?: "summary" | "full";
} = {}) {
  const summary = variant === "summary";
  return (
    <Section id="about">
      <Intro showHeader={showHeader} />
      <Numbers />
      {summary ? (
        <SectionLink href="/about">私たちについて詳しく見る</SectionLink>
      ) : (
        <Closing />
      )}
    </Section>
  );
}
