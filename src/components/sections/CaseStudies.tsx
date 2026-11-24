import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { ArrowIcon, SectionLink } from "@/components/ui/SectionLink";
import { CaseStudyCarousel } from "@/components/sections/CaseStudyCarousel";
import { AvatarFallback } from "@/components/ui/AvatarFallback";
import type { Portfolio } from "@/db/schema";
import { revealDelay } from "@/lib/reveal";
import { cn } from "@/lib/utils";

/**
 * お客様事例の一覧。カードをクリックすると個別ページ（/case-study/[id]）へ遷移する。
 *
 * カード表面: お客様画像 / 業界 / 案件名 / お客様の声（抜粋）/ 企業名・お名前
 * 技術スタックは /case-study のみ（トップページは概要に絞る）。
 */

/** 企業名と個人名を組み立てる。企業名が空なら個人名のみ。 */
export function clientLabel(item: Portfolio): string {
  const company = item.companyName?.trim() ?? "";
  const person = item.clientName?.trim() ?? "";
  if (company && person) return `${company}　${person}`;
  return company || person;
}

export function Stack({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <li
          key={t}
          className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-ink-soft"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

export function CaseStudies({
  items,
  /** 一覧の上に出す一文。掲載が実績の一部である旨を伝える。 */
  description,
  /** トップページではセクション見出しを出す（/case-study は PageHero が担う）。 */
  eyebrow,
  title,
  tone,
  /**
   * 表示する最大件数。指定がなければ全件。
   * 事例が増えてもトップページの見た目が崩れないようにするための上限。
   */
  limit,
  /** 一覧の下に置く /case-study への導線。 */
  pageLink,
  /**
   * 広い画面での列数。/case-study は件数が増えるので既定の 3。
   */
  columns = 3,
  /**
   * カードに技術スタックを載せるか。/case-study では出し、トップページでは
   * 概要に絞るため出さない。
   */
  showStack = true,
  /**
   * 1枚ずつ送るカルーセルで見せるか。トップページは件数が増えても
   * 縦に伸びないよう true、/case-study はグリッドのまま。
   */
  carousel = false,
}: {
  items: Portfolio[];
  description?: string;
  eyebrow?: string;
  title?: string;
  tone?: "default" | "muted";
  limit?: number;
  pageLink?: boolean;
  columns?: 3 | 4;
  showStack?: boolean;
  carousel?: boolean;
}) {
  if (items.length === 0) return null;

  const shown = limit ? items.slice(0, limit) : items;

  return (
    <Section
      id="case-study"
      tone={tone}
      eyebrow={eyebrow}
      title={title}
      description={description}
    >
      {carousel ? (
        <div data-reveal>
          <CaseStudyCarousel items={shown} />
        </div>
      ) : (
        // クラス名は静的に書く。Tailwind は文字列連結で組み立てたクラスを
        // 検出できず、スタイルが生成されないため。
        <ul
          className={cn(
            "grid gap-6 text-left sm:grid-cols-2",
            columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
          )}
        >
          {shown.map((item, i) => {
            const src = item.imageUrl || item.thumbnailUrl || item.workImageUrl;
            return (
              <li
                key={item.id}
                data-reveal
                style={revealDelay(i % (columns === 4 ? 4 : 3), 100)}
              >
                <Link
                  href={`/case-study/${item.id}`}
                  // ホバーで少し浮かせ、枠線を accent に寄せる。
                  className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-card text-left transition-[translate,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-[0_26px_60px_rgb(0_45_120_/_0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  {/* 一覧のサムネイルはお客様のお写真。無ければサムネイル指定、
                      それも無ければ制作物画像を使い、いずれも無ければ既定の
                      アバターを出す。写真は切り抜かず、余白には同じ写真を
                      ぼかして敷く。 */}
                  {src ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
                      <Image
                        src={src}
                        alt=""
                        aria-hidden
                        fill
                        sizes={
                          columns === 4
                            ? "(min-width: 1024px) 17rem, (min-width: 640px) 50vw, 100vw"
                            : "(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
                        }
                        className="scale-125 object-cover opacity-60 blur-2xl"
                      />
                      <Image
                        src={src}
                        alt=""
                        aria-hidden
                        fill
                        sizes={
                          columns === 4
                            ? "(min-width: 1024px) 17rem, (min-width: 640px) 50vw, 100vw"
                            : "(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
                        }
                        className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <AvatarFallback className="aspect-[4/3] w-full" />
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    {item.industry && (
                      <p>
                        <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-bold tracking-wide text-accent-ink">
                          {item.industry}
                        </span>
                      </p>
                    )}
                    {item.title && (
                      <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-ink">
                        {item.title}
                      </h3>
                    )}
                    {item.review && (
                      <p className="mt-3 line-clamp-4 text-sm leading-[1.9] text-ink-soft">
                        「{item.review}」
                      </p>
                    )}

                    <div className="mt-auto space-y-3 pt-5">
                      {clientLabel(item) && (
                        <p className="text-sm font-bold tracking-tight text-ink">
                          {clientLabel(item)}
                        </p>
                      )}
                      {showStack && <Stack tags={item.tags ?? []} />}
                      <span className="flex items-center justify-between border-t border-line pt-4 text-sm font-bold text-ink transition-colors duration-300 group-hover:text-accent-ink">
                        この事例を見る
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                          <ArrowIcon className="h-3.5 w-3.5" />
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {pageLink && (
        <SectionLink href="/case-study">お客様事例をすべて見る</SectionLink>
      )}
    </Section>
  );
}
