import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { CharacterRig } from '../components/CharacterRig';
import { BENGALI_FONT } from '../fonts';
import { getLipSyncShape, type DialogueCue } from '../timeline';

interface SceneProps {
  frame: number;
  localFrame: number;
  cues: readonly DialogueCue[];
}

/**
 * Scene 09 (1:15 - 1:23 | Frames 2250-2490): The Turnaround & Cha-cha's 41°C Summer Call.
 * Part 1 (0..108f): Sunlit Dhaka flagship showroom "রাফি এসি সার্ভিস" with striped emerald-cream
 *                   awning, sparkling glass windows, potted ficus plants, service van edge,
 *                   proud Founder Rafi + animated 3-step milestone checklist.
 * Part 2 (108..240f): Bounded whip-pan to "৪১° সেলসিয়াস" scorching summer split:
 *                     Left: rising mercury thermometer, shimmering heat waves, fault-blinking AC,
 *                           sweating Cha-cha pleading on phone.
 *                     Right: calm Founder Rafi at executive walnut desk with brass nameplate
 *                            "রাফি · প্রতিষ্ঠাতা", notebook, pen & teacup!
 */
export const Scene09Turnaround: React.FC<SceneProps> = ({ frame, localFrame, cues }) => {
  const { fps } = useVideoConfig();

  const chachaLip = getLipSyncShape('chacha', frame, cues);
  const rafiLip = getLipSyncShape('rafi', frame, cues);

  // Smooth bounded horizontal whip-pan from Part 1 (0px) to Part 2 (-1080px)
  const panX = interpolate(localFrame, [98, 114], [0, -1080], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Animated 3-item milestone checklist in Part 1
  const check1 = spring({ frame: Math.max(0, localFrame - 12), fps, config: { damping: 16, stiffness: 200 } });
  const check2 = spring({ frame: Math.max(0, localFrame - 34), fps, config: { damping: 16, stiffness: 200 } });
  const check3 = spring({ frame: Math.max(0, localFrame - 56), fps, config: { damping: 16, stiffness: 200 } });

  // Part 2 mercury thermometer rise & heat shimmer
  const part2Frame = Math.max(0, localFrame - 108);
  const mercuryH = interpolate(part2Frame, [0, 34], [48, 126], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const heatWaveShift = Math.sin(frame * 0.25) * 8;

  // Expressive bent-elbow gestures (+leftElbow / -rightElbow bends UPWARD toward ear)
  const chachaLeftArm = chachaLip >= 0 ? 52 + Math.sin(frame * 0.3) * 6 : 46;
  const rafiRightArm = rafiLip >= 0 ? -48 - Math.sin(frame * 0.22) * 5 : -44;

  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden', background: '#F7EFE0' }}>
      <div
        style={{
          width: 2160,
          height: 1920,
          display: 'flex',
          transform: `translateX(${panX}px)`,
        }}
      >
        {/* ================= PANEL 1 (x: 0..1080): SUNLIT FLAGSHIP "রাফি এসি সার্ভিস" ================= */}
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          {/* Bright morning Dhaka sky */}
          <rect x={0} y={0} width={1080} height={680} fill="#CFE9F2" />
          {/* Crisp flat 2D clouds */}
          <g fill="#FFFDF7" opacity={0.9}>
            <ellipse cx={210} cy={176} rx={78} ry={28} />
            <ellipse cx={256} cy={166} rx={52} ry={24} />
            <ellipse cx={840} cy={210} rx={86} ry={30} />
            <ellipse cx={792} cy={198} rx={54} ry={24} />
          </g>

          {/* Storefront building facade */}
          <rect x={76} y={406} width={928} height={934} fill="#EFE6D5" stroke="#4D3D2B" strokeWidth={3} />

          {/* Flagship Emerald-Gold Signboard ("রাফি এসি সার্ভিস") */}
          <g transform="translate(96, 386)">
            <rect x={6} y={6} width={888} height={134} rx={12} fill="#141C24" opacity={0.35} />
            <rect x={0} y={0} width={888} height={134} rx={12} fill="#10423E" stroke="#D4AF37" strokeWidth={4.5} />
            <rect x={12} y={12} width={864} height={110} rx={6} fill="none" stroke="#7AE0D6" strokeWidth={1.6} strokeDasharray="8 6" />
            <text x={444} y={70} textAnchor="middle" fill="#FFFDF7" fontFamily={BENGALI_FONT} fontSize={50} fontWeight={700}>
              রাফি এসি সার্ভিস
            </text>
            <text x={444} y={108} textAnchor="middle" fill="#F7DC88" fontFamily={BENGALI_FONT} fontSize={23} fontWeight={600}>
              প্রোপ্রাইটর: রাফি · দক্ষ টেকনিশিয়ান টিম · ঢাকা
            </text>
          </g>

          {/* Striped Emerald & Cream Editorial Storefront Awning */}
          <g transform="translate(88, 536)">
            {Array.from({ length: 10 }).map((_, idx) => (
              <path
                key={idx}
                d={`M ${idx * 90} 0 L ${(idx + 1) * 90} 0 L ${(idx + 1) * 90} 72 Q ${idx * 90 + 45} 92 ${idx * 90} 72 Z`}
                fill={idx % 2 === 0 ? '#1A5E57' : '#FAF3E2'}
                stroke="#103632"
                strokeWidth={2}
              />
            ))}
          </g>

          {/* Sparkling Glass Showroom Windows displaying crisp AC units */}
          <rect x={124} y={644} width={410} height={476} rx={8} fill="#BBE0EA" stroke="#2B404E" strokeWidth={4} />
          <polygon points="140,656 260,656 140,860" fill="#FFFFFF" opacity={0.42} />
          <polygon points="300,656 340,656 140,980 140,930" fill="#FFFFFF" opacity={0.28} />
          {/* Display AC units inside showroom window */}
          {[710, 860].map((ay) => (
            <g key={ay} transform={`translate(174, ${ay})`}>
              <rect x={0} y={0} width={286} height={82} rx={8} fill="#FAFBFD" stroke="#2B404E" strokeWidth={2.4} />
              <rect x={24} y={56} width={238} height={12} rx={3} fill="#334155" />
              <rect x={212} y={18} width={48} height={24} rx={4} fill="#0F172A" />
              <text x={236} y={35} textAnchor="middle" fill="#2EC4B6" fontFamily="monospace" fontSize={14} fontWeight={700}>
                18°
              </text>
            </g>
          ))}

          {/* Glass Shop Entrance Door */}
          <rect x={570} y={644} width={384} height={696} rx={6} fill="#D5ECEF" stroke="#2B404E" strokeWidth={4} />
          <line x1={762} y1={644} x2={762} y2={1340} stroke="#2B404E" strokeWidth={4} />
          <rect x={734} y={960} width={12} height={86} rx={4} fill="#D4AF37" stroke="#5A420C" strokeWidth={1.6} />
          <rect x={778} y={960} width={12} height={86} rx={4} fill="#D4AF37" stroke="#5A420C" strokeWidth={1.6} />

          {/* Sidewalk Pavement & Potted Ficus Planter */}
          <rect x={0} y={1340} width={1080} height={580} fill="#C9BEB0" />
          <line x1={0} y1={1340} x2={1080} y2={1340} stroke="#6E6254" strokeWidth={4} />
          {/* Potted plant by entrance */}
          <g transform="translate(128, 1264)">
            <path d="M -30 0 L 30 0 L 22 76 L -22 76 Z" fill="#9E4B32" stroke="#3D1A10" strokeWidth={2.4} />
            <circle cx={0} cy={-38} r={42} fill="#2D7054" stroke="#143B2B" strokeWidth={2.4} />
            <circle cx={-24} cy={-20} r={28} fill="#3B8C68" stroke="#143B2B" strokeWidth={2} />
            <circle cx={24} cy={-24} r={26} fill="#235C44" stroke="#143B2B" strokeWidth={2} />
          </g>

          {/* PROUD FOUNDER RAFI STANDING OUTSIDE HIS SHOP */}
          <g>
            <ellipse cx={748} cy={1396} rx={78} ry={14} fill="#7D7265" opacity={0.45} />
            <CharacterRig
              character="rafi"
              rafiOutfit="uniform"
              frame={frame}
              x={748}
              y={882}
              scale={1.12}
              expression="happy"
              lipSyncShape={-1}
              leftArmAngle={22}
              leftElbowAngle={28}
              rightArmAngle={-24}
              rightElbowAngle={-30}
              showLegs={true}
              uid="s9-rafi-shop"
            />
          </g>

          {/* ANIMATED 3-MILESTONE EDITORIAL CHECKLIST CARD (strictly inside safe zone x: 84..526, y: 186..360) */}
          <g transform="translate(84, 184)">
            <rect x={5} y={5} width={452} height={176} rx={12} fill="#101A22" opacity={0.35} />
            <rect x={0} y={0} width={452} height={176} rx={12} fill="#112A2E" stroke="#D4AF37" strokeWidth={2.8} />
            {[
              { label: '✓ দক্ষতা ও আত্মবিশ্বাস', pop: check1, y: 46 },
              { label: '✓ নিজের প্রতিষ্ঠান ও টিম', pop: check2, y: 98 },
              { label: '✓ মায়ের জন্য নতুন সোনার দুল', pop: check3, y: 150 },
            ].map((item, idx) => (
              <g key={idx} transform={`translate(${(1 - item.pop) * -20}, 0)`} opacity={item.pop}>
                <text x={24} y={item.y} fill={idx === 2 ? '#F7DC88' : '#A4F5EC'} fontFamily={BENGALI_FONT} fontSize={27} fontWeight={700}>
                  {item.label}
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* ================= PANEL 2 (x: 1080..2160): 41°C SUMMER SPLIT — CHA-CHA CALLS FOUNDER RAFI ================= */}
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          <defs>
            <clipPath id="s9-left-half">
              <rect x={0} y={0} width={540} height={1920} />
            </clipPath>
            <clipPath id="s9-right-half">
              <rect x={540} y={0} width={540} height={1920} />
            </clipPath>
          </defs>

          {/* LEFT HALF: 41°C SCORCHING HEAT — BROKEN AC & SWEATING CHA-CHA */}
          <g clipPath="url(#s9-left-half)">
            <rect x={0} y={0} width={540} height={1920} fill="#3E1D17" />
            {/* Shimmering orange heat wave stripes */}
            {[280, 440, 600, 760].map((hy, idx) => (
              <path
                key={hy}
                d={`M -20 ${hy} Q 140 ${hy - 18 + heatWaveShift} 280 ${hy} T 560 ${hy}`}
                fill="none"
                stroke="#E06D47"
                strokeWidth={5}
                opacity={0.22 + (idx % 2) * 0.08}
              />
            ))}

            {/* 41°C Rising Mercury Thermometer Badge (inside safe zone y: 188..372) */}
            <g transform="translate(76, 190)">
              <rect x={4} y={4} width={416} height={172} rx={14} fill="#1A0907" opacity={0.5} />
              <rect x={0} y={0} width={416} height={172} rx={14} fill="#2A110E" stroke="#E05A47" strokeWidth={2.8} />
              {/* Thermometer tube */}
              <g transform="translate(52, 22)">
                <rect x={-10} y={0} width={20} height={116} rx={10} fill="#4D241E" stroke="#F4D8CE" strokeWidth={2.2} />
                <rect x={-6} y={116 - mercuryH * 0.78} width={12} height={mercuryH * 0.78} rx={6} fill="#E05A47" />
                <circle cx={0} cy={122} r={18} fill="#E05A47" stroke="#F4D8CE" strokeWidth={2.2} />
              </g>
              <text x={106} y={76} fill="#FF8C78" fontFamily={BENGALI_FONT} fontSize={44} fontWeight={700}>
                ৪১° সেলসিয়াস!
              </text>
              <text x={106} y={118} fill="#F2C8BF" fontFamily={BENGALI_FONT} fontSize={23} fontWeight={600}>
                চাচার বাসার এসি হঠাৎ নষ্ট
              </text>
            </g>

            {/* Broken Fault-Blinking AC above Cha-cha */}
            <g transform="translate(116, 404)">
              <rect x={0} y={0} width={308} height={96} rx={10} fill="#E5E9EF" stroke="#263240" strokeWidth={2.6} />
              <rect x={24} y={66} width={260} height={16} rx={4} fill="#1E293B" />
              <rect x={228} y={18} width={58} height={32} rx={5} fill="#0F172A" />
              <text x={257} y={41} textAnchor="middle" fill="#E05A47" fontFamily="monospace" fontSize={18} fontWeight={700}>
                ERR
              </text>
              <circle cx={42} cy={32} r={6} fill={Math.floor(frame / 6) % 2 === 0 ? '#E05A47' : '#4D1814'} />
              {/* Puff of hot smoke */}
              <path
                d={`M 164 84 Q ${150 + heatWaveShift} 112 172 132`}
                fill="none"
                stroke="#FCA5A5"
                strokeWidth={3.5}
                strokeLinecap="round"
                opacity={0.65}
              />
            </g>

            {/* SWEATING CHA-CHA PLEADING ON PHONE HELD UP NEAR EAR */}
            <CharacterRig
              character="chacha"
              frame={frame}
              x={272}
              y={846}
              scale={1.16}
              expression="worried"
              lipSyncShape={chachaLip}
              leftArmAngle={chachaLeftArm}
              leftElbowAngle={74}
              rightArmAngle={-18}
              rightElbowAngle={-18}
              leftProp="phone"
              sweatDrops={true}
              headTilt={4}
              uid="s9-chacha"
            />
          </g>

          {/* RIGHT HALF: COOL EXECUTIVE OFFICE — FOUNDER RAFI AT DESK */}
          <g clipPath="url(#s9-right-half)">
            <rect x={540} y={0} width={540} height={1920} fill="#12272F" />
            {/* Cool crisp geometric office paneling */}
            <rect x={576} y={240} width={440} height={540} rx={8} fill="#17333D" stroke="#25515E" strokeWidth={2.5} />
            {/* Framed Business Registration / Founder Certificate on wall */}
            <g transform="translate(658, 286)">
              <rect x={0} y={0} width={224} height={164} rx={6} fill="#5E3A20" stroke="#D4AF37" strokeWidth={3} />
              <rect x={14} y={14} width={196} height={136} fill="#FAF3E2" />
              <text x={112} y={56} textAnchor="middle" fill="#113E37" fontFamily={BENGALI_FONT} fontSize={23} fontWeight={700}>
                রাফি এসি সার্ভিস
              </text>
              <line x1={48} y1={74} x2={176} y2={74} stroke="#D4AF37" strokeWidth={2.5} />
              <text x={112} y={108} textAnchor="middle" fill="#4A3B28" fontFamily={BENGALI_FONT} fontSize={19} fontWeight={600}>
                ট্রেড লাইসেন্স · ৪ কর্মী
              </text>
              <circle cx={112} cy={132} r={10} fill="#D4AF37" />
            </g>

            {/* CALM FOUNDER RAFI SEATED BEHIND WALNUT EXECUTIVE DESK (phone held up near ear!) */}
            <CharacterRig
              character="rafi"
              rafiOutfit="uniform"
              frame={frame}
              x={798}
              y={818}
              scale={1.16}
              expression="happy"
              lipSyncShape={rafiLip}
              leftArmAngle={18}
              leftElbowAngle={20}
              rightArmAngle={rafiRightArm}
              rightElbowAngle={-74}
              rightProp="phone"
              headTilt={-2}
              uid="s9-rafi-desk"
            />

            {/* EXECUTIVE WALNUT DESK (y = 1106) WITH BRASS NAMEPLATE, NOTEBOOK & TEACUP */}
            <rect x={540} y={1106} width={540} height={814} fill="#3E2517" stroke="#1E1109" strokeWidth={3.5} />
            <rect x={540} y={1106} width={540} height={34} fill="#5C3824" stroke="#1E1109" strokeWidth={3} />

            {/* Brass Founder Nameplate on Desk */}
            <g transform="translate(592, 1054)">
              <polygon points="10,0 264,0 274,56 0,56" fill="#2A180D" stroke="#D4AF37" strokeWidth={2.8} />
              <text x={137} y={37} textAnchor="middle" fill="#F7DC88" fontFamily={BENGALI_FONT} fontSize={25} fontWeight={700}>
                রাফি · প্রতিষ্ঠাতা
              </text>
            </g>

            {/* Open Order Ledger Notebook on Desk */}
            <g transform="translate(882, 1068)">
              <rect x={0} y={0} width={114} height={42} rx={3} fill="#FAF3E2" stroke="#6E5A3E" strokeWidth={2} />
              <line x1={16} y1={14} x2={96} y2={14} stroke="#8C7656" strokeWidth={2.5} />
              <line x1={16} y1={28} x2={78} y2={28} stroke="#8C7656" strokeWidth={2.5} />
            </g>
          </g>

          {/* CRISP GOLD SPLIT DIVIDER */}
          <line x1={540} y1={0} x2={540} y2={1920} stroke="#0A0F14" strokeWidth={12} />
          <line x1={540} y1={0} x2={540} y2={1920} stroke="#D4AF37" strokeWidth={5} />
        </svg>
      </div>
    </div>
  );
};
