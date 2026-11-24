"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/*
 * 配色テーマの切り替え。
 *
 * 状態の正本は <html data-theme>。React の state には持たず、属性の変化を
 * 購読して読むだけにしている。描画前にインラインスクリプトが属性を書き
 * 換えるので、サーバーの値（既定のダーク）と食い違っても、表示は常に
 * 実際のテーマに合う。アイコンの出し分けも CSS（`light:` バリアント）で
 * 行うため、読み込み直後から正しい絵柄が出る。
 */

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function subscribe(onChange: () => void) {
  // この画面での切り替え（属性の変化）と、別タブでの切り替え（storage）の両方。
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  const onStorage = (e: StorageEvent) => {
    if (e.key !== THEME_STORAGE_KEY) return;
    if (e.newValue === "light" || e.newValue === "dark") applyTheme(e.newValue);
  };
  window.addEventListener("storage", onStorage);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onStorage);
  };
}

/** 現在のテーマ。サーバーと初回の描画では既定値を返す。 */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);
}

/**
 * テーマを切り替えて保存する。`origin`（押したボタンの中心）があれば、新しい
 * テーマをそこから円形に広げる（View Transitions に対応したブラウザのみ）。
 * 「動きを減らす」設定では即座に切り替える。
 */
function switchTheme(next: Theme, origin?: { x: number; y: number }) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // 保存できなくても、この表示中の切り替えはそのまま行う。
  }

  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typeof document.startViewTransition !== "function" || reduce || !origin) {
    applyTheme(next);
    return;
  }

  root.classList.add("theme-switching");
  const transition = document.startViewTransition(() => applyTheme(next));
  transition.ready
    .then(() => {
      // 画面の最も遠い角まで届く半径。
      const radius = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y),
      );
      root.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
  transition.finished.finally(() => root.classList.remove("theme-switching"));
}

function centerOf(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/** 太陽と月を重ね、テーマに合わせて回しながら入れ替える。 */
function ThemeIcon({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative block h-5 w-5", className)}>
      {/* ダーク表示中は太陽（＝押すと明るくなる）、ライト表示中は月。
          Tailwind v4 の回転・拡大は rotate / scale プロパティなので、
          `transition`（両方を含む）で動かす。 */}
      <Sun
        strokeWidth={1.8}
        className="absolute inset-0 h-full w-full transition duration-500 ease-out light:rotate-90 light:scale-50 light:opacity-0"
      />
      <Moon
        strokeWidth={1.8}
        className="absolute inset-0 h-full w-full -rotate-90 scale-50 opacity-0 transition duration-500 ease-out light:rotate-0 light:scale-100 light:opacity-100"
      />
    </span>
  );
}

/** ヘッダーに置くアイコンのボタン。見た目（大きさ・色）は呼び出し側が決める。 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const next: Theme = theme === "dark" ? "light" : "dark";
  const label =
    next === "light" ? "ライトモードに切り替える" : "ダークモードに切り替える";

  return (
    <button
      type="button"
      onClick={(e) => switchTheme(next, centerOf(e.currentTarget))}
      aria-label={label}
      title={label}
      className={cn(
        "group/theme inline-flex items-center justify-center transition-colors duration-300",
        className,
      )}
    >
      <ThemeIcon className="transition-transform duration-500 group-hover/theme:rotate-12" />
    </button>
  );
}

/**
 * モバイルメニュー用。ライト / ダークを並べ、いまのテーマを押下状態で示す。
 */
export function ThemeSwitch({ className }: { className?: string }) {
  const theme = useTheme();
  const options = [
    { value: "light" as const, label: "ライト", Icon: Sun },
    { value: "dark" as const, label: "ダーク", Icon: Moon },
  ];

  return (
    <div
      role="group"
      aria-label="配色テーマ"
      className={cn(
        "inline-grid grid-cols-2 gap-1 rounded-full border border-on-stage/15 bg-on-stage/[0.06] p-1",
        className,
      )}
    >
      {options.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={(e) => {
              if (!active) switchTheme(value, centerOf(e.currentTarget));
            }}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage-accent/60",
              active
                ? "bg-stage-cta text-on-stage-cta shadow-sm"
                : "text-on-stage/70 hover:text-on-stage",
            )}
          >
            <Icon aria-hidden strokeWidth={1.8} className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
