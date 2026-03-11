import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const srcInput = path.join(root, 'src', 'assets', 'favicon.png');
const srcOutput = path.join(root, 'src', 'assets', 'favicon.png');
const publicOutput = path.join(root, 'public', 'favicon.png');

// Pure black so Safari tab background looks consistent.
const bg = { r: 0, g: 0, b: 0 };

function centerCropRect(width, height, zoom = 1.0) {
  // zoom > 1 crops in tighter (e.g. 1.08 = ~8% zoom-in)
  const cropW = Math.max(1, Math.floor(width / zoom));
  const cropH = Math.max(1, Math.floor(height / zoom));
  const left = Math.max(0, Math.floor((width - cropW) / 2));
  const top = Math.max(0, Math.floor((height - cropH) / 2));
  return { left, top, width: cropW, height: cropH };
}

async function run() {
  const input = sharp(srcInput);
  const meta = await input.metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (!w || !h) throw new Error('Could not read favicon dimensions.');

  // Slight zoom-in helps avoid any edge fringing when downscaled.
  const crop = centerCropRect(w, h, 1.08);

  const size = 256;
  // Safari shows favicons inside a rounded “plate” in the tab UI, so we generate
  // a rounded-corner icon to match and avoid awkward square corners.
  const cornerRadius = 56; // tuned for Safari’s tab presentation
  const roundedMaskSvg = Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${cornerRadius}" ry="${cornerRadius}" fill="#fff"/>
    </svg>`,
  );

  const out = await sharp(srcInput)
    .extract(crop)
    .flatten({ background: bg }) // remove alpha + ensure black background
    // `contain` adds background padding so the mark never touches the edge.
    .resize(size, size, { fit: 'contain', background: bg })
    .png()
    // Apply rounded corners (transparent outside the rounded square).
    .composite([{ input: roundedMaskSvg, blend: 'dest-in' }])
    .toBuffer();

  await sharp(out).toFile(publicOutput);
  await sharp(out).toFile(srcOutput);
  console.log('Wrote favicon to:', publicOutput, 'and', srcOutput);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

