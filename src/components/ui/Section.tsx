import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { revealDelay } from "@/lib/reveal";

/**
 * 見出しは「大きな英字 → 日本語の見出し → 説明」の二言語の組み。英字は
 * 装飾として大きく見せ、意味を担う日本語を h2 にする（読み上げや検索では
 * 日本語の見出しとして扱われる）。
 *
 * `Section` の中で使うほか、見出しを左の列に置く2段組のセクション（FAQ・
 * 会社案内）が単体で使う。
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  onStage = false,
  className,
}: {
  /** 大きく見せる英字。例: "SERVICE" */
  eyebrow?: string;
  /** 日本語の見出し（h2）。 */
  title?: string;
  description?: string;
  align?: "left" | "center";
  /** ステージの面（ネイビー / 淡い青）の上に置くとき。 */
  onStage?: boolean;
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={cn(centered && "text-center", className)}>
      {eyebrow && (
        <p
          data-reveal="mask"
          className={cn(
            "inline-block break-words pb-1 font-display text-[2.5rem] font-extrabold uppercase leading-[1.02] tracking-[-0.01em] sm:text-6xl lg:text-7xl",
            onStage ? "text-gradient-stage" : "text-gradient",
          )}
        >
          {eyebrow}
        </p>
      )}
      {title && (
        <h2
          data-reveal
          style={revealDelay(1, 120)}
          className={cn(
            "flex items-center gap-3 text-lg font-bold tracking-wide sm:text-xl",
            centered && "justify-center",
            eyebrow && "mt-4",
            onStage ? "text-on-stage" : "text-ink",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "h-[3px] w-7 shrink-0 rounded-full",
              onStage ? "bg-stage-accent" : "bg-accent",
            )}
          />
          {title}
        </h2>
      )}
      {description && (
        <p
          data-reveal
          style={revealDelay(2, 120)}
          className={cn(
            "jp-phrase text-base leading-[1.95] sm:text-lg",
            (eyebrow || title) && "mt-6",
            centered && "mx-auto max-w-2xl",
            onStage ? "text-on-stage/75" : "text-ink-soft",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * A full-width page section with a constrained inner container.
 *
 * tone
 * - "default": 白
 * - "muted":   淡い青グレー。白のセクションと交互に置いて区切りを作る
 * - "stage":   ステージの面（ダークはネイビー、ライトは淡い青）。強み・
 *              企業理念など、ページの山場に使う
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  tone = "default",
  align = "left",
  backdrop,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted" | "stage";
  /** Header alignment. "center" also centers the header block itself. */
  align?: "left" | "center";
  /** セクションの背面に敷く装飾（光のにじみ・格子など）。 */
  backdrop?: ReactNode;
}) {
  const stage = tone === "stage";
  const hasHeader = Boolean(eyebrow || title || description);

  return (
    <section
      id={id}
      className={cn(
        // scroll-mt clears the fixed header when an anchor link lands here.
        "relative isolate scroll-mt-20 px-5 py-24 sm:py-32",
        tone === "muted" && "bg-surface",
        stage && "overflow-hidden bg-stage text-on-stage",
        className,
      )}
    >
      {backdrop && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          {backdrop}
        </div>
      )}
      <div className="mx-auto w-full max-w-6xl">
        {hasHeader && (
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            align={align}
            onStage={stage}
            className={cn(
              "mb-14 sm:mb-16",
              align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl",
            )}
          />
        )}
        {children}
      </div>
    </section>
  );
}
