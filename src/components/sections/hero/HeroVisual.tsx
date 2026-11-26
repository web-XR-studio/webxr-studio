"use client";

import { useEffect, useRef, useState } from "react";
import { BrainCircuit, Pause, Play, Server, Smartphone } from "lucide-react";

/**
 * ファーストビューの動く背景。1枚の <canvas> に2つの層を描く。
 *
 * 1. つながる点（ネットワーク）: ヒーロー全体をゆっくり漂う点と、近い点
 *    どうしを結ぶ細い線。いくつかの点は色を変えて明滅させる。カーソルの
 *    近くの点はカーソルとも線で結ばれる。本文の側（左）では線を薄くする。
 * 2. 粒子の図: 数千の粒子が集まって形を描き、数秒ごとに散ってから次の形へ
 *    組み直す。形はロゴ → Web（回る地球）→ システム → アプリ → AI の順で、
 *    事業の4領域をひと巡りする。アイコンは Lucide のもの。
 *
 * 図の中心と大きさは、右の列に置いた枠（stageRef）の位置から決めるので、
 * 配置は CSS だけで変えられる。画面外にあるとき・タブが裏にあるとき・
 * 「動きを止める」を押したときは描画を止める。「動きを減らす」設定では、
 * 最初の形を組み上がった状態で1枚だけ描く。
 */

type ShapeDef = {
  key: string;
  /** 図の下に添える英字と日本語。 */
  en: string;
  label: string;
};

const SHAPES: ShapeDef[] = [
  { key: "xr", en: "WEB-XR.studio", label: "ひとつの窓口で" },
  { key: "web", en: "WEB", label: "Web制作" },
  { key: "system", en: "SYSTEM", label: "システム開発" },
  { key: "app", en: "APP", label: "アプリ開発" },
  { key: "ai", en: "AI", label: "AI開発" },
];

/** 1つの形を組み上げる時間と、組み上がったまま見せる時間（秒）。 */
const MORPH = 2.2;
const HOLD = 3.4;
/** 粒子ごとの出発の遅れの最大（組み上げ時間に対する割合）。 */
const MAX_DELAY = 0.3;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** 回る地球: 経線・緯線・表面の粒と、斜めにかかる輪。 */
function sphereShape(count: number) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let x: number;
    let y: number;
    let z: number;
    if (r < 0.12) {
      // 輪（土星の環のように少し傾ける）
      const a = Math.random() * Math.PI * 2;
      const rr = 1.28 + (Math.random() - 0.5) * 0.05;
      const tilt = 0.42;
      x = Math.cos(a) * rr;
      const ry = 0;
      const rz = Math.sin(a) * rr;
      y = ry * Math.cos(tilt) - rz * Math.sin(tilt);
      z = ry * Math.sin(tilt) + rz * Math.cos(tilt);
    } else {
      let lat: number;
      let lon: number;
      if (r < 0.42) {
        // 経線（30° ごと）
        lon = Math.floor(Math.random() * 6) * (Math.PI / 6);
        lat = (Math.random() - 0.5) * Math.PI;
      } else if (r < 0.68) {
        // 緯線（-60° 〜 60°）
        lat = (Math.floor(Math.random() * 5) - 2) * (Math.PI / 6);
        lon = Math.random() * Math.PI * 2;
      } else {
        // 表面にまばらに散る粒
        lat = Math.asin(Math.random() * 2 - 1);
        lon = Math.random() * Math.PI * 2;
      }
      const c = Math.cos(lat) * 0.92;
      x = c * Math.cos(lon);
      y = Math.sin(lat) * 0.92;
      z = c * Math.sin(lon);
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

/** 散った状態: 図の周りに広く漂う雲。最初の組み上げの出発点にも使う。 */
function cloudShape(count: number) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = 0.6 + Math.pow(Math.random(), 0.7) * 2.2;
    out[i * 3] = Math.cos(a) * d * 1.3;
    out[i * 3 + 1] = Math.sin(a) * d * 0.9;
    out[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
  }
  return out;
}

/**
 * SVG を画像として描き、塗られた画素から粒子の位置を拾う。画像にできな
 * かったとき（古いブラウザなど）は null を返し、呼び出し側が地球で代える。
 */
async function svgShape(svg: SVGSVGElement, count: number) {
  const size = 320;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(size));
  clone.setAttribute("height", String(size));
  clone.setAttribute("color", "#000");
  clone.removeAttribute("class");
  const markup = new XMLSerializer().serializeToString(clone);
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  try {
    await img.decode();
  } catch {
    return null;
  }
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g) return null;
  g.drawImage(img, 0, 0, size, size);
  const data = g.getImageData(0, 0, size, size).data;
  const hits: number[] = [];
  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      if (data[(y * size + x) * 4 + 3] > 110) hits.push(x, y);
    }
  }
  const n = hits.length / 2;
  if (n < 20) return null;
  const half = size / 2;
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const j = Math.floor(Math.random() * n);
    out[i * 3] = (hits[j * 2] + Math.random() * 2 - half) / half;
    out[i * 3 + 1] = (hits[j * 2 + 1] + Math.random() * 2 - half) / half;
    // 平らなアイコンに薄い厚みを持たせ、揺れたときに奥行きが出るようにする。
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.16;
  }
  return out;
}

/** 形ごとの向き。地球は回り続け、アイコンは左右にゆっくり揺れる。 */
function rotationFor(key: string, t: number) {
  if (key === "web") return { y: t * 0.45, x: -0.32 };
  return { y: Math.sin(t * 0.75) * 0.28, x: Math.sin(t * 0.5) * 0.08 };
}

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  spark: boolean;
  phase: number;
};

function readRgb(el: Element, name: string, fallback: string) {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
}

export function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const source = sourceRef.current;
    // 描画面は <section> いっぱいに広がる（間の要素は位置指定しない）。
    const host = canvas?.closest("section") ?? canvas?.parentElement;
    if (!canvas || !stage || !source || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const narrow = window.innerWidth < 768;
    const COUNT = narrow ? 1400 : 3000;

    // ---- 色（配色テーマで変わる。CSS 変数から読む） --------------------
    let dot = "0 102 255";
    let line = "13 34 80";
    let spark = "56 189 248";
    let glow = false;
    const readColors = () => {
      dot = readRgb(canvas, "--hero-dot", dot);
      line = readRgb(canvas, "--hero-line", line);
      spark = readRgb(canvas, "--hero-spark", spark);
      glow = document.documentElement.dataset.theme !== "light";
    };
    readColors();

    // ---- 大きさ ----------------------------------------------------------
    let W = 0;
    let H = 0;
    let dpr = 1;
    let cx = 0;
    let cy = 0;
    let R = 0;
    const measure = () => {
      const rect = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      const s = stage.getBoundingClientRect();
      cx = s.left - rect.left + s.width / 2;
      cy = s.top - rect.top + s.height / 2;
      R = Math.min(s.width, s.height) * 0.33;
    };
    measure();

    // ---- ネットワークの点 ------------------------------------------------
    const nodeCount = W < 768 ? 30 : W < 1280 ? 52 : 68;
    const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => {
      const speed = 6 + Math.random() * 12; // px / 秒
      const a = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        spark: i % 9 === 0,
        phase: Math.random() * Math.PI * 2,
      };
    });
    let pointer: { x: number; y: number } | null = null;
    const onPointer = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      pointer = null;
    };
    host.addEventListener("pointermove", onPointer, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    // ---- 粒子 ------------------------------------------------------------
    const pos = new Float32Array(COUNT * 3); // 今の位置（正規化した空間）
    const from = new Float32Array(COUNT * 3); // 組み替えの出発点
    const dir = new Float32Array(COUNT * 3); // 散るときの向き
    const amp = new Float32Array(COUNT); // 散る距離
    const delay = new Float32Array(COUNT);
    const size = new Float32Array(COUNT);
    const phase = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const u = Math.random() * 2 - 1;
      const a = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      dir[i * 3] = s * Math.cos(a);
      dir[i * 3 + 1] = s * Math.sin(a);
      dir[i * 3 + 2] = u;
      amp[i] = 0.25 + Math.random() * 0.85;
      delay[i] = Math.random() * MAX_DELAY;
      const r = Math.random();
      size[i] = r > 0.92 ? 2.6 : r > 0.55 ? 1.8 : 1.3;
      phase[i] = Math.random() * Math.PI * 2;
    }
    from.set(cloudShape(COUNT));
    pos.set(from);

    const shapes: Float32Array[] = SHAPES.map(() => sphereShape(COUNT));
    let ready = false;

    // 画面座標（CSS px）と、濃さの段（0〜3）
    const sx = new Float32Array(COUNT);
    const sy = new Float32Array(COUNT);
    const sz = new Float32Array(COUNT);
    const band = new Uint8Array(COUNT);

    let clock = 0; // 止めている間は進まない時計（秒）
    let shapeIndex = 0;
    let shapeStart = 0;

    const project = (t: number) => {
      const key = SHAPES[shapeIndex].key;
      const target = shapes[shapeIndex];
      const local = t - shapeStart;
      const k = local / MORPH;
      const rot = rotationFor(key, local);
      const cy1 = Math.cos(rot.y);
      const sy1 = Math.sin(rot.y);
      const cx1 = Math.cos(rot.x);
      const sx1 = Math.sin(rot.x);
      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        // 目標の点を回して置く
        const tx = target[i3];
        const ty = target[i3 + 1];
        const tz = target[i3 + 2];
        const x1 = tx * cy1 + tz * sy1;
        const z1 = -tx * sy1 + tz * cy1;
        const y2 = ty * cx1 - z1 * sx1;
        const z2 = ty * sx1 + z1 * cx1;
        let x = x1;
        let y = y2;
        let z = z2;
        if (k < 1) {
          const e = easeInOutCubic(clamp01((k - delay[i]) / (1 - MAX_DELAY)));
          const burst = Math.sin(Math.PI * e) * amp[i];
          // 散る向きを少しずつ回して、渦を巻くように流す
          const sw = e * 1.6;
          const dx = dir[i3] * Math.cos(sw) - dir[i3 + 1] * Math.sin(sw);
          const dy = dir[i3] * Math.sin(sw) + dir[i3 + 1] * Math.cos(sw);
          x = from[i3] + (x - from[i3]) * e + dx * burst;
          y = from[i3 + 1] + (y - from[i3 + 1]) * e + dy * burst;
          z = from[i3 + 2] + (z - from[i3 + 2]) * e + dir[i3 + 2] * burst;
        } else {
          // 組み上がった後は、ごくわずかに呼吸させる
          const b = Math.sin(t * 1.4 + phase[i]) * 0.006;
          x += b;
          y += b * 0.6;
        }
        pos[i3] = x;
        pos[i3 + 1] = y;
        pos[i3 + 2] = z;
        const p = 3.4 / (3.4 + z);
        sx[i] = cx + x * R * p;
        sy[i] = cy + y * R * p;
        sz[i] = p;
        // 手前ほど濃く
        const depth = clamp01((1.3 - z) / 2.6);
        band[i] = depth > 0.72 ? 3 : depth > 0.5 ? 2 : depth > 0.3 ? 1 : 0;
      }
      if (k >= 1 + HOLD / MORPH && ready && !reduced) {
        // 次の形へ。今の位置をそのまま出発点にする。
        from.set(pos);
        shapeIndex = (shapeIndex + 1) % SHAPES.length;
        shapeStart = t;
        setIndex(shapeIndex);
      }
    };

    const BAND_ALPHA = [0.28, 0.48, 0.72, 0.95];

    const draw = (t: number, dt: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // ---- ネットワーク ----
      const linkDist = W < 768 ? 120 : 170;
      const linkDist2 = linkDist * linkDist;
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < -20) n.x = W + 20;
        else if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20;
        else if (n.y > H + 20) n.y = -20;
      }
      ctx.lineWidth = 1;
      // 本文の側（左）では線を薄くし、文字の邪魔をしない。
      const fade = (x: number) =>
        W < 1024 ? 0.55 : 0.28 + 0.72 * smoothstep(W * 0.3, W * 0.62, x);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > linkDist2) continue;
          const alpha =
            (1 - Math.sqrt(d2) / linkDist) * 0.32 * fade((a.x + b.x) / 2);
          ctx.strokeStyle = `rgb(${line} / ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        if (pointer) {
          const dx = a.x - pointer.x;
          const dy = a.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 200 * 200) {
            const alpha = (1 - Math.sqrt(d2) / 200) * 0.55;
            ctx.strokeStyle = `rgb(${spark} / ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const f = fade(n.x);
        if (n.spark) {
          const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 + n.phase);
          ctx.fillStyle = `rgb(${spark} / ${(0.18 * pulse * f).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 4 + pulse * 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgb(${spark} / ${(0.9 * f).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgb(${line} / ${(0.45 * f).toFixed(3)})`;
          ctx.fillRect(n.x - 1, n.y - 1, 2, 2);
        }
      }

      // ---- 粒子の図 ----
      project(t);
      if (glow) ctx.globalCompositeOperation = "lighter";
      for (let b = 0; b < 4; b++) {
        ctx.fillStyle = `rgb(${dot} / ${BAND_ALPHA[b] * (glow ? 0.8 : 1)})`;
        for (let i = 0; i < COUNT; i++) {
          if (band[i] !== b) continue;
          const s = size[i] * sz[i];
          ctx.fillRect(sx[i] - s / 2, sy[i] - s / 2, s, s);
        }
      }
      ctx.globalCompositeOperation = "source-over";
    };

    // ---- 形の読み込み（Lucide のアイコンとロゴを画像にして粒子を拾う）----
    let cancelled = false;
    (async () => {
      const list = await Promise.all(
        SHAPES.map(async (s) => {
          if (s.key === "web") return sphereShape(COUNT);
          const svg = source.querySelector<SVGSVGElement>(
            `[data-shape="${s.key}"]`,
          );
          return (svg && (await svgShape(svg, COUNT))) || sphereShape(COUNT);
        }),
      );
      if (cancelled) return;
      list.forEach((pts, i) => (shapes[i] = pts));
      ready = true;
      shapeStart = clock;
      if (reduced) {
        // 動きを減らす設定: 最初の形を組み上がった状態で1枚だけ描く。
        draw(MORPH + 0.01, 0);
      }
    })();

    // ---- ループ ----------------------------------------------------------
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const loop = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (ready) clock += dt;
      draw(clock, dt);
      schedule();
    };
    const schedule = (fromIdle = false) => {
      if (raf || reduced) return;
      if (!visible || pausedRef.current || document.hidden) return;
      // 止まっていた間の時間は進めない。
      if (fromIdle) last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) schedule(true);
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : schedule(true));
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      measure();
      if (reduced || pausedRef.current) draw(reduced ? MORPH + 0.01 : clock, 0);
    });
    ro.observe(host);

    const themeObserver = new MutationObserver(() => {
      readColors();
      if (reduced || pausedRef.current) draw(reduced ? MORPH + 0.01 : clock, 0);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // 一時停止ボタンからの再開を受け取る
    const onResume = () => schedule(true);
    canvas.addEventListener("hero:resume", onResume);

    schedule(true);

    return () => {
      cancelled = true;
      stop();
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("hero:resume", onResume);
    };
  }, []);

  const togglePause = () => {
    const next = !paused;
    setPaused(next);
    pausedRef.current = next;
    if (!next) canvasRef.current?.dispatchEvent(new Event("hero:resume"));
  };

  const current = SHAPES[index];

  return (
    <>
      {/* ヒーロー全体を覆う描画面。<section> を基準に広がる。 */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="hero-canvas pointer-events-none absolute inset-0 -z-10"
      />

      {/* 粒子の図の置き場。周りに点線の軌道を回す。 */}
      <div
        ref={stageRef}
        data-paused={paused || undefined}
        aria-hidden
        style={{ "--d": "500ms" } as React.CSSProperties}
        className="hero-stage hero-fade relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[28rem] lg:max-w-[34rem]"
      >
        <svg
          viewBox="0 0 200 200"
          className="hero-orbit absolute inset-[-6%] h-[112%] w-[112%] text-stage-accent/50"
        >
          <circle
            cx="100"
            cy="100"
            r="96"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            strokeDasharray="1.2 3.2"
          />
        </svg>
        <svg
          viewBox="0 0 200 200"
          className="hero-orbit hero-orbit--rev absolute inset-[14%] h-[72%] w-[72%] text-stage-accent/40"
        >
          <circle
            cx="100"
            cy="100"
            r="97"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.55"
            strokeDasharray="10 6 1 6"
          />
          <circle cx="100" cy="3" r="3.2" className="fill-stage-accent" />
        </svg>

        {/* いま描いている形の名前と、次の形までの進み。 */}
        <div className="absolute -bottom-2 left-1/2 flex w-max -translate-x-1/2 flex-col items-center gap-2 whitespace-nowrap sm:bottom-0">
          <p
            key={current.key}
            className="hero-caption flex items-baseline gap-2.5 text-on-stage"
          >
            <span className="font-display text-[0.7rem] font-medium tracking-[0.2em] text-on-stage/60">
              {String(index + 1).padStart(2, "0")} / {String(SHAPES.length).padStart(2, "0")}
            </span>
            <span className="font-display text-base font-medium tracking-[0.14em]">
              {current.en}
            </span>
            <span className="text-xs font-bold text-on-stage/70">
              {current.label}
            </span>
          </p>
          <span className="block h-px w-28 overflow-hidden bg-on-stage/15">
            <span
              key={`${current.key}-bar`}
              className="hero-progress block h-full w-full bg-stage-accent"
              style={
                { "--hero-cycle": `${(MORPH + HOLD) * 1000}ms` } as React.CSSProperties
              }
            />
          </span>
        </div>
      </div>

      {/* 動き続ける表示を止める手段（WCAG 2.2.2）。 */}
      <button
        type="button"
        onClick={togglePause}
        aria-pressed={paused}
        className="absolute bottom-5 right-5 z-10 inline-flex items-center gap-2 rounded-full border border-on-stage/15 bg-stage/80 px-4 py-2 text-xs font-semibold text-on-stage/80 shadow-sm backdrop-blur transition-colors hover:border-stage-accent/60 hover:text-on-stage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage-accent/60 motion-reduce:hidden sm:right-8"
      >
        {paused ? (
          <Play aria-hidden fill="currentColor" className="h-3 w-3" />
        ) : (
          <Pause aria-hidden fill="currentColor" className="h-3 w-3" />
        )}
        {paused ? "動きを再開する" : "動きを止める"}
      </button>

      {/* 粒子の形の元絵。画面には出さず、読み込み後に画像として読む。 */}
      <div ref={sourceRef} hidden aria-hidden>
        <svg data-shape="xr" viewBox="-10 -10 220 220">
          <path
            fill="currentColor"
            d="M 93 18 C 112 19 130 25 145 36 C 165 50 178 72 182 96 L 168 96 C 163 72 149 53 129 43 L 121 50 Z"
          />
          <path
            fill="currentColor"
            transform="rotate(180 100 100)"
            d="M 93 18 C 112 19 130 25 145 36 C 165 50 178 72 182 96 L 168 96 C 163 72 149 53 129 43 L 121 50 Z"
          />
          <text
            x="100"
            y="123"
            textAnchor="middle"
            fill="currentColor"
            fontFamily='"Arial Black", Arial, Helvetica, sans-serif'
            fontSize="72"
            fontWeight="900"
            letterSpacing="-2"
          >
            XR
          </text>
        </svg>
        <Server data-shape="system" strokeWidth={1.5} />
        <Smartphone data-shape="app" strokeWidth={1.5} />
        <BrainCircuit data-shape="ai" strokeWidth={1.4} />
      </div>
    </>
  );
}

