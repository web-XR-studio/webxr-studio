import { Plus } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import type { Faq as FaqItem } from "@/db/schema";
import { SectionLink } from "@/components/ui/SectionLink";
import { revealDelay } from "@/lib/reveal";
import { cn } from "@/lib/utils";

/**
 * よくある質問。<details> の開閉をそのまま使うので JS は要らない。
 * 開閉の高さの動きは globals.css の "FAQ accordion"（対応ブラウザのみ）。
 */
export function Faq({
  faqs,
  /** /faq では PageHero が同じ見出しを出すため抑制する。 */
  showHeader = true,
  /** 背景。トップページでは前後のセクションと交互になるよう設定する。 */
  tone = "muted",
}: {
  faqs: FaqItem[];
  showHeader?: boolean;
  tone?: "default" | "muted";
}) {
  if (faqs.length === 0) return null;

  const list = (
      <div className={cn("space-y-4", !showHeader && "mx-auto max-w-4xl")}>
        {faqs.map((f, i) => (
          <div key={f.id} data-reveal style={revealDelay(i % 6, 80)}>
            <details className="faq-item group rounded-2xl border border-line bg-card transition-[border-color,box-shadow] duration-300 open:border-accent/40 open:shadow-[0_18px_50px_rgb(0_45_120_/_0.1)] hover:border-accent/30">
              <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50 sm:gap-5 sm:px-8 sm:py-6 [&::-webkit-details-marker]:hidden">
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-display text-base font-bold text-white"
                >
                  Q
                </span>
                <span className="flex-1 text-base font-bold leading-relaxed text-ink sm:text-lg">
                  {f.question}
                </span>
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-[background-color,border-color,color,rotate] duration-300 group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-white"
                >
                  <Plus strokeWidth={2} className="h-4 w-4" />
                </span>
              </summary>
              <div className="flex gap-4 px-5 pb-6 sm:gap-5 sm:px-8 sm:pb-8">
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface font-display text-base font-bold text-accent-ink"
                >
                  A
                </span>
                <p className="flex-1 border-t border-line pt-5 text-base leading-[2] text-ink-soft sm:text-[1.05rem]">
                  {f.answer}
                </p>
              </div>
            </details>
          </div>
        ))}
      </div>
  );

  return (
    <Section id="faq" tone={tone}>
      {showHeader ? (
        // トップページ: 左に見出しと一覧への導線（スクロールしても残す）、
        // 右に質問。
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="FAQ"
              title="よくある質問"
              description="お問い合わせの前に、よくいただくご質問をまとめました。"
            />
            <div className="hidden lg:block">
              <SectionLink href="/faq" align="left">
                よくある質問をすべて見る
              </SectionLink>
            </div>
          </div>
          <div>
            {list}
            <div className="lg:hidden">
              <SectionLink href="/faq">よくある質問をすべて見る</SectionLink>
            </div>
          </div>
        </div>
      ) : (
        // /faq: 見出しは PageHero が担うので、質問だけを中央に。
        list
      )}
    </Section>
  );
}
