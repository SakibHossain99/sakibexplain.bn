import fs from 'node:fs';
import path from 'node:path';
import express, { type Request, type Response } from 'express';
import { parseRangeHeader } from './src/utils/range.ts';

const PORT = Number(process.env.PORT || 3000);
const ROOT_DIR = process.cwd();
const DOWNLOAD_FILENAME = 'sakibexplains-bn-rafi-law25-90s.mp4';

function resolveVideoPath(): string | null {
  const candidates = [
    path.join(ROOT_DIR, 'public', 'video', 'rafi-law25-90s.mp4'),
    path.join(ROOT_DIR, 'dist', 'video', 'rafi-law25-90s.mp4'),
    path.join(ROOT_DIR, 'out', 'rafi-law25-90s.mp4'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).size > 0) {
      return candidate;
    }
  }
  return null;
}

function resolvePosterPath(): string | null {
  const candidates = [
    path.join(ROOT_DIR, 'public', 'video', 'poster.png'),
    path.join(ROOT_DIR, 'dist', 'video', 'poster.png'),
    path.join(ROOT_DIR, 'out', 'stills', 'scene01-hook.png'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).size > 0) {
      return candidate;
    }
  }
  return null;
}

async function startServer(): Promise<void> {
  const app = express();
  app.disable('x-powered-by');

  const sendVideoResponse = (req: Request, res: Response, isAttachment: boolean): void => {
    const videoPath = resolveVideoPath();
    if (!videoPath) {
      res.status(404).json({ error: 'Rendered MP4 not found on server.' });
      return;
    }

    const stat = fs.statSync(videoPath);
    const totalSize = stat.size;

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges, Content-Disposition');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (isAttachment) {
      res.setHeader('Content-Disposition', `attachment; filename="${DOWNLOAD_FILENAME}"`);
    }

    if (req.method === 'HEAD') {
      res.setHeader('Content-Length', String(totalSize));
      res.status(200).end();
      return;
    }

    const parsed = parseRangeHeader(req.headers.range, totalSize);

    if (parsed.status === 'invalid') {
      res.setHeader('Content-Range', `bytes */${totalSize}`);
      res.status(416).end();
      return;
    }

    if (parsed.status === 'valid') {
      res.status(206);
      res.setHeader('Content-Range', `bytes ${parsed.start}-${parsed.end}/${totalSize}`);
      res.setHeader('Content-Length', String(parsed.chunkSize));

      const stream = fs.createReadStream(videoPath, {
        start: parsed.start,
        end: parsed.end,
      });
      stream.on('error', () => {
        if (!res.headersSent) res.status(500).end();
        else res.end();
      });
      stream.pipe(res);
      return;
    }

    res.status(200);
    res.setHeader('Content-Length', String(totalSize));
    const stream = fs.createReadStream(videoPath);
    stream.on('error', () => {
      if (!res.headersSent) res.status(500).end();
      else res.end();
    });
    stream.pipe(res);
  };

  // HTTP 206 Partial Content byte-range streaming endpoints (mobile & desktop friendly)
  app.get('/api/video', (req, res) => sendVideoResponse(req, res, false));
  app.head('/api/video', (req, res) => sendVideoResponse(req, res, false));
  app.get('/video/rafi-law25-90s.mp4', (req, res) => sendVideoResponse(req, res, false));
  app.head('/video/rafi-law25-90s.mp4', (req, res) => sendVideoResponse(req, res, false));

  // Direct standalone download endpoints (works directly in phone & desktop browsers)
  app.get('/api/download', (req, res) => sendVideoResponse(req, res, true));
  app.head('/api/download', (req, res) => sendVideoResponse(req, res, true));
  app.get('/download.mp4', (req, res) => sendVideoResponse(req, res, true));
  app.head('/download.mp4', (req, res) => sendVideoResponse(req, res, true));

  // Crisp Scene 1 preview poster image for immediate video thumbnail clarity
  app.get('/api/poster', (_req, res) => {
    const posterPath = resolvePosterPath();
    if (!posterPath) {
      res.status(404).end();
      return;
    }
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');
    fs.createReadStream(posterPath).pipe(res);
  });

  // Lightweight metadata endpoint for byte-size verification and direct download link
  app.get('/api/meta', (req, res) => {
    const videoPath = resolveVideoPath();
    if (!videoPath) {
      res.status(404).json({ ready: false, sizeBytes: 0 });
      return;
    }
    const stat = fs.statSync(videoPath);
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
    const host = (req.headers['x-forwarded-host'] as string) || req.get('host') || '';
    const appOrigin = (process.env.APP_URL || (host ? `${proto}://${host}` : '')).replace(/\/$/, '');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      ready: true,
      filename: DOWNLOAD_FILENAME,
      sizeBytes: stat.size,
      width: 1080,
      height: 1920,
      fps: 30,
      frames: 2700,
      durationSeconds: 90,
      downloadUrl: appOrigin ? `${appOrigin}/api/download` : '/api/download',
      streamUrl: appOrigin ? `${appOrigin}/video/rafi-law25-90s.mp4` : '/video/rafi-law25-90s.mp4',
    });
  });

  // Mount Vite dev middleware in development or static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(ROOT_DIR, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
