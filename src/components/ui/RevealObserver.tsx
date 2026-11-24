"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * スクロールに合わせて `[data-reveal]` を出現させる。サイト共通レイアウトに
 * 1つだけ置く。見た目の定義は globals.css の "Scroll reveal" にある。
 *
 * - JS が動かない環境では何も隠さない。隠すのは <html> に `reveal-ready` が
 *   付いてからで、それを付けるのはこのコンポーネントだけ。
 * - 起動した時点ですでに画面内にある要素は、先に表示済みにしてから隠す
 *   準備に入る。こうしないと、最初に見えていた内容が水和の瞬間に一度消えて
 *   から現れ直す。
 * - ページ遷移やストリーミングで後から入ってきた要素も拾えるよう、DOM の
 *   追加を見張る。
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reveal = (el: Element) => el.classList.add("is-revealed");
    const pending = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          "[data-reveal]:not(.is-revealed)",
        ),
      );

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || !("IntersectionObserver" in window)) {
      pending().forEach(reveal);
      return;
    }

    if (!root.classList.contains("reveal-ready")) {
      const vh = window.innerHeight;
      for (const el of pending()) {
        const r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) reveal(el);
      }
      root.classList.add("reveal-ready");
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          reveal(e.target);
          io.unobserve(e.target);
        }
      },
      // 画面の下端より少し手前で発火させ、要素が見え始めてから動き出す。
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    const watch = () => pending().forEach((el) => io.observe(el));
    watch();

    // 後から差し込まれた要素。observe は同じ要素に重ねて呼んでも1回分。
    const mo = new MutationObserver((records) => {
      if (records.some((r) => r.addedNodes.length > 0)) watch();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}

