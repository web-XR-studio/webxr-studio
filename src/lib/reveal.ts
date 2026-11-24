import type { CSSProperties } from "react";

/**
 * 段差をつけて順に出すための遅延。`data-reveal` の要素に
 * `style={revealDelay(i)}` で渡す（globals.css の `--reveal-delay` を使う）。
 *
 * サーバーコンポーネントからも呼ぶため、"use client" のファイルには置かない。
 */
export function revealDelay(index: number, stepMs = 90): CSSProperties {
  return { "--reveal-delay": `${index * stepMs}ms` } as CSSProperties;
}
