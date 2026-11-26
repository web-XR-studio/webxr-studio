import type Lenis from "lenis";

/**
 * サイト全体の慣性スクロール（Lenis）の実体を共有する置き場。
 *
 * 生成と破棄は `SmoothScroll` が担い、ほかの部品（ページ先頭へ戻るボタン
 * など）はここから取り出して使う。「動きを減らす」設定のときや起動前は
 * null のままなので、呼び出し側は必ずブラウザ標準の動きに戻せるようにする。
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

/** ページ先頭へ戻る。Lenis が動いていればその動きで、なければ標準の動きで。 */
export function scrollToTop(smooth: boolean) {
  if (instance && smooth) {
    instance.scrollTo(0, { duration: 1.2 });
    return;
  }
  window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
}
