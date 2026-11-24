/**
 * ヒーローのドットマップ（日本地図）を生成する。
 *
 *   npx tsx scripts/generate-japan-dots.mts
 *
 * 入力は scripts/assets/japan-map.png（透過 PNG。陸地が不透明、拠点に XR の
 * ロゴが濃い色で載っている）。格子状に標本を取り、陸地に当たったマスだけを
 * ドットにする。あわせてロゴの位置を拠点として拾い出す。
 *
 * 出力は src/components/sections/hero/japan-dots.ts。描画側は SVG の
 * `M x y h0` を丸い線端で描く手法でドットにするので、ここではその path 文字列
 * まで組み立てておく（数千個の <circle> を並べるより HTML が一桁小さい）。
 *
 * 外部パッケージは使わない。PNG は zlib で展開し、行フィルタを自前で戻す。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(root, "scripts/assets/japan-map.png");
const OUT = resolve(root, "src/components/sections/hero/japan-dots.ts");

/** 格子の間隔(px)。小さいほど細かいが、HTML が重くなる。 */
const STEP = 9;

// ---------------------------------------------------------------------------
// PNG decode (8-bit RGBA, non-interlaced only — that is what the asset is)
// ---------------------------------------------------------------------------
function decodePng(buf: Buffer) {
  const sig = "89504e470d0a1a0a";
  if (buf.subarray(0, 8).toString("hex") !== sig) throw new Error("not a PNG");
  let off = 8;
  let width = 0;
  let height = 0;
  const idat: Buffer[] = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      const depth = data[8];
      const color = data[9];
      const interlace = data[12];
      if (depth !== 8 || color !== 6 || interlace !== 0)
        throw new Error(`unsupported PNG (depth ${depth}, color ${color}, interlace ${interlace})`);
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    off += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const bpp = 4;
  const stride = width * bpp;
  const px = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? px[y * stride + x - bpp] : 0;
      const b = y > 0 ? px[(y - 1) * stride + x] : 0;
      const c = x >= bpp && y > 0 ? px[(y - 1) * stride + x - bpp] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[y * stride + x] = v & 0xff;
    }
  }
  return { width, height, px };
}

const { width, height, px } = decodePng(readFileSync(SRC));
const alpha = (x: number, y: number) => px[(y * width + x) * 4 + 3];
const lum = (x: number, y: number) => {
  const i = (y * width + x) * 4;
  return 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
};

// ---------------------------------------------------------------------------
// Dots: one per grid cell whose neighbourhood is mostly land. Averaging over a
// small window keeps single-pixel coastline noise from producing stray dots.
// ---------------------------------------------------------------------------
const dots: [number, number][] = [];
const R = 3;
for (let gy = STEP / 2; gy < height; gy += STEP) {
  for (let gx = STEP / 2; gx < width; gx += STEP) {
    const cx = Math.round(gx);
    const cy = Math.round(gy);
    let sum = 0;
    let n = 0;
    for (let dy = -R; dy <= R; dy++) {
      for (let dx = -R; dx <= R; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        sum += alpha(x, y);
        n++;
      }
    }
    if (n && sum / n > 150) dots.push([cx, cy]);
  }
}

// ---------------------------------------------------------------------------
// Nodes: the XR logos are the darkest opaque pixels. Cluster them greedily by
// distance, keep clusters big enough to be a logo, and take their centroids.
// ---------------------------------------------------------------------------
type Cluster = { sx: number; sy: number; n: number };
const clusters: Cluster[] = [];
for (let y = 0; y < height; y += 2) {
  for (let x = 0; x < width; x += 2) {
    if (alpha(x, y) < 220 || lum(x, y) > 90) continue;
    let hit: Cluster | undefined;
    for (const c of clusters) {
      const dx = c.sx / c.n - x;
      const dy = c.sy / c.n - y;
      if (dx * dx + dy * dy < 48 * 48) {
        hit = c;
        break;
      }
    }
    if (hit) {
      hit.sx += x;
      hit.sy += y;
      hit.n++;
    } else clusters.push({ sx: x, sy: y, n: 1 });
  }
}
const nodes = clusters
  .filter((c) => c.n > 60)
  .map((c) => [Math.round(c.sx / c.n), Math.round(c.sy / c.n)] as [number, number])
  // 北から南へ。描画側はこの順に線でつなぐ。
  .sort((a, b) => a[1] - b[1]);

// ---------------------------------------------------------------------------
// Output. Every 7th / 11th dot goes to a "twinkle" group so a few points can
// shimmer without animating the whole map.
// ---------------------------------------------------------------------------
const path = (list: [number, number][]) => list.map(([x, y]) => `M${x} ${y}h0`).join("");
const base: [number, number][] = [];
const twinkleA: [number, number][] = [];
const twinkleB: [number, number][] = [];
dots.forEach((d, i) => {
  if (i % 11 === 3) twinkleA.push(d);
  else if (i % 7 === 5) twinkleB.push(d);
  else base.push(d);
});

const file = `// 自動生成ファイル。手で編集しない。
// 生成: npx tsx scripts/generate-japan-dots.mts（入力 scripts/assets/japan-map.png）

/** 元画像の寸法。SVG の viewBox にそのまま使う。 */
export const JAPAN_SIZE = { width: ${width}, height: ${height} } as const;

/** ドットの間隔(px)。線幅（＝ドットの直径）の基準にする。 */
export const JAPAN_STEP = ${STEP};

/** 陸地のドット（${base.length} 個）。\`M x y h0\` を丸い線端で描く。 */
export const JAPAN_DOTS = "${path(base)}";

/** きらめかせるドット 2 群（${twinkleA.length} 個 / ${twinkleB.length} 個）。 */
export const JAPAN_TWINKLE_A = "${path(twinkleA)}";
export const JAPAN_TWINKLE_B = "${path(twinkleB)}";

/** 拠点（元画像の XR ロゴの位置）。北から南の順。 */
export const JAPAN_NODES: readonly (readonly [number, number])[] = ${JSON.stringify(nodes)};
`;
writeFileSync(OUT, file);
console.log(
  `wrote ${OUT}\n  dots: ${dots.length} (base ${base.length}, twinkle ${twinkleA.length}+${twinkleB.length})\n  nodes: ${nodes.length} ${JSON.stringify(nodes)}\n  bytes: ${file.length}`,
);
