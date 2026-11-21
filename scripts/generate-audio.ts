import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import {
  DEFAULT_DIALOGUE_CUES,
  DURATION_SECONDS,
  SPEAKER_PROFILES,
  VIDEO_FPS,
  type AudioTimingManifest,
  type DialogueCue,
} from '../src/remotion/timeline';

const ROOT_DIR = process.cwd();
const TMP_DIR = path.join(ROOT_DIR, '.tmp-audio');
const PUBLIC_AUDIO_DIR = path.join(ROOT_DIR, 'public', 'audio');
const OUTPUT_MP3 = path.join(PUBLIC_AUDIO_DIR, 'voiceover.mp3');
const TIMING_JSON = path.join(ROOT_DIR, 'src', 'remotion', 'audio-timing.json');

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

function runFfmpeg(args: string[]): void {
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], {
    stdio: 'pipe',
  });
}

function probeDuration(filePath: string): number {
  const out = execFileSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      filePath,
    ],
    { encoding: 'utf8' }
  ).trim();
  const parsed = Number.parseFloat(out);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid duration from ffprobe for ${filePath}: "${out}"`);
  }
  return parsed;
}

function buildAtempoChain(speedRatio: number): string {
  // ffmpeg atempo accepts [0.5, 2.0]; chain if outside bounds
  const filters: string[] = [];
  let remaining = speedRatio;
  while (remaining > 2.0) {
    filters.push('atempo=2.0');
    remaining /= 2.0;
  }
  while (remaining < 0.5) {
    filters.push('atempo=0.5');
    remaining /= 0.5;
  }
  filters.push(`atempo=${remaining.toFixed(4)}`);
  return filters.join(',');
}

async function synthesizeCue(cue: DialogueCue, rawMp3Path: string): Promise<void> {
  const profile = SPEAKER_PROFILES[cue.speaker];
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(
        profile.edgeVoice,
        OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3
      );
      const { audioStream } = tts.toStream(cue.text, {
        rate: profile.edgeRate,
        pitch: profile.edgePitch,
      });

      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      const buf = Buffer.concat(chunks);
      if (buf.length < 1024) {
        throw new Error(`Synthesized audio too small (${buf.length} bytes)`);
      }
      fs.writeFileSync(rawMp3Path, buf);
      return;
    } catch (err) {
      lastError = err;
      console.warn(`Retry ${attempt}/4 for ${cue.id} (${cue.speaker}):`, (err as Error).message);
      await new Promise((r) => setTimeout(r, 700 * attempt));
    }
  }

  throw new Error(`Failed to synthesize ${cue.id}: ${String(lastError)}`);
}

function generateSfxAssets(): {
  scratch: string;
  phoneRing: string;
  pageTurn: string;
  stampThud: string;
  ambientBed: string;
} {
  const scratch = path.join(TMP_DIR, 'sfx_scratch.wav');
  const phoneRing = path.join(TMP_DIR, 'sfx_ring.wav');
  const pageTurn = path.join(TMP_DIR, 'sfx_page.wav');
  const stampThud = path.join(TMP_DIR, 'sfx_stamp.wav');
  const ambientBed = path.join(TMP_DIR, 'ambient_bed.wav');

  // 1. Record-scratch freeze hit (0.55s): downward chirp + sub-bass thump
  runFfmpeg([
    '-f',
    'lavfi',
    '-i',
    "aevalsrc='0.45*sin(2*PI*(920*exp(-5.5*t)+65)*t)*exp(-4.2*t)+0.40*sin(2*PI*(95*exp(-2.8*t)+34)*t)*exp(-3.5*t)':s=48000:d=0.55",
    '-af',
    'lowpass=f=2400,volume=0.55',
    '-ac',
    '2',
    scratch,
  ]);

  // 2. Smartphone video-call ringtone chime (1.35s): warm dual harmonic pulse
  runFfmpeg([
    '-f',
    'lavfi',
    '-i',
    "aevalsrc='(0.25*sin(2*PI*784*t)+0.18*sin(2*PI*1175*t)+0.10*sin(2*PI*1568*t))*lt(mod(t,0.45),0.18)*exp(-3.5*mod(t,0.45))':s=48000:d=1.35",
    '-af',
    'lowpass=f=3200,volume=0.42',
    '-ac',
    '2',
    phoneRing,
  ]);

  // 3. Warm page-turn flutter (0.65s): softly band-passed pink noise swell
  runFfmpeg([
    '-f',
    'lavfi',
    '-i',
    'anoisesrc=color=pink:duration=0.65:sample_rate=48000',
    '-af',
    'bandpass=f=900:w=700,afade=t=in:st=0:d=0.14,afade=t=out:st=0.22:d=0.43,volume=0.35',
    '-ac',
    '2',
    pageTurn,
  ]);

  // 4. Red stamp thud (0.28s): punchy low-mid percussive thump
  runFfmpeg([
    '-f',
    'lavfi',
    '-i',
    "aevalsrc='0.65*sin(2*PI*(155*exp(-14*t)+46)*t)*exp(-11*t)+0.18*sin(2*PI*340*t)*exp(-24*t)':s=48000:d=0.28",
    '-af',
    'lowpass=f=1200,volume=0.65',
    '-ac',
    '2',
    stampThud,
  ]);

  // 5. Emotional ambient piano/warm pad bed (90.00s):
  const bedExpr = [
    '(',
    'lt(t,50)*(0.18*sin(2*PI*146.83*t)+0.12*sin(2*PI*220.0*t)+0.09*sin(2*PI*293.66*t)+0.06*sin(2*PI*349.23*t)*(0.5+0.5*sin(2*PI*0.18*t)))',
    '+',
    'gte(t,50)*(0.18*sin(2*PI*174.61*t)+0.13*sin(2*PI*261.63*t)+0.10*sin(2*PI*329.63*t)+0.07*sin(2*PI*392.00*t)*(0.5+0.5*sin(2*PI*0.22*t)))',
    ')',
    '*(0.55+0.45*exp(-1.2*mod(t,3.0)))',
  ].join('');

  runFfmpeg([
    '-f',
    'lavfi',
    '-i',
    `aevalsrc='${bedExpr}':s=48000:d=${DURATION_SECONDS}`,
    '-af',
    'lowpass=f=1100,aecho=0.8:0.85:90:0.35,afade=t=in:st=0:d=1.5,afade=t=out:st=87.5:d=2.5,volume=0.22',
    '-ac',
    '2',
    ambientBed,
  ]);

  return { scratch, phoneRing, pageTurn, stampThud, ambientBed };
}

async function main(): Promise<void> {
  ensureDir(TMP_DIR);
  ensureDir(PUBLIC_AUDIO_DIR);

  console.log('1/4 Synthesizing 19 realistic Bengali neural voiceover clips via Edge-TTS...');

  const fittedClips: Array<{
    cue: DialogueCue;
    wavPath: string;
    startSec: number;
    endSec: number;
    durationSec: number;
  }> = [];

  for (const cue of DEFAULT_DIALOGUE_CUES) {
    const rawMp3 = path.join(TMP_DIR, `${cue.id}_raw.mp3`);
    const trimmedWav = path.join(TMP_DIR, `${cue.id}_trim.wav`);
    const fittedWav = path.join(TMP_DIR, `${cue.id}_fit.wav`);

    if (!fs.existsSync(rawMp3) || fs.statSync(rawMp3).size < 1024) {
      await synthesizeCue(cue, rawMp3);
    }
    const rawDur = probeDuration(rawMp3);

    // Trim silence and convert to 48kHz stereo WAV
    runFfmpeg([
      '-i',
      rawMp3,
      '-af',
      'silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB,areverse',
      '-ar',
      '48000',
      '-ac',
      '2',
      trimmedWav,
    ]);

    const trimmedDur = probeDuration(trimmedWav);
    const maxSlotDur = Math.max(0.4, cue.slotEndSec - cue.slotStartSec - 0.04);

    if (trimmedDur > maxSlotDur) {
      const ratio = trimmedDur / maxSlotDur;
      const atempo = buildAtempoChain(ratio);
      runFfmpeg([
        '-i',
        trimmedWav,
        '-af',
        `${atempo},highpass=f=70,dynaudnorm,alimiter=limit=0.95`,
        '-ar',
        '48000',
        '-ac',
        '2',
        fittedWav,
      ]);
    } else {
      runFfmpeg([
        '-i',
        trimmedWav,
        '-af',
        'highpass=f=70,dynaudnorm,alimiter=limit=0.95',
        '-ar',
        '48000',
        '-ac',
        '2',
        fittedWav,
      ]);
    }

    const finalDur = probeDuration(fittedWav);
    const startSec = cue.slotStartSec;
    const endSec = Math.min(cue.slotEndSec, startSec + finalDur);

    console.log(
      `  [${cue.id}] ${SPEAKER_PROFILES[cue.speaker].bengaliName} (${cue.speaker}): raw=${rawDur.toFixed(2)}s -> fit=${finalDur.toFixed(2)}s @ ${startSec.toFixed(2)}s..${endSec.toFixed(2)}s`
    );

    fittedClips.push({
      cue,
      wavPath: fittedWav,
      startSec,
      endSec,
      durationSec: finalDur,
    });
  }

  console.log('2/4 Mixing speech track onto 90.00s timeline & normalizing loudness...');
  const speechBusWav = path.join(TMP_DIR, 'speech_bus.wav');
  const speechInputs: string[] = [
    '-f',
    'lavfi',
    '-t',
    `${DURATION_SECONDS}`,
    '-i',
    'anullsrc=r=48000:cl=stereo',
  ];
  const speechFilterParts: string[] = [];
  const speechMixLabels: string[] = ['[0:a]'];

  fittedClips.forEach((clip, idx) => {
    const inputIdx = idx + 1;
    speechInputs.push('-i', clip.wavPath);
    const delayMs = Math.round(clip.startSec * 1000);
    const label = `[sp${idx}]`;
    speechFilterParts.push(
      `[${inputIdx}:a]adelay=${delayMs}|${delayMs},apad=whole_dur=${DURATION_SECONDS}[sp_p${idx}];[sp_p${idx}]atrim=0:${DURATION_SECONDS}${label}`
    );
    speechMixLabels.push(label);
  });

  speechFilterParts.push(
    `${speechMixLabels.join('')}amix=inputs=${speechMixLabels.length}:duration=first:normalize=0,highpass=f=70,dynaudnorm=f=150:g=11,alimiter=limit=0.95,atrim=0:${DURATION_SECONDS}[speechout]`
  );

  runFfmpeg([
    ...speechInputs,
    '-filter_complex',
    speechFilterParts.join(';'),
    '-map',
    '[speechout]',
    '-ar',
    '48000',
    '-ac',
    '2',
    speechBusWav,
  ]);

  console.log('3/4 Generating cinema SFX & ducking ambient piano bed (-24dB under speech)...');
  const sfx = generateSfxAssets();

  // SFX schedule (seconds):
  // - scratch at 3.00s (Scene 1 frame 90 freeze-frame)
  // - phoneRing at 11.00s (Scene 2 call) and 75.02s (Scene 9 Cha-cha call)
  // - pageTurn at 19.00s (Scene 3 flashback) and 67.10s (Scene 8 book open)
  // - stampThud at 30.80s, 32.80s, 38.20s (Scene 4 exam & age-limit stamps)
  const sfxPlacements: Array<{ file: string; atSec: number; gain: number }> = [
    { file: sfx.scratch, atSec: 3.0, gain: 0.72 },
    { file: sfx.phoneRing, atSec: 11.0, gain: 0.55 },
    { file: sfx.pageTurn, atSec: 19.0, gain: 0.65 },
    { file: sfx.stampThud, atSec: 30.8, gain: 0.78 },
    { file: sfx.stampThud, atSec: 32.8, gain: 0.78 },
    { file: sfx.stampThud, atSec: 38.2, gain: 0.85 },
    { file: sfx.pageTurn, atSec: 67.1, gain: 0.72 },
    { file: sfx.phoneRing, atSec: 75.02, gain: 0.48 },
  ];

  const finalInputs: string[] = [
    '-i',
    speechBusWav, // 0: normalized speech bus
    '-i',
    sfx.ambientBed, // 1: 90s ambient piano/pad bed
  ];
  const mixParts: string[] = [
    // Split speech bus for direct mix + sidechain detector in consistent fltp stereo format
    '[0:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,asplit=2[sp_main][sp_sc]',
    // Duck ambient bed to ~ -24dB under speech
    '[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=-14dB[bed_pre]',
    '[bed_pre][sp_sc]sidechaincompress=threshold=0.025:ratio=8:attack=15:release=320:makeup=1,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=-10dB[bed_final]',
  ];

  const finalLabels: string[] = ['[sp_main]', '[bed_final]'];
  sfxPlacements.forEach((p, idx) => {
    const inIdx = idx + 2;
    finalInputs.push('-i', p.file);
    const delayMs = Math.round(p.atSec * 1000);
    const label = `[fx${idx}]`;
    mixParts.push(
      `[${inIdx}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=${p.gain},adelay=${delayMs}|${delayMs},apad=whole_dur=${DURATION_SECONDS},atrim=0:${DURATION_SECONDS}${label}`
    );
    finalLabels.push(label);
  });

  mixParts.push(
    `${finalLabels.join('')}amix=inputs=${finalLabels.length}:duration=first:normalize=0,alimiter=limit=0.95,atrim=0:${DURATION_SECONDS}[master]`
  );

  runFfmpeg([
    ...finalInputs,
    '-filter_complex',
    mixParts.join(';'),
    '-map',
    '[master]',
    '-c:a',
    'libmp3lame',
    '-b:a',
    '192k',
    '-ar',
    '48000',
    '-ac',
    '2',
    '-t',
    `${DURATION_SECONDS}`,
    OUTPUT_MP3,
  ]);

  console.log('4/4 Writing frame-locked audio timing manifest & verifying with ffprobe...');
  const finalDuration = probeDuration(OUTPUT_MP3);

  const manifest: AudioTimingManifest = {
    generatedAt: new Date().toISOString(),
    engine: 'msedge-tts (bn-BD-PradeepNeural / bn-IN-BashkarNeural / bn-BD-NabanitaNeural)',
    durationSec: Number(finalDuration.toFixed(3)),
    cues: fittedClips.map((c) => {
      const startFrame = Math.round(c.startSec * VIDEO_FPS);
      const endFrame = Math.max(startFrame + 6, Math.round(c.endSec * VIDEO_FPS));
      return {
        id: c.cue.id,
        speaker: c.cue.speaker,
        startSec: Number(c.startSec.toFixed(3)),
        endSec: Number(c.endSec.toFixed(3)),
        startFrame,
        endFrame,
      };
    }),
  };

  fs.writeFileSync(TIMING_JSON, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  const probeInfo = execFileSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-show_entries',
      'format=duration,bit_rate:stream=codec_name,channels,sample_rate',
      '-of',
      'json',
      OUTPUT_MP3,
    ],
    { encoding: 'utf8' }
  );
  console.log('Verified public/audio/voiceover.mp3:\n', probeInfo);

  // Clean up temporary audio directory
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
}

main().catch((err) => {
  console.error('Audio generation failed:', err);
  process.exit(1);
});
