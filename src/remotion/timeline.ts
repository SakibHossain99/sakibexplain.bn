export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const TOTAL_FRAMES = 2700;
export const DURATION_SECONDS = 90;

export const SAFE_ZONE = {
  xMin: 60,
  xMax: 940,
  yMin: 170,
  yMax: 1560,
} as const;

export type SpeakerId = 'narrator' | 'rafi' | 'chacha' | 'baba' | 'ma' | 'sumon';

export interface SpeakerProfile {
  id: SpeakerId;
  bengaliName: string;
  accentColor: string;
  pillBg: string;
  pillText: string;
  edgeVoice: string;
  edgeRate: string;
  edgePitch: string;
}

export const SPEAKER_PROFILES: Record<SpeakerId, SpeakerProfile> = {
  narrator: {
    id: 'narrator',
    bengaliName: 'কথক',
    accentColor: '#D4AF37',
    pillBg: '#2A2210',
    pillText: '#F6DC8C',
    edgeVoice: 'bn-BD-PradeepNeural',
    edgeRate: '-4%',
    edgePitch: '-3Hz',
  },
  rafi: {
    id: 'rafi',
    bengaliName: 'রাফি',
    accentColor: '#2EC4B6',
    pillBg: '#102C2D',
    pillText: '#8EF0E6',
    edgeVoice: 'bn-IN-BashkarNeural',
    edgeRate: '+2%',
    edgePitch: '+2Hz',
  },
  chacha: {
    id: 'chacha',
    bengaliName: 'চাচা',
    accentColor: '#E05A47',
    pillBg: '#321412',
    pillText: '#FFB4A8',
    edgeVoice: 'bn-BD-PradeepNeural',
    edgeRate: '+6%',
    edgePitch: '+5Hz',
  },
  baba: {
    id: 'baba',
    bengaliName: 'বাবা',
    accentColor: '#E6C37A',
    pillBg: '#2B2314',
    pillText: '#FBE4AF',
    edgeVoice: 'bn-BD-PradeepNeural',
    edgeRate: '-10%',
    edgePitch: '-8Hz',
  },
  ma: {
    id: 'ma',
    bengaliName: 'মা',
    accentColor: '#3BA99C',
    pillBg: '#122B29',
    pillText: '#9EE8DF',
    edgeVoice: 'bn-BD-NabanitaNeural',
    edgeRate: '-5%',
    edgePitch: '-2Hz',
  },
  sumon: {
    id: 'sumon',
    bengaliName: 'সুমন',
    accentColor: '#56B4D3',
    pillBg: '#112933',
    pillText: '#A8E4F7',
    edgeVoice: 'bn-IN-BashkarNeural',
    edgeRate: '+8%',
    edgePitch: '+4Hz',
  },
};

export interface SceneDefinition {
  id: number;
  key: string;
  title: string;
  startFrame: number;
  endFrame: number; // exclusive
  veilColor: string;
  transitionFrames: number;
}

export const SCENES: readonly SceneDefinition[] = [
  { id: 1, key: 'scene01', title: 'Viral Freeze-Frame Cold Open', startFrame: 0, endFrame: 330, veilColor: '#1E242B', transitionFrames: 12 },
  { id: 2, key: 'scene02', title: 'Split-Screen Video Call Stakes', startFrame: 330, endFrame: 570, veilColor: '#1E242B', transitionFrames: 12 },
  { id: 3, key: 'scene03', title: 'Flashback Pride Trap', startFrame: 570, endFrame: 870, veilColor: '#EFE7DA', transitionFrames: 12 },
  { id: 4, key: 'scene04', title: '41 Failed Exams & Mother Sacrifice', startFrame: 870, endFrame: 1200, veilColor: '#1E242B', transitionFrames: 10 },
  { id: 5, key: 'scene05', title: 'Midnight Resolve & Father Turning Point', startFrame: 1200, endFrame: 1500, veilColor: '#141B29', transitionFrames: 12 },
  { id: 6, key: 'scene06', title: 'Side-Profile Neural Cutaway', startFrame: 1500, endFrame: 1740, veilColor: '#0D131D', transitionFrames: 12 },
  { id: 7, key: 'scene07', title: '4 Years vs 60 Days & Law 25 Diagram', startFrame: 1740, endFrame: 2010, veilColor: '#0D131D', transitionFrames: 12 },
  { id: 8, key: 'scene08', title: '3D Opening Book Quote & Golden Rule', startFrame: 2010, endFrame: 2250, veilColor: '#1B1410', transitionFrames: 12 },
  { id: 9, key: 'scene09', title: 'The Turnaround & Cha-cha Call', startFrame: 2250, endFrame: 2490, veilColor: '#FFF6E5', transitionFrames: 12 },
  { id: 10, key: 'scene10', title: 'Grand Happy Finale & Comment-Bait CTA', startFrame: 2490, endFrame: 2700, veilColor: '#FFF6E5', transitionFrames: 12 },
] as const;

export interface DialogueCue {
  id: string;
  sceneId: number;
  speaker: SpeakerId;
  text: string;
  slotStartSec: number;
  slotEndSec: number;
  startFrame: number;
  endFrame: number; // exclusive
}

export const DEFAULT_DIALOGUE_CUES: readonly DialogueCue[] = [
  // Scene 1 (0–11s | 0–330f)
  {
    id: 's01_01',
    sceneId: 1,
    speaker: 'chacha',
    text: 'দেখো সবাই! মাস্টার্স পাস রাফি আমার এসি সারাইতে আসছে!',
    slotStartSec: 0.15,
    slotEndSec: 3.95,
    startFrame: 5,
    endFrame: 118,
  },
  {
    id: 's01_02',
    sceneId: 1,
    speaker: 'rafi',
    text: 'চাচা প্লিজ! বাবা জানে না আমি এই কাজ করি।',
    slotStartSec: 4.10,
    slotEndSec: 6.95,
    startFrame: 123,
    endFrame: 208,
  },
  {
    id: 's01_03',
    sceneId: 1,
    speaker: 'chacha',
    text: 'জানে না? দাঁড়া, তোর বাপরে এখনই ভিডিও কল দেই!',
    slotStartSec: 7.10,
    slotEndSec: 10.85,
    startFrame: 213,
    endFrame: 325,
  },
  // Scene 2 (11–19s | 330–570f)
  {
    id: 's02_01',
    sceneId: 2,
    speaker: 'narrator',
    text: 'কল ধরতেই বাবা দেখলেন—মইয়ের ওপর ছেলের হাতে স্ক্রু ড্রাইভার!',
    slotStartSec: 11.20,
    slotEndSec: 15.85,
    startFrame: 336,
    endFrame: 475,
  },
  {
    id: 's02_02',
    sceneId: 2,
    speaker: 'narrator',
    text: 'কিন্তু রাফির এই দিনটা কীভাবে এলো?',
    slotStartSec: 16.05,
    slotEndSec: 18.85,
    startFrame: 482,
    endFrame: 565,
  },
  // Scene 3 (19–29s | 570–870f)
  {
    id: 's03_01',
    sceneId: 3,
    speaker: 'narrator',
    text: 'চার বছর আগে মা বলেছিলেন—',
    slotStartSec: 19.15,
    slotEndSec: 21.10,
    startFrame: 575,
    endFrame: 633,
  },
  {
    id: 's03_02',
    sceneId: 3,
    speaker: 'ma',
    text: 'একটা হাতের কাজও শিখা রাখ বাবা...',
    slotStartSec: 21.25,
    slotEndSec: 24.85,
    startFrame: 638,
    endFrame: 745,
  },
  {
    id: 's03_03',
    sceneId: 3,
    speaker: 'rafi',
    text: 'মা, মাস্টার্স পাস কইরা আমি হবো মিস্ত্রি?!',
    slotStartSec: 25.05,
    slotEndSec: 28.85,
    startFrame: 752,
    endFrame: 865,
  },
  // Scene 4 (29–40s | 870–1200f)
  {
    id: 's04_01',
    sceneId: 4,
    speaker: 'narrator',
    text: 'বাবার পেনশনে ৪১টা পরীক্ষা দিল রাফি—চাকরি হলো না একটাও।',
    slotStartSec: 29.15,
    slotEndSec: 33.90,
    startFrame: 875,
    endFrame: 1017,
  },
  {
    id: 's04_02',
    sceneId: 4,
    speaker: 'narrator',
    text: 'শেষ পরীক্ষার জন্য মা বেচলেন কানের দুল—তবু রেজাল্টে রোল নেই, বয়সও শেষ!',
    slotStartSec: 34.10,
    slotEndSec: 39.85,
    startFrame: 1023,
    endFrame: 1195,
  },
  // Scene 5 (40–50s | 1200–1500f)
  {
    id: 's05_01',
    sceneId: 5,
    speaker: 'rafi',
    text: 'দোস্ত, আমারে হেল্পার রাখবি? বাবা যেন না জানে।',
    slotStartSec: 40.15,
    slotEndSec: 43.00,
    startFrame: 1205,
    endFrame: 1290,
  },
  {
    id: 's05_02',
    sceneId: 5,
    speaker: 'sumon',
    text: 'দিনে ৫০০ টাকা, আর চা ফ্রি!',
    slotStartSec: 43.10,
    slotEndSec: 45.10,
    startFrame: 1293,
    endFrame: 1353,
  },
  {
    id: 's05_03',
    sceneId: 5,
    speaker: 'baba',
    text: 'ভাই, ছেলে আমার চুরি করে না, কাজ শিখতেছে—কাজ শেষে ওরে এক কাপ চা দিয়েন।',
    slotStartSec: 45.25,
    slotEndSec: 49.85,
    startFrame: 1358,
    endFrame: 1495,
  },
  // Scene 6 (50–58s | 1500–1740f)
  {
    id: 's06_01',
    sceneId: 6,
    speaker: 'narrator',
    text: 'বাবার ওই এক কথায় রাফির সব লজ্জা ভেঙে গেল—সমাজের চাপানো অহংকার ছেড়ে সে নিজেকে নতুন করে গড়ল।',
    slotStartSec: 50.20,
    slotEndSec: 57.85,
    startFrame: 1506,
    endFrame: 1735,
  },
  // Scene 7 (58–67s | 1740–2010f)
  {
    id: 's07_01',
    sceneId: 7,
    speaker: 'narrator',
    text: 'চার বছরের ডিগ্রি যা দিতে পারেনি, মাত্র ৬০ দিনের বাস্তব দক্ষতা তাকে তার চেয়েও বড় সম্মান এনে দিল।',
    slotStartSec: 58.20,
    slotEndSec: 66.85,
    startFrame: 1746,
    endFrame: 2005,
  },
  // Scene 8 (67–75s | 2010–2250f)
  {
    id: 's08_01',
    sceneId: 8,
    speaker: 'narrator',
    text: 'রবার্ট গ্রিনের ২৫ নম্বর নিয়ম বলে—সমাজের চাপানো ভূমিকা মেনে নিও না, নিজেকে নতুন করে গড়ো।',
    slotStartSec: 67.20,
    slotEndSec: 74.85,
    startFrame: 2016,
    endFrame: 2245,
  },
  // Scene 9 (75–83s | 2250–2490f)
  {
    id: 's09_01',
    sceneId: 9,
    speaker: 'chacha',
    text: 'রাফি বাবা, তুই ছাড়া আর কারো হাতে এসি দিমু না!',
    slotStartSec: 75.20,
    slotEndSec: 78.90,
    startFrame: 2256,
    endFrame: 2367,
  },
  {
    id: 's09_02',
    sceneId: 9,
    speaker: 'rafi',
    text: 'টাকা লাগবে না চাচা—শুধু এক কাপ চা দিয়েন।',
    slotStartSec: 79.10,
    slotEndSec: 82.85,
    startFrame: 2373,
    endFrame: 2485,
  },
  // Scene 10 (83–90s | 2490–2700f)
  {
    id: 's10_01',
    sceneId: 10,
    speaker: 'narrator',
    text: 'যে রাফি একটা চাকরি পায়নি, আজ সে চারজনকে চাকরি দেয়! আপনাকেও কি আত্মীয়রা খোঁটা দেয়? কমেন্টে লিখুন, আর ফলো করুন @sakibexplains.bn!',
    slotStartSec: 83.15,
    slotEndSec: 89.80,
    startFrame: 2495,
    endFrame: 2694,
  },
] as const;

export interface AudioTimingManifest {
  generatedAt: string;
  engine: string;
  durationSec: number;
  cues: Array<{
    id: string;
    speaker: SpeakerId;
    startSec: number;
    endSec: number;
    startFrame: number;
    endFrame: number;
  }>;
}

/**
 * Merge measured audio timings into dialogue cues so subtitles and lip-sync
 * lock frame-for-frame to real rendered speech timestamps.
 */
export function resolveDialogueCues(
  manifest?: AudioTimingManifest | null
): DialogueCue[] {
  if (!manifest || !Array.isArray(manifest.cues) || manifest.cues.length === 0) {
    return DEFAULT_DIALOGUE_CUES.map((c) => ({ ...c }));
  }

  const byId = new Map(manifest.cues.map((c) => [c.id, c]));
  return DEFAULT_DIALOGUE_CUES.map((base) => {
    const measured = byId.get(base.id);
    if (!measured) return { ...base };
    const startFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(measured.startFrame)));
    const endFrame = Math.max(startFrame + 1, Math.min(TOTAL_FRAMES, Math.round(measured.endFrame)));
    return {
      ...base,
      startFrame,
      endFrame,
    };
  });
}

export function getActiveScene(frame: number): SceneDefinition {
  const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.floor(frame)));
  for (const scene of SCENES) {
    if (clamped >= scene.startFrame && clamped < scene.endFrame) {
      return scene;
    }
  }
  return SCENES[SCENES.length - 1];
}

export function getActiveCue(
  frame: number,
  cues: readonly DialogueCue[] = DEFAULT_DIALOGUE_CUES
): DialogueCue | null {
  for (const cue of cues) {
    if (frame >= cue.startFrame && frame < cue.endFrame) {
      return cue;
    }
  }
  return null;
}

export function isCharacterSpeaking(
  speaker: SpeakerId,
  frame: number,
  cues: readonly DialogueCue[] = DEFAULT_DIALOGUE_CUES
): boolean {
  const cue = getActiveCue(frame, cues);
  return cue !== null && cue.speaker === speaker;
}

/**
 * 4-shape lip-sync cadence (`Math.floor(frame / 4) % 4`) active ONLY during spoken frames.
 * Returns -1 when silent.
 */
export function getLipSyncShape(
  speaker: SpeakerId,
  frame: number,
  cues: readonly DialogueCue[] = DEFAULT_DIALOGUE_CUES
): number {
  if (!isCharacterSpeaking(speaker, frame, cues)) {
    return -1;
  }
  return Math.floor(frame / 4) % 4;
}

/**
 * Enforces the Arm Rotation Polarity Law for downward-hanging SVG arms:
 * - Left arm (x = -68): strictly >= 0 degrees (positive rotates clockwise LEFT/OUTWARD/UP)
 * - Right arm (x = +68): strictly <= 0 degrees (negative rotates counter-clockwise RIGHT/OUTWARD/UP)
 */
export function enforceArmPolarity(
  leftArmAngle: number,
  rightArmAngle: number
): { leftArmAngle: number; rightArmAngle: number } {
  return {
    leftArmAngle: Math.max(0, Math.min(155, leftArmAngle)),
    rightArmAngle: Math.min(0, Math.max(-155, rightArmAngle)),
  };
}

/**
 * Validates that scenes tile 0..TOTAL_FRAMES with zero gaps and zero overlaps.
 */
export function validateTimelineTiling(
  scenes: readonly SceneDefinition[] = SCENES,
  totalFrames: number = TOTAL_FRAMES
): { valid: boolean; reason?: string } {
  if (scenes.length === 0) {
    return { valid: false, reason: 'No scenes defined' };
  }
  if (scenes[0].startFrame !== 0) {
    return { valid: false, reason: `First scene starts at ${scenes[0].startFrame}, expected 0` };
  }
  for (let i = 0; i < scenes.length; i++) {
    const cur = scenes[i];
    if (cur.endFrame <= cur.startFrame) {
      return { valid: false, reason: `Scene ${cur.id} has non-positive duration` };
    }
    if (i > 0) {
      const prev = scenes[i - 1];
      if (cur.startFrame !== prev.endFrame) {
        return {
          valid: false,
          reason: `Gap or overlap between scene ${prev.id} (${prev.endFrame}) and scene ${cur.id} (${cur.startFrame})`,
        };
      }
    }
  }
  const last = scenes[scenes.length - 1];
  if (last.endFrame !== totalFrames) {
    return {
      valid: false,
      reason: `Last scene ends at ${last.endFrame}, expected ${totalFrames}`,
    };
  }
  return { valid: true };
}
