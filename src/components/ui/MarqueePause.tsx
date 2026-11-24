"use client";

import { useState } from "react";

/**
 * 流れ続ける帯（marquee）に一時停止ボタンを添える。
 *
 * 自動で動き続ける表示には止める手段が要る（WCAG 2.2.2）。ホバーと
 * フォーカスでも止まるが、触れられない人のためにボタンも置く。中身は
 * サーバーで描いたものをそのまま受け取り、ここでは `data-paused` を
 * 切り替えるだけ（止め方は globals.css の "Marquee"）。
 *
 * 「動きを減らす」設定では帯そのものが止まった一覧になるので、ボタンも
 * 出さない。
 */
export function MarqueePause({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(false);

  return (
    <div data-paused={paused || undefined}>
      {children}
      <div className="mt-8 flex justify-center motion-reduce:hidden">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-xs font-semibold text-ink-soft transition-colors hover:border-accent/50 hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          <svg viewBox="0 0 16 16" aria-hidden className="h-3 w-3" fill="currentColor">
            {paused ? (
              <path d="M4 2.5v11l9-5.5-9-5.5z" />
            ) : (
              <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" />
            )}
          </svg>
          {paused ? "動きを再開する" : "動きを止める"}
        </button>
      </div>
    </div>
  );
}
