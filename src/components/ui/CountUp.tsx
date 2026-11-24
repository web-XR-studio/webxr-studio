"use client";

import { useEffect, useRef } from "react";

/**
 * 画面に入ったときに 0 から数え上げる数字。
 *
 * サーバーでは最終値をそのまま出す（JS が無くても、検索エンジンにも正しい
 * 数字が見える）。数え上げの途中の値は読み上げさせず、最終値を sr-only で
 * 別に持つ。「動きを減らす」設定では数えずに最終値のまま。
 */
export function CountUp({
  value,
  duration = 1800,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          // easeOutQuart: 最初に勢いよく伸び、最後はゆっくり止まる。
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = String(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        el.textContent = "0";
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <>
      <span ref={ref} aria-hidden className={className}>
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
