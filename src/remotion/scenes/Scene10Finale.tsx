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
 * Scene 10 (1:23 - 1:30 | Frames 2490-2700): Grand Happy Editorial 2D Finale & Comment-Bait CTA.
 * Sun-drenched golden dining room with arched lattice window, fluttering curtains, framed
 * family portrait, volumetric sunbeams & drifting golden dust motes.
 * All 4 smiling characters cleanly behind the dining table edge (y = 1152..1185):
 *   - Baba (far left, beaming)
 *   - Ma (center-left, gleaming NEW gold jhumkas sparkling!)
 *   - Rafi (center-right, proud founder uniform)
 *   - Sumon (far right, raising upright teacup cleanly in RIGHT hand into open right space!)
 * Ornate teapot, teacups & Bengali mithai platter on tabletop; unobstructed lower table-front
 * CTA card (y: 1205..1345) leaving y: 1380..1546 completely clean for narrator subtitle bar.
 */
export const Scene10Finale: React.FC<SceneProps> = ({ frame, localFrame }) => {
  const { fps } = useVideoConfig();

  const headerPop = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 170 },
  });

  const ctaPop = spring({
    frame: Math.max(0, localFrame - 24),
    fps,
    config: { damping: 14, stiffness: 190 },
  });

  // Gentle toast celebration lift for Sumon's right hand (raises teacup UP into open right space!)
  const sumonToast = interpolate(localFrame, [0, 36], [-38, -56], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const curtainDrift = Math.sin(frame * 0.05) * 6;
  const ctaPulse = 1 + Math.sin(frame * 0.16) * 0.025;

  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden', background: '#FFF5E2' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        {/* Warm golden sunlit dining room wall */}
        <rect x={0} y={0} width={1080} height={1220} fill="#FFF2D8" />
        {/* Warm diagonal golden sunbeams from arched window */}
        <polygon points="330,360 750,360 1040,1200 120,1200" fill="#FFE6A3" opacity={0.34} />
        <polygon points="430,360 650,360 880,1200 280,1200" fill="#FFFBE8" opacity={0.38} />

        {/* Editorial wainscoting lower wall */}
        <rect x={0} y={920} width={1080} height={280} fill="#F2DFBE" />
        <line x1={0} y1={920} x2={1080} y2={920} stroke="#C9AD82" strokeWidth={4} />

        {/* ARCHED LATTICE DINING ROOM WINDOW (centered x: 350..730, y: 344..820) */}
        <g transform="translate(350, 344)">
          <path d="M 0 110 A 190 110 0 0 1 380 110 L 380 460 L 0 460 Z" fill="#D5EFF5" stroke="#6E4A2E" strokeWidth={10} />
          {/* Golden sky & sunlit garden foliage outside */}
          <path d="M 10 112 A 180 102 0 0 1 370 112 L 370 300 L 10 300 Z" fill="#BCE4EE" />
          <circle cx={300} cy={140} r={34} fill="#FFE38A" />
          <circle cx={72} cy={350} r={62} fill="#6CA379" />
          <circle cx={312} cy={360} r={58} fill="#568C64" />
          {/* Lattice window bars */}
          <line x1={190} y1={6} x2={190} y2={456} stroke="#6E4A2E" strokeWidth={7} />
          <line x1={8} y1={246} x2={372} y2={246} stroke="#6E4A2E" strokeWidth={7} />
          <line x1={8} y1={356} x2={372} y2={356} stroke="#6E4A2E" strokeWidth={5} />

          {/* Gently fluttering cream-gold curtains framing the arched window */}
          <path
            d={`M -16 80 L 68 80 C ${54 + curtainDrift} 240, ${44 + curtainDrift} 360, ${58 + curtainDrift} 474 L -24 474 Z`}
            fill="#1F5E5B"
            stroke="#0F3533"
            strokeWidth={2.4}
          />
          <path
            d={`M 396 80 L 312 80 C ${326 - curtainDrift} 240, ${336 - curtainDrift} 360, ${322 - curtainDrift} 474 L 404 474 Z`}
            fill="#1F5E5B"
            stroke="#0F3533"
            strokeWidth={2.4}
          />
        </g>

        {/* Framed Happy Family Portrait on left wall */}
        <g transform="translate(96, 488)">
          <rect x={0} y={0} width={174} height={138} rx={6} fill="#6E4A2E" stroke="#2D1B0D" strokeWidth={2.6} />
          <rect x={12} y={12} width={150} height={114} fill="#FAF3E2" />
          <circle cx={58} cy={52} r={14} fill="#CF926B" />
          <circle cx={88} cy={56} r={13} fill="#D89A74" />
          <circle cx={118} cy={50} r={14} fill="#D99C73" />
          <path d="M 38 118 Q 58 76 76 118 Z" fill="#E8DFCF" />
          <path d="M 68 118 Q 88 80 108 118 Z" fill="#1F5E5B" />
          <path d="M 98 118 Q 118 76 138 118 Z" fill="#2A6770" />
        </g>

        {/* Framed "রাফি এসি সার্ভিস · প্রতিষ্ঠাতা" Plaque on right wall */}
        <g transform="translate(808, 492)">
          <rect x={0} y={0} width={178} height={134} rx={6} fill="#143D39" stroke="#D4AF37" strokeWidth={3} />
          <text x={89} y={56} textAnchor="middle" fill="#F7DC88" fontFamily={BENGALI_FONT} fontSize={23} fontWeight={700}>
            রাফি এসি
          </text>
          <text x={89} y={88} textAnchor="middle" fill="#FFFDF7" fontFamily={BENGALI_FONT} fontSize={21} fontWeight={600}>
            সার্ভিস · ঢাকা
          </text>
          <text x={89} y={116} textAnchor="middle" fill="#8EF0E6" fontFamily={BENGALI_FONT} fontSize={18} fontWeight={700}>
            ★ ৪ কর্মীর দল
          </text>
        </g>

        {/* Soft drifting golden celebration dust motes */}
        {[
          [210, 420],
          [420, 460],
          [660, 430],
          [860, 390],
          [530, 560],
        ].map(([mx, my], i) => (
          <circle
            key={i}
            cx={mx + Math.sin(frame * 0.06 + i * 1.4) * 18}
            cy={my - ((frame * 0.4 + i * 24) % 70)}
            r={4.5}
            fill="#FFF7C2"
            opacity={0.75}
          />
        ))}

        {/* ================= 4 HAPPY CHARACTERS CLEANLY BEHIND DINING TABLE EDGE (y = 1152) ================= */}
        {/* 1. BABA (far left, proud smile) */}
        <CharacterRig
          character="baba"
          frame={frame}
          x={168}
          y={858}
          scale={0.96}
          expression="happy"
          lipSyncShape={-1}
          leftArmAngle={14}
          leftElbowAngle={14}
          rightArmAngle={-16}
          rightElbowAngle={-16}
          headTilt={3}
          uid="s10-baba"
        />

        {/* 2. MA (center-left, gleaming NEW gold jhumkas sparkling!) */}
        <CharacterRig
          character="ma"
          earringsState="new"
          frame={frame}
          x={402}
          y={866}
          scale={0.96}
          expression="happy"
          lipSyncShape={-1}
          leftArmAngle={14}
          leftElbowAngle={14}
          rightArmAngle={-14}
          rightElbowAngle={-14}
          headTilt={2}
          uid="s10-ma"
        />

        {/* 3. RAFI (center-right, proud founder uniform) */}
        <CharacterRig
          character="rafi"
          rafiOutfit="uniform"
          frame={frame}
          x={646}
          y={846}
          scale={1.0}
          expression="happy"
          lipSyncShape={-1}
          leftArmAngle={16}
          leftElbowAngle={16}
          rightArmAngle={-16}
          rightElbowAngle={-16}
          headTilt={-2}
          uid="s10-rafi"
        />

        {/* 4. SUMON (far right, raising upright teacup UP in RIGHT hand in open right space!) */}
        <CharacterRig
          character="sumon"
          frame={frame}
          x={872}
          y={858}
          scale={0.96}
          expression="happy"
          lipSyncShape={-1}
          leftArmAngle={12}
          leftElbowAngle={12}
          rightArmAngle={sumonToast}
          rightElbowAngle={-58}
          rightProp="teacup"
          headTilt={-4}
          uid="s10-sumon"
        />

        {/* ================= RICH WALNUT DINING TABLE (y = 1152..1920) ================= */}
        <rect x={0} y={1152} width={1080} height={38} fill="#8C5935" stroke="#2D1B0D" strokeWidth={3} />
        <rect x={0} y={1190} width={1080} height={730} fill="#5A3620" stroke="#2D1B0D" strokeWidth={3} />
        <line x1={0} y1={1190} x2={1080} y2={1190} stroke="#D4AF37" strokeWidth={3} />

        {/* TABLETOP FEAST: Ornate Brass-Rimmed Teapot, 3 Teacups & Bengali Sweets Platter */}
        {/* Teapot (x: 280, y: 1152) */}
        <g transform="translate(278, 1148)">
          <ellipse cx={0} cy={4} rx={36} ry={7} fill="#5A3620" opacity={0.35} />
          <path d="M -26 0 C -34 -34, 34 -34, 26 0 Z" fill="#FAF6EC" stroke="#5A4B38" strokeWidth={2.2} />
          <path d="M -22 -14 L 22 -14" stroke="#D4AF37" strokeWidth={2.6} />
          <path d="M 24 -20 C 42 -22, 42 -4, 24 -4" fill="none" stroke="#5A4B38" strokeWidth={4.5} />
          <path d="M -24 -12 L -42 -26" stroke="#FAF6EC" strokeWidth={6} strokeLinecap="round" />
          <path d="M -24 -12 L -42 -26" stroke="#5A4B38" strokeWidth={2} strokeLinecap="round" />
          <circle cx={0} cy={-30} r={6} fill="#D4AF37" stroke="#5A420C" strokeWidth={1.6} />
        </g>

        {/* Bengali Sweets / Mithai Brass Platter (center x: 526, y: 1148) */}
        <g transform="translate(526, 1148)">
          <ellipse cx={0} cy={4} rx={78} ry={12} fill="#C69B38" stroke="#5A420C" strokeWidth={2.2} />
          {/* Golden Laddu & Rasgulla sweets */}
          {[-42, -22, 0, 22, 42].map((sx, idx) => (
            <circle
              key={sx}
              cx={sx}
              cy={-4 - (idx % 2) * 3}
              r={12}
              fill={idx % 2 === 0 ? '#E89B2D' : '#FFF8EB'}
              stroke="#7A4C12"
              strokeWidth={1.6}
            />
          ))}
          {[-20, 0, 20].map((sx) => (
            <circle key={sx} cx={sx} cy={-18} r={11} fill="#F2AE3D" stroke="#7A4C12" strokeWidth={1.6} />
          ))}
        </g>

        {/* Steaming porcelain teacups on table for Baba & Rafi */}
        {[170, 398, 670].map((tx) => (
          <g key={tx} transform={`translate(${tx}, 1152)`}>
            <ellipse cx={0} cy={2} rx={24} ry={5} fill="#E6DDD0" stroke="#6E6254" strokeWidth={1.6} />
            <path d="M -15 -22 L 15 -22 L 11 0 Q 0 4 -11 0 Z" fill="#FCF9F2" stroke="#6E6254" strokeWidth={1.8} />
            <line x1={-14} y1={-18} x2={14} y2={-18} stroke="#D4AF37" strokeWidth={2} />
            <path
              d={`M -3 -28 Q -7 -38 -1 -46`}
              fill="none"
              stroke="#FFFDF5"
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.75}
            />
          </g>
        ))}

        {/* TOP EDITORIAL FINALE BANNER (strictly inside safe zone x: 76..924, y: 184..294) */}
        <g transform={`translate(76, 186) scale(${0.94 + 0.06 * headerPop})`}>
          <rect x={5} y={5} width={848} height={106} rx={14} fill="#2A1C0E" opacity={0.35} />
          <rect x={0} y={0} width={848} height={106} rx={14} fill="#113E37" stroke="#D4AF37" strokeWidth={3.2} />
          <text x={424} y={48} textAnchor="middle" fill="#FFFDF7" fontFamily={BENGALI_FONT} fontSize={34} fontWeight={700}>
            যে চাকরি পায়নি, আজ সে ৪ জনকে চাকরি দেয়!
          </text>
          <text x={424} y={86} textAnchor="middle" fill="#F7DC88" fontFamily={BENGALI_FONT} fontSize={23} fontWeight={700}>
            ★ আইন ২৫: নিজেকে নতুন রূপে গড়ে তোলো
          </text>
        </g>

        {/* UNOBSTRUCTED LOWER TABLE-FRONT CTA CARD (strictly inside safe zone x: 76..924, y: 1208..1346; ZERO overlap with subtitle y: 1380..1546!) */}
        <g
          transform={`translate(500, 1277) scale(${(0.92 + 0.08 * ctaPop) * ctaPulse}) translate(-500, -1277)`}
          opacity={ctaPop}
        >
          <rect x={80} y={1212} width={848} height={134} rx={16} fill="#1E1008" opacity={0.55} />
          <rect x={76} y={1208} width={848} height={134} rx={16} fill="#112E2C" stroke="#D4AF37" strokeWidth={3.2} />

          {/* Left CTA Copy */}
          <text x={108} y={1262} fill="#FFFDF7" fontFamily={BENGALI_FONT} fontSize={31} fontWeight={700}>
            @sakibexplains.bn
          </text>
          <text x={108} y={1306} fill="#A3EBE2" fontFamily={BENGALI_FONT} fontSize={23} fontWeight={600}>
            কমেন্টে লিখুন আপনার মতামত · বন্ধুদের শেয়ার করুন
          </text>

          {/* Right Highlighted "+ ফলো করুন" Button */}
          <rect x={672} y={1238} width={224} height={74} rx={12} fill="#D4AF37" stroke="#FFF4C2" strokeWidth={2.2} />
          <text x={784} y={1285} textAnchor="middle" fill="#1C1204" fontFamily={BENGALI_FONT} fontSize={30} fontWeight={700}>
            + ফলো করুন
          </text>
        </g>
      </svg>
    </div>
  );
};
