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
 * Scene 07 (0:58 - 1:07 | Frames 1740-2010): "৪ বছর বনাম ৬০ দিন" — UNIQUE LAW 25 VISUAL METAPHOR!
 * Replaces generic bar charts with a meticulous editorial 2D metaphor tailored to Law 25 ("Re-Create Yourself"):
 *  - LEFT PANEL ("৪ বছর — শুধু ডিগ্রির অহংকার"): A GILDED PAPER CAGE hanging from taut marionette
 *    puppet strings, weighed down by an oversized diploma scroll & graduation cap sinking into red rejection slips ("০ টাকা আয়").
 *  - RIGHT PANEL ("৬০ দিন — বাস্তব দক্ষতা"): A CRAFTSMAN'S IDENTITY FORGE — heavy steel anvil &
 *    animated forging hammer striking bright emerald-gold sparks to forge a rising Founder Shield & Wrench-Gear Emblem!
 *  - LOWER DIAGRAM (y: 924..1326): Snapped puppet strings curl away as emerald ("বাস্তব দক্ষতা") &
 *    gold ("নতুন পরিচয়") drafting circles interlock into "আসল ক্ষমতা = নিজেকে নতুন রূপে গড়া".
 */
export const Scene07Comparison: React.FC<SceneProps> = ({ frame, localFrame }) => {
  const { fps } = useVideoConfig();

  const headerPop = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 185 },
  });

  // Left cage gently sways and sinks slightly under the heavy pride of paper diploma
  const cageSway = Math.sin(frame * 0.06) * 4.5;
  const cageSinkY = interpolate(localFrame, [15, 110], [0, 26], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Right forging hammer cyclical realistic strike animation (every 34 frames)
  const strikeCycle = localFrame % 34;
  const hammerAngle = interpolate(
    strikeCycle,
    [0, 14, 18, 22, 34],
    [-46, -54, 4, -18, -46],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const sparkBurst = interpolate(
    strikeCycle,
    [17, 20, 30],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Forged founder emblem rises proudly out of the anvil
  const emblemRise = spring({
    frame: Math.max(0, localFrame - 24),
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  // Interlocking Law 25 synthesis rings converge smoothly
  const vennShift = interpolate(localFrame, [72, 130], [74, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const coreReveal = spring({
    frame: Math.max(0, localFrame - 122),
    fps,
    config: { damping: 14, stiffness: 190 },
  });

  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden', background: '#0E141E' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <pattern id="s7-grid" width={40} height={40} patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1B283A" strokeWidth={1.1} />
          </pattern>
        </defs>

        <rect x={0} y={0} width={1080} height={1920} fill="#0E141E" />
        <rect x={0} y={0} width={1080} height={1920} fill="url(#s7-grid)" opacity={0.8} />

        {/* TOP EDITORIAL COMPARISON BANNER (strictly inside safe zone x: 74..926, y: 184..274) */}
        <g transform={`translate(74, 186) scale(${0.95 + 0.05 * headerPop})`}>
          <rect x={5} y={5} width={852} height={84} rx={12} fill="#05080D" opacity={0.55} />
          <rect x={0} y={0} width={852} height={84} rx={12} fill="#152233" stroke="#D4AF37" strokeWidth={2.8} />
          <text x={426} y={54} textAnchor="middle" fill="#FFFDF7" fontFamily={BENGALI_FONT} fontSize={36} fontWeight={700}>
            ৪ বছর <tspan fill="#E05A47">বনাম</tspan> <tspan fill="#2EC4B6">৬০ দিন</tspan> · আসল পার্থক্য
          </text>
        </g>

        {/* ================= LEFT PANEL: GILDED PAPER CAGE ON PUPPET STRINGS ("৪ বছর") ================= */}
        <g transform="translate(74, 300)">
          <rect x={6} y={6} width={408} height={592} rx={16} fill="#06090F" opacity={0.55} />
          <rect x={0} y={0} width={408} height={592} rx={16} fill="#1C1418" stroke="#C23A2B" strokeWidth={3} />

          {/* Panel Header */}
          <rect x={14} y={14} width={380} height={64} rx={10} fill="#361619" stroke="#E05A47" strokeWidth={1.8} />
          <text x={204} y={55} textAnchor="middle" fill="#FFE0DC" fontFamily={BENGALI_FONT} fontSize={30} fontWeight={700}>
            ৪ বছর · শুধু ডিগ্রি
          </text>

          {/* Overhead Marionette Puppet Crossbar */}
          <g transform="translate(204, 114)">
            <rect x={-96} y={-8} width={192} height={16} rx={4} fill="#6E492D" stroke="#24150B" strokeWidth={2} />
            <text x={0} y={-16} textAnchor="middle" fill="#C9928B" fontFamily={BENGALI_FONT} fontSize={18} fontWeight={600}>
              সমাজের বাঁধা খাঁচা
            </text>
          </g>

          {/* Hanging Gilded Paper Cage swaying & sinking */}
          <g transform={`translate(204, ${122 + cageSinkY}) rotate(${cageSway})`}>
            {/* Taut crimson puppet strings */}
            <line x1={-66} y1={0} x2={-58} y2={98} stroke="#E05A47" strokeWidth={2.5} strokeDasharray="5 4" />
            <line x1={0} y1={0} x2={0} y2={84} stroke="#E05A47" strokeWidth={2.5} strokeDasharray="5 4" />
            <line x1={66} y1={0} x2={58} y2={98} stroke="#E05A47" strokeWidth={2.5} strokeDasharray="5 4" />

            {/* Gilded Cage Dome & Vertical Bars */}
            <path d="M -98 110 C -98 54, 98 54, 98 110 L 98 264 L -98 264 Z" fill="#29171B" stroke="#C69B38" strokeWidth={4} />
            {[-62, -24, 24, 62].map((bx) => (
              <line key={bx} x1={bx} y1={68} x2={bx} y2={264} stroke="#B88E2B" strokeWidth={3} opacity={0.75} />
            ))}
            <line x1={-98} y1={174} x2={98} y2={174} stroke="#C69B38" strokeWidth={2.5} />

            {/* Inside Cage: Trapped Oversized Diploma Scroll + Heavy Graduation Cap */}
            <g transform="translate(0, 186)">
              <rect x={-56} y={-22} width={112} height={44} rx={8} fill="#F2E7D0" stroke="#7A5A2B" strokeWidth={2.4} />
              <rect x={-10} y={-24} width={20} height={48} fill="#9E2A2B" />
              {/* Graduation cap perched on top */}
              <polygon points="0,-64 58,-44 0,-24 -58,-44" fill="#1E293B" stroke="#94A3B8" strokeWidth={2} />
              <line x1={46} y1={-40} x2={56} y2={-10} stroke="#D4AF37" strokeWidth={3} />
            </g>

            {/* Padlock on cage */}
            <rect x={-16} y={248} width={32} height={26} rx={4} fill="#E05A47" stroke="#3D110D" strokeWidth={2} />
            <path d="M -9 248 L -9 238 A 9 9 0 0 1 9 238 L 9 248" fill="none" stroke="#CBD5E1" strokeWidth={3} />
          </g>

          {/* Pile of Red Rejection Slips at bottom of Left Panel */}
          <g transform="translate(36, 444)">
            <g transform="translate(0, 14) rotate(-8)">
              <rect x={0} y={0} width={104} height={36} rx={4} fill="#F5EBDC" stroke="#7A2622" strokeWidth={1.8} />
              <text x={52} y={24} textAnchor="middle" fill="#C23A2B" fontFamily={BENGALI_FONT} fontSize={18} fontWeight={700}>✕ বাদ</text>
            </g>
            <g transform="translate(106, 6) rotate(5)">
              <rect x={0} y={0} width={116} height={36} rx={4} fill="#F5EBDC" stroke="#7A2622" strokeWidth={1.8} />
              <text x={58} y={24} textAnchor="middle" fill="#C23A2B" fontFamily={BENGALI_FONT} fontSize={17} fontWeight={700}>✕ বয়স শেষ</text>
            </g>
            <g transform="translate(226, 12) rotate(-5)">
              <rect x={0} y={0} width={108} height={36} rx={4} fill="#F5EBDC" stroke="#7A2622" strokeWidth={1.8} />
              <text x={54} y={24} textAnchor="middle" fill="#C23A2B" fontFamily={BENGALI_FONT} fontSize={17} fontWeight={700}>✕ ৪১ ফেল</text>
            </g>
          </g>

          {/* Bottom Metric Pill */}
          <rect x={24} y={512} width={360} height={58} rx={10} fill="#361418" stroke="#E05A47" strokeWidth={2} />
          <text x={204} y={550} textAnchor="middle" fill="#FF9E91" fontFamily={BENGALI_FONT} fontSize={26} fontWeight={700}>
            আয়: ০ টাকা · অহংকারের খাঁচা
          </text>
        </g>

        {/* ================= RIGHT PANEL: CRAFTSMAN'S IDENTITY FORGE ("৬০ দিন") ================= */}
        <g transform="translate(518, 300)">
          <rect x={6} y={6} width={408} height={592} rx={16} fill="#06090F" opacity={0.55} />
          <rect x={0} y={0} width={408} height={592} rx={16} fill="#10252C" stroke="#2EC4B6" strokeWidth={3.2} />

          {/* Panel Header */}
          <rect x={14} y={14} width={380} height={64} rx={10} fill="#123B40" stroke="#2EC4B6" strokeWidth={1.8} />
          <text x={204} y={55} textAnchor="middle" fill="#D5FCF7" fontFamily={BENGALI_FONT} fontSize={30} fontWeight={700}>
            ৬০ দিন · বাস্তব দক্ষতা
          </text>

          {/* RISING FORGED FOUNDER SHIELD & WRENCH-GEAR EMBLEM */}
          <g transform={`translate(204, ${234 - emblemRise * 32}) scale(${0.84 + 0.16 * emblemRise})`}>
            {/* Editorial starburst behind newly forged emblem */}
            <circle cx={0} cy={0} r={84} fill="#D4AF37" opacity={0.14} />
            <circle cx={0} cy={0} r={66} fill="#153E45" stroke="#D4AF37" strokeWidth={3.5} />
            {/* Rotating skill gear ring */}
            <circle
              cx={0}
              cy={0}
              r={74}
              fill="none"
              stroke="#2EC4B6"
              strokeWidth={4}
              strokeDasharray="10 8"
              transform={`rotate(${frame * 1.1})`}
            />
            {/* Shield + crossed wrench & upward growth arrow */}
            <path d="M 0 -44 L 38 -26 L 34 18 Q 0 46 -34 18 L -38 -26 Z" fill="#1F5E5B" stroke="#F6DC8C" strokeWidth={3} />
            <path d="M -14 14 L 14 -14 M 0 -16 L 16 -16 L 16 0" fill="none" stroke="#F6DC8C" strokeWidth={5} strokeLinecap="round" />
            <text x={0} y={102} textAnchor="middle" fill="#F7DC88" fontFamily={BENGALI_FONT} fontSize={23} fontWeight={700}>
              নিজের প্রতিষ্ঠান ও সম্মান
            </text>
          </g>

          {/* STEEL BLACKSMITH ANVIL AT BASE OF FORGE */}
          <g transform="translate(204, 424)">
            {/* Anvil horn & face */}
            <path
              d="M -120 -26 L -48 -36 L 94 -36 L 106 -14 L 54 6 L 62 44 L 96 58 L -86 58 L -52 44 L -46 6 L -92 -4 Z"
              fill="#334155"
              stroke="#0F172A"
              strokeWidth={3}
            />
            {/* Crisp flat 2D cel highlight along anvil top */}
            <polygon points="-48,-36 94,-36 100,-24 -52,-24" fill="#64748B" />
            {/* Glowing hot golden-teal identity bar being forged on top of anvil */}
            <rect x={-36} y={-48} width={88} height={14} rx={4} fill="#F7DC88" stroke="#D4AF37" strokeWidth={2} />
          </g>

          {/* ANIMATED FORGING HAMMER STRIKING THE ANVIL */}
          <g transform={`translate(292, 368) rotate(${hammerAngle})`}>
            {/* Wooden handle */}
            <rect x={-96} y={-7} width={114} height={14} rx={4} fill="#8C5832" stroke="#2D1A0C" strokeWidth={2.2} />
            {/* Heavy forged iron hammerhead */}
            <rect x={-114} y={-24} width={40} height={48} rx={5} fill="#475569" stroke="#0F172A" strokeWidth={2.5} />
            <rect x={-114} y={-24} width={40} height={12} rx={3} fill="#94A3B8" />
          </g>

          {/* FLYING EMERALD-GOLD FORGE SPARKS ON HAMMER IMPACT */}
          {sparkBurst > 0.05 && (
            <g transform="translate(200, 376)" opacity={sparkBurst}>
              {[
                [-68, -42],
                [-44, -68],
                [-14, -76],
                [26, -64],
                [58, -46],
                [-76, -12],
                [66, -18],
              ].map(([sx, sy], i) => (
                <g key={i}>
                  <line
                    x1={sx * 0.35}
                    y1={sy * 0.35}
                    x2={sx * (0.7 + (1 - sparkBurst) * 0.5)}
                    y2={sy * (0.7 + (1 - sparkBurst) * 0.5)}
                    stroke={i % 2 === 0 ? '#F7DC88' : '#2EC4B6'}
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                  <circle
                    cx={sx * (0.75 + (1 - sparkBurst) * 0.5)}
                    cy={sy * (0.75 + (1 - sparkBurst) * 0.5)}
                    r={4}
                    fill="#FFFBE6"
                  />
                </g>
              ))}
            </g>
          )}

          {/* Bottom Metric Pill */}
          <rect x={24} y={512} width={360} height={58} rx={10} fill="#103B3D" stroke="#2EC4B6" strokeWidth={2.2} />
          <text x={204} y={550} textAnchor="middle" fill="#9BF4EA" fontFamily={BENGALI_FONT} fontSize={26} fontWeight={700}>
            নিজের ব্যবসা · ৪ জনের কর্মসংস্থান
          </text>
        </g>

        {/* ================= LOWER LAW 25 SYNTHESIS DIAGRAM (strictly inside y: 924..1326) ================= */}
        <g transform="translate(74, 926)">
          <rect x={6} y={6} width={852} height={402} rx={16} fill="#06090F" opacity={0.5} />
          <rect x={0} y={0} width={852} height={402} rx={16} fill="#121C29" stroke="#364B63" strokeWidth={2.6} />

          <text x={426} y={46} textAnchor="middle" fill="#9AA4B2" fontFamily={BENGALI_FONT} fontSize={23} fontWeight={700}>
            LAW 25 · RE-CREATE YOURSELF
          </text>

          {/* Interlocking Architectural Drafting Circles */}
          <g transform="translate(426, 206)">
            {/* Left Circle: বাস্তব দক্ষতা */}
            <g transform={`translate(${-138 - vennShift}, 0)`}>
              <circle cx={0} cy={0} r={126} fill="#124246" fillOpacity={0.72} stroke="#2EC4B6" strokeWidth={4} />
              <circle cx={0} cy={0} r={112} fill="none" stroke="#8EF0E6" strokeWidth={1.4} strokeDasharray="6 6" opacity={0.6} />
              <text x={-36} y={-8} textAnchor="middle" fill="#D5FCF7" fontFamily={BENGALI_FONT} fontSize={30} fontWeight={700}>
                বাস্তব
              </text>
              <text x={-36} y={32} textAnchor="middle" fill="#D5FCF7" fontFamily={BENGALI_FONT} fontSize={30} fontWeight={700}>
                দক্ষতা
              </text>
            </g>

            {/* Right Circle: নতুন পরিচয় */}
            <g transform={`translate(${138 + vennShift}, 0)`}>
              <circle cx={0} cy={0} r={126} fill="#3F3114" fillOpacity={0.72} stroke="#D4AF37" strokeWidth={4} />
              <circle cx={0} cy={0} r={112} fill="none" stroke="#F7DC88" strokeWidth={1.4} strokeDasharray="6 6" opacity={0.6} />
              <text x={36} y={-8} textAnchor="middle" fill="#FFF3CC" fontFamily={BENGALI_FONT} fontSize={30} fontWeight={700}>
                নতুন
              </text>
              <text x={36} y={32} textAnchor="middle" fill="#FFF3CC" fontFamily={BENGALI_FONT} fontSize={30} fontWeight={700}>
                পরিচয়
              </text>
            </g>

            {/* Center Synthesis Core Badge */}
            <g transform={`scale(${0.7 + 0.3 * coreReveal})`} opacity={coreReveal}>
              <circle cx={0} cy={0} r={54} fill="#0F1C26" stroke="#F6DC8C" strokeWidth={3.5} />
              <text x={0} y={-4} textAnchor="middle" fill="#F6DC8C" fontFamily={BENGALI_FONT} fontSize={23} fontWeight={700}>
                আসল
              </text>
              <text x={0} y={24} textAnchor="middle" fill="#8EF0E6" fontFamily={BENGALI_FONT} fontSize={23} fontWeight={700}>
                ক্ষমতা
              </text>
            </g>
          </g>

          {/* Bottom Synthesis Equation Strip */}
          <rect x={44} y={336} width={764} height={48} rx={8} fill="#192838" stroke="#D4AF37" strokeWidth={2} />
          <text x={426} y={368} textAnchor="middle" fill="#F7DC88" fontFamily={BENGALI_FONT} fontSize={24} fontWeight={700}>
            আসল ক্ষমতা = পুরোনো খাঁচা ভেঙে নিজেকে নতুন রূপে গড়া
          </text>
        </g>
      </svg>
    </div>
  );
};
