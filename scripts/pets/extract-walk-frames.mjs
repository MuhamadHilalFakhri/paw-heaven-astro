import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const [source, destination] = process.argv.slice(2);
if (!source || !destination) throw new Error("Usage: node extract-walk-frames.mjs source destination");
const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const visited = new Uint8Array(info.width * info.height);
const queue = new Int32Array(visited.length);
const components = [];
for (let seed = 0; seed < visited.length; seed++) {
  if (visited[seed] || data[seed * 4 + 3] < 80) continue;
  let head = 0, tail = 1;
  queue[0] = seed;
  visited[seed] = 1;
  const bounds = { left: info.width, top: info.height, right: 0, bottom: 0, pixels: 0 };
  while (head < tail) {
    const pixel = queue[head++];
    const x = pixel % info.width, y = Math.floor(pixel / info.width);
    bounds.left = Math.min(bounds.left, x); bounds.right = Math.max(bounds.right, x);
    bounds.top = Math.min(bounds.top, y); bounds.bottom = Math.max(bounds.bottom, y);
    bounds.pixels++;
    const neighbors = [];
    if (x > 0) neighbors.push(pixel - 1);
    if (x + 1 < info.width) neighbors.push(pixel + 1);
    if (y > 0) neighbors.push(pixel - info.width);
    if (y + 1 < info.height) neighbors.push(pixel + info.width);
    for (const next of neighbors) {
      if (!visited[next] && data[next * 4 + 3] >= 80) {
        visited[next] = 1;
        queue[tail++] = next;
      }
    }
  }
  if (bounds.pixels > 2000) components.push(bounds);
}
if (components.length !== 24) throw new Error(`Expected 24 complete silhouettes, found ${components.length}`);
components.sort((a, b) => {
  const rowA = Math.floor((a.top + a.bottom) / 2 / (info.height / 4));
  const rowB = Math.floor((b.top + b.bottom) / 2 / (info.height / 4));
  return rowA - rowB || a.left - b.left;
});
const maxWidth = Math.max(...components.map(b => b.right - b.left + 7));
const maxHeight = Math.max(...components.map(b => b.bottom - b.top + 7));
const scale = Math.min(158 / maxWidth, 150 / maxHeight);
await mkdir(destination, { recursive: true });
let bytes = 0;
for (const [index, bounds] of components.entries()) {
  const left = Math.max(0, bounds.left - 3), top = Math.max(0, bounds.top - 3);
  const width = Math.min(info.width - left, bounds.right - left + 4);
  const height = Math.min(info.height - top, bounds.bottom - top + 4);
  const resizedWidth = Math.round(width * scale), resizedHeight = Math.round(height * scale);
  const sprite = await sharp(source).extract({ left, top, width, height })
    .resize(resizedWidth, resizedHeight).toBuffer();
  const output = await sharp({ create: { width: 192, height: 192, channels: 4, background: "#00000000" } })
    .composite([{ input: sprite, left: Math.round((192 - resizedWidth) / 2), top: 170 - resizedHeight }])
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(`${destination}/frame-${String(index).padStart(2, "0")}.webp`);
  bytes += output.size;
}
console.log(JSON.stringify({ frames: components.length, bytes, destination }));
