"use client";

import Image from "next/image";
import Link from "next/link";
import { CardCarousel } from "@/components/ui/CardCarousel";
import type { Portfolio } from "@/db/schema";

/**
 * お客様事例を1枚ずつ見せるカルーセル。トップページ専用。
 *
 * 件数が増えても縦に伸びないよう、全件をここで送る。広い画面では左に
 * お客様のお写真、右に業界・案件名・お客様の声を置く。技術スタックは
 * 載せない（全量は /case-study）。
 *
 * お写真は縦横比が事例ごとに違うため切り抜かない（object-contain）。
 * 余白には同じ写真をぼかして敷き、白い帯が出ないようにしている。
 * 同じ URL・同じ sizes なので、背景用に追加の通信は発生しない。
 *
 * 1枚に読ませる文量（案件名＋お客様の声）があるので、送りは 6.5 秒。
 */
const AUTOPLAY_MS = 6_500;

/** 企業名と個人名を組み立てる。企業名が空なら個人名のみ。 */
function clientLabel(item: Portfolio): string {
  const company = item.companyName?.trim() ?? "";
  const person = item.clientName?.trim() ?? "";
  if (company && person) return `${company}　${person}`;
  return company || person;
}

function Photo({ src }: { src: string }) {
  return (
    <div className="relative h-64 overflow-hidden bg-surface-2 sm:h-80 md:h-full md:min-h-[26rem]">
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes="(min-width: 768px) 28rem, 100vw"
        className="scale-125 object-cover opacity-60 blur-2xl"
      />
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes="(min-width: 768px) 28rem, 100vw"
        className="object-contain"
      />
    </div>
  );
}

export function CaseStudyCarousel({ items }: { items: Portfolio[] }) {
  return (
    <CardCarousel
      items={items}
      label="お客様の事例"
      autoplayMs={AUTOPLAY_MS}
      maxWidthClass="max-w-4xl"
      getKey={(item) => String(item.id)}
      getLabel={(item) => clientLabel(item) || item.title || `事例 ${item.id}`}
      renderCard={(item, isCenter) => {
        const src = item.imageUrl || item.thumbnailUrl || item.workImageUrl;

        // 左右の退色カードは写真だけ。読ませる対象ではないため。
        if (!isCenter) {
          return src ? (
            <Photo src={src} />
          ) : (
            <div className="h-full bg-surface" />
          );
        }

        return (
          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            {src ? (
              <Photo src={src} />
            ) : (
              <div
                aria-hidden
                className="flex h-64 items-center justify-center bg-surface text-sm text-muted md:h-full"
              >
                No Image
              </div>
            )}

            <div className="flex flex-col p-7 sm:p-10">
              {item.industry && (
                <p>
                  <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-bold tracking-wide text-accent-ink">
                    {item.industry}
                  </span>
                </p>
              )}
              {item.title && (
                <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight text-ink sm:text-xl">
                  {item.title}
                </h3>
              )}

              {item.review && (
                <blockquote className="relative mt-6 border-l-2 border-accent/30 pl-5">
                  <p className="line-clamp-6 text-[0.95rem] leading-[2] text-ink-soft">
                    {item.review}
                  </p>
                </blockquote>
              )}

              {clientLabel(item) && (
                <p className="mt-6 text-sm font-bold text-ink">
                  {clientLabel(item)}
                </p>
              )}

              <div className="mt-auto pt-8">
                <Link
                  href={`/case-study/${item.id}`}
                  className="group/btn inline-flex items-center gap-4 rounded-full border border-ink/15 py-2 pl-6 pr-2 text-sm font-bold tracking-wide text-ink transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40"
                >
                  この事例を見る
                  <span
                    aria-hidden
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition-colors duration-300 group-hover/btn:bg-white group-hover/btn:text-accent-ink"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 10h11M11 5l5 5-5 5" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
