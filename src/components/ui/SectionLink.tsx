import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 右向き矢印（Lucide）。サイト内のリンク・ボタンで線の太さと大きさを
 * 揃えるため、ここで包んで共通に使う。
 */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <ArrowRight
      aria-hidden
      strokeWidth={2.2}
      className={cn("h-4 w-4 shrink-0", className)}
    />
  );
}

/**
 * 「詳しく見る」系の導線。文字の右に丸い矢印を置き、ホバーで面と矢印の色が
 * 入れ替わる。
 *
 * tone="light" は白地用、"stage" はステージの面（ネイビー / 淡い青）用。
 */
export function ArrowLink({
  href,
  children,
  tone = "light",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "stage";
  className?: string;
}) {
  const onStage = tone === "stage";
  return (
    <Link
      href={href}
      className={cn(
        "group/al inline-flex items-center gap-5 rounded-full border py-2 pl-7 pr-2 text-[0.95rem] font-bold tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        onStage
          ? "border-on-stage/25 text-on-stage hover:border-stage-cta hover:bg-stage-cta hover:text-on-stage-cta focus-visible:ring-stage-accent/60 focus-visible:ring-offset-stage"
          : "border-ink/15 bg-card text-ink hover:border-accent hover:bg-accent hover:text-white focus-visible:ring-accent/50",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-colors duration-300",
          onStage
            ? "bg-stage-cta text-on-stage-cta group-hover/al:bg-on-stage-cta group-hover/al:text-stage-cta"
            : "bg-accent text-white group-hover/al:bg-white group-hover/al:text-accent-ink",
        )}
      >
        {/* 矢印は右へ抜けて、左から戻ってくる。 */}
        <span className="relative flex h-4 w-4">
          <ArrowIcon className="absolute inset-0 transition-transform duration-300 ease-out group-hover/al:translate-x-6" />
          <ArrowIcon className="absolute inset-0 -translate-x-6 transition-transform duration-300 ease-out group-hover/al:translate-x-0" />
        </span>
      </span>
    </Link>
  );
}

/**
 * セクション末尾に置く、対応ページへの導線。
 *
 * トップページの各セクションは概要だけを見せ、全量はそれぞれのページに置く。
 * その橋渡しをするボタンで、サイト内で見た目を揃えるためここに集約している。
 */
export function SectionLink({
  href,
  children,
  tone = "light",
  align = "center",
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "stage";
  align?: "center" | "left";
}) {
  return (
    <div
      data-reveal
      className={cn(
        "mt-14 flex",
        align === "center" ? "justify-center" : "justify-start",
      )}
    >
      <ArrowLink href={href} tone={tone}>
        {children}
      </ArrowLink>
    </div>
  );
}
