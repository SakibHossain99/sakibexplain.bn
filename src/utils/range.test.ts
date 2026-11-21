import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHUNK_SIZE_BYTES,
  buildByteRanges,
  parseContentRangeTotal,
  parseRangeHeader,
  verifyChunkByteTotal,
} from './range';

test('parseRangeHeader handles explicit start-end, open-ended, suffix, and invalid ranges', () => {
  assert.deepEqual(parseRangeHeader(undefined, 1000), { status: 'none' });

  assert.deepEqual(parseRangeHeader('bytes=0-99', 1000), {
    status: 'valid',
    start: 0,
    end: 99,
    chunkSize: 100,
  });

  assert.deepEqual(parseRangeHeader('bytes=500-', 1000), {
    status: 'valid',
    start: 500,
    end: 999,
    chunkSize: 500,
  });

  // Clamps end to totalSize - 1
  assert.deepEqual(parseRangeHeader('bytes=900-5000', 1000), {
    status: 'valid',
    start: 900,
    end: 999,
    chunkSize: 100,
  });

  // Suffix range
  assert.deepEqual(parseRangeHeader('bytes=-200', 1000), {
    status: 'valid',
    start: 800,
    end: 999,
    chunkSize: 200,
  });

  // Invalid / unsatisfiable ranges
  assert.deepEqual(parseRangeHeader('bytes=1000-1100', 1000), { status: 'invalid' });
  assert.deepEqual(parseRangeHeader('bytes=500-400', 1000), { status: 'invalid' });
  assert.deepEqual(parseRangeHeader('items=0-10', 1000), { status: 'invalid' });
  assert.deepEqual(parseRangeHeader('bytes=0-10,20-30', 1000), { status: 'invalid' });
});

test('buildByteRanges partitions arbitrary file sizes into gapless 2 MiB chunks', () => {
  const fileSize = 5 * 1024 * 1024 + 12345; // 5.01 MiB
  const ranges = buildByteRanges(fileSize, CHUNK_SIZE_BYTES);

  assert.equal(ranges.length, 3);
  assert.deepEqual(ranges[0], { start: 0, end: CHUNK_SIZE_BYTES - 1, length: CHUNK_SIZE_BYTES });
  assert.deepEqual(ranges[1], {
    start: CHUNK_SIZE_BYTES,
    end: CHUNK_SIZE_BYTES * 2 - 1,
    length: CHUNK_SIZE_BYTES,
  });
  assert.deepEqual(ranges[2], {
    start: CHUNK_SIZE_BYTES * 2,
    end: fileSize - 1,
    length: fileSize - CHUNK_SIZE_BYTES * 2,
  });

  // Verify contiguous coverage from 0 to fileSize - 1
  let cursor = 0;
  let total = 0;
  for (const r of ranges) {
    assert.equal(r.start, cursor);
    assert.equal(r.end - r.start + 1, r.length);
    cursor = r.end + 1;
    total += r.length;
  }
  assert.equal(cursor, fileSize);
  assert.equal(total, fileSize);
});

test('verifyChunkByteTotal verifies exact byte-for-byte completeness', () => {
  const chunks = [new Uint8Array(2097152), new Uint8Array(2097152), new Uint8Array(512)];
  const exact = verifyChunkByteTotal(chunks, 4194816);
  assert.equal(exact.ok, true);
  assert.equal(exact.receivedBytes, 4194816);

  const short = verifyChunkByteTotal(chunks, 4194817);
  assert.equal(short.ok, false);
});

test('parseContentRangeTotal extracts total size from valid Content-Range header', () => {
  assert.equal(parseContentRangeTotal('bytes 0-2097151/12345678'), 12345678);
  assert.equal(parseContentRangeTotal('bytes */12345678'), null);
  assert.equal(parseContentRangeTotal(null), null);
});
