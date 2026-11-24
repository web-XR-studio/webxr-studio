import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { DOMAINS } from "@/components/sections/ServiceDetail";
import { DomainArt } from "@/components/brand/DomainArt";
import { ArrowIcon, SectionLink } from "@/components/ui/SectionLink";
import { revealDelay } from "@/lib/reveal";

/**
 * トップページのサービス紹介。
 *
 * /service と同じ4領域を、番号付きのタイルで一度に見せる。4枚で固定なので
 * カルーセルにせず、すべてを一覧できるようにしている。タイルには代表的な
 * 「対応サービス」だけを載せ、全量と「対応プロジェクト」は /service に置く。
 */
export function Services() {
  return (
    <Section
      id="services"
      eyebrow="SERVICE"
      title="サービス"
      description="Web・システム・アプリ・AIを組み合わせ、企画から設計、開発、運用まで一貫してサポートします。"
    >
      <ul className="grid gap-6 md:grid-cols-2">
        {DOMAINS.map((d, i) => (
          <li key={d.slug} data-reveal style={revealDelay(i % 2, 120)}>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-[0_30px_70px_rgb(0_45_120_/_0.16)]">
              {/* 線画の面。ホバーで絵がわずかに寄る。 */}
              <div className="navy-field relative isolate overflow-hidden">
                <div aria-hidden className="bg-grid-dark absolute inset-0 -z-10" />
                <div className="px-10 pb-4 pt-14 sm:px-16">
                  <DomainArt
                    kind={d.kind}
                    className="hover-zoom transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <p className="absolute left-7 top-6 flex items-center gap-3 font-display text-xs font-semibold tracking-[0.22em] text-white/85">
                  <span className="text-cyan">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="h-px w-6 bg-white/30" />
                  {d.en}
                </p>
              </div>

              <div className="flex flex-1 flex-col p-7 sm:p-9">
                <h3 className="text-2xl font-black tracking-tight text-ink sm:text-[1.75rem]">
                  {d.title}
                </h3>
                <p className="mt-4 text-[0.95rem] leading-[1.95] text-ink-soft">
                  {d.lead}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {d.services.slice(0, 6).map((s) => (
                    <li
                      key={s}
                      className="rounded-full bg-surface px-3 py-1 text-xs text-ink-soft"
                    >
                      {s}
                    </li>
                  ))}
                </ul>

                {/* 相談が主、詳細が従。 */}
                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-8">
                  <Link
                    href={`/contact?service=${encodeURIComponent(d.formService)}#service`}
                    className="group/cta inline-flex items-center gap-4 rounded-full bg-accent py-2 pl-6 pr-2 text-sm font-bold tracking-wide text-white transition-colors duration-300 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40"
                  >
                    このサービスを相談する
                    <span
                      aria-hidden
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-accent-ink transition-transform duration-300 group-hover/cta:translate-x-0.5"
                    >
                      <ArrowIcon className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                  {/* /service の該当カードへ。業界別の対応プロジェクトはあちらに
                      載せているため、ここからは直接飛ばす。 */}
                  <Link
                    href={`/service#${d.slug}`}
                    className="group/more inline-flex items-center gap-2 text-sm font-bold text-accent-ink underline-offset-4 hover:underline"
                  >
                    対応プロジェクトを見る
                    <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/more:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
      <SectionLink href="/service">サービスをすべて見る</SectionLink>
    </Section>
  );
}
