import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { BENGALI_FONT } from '../fonts';
import { type DialogueCue } from '../timeline';

interface SceneProps {
  frame: number;
  localFrame: number;
  cues: readonly DialogueCue[];
}

/**
 * Scene 06 (0:50 - 0:58 | Frames 1500-1740): Editorial 2D Side-Profile Neural Cutaway.
 * Law 25 Metaphor: Society's taut marionette puppet strings & cracked mask ("✕ লোকলজ্জার ভয়")
 * visibly SNAP & RECOIL as glowing golden blueprint synapses & interlocking precision gears
 * awaken inside Rafi's mind ("✓ নতুন দক্ষতা ও পরিচয়").
 * Sculpted ear positioned cleanly BELOW the cranial cutaway with generous skin margin.
 * All cards & shards strictly inside safe zone (x <= 920).
 */
export const Scene06BrainCutaway: React.FC<SceneProps> = ({ frame, localFrame }) => {
  const { fps } = useVideoConfig();

  // Puppet strings snap at localFrame 76!
  const snapProgress = interpolate(localFrame, [72, 92], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isSnapped = localFrame >= 76;

  // Editorial shatter cards pop-in
  const fearShardPop = spring({
    frame: Math.max(0, localFrame - 14),
    fps,
    config: { damping: 16, stiffness: 190 },
  });
  const identityShardPop = spring({
    frame: Math.max(0, localFrame - 78),
    fps,
    config: { damping: 14, stiffness: 190 },
  });

  // Rotating internal drafting gears & animated synapse pulse
  const gearRot = (frame * 1.4) % 360;
  const pulsePos = (localFrame * 0.025) % 1;

  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden', background: '#0E1520' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          {/* Editorial architectural blueprint grid */}
          <pattern id="s6-blueprint" width={48} height={48} patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1E3046" strokeWidth={1.2} />
          </pattern>
          <clipPath id="s6-brain-clip">
            <path d="M 226 690 C 228 574, 336 534, 424 558 C 482 574, 510 632, 492 694 C 474 748, 424 762, 366 760 C 296 758, 224 744, 226 690 Z" />
          </clipPath>
        </defs>

        {/* Deep blueprint charcoal background */}
        <rect x={0} y={0} width={1080} height={1920} fill="#0E1520" />
        <rect x={0} y={0} width={1080} height={1920} fill="url(#s6-blueprint)" opacity={0.75} />

        {/* Subtle editorial compass drafting rings behind Rafi's head */}
        <g transform="translate(358, 690)" opacity={0.32}>
          <circle cx={0} cy={0} r={240} fill="none" stroke="#3B5570" strokeWidth={1.6} strokeDasharray="10 8" />
          <circle cx={0} cy={0} r={290} fill="none" stroke="#D4AF37" strokeWidth={1.4} strokeDasharray="4 10" />
        </g>

        {/* TOP EDITORIAL TITLE HEADER (strictly inside safe zone x: 76..924, y: 184..274) */}
        <g transform="translate(76, 186)">
          <rect x={5} y={5} width={848} height={82} rx={12} fill="#05080D" opacity={0.55} />
          <rect x={0} y={0} width={848} height={82} rx={12} fill="#142233" stroke="#D4AF37" strokeWidth={2.6} />
          <text x={424} y={52} textAnchor="middle" fill="#F7DC88" fontFamily={BENGALI_FONT} fontSize={32} fontWeight={700}>
            মানসিক রূপান্তর · সমাজের সুতো ছিঁড়ে ফেলা
          </text>
        </g>

        {/* WOODEN MARIONETTE CONTROL BAR ABOVE HEAD — STRINGS SNAP AT FRAME 76! */}
        <g transform="translate(330, 326)">
          <rect
            x={-110}
            y={-12}
            width={220}
            height={22}
            rx={6}
            fill="#6E492D"
            stroke="#24150B"
            strokeWidth={2.4}
            transform={`rotate(${-6 + snapProgress * -10})`}
          />
          <rect x={-14} y={-24} width={28} height={46} rx={4} fill="#8C5E3A" stroke="#24150B" strokeWidth={2} />
          <text x={0} y={-34} textAnchor="middle" fill="#E08A7C" fontFamily={BENGALI_FONT} fontSize={21} fontWeight={700}>
            সমাজের চাপানো পরিচয়
          </text>

          {/* 3 Puppet Strings descending toward Rafi's mind — taut before frame 76, snapped & recoiling after! */}
          {[-72, 0, 72].map((sx, idx) => {
            const topY = 12;
            const snapY = 112 + idx * 14;
            const recoilGap = snapProgress * 58;
            return (
              <g key={sx}>
                {!isSnapped ? (
                  <line
                    x1={sx}
                    y1={topY}
                    x2={sx * 0.85}
                    y2={215}
                    stroke="#E05A47"
                    strokeWidth={2.8}
                    strokeDasharray="6 4"
                  />
                ) : (
                  <>
                    {/* Upper recoiling curled string */}
                    <path
                      d={`M ${sx} ${topY} Q ${sx + (idx - 1) * 18} ${topY + 42} ${sx - 12} ${snapY - recoilGap}`}
                      fill="none"
                      stroke="#E05A47"
                      strokeWidth={2.6}
                      opacity={0.75}
                    />
                    {/* Lower falling curled string */}
                    <path
                      d={`M ${sx * 0.85} 215 Q ${sx * 0.85 + 16} ${178 + recoilGap * 0.4} ${sx * 0.85 - 10} ${snapY + recoilGap * 0.6}`}
                      fill="none"
                      stroke="#E05A47"
                      strokeWidth={2.4}
                      opacity={Math.max(0.15, 1 - snapProgress * 0.8)}
                    />
                  </>
                )}
              </g>
            );
          })}

          {/* Golden Scissors / Snap Sparks burst at moment of string break */}
          {localFrame >= 72 && localFrame <= 116 && (
            <g
              transform="translate(0, 124)"
              opacity={interpolate(localFrame, [72, 80, 116], [0, 1, 0], { extrapolateRight: 'clamp' })}
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                  key={deg}
                  x1={0}
                  y1={-16}
                  x2={0}
                  y2={-48 - snapProgress * 22}
                  stroke="#F7DC88"
                  strokeWidth={4}
                  strokeLinecap="round"
                  transform={`rotate(${deg})`}
                />
              ))}
            </g>
          )}
        </g>

        {/* METICULOUS EDITORIAL 2D SIDE-PROFILE OF RAFI (facing right, x: 180..540, y: 520..1240) */}
        <g>
          {/* Uniform collar & shoulders */}
          <path
            d="M 164 1144 C 190 1050, 250 1018, 344 1018 C 430 1018, 492 1058, 520 1144 L 540 1320 L 140 1320 Z"
            fill="#2A6770"
            stroke="#102129"
            strokeWidth={3}
          />
          <path d="M 358 1018 L 414 1110 L 456 1052" fill="#173842" stroke="#102129" strokeWidth={2.4} />
          <line x1={382} y1={1112} x2={382} y2={1320} stroke="#102129" strokeWidth={2.6} />

          {/* Anatomical neck */}
          <path
            d="M 272 930 L 272 1044 C 314 1068, 376 1064, 408 1030 L 408 920 Z"
            fill="#C98A62"
            stroke="#211916"
            strokeWidth={2.6}
          />
          <path d="M 294 948 C 328 972, 376 968, 406 942 L 406 984 C 366 1004, 318 996, 294 976 Z" fill="#A86B46" opacity={0.65} />

          {/* Clean side-profile head silhouette facing right (forehead, nose bridge, lips, firm chin) */}
          <path
            d="M 196 710
               C 192 562, 306 508, 412 528
               C 476 540, 514 584, 518 656
               L 522 722
               L 548 776
               C 554 788, 546 798, 526 800
               L 518 814
               C 526 824, 524 834, 514 842
               C 522 850, 520 862, 512 868
               C 514 892, 496 922, 462 936
               C 418 954, 344 958, 286 936
               C 226 912, 198 830, 196 710 Z"
            fill="#D99C73"
            stroke="#211916"
            strokeWidth={3}
          />
          {/* Flat 2D cel shade along back of jaw/cheek */}
          <path
            d="M 198 730 C 204 832, 232 908, 292 934 C 322 946, 358 950, 384 948 C 312 924, 266 862, 256 766 Z"
            fill="#B87A52"
            opacity={0.48}
          />

          {/* Side-profile hair cap */}
          <path
            d="M 192 714
               C 184 560, 296 498, 418 520
               C 476 532, 516 572, 522 614
               C 472 564, 376 544, 280 578
               C 238 592, 224 656, 238 726
               L 272 794
               L 252 802
               C 214 784, 196 754, 192 714 Z"
            fill="#1B212B"
            stroke="#0D1118"
            strokeWidth={2.4}
          />

          {/* Side-profile determined eye & eyebrow */}
          <path d="M 454 708 Q 486 700 506 712" fill="none" stroke="#1B212B" strokeWidth={5} strokeLinecap="round" />
          <path d="M 464 734 Q 486 724 504 736 Q 486 746 464 734 Z" fill="#FAF7F0" stroke="#211916" strokeWidth={2} />
          <circle cx={492} cy={735} r={5.5} fill="#1B212B" />
          <circle cx={490} cy={733} r={2} fill="#FFFFFF" />

          {/* SCULPTED EAR POSITIONED CLEANLY BELOW CRANIAL CUTAWAY (48px+ clean skin margin!) */}
          <g transform="translate(292, 824)">
            <ellipse cx={0} cy={0} rx={19} ry={30} fill="#D99C73" stroke="#211916" strokeWidth={2.4} />
            <path d="M -5 -16 C 8 -14, 10 12, -4 18" fill="none" stroke="#9C603D" strokeWidth={2.6} strokeLinecap="round" />
            <path d="M -2 -4 C 4 -2, 4 6, -2 8" fill="none" stroke="#9C603D" strokeWidth={2} strokeLinecap="round" />
          </g>

          {/* EDITORIAL CRANIAL CUTAWAY WINDOW (y: 554..762 — cleanly above ear y=794!) */}
          <path
            d="M 226 690 C 228 574, 336 534, 424 558 C 482 574, 510 632, 492 694 C 474 748, 424 762, 366 760 C 296 758, 224 744, 226 690 Z"
            fill="#101E2E"
            stroke="#D4AF37"
            strokeWidth={4}
          />

          {/* INSIDE CRANIAL CUTAWAY: Interlocking Precision Gears + Animated Gold/Cyan Neural Pathways */}
          <g clipPath="url(#s6-brain-clip)">
            {/* Subtle glowing blueprint grid inside brain */}
            <rect x={216} y={534} width={296} height={240} fill="#0F2033" />

            {/* Interlocking Gear 1 (Gold — Identity Forge) */}
            <g transform={`translate(316, 660) rotate(${gearRot})`} opacity={isSnapped ? 0.92 : 0.38}>
              <circle cx={0} cy={0} r={42} fill="none" stroke="#D4AF37" strokeWidth={7} strokeDasharray="12 8" />
              <circle cx={0} cy={0} r={28} fill="#173042" stroke="#F6DC8C" strokeWidth={2.5} />
              <circle cx={0} cy={0} r={9} fill="#D4AF37" />
            </g>

            {/* Interlocking Gear 2 (Teal — Real Skill) */}
            <g transform={`translate(404, 628) rotate(${-gearRot * 1.35})`} opacity={isSnapped ? 0.95 : 0.35}>
              <circle cx={0} cy={0} r={34} fill="none" stroke="#2EC4B6" strokeWidth={6.5} strokeDasharray="10 7" />
              <circle cx={0} cy={0} r={21} fill="#102C36" stroke="#8EF0E6" strokeWidth={2.2} />
              <circle cx={0} cy={0} r={7} fill="#2EC4B6" />
            </g>

            {/* Synapse pathways with traveling golden sparks */}
            <path
              d="M 244 700 Q 290 612 362 630 T 474 662"
              fill="none"
              stroke={isSnapped ? '#F6DC8C' : '#E05A47'}
              strokeWidth={3.5}
              strokeLinecap="round"
            />
            <path
              d="M 262 728 Q 344 714 404 686 T 470 614"
              fill="none"
              stroke="#2EC4B6"
              strokeWidth={3}
              strokeLinecap="round"
            />
            {/* Traveling energy nodes */}
            <circle
              cx={256 + pulsePos * 210}
              cy={672 + Math.sin(pulsePos * Math.PI * 2) * 30}
              r={7.5}
              fill="#FFF4C2"
              stroke="#D4AF37"
              strokeWidth={2.5}
            />
            <circle
              cx={468 - pulsePos * 196}
              cy={632 + Math.cos(pulsePos * Math.PI * 2) * 26}
              r={6.5}
              fill="#8EF0E6"
              stroke="#2EC4B6"
              strokeWidth={2}
            />
          </g>
        </g>

        {/* RIGHT SIDE EDITORIAL METAPHOR CARDS (strictly inside safe zone x <= 920) */}
        {/* Card 1: Cracked Society Mask — "✕ লোকলজ্জার ভয়" (breaks & dims after snap!) */}
        <g
          transform={`translate(${574 + snapProgress * 22}, ${496 - snapProgress * 18}) rotate(${snapProgress * 7}) scale(${0.92 + 0.08 * fearShardPop})`}
          opacity={isSnapped ? 0.56 : 1}
        >
          <rect x={5} y={5} width={342} height={154} rx={12} fill="#05080D" opacity={0.5} />
          <rect x={0} y={0} width={342} height={154} rx={12} fill="#2A1316" stroke="#E05A47" strokeWidth={3} />
          {/* Cracked editorial theater mask icon */}
          <g transform="translate(52, 76)">
            <path d="M -26 -24 Q 0 -34 26 -24 L 22 14 Q 0 32 -22 14 Z" fill="#F2E2D0" stroke="#7A2622" strokeWidth={2.2} />
            <circle cx={-10} cy={-6} r={4} fill="#2A1316" />
            <circle cx={10} cy={-6} r={4} fill="#2A1316" />
            <path d="M -10 12 Q 0 4 10 12" fill="none" stroke="#2A1316" strokeWidth={2.5} />
            {/* Crack lightning stroke across mask */}
            <polyline points="4,-28 -6,-6 8,6 -4,26" fill="none" stroke="#E05A47" strokeWidth={3} />
          </g>
          <text x={102} y={66} fill="#FF9E91" fontFamily={BENGALI_FONT} fontSize={27} fontWeight={700}>
            ✕ লোকলজ্জার ভয়
          </text>
          <text x={102} y={102} fill="#D6A8A2" fontFamily={BENGALI_FONT} fontSize={21} fontWeight={600}>
            সমাজের চাপানো অহংকার
          </text>
          {isSnapped && (
            <line x1={96} y1={58} x2={316} y2={58} stroke="#E05A47" strokeWidth={4} strokeLinecap="round" />
          )}
        </g>

        {/* Connector arrow from brain cutaway to new identity card */}
        <path
          d="M 502 686 C 538 716, 542 786, 574 824"
          fill="none"
          stroke="#2EC4B6"
          strokeWidth={3.5}
          strokeDasharray="8 6"
          opacity={identityShardPop}
        />

        {/* Card 2: Forged Blueprint Identity — "✓ নতুন দক্ষতা ও পরিচয়" (clean inner margins inside x <= 936) */}
        <g
          transform={`translate(548, 738) scale(${0.86 + 0.14 * identityShardPop})`}
          opacity={Math.min(1, identityShardPop * 1.25)}
        >
          <rect x={6} y={6} width={384} height={184} rx={14} fill="#05080D" opacity={0.55} />
          <rect x={0} y={0} width={384} height={184} rx={14} fill="#103338" stroke="#2EC4B6" strokeWidth={3.2} />
          {/* Golden compass/wrench emblem */}
          <g transform="translate(46, 86)">
            <circle cx={0} cy={0} r={26} fill="#164B52" stroke="#D4AF37" strokeWidth={2.6} />
            <path d="M -10 10 L 9 -9 M -2 -12 L 12 -12 L 12 2" fill="none" stroke="#F6DC8C" strokeWidth={3.6} strokeLinecap="round" />
          </g>
          <text x={86} y={66} fill="#8EF0E6" fontFamily={BENGALI_FONT} fontSize={24} fontWeight={700}>
            ✓ নতুন দক্ষতা ও পরিচয়
          </text>
          <text x={86} y={102} fill="#D5EEF0" fontFamily={BENGALI_FONT} fontSize={20} fontWeight={600}>
            নিজের হাতে ভাগ্য গড়া
          </text>
          <rect x={86} y={122} width={280} height={38} rx={6} fill="#0A2125" stroke="#D4AF37" strokeWidth={1.6} />
          <text x={226} y={148} textAnchor="middle" fill="#F7DC88" fontFamily={BENGALI_FONT} fontSize={18} fontWeight={700}>
            আইন ২৫ · নিজেকে নতুন রূপে গড়ো
          </text>
        </g>

        {/* Bottom Insight Strip above subtitle safe area (y: 1236..1312) */}
        <g transform="translate(88, 1236)">
          <rect x={0} y={0} width={828} height={74} rx={10} fill="#152334" stroke="#3B5B78" strokeWidth={2.2} />
          <text x={414} y={47} textAnchor="middle" fill="#E6F4F7" fontFamily={BENGALI_FONT} fontSize={26} fontWeight={700}>
            যখন লজ্জার সুতো ছিঁড়ে যায়, তখনই নতুন পরিচয়ের জন্ম হয়
          </text>
        </g>
      </svg>
    </div>
  );
};
