import { cn } from "@/lib/utils";
import {
  JAPAN_DOTS,
  JAPAN_NODES,
  JAPAN_SIZE,
  JAPAN_STEP,
  JAPAN_TWINKLE_A,
  JAPAN_TWINKLE_B,
} from "./japan-dots";

/**
 * ヒーローの日本地図。陸地をドットで描き、全国の拠点（元の地図で XR ロゴが
 * 載っていた位置）を光る点にして、隣り合う拠点を弧でつなぐ。弧の上を短い
 * 光が流れ、拠点からは波紋が広がる。
 *
 * すべて SVG と CSS のアニメーションで動かすため、クライアントの JS は不要。
 * 動きの定義は globals.css の "Japan network map" にある。
 */

const CYAN = "#38bdf8";

type Pt = readonly [number, number];

/**
 * 2点を結ぶ弧。中点から進行方向の右手（地図上では太平洋側）へ膨らませる。
 * `bulge` は2点間の距離に対する膨らみの比率。
 */
function arc(a: Pt, b: Pt, bulge: number) {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const cx = (x1 + x2) / 2 + (dy / len) * len * bulge;
  const cy = (y1 + y2) / 2 - (dx / len) * len * bulge;
  return `M${x1} ${y1}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2}`;
}

// 隣り合う拠点を北から順に結ぶ鎖と、海をまたぐ長い幹線を数本。
const n = JAPAN_NODES;
const LINKS: { d: string; long?: boolean }[] = [
  ...n.slice(1).map((p, i) => ({ d: arc(n[i], p, 0.16) })),
  ...(n.length >= 8
    ? [
        { d: arc(n[0], n[3], 0.28), long: true },
        { d: arc(n[2], n[6], 0.24), long: true },
        { d: arc(n[4], n[7], 0.2), long: true },
      ]
    : []),
];

/** 地図の重心あたり。周回する輪の中心にする。 */
const CENTER = { x: JAPAN_SIZE.width * 0.56, y: JAPAN_SIZE.height * 0.52 };

export function JapanNetwork({ className }: { className?: string }) {
  const dot = JAPAN_STEP * 0.46;

  return (
    <svg
      viewBox={`0 0 ${JAPAN_SIZE.width} ${JAPAN_SIZE.height}`}
      role="img"
      aria-label="日本地図。全国の拠点をつなぐWEB-XR.studioのネットワーク。"
      className={cn("block h-auto w-full overflow-visible", className)}
    >
      {/* 周回する輪。地図の外側をゆっくり回り、計器のような奥行きを出す。 */}
      <g className="map-orbit" fill="none">
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={360}
          stroke="rgb(255 255 255 / 0.08)"
          strokeWidth="1.2"
          strokeDasharray="2 12"
        />
        <path
          d={`M${CENTER.x - 360} ${CENTER.y}A360 360 0 0 1 ${CENTER.x - 254} ${CENTER.y - 254}`}
          stroke="rgb(56 189 248 / 0.5)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      <g className="map-orbit-rev" fill="none">
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={440}
          stroke="rgb(255 255 255 / 0.06)"
          strokeWidth="1"
        />
        <path
          d={`M${CENTER.x + 440} ${CENTER.y}A440 440 0 0 1 ${CENTER.x + 311} ${CENTER.y + 311}`}
          stroke="rgb(139 123 255 / 0.45)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx={CENTER.x + 440} cy={CENTER.y} r="5" fill={CYAN} />
      </g>

      {/* 陸地のドット。`M x y h0` の点を丸い線端で描く。 */}
      <g fill="none" strokeLinecap="round">
        <path d={JAPAN_DOTS} stroke="rgb(255 255 255 / 0.36)" strokeWidth={dot} />
        <path
          className="map-twinkle-a"
          d={JAPAN_TWINKLE_A}
          stroke={CYAN}
          strokeWidth={dot * 1.1}
        />
        <path
          className="map-twinkle-b"
          d={JAPAN_TWINKLE_B}
          stroke="#ffffff"
          strokeWidth={dot}
        />
      </g>

      {/* 拠点を結ぶ弧と、その上を流れる光。 */}
      <g fill="none" strokeLinecap="round">
        {LINKS.map((l, i) => (
          <path
            key={`l${i}`}
            d={l.d}
            stroke={l.long ? "rgb(139 123 255 / 0.32)" : "rgb(56 189 248 / 0.4)"}
            strokeWidth={l.long ? 1.4 : 1.8}
            strokeDasharray={l.long ? "3 7" : undefined}
          />
        ))}
        {LINKS.map((l, i) => (
          <path
            key={`f${i}`}
            className="map-flow"
            style={{ "--d": `${-i * 0.7}s` } as React.CSSProperties}
            d={l.d}
            stroke="#ffffff"
            strokeWidth={l.long ? 2.2 : 3}
          />
        ))}
      </g>

      {/* 拠点。波紋・にじみ・白い芯の三層。 */}
      {JAPAN_NODES.map(([x, y], i) => (
        <g key={`${x}-${y}`}>
          <circle
            className="map-pulse"
            style={{ "--d": `${i * 0.38}s` } as React.CSSProperties}
            cx={x}
            cy={y}
            r="12"
            fill="none"
            stroke={CYAN}
            strokeWidth="2"
          />
          <circle cx={x} cy={y} r="20" fill={CYAN} opacity="0.12" />
          <circle cx={x} cy={y} r="11" fill={CYAN} opacity="0.22" />
          <circle cx={x} cy={y} r="6.5" fill="#ffffff" />
          <circle cx={x} cy={y} r="3.2" fill={CYAN} />
        </g>
      ))}
    </svg>
  );
}
