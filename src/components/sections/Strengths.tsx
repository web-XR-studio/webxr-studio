import { BrainCircuit, Cpu, Handshake, Layers, type LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";

/**
 * STRENGTHS — 選ばれる理由。
 *
 * 文言はサイト内で既に述べている内容（ワンストップ・課題に合わせた技術の
 * 組み合わせ・作って終わりにしない・AI まで）を、強みとして言い直したもの。
 * 新しい実績や数字は足していない。
 */
const STRENGTHS: { en: string; title: string; body: string; Icon: LucideIcon }[] = [
  {
    en: "ONE-STOP",
    title: "4つの領域を、ひとつの窓口で",
    body: "Web・システム・アプリ・AIを、企画から設計・開発・運用まで一貫して担当します。窓口がひとつなので、領域をまたぐご相談もそのまま進められます。",
    Icon: Layers,
  },
  {
    en: "BEST-FIT TECHNOLOGY",
    title: "課題に合わせた最適な技術",
    body: "それぞれの領域に精通したエンジニア・デザイナーが、課題や事業フェーズに合わせて最適な技術を選び、組み合わせます。",
    Icon: Cpu,
  },
  {
    en: "LONG-TERM PARTNER",
    title: "作って終わりにしない伴走",
    body: "公開後の運用・保守から改善のご提案まで寄り添い、事業の成長に合わせてシステムを育て続けます。",
    Icon: Handshake,
  },
  {
    en: "AI READY",
    title: "AIまで見据えた設計",
    body: "生成AI・機械学習の知見を、既存のWeb・システム・アプリに組み込みます。いまの業務とサービスを、AIでさらに進化させます。",
    Icon: BrainCircuit,
  },
];

export function Strengths() {
  return (
    <Section
      id="strengths"
      tone="stage"
      eyebrow="STRENGTHS"
      title="WEB-XR.studioが選ばれる理由"
      description="Web・システム・アプリ・AIを、ひとつの窓口で。お客様の「やりたいこと」を、技術の垣根なく形にします。"
      backdrop={
        <>
          <div className="bg-grid absolute inset-0" />
          <div className="aurora aurora-blue -right-[15%] -top-[20%] h-[44rem] w-[44rem]" />
          <div className="aurora aurora-violet -bottom-[35%] -left-[15%] h-[40rem] w-[40rem]" />
          {/* 大きな英字を背景に敷く。 */}
          <p className="absolute -bottom-[0.18em] right-[-0.04em] select-none font-display text-[22vw] font-extrabold leading-none tracking-tight text-on-stage/[0.03] lg:text-[16rem]">
            WHY US
          </p>
        </>
      }
    >
      {/* ダーク: ネイビーのセルを細い線で区切る。ライト: 白いカードを並べる。 */}
      <ol className="grid gap-px overflow-hidden rounded-3xl border border-on-stage/10 bg-on-stage/10 md:grid-cols-2 light:gap-5 light:overflow-visible light:rounded-none light:border-0 light:bg-transparent">
        {STRENGTHS.map(({ en, title, body, Icon }, i) => (
          <li
            key={en}
            data-reveal
            style={revealDelay(i, 110)}
            className="bg-stage light:bg-transparent"
          >
            <div className="group relative h-full overflow-hidden p-8 transition-[background-color,box-shadow,border-color] duration-500 hover:bg-stage-card-hover sm:p-11 light:rounded-3xl light:border light:border-line light:bg-card light:shadow-[0_10px_40px_rgb(0_45_120_/_0.06)] light:hover:border-accent/30 light:hover:shadow-[0_24px_60px_rgb(0_45_120_/_0.12)]">
              {/* ホバーで角から光が差す。 */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgb(56_189_248_/_0.22),transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100 light:bg-[radial-gradient(closest-side,rgb(0_102_255_/_0.12),transparent)]"
              />
              <div className="flex items-start justify-between gap-6">
                {/* 上から下へ薄れていく数字。ホバーで明るくなる。 */}
                <span
                  aria-hidden
                  className="bg-gradient-to-b from-on-stage/55 to-on-stage/5 bg-clip-text font-display text-6xl font-extrabold leading-none text-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100 sm:text-7xl light:from-accent/60 light:to-accent/5"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-stage-accent/30 bg-stage-accent/10 text-stage-accent transition-colors duration-500 group-hover:border-stage-accent group-hover:bg-stage-accent group-hover:text-stage light:group-hover:text-white">
                  <Icon aria-hidden strokeWidth={1.6} className="h-7 w-7" />
                </span>
              </div>
              <p className="mt-10 font-display text-[0.7rem] font-semibold tracking-[0.26em] text-stage-accent">
                {en}
              </p>
              <h3 className="mt-2 text-xl font-bold leading-snug sm:text-2xl">
                {title}
              </h3>
              <p className="mt-4 text-[0.95rem] leading-[2] text-on-stage/75">
                {body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
