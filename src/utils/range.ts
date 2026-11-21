export const CHUNK_SIZE_BYTES = 2 * 1024 * 1024; // 2 MiB sequential chunks

export interface ByteRange {
  start: number;
  end: number;
  length: number;
}

export type ParsedRangeResult =
  | { status: 'none' }
  | { status: 'invalid' }
  | { status: 'valid'; start: number; end: number; chunkSize: number };

/**
 * Parse an HTTP `Range` header (single byte-range spec) against a known file size.
 * Supports `bytes=start-end`, `bytes=start-`, and suffix `bytes=-suffix`.
 */
export function parseRangeHeader(
  rangeHeader: string | undefined,
  totalSize: number
): ParsedRangeResult {
  if (!rangeHeader) {
    return { status: 'none' };
  }
  if (!Number.isInteger(totalSize) || totalSize <= 0) {
    return { status: 'invalid' };
  }

  const trimmed = rangeHeader.trim();
  if (!trimmed.startsWith('bytes=')) {
    return { status: 'invalid' };
  }

  const spec = trimmed.slice('bytes='.length).trim();
  // Reject multi-range requests (comma-separated) cleanly
  if (!spec || spec.includes(',')) {
    return { status: 'invalid' };
  }

  const dashIdx = spec.indexOf('-');
  if (dashIdx === -1) {
    return { status: 'invalid' };
  }

  const startPart = spec.slice(0, dashIdx).trim();
  const endPart = spec.slice(dashIdx + 1).trim();

  if (startPart === '' && endPart === '') {
    return { status: 'invalid' };
  }

  let start: number;
  let end: number;

  if (startPart === '') {
    // Suffix byte range: last N bytes
    if (!/^\d+$/.test(endPart)) return { status: 'invalid' };
    const suffixLength = Number(endPart);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) {
      return { status: 'invalid' };
    }
    start = Math.max(0, totalSize - suffixLength);
    end = totalSize - 1;
  } else {
    if (!/^\d+$/.test(startPart)) return { status: 'invalid' };
    start = Number(startPart);
    if (!Number.isSafeInteger(start) || start < 0 || start >= totalSize) {
      return { status: 'invalid' };
    }

    if (endPart === '') {
      end = totalSize - 1;
    } else {
      if (!/^\d+$/.test(endPart)) return { status: 'invalid' };
      const parsedEnd = Number(endPart);
      if (!Number.isSafeInteger(parsedEnd) || parsedEnd < start) {
        return { status: 'invalid' };
      }
      end = Math.min(parsedEnd, totalSize - 1);
    }
  }

  return {
    status: 'valid',
    start,
    end,
    chunkSize: end - start + 1,
  };
}

/**
 * Partition `totalBytes` into exact non-overlapping sequential byte ranges
 * of at most `chunkSize` bytes (default 2 MiB).
 */
export function buildByteRanges(
  totalBytes: number,
  chunkSize: number = CHUNK_SIZE_BYTES
): ByteRange[] {
  if (!Number.isInteger(totalBytes) || totalBytes <= 0) {
    throw new RangeError('totalBytes must be a positive integer');
  }
  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new RangeError('chunkSize must be a positive integer');
  }

  const ranges: ByteRange[] = [];
  let start = 0;
  while (start < totalBytes) {
    const end = Math.min(start + chunkSize - 1, totalBytes - 1);
    ranges.push({
      start,
      end,
      length: end - start + 1,
    });
    start = end + 1;
  }
  return ranges;
}

/**
 * Verify that all fetched byte chunks exactly match `totalBytes` without
 * gaps, truncation, or extra bytes.
 */
export function verifyChunkByteTotal(
  chunks: ReadonlyArray<{ byteLength: number }>,
  expectedTotalBytes: number
): { ok: boolean; receivedBytes: number; expectedBytes: number } {
  let receivedBytes = 0;
  for (const chunk of chunks) {
    receivedBytes += chunk.byteLength;
  }
  return {
    ok: expectedTotalBytes > 0 && receivedBytes === expectedTotalBytes,
    receivedBytes,
    expectedBytes: expectedTotalBytes,
  };
}

/**
 * Parse total size from an HTTP `Content-Range: bytes start-end/total` header.
 */
export function parseContentRangeTotal(contentRange: string | null): number | null {
  if (!contentRange) return null;
  const match = /^bytes\s+(\d+)-(\d+)\/(\d+)$/i.exec(contentRange.trim());
  if (!match) return null;
  const total = Number(match[3]);
  return Number.isSafeInteger(total) && total > 0 ? total : null;
}

export function formatMegabytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
