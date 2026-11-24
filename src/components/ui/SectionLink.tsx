import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 右向き矢印。サイト内のリンク・ボタンで共通に使う。 */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className={cn("h-4 w-4 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  );
}

/**
 * 「詳しく見る」系の導線。文字の右に丸い矢印を置き、ホバーで面と矢印の色が
 * 入れ替わる。
 *
 * tone="light" は白地用、"dark" はネイビー地用。
 */
export function ArrowLink({
  href,
  children,
  tone = "light",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <Link
      href={href}
      className={cn(
        "group/al inline-flex items-center gap-5 rounded-full border py-2 pl-7 pr-2 text-[0.95rem] font-bold tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        dark
          ? "border-white/25 text-white hover:border-white hover:bg-white hover:text-navy-900 focus-visible:ring-white/60 focus-visible:ring-offset-navy-900"
          : "border-ink/15 bg-card text-ink hover:border-accent hover:bg-accent hover:text-white focus-visible:ring-accent/50",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-colors duration-300",
          dark
            ? "bg-white text-navy-900 group-hover/al:bg-navy-900 group-hover/al:text-white"
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
  tone?: "light" | "dark";
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
