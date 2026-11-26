/**
 * 配色テーマ（ダーク / ライト）の共通定義。
 *
 * テーマは <html data-theme> の値そのもの。ライト（白を基調にした明るい
 * 見た目）が既定で、訪問者が切り替えたときだけ localStorage に残す。
 * 以前に選んだテーマが保存されている訪問者には、そちらを使い続ける。
 * 描画前の反映はルートレイアウトのインラインスクリプト、切り替えは
 * ThemeToggle が担う。
 */
export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "light";
export const THEME_STORAGE_KEY = "theme";

/**
 * <head> で同期的に実行し、保存済みのテーマを描画前に <html> へ反映する。
 * localStorage が使えない環境（プライベートモードの一部など）では既定のまま。
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
