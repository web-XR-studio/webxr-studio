import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { clientLabel, Stack } from "@/components/sections/CaseStudies";
import { WorkGallery } from "@/components/sections/WorkGallery";
import { getPortfolioItem } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getPortfolioItem(Number(id));
  if (!item) return { title: "お客様事例" };
  return {
    title: item.title,
    description: item.description || item.review || undefined,
  };
}

/** 各ブロックの小見出し。点とアクセント色の大文字ラベル。 */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-ink">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </p>
  );
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  // 数値でない ID（/case-study/abc など）もここで 404 にする。
  if (!Number.isInteger(numId)) notFound();

  const item = await getPortfolioItem(numId);
  if (!item) notFound();

  const client = clientLabel(item);

  return (
    <>
      {/* 第1セクションは一覧ページと同じ、事例に依らない紹介文。案件名や業界など
          事例ごとの情報はすべて下の第2セクションに置く（パンくずの末尾だけは
          どの事例にいるかを示すため案件名にする）。 */}
      <PageHero
        en="CASE STUDY"
        title="お客様事例"
        description="課題の整理からデザイン、開発、その後の運用まで。お客様と伴走して形にしたプロジェクトと、いただいた声をご紹介します。"
        image="/about/fv-faq.webp"
        trail={[{ label: "お客様事例", href: "/case-study" }]}
        current={item.title}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-14 text-left">
          {/* 案件名と業界。掲載が実績の一部である旨は、一覧と同じくここでも
              伝える。 */}
          <div data-reveal>
            <p className="text-sm leading-relaxed text-muted">
              こちらでご紹介しているのは、2026年に当社が制作した実績の一部です。
            </p>
            {item.industry && (
              <p className="mt-8">
                <span className="inline-block rounded-full bg-accent/10 px-3.5 py-1 text-xs font-bold tracking-wide text-accent-ink">
                  {item.industry}
                </span>
              </p>
            )}
            <h2 className="mt-4 text-2xl font-black leading-snug tracking-tight text-ink sm:text-3xl xl:text-4xl">
              {item.title}
            </h2>
          </div>

          {/* お客様のお写真を最上部に。制作物より先に人が見えるようにする。
              写真は事例ごとに縦横比が違うため切り抜かず、余白には同じ写真を
              ぼかして敷く（同じ URL・同じ sizes なので追加の通信はない）。 */}
          {(item.imageUrl || client || item.review) && (
            <div
              data-reveal
              className="overflow-hidden rounded-3xl border border-line bg-card shadow-[0_24px_60px_rgb(0_45_120_/_0.08)]"
            >
              {item.imageUrl && (
                <div className="relative flex justify-center overflow-hidden bg-surface-2 p-5 sm:p-8">
                  <Image
                    src={item.imageUrl}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 768px) 34rem, 90vw"
                    className="scale-125 object-cover opacity-50 blur-2xl"
                  />
                  <Image
                    src={item.imageUrl}
                    alt={client || "お客様"}
                    width={900}
                    height={1207}
                    sizes="(min-width: 768px) 34rem, 90vw"
                    // バナーのすぐ下に来る、LCP になりやすい画像。遅延させない。
                    loading="eager"
                    // 高さは比率に追従させ、余白を出さない。
                    className="relative h-auto w-full max-w-[22rem] rounded-2xl shadow-[0_20px_50px_rgb(13_16_23_/_0.18)] sm:max-w-[28rem] md:max-w-[34rem]"
                  />
                </div>
              )}

              {(client || item.review) && (
                <div className="p-7 sm:p-10">
                  {client && (
                    <>
                      <Label>お客様</Label>
                      <p className="mt-3 text-lg font-bold tracking-tight text-ink sm:text-xl">
                        {client}
                      </p>
                      {item.industry && (
                        <p className="mt-1 text-sm text-muted">
                          {item.industry}
                        </p>
                      )}
                    </>
                  )}

                  {/* お客様の声はお名前のすぐ下に。誰の言葉かが分かるようにする。 */}
                  {item.review && (
                    <figure
                      className={client ? "mt-8 border-t border-line pt-8" : ""}
                    >
                      <Label>お客様の声</Label>
                      <blockquote className="relative mt-5 pl-10 sm:pl-12">
                        <span
                          aria-hidden
                          className="absolute left-0 top-[-0.35em] font-display text-6xl font-extrabold leading-none text-accent/25"
                        >
                          &ldquo;
                        </span>
                        <p className="whitespace-pre-line text-base leading-[2.05] text-ink-soft sm:text-lg">
                          {item.review}
                        </p>
                      </blockquote>
                    </figure>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 制作物。ギャラリーがあれば切り替え表示、無ければ単一画像。 */}
          {(item.gallery ?? []).length > 0 ? (
            <div data-reveal>
              <WorkGallery items={item.gallery} />
            </div>
          ) : (
            item.workImageUrl && (
              <div data-reveal>
                <Label>制作物</Label>
                <Image
                  src={item.workImageUrl}
                  alt=""
                  aria-hidden
                  width={1000}
                  height={7182}
                  sizes="(min-width: 768px) 48rem, 100vw"
                  className="mt-4 h-auto w-full rounded-2xl border border-line"
                />
              </div>
            )
          )}

          {/* 公開中のサイト。URL をそのまま出し、新しいタブで開く。 */}
          {item.link && (
            <div data-reveal>
              <Label>URL</Label>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block break-all text-base font-semibold text-accent-ink underline-offset-4 hover:underline sm:text-lg"
              >
                {item.link}
              </a>
            </div>
          )}

          {item.description && (
            <div data-reveal>
              <Label>プロジェクト概要</Label>
              <p className="mt-4 whitespace-pre-line text-base leading-[2.05] text-ink-soft sm:text-lg">
                {item.description}
              </p>
            </div>
          )}

          {(item.tags ?? []).length > 0 && (
            <div data-reveal>
              <Label>技術スタック</Label>
              <div className="mt-4">
                <Stack tags={item.tags ?? []} />
              </div>
            </div>
          )}

          <div className="border-t border-line pt-10">
            <Link
              href="/case-study"
              className="group inline-flex items-center gap-4 rounded-full border border-ink/15 py-2 pl-2 pr-7 text-sm font-bold tracking-wide text-ink transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-colors duration-300 group-hover:bg-white group-hover:text-accent-ink"
              >
                <ArrowLeft
                  strokeWidth={2.4}
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                />
              </span>
              お客様事例の一覧へ
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
