"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

// Bilingual nav: an uppercase English label above its Japanese reading, the
// convention used across Japanese corporate sites. Each tab is a standalone
// route; the top page keeps the same content as a one-page summary.
// お問い合わせはタブではなく、右端の目立つボタンとして別に置く。
const NAV = [
  { href: "/about", en: "ABOUT US", label: "私たちについて" },
  { href: "/company", en: "COMPANY", label: "会社案内" },
  { href: "/service", en: "SERVICE", label: "サービス" },
  { href: "/case-study", en: "CASE STUDY", label: "お客様事例" },
  { href: "/faq", en: "FAQ", label: "よくある質問" },
];
const CONTACT = { href: "/contact", en: "CONTACT", label: "お問い合わせ" };

/** 現在のページ（またはその配下）にいるか。 */
function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Whether the header is currently over the hero's navy field. Tracked
  // separately from `scrolled` because the two switch at different points: the
  // bar shrinks after 80px, but its colours must not invert until the navy
  // actually ends — otherwise a white header sits on the navy for a screenful.
  const [onHero, setOnHero] = useState(true);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Hysteresis: shrink past 80px, only expand again below 40px. A single
    // threshold makes the header flip back and forth when the user hovers
    // right at the boundary or uses momentum scrolling.
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > 40 : y > 80));

      // Invert on the hero's real bottom edge, measured from the DOM so it
      // stays correct however the hero is sized.
      const hero = document.querySelector<HTMLElement>(".hero-bg");
      const headerH = y > 80 ? 64 : 96; // h-16 / h-24
      setOnHero(hero ? hero.getBoundingClientRect().bottom > headerH : false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // ページが変わるとヒーローの高さも変わるので測り直す。
  }, [pathname]);

  // Lock body scroll while the mobile menu is open, and let Escape close it —
  // the panel covers the whole viewport, so there is no obvious way out
  // otherwise for keyboard users. Focus moves into the panel on open and back
  // to the toggle on close.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    const toggle = toggleRef.current;
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      toggle?.focus();
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300",
        // Transparent over the navy hero so the field runs behind it, then
        // solid white once scrolled onto the page's white content. Nav colours
        // invert with it (see `onHero` below).
        onHero
          ? "border-white/15 bg-transparent"
          : "border-line bg-card/90 shadow-[0_6px_30px_rgb(13_16_23_/_0.06)] backdrop-blur-md",
      )}
    >
      <div
        className={cn(
          // `items-stretch` lets the nav tabs fill the full header height so
          // their hover underline sits on the header's bottom edge.
          "flex w-full items-stretch justify-between pl-6 lg:pl-10",
          "transition-[height] duration-300 ease-out",
          scrolled ? "h-16" : "h-24",
        )}
      >
        <Logo
          className={cn(
            "self-center transition-colors duration-300",
            onHero ? "text-white" : "text-ink",
          )}
          markClassName={scrolled ? "h-8 w-8" : "h-11 w-11"}
          nameClassName={scrolled ? "text-sm" : "text-lg"}
        />

        <div className="flex items-stretch">
          {/* Bilingual nav with hairline separators. */}
          <nav aria-label="メインメニュー" className="hidden items-stretch lg:flex">
            {NAV.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <Link
                  key={item.en}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "group relative flex flex-col items-center justify-center self-stretch border-l px-4 text-center xl:px-6",
                    onHero ? "border-white/15" : "border-line/80",
                  )}
                >
                  <span
                    className={cn(
                      "font-display font-bold tracking-[0.08em] transition-all duration-300",
                      onHero ? "text-white" : "text-ink",
                      scrolled ? "text-[0.8rem]" : "text-[0.9rem]",
                    )}
                  >
                    {item.en}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 transition-all duration-300",
                      onHero ? "text-white/75" : "text-muted",
                      scrolled ? "text-[0.68rem]" : "text-xs",
                    )}
                  >
                    {item.label}
                  </span>
                  {/* Underline wipe: grows from the left on hover, retracts to
                      the right on leave; stays drawn on the current page. */}
                  <span
                    aria-hidden
                    className={cn(
                      "nav-underline pointer-events-none absolute inset-x-0 bottom-0 h-[3px]",
                      onHero ? "bg-cyan" : "bg-accent",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* お問い合わせ。ヘッダーの高さいっぱいの青い面にして、どのページ
              からでも一目で見つかるようにする。 */}
          <Link
            href={CONTACT.href}
            aria-current={isCurrent(pathname, CONTACT.href) ? "page" : undefined}
            className="group relative hidden items-center gap-3 bg-accent px-7 text-white transition-colors duration-300 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white lg:flex xl:px-9"
          >
            {/* お問い合わせページにいる間は、下端に白い線を引いて示す。 */}
            <span
              aria-hidden
              className="nav-underline pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-white"
            />
            <MailIcon className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="flex flex-col items-start leading-tight">
              <span
                className={cn(
                  "font-display font-bold tracking-[0.08em] transition-all duration-300",
                  scrolled ? "text-[0.8rem]" : "text-[0.9rem]",
                )}
              >
                {CONTACT.en}
              </span>
              <span
                className={cn(
                  "mt-0.5 transition-all duration-300",
                  scrolled ? "text-[0.68rem]" : "text-xs",
                )}
              >
                {CONTACT.label}
              </span>
            </span>
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className={cn(
              "mr-3 inline-flex h-11 w-11 items-center justify-center self-center rounded-full lg:hidden",
              onHero ? "text-white" : "text-ink",
            )}
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {/* Three bars that stay in the DOM and transform into the X. */}
            <span aria-hidden className="relative block h-[18px] w-[24px]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    transform: open
                      ? i === 1
                        ? "translateY(-50%)"
                        : `translateY(-50%) rotate(${i === 0 ? 45 : -45}deg)`
                      : `translateY(calc(-50% + ${(i - 1) * 7}px))`,
                    width: i === 2 && !open ? "65%" : undefined,
                  }}
                  className={cn(
                    "absolute right-0 top-1/2 h-[2px] w-full rounded-full bg-current transition-[transform,opacity,width] duration-300 ease-out",
                    open && i === 1 && "opacity-0",
                  )}
                />
              ))}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu: a full-screen navy panel. Kept mounted so it can fade
          both ways; `invisible` and `pointer-events-none` take it out of the
          tab order and off the hit test while hidden. */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={cn(
          "navy-field fixed inset-0 z-50 overflow-y-auto overscroll-contain text-white transition-[opacity,visibility] duration-300 ease-out lg:hidden",
          open
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
      >
        <div aria-hidden className="bg-grid-dark pointer-events-none absolute inset-0" />
        <div className="relative flex items-center justify-between px-6 py-5">
          <Logo
            className="text-white"
            markClassName="h-9 w-9"
            nameClassName="text-base"
          />
          <button
            ref={closeRef}
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="メニューを閉じる"
            onClick={() => setOpen(false)}
          >
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav aria-label="メインメニュー" className="relative flex flex-col px-6 pb-10 pt-4">
          {[...NAV, CONTACT].map((item, i) => {
            const current = isCurrent(pathname, item.href);
            return (
            <Link
              key={item.en}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={current ? "page" : undefined}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              className={cn(
                "flex items-baseline gap-4 border-b border-white/10 py-5 transition-[opacity,transform] duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
            >
              <span className="font-display text-xs font-semibold text-cyan">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span
                  className={cn(
                    "font-display text-[1.75rem] font-extrabold uppercase leading-none tracking-tight",
                    current && "text-cyan",
                  )}
                >
                  {item.en}
                </span>
                <span className="text-sm text-white/70">{item.label}</span>
              </span>
            </Link>
            );
          })}
        </nav>

        <div className="relative px-6 pb-14">
          <Link
            href={CONTACT.href}
            onClick={() => setOpen(false)}
            className="flex h-14 items-center justify-center gap-3 rounded-full bg-accent text-base font-bold tracking-wide text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <MailIcon />
            無料で相談する
          </Link>
          <p className="mt-4 text-center text-xs text-white/60">
            ご相談・お見積もりは無料です
          </p>
        </div>
      </div>
    </header>
  );
}
