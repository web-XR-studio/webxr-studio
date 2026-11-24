import { Section } from "@/components/ui/Section";
import { revealDelay } from "@/lib/reveal";

/**
 * PROCESS — 開発の流れ。
 *
 * ご相談から運用までの6工程。広い画面では横一列に並べ、工程をつなぐ線が
 * 左から引かれていく。狭い画面では縦の時系列にする。
 */
const STEPS = [
  {
    en: "HEARING",
    title: "ヒアリング",
    body: "事業の目的や現在の課題、実現したいことを伺います。",
  },
  {
    en: "PROPOSAL",
    title: "ご提案・お見積もり",
    body: "最適な技術・体制・進め方をご提案し、お見積もりをお出しします。",
  },
  {
    en: "DESIGN",
    title: "要件定義・設計",
    body: "必要な機能や画面、データの構造を整理し、設計にまとめます。",
  },
  {
    en: "DEVELOPMENT",
    title: "デザイン・開発",
    body: "UI/UXデザインと開発を進め、動くものを確かめながら形にします。",
  },
  {
    en: "RELEASE",
    title: "テスト・公開",
    body: "動作や品質を検証したうえで、本番環境に公開します。",
  },
  {
    en: "GROWTH",
    title: "運用・改善",
    body: "公開後も保守・運用と改善を続け、事業の成長を支えます。",
  },
];

export function Process() {
  return (
    <Section
      id="process"
      eyebrow="PROCESS"
      title="開発の流れ"
      description="ご相談から公開後の運用まで、ひとつのチームが一貫して伴走します。"
    >
      <div className="relative">
        {/* 工程をつなぐ線。広い画面は横、狭い画面は縦。 */}
        <div
          aria-hidden
          data-reveal="line"
          className="absolute left-[2.25rem] right-[calc((100%_-_6.25rem)/6_-_2.25rem)] top-[calc(2.25rem_-_1px)] hidden h-[2px] rounded-full bg-gradient-to-r from-accent via-cyan to-violet lg:block"
        />
        <div
          aria-hidden
          className="absolute bottom-6 left-[calc(2.25rem_-_1px)] top-6 w-[2px] rounded-full bg-gradient-to-b from-accent via-cyan to-violet lg:hidden"
        />

        <ol className="relative grid gap-10 lg:grid-cols-6 lg:gap-5">
          {STEPS.map((s, i) => (
            <li
              key={s.en}
              data-reveal
              style={revealDelay(i, 120)}
              className="flex gap-6 lg:block"
            >
              <div className="group relative z-10 flex h-[4.5rem] w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-full border border-line bg-card shadow-[0_10px_30px_rgb(0_45_120_/_0.1)]">
                <span className="font-display text-[0.55rem] font-semibold tracking-[0.2em] text-muted">
                  STEP
                </span>
                <span className="font-display text-xl font-extrabold leading-none text-accent-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="pt-2 lg:pt-0">
                <p className="font-display text-[0.65rem] font-semibold tracking-[0.22em] text-accent-ink lg:mt-7">
                  {s.en}
                </p>
                <h3 className="mt-1.5 text-lg font-bold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-sm leading-[1.95] text-ink-soft">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
