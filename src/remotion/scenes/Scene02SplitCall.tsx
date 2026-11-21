import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { CharacterRig } from '../components/CharacterRig';
import { BENGALI_FONT } from '../fonts';
import { type DialogueCue } from '../timeline';

interface SceneProps {
  frame: number;
  localFrame: number;
  cues: readonly DialogueCue[];
}

/**
 * Scene 02 (0:11 - 0:19 | Frames 330-570): Split-Screen Video Call Stakes.
 * Editorial 2D vertical split (x = 540).
 * Left: Warm home interior (bookshelf, brass table lamp, framed family photo),
 * Baba answering video call with bent elbow + crisp live call card showing Rafi on ladder.
 * Right: Dramatic whip-shift close-up of Rafi with window-slat shadow bars, glistening
 * eyes, and trembling right hand gripping screwdriver strictly inside right panel.
 */
export const Scene02SplitCall: React.FC<SceneProps> = ({ frame, localFrame }) => {
  const { fps } = useVideoConfig();

  const splitReveal = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 170 },
  });

  const rightWhipX = interpolate(localFrame, [0, 18], [90, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tensionPush = interpolate(localFrame, [18, 240], [1, 1.045], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtle trembling tension on Rafi's screwdriver hand
  const handTremble = Math.sin(frame * 0.72) * 2.4;
  const callSec = 6 + Math.floor(localFrame / 30);

  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden', background: '#1B1D24' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <clipPath id="s2-left-half">
            <rect x={0} y={0} width={540} height={1920} />
          </clipPath>
          <clipPath id="s2-right-half">
            <rect x={540} y={0} width={540} height={1920} />
          </clipPath>
        </defs>

        {/* LEFT PANEL: BABA AT HOME ANSWERING VIDEO CALL */}
        <g clipPath="url(#s2-left-half)">
          <rect x={0} y={0} width={540} height={1920} fill="#E9DEC9" />
          {/* Subtle vertical wallpaper stripe pattern */}
          {[40, 120, 200, 280, 360, 440, 520].map((sx) => (
            <line key={sx} x1={sx} y1={0} x2={sx} y2={1320} stroke="#DFD1B8" strokeWidth={18} opacity={0.5} />
          ))}

          {/* Wooden wall bookshelf & vintage family photo frame (cleanly below video call card) */}
          <g transform="translate(54, 540)">
            <rect x={0} y={76} width={220} height={14} rx={3} fill="#6E4A2E" stroke="#2D1B0D" strokeWidth={2} />
            {/* Stacked books on shelf */}
            <rect x={16} y={24} width={20} height={52} rx={2} fill="#2B5B63" stroke="#182C30" strokeWidth={1.6} />
            <rect x={38} y={32} width={18} height={44} rx={2} fill="#9E3B33" stroke="#3D1411" strokeWidth={1.6} />
            <rect x={58} y={20} width={22} height={56} rx={2} fill="#C69B38" stroke="#4D3B10" strokeWidth={1.6} />
            {/* Framed family portrait */}
            <rect x={112} y={4} width={86} height={72} rx={4} fill="#5C3B22" stroke="#26170C" strokeWidth={2} />
            <rect x={120} y={12} width={70} height={56} fill="#F4EAD8" />
            <circle cx={144} cy={34} r={10} fill="#BA7A52" />
            <circle cx={166} cy={38} r={9} fill="#C98A62" />
            <path d="M 130 66 Q 144 48 158 66 Z" fill="#1F5E5B" />
            <path d="M 154 66 Q 166 52 178 66 Z" fill="#89B4D4" />
          </g>

          {/* Warm brass home lamp glow cone */}
          <polygon points="440,582 340,840 530,840" fill="#FFE8A3" opacity={0.22} />
          <g transform="translate(440, 552)">
            <path d="M -26 36 L 26 36 L 18 0 L -18 0 Z" fill="#D4AF37" stroke="#4D3B0D" strokeWidth={2} />
            <rect x={-5} y={36} width={10} height={54} fill="#6E4A2E" stroke="#2D1B0D" strokeWidth={1.6} />
            <rect x={-22} y={88} width={44} height={10} rx={3} fill="#5C3B22" />
          </g>

          {/* Lower wainscoting */}
          <rect x={0} y={1200} width={540} height={720} fill="#D5C4A8" />
          <line x1={0} y1={1200} x2={540} y2={1200} stroke="#8B7355" strokeWidth={4} />

          {/* BABA RIG (shocked, holding smartphone UP with realistic bent elbow) */}
          <CharacterRig
            character="baba"
            frame={frame}
            x={248}
            y={878}
            scale={1.16}
            expression="shocked"
            lipSyncShape={-1}
            leftArmAngle={14}
            leftElbowAngle={14}
            rightArmAngle={-46}
            rightElbowAngle={-68}
            rightProp="phone"
            headTilt={3}
            uid="s2-baba"
          />

          {/* EDITORIAL INSET LIVE VIDEO CALL CARD (cleanly above bookshelf, y: 204..476) */}
          <g transform={`translate(82, ${204 + (1 - splitReveal) * -24})`}>
            <rect x={6} y={6} width={352} height={272} rx={16} fill="#141922" opacity={0.35} />
            <rect x={0} y={0} width={352} height={272} rx={16} fill="#121A24" stroke="#D4AF37" strokeWidth={3} />
            {/* Video feed header */}
            <rect x={14} y={14} width={324} height={40} rx={8} fill="#1E2A38" />
            <circle cx={34} cy={34} r={6} fill="#2EC4B6" />
            <text x={50} y={40} fill="#F8FAFC" fontFamily={BENGALI_FONT} fontSize={21} fontWeight={700}>
              ভিডিও কল · চাচা
            </text>
            <text x={324} y={40} textAnchor="end" fill="#94A3B8" fontFamily="monospace" fontSize={18} fontWeight={700}>
              00:{String(callSec).padStart(2, '0')}
            </text>

            {/* Video viewport showing miniature Rafi on ladder + AC */}
            <rect x={14} y={64} width={324} height={154} rx={8} fill="#EFE2CE" stroke="#334155" strokeWidth={1.6} />
            {/* Miniature AC */}
            <rect x={44} y={76} width={118} height={36} rx={5} fill="#F5F7FA" stroke="#263240" strokeWidth={2} />
            <rect x={56} y={84} width={66} height={18} rx={2} fill="#1F2937" />
            {/* Miniature ladder + Rafi */}
            <line x1={126} y1={134} x2={112} y2={216} stroke="#64748B" strokeWidth={4} />
            <line x1={174} y1={134} x2={188} y2={216} stroke="#64748B" strokeWidth={4} />
            <circle cx={150} cy={126} r={16} fill="#D99C73" stroke="#211916" strokeWidth={1.8} />
            <path d="M 134 122 C 134 108, 166 108, 166 122 Z" fill="#1B212B" />
            <rect x={132} y={142} width={36} height={54} rx={6} fill="#2A6770" stroke="#211916" strokeWidth={1.8} />
            {/* Miniature red screwdriver */}
            <line x1={128} y1={148} x2={104} y2={116} stroke="#C23A2B" strokeWidth={5} strokeLinecap="round" />
            {/* Picture-in-picture Baba mini box */}
            <rect x={256} y={142} width={72} height={68} rx={6} fill="#E5D7BE" stroke="#D4AF37" strokeWidth={2} />
            <circle cx={292} cy={168} r={13} fill="#CF926B" stroke="#241B17" strokeWidth={1.4} />
            <path d="M 276 208 Q 292 184 308 208 Z" fill="#F2ECE1" />

            {/* Call action controls */}
            <circle cx={116} cy={244} r={15} fill="#263547" />
            <circle cx={176} cy={244} r={17} fill="#D64038" />
            <line x1={168} y1={244} x2={184} y2={244} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
            <circle cx={236} cy={244} r={15} fill="#263547" />
          </g>
        </g>

        {/* RIGHT PANEL: DRAMATIC WHIP-SHIFT CLOSE-UP OF RAFI */}
        <g clipPath="url(#s2-right-half)">
          <g transform={`translate(${rightWhipX}, 0)`}>
            <rect x={540} y={0} width={540} height={1920} fill="#1E2836" />
            {/* Moody editorial venetian-blind shadow bars across wall */}
            {[220, 340, 460, 580, 700, 820, 940, 1060].map((by) => (
              <polygon
                key={by}
                points={`540,${by} 1080,${by - 70} 1080,${by - 20} 540,${by + 50}`}
                fill="#111822"
                opacity={0.48}
              />
            ))}
            {/* Subtle AC housing edge visible behind Rafi's upper left */}
            <rect x={560} y={320} width={170} height={86} rx={8} fill="#324152" stroke="#141C26" strokeWidth={2.5} opacity={0.55} />

            {/* RAFI CLOSE-UP (holds screwdriver UP in right hand cleanly inside right panel!) */}
            <g transform={`translate(778, 765) scale(${tensionPush}) translate(-778, -765)`}>
              <CharacterRig
                character="rafi"
                rafiOutfit="uniform"
                frame={frame}
                x={778}
                y={765}
                scale={1.38}
                expression="sad"
                lipSyncShape={-1}
                leftArmAngle={14}
                leftElbowAngle={14}
                rightArmAngle={-42 + handTremble}
                rightElbowAngle={-72 - handTremble}
                rightProp="screwdriver"
                glisteningEyes={true}
                headTilt={4}
                uid="s2-rafi"
              />
            </g>

            {/* Editorial tension badge */}
            <g transform="translate(612, 240)">
              <rect x={4} y={4} width={310} height={58} rx={10} fill="#090D14" opacity={0.55} />
              <rect x={0} y={0} width={310} height={58} rx={10} fill="#2A1215" stroke="#E05A47" strokeWidth={2.4} />
              <text
                x={155}
                y={37}
                textAnchor="middle"
                fill="#FFD8D2"
                fontFamily={BENGALI_FONT}
                fontSize={25}
                fontWeight={700}
              >
                হাতে স্ক্রু ড্রাইভার, চোখে জল
              </text>
            </g>
          </g>
        </g>

        {/* CRISP GOLD EDITORIAL SPLIT-SCREEN DIVIDER (x = 540) */}
        <line x1={540} y1={0} x2={540} y2={1920} stroke="#0B0F16" strokeWidth={12} />
        <line x1={540} y1={0} x2={540} y2={1920} stroke="#D4AF37" strokeWidth={5} />
        {/* Center emblem node */}
        <g transform="translate(540, 620)">
          <circle cx={0} cy={0} r={26} fill="#141A24" stroke="#D4AF37" strokeWidth={3.5} />
          <path d="M -8 -8 L 8 8 M 8 -8 L -8 8" stroke="#E05A47" strokeWidth={3} strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
