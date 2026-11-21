import { useCallback, useEffect, useState } from 'react';
import { Check, Copy, Download, AlertCircle, ExternalLink } from 'lucide-react';
import {
  CHUNK_SIZE_BYTES,
  buildByteRanges,
  formatMegabytes,
  parseContentRangeTotal,
  verifyChunkByteTotal,
} from './utils/range';

type DownloadStatus = 'idle' | 'downloading' | 'verified' | 'error';

interface DownloadProgress {
  receivedBytes: number;
  totalBytes: number;
  percent: number;
}

const DOWNLOAD_FILENAME = 'sakibexplains-bn-rafi-law25-90s.mp4';

export default function App() {
  const [status, setStatus] = useState<DownloadStatus>('idle');
  const [progress, setProgress] = useState<DownloadProgress>({
    receivedBytes: 0,
    totalBytes: 0,
    percent: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [knownFileBytes, setKnownFileBytes] = useState<number | null>(null);
  const [directDownloadUrl, setDirectDownloadUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let active = true;
    const fallbackOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    if (fallbackOrigin) {
      setDirectDownloadUrl(`${fallbackOrigin}/api/download`);
    }

    fetch('/api/meta', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        if (typeof data.sizeBytes === 'number' && data.sizeBytes > 0) {
          setKnownFileBytes(data.sizeBytes);
        }
        if (typeof data.downloadUrl === 'string' && data.downloadUrl.startsWith('http')) {
          setDirectDownloadUrl(data.downloadUrl);
        }
      })
      .catch(() => {
        // Silent; download handler discovers total size directly via HEAD/Range headers
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCopyLink = useCallback(async () => {
    if (!directDownloadUrl) return;
    try {
      await navigator.clipboard.writeText(directDownloadUrl);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback copy via temporary input for restricted mobile iframes
      const input = document.createElement('input');
      input.value = directDownloadUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2500);
    }
  }, [directDownloadUrl]);

  const handleVerifiedDownload = useCallback(async () => {
    if (status === 'downloading') return;
    setStatus('downloading');
    setErrorMessage(null);

    try {
      // 1. Discover exact byte size via HEAD /api/video
      const headRes = await fetch('/api/video', {
        method: 'HEAD',
        cache: 'no-store',
      });
      if (!headRes.ok) {
        throw new Error(`Video metadata request failed (HTTP ${headRes.status})`);
      }

      let totalBytes = Number(headRes.headers.get('Content-Length') || 0);
      if (!Number.isSafeInteger(totalBytes) || totalBytes <= 0) {
        const probeRes = await fetch('/api/video', {
          headers: { Range: 'bytes=0-0' },
          cache: 'no-store',
        });
        const fromHeader = parseContentRangeTotal(probeRes.headers.get('Content-Range'));
        if (!fromHeader) {
          throw new Error('Unable to determine exact MP4 file size.');
        }
        totalBytes = fromHeader;
      }

      setKnownFileBytes(totalBytes);
      setProgress({ receivedBytes: 0, totalBytes, percent: 0 });

      // 2. Partition into exact 2 MiB sequential Range chunks
      const ranges = buildByteRanges(totalBytes, CHUNK_SIZE_BYTES);
      const chunks: Uint8Array<ArrayBuffer>[] = [];
      let receivedBytes = 0;

      for (const range of ranges) {
        const res = await fetch('/api/video', {
          headers: { Range: `bytes=${range.start}-${range.end}` },
          cache: 'no-store',
        });

        if (res.status !== 206 && res.status !== 200) {
          throw new Error(`Chunk fetch failed at byte ${range.start} (HTTP ${res.status})`);
        }

        const buffer = await res.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        if (bytes.byteLength !== range.length) {
          throw new Error(
            `Chunk length mismatch at ${range.start}-${range.end}: expected ${range.length}, got ${bytes.byteLength}`
          );
        }

        chunks.push(bytes);
        receivedBytes += bytes.byteLength;
        const percent = Math.min(100, Math.round((receivedBytes / totalBytes) * 100));
        setProgress({ receivedBytes, totalBytes, percent });
      }

      // 3. Strict byte-for-byte verification before constructing and saving Blob
      const verification = verifyChunkByteTotal(chunks, totalBytes);
      if (!verification.ok) {
        throw new Error(
          `Integrity check failed: received ${verification.receivedBytes} of ${verification.expectedBytes} bytes.`
        );
      }

      const blob = new Blob(chunks, { type: 'video/mp4' });
      if (blob.size !== totalBytes) {
        throw new Error(`Blob size mismatch: ${blob.size} !== ${totalBytes}`);
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = DOWNLOAD_FILENAME;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 15_000);

      setStatus('verified');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Download failed. Use direct download link.');
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#F2F4F7] flex flex-col">
      {/* 1. Minimal Header: @sakibexplains.bn and 1080×1920 · 30fps · 01:30 · 2,700f */}
      <header className="w-full border-b border-white/10">
        <div className="max-w-5xl mx-auto px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-base font-semibold tracking-tight text-[#F8FAFC] whitespace-nowrap shrink-0">
            @sakibexplains.bn
          </span>
          <p className="font-mono-tabular text-xs sm:text-sm text-[#9AA4B2] tracking-wide whitespace-nowrap shrink-0">
            1080×1920 <span aria-hidden="true">·</span> 30fps <span aria-hidden="true">·</span> 01:30{' '}
            <span aria-hidden="true">·</span> 2,700f
          </p>
        </div>
      </header>

      {/* Main Centered Delivery Stage (mobile & desktop responsive) */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-5">
        <div className="w-full max-w-[360px] flex flex-col items-center gap-4">
          {/* 2. Centered 9:16 Native Video Player */}
          <div className="w-full max-w-[310px] sm:max-w-[330px] aspect-[9/16] rounded-2xl overflow-hidden bg-[#050709] border border-white/12 shadow-[0_24px_64px_rgba(0,0,0,0.65)]">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/api/poster?v=2"
              src="/api/video?v=2"
              className="w-full h-full object-contain bg-black"
              aria-label="Law 25: Re-Create Yourself — 90-second Bengali YouTube Short"
            />
          </div>

          {/* 3. ONE Prominent Verified 2 MiB Range-Chunk Download Button + Direct Link Copy for Mobile */}
          <div className="w-full flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleVerifiedDownload}
              disabled={status === 'downloading'}
              className="w-full h-12 px-6 rounded-xl bg-[#D4AF37] hover:bg-[#E1BE4C] active:bg-[#C39E2B] disabled:opacity-75 disabled:cursor-wait text-[#120E04] font-semibold text-sm tracking-tight transition-colors duration-150 flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] whitespace-nowrap"
            >
              {status === 'verified' ? (
                <>
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Full 90s MP4 Download</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    {status === 'downloading'
                      ? `Downloading ${progress.percent}%`
                      : 'Full 90s MP4 Download'}
                  </span>
                </>
              )}
            </button>

            {/* Live % / MB Progress Bar during or after chunked download */}
            {(status === 'downloading' || status === 'verified') && progress.totalBytes > 0 && (
              <div className="w-full space-y-1.5" role="status" aria-live="polite">
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#D4AF37] transition-transform duration-150 origin-left"
                    style={{
                      width: `${progress.percent}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between font-mono-tabular text-xs text-[#9AA4B2]">
                  <span>
                    {status === 'verified'
                      ? 'Verified byte-for-byte'
                      : `${progress.percent}%`}
                  </span>
                  <span>
                    {formatMegabytes(progress.receivedBytes)} / {formatMegabytes(progress.totalBytes)}
                  </span>
                </div>
              </div>
            )}

            {/* Explicit error state with fallback guidance */}
            {status === 'error' && errorMessage && (
              <div
                role="alert"
                className="w-full flex items-center gap-2 text-xs text-[#FCA5A5] bg-[#2D1215] border border-[#7F1D1D] rounded-lg px-3 py-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Direct MP4 download fallback + Copyable standalone phone URL */}
            <div className="w-full flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#8A94A3]">
              <a
                href="/api/download"
                download={DOWNLOAD_FILENAME}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#D4AF37] transition-colors underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                <span>
                  Direct MP4 download
                  {knownFileBytes ? ` (${formatMegabytes(knownFileBytes)})` : ''}
                </span>
                <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
              </a>

              {directDownloadUrl && (
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 hover:text-[#D4AF37] transition-colors underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3 h-3 text-[#2EC4B6] shrink-0" aria-hidden="true" />
                      <span className="text-[#2EC4B6]">Link copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 shrink-0" aria-hidden="true" />
                      <span>Copy direct link</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
