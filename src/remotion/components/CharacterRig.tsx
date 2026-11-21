import React from 'react';
import { enforceArmPolarity } from '../timeline';

export type CharacterId = 'rafi' | 'chacha' | 'baba' | 'ma' | 'sumon';

export type Expression =
  | 'neutral'
  | 'shocked'
  | 'worried'
  | 'smirk'
  | 'angry'
  | 'sad'
  | 'realization'
  | 'happy';

export type HandProp =
  | 'none'
  | 'phone'
  | 'screwdriver'
  | 'certificate'
  | 'envelope'
  | 'earrings'
  | 'teacup';

export interface CharacterRigProps {
  character: CharacterId;
  frame: number;
  x?: number;
  y?: number;
  scale?: number;
  flipX?: boolean;
  expression?: Expression;
  /** 0..3 when speaking, -1 when silent */
  lipSyncShape?: number;
  /** Strictly >= 0 degrees (rotates clockwise LEFT/OUTWARD/UP) */
  leftArmAngle?: number;
  /** Strictly <= 0 degrees (rotates counter-clockwise RIGHT/OUTWARD/UP) */
  rightArmAngle?: number;
  /** Forearm elbow bend angle in degrees (positive bends inward/up on left arm, negative bends inward/up on right arm) */
  leftElbowAngle?: number;
  rightElbowAngle?: number;
  leftProp?: HandProp;
  rightProp?: HandProp;
  /** Rafi costume toggle: flashback light-blue panjabi vs work/founder teal-navy uniform */
  rafiOutfit?: 'flashback' | 'uniform';
  /** Ma gold earrings continuity across Scene 3 (present), Scene 4 (gone), Scene 10 (new) */
  earringsState?: 'present' | 'gone' | 'new';
  /** Optional subtle glistening tears (Scene 2) or sweat drops (Scene 9) */
  glisteningEyes?: boolean;
  sweatDrops?: boolean;
  /** Optional head tilt in degrees */
  headTilt?: number;
  /** Render grounded trousers & shoes for full-body standing/ladder shots */
  showLegs?: boolean;
  /** Unique SVG ID prefix */
  uid?: string;
}

interface Palette {
  skinBase: string;
  skinShadow: string;
  skinHighlight: string;
  ink: string;
  hair: string;
  hairHighlight: string;
  clothBase: string;
  clothShadow: string;
  clothLine: string;
  accent: string;
}

function getPalette(character: CharacterId, rafiOutfit: 'flashback' | 'uniform'): Palette {
  switch (character) {
    case 'rafi':
      return rafiOutfit === 'flashback'
        ? {
            skinBase: '#D99C73',
            skinShadow: '#BA7A52',
            skinHighlight: '#EAB896',
            ink: '#211916',
            hair: '#1B212B',
            hairHighlight: '#3B485C',
            clothBase: '#8AB4D4',
            clothShadow: '#6692B5',
            clothLine: '#426B8B',
            accent: '#E4F1FA',
          }
        : {
            skinBase: '#D99C73',
            skinShadow: '#BA7A52',
            skinHighlight: '#EAB896',
            ink: '#211916',
            hair: '#1B212B',
            hairHighlight: '#3B485C',
            clothBase: '#2A6770',
            clothShadow: '#1A444D',
            clothLine: '#122E36',
            accent: '#D4AF37',
          };
    case 'chacha':
      return {
        skinBase: '#D3956E',
        skinShadow: '#B1734C',
        skinHighlight: '#E5B08C',
        ink: '#231A16',
        hair: '#E5E9F0',
        hairHighlight: '#FFFFFF',
        clothBase: '#EFE6D5',
        clothShadow: '#D7CBB5',
        clothLine: '#A89B82',
        accent: '#6E2632',
      };
    case 'baba':
      return {
        skinBase: '#CF926B',
        skinShadow: '#AC6F49',
        skinHighlight: '#E3AE8A',
        ink: '#241B17',
        hair: '#ECEFF5',
        hairHighlight: '#FFFFFF',
        clothBase: '#F2ECE1',
        clothShadow: '#DAD0BF',
        clothLine: '#B0A38D',
        accent: '#D4AF37',
      };
    case 'ma':
      return {
        skinBase: '#D89A74',
        skinShadow: '#B67854',
        skinHighlight: '#EAB594',
        ink: '#231A17',
        hair: '#1E232C',
        hairHighlight: '#4E596B',
        clothBase: '#1E5E5A',
        clothShadow: '#13423F',
        clothLine: '#0E2E2C',
        accent: '#9E2A2B',
      };
    case 'sumon':
      return {
        skinBase: '#D39268',
        skinShadow: '#AE6F47',
        skinHighlight: '#E6AF8A',
        ink: '#211915',
        hair: '#171D26',
        hairHighlight: '#3C4A5E',
        clothBase: '#336C76',
        clothShadow: '#204A53',
        clothLine: '#15343B',
        accent: '#8CE2D8',
      };
  }
}

/**
 * Hand-crafted 2D editorial prop rendered directly inside the articulated wrist group.
 * Automatically counter-rotates by totalArmRotation so held tools, phones, certificates,
 * and teacups maintain physically plausible orientation with wrapping fingers over them.
 */
function renderHandProp(
  prop: HandProp,
  side: 'left' | 'right',
  totalArmRotation: number
): React.ReactNode {
  if (prop === 'none') return null;
  const dir = side === 'left' ? -1 : 1;
  const uprightRot = -totalArmRotation;

  switch (prop) {
    case 'screwdriver':
      return (
        <g transform={`translate(${dir * 3}, 2) rotate(${uprightRot + dir * 24})`}>
          {/* Detailed 2D fluted technician screwdriver */}
          <rect x={-9} y={-22} width={18} height={44} rx={5} fill="#C23A2B" stroke="#3E110C" strokeWidth={2.2} />
          <line x1={-4} y1={-17} x2={-4} y2={17} stroke="#E87A6D" strokeWidth={2.4} strokeLinecap="round" />
          <line x1={4} y1={-17} x2={4} y2={17} stroke="#7A1C13" strokeWidth={2} strokeLinecap="round" />
          <rect x={-10} y={-29} width={20} height={8} rx={2} fill="#D4AF37" stroke="#5A440B" strokeWidth={1.6} />
          {/* Steel shaft with crisp 2D cel edge */}
          <rect x={-3.2} y={-88} width={6.4} height={59} rx={1.5} fill="#CBD5E1" stroke="#3B4756" strokeWidth={1.6} />
          <line x1={-1} y1={-84} x2={-1} y2={-32} stroke="#FFFFFF" strokeWidth={1.4} opacity={0.8} />
          <polygon points="-5,-86 5,-86 3.2,-98 -3.2,-98" fill="#64748B" stroke="#2D3748" strokeWidth={1.4} />
        </g>
      );
    case 'phone':
      return (
        <g transform={`translate(${dir * 3}, -6) rotate(${uprightRot + dir * 6})`}>
          {/* Detailed 2D smartphone with bezel, notch, live video call UI */}
          <rect x={-21} y={-46} width={42} height={78} rx={8} fill="#181E27" stroke="#475569" strokeWidth={2.2} />
          <rect x={-17} y={-40} width={34} height={64} rx={4} fill="#14323F" />
          {/* Diagonal flat 2D screen glint */}
          <polygon points="-15,-38 6,-38 -15,-12" fill="#4FD1C5" opacity={0.22} />
          <rect x={-7} y={-43} width={14} height={2.5} rx={1.2} fill="#64748B" />
          {/* Live red REC / call dot */}
          <circle cx={9} cy={-31} r={3.4} fill="#E05A47" />
          <rect x={-11} y={14} width={22} height={5} rx={2.5} fill="#2EC4B6" opacity={0.75} />
        </g>
      );
    case 'certificate':
      return (
        <g transform={`translate(${dir * 16}, -22) rotate(${uprightRot})`}>
          {/* Ornate editorial Master's Degree Frame */}
          <rect x={-62} y={-46} width={124} height={92} rx={5} fill="#5E3520" stroke="#2B160C" strokeWidth={2.4} />
          <rect x={-56} y={-40} width={112} height={80} rx={2} fill="none" stroke="#D4AF37" strokeWidth={2.5} />
          <rect x={-51} y={-35} width={102} height={70} rx={2} fill="#FAF3E2" />
          <rect x={-45} y={-29} width={90} height={58} fill="none" stroke="#B68E28" strokeWidth={1.4} strokeDasharray="4 2" />
          {/* Typographic script strokes */}
          <line x1={-32} y1={-16} x2={32} y2={-16} stroke="#2B2118" strokeWidth={3.2} strokeLinecap="round" />
          <line x1={-24} y1={-5} x2={24} y2={-5} stroke="#6E5D4B" strokeWidth={2.2} strokeLinecap="round" />
          <line x1={-28} y1={5} x2={16} y2={5} stroke="#6E5D4B" strokeWidth={2.2} strokeLinecap="round" />
          <line x1={-28} y1={14} x2={4} y2={14} stroke="#8D7B68" strokeWidth={1.8} strokeLinecap="round" />
          {/* Crimson ribbon + gold seal */}
          <polygon points="22,22 25,38 29,28 33,38 36,22" fill="#9E2A2B" />
          <circle cx={29} cy={17} r={9.5} fill="#D4AF37" stroke="#6E4F0E" strokeWidth={1.8} />
          <circle cx={29} cy={17} r={5.5} fill="none" stroke="#FFF4C2" strokeWidth={1.2} />
        </g>
      );
    case 'envelope':
      return (
        <g transform={`translate(${dir * 8}, -4) rotate(${uprightRot})`}>
          <rect x={-38} y={-24} width={76} height={48} rx={3} fill="#E6D5B6" stroke="#6E5636" strokeWidth={2.2} />
          <polyline points="-38,-24 0,4 38,-24" fill="none" stroke="#6E5636" strokeWidth={2} />
          <line x1={-24} y1={10} x2={24} y2={10} stroke="#8C704B" strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    case 'earrings':
      return (
        <g transform={`translate(${dir * 5}, 0) rotate(${uprightRot})`}>
          {/* Ornate Bengali Gold Jhumkas */}
          <g transform="translate(-9, 0)">
            <circle cx={0} cy={-3} r={5} fill="#F4CF57" stroke="#7A560C" strokeWidth={1.5} />
            <path d="M -7 3 Q 0 18 7 3 Z" fill="#D4AF37" stroke="#7A560C" strokeWidth={1.5} />
            <circle cx={-4} cy={14} r={1.8} fill="#FFF3BD" />
            <circle cx={0} cy={16} r={1.8} fill="#FFF3BD" />
            <circle cx={4} cy={14} r={1.8} fill="#FFF3BD" />
          </g>
          <g transform="translate(9, 2)">
            <circle cx={0} cy={-3} r={5} fill="#F4CF57" stroke="#7A560C" strokeWidth={1.5} />
            <path d="M -7 3 Q 0 18 7 3 Z" fill="#D4AF37" stroke="#7A560C" strokeWidth={1.5} />
            <circle cx={-4} cy={14} r={1.8} fill="#FFF3BD" />
            <circle cx={0} cy={16} r={1.8} fill="#FFF3BD" />
            <circle cx={4} cy={14} r={1.8} fill="#FFF3BD" />
          </g>
        </g>
      );
    case 'teacup':
      return (
        <g transform={`translate(${dir * 6}, -12) rotate(${uprightRot})`}>
          {/* Editorial porcelain teacup with saucer, gold rim & layered steam curls */}
          <ellipse cx={0} cy={19} rx={27} ry={6.5} fill="#E6DDD0" stroke="#6E6254" strokeWidth={1.8} />
          <ellipse cx={0} cy={18} rx={18} ry={3.5} fill="#CFC3B2" />
          <path d="M -18 -8 L 18 -8 L 14 14 Q 0 19 -14 14 Z" fill="#FCF9F2" stroke="#6E6254" strokeWidth={1.9} />
          {/* Cel shade on right side of cup */}
          <path d="M 3 -8 L 18 -8 L 14 14 Q 7 17 3 17 Z" fill="#E3D9C8" />
          <line x1={-17} y1={-4} x2={17} y2={-4} stroke="#D4AF37" strokeWidth={2} />
          <path d="M 16 -4 C 28 -4, 28 10, 14 10" fill="none" stroke="#6E6254" strokeWidth={5.2} strokeLinecap="round" />
          <path d="M 16 -4 C 28 -4, 28 10, 14 10" fill="none" stroke="#FCF9F2" strokeWidth={2.6} strokeLinecap="round" />
          <ellipse cx={0} cy={-8} rx={17} ry={4.2} fill="#8C4820" stroke="#5A2B11" strokeWidth={1.2} />
          <path d="M -6 -16 Q -11 -25 -4 -33" fill="none" stroke="#FFF9E8" strokeWidth={2.4} strokeLinecap="round" opacity={0.85} />
          <path d="M 5 -18 Q 10 -27 3 -36" fill="none" stroke="#FFF9E8" strokeWidth={2} strokeLinecap="round" opacity={0.75} />
        </g>
      );
    default:
      return null;
  }
}

/**
 * Sculpted 2D editorial hand with thumb & curled/expressive fingers.
 */
function renderArticulatedHand(
  side: 'left' | 'right',
  palette: Palette,
  hasProp: boolean,
  isSpeakingGesture: boolean
): React.ReactNode {
  const dir = side === 'left' ? -1 : 1;
  return (
    <g>
      {/* Palm base */}
      <path
        d={`M ${-11} -4 C ${-14} 4, ${-12} 14, ${0} 15 C ${12} 14, ${14} 4, ${11} -4 Z`}
        fill={palette.skinBase}
        stroke={palette.ink}
        strokeWidth={1.8}
      />
      {/* Cel shadow inside palm edge */}
      <path
        d={`M ${dir * 2} -3 C ${dir * 10} 2, ${dir * 10} 11, ${0} 14 L ${dir * 2} 14 Z`}
        fill={palette.skinShadow}
        opacity={0.55}
      />
      {/* Articulated fingers: curled when gripping prop, expressive open fingers when gesturing */}
      {hasProp ? (
        <g>
          {/* Wrapping grip fingers over prop */}
          <rect x={-11} y={3} width={22} height={7} rx={3.5} fill={palette.skinBase} stroke={palette.ink} strokeWidth={1.6} />
          <line x1={-4} y1={3.5} x2={-4} y2={9.5} stroke={palette.ink} strokeWidth={1.2} opacity={0.65} />
          <line x1={3} y1={3.5} x2={3} y2={9.5} stroke={palette.ink} strokeWidth={1.2} opacity={0.65} />
          {/* Opposing thumb */}
          <ellipse
            cx={dir * -11}
            cy={-2}
            rx={5.5}
            ry={4}
            transform={`rotate(${dir * 24} ${dir * -11} -2)`}
            fill={palette.skinHighlight}
            stroke={palette.ink}
            strokeWidth={1.6}
          />
        </g>
      ) : (
        <g>
          {/* 4 distinct fingers + opposing thumb */}
          {[-8, -3, 2, 7].map((fx, idx) => (
            <rect
              key={idx}
              x={fx - 2.2}
              y={isSpeakingGesture ? 8 : 7}
              width={4.6}
              height={isSpeakingGesture ? 12 - Math.abs(idx - 1.5) * 1.6 : 9}
              rx={2.3}
              fill={palette.skinBase}
              stroke={palette.ink}
              strokeWidth={1.3}
            />
          ))}
          <path
            d={`M ${dir * -10} -2 Q ${dir * -18} 2 ${dir * -14} 9`}
            fill="none"
            stroke={palette.ink}
            strokeWidth={5.2}
            strokeLinecap="round"
          />
          <path
            d={`M ${dir * -10} -2 Q ${dir * -18} 2 ${dir * -14} 9`}
            fill="none"
            stroke={palette.skinBase}
            strokeWidth={2.8}
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
}

export const CharacterRig: React.FC<CharacterRigProps> = ({
  character,
  frame,
  x = 540,
  y = 1040,
  scale = 1,
  flipX = false,
  expression = 'neutral',
  lipSyncShape = -1,
  leftArmAngle = 14,
  rightArmAngle = -14,
  leftElbowAngle,
  rightElbowAngle,
  leftProp = 'none',
  rightProp = 'none',
  rafiOutfit = 'uniform',
  earringsState = 'present',
  glisteningEyes = false,
  sweatDrops = false,
  headTilt = 0,
  showLegs = false,
  uid,
}) => {
  const idPrefix = uid ?? `char-${character}`;
  const palette = getPalette(character, rafiOutfit);

  // Strict Arm Rotation Polarity Law at the shoulder
  const { leftArmAngle: baseLeftShoulder, rightArmAngle: baseRightShoulder } = enforceArmPolarity(
    leftArmAngle,
    rightArmAngle
  );

  // Subtle organic speech-driven arm & elbow cadence when character is actively speaking
  const isSpeaking = lipSyncShape >= 0;
  const speechGestureWave = isSpeaking ? Math.sin(frame * 0.28) : 0;
  const speechMicroNod = isSpeaking ? Math.sin(frame * 0.22) * 1.8 : 0;

  // Keep shoulder angles strictly honoring polarity even with organic speech micro-motion
  const safeLeftShoulder = Math.max(
    0,
    Math.min(155, baseLeftShoulder + (isSpeaking && leftProp === 'none' ? Math.max(0, speechGestureWave * 6) : 0))
  );
  const safeRightShoulder = Math.min(
    0,
    Math.max(-155, baseRightShoulder - (isSpeaking && rightProp === 'none' ? Math.max(0, -speechGestureWave * 6) : 0))
  );

  // Natural 2-joint elbow articulation:
  // On left arm (+shoulder rotates outward left), POSITIVE elbow bends forearm UPWARD toward face/target.
  // On right arm (-shoulder rotates outward right), NEGATIVE elbow bends forearm UPWARD toward face/target.
  const defaultLeftElbow =
    leftProp !== 'none'
      ? safeLeftShoulder > 70
        ? 44
        : 58
      : isSpeaking
        ? 24 + speechGestureWave * 10
        : 10;
  const defaultRightElbow =
    rightProp !== 'none'
      ? safeRightShoulder < -70
        ? -44
        : -58
      : isSpeaking
        ? -24 + speechGestureWave * 10
        : -10;

  const safeLeftElbow = leftElbowAngle ?? defaultLeftElbow;
  const safeRightElbow = rightElbowAngle ?? defaultRightElbow;

  // Per-character organic breathing & blinking cadence
  const phaseMap: Record<CharacterId, number> = {
    rafi: 0,
    chacha: 1.7,
    baba: 3.1,
    ma: 4.5,
    sumon: 2.3,
  };
  const blinkPeriodMap: Record<CharacterId, number> = {
    rafi: 104,
    chacha: 92,
    baba: 118,
    ma: 108,
    sumon: 96,
  };

  const breathY = Math.sin(frame * 0.08 + phaseMap[character]) * 2.2;
  const blinkMod = (frame + Math.round(phaseMap[character] * 17)) % blinkPeriodMap[character];
  const isBlinking = blinkMod >= blinkPeriodMap[character] - 4;
  const eyeScaleY = isBlinking ? 0.1 : expression === 'shocked' ? 1.14 : 1;

  // Subtle iris gaze offset for realism
  const gazeX = expression === 'smirk' ? 2.2 : expression === 'worried' ? -1.4 : 0;

  // Sculpted expressive eyebrows
  const getBrowPaths = (): { left: string; right: string } => {
    switch (expression) {
      case 'angry':
        return { left: 'M -41 -27 Q -24 -24 -10 -15', right: 'M 10 -15 Q 24 -24 41 -27' };
      case 'worried':
      case 'sad':
        return { left: 'M -41 -16 Q -24 -23 -10 -27', right: 'M 10 -27 Q 24 -23 41 -16' };
      case 'shocked':
        return { left: 'M -41 -29 Q -24 -38 -10 -29', right: 'M 10 -29 Q 24 -38 41 -29' };
      case 'smirk':
        return { left: 'M -40 -22 Q -24 -26 -10 -20', right: 'M 10 -24 Q 25 -35 42 -26' };
      case 'realization':
        return { left: 'M -41 -27 Q -24 -33 -10 -26', right: 'M 10 -26 Q 24 -33 41 -27' };
      case 'happy':
        return { left: 'M -41 -25 Q -24 -32 -10 -25', right: 'M 10 -25 Q 24 -32 41 -25' };
      default:
        return { left: 'M -40 -23 Q -24 -27 -10 -23', right: 'M 10 -23 Q 24 -27 40 -23' };
    }
  };

  const brows = getBrowPaths();

  // Expressive 2D editorial mouths + 4-shape lip-sync
  const renderMouth = (): React.ReactNode => {
    if (lipSyncShape >= 0) {
      switch (lipSyncShape) {
        case 0:
          return (
            <g transform="translate(0, 35)">
              <ellipse cx={0} cy={0} rx={10.5} ry={8.5} fill="#5C1D1E" stroke={palette.ink} strokeWidth={2} />
              <path d="M -6 -5 Q 0 -3 6 -5" fill="none" stroke="#FAF6F0" strokeWidth={2.5} strokeLinecap="round" />
              <ellipse cx={0} cy={4.5} rx={5.5} ry={2.8} fill="#C85D5A" />
            </g>
          );
        case 1:
          return (
            <g transform="translate(0, 34)">
              <path d="M -17 -3 Q 0 15 17 -3 Q 0 -6 -17 -3 Z" fill="#5C1D1E" stroke={palette.ink} strokeWidth={2} />
              <path d="M -12 -3 Q 0 1 12 -3 Z" fill="#FFFDF8" />
              <ellipse cx={0} cy={5} rx={7} ry={3} fill="#C85D5A" />
            </g>
          );
        case 2:
          return (
            <g transform="translate(0, 35)">
              <path d="M -14 0 Q 0 9 14 0 Q 0 -3 -14 0 Z" fill="#632122" stroke={palette.ink} strokeWidth={2} />
              <path d="M -9 -1 Q 0 1.5 9 -1" fill="none" stroke="#FFFDF8" strokeWidth={2} />
            </g>
          );
        default:
          return (
            <g transform="translate(0, 36)">
              <path d="M -13 0 Q 0 4 13 0" fill="none" stroke={palette.ink} strokeWidth={3} strokeLinecap="round" />
              <path d="M -6 5 Q 0 7 6 5" fill="none" stroke={palette.skinShadow} strokeWidth={1.6} strokeLinecap="round" />
            </g>
          );
      }
    }

    switch (expression) {
      case 'happy':
        return (
          <g transform="translate(0, 33)">
            <path d="M -20 -2 Q 0 16 20 -2 Q 0 2 -20 -2 Z" fill="#5C1D1E" stroke={palette.ink} strokeWidth={2} />
            <path d="M -15 -1 Q 0 4.5 15 -1 Z" fill="#FFFDF8" />
            <path d="M -8 10 Q 0 13 8 10" fill="none" stroke={palette.skinShadow} strokeWidth={1.6} strokeLinecap="round" />
          </g>
        );
      case 'smirk':
        return (
          <g>
            <path d="M -14 36 Q 4 38 21 26" fill="none" stroke={palette.ink} strokeWidth={3.2} strokeLinecap="round" />
            <path d="M 19 23 Q 23 26 21 30" fill="none" stroke={palette.skinShadow} strokeWidth={1.8} strokeLinecap="round" />
          </g>
        );
      case 'shocked':
        return (
          <g transform="translate(0, 36)">
            <ellipse cx={0} cy={0} rx={10.5} ry={12.5} fill="#5C1D1E" stroke={palette.ink} strokeWidth={2.2} />
            <path d="M -6 -7 Q 0 -5 6 -7" fill="none" stroke="#FAF6F0" strokeWidth={2.4} strokeLinecap="round" />
          </g>
        );
      case 'worried':
      case 'sad':
        return (
          <g>
            <path d="M -15 40 Q 0 29 15 40" fill="none" stroke={palette.ink} strokeWidth={3} strokeLinecap="round" />
            <path d="M -7 44 Q 0 42 7 44" fill="none" stroke={palette.skinShadow} strokeWidth={1.6} strokeLinecap="round" />
          </g>
        );
      case 'angry':
        return (
          <path d="M -16 39 Q 0 30 16 38" fill="none" stroke={palette.ink} strokeWidth={3.4} strokeLinecap="round" />
        );
      case 'realization':
        return (
          <path d="M -12 35 Q 0 41 14 33" fill="none" stroke={palette.ink} strokeWidth={3} strokeLinecap="round" />
        );
      default:
        return (
          <g>
            <path d="M -13 36 Q 0 39 13 36" fill="none" stroke={palette.ink} strokeWidth={2.8} strokeLinecap="round" />
            <path d="M -5 41 Q 0 43 5 41" fill="none" stroke={palette.skinShadow} strokeWidth={1.5} strokeLinecap="round" />
          </g>
        );
    }
  };

  const isElderMale = character === 'chacha' || character === 'baba';
  const showWristwatch = character === 'rafi' && rafiOutfit === 'uniform';

  return (
    <g id={idPrefix} transform={`translate(${x}, ${y}) scale(${flipX ? -scale : scale}, ${scale})`}>
      {/* Subtle breathing body wrapper */}
      <g transform={`translate(0, ${breathY})`}>
        {/* ARTICULATED 2-JOINT LEFT ARM (Shoulder at -68, 128; strictly >= 0deg clockwise outward/up) */}
        <g transform={`translate(-68, 128) rotate(${safeLeftShoulder})`}>
          {/* Upper sleeve (0,0) -> (0,68) with cel shadow & fabric crease */}
          <path
            d="M -18 -8 C -22 14, -20 44, -15 68 L 15 68 C 19 44, 20 14, 16 -8 Z"
            fill={palette.clothBase}
            stroke={palette.ink}
            strokeWidth={2.2}
          />
          <path d="M 3 4 L 6 66 L 15 66 C 18 42, 19 14, 15 -6 Z" fill={palette.clothShadow} opacity={0.75} />
          {/* Elbow crease tick */}
          <path d="M -10 62 Q 0 67 10 62" fill="none" stroke={palette.clothLine} strokeWidth={2} />

          {/* FOREARM + ELBOW JOINT */}
          <g transform={`translate(0, 66) rotate(${safeLeftElbow})`}>
            {/* Forearm sleeve/cuff (0,0) -> (0,56) */}
            <path
              d="M -14 -4 C -15 18, -13 36, -11 52 L 11 52 C 13 36, 15 18, 14 -4 Z"
              fill={palette.clothBase}
              stroke={palette.ink}
              strokeWidth={2}
            />
            {/* Crisp stitched cuff */}
            <rect x={-12} y={44} width={24} height={9} rx={2.5} fill={palette.clothShadow} stroke={palette.ink} strokeWidth={1.6} />
            {/* Wrist */}
            <rect x={-8.5} y={52} width={17} height={11} rx={4} fill={palette.skinBase} stroke={palette.ink} strokeWidth={1.6} />
            {showWristwatch && (
              <g transform="translate(0, 56)">
                <rect x={-10} y={-3} width={20} height={6} rx={1.5} fill="#252C36" />
                <circle cx={0} cy={0} r={4.5} fill="#E2E8F0" stroke="#475569" strokeWidth={1.4} />
              </g>
            )}
            {/* ARTICULATED HAND + IN-HAND PROP */}
            <g transform="translate(0, 66)">
              {renderHandProp(leftProp, 'left', safeLeftShoulder + safeLeftElbow)}
              {renderArticulatedHand('left', palette, leftProp !== 'none', isSpeaking)}
            </g>
          </g>
        </g>

        {/* ARTICULATED 2-JOINT RIGHT ARM (Shoulder at +68, 128; strictly <= 0deg counter-clockwise outward/up) */}
        <g transform={`translate(68, 128) rotate(${safeRightShoulder})`}>
          <path
            d="M -16 -8 C -20 14, -19 44, -15 68 L 15 68 C 20 44, 22 14, 18 -8 Z"
            fill={palette.clothBase}
            stroke={palette.ink}
            strokeWidth={2.2}
          />
          <path d="M -15 -6 C -19 14, -18 42, -14 66 L -4 66 L -3 4 Z" fill={palette.clothShadow} opacity={0.75} />
          <path d="M -10 62 Q 0 67 10 62" fill="none" stroke={palette.clothLine} strokeWidth={2} />

          {/* FOREARM + ELBOW JOINT */}
          <g transform={`translate(0, 66) rotate(${safeRightElbow})`}>
            <path
              d="M -14 -4 C -15 18, -13 36, -11 52 L 11 52 C 13 36, 15 18, 14 -4 Z"
              fill={palette.clothBase}
              stroke={palette.ink}
              strokeWidth={2}
            />
            <rect x={-12} y={44} width={24} height={9} rx={2.5} fill={palette.clothShadow} stroke={palette.ink} strokeWidth={1.6} />
            <rect x={-8.5} y={52} width={17} height={11} rx={4} fill={palette.skinBase} stroke={palette.ink} strokeWidth={1.6} />
            <g transform="translate(0, 66)">
              {renderHandProp(rightProp, 'right', safeRightShoulder + safeRightElbow)}
              {renderArticulatedHand('right', palette, rightProp !== 'none', isSpeaking)}
            </g>
          </g>
        </g>

        {/* OPTIONAL GROUNDED TROUSERS & EDITORIAL SHOES */}
        {showLegs && (
          <g transform="translate(0, 314)">
            {/* Left leg */}
            <path
              d="M -56 0 L -14 0 L -18 148 L -52 148 Z"
              fill={character === 'chacha' || character === 'baba' ? '#DDD4C3' : '#1E293B'}
              stroke={palette.ink}
              strokeWidth={2.2}
            />
            {/* Right leg */}
            <path
              d="M 14 0 L 56 0 L 52 148 L 18 148 Z"
              fill={character === 'chacha' || character === 'baba' ? '#CFC4B0' : '#162030'}
              stroke={palette.ink}
              strokeWidth={2.2}
            />
            {/* Fabric knee creases */}
            <path d="M -46 72 Q -35 76 -24 72" fill="none" stroke="#000000" strokeOpacity={0.22} strokeWidth={2} />
            <path d="M 24 72 Q 35 76 46 72" fill="none" stroke="#000000" strokeOpacity={0.22} strokeWidth={2} />
            {/* Leather editorial loafers */}
            <path d="M -60 150 C -60 138, -14 138, -12 150 L -12 158 L -60 158 Z" fill="#2A1F18" stroke={palette.ink} strokeWidth={2} />
            <path d="M 12 150 C 14 138, 60 138, 60 150 L 60 158 L 12 158 Z" fill="#211812" stroke={palette.ink} strokeWidth={2} />
            <line x1={-58} y1={155} x2={-14} y2={155} stroke="#5C4433" strokeWidth={2} />
            <line x1={14} y1={155} x2={58} y2={155} stroke="#5C4433" strokeWidth={2} />
          </g>
        )}

        {/* TORSO / METICULOUS 2D EDITORIAL ATTIRE */}
        <g transform="translate(0, 106)">
          <path
            d="M -76 22 C -74 -6, -42 -18, 0 -18 C 42 -18, 74 -6, 76 22 L 84 218 L -84 218 Z"
            fill={palette.clothBase}
            stroke={palette.ink}
            strokeWidth={2.4}
          />
          {/* Crisp 2D cel-shaded right-half shadow plane (flat editorial look, no plastic airbrush) */}
          <path
            d="M 10 -17 C 46 -15, 74 -5, 76 22 L 84 218 L 14 218 L 14 28 Z"
            fill={palette.clothShadow}
            opacity={0.75}
          />
          {/* Subtle tailored waist crease lines */}
          <path d="M -64 132 Q -38 138 -20 132" fill="none" stroke={palette.clothLine} strokeWidth={2} opacity={0.55} />
          <path d="M 24 148 Q 48 154 68 146" fill="none" stroke={palette.clothLine} strokeWidth={2} opacity={0.55} />

          {/* Character-specific attire craftsmanship */}
          {character === 'chacha' && (
            <>
              {/* Maroon vest with crisp cel shading & embroidered gold trim */}
              <path d="M -62 6 C -52 -12, -24 -16, -12 -16 L -12 218 L -74 218 Z" fill="#782937" stroke={palette.ink} strokeWidth={2} />
              <path d="M 62 6 C 52 -12, 24 -16, 12 -16 L 12 218 L 74 218 Z" fill="#5D1D28" stroke={palette.ink} strokeWidth={2} />
              <path d="M -12 -16 L 0 30 L 12 -16" fill="none" stroke="#D4AF37" strokeWidth={2.6} />
              {/* Vest welt pockets */}
              <rect x={-56} y={128} width={30} height={8} rx={2} fill="#4A151E" stroke="#D4AF37" strokeWidth={1.2} />
              <rect x={26} y={128} width={30} height={8} rx={2} fill="#3F1119" stroke="#D4AF37" strokeWidth={1.2} />
              {/* Brass panjabi buttons */}
              {[48, 78, 108, 138].map((by) => (
                <circle key={by} cx={0} cy={by} r={3.6} fill="#D4AF37" stroke="#5A420C" strokeWidth={1.2} />
              ))}
            </>
          )}

          {character === 'baba' && (
            <>
              {/* Crisp traditional cream panjabi collar, stitched placket & pocket */}
              <path d="M -24 -15 L 0 8 L 24 -15" fill="none" stroke="#9B8D76" strokeWidth={3.5} />
              <rect x={-8} y={6} width={16} height={84} rx={3} fill="#E4DBCA" stroke="#9B8D76" strokeWidth={1.8} />
              <line x1={-4} y1={12} x2={-4} y2={84} stroke="#B8AA92" strokeWidth={1} strokeDasharray="3 3" />
              {[26, 48, 70].map((by) => (
                <circle key={by} cx={0} cy={by} r={3} fill="#8F7F66" />
              ))}
              {/* Chest pocket with fountain pen clip */}
              <rect x={24} y={54} width={30} height={34} rx={3} fill="#E4DBCA" stroke="#9B8D76" strokeWidth={1.6} />
              <rect x={32} y={40} width={5} height={18} rx={1.5} fill="#253240" />
              <line x1={34.5} y1={43} x2={34.5} y2={54} stroke="#D4AF37" strokeWidth={1.5} />
            </>
          )}

          {character === 'rafi' && rafiOutfit === 'flashback' && (
            <>
              {/* Light-blue panjabi with stitched collar & embroidered placket */}
              <path d="M -23 -15 L 0 8 L 23 -15" fill="none" stroke="#3F698A" strokeWidth={3.5} />
              <rect x={-8} y={6} width={16} height={84} rx={3} fill="#A3C7E2" stroke="#3F698A" strokeWidth={1.8} />
              {[26, 48, 70].map((by) => (
                <circle key={by} cx={0} cy={by} r={2.8} fill="#2A4D69" />
              ))}
              <rect x={24} y={54} width={30} height={32} rx={3} fill="#7CA7C8" stroke="#3F698A" strokeWidth={1.5} />
            </>
          )}

          {character === 'rafi' && rafiOutfit === 'uniform' && (
            <>
              {/* Crisp technician / founder uniform with folded lapels, stitch line & gold emblem pocket */}
              <polygon points="-24,-16 -4,14 -38,14" fill="#173440" stroke={palette.ink} strokeWidth={1.8} />
              <polygon points="24,-16 4,14 38,14" fill="#132A34" stroke={palette.ink} strokeWidth={1.8} />
              <line x1={0} y1={14} x2={0} y2={216} stroke={palette.ink} strokeWidth={2.4} />
              {/* Button strip */}
              {[42, 82, 122, 162].map((by) => (
                <circle key={by} cx={0} cy={by} r={2.8} fill="#0F2129" />
              ))}
              {/* Pocket with gold founder stripe + clipped voltage tester pen */}
              <rect x={22} y={40} width={36} height={38} rx={4} fill="#183845" stroke="#4CA3AD" strokeWidth={1.8} />
              <line x1={26} y1={50} x2={54} y2={50} stroke="#D4AF37" strokeWidth={3} strokeLinecap="round" />
              <circle cx={40} cy={63} r={5.5} fill="#D4AF37" stroke="#5A440B" strokeWidth={1.2} />
              {/* Clipped pocket pen */}
              <rect x={27} y={24} width={5.5} height={20} rx={1.5} fill="#E05A47" stroke={palette.ink} strokeWidth={1.2} />
            </>
          )}

          {character === 'sumon' && (
            <>
              <polygon points="-22,-16 -4,12 -36,12" fill="#1E4650" stroke={palette.ink} strokeWidth={1.8} />
              <polygon points="22,-16 4,12 36,12" fill="#183840" stroke={palette.ink} strokeWidth={1.8} />
              <line x1={0} y1={12} x2={0} y2={216} stroke={palette.ink} strokeWidth={2.2} />
              <rect x={22} y={44} width={32} height={34} rx={4} fill="#23525C" stroke="#75D1DA" strokeWidth={1.6} />
              {/* Small wrench clipped in Sumon's pocket */}
              <rect x={34} y={28} width={6} height={20} rx={1.5} fill="#CBD5E1" stroke={palette.ink} strokeWidth={1.2} />
            </>
          )}

          {character === 'ma' && (
            <>
              {/* Deep emerald-teal saree with intricately woven crimson-gold zari pallu */}
              <path d="M -68 -6 L 68 188 L 78 218 L -84 218 L -76 22 Z" fill="#184E4B" />
              {/* Saree pleat folds */}
              <line x1={-48} y1={54} x2={16} y2={216} stroke="#0E3432" strokeWidth={2.2} opacity={0.65} />
              <line x1={-28} y1={72} x2={34} y2={216} stroke="#0E3432" strokeWidth={2} opacity={0.5} />
              {/* Crimson & gold woven zari border */}
              <path d="M -68 -8 L 74 186" stroke="#9E2A2B" strokeWidth={24} strokeLinecap="round" />
              <path d="M -68 -8 L 74 186" stroke="#6E1819" strokeWidth={2} strokeDasharray="6 6" />
              <path d="M -75 -16 L 68 178" stroke="#D4AF37" strokeWidth={4} />
              <path d="M -60 -1 L 81 193" stroke="#D4AF37" strokeWidth={3.5} />
              {/* Traditional gold diamond motifs along saree border */}
              {[-45, -18, 10, 38, 62].map((off, idx) => (
                <circle key={idx} cx={off - 14} cy={off * 1.32 + 78} r={3.2} fill="#F7DC79" />
              ))}
              {/* Gold necklace & embroidered blouse neckline */}
              <path d="M -28 -14 Q 0 14 28 -14" fill="none" stroke="#D4AF37" strokeWidth={3.2} />
              <circle cx={0} cy={3} r={3.5} fill="#F7DC79" />
            </>
          )}
        </g>

        {/* NECK WITH ANATOMICAL TENDON & CAST SHADOW */}
        <rect x={-18} y={64} width={36} height={48} rx={12} fill={palette.skinBase} stroke={palette.ink} strokeWidth={2} />
        <path d="M -18 72 Q 0 92 18 72 L 18 89 Q 0 103 -18 89 Z" fill={palette.skinShadow} />
        {/* Subtle clavicle hint */}
        <path d="M -26 102 Q -12 108 -4 104" fill="none" stroke={palette.skinShadow} strokeWidth={2} strokeLinecap="round" />
        <path d="M 26 102 Q 12 108 4 104" fill="none" stroke={palette.skinShadow} strokeWidth={2} strokeLinecap="round" />

        {/* METICULOUS EDITORIAL 2D HEAD GROUP */}
        <g transform={`translate(0, 12) rotate(${headTilt + speechMicroNod})`}>
          {/* Ma's low hair bun with hairpins */}
          {character === 'ma' && (
            <g>
              <circle cx={48} cy={22} r={24} fill={palette.hair} stroke={palette.ink} strokeWidth={2.2} />
              <path d="M 38 10 Q 52 14 58 28" fill="none" stroke="#D4AF37" strokeWidth={2.4} strokeLinecap="round" />
            </g>
          )}

          {/* Sculpted Ears with Outer Helix & Inner Tragus */}
          <g>
            <ellipse cx={-61} cy={8} rx={11} ry={18} fill={palette.skinBase} stroke={palette.ink} strokeWidth={2} />
            <path d="M -64 -2 C -58 -2, -57 14, -63 16" fill="none" stroke={palette.skinShadow} strokeWidth={2} strokeLinecap="round" />
            <ellipse cx={61} cy={8} rx={11} ry={18} fill={palette.skinShadow} stroke={palette.ink} strokeWidth={2} />
            <path d="M 64 -2 C 58 -2, 57 14, 63 16" fill="none" stroke="#854D2E" strokeWidth={2} strokeLinecap="round" />
          </g>

          {/* Ma's Ornate Gold Jhumka Earrings Continuity */}
          {character === 'ma' && earringsState !== 'gone' && (
            <g>
              <g transform="translate(-62, 24)">
                <circle cx={0} cy={0} r={earringsState === 'new' ? 6.5 : 5} fill="#F7D76B" stroke="#7A560C" strokeWidth={1.5} />
                <path
                  d={earringsState === 'new' ? 'M -8 6 Q 0 23 8 6 Z' : 'M -6 5 Q 0 18 6 5 Z'}
                  fill="#D4AF37"
                  stroke="#7A560C"
                  strokeWidth={1.4}
                />
              </g>
              <g transform="translate(62, 24)">
                <circle cx={0} cy={0} r={earringsState === 'new' ? 6.5 : 5} fill="#F7D76B" stroke="#7A560C" strokeWidth={1.5} />
                <path
                  d={earringsState === 'new' ? 'M -8 6 Q 0 23 8 6 Z' : 'M -6 5 Q 0 18 6 5 Z'}
                  fill="#D4AF37"
                  stroke="#7A560C"
                  strokeWidth={1.4}
                />
              </g>
              {earringsState === 'new' && (
                <g opacity={0.75 + 0.25 * Math.sin(frame * 0.28)}>
                  <path d="M -70 16 L -67 22 L -61 24 L -67 26 L -70 32 L -72 26 L -78 24 L -72 22 Z" fill="#FFFBE6" />
                  <path d="M 70 16 L 72 22 L 78 24 L 72 26 L 70 32 L 67 26 L 61 24 L 67 22 Z" fill="#FFFBE6" />
                </g>
              )}
            </g>
          )}

          {/* Sculpted Editorial Head Silhouette with Cheekbone & Jaw Taper */}
          <path
            d="M -59 -14
               C -59 -66, 59 -66, 59 -14
               C 59 18, 52 38, 34 54
               C 20 65, 8 68, 0 68
               C -8 68, -20 65, -34 54
               C -52 38, -59 18, -59 -14 Z"
            fill={palette.skinBase}
            stroke={palette.ink}
            strokeWidth={2.2}
          />
          {/* Crisp Flat 2D Cel-Shadow Plane on Right Cheek & Jaw */}
          <path
            d="M 16 -56 C 46 -48, 59 -30, 59 -14 C 59 18, 52 38, 34 54 C 22 64, 10 67, 4 68 C 20 52, 30 28, 30 -8 C 30 -32, 24 -46, 16 -56 Z"
            fill={palette.skinShadow}
            opacity={0.42}
          />
          {/* Subtle Warm Cheek & Forehead Highlight Plane */}
          <ellipse cx={-34} cy={17} rx={10} ry={5.5} fill="#D96B52" opacity={0.18} />
          <ellipse cx={34} cy={17} rx={10} ry={5.5} fill="#D96B52" opacity={0.14} />

          {/* Age & Expression Character Lines */}
          {(isElderMale || character === 'ma') && (
            <g opacity={0.45}>
              <path d="M -24 -36 Q 0 -40 24 -36" fill="none" stroke={palette.skinShadow} strokeWidth={1.6} strokeLinecap="round" />
              <path d="M -38 14 Q -42 22 -36 28" fill="none" stroke={palette.skinShadow} strokeWidth={1.5} strokeLinecap="round" />
              <path d="M 38 14 Q 42 22 36 28" fill="none" stroke={palette.skinShadow} strokeWidth={1.5} strokeLinecap="round" />
            </g>
          )}

          {/* Detailed Beards with Strands (Cha-cha & Baba) */}
          {character === 'chacha' && (
            <g>
              <path
                d="M -52 14 C -48 54, -22 72, 0 73 C 22 72, 48 54, 52 14 C 41 34, 24 43, 0 43 C -24 43, -41 34, -52 14 Z"
                fill="#E8ECF2"
                stroke="#9EA9B8"
                strokeWidth={1.8}
              />
              {/* Beard texture lines */}
              <path d="M -28 46 L -24 62 M -10 52 L -9 68 M 10 52 L 9 68 M 28 46 L 24 62" stroke="#C0C9D6" strokeWidth={1.8} strokeLinecap="round" />
              <path d="M -22 25 Q 0 18 22 25 Q 10 31 0 26 Q -10 31 -22 25 Z" fill="#F4F7FA" stroke="#B6C0CE" strokeWidth={1.2} />
            </g>
          )}

          {character === 'baba' && (
            <g>
              <path
                d="M -54 12 C -52 58, -26 79, 0 80 C 26 79, 52 58, 54 12 C 42 35, 24 44, 0 44 C -24 44, -42 35, -54 12 Z"
                fill="#F2F4F8"
                stroke="#ABB5C4"
                strokeWidth={1.8}
              />
              <path d="M -30 48 L -24 68 M -12 54 L -10 75 M 12 54 L 10 75 M 30 48 L 24 68" stroke="#CDD5E0" strokeWidth={1.8} strokeLinecap="round" />
              <path d="M -24 24 Q 0 17 24 24 Q 12 31 0 26 Q -12 31 -24 24 Z" fill="#FFFFFF" stroke="#C5CEDB" strokeWidth={1.2} />
            </g>
          )}

          {/* Detailed Nose Bridge, Tip & Nostril */}
          <path d="M -1 -12 L -3 10 C -4 15, 2 18, 8 15" fill="none" stroke={palette.ink} strokeWidth={2.1} strokeLinecap="round" />
          <path d="M 1 -10 L 0 8" fill="none" stroke={palette.skinHighlight} strokeWidth={2.2} strokeLinecap="round" opacity={0.75} />
          <path d="M -6 14 Q -4 16 -2 15" fill="none" stroke={palette.skinShadow} strokeWidth={1.8} strokeLinecap="round" />

          {/* METICULOUS EDITORIAL 2D EYES (Eyelid crease, upper lash, iris ring, dual catchlights, lower lid) */}
          {[-25, 25].map((ex, idx) => {
            const isLeft = idx === 0;
            return (
              <g key={ex} transform={`translate(${ex}, -4)`}>
                {/* Upper eyelid crease line */}
                <path
                  d={isLeft ? 'M -12 -13 Q 0 -17 11 -12' : 'M -11 -12 Q 0 -17 12 -13'}
                  fill="none"
                  stroke={palette.skinShadow}
                  strokeWidth={1.7}
                  strokeLinecap="round"
                />
                <g transform={`scale(1, ${eyeScaleY})`}>
                  {/* Sclera */}
                  <ellipse cx={0} cy={0} rx={12.5} ry={10} fill="#FAF7F0" stroke={palette.ink} strokeWidth={1.8} />
                  {/* Subtle top-eyelid shadow band across upper sclera */}
                  <path d="M -12 -3 Q 0 -9 12 -3 L 11 -7 Q 0 -12 -11 -7 Z" fill="#CBD2DC" opacity={0.55} />
                  {/* Colored iris ring + pupil */}
                  <circle cx={gazeX + (isLeft ? 1 : -1)} cy={0.8} r={6.4} fill="#2B211B" />
                  <circle cx={gazeX + (isLeft ? 1 : -1)} cy={0.8} r={3.6} fill="#111014" />
                  {/* Sharp 2D catchlights */}
                  <circle cx={gazeX + (isLeft ? -1.4 : -3.4)} cy={-2.2} r={2.2} fill="#FFFFFF" />
                  <circle cx={gazeX + (isLeft ? 3.5 : 1.5)} cy={2.6} r={1.1} fill="#FFFFFF" opacity={0.85} />
                  {/* Crisp upper lash line */}
                  <path
                    d={isLeft ? 'M -13 -1 Q 0 -12 13 -1' : 'M -13 -1 Q 0 -12 13 -1'}
                    fill="none"
                    stroke={palette.ink}
                    strokeWidth={character === 'ma' ? 3.2 : 2.5}
                    strokeLinecap="round"
                  />
                </g>
                {/* Under-eye emotional crease / glistening tears */}
                <path d="M -8 12 Q 0 14 8 12" fill="none" stroke={palette.skinShadow} strokeWidth={1.3} opacity={0.6} />
                {glisteningEyes && (
                  <g>
                    <ellipse cx={isLeft ? -3 : 3} cy={8.5} rx={5.8} ry={2.4} fill="#AEEFFF" opacity={0.9} />
                    <circle cx={isLeft ? -5 : 5} cy={12} r={2} fill="#D8F8FF" opacity={0.85} />
                  </g>
                )}
              </g>
            );
          })}

          {/* Baba's Detailed Round Gold Spectacles */}
          {character === 'baba' && (
            <g>
              <circle cx={-25} cy={-4} r={18.5} fill="#FFFFFF" fillOpacity={0.12} stroke="#C99F2A" strokeWidth={2.8} />
              <circle cx={25} cy={-4} r={18.5} fill="#FFFFFF" fillOpacity={0.12} stroke="#C99F2A" strokeWidth={2.8} />
              <path d="M -6.5 -4 Q 0 -8 6.5 -4" fill="none" stroke="#C99F2A" strokeWidth={2.6} />
              {/* Nose pads */}
              <ellipse cx={-7} cy={1} rx={2} ry={3.5} fill="#E6C37A" />
              <ellipse cx={7} cy={1} rx={2} ry={3.5} fill="#E6C37A" />
              {/* Temple arms */}
              <line x1={-43.5} y1={-4} x2={-59} y2={0} stroke="#C99F2A" strokeWidth={2.4} />
              <line x1={43.5} y1={-4} x2={59} y2={0} stroke="#C99F2A" strokeWidth={2.4} />
              {/* Sharp 2D diagonal lens glint */}
              <line x1={-33} y1={-12} x2={-24} y2={-16} stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" opacity={0.75} />
              <line x1={17} y1={-12} x2={26} y2={-16} stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" opacity={0.75} />
            </g>
          )}

          {/* Sculpted Eyebrows */}
          <path d={brows.left} fill="none" stroke={isElderMale ? '#DDE2EA' : palette.hair} strokeWidth={4.4} strokeLinecap="round" />
          <path d={brows.right} fill="none" stroke={isElderMale ? '#DDE2EA' : palette.hair} strokeWidth={4.4} strokeLinecap="round" />

          {/* Mouth / Lip-Sync */}
          {renderMouth()}

          {/* LAYERED 2D EDITORIAL HAIR & HEADWEAR */}
          {character === 'rafi' && (
            <g>
              {/* Sideburns */}
              <path d="M -59 -8 L -55 12 L -61 10 Z" fill={palette.hair} />
              <path d="M 59 -8 L 55 12 L 61 10 Z" fill={palette.hair} />
              {/* Sculpted layered hair silhouette */}
              <path
                d="M -62 -10 C -66 -60, -30 -78, 8 -75 C 46 -73, 66 -46, 62 -10 C 52 -32, 34 -42, 4 -40 C -12 -39, -24 -44, -36 -36 C -48 -32, -54 -22, -62 -10 Z"
                fill={palette.hair}
                stroke="#0F131A"
                strokeWidth={2}
              />
              {/* Crisp 2D hair strand highlight & part */}
              <path d="M -34 -56 Q 0 -66 36 -50" fill="none" stroke={palette.hairHighlight} strokeWidth={4.5} strokeLinecap="round" />
              <path d="M -18 -46 Q 8 -54 30 -42" fill="none" stroke={palette.hairHighlight} strokeWidth={2.5} strokeLinecap="round" opacity={0.75} />
            </g>
          )}

          {character === 'sumon' && (
            <g>
              <path
                d="M -62 -8 L -58 -48 L -40 -74 L -20 -62 L -2 -84 L 18 -64 L 40 -76 L 54 -48 L 62 -10 C 46 -32, 24 -42, 0 -42 C -26 -42, -48 -30, -62 -8 Z"
                fill={palette.hair}
                stroke="#0D1118"
                strokeWidth={2}
              />
              <path d="M -26 -58 Q 2 -68 28 -54" fill="none" stroke={palette.hairHighlight} strokeWidth={4} strokeLinecap="round" />
            </g>
          )}

          {character === 'chacha' && (
            <g>
              <path d="M -60 -6 C -62 -22, -55 -34, -47 -36 L -53 -4 Z" fill="#DDE2E9" stroke="#9EA9B8" strokeWidth={1.2} />
              <path d="M 60 -6 C 62 -22, 55 -34, 47 -36 L 53 -4 Z" fill="#DDE2E9" stroke="#9EA9B8" strokeWidth={1.2} />
              {/* Embroidered White Prayer Cap (#F4F6F8) */}
              <path d="M -56 -28 C -56 -72, 56 -72, 56 -28 Z" fill="#F4F6F8" stroke="#9EA9B8" strokeWidth={2.2} />
              <path d="M 10 -67 C 38 -62, 56 -48, 56 -28 L 16 -28 Z" fill="#E3E8EF" opacity={0.65} />
              <path d="M -56 -28 Q 0 -22 56 -28" fill="none" stroke="#B0BBC8" strokeWidth={3} />
              <path d="M -48 -36 Q 0 -31 48 -36" fill="none" stroke="#D4AF37" strokeWidth={2} strokeDasharray="5 5" />
            </g>
          )}

          {character === 'baba' && (
            <g>
              <path
                d="M -61 -8 C -64 -48, -32 -69, 0 -69 C 32 -69, 64 -48, 61 -8 C 52 -32, 30 -44, 0 -44 C -30 -44, -52 -32, -61 -8 Z"
                fill="#E8EDF3"
                stroke="#A5B0BF"
                strokeWidth={1.8}
              />
              <path d="M -28 -54 Q 0 -62 28 -54" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
            </g>
          )}

          {character === 'ma' && (
            <g>
              <path
                d="M -61 -4 C -64 -54, -30 -72, 0 -72 C 30 -72, 64 -54, 61 -4 C 48 -30, 20 -42, 0 -46 C -20 -42, -48 -30, -61 -4 Z"
                fill={palette.hair}
                stroke="#11151C"
                strokeWidth={2}
              />
              {/* Silver wisdom strands */}
              <path d="M -38 -48 Q -18 -58 -6 -50" fill="none" stroke="#9AA5B5" strokeWidth={2.8} strokeLinecap="round" opacity={0.75} />
              <path d="M 10 -50 Q 26 -58 42 -46" fill="none" stroke={palette.hairHighlight} strokeWidth={3.2} strokeLinecap="round" />
              {/* Center hair part & warm crimson bindi */}
              <line x1={0} y1={-64} x2={0} y2={-46} stroke="#D89A74" strokeWidth={2} />
              <circle cx={0} cy={-16} r={3.8} fill="#9E2A2B" />
            </g>
          )}

          {/* Animated Sweat Drops */}
          {sweatDrops && (
            <g>
              <path
                d={`M -48 ${-18 + ((frame * 1.5) % 20)} Q -53 ${-8 + ((frame * 1.5) % 20)} -48 ${-3 + ((frame * 1.5) % 20)} Q -43 ${-8 + ((frame * 1.5) % 20)} -48 ${-18 + ((frame * 1.5) % 20)} Z`}
                fill="#9BE4F8"
                stroke="#2E7D9E"
                strokeWidth={1.4}
              />
              <path
                d={`M 48 ${-12 + (((frame + 12) * 1.3) % 20)} Q 44 ${-3 + (((frame + 12) * 1.3) % 20)} 48 ${2 + (((frame + 12) * 1.3) % 20)} Q 52 ${-3 + (((frame + 12) * 1.3) % 20)} 48 ${-12 + (((frame + 12) * 1.3) % 20)} Z`}
                fill="#9BE4F8"
                stroke="#2E7D9E"
                strokeWidth={1.4}
              />
            </g>
          )}
        </g>
      </g>
    </g>
  );
};
