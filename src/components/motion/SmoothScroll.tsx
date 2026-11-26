"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * スクロールの演出。サイト共通レイアウトに1つだけ置き、描画はしない。
 *
 * 1. 慣性スクロール（Lenis）。ホイールの動きをなめらかにつなぐ。タッチ操作は
 *    端末の標準の慣性のまま（Lenis の既定）。
 * 2. 視差（GSAP ScrollTrigger）。`data-parallax="8"` の要素を、親の枠が画面を
 *    通り過ぎる間に上下 8% ずつ動かす。枠は `overflow-hidden` にし、要素は
 *    動くぶんだけ枠より大きくしておく（例: `-inset-y-[10%]`）。
 *
 * 「動きを減らす」設定ではどちらも起動しない。スクロールは標準のまま、
 * 視差の要素は初期位置（ずれ無し）で止まる。
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion()) return;

    const lenis = new Lenis({
      // 指を離したあとの減速。長すぎると操作に遅れて見える。
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // メニューやダイアログの中など、それ自体がスクロールする領域は
      // 標準のスクロールに任せる。
      allowNestedScroll: true,
      // ページ内リンク（#…）も同じ動きで送る。固定ヘッダーのぶん手前で止める。
      anchors: { offset: -88 },
      // リンクで別ページへ移ったら、前のページの惰性を持ち越さない。
      stopInertiaOnNavigate: true,
    });
    setLenis(lenis);

    // 視差の位置を Lenis の動きと同じフレームで更新する。
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // メニューやダイアログはページのスクロールを止めるとき <body> に
    // overflow:hidden を付ける。その間はホイールで背後のページが動かない
    // よう Lenis も止める。
    const sync = () => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      mo.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion()) return;

    const ctx = gsap.context(() => {
      for (const el of document.querySelectorAll<HTMLElement>(
        "[data-parallax]",
      )) {
        const amount = Number(el.dataset.parallax) || 8;
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              // clamp: ページ先頭で最初から見えている写真（下層ページの
              // 帯など）は、読み込んだ瞬間にずれて跳ねないよう 0 から始める。
              start: "clamp(top bottom)",
              end: "clamp(bottom top)",
              scrub: true,
            },
          },
        );
      }
    });

    // 画像や Web フォントの読み込みでページの高さが変わるので、少し待って
    // から位置を測り直す。
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
