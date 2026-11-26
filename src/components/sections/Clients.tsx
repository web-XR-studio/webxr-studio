import Link from "next/link";
import type { Portfolio } from "@/db/schema";
import { ArrowLink } from "@/components/ui/SectionLink";
import { MarqueePause } from "@/components/ui/MarqueePause";

type Client = { id: number; name: string; industry: string };

/** 事例に登録された会社を、重複を除いて登録順に並べる。 */
function clientsFrom(items: Portfolio[]): Client[] {
  const seen = new Set<string>();
  const out: Client[] = [];
  for (const item of items) {
    const name = item.companyName?.trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    out.push({ id: item.id, name, industry: item.industry?.trim() ?? "" });
  }
  return out;
}

/** 帯が画面幅より短いと流れの継ぎ目が見えるため、1周ぶんを最低この数にする。 */
const MIN_TILES = 10;

function Tile({ client, hidden = false }: { client: Client; hidden?: boolean }) {
  return (
    <Link
      href={`/case-study/${client.id}`}
      // 繰り返しの分はフォーカスを当てない（読み上げからも外している）。
      tabIndex={hidden ? -1 : undefined}
      className="group flex w-48 flex-col items-center gap-2.5 focus-visible:outline-none sm:w-52"
    >
      {/* 社名を文字のロゴとして見せる枠。 */}
      <span className="flex h-20 w-full items-center justify-center rounded-lg border border-line bg-card px-4 text-center shadow-[0_1px_0_rgb(13_16_23_/_0.02)] transition-[border-color,box-shadow,translate] duration-300 group-hover:-translate-y-0.5 group-hover:border-accent/40 group-hover:shadow-[0_10px_24px_-12px_rgb(0_82_204_/_0.35)] group-focus-visible:ring-2 group-focus-visible:ring-accent/50">
        <span className="line-clamp-2 text-[0.95rem] font-bold leading-snug tracking-[0.04em] text-ink">
          {client.name}
        </span>
      </span>
      {client.industry && (
        <span className="line-clamp-1 text-center text-xs text-muted">
          {client.industry}
        </span>
      )}
    </Link>
  );
}

/**
 * CLIENT — お取引先の帯。
 *
 * 事例に登録された会社名を、枠に入れて横に流す（乗せる・フォーカスする・
 * ボタンを押すと止まる）。社名は管理画面の事例から取るので、事例を足すと
 * 自動で増える。会社名の入った事例が1件も無ければ帯ごと出さない。
 *
 * 帯は同じ並びを2つ続けて半分の幅だけ動かし、継ぎ目なく回す。2つ目は
 * 読み上げとフォーカスの対象から外す。
 */
export function Clients({ items }: { items: Portfolio[] }) {
  const clients = clientsFrom(items);
  if (clients.length === 0) return null;

  // 1周ぶんを画面幅より長くするため、少ないときは同じ並びを繰り返す。
  const repeat = Math.max(1, Math.ceil(MIN_TILES / clients.length));
  const loop = Array.from({ length: repeat }, () => clients).flat();
  const duration = `${Math.max(36, loop.length * 5)}s`;

  return (
    <section
      aria-labelledby="clients-title"
      className="relative isolate overflow-hidden bg-background pb-6 pt-20 sm:pt-24"
    >
      <div className="px-5">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-6">
        <div>
          <p
            data-reveal="block"
            className="inline-block font-display text-[2rem] font-medium uppercase leading-none tracking-[0.08em] text-ink sm:text-[2.5rem]"
          >
            <span>CLIENT</span>
          </p>
          <h2
            id="clients-title"
            data-reveal
            className="mt-3 flex items-center gap-3 text-sm font-bold tracking-[0.14em] text-accent-ink"
          >
            <span aria-hidden className="h-px w-8 bg-current" />
            お取引先企業
          </h2>
        </div>
        <div data-reveal>
          <ArrowLink href="/case-study">お客様事例を見る</ArrowLink>
        </div>
        </div>
      </div>

      <MarqueePause>
        <div
          className="marquee mt-10"
          style={{ "--marquee-duration": duration } as React.CSSProperties}
        >
          {/* 継ぎ目なく回すため、列の間隔は gap ではなく各列の右の余白で
              取る（帯の半分 = 列1つ分 + 余白 になる）。 */}
          <div className="marquee-track py-2">
            <ul className="flex gap-4 pr-4" aria-label="お取引先企業の一覧">
              {/* 繰り返した分は読み上げない（同じ社名が何度も読まれるため）。 */}
              {loop.map((c, i) => (
                <li
                  key={`${c.id}-${i}`}
                  aria-hidden={i >= clients.length || undefined}
                >
                  <Tile client={c} hidden={i >= clients.length} />
                </li>
              ))}
            </ul>
            <ul aria-hidden className="marquee-copy flex gap-4 pr-4">
              {loop.map((c, i) => (
                <li key={`copy-${c.id}-${i}`}>
                  <Tile client={c} hidden />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </MarqueePause>
    </section>
  );
}
