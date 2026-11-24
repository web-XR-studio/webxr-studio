import { cn } from "@/lib/utils";

/**
 * 4つの専門領域（Web / System / App / AI）を表す線画。
 *
 * ネイビーの面の上に置く前提で、白の線と、要所だけシアンの光で描く。
 * サービスのタイル・チームカード・/service の見出し帯で共通に使う。
 * 装飾なので読み上げ対象から外している（隣の見出しが意味を担う）。
 *
 * id 付きの <defs> を使わないのは、同じページに同じ絵が複数並んだとき
 * id が重複するのを避けるため。光はうすい円を重ねて表現している。
 */
export type DomainKind = "web" | "system" | "app" | "ai";

const W = "rgb(255 255 255 / 0.62)";
const W_SOFT = "rgb(255 255 255 / 0.3)";
const W_FAINT = "rgb(255 255 255 / 0.07)";
const CYAN = "#38bdf8";
const BLUE = "#3b82f6";

/** 焦点の後ろに敷くにじみ。 */
function Glow({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={CYAN} opacity={0.05} />
      <circle cx={cx} cy={cy} r={r * 0.66} fill={CYAN} opacity={0.06} />
      <circle cx={cx} cy={cy} r={r * 0.36} fill={BLUE} opacity={0.08} />
    </g>
  );
}

function WebArt() {
  return (
    <>
      <Glow cx={230} cy={150} r={170} />
      {/* Browser window */}
      <rect x="66" y="46" width="300" height="208" rx="12" fill={W_FAINT} stroke={W} strokeWidth="1.5" />
      <line x1="66" y1="74" x2="366" y2="74" stroke={W_SOFT} strokeWidth="1.5" />
      {[84, 98, 112].map((x) => (
        <circle key={x} cx={x} cy="60" r="3.6" fill={W_SOFT} />
      ))}
      <rect x="134" y="54" width="168" height="12" rx="6" fill="rgb(255 255 255 / 0.1)" />
      {/* Hero block */}
      <rect x="84" y="88" width="264" height="62" rx="8" fill="rgb(56 189 248 / 0.14)" stroke="rgb(56 189 248 / 0.55)" />
      <rect x="100" y="102" width="118" height="9" rx="4.5" fill="rgb(255 255 255 / 0.78)" />
      <rect x="100" y="117" width="84" height="6" rx="3" fill={W_SOFT} />
      <rect x="100" y="131" width="50" height="11" rx="5.5" fill={CYAN} />
      <rect x="262" y="98" width="72" height="42" rx="6" fill="rgb(255 255 255 / 0.12)" />
      <path d="M266 136l18-18 12 12 10-8 24 14" fill="none" stroke={W} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Card grid */}
      {[84, 176, 268].map((x, i) => (
        <g key={x}>
          <rect x={x} y="162" width="80" height="76" rx="7" fill="rgb(255 255 255 / 0.05)" stroke={W_SOFT} />
          <rect x={x + 8} y="170" width="64" height="30" rx="4" fill={i === 1 ? "rgb(56 189 248 / 0.35)" : "rgb(255 255 255 / 0.12)"} />
          <rect x={x + 8} y="208" width="48" height="5" rx="2.5" fill={W_SOFT} />
          <rect x={x + 8} y="219" width="34" height="5" rx="2.5" fill="rgb(255 255 255 / 0.18)" />
        </g>
      ))}
      {/* Floating code tag */}
      <g className="art-float">
        <rect x="330" y="22" width="104" height="60" rx="12" fill="#0a1f45" stroke={CYAN} strokeOpacity="0.75" />
        <path d="M362 40l-12 12 12 12M402 40l12 12-12 12M390 36l-16 32" fill="none" stroke={CYAN} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* Cursor */}
      <g className="art-float" style={{ "--d": "-3s" } as React.CSSProperties}>
        <path d="M232 186l0 34 9-8 7 15 6-3-7-15 12-1z" fill="#fff" stroke="#0a1f45" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      {/* Dot field */}
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 5 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={398 + c * 12} cy={196 + r * 12} r="1.6" fill={W_SOFT} />
        )),
      )}
    </>
  );
}

function SystemArt() {
  const units = [70, 108, 146, 184];
  return (
    <>
      <Glow cx={250} cy={150} r={175} />
      {/* Server rack */}
      <rect x="52" y="52" width="128" height="196" rx="12" fill={W_FAINT} stroke={W} strokeWidth="1.5" />
      {units.map((y, i) => (
        <g key={y}>
          <rect x="66" y={y} width="100" height="30" rx="6" fill="rgb(255 255 255 / 0.06)" stroke={W_SOFT} />
          <circle className="art-blink" style={{ "--d": `${-i * 0.6}s` } as React.CSSProperties} cx="81" cy={y + 15} r="3.8" fill={i === 2 ? "#34d399" : CYAN} />
          <rect x="94" y={y + 12} width="50" height="6" rx="3" fill={W_SOFT} />
          <rect x="150" y={y + 10} width="6" height="10" rx="2" fill="rgb(255 255 255 / 0.2)" />
        </g>
      ))}
      <rect x="66" y="222" width="100" height="12" rx="6" fill="rgb(255 255 255 / 0.08)" />
      {/* Database */}
      <g>
        <path d="M330 72v86c0 8.3 22.4 15 50 15s50-6.7 50-15V72" fill="rgb(255 255 255 / 0.05)" stroke={W} strokeWidth="1.5" />
        <ellipse cx="380" cy="72" rx="50" ry="15" fill="rgb(56 189 248 / 0.16)" stroke={W} strokeWidth="1.5" />
        <path d="M330 101c0 8.3 22.4 15 50 15s50-6.7 50-15M330 130c0 8.3 22.4 15 50 15s50-6.7 50-15" fill="none" stroke={W_SOFT} strokeWidth="1.5" />
      </g>
      {/* Dashboard */}
      <g className="art-float">
        <rect x="222" y="178" width="214" height="98" rx="12" fill="#0a1f45" stroke="rgb(56 189 248 / 0.6)" />
        {[28, 46, 36, 58, 44, 66].map((h, i) => (
          <rect key={i} x={240 + i * 18} y={256 - h} width="10" height={h} rx="3" fill={i === 5 ? CYAN : "rgb(255 255 255 / 0.35)"} />
        ))}
        <path d="M362 248l16-18 14 8 18-26 12 6" fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="240" y="190" width="56" height="6" rx="3" fill={W_SOFT} />
      </g>
      {/* Links */}
      <path d="M180 118C250 118 270 86 330 90" fill="none" stroke={W_SOFT} strokeWidth="1.5" />
      <path className="art-flow" d="M180 118C250 118 270 86 330 90" fill="none" stroke={CYAN} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M180 196C204 196 206 214 222 214" fill="none" stroke={W_SOFT} strokeWidth="1.5" />
      <path d="M380 173v5" fill="none" stroke={W_SOFT} strokeWidth="1.5" />
      <path className="art-flow" style={{ "--d": "-1.6s" } as React.CSSProperties} d="M180 196C204 196 206 214 222 214" fill="none" stroke={CYAN} strokeWidth="2.4" strokeLinecap="round" />
    </>
  );
}

function AppArt() {
  return (
    <>
      <Glow cx={230} cy={150} r={170} />
      {/* Back device */}
      <rect x="252" y="44" width="122" height="226" rx="20" fill="rgb(255 255 255 / 0.03)" stroke={W_SOFT} strokeWidth="1.5" />
      <rect x="268" y="74" width="90" height="56" rx="8" fill="rgb(255 255 255 / 0.07)" />
      <rect x="268" y="140" width="62" height="6" rx="3" fill={W_SOFT} />
      <rect x="268" y="152" width="44" height="6" rx="3" fill="rgb(255 255 255 / 0.18)" />
      {/* Front device */}
      <rect x="148" y="26" width="132" height="252" rx="22" fill="#0a1f45" stroke={W} strokeWidth="1.6" />
      <rect x="194" y="36" width="40" height="8" rx="4" fill={W_SOFT} />
      <rect x="164" y="58" width="100" height="10" rx="5" fill="rgb(255 255 255 / 0.14)" />
      {Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 3 }, (_, c) => {
          const i = r * 3 + c;
          const fill = i === 0 || i === 7 ? CYAN : i === 4 ? BLUE : "rgb(255 255 255 / 0.16)";
          return <rect key={i} x={166 + c * 34} y={80 + r * 34} width="26" height="26" rx="8" fill={fill} />;
        }),
      )}
      <rect x="164" y="190" width="100" height="62" rx="10" fill="rgb(255 255 255 / 0.07)" stroke={W_SOFT} />
      <rect x="174" y="202" width="60" height="6" rx="3" fill="rgb(255 255 255 / 0.55)" />
      <rect x="174" y="214" width="78" height="5" rx="2.5" fill={W_SOFT} />
      <rect x="174" y="232" width="40" height="11" rx="5.5" fill={CYAN} />
      <rect x="194" y="264" width="40" height="4" rx="2" fill={W_SOFT} />
      {/* Notification */}
      <g className="art-float">
        <rect x="46" y="92" width="128" height="46" rx="14" fill="rgb(10 31 69 / 0.92)" stroke="rgb(56 189 248 / 0.7)" />
        <circle cx="68" cy="115" r="9" fill={CYAN} />
        <path d="M64 115l3 3 6-6" fill="none" stroke="#0a1f45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="84" y="106" width="70" height="6" rx="3" fill="rgb(255 255 255 / 0.7)" />
        <rect x="84" y="118" width="48" height="5" rx="2.5" fill={W_SOFT} />
      </g>
      {/* Signal */}
      <g fill="none" stroke={CYAN} strokeLinecap="round" strokeWidth="2">
        <path className="art-blink" d="M398 74a14 14 0 0 1 14 14" />
        <path className="art-blink" style={{ "--d": "-0.8s" } as React.CSSProperties} d="M398 60a28 28 0 0 1 28 28" />
        <path className="art-blink" style={{ "--d": "-1.6s" } as React.CSSProperties} d="M398 46a42 42 0 0 1 42 42" />
      </g>
      <circle cx="398" cy="88" r="4" fill={CYAN} />
    </>
  );
}

function AiArt() {
  const left = [70, 130, 190, 250];
  const midL = [50, 105, 160, 215, 270];
  const midR = [80, 150, 220];
  const right = [115, 185];
  const lines: [number, number, number, number, boolean][] = [];
  left.forEach((y1, i) =>
    midL.forEach((y2, j) => lines.push([70, y1, 150, y2, (i + j) % 4 === 0])),
  );
  midL.forEach((y1, i) => lines.push([150, y1, 208, 160, i === 2]));
  midR.forEach((y2, j) => lines.push([272, 160, 330, y2, j === 1]));
  midR.forEach((y1, i) =>
    right.forEach((y2, j) => lines.push([330, y1, 410, y2, (i + j) % 2 === 0])),
  );
  return (
    <>
      <Glow cx={240} cy={160} r={170} />
      {lines.map(([x1, y1, x2, y2, hot], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={hot ? "rgb(56 189 248 / 0.75)" : "rgb(255 255 255 / 0.16)"} strokeWidth={hot ? 1.6 : 1} />
      ))}
      {/* Packets on the hot paths */}
      <path className="art-flow" d="M70 70L150 50L208 160" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path className="art-flow" style={{ "--d": "-1.8s" } as React.CSSProperties} d="M272 160L330 150L410 115" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      {left.map((y) => (
        <circle key={`l${y}`} cx="70" cy={y} r="7" fill="#0a1f45" stroke={W} strokeWidth="1.5" />
      ))}
      {midL.map((y, i) => (
        <circle key={`m${y}`} cx="150" cy={y} r="6.5" fill={i === 2 ? CYAN : "#0a1f45"} stroke={W} strokeWidth="1.5" />
      ))}
      {midR.map((y, i) => (
        <circle key={`r${y}`} cx="330" cy={y} r="7" fill={i === 1 ? CYAN : "#0a1f45"} stroke={W} strokeWidth="1.5" />
      ))}
      {right.map((y) => (
        <circle key={`o${y}`} cx="410" cy={y} r="9" fill="#0a1f45" stroke={CYAN} strokeWidth="2" />
      ))}
      {/* Chip */}
      <g>
        {[0, 1, 2, 3].map((k) => (
          <g key={k} stroke={W_SOFT} strokeWidth="2" strokeLinecap="round">
            <line x1={222 + k * 12} y1="118" x2={222 + k * 12} y2="108" />
            <line x1={222 + k * 12} y1="202" x2={222 + k * 12} y2="212" />
          </g>
        ))}
        <rect x="208" y="118" width="64" height="84" rx="12" fill="#0a1f45" stroke={CYAN} strokeWidth="1.8" />
        <rect x="216" y="126" width="48" height="68" rx="8" fill="rgb(56 189 248 / 0.12)" />
        <path d="M226 176l10-30 10 30M229.5 166h13M254 146v30" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* Sparkles */}
      {[
        [400, 50, 9],
        [440, 250, 6],
        [110, 280, 6],
      ].map(([x, y, s], i) => (
        <path
          key={i}
          className="art-blink"
          style={{ "--d": `${-i * 0.9}s` } as React.CSSProperties}
          d={`M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`}
          fill={CYAN}
        />
      ))}
    </>
  );
}

const ARTS: Record<DomainKind, () => React.ReactElement> = {
  web: WebArt,
  system: SystemArt,
  app: AppArt,
  ai: AiArt,
};

export function DomainArt({
  kind,
  className,
}: {
  kind: DomainKind;
  className?: string;
}) {
  const Art = ARTS[kind];
  return (
    <svg
      viewBox="0 0 480 300"
      aria-hidden
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      className={cn("block h-auto w-full", className)}
    >
      <Art />
    </svg>
  );
}

/** 小さな線のアイコン版。カードの隅や見出しの横に置く。 */
export function DomainIcon({
  kind,
  className,
}: {
  kind: DomainKind;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      className={cn("h-6 w-6 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === "web" && (
        <>
          <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
          <path d="M2.5 8.5h19M6 6.25h.01M8.5 6.25h.01M9 13l-2.5 2 2.5 2M15 13l2.5 2-2.5 2" />
        </>
      )}
      {kind === "system" && (
        <>
          <rect x="3" y="3.5" width="18" height="7" rx="2" />
          <rect x="3" y="13.5" width="18" height="7" rx="2" />
          <path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" />
        </>
      )}
      {kind === "app" && (
        <>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
          <path d="M10.5 5.5h3M10.5 18.5h3" />
        </>
      )}
      {kind === "ai" && (
        <>
          <rect x="5.5" y="5.5" width="13" height="13" rx="2.5" />
          <path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3" />
          <path d="M12 8.5c.3 1.9 1.1 2.7 3 3-1.9.3-2.7 1.1-3 3-.3-1.9-1.1-2.7-3-3 1.9-.3 2.7-1.1 3-3z" />
        </>
      )}
    </svg>
  );
}
