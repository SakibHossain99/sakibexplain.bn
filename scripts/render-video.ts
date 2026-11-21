import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';

const ROOT_DIR = process.cwd();
const ENTRY_POINT = path.join(ROOT_DIR, 'src', 'remotion', 'index.ts');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PUBLIC_VIDEO_DIR = path.join(PUBLIC_DIR, 'video');
const PUBLIC_MP4 = path.join(PUBLIC_VIDEO_DIR, 'rafi-law25-90s.mp4');
const PUBLIC_POSTER = path.join(PUBLIC_VIDEO_DIR, 'poster.png');
const OUT_DIR = path.join(ROOT_DIR, 'out');
const STILLS_DIR = path.join(OUT_DIR, 'stills');
const RAW_MP4 = path.join(OUT_DIR, 'raw.mp4');
const OUT_MP4 = path.join(OUT_DIR, 'rafi-law25-90s.mp4');

const BROWSER_EXECUTABLE =
  process.env.REMOTION_BROWSER_EXECUTABLE ||
  '/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell';

const PREVIEW_STILLS: Array<{ name: string; frame: number; label: string }> = [
  { name: 'scene01-hook.png', frame: 98, label: 'Scene 1: Freeze-Frame Hook & Status Drop' },
  { name: 'scene02-split.png', frame: 410, label: 'Scene 2: Split-Screen Video Call' },
  { name: 'scene04-montage.png', frame: 1045, label: 'Scene 4: Jewelry Counter & Brass Balance Scale' },
  { name: 'scene06-brain.png', frame: 1620, label: 'Scene 6: Side-Profile Neural Cutaway & Snapping Strings' },
  { name: 'scene07-comparison.png', frame: 1920, label: 'Scene 7: Gilded Cage vs Craftsman Identity Forge' },
  { name: 'scene08-book.png', frame: 2180, label: 'Scene 8: 3D Opening Book Quote & Banker Lamp' },
  { name: 'scene09-turnaround.png', frame: 2380, label: 'Scene 9: 41C Summer Split & Executive Desk' },
  { name: 'scene10-finale.png', frame: 2595, label: 'Scene 10: 4-Character Finale & CTA' },
];

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const stillsOnly = args.has('--stills-only');
  const videoOnly = args.has('--video-only');

  fs.mkdirSync(STILLS_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_VIDEO_DIR, { recursive: true });

  const browserExecutable = fs.existsSync(BROWSER_EXECUTABLE)
    ? BROWSER_EXECUTABLE
    : undefined;

  console.log('Bundling Remotion composition...');
  const serveUrl = await bundle({
    entryPoint: ENTRY_POINT,
    publicDir: PUBLIC_DIR,
    onProgress: (p) => {
      if (p === 100) console.log('Bundle ready (100%).');
    },
  });

  const composition = await selectComposition({
    serveUrl,
    id: 'RafiLaw25Short',
    browserExecutable,
    chromiumOptions: {
      disableWebSecurity: true,
    },
  });

  console.log(
    `Selected composition: ${composition.id} (${composition.width}x${composition.height} @ ${composition.fps}fps, ${composition.durationInFrames} frames)`
  );

  if (!videoOnly) {
    console.log(`Rendering ${PREVIEW_STILLS.length} inspection stills...`);
    for (const still of PREVIEW_STILLS) {
      const output = path.join(STILLS_DIR, still.name);
      await renderStill({
        composition,
        serveUrl,
        output,
        frame: still.frame,
        imageFormat: 'png',
        browserExecutable,
        chromiumOptions: {
          disableWebSecurity: true,
        },
      });
      console.log(`  Rendered ${still.name} (frame ${still.frame}) — ${still.label}`);
    }
    // Persist Scene 1 poster directly inside public/video/poster.png
    const scene1Still = path.join(STILLS_DIR, 'scene01-hook.png');
    if (fs.existsSync(scene1Still)) {
      fs.copyFileSync(scene1Still, PUBLIC_POSTER);
      console.log(`Persisted poster to ${PUBLIC_POSTER}`);
    }
  }

  if (stillsOnly) {
    console.log('Stills-only mode complete.');
    return;
  }

  const cpuCount = Math.max(2, Math.min(os.cpus().length, 4));
  console.log(
    `Rendering full ${composition.durationInFrames}-frame H.264 MP4 (concurrency=${cpuCount}, jpeg intermediate, veryfast)...`
  );

  const startedAt = Date.now();
  let lastLoggedPct = -5;
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    crf: 20,
    x264Preset: 'ultrafast',
    pixelFormat: 'yuv420p',
    imageFormat: 'jpeg',
    jpegQuality: 88,
    audioCodec: 'aac',
    audioBitrate: '192k',
    outputLocation: RAW_MP4,
    concurrency: cpuCount,
    browserExecutable,
    chromiumOptions: {
      disableWebSecurity: true,
    },
    onProgress: ({ progress, renderedFrames, encodedFrames }) => {
      const pct = Math.floor(progress * 100);
      if (pct >= lastLoggedPct + 5 || pct === 100) {
        lastLoggedPct = pct;
        const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);
        console.log(
          `  Render progress: ${pct}% (${elapsedSec}s) rendered=${renderedFrames}/${composition.durationInFrames}, encoded=${encodedFrames}`
        );
      }
    },
  });

  console.log('Encoding final broadcast-safe yuv420p +faststart 90.00s MP4 to public/video/rafi-law25-90s.mp4...');
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-i',
      RAW_MP4,
      '-c:v',
      'libx264',
      '-crf',
      '21',
      '-preset',
      'veryfast',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-ar',
      '48000',
      '-ac',
      '2',
      '-t',
      '90',
      '-movflags',
      '+faststart',
      PUBLIC_MP4,
    ],
    { stdio: 'inherit' }
  );

  // Mirror to out/rafi-law25-90s.mp4 for compatibility
  fs.copyFileSync(PUBLIC_MP4, OUT_MP4);

  // Extract fresh crisp Scene 1 poster directly from frame 98 (3.26s) if not already updated
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-ss',
      '3.26',
      '-i',
      PUBLIC_MP4,
      '-frames:v',
      '1',
      PUBLIC_POSTER,
    ],
    { stdio: 'inherit' }
  );
  fs.copyFileSync(PUBLIC_POSTER, path.join(STILLS_DIR, 'scene01-hook.png'));

  // Clean up raw intermediate MP4 to keep workspace lean
  if (fs.existsSync(RAW_MP4)) {
    fs.unlinkSync(RAW_MP4);
  }

  console.log('Verifying public/video/rafi-law25-90s.mp4 via ffprobe...');
  const probe = execFileSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-show_entries',
      'format=duration,size,bit_rate:stream=codec_type,codec_name,width,height,nb_frames,r_frame_rate,channels,sample_rate,bit_rate,pix_fmt',
      '-of',
      'json',
      PUBLIC_MP4,
    ],
    { encoding: 'utf8' }
  );
  console.log(probe);
}

main().catch((err) => {
  console.error('Render failed:', err);
  process.exit(1);
});
