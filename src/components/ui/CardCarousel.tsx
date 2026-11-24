"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 中央の1枚を強調し、左右を退色させて覗かせるカルーセル。
 *
 * カードの中身は `renderCard` に任せ、ここでは送りの仕組みだけを持つ。
 *
 * 一定間隔で自動で送るが、読んでいる最中に切り替わらないよう、ポインタが
 * 乗っている間とフォーカスがある間は止まる。止めるボタンも置く（自動で
 * 動き続ける表示には、止める手段が要る — WCAG 2.2.2）。現在のドットは
 * 次に送られるまでの残り時間を表す進捗バーになっている。
 */

/** 中央カードに対する左右カードの縮小率と不透明度。 */
const SIDE_SCALE = 0.88;
const SIDE_OPACITY = 0.35;

/** 自動送りの間隔の既定値。 */
const AUTOPLAY_MS = 8_000;

export function CardCarousel<T>({
  items,
  /** カードの中身。中央かどうかで出し分けたいことがあるので渡す。 */
  renderCard,
  /** React の key と、ドットの読み上げに使う。 */
  getKey,
  getLabel,
  /** スクリーンリーダー向けのカルーセル名。例:「お客様の事例」 */
  label,
  /** 自動送りの間隔(ms)。 */
  autoplayMs = AUTOPLAY_MS,
  /**
   * 中央カードの最大幅を決める Tailwind クラス。カードの中身が軽いものは
   * 既定より狭めて、画面を占めすぎないようにできる。
   */
  maxWidthClass = "max-w-3xl",
}: {
  items: T[];
  renderCard: (item: T, isCenter: boolean) => React.ReactNode;
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  label: string;
  autoplayMs?: number;
  maxWidthClass?: string;
}) {
  const [index, setIndex] = useState(0);
  // ポインタが乗っている / フォーカスがある間は自動送りを止める。
  const [hovering, setHovering] = useState(false);
  // 利用者がボタンで止めた状態。こちらは明示的に再開されるまで続く。
  const [stopped, setStopped] = useState(false);
  const [reduced, setReduced] = useState(false);
  const total = items.length;
  const paused = hovering || stopped;

  // 手動で送ったら、その時点から次の間隔を数え直す。この値が変わるたびに
  // 下の useEffect がタイマーを張り直し、進捗バーも最初から描き直す。
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + total) % total);
      setTick((t) => t + 1);
    },
    [total],
  );

  const jumpTo = useCallback((i: number) => {
    setIndex(i);
    setTick((t) => t + 1);
  }, []);

  // 一時停止から戻ったら、残り時間からではなく最初から数え直す。進捗バーも
  // 描き直すので、バーと実際の送りの時期がずれない。
  const wasPaused = useRef(paused);
  useEffect(() => {
    if (wasPaused.current && !paused) setTick((t) => t + 1);
    wasPaused.current = paused;
  }, [paused]);

  useEffect(() => {
    // 1枚しかないなら送る意味がない。「動きを減らす」設定でも自動では送らない。
    if (paused || reduced || total <= 1) return;
    // 1回ずつ張り直す setTimeout にして、tick（手動送り・再開）のたびに
    // 間隔を数え直せるようにしている。
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % total);
      setTick((t) => t + 1);
    }, autoplayMs);
    return () => clearTimeout(id);
  }, [paused, reduced, total, tick, autoplayMs]);

  // 左右キーでも送れるようにする。カルーセルにフォーカスがあるときだけ拾う。
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  // スワイプ。横移動が縦より大きいときだけカルーセル操作とみなす。
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  if (total === 0) return null;

  // items が減ったとき index が範囲外に残ることがあるので、参照前に丸める。
  const safeIndex = Math.min(index, total - 1);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className="relative"
      role="group"
      aria-roledescription="カルーセル"
      aria-label={label}
      tabIndex={0}
      data-paused={paused || undefined}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      // 読んでいる間は自動送りを止める。onFocus/onBlur は子孫のフォーカスも
      // 拾うので、ボタンやドットを操作している間も止まる。
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      {/* 中央カードだけをフローに置いて高さの基準にし、左右のカードは絶対配置で
          その背後に覗かせる。はみ出しは overflow-hidden で切る。 */}
      <div className="overflow-hidden px-0 py-6 lg:px-48">
        <div
          className={cn(
            "relative mx-auto flex items-stretch justify-center",
            maxWidthClass,
          )}
        >
          {items.map((item, i) => {
            // 中央からの距離。-1 が左隣、1 が右隣。端はループさせる。
            let offset = i - safeIndex;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isCenter = offset === 0;
            const isSide = Math.abs(offset) === 1;
            // 2枚以上離れたカードは描画しない（DOM を軽く保つ）。
            if (!isCenter && !isSide) return null;

            return (
              <article
                key={getKey(item)}
                aria-hidden={!isCenter}
                // 左右カードは操作対象から外す。中央だけを読ませたいため。
                inert={!isCenter}
                style={
                  isCenter
                    ? undefined
                    : {
                        // 中央カードの外側へ、自身の幅の8割ぶん押し出す。
                        transform: `translateX(${offset > 0 ? "80%" : "-80%"}) scale(${SIDE_SCALE})`,
                        opacity: SIDE_OPACITY,
                      }
                }
                className={cn(
                  "overflow-hidden rounded-3xl border bg-card text-left transition-[transform,opacity] duration-500 ease-out",
                  isCenter
                    ? "relative z-10 w-full border-line shadow-[0_30px_80px_rgb(0_45_120_/_0.14)]"
                    : cn(
                        // 中央カードの端に重ねて置き、外へずらして覗かせる。
                        "pointer-events-none absolute bottom-10 top-10 hidden w-72 border-line/60 lg:block",
                        offset > 0 ? "right-0" : "left-0",
                      ),
                )}
              >
                {renderCard(item, isCenter)}
              </article>
            );
          })}
        </div>
      </div>

      {/* 操作列: 位置（01 / 07）・進捗つきのドット・前後と一時停止。 */}
      <div
        className={cn(
          "mx-auto mt-6 flex items-center justify-between gap-6",
          maxWidthClass,
        )}
      >
        <p
          aria-hidden
          className="w-20 font-display text-sm font-bold tabular-nums tracking-[0.12em] text-ink"
        >
          {pad(safeIndex + 1)}
          <span className="mx-1.5 text-muted">/</span>
          <span className="text-muted">{pad(total)}</span>
        </p>

        {/* 現在位置。点は押して直接移動もできる。 */}
        <ul className="hidden flex-1 items-center justify-center gap-2 sm:flex">
          {items.map((item, i) => {
            const active = i === safeIndex;
            return (
              <li key={getKey(item)}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-label={`${getLabel(item)}を表示`}
                  aria-current={active}
                  className={cn(
                    "relative block h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2",
                    active ? "w-12 bg-line" : "w-6 bg-line hover:bg-muted/50",
                  )}
                >
                  {active && (
                    <span
                      // 送るたびに描き直す。
                      key={`${safeIndex}-${tick}`}
                      aria-hidden
                      className="carousel-progress absolute inset-0 rounded-full bg-accent"
                      style={
                        { "--autoplay": `${autoplayMs}ms` } as React.CSSProperties
                      }
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {!reduced && total > 1 && (
            <button
              type="button"
              onClick={() => setStopped((s) => !s)}
              aria-label={stopped ? "自動送りを再開" : "自動送りを停止"}
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              {stopped ? (
                <Play aria-hidden fill="currentColor" className="h-3.5 w-3.5" />
              ) : (
                <Pause aria-hidden fill="currentColor" className="h-3.5 w-3.5" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="前へ"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-card text-ink transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="次へ"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-card text-ink transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
          >
            <Chevron dir="right" />
          </button>
        </div>
      </div>

      {/* 読み上げ用。自動送りのたびに喋ると邪魔になるため、操作中（＝自動送りを
          止めている間）だけ通知する。 */}
      <p aria-live={paused ? "polite" : "off"} className="sr-only">
        {`${safeIndex + 1} / ${total}　${getLabel(items[safeIndex])}`}
      </p>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return <Icon aria-hidden strokeWidth={2} className="h-5 w-5" />;
}
