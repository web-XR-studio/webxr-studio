import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";

/**
 * STRENGTHS — 選ばれる理由。
 *
 * 文言はサイト内で既に述べている内容（ワンストップ・4つの専門チーム・
 * 作って終わりにしない・AI まで）を、強みとして言い直したもの。新しい
 * 実績や数字は足していない。
 */
const STRENGTHS = [
  {
    en: "ONE-STOP",
    title: "4つの領域を、ひとつの窓口で",
    body: "Web・システム・アプリ・AIを、企画から設計・開発・運用まで一貫して担当します。窓口がひとつなので、領域をまたぐご相談もそのまま進められます。",
    icon: (
      <>
        <path d="M12 3l8.5 4.5L12 12 3.5 7.5 12 3z" />
        <path d="M3.5 12L12 16.5l8.5-4.5" />
        <path d="M3.5 16.5L12 21l8.5-4.5" />
      </>
    ),
  },
  {
    en: "SPECIALIST TEAMS",
    title: "専門チームの連携",
    body: "それぞれの領域に精通したエンジニア・デザイナーがチームを組み、課題に合わせて最適な技術を組み合わせます。",
    icon: (
      <>
        <circle cx="12" cy="7.5" r="3" />
        <circle cx="5.5" cy="16.5" r="2.5" />
        <circle cx="18.5" cy="16.5" r="2.5" />
        <path d="M10.4 10.1l-3.3 4.2M13.6 10.1l3.3 4.2M8 16.5h8" />
      </>
    ),
  },
  {
    en: "LONG-TERM PARTNER",
    title: "作って終わりにしない伴走",
    body: "公開後の運用・保守から改善のご提案まで寄り添い、事業の成長に合わせてシステムを育て続けます。",
    icon: (
      <>
        <path d="M20 12a8 8 0 1 1-2.34-5.66" />
        <path d="M20 4v4.5h-4.5" />
        <path d="M8.5 12.5l2.5 2.5 4.5-5" />
      </>
    ),
  },
  {
    en: "AI READY",
    title: "AIまで見据えた設計",
    body: "生成AI・機械学習の知見を、既存のWeb・システム・アプリに組み込みます。いまの業務とサービスを、AIでさらに進化させます。",
    icon: (
      <>
        <path d="M12 3c.5 4.6 2.4 6.5 7 7-4.6.5-6.5 2.4-7 7-.5-4.6-2.4-6.5-7-7 4.6-.5 6.5-2.4 7-7z" />
        <path d="M19 15.5c.2 1.8.9 2.5 2.5 2.7-1.6.2-2.3.9-2.5 2.6-.2-1.7-.9-2.4-2.5-2.6 1.6-.2 2.3-.9 2.5-2.7z" />
      </>
    ),
  },
];

export function Strengths() {
  return (
    <Section
      id="strengths"
      tone="dark"
      eyebrow="STRENGTHS"
      title="WEB-XR.studioが選ばれる理由"
      description="Web・システム・アプリ・AIを一つのチームで。お客様の「やりたいこと」を、技術の垣根なく形にします。"
      backdrop={
        <>
          <div className="bg-grid-dark absolute inset-0" />
          <div className="aurora aurora-blue -right-[15%] -top-[20%] h-[44rem] w-[44rem]" />
          <div className="aurora aurora-violet -bottom-[35%] -left-[15%] h-[40rem] w-[40rem]" />
          {/* 大きな英字を背景に敷く。 */}
          <p className="absolute -bottom-[0.18em] right-[-0.04em] select-none font-display text-[22vw] font-extrabold leading-none tracking-tight text-white/[0.025] lg:text-[16rem]">
            WHY US
          </p>
        </>
      }
    >
      <ol className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2">
        {STRENGTHS.map((s, i) => (
          <li key={s.en} data-reveal style={revealDelay(i, 110)} className="bg-navy-900">
            <div className="group relative h-full overflow-hidden p-8 transition-colors duration-500 hover:bg-navy-800/80 sm:p-11">
              {/* ホバーで角から光が差す。 */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgb(56_189_248_/_0.22),transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
              <div className="flex items-start justify-between gap-6">
                {/* 上から下へ薄れていく数字。ホバーで明るくなる。 */}
                <span
                  aria-hidden
                  className="bg-gradient-to-b from-white/55 to-white/5 bg-clip-text font-display text-6xl font-extrabold leading-none text-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100 sm:text-7xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="h-11 w-11 shrink-0 text-cyan"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {s.icon}
                </svg>
              </div>
              <p className="mt-10 font-display text-[0.7rem] font-semibold tracking-[0.26em] text-cyan/90">
                {s.en}
              </p>
              <h3 className="mt-2 text-xl font-bold leading-snug sm:text-2xl">
                {s.title}
              </h3>
              <p className="mt-4 text-[0.95rem] leading-[2] text-white/75">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
