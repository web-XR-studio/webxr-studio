import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { revealDelay } from "@/lib/reveal";

/**
 * 見出しは「大きな英字 → 日本語の見出し → 説明」の二言語の組み。英字は
 * 細身の書体（Oswald）で大きく見せ、意味を担う日本語を h2 にする（読み上げ
 * や検索では日本語の見出しとして扱われる）。日本語は線を添えた小さな
 * 札にして、英字を引き立てる。
 *
 * 英字は画面に入ると色の帯が左から伸びて覆い、右へ抜けると現れる
 * （`data-reveal="block"`）。中央揃えのときは下に細い縦線を引く。
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
          data-reveal="block"
          className={cn(
            "inline-block max-w-full break-words font-display text-[2.6rem] font-medium uppercase leading-[1.08] tracking-[0.06em] sm:text-6xl lg:text-[4.5rem]",
            onStage ? "text-on-stage" : "text-ink",
          )}
        >
          <span>{eyebrow}</span>
        </p>
      )}
      {title && (
        <h2
          data-reveal
          style={revealDelay(1, 160)}
          className={cn(
            "flex items-center gap-3 text-sm font-bold tracking-[0.14em] sm:text-base",
            centered && "justify-center",
            eyebrow && "mt-4",
            onStage ? "text-stage-accent" : "text-accent-ink",
          )}
        >
          <span aria-hidden className="h-px w-8 shrink-0 bg-current" />
          {title}
        </h2>
      )}
      {centered && (eyebrow || title) && (
        <span
          aria-hidden
          data-reveal="line-v"
          style={revealDelay(2, 160)}
          className={cn(
            "mx-auto mt-7 block h-12 w-px",
            onStage ? "bg-on-stage/30" : "bg-ink/25",
          )}
        />
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
      {/* 淡い面のセクションには、斜めに切った明るい面と細い斜線を敷く。 */}
      {tone === "muted" && (
        <div
          aria-hidden
          className="section-slant pointer-events-none absolute inset-0 -z-10"
        />
      )}
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
