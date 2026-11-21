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
 * Scene 01 (0:00 - 0:11 | Frames 0-330): Editorial 2D Viral Freeze-Frame Cold Open.
 * Meticulous sunlit living room with ticking wall clock, framed Bengali art, potted
 * money plant, open AC casing with copper refrigerant lines & louver slats, rubber-footed
 * aluminum ladder, floor technician toolbox, realistic 2-joint screwdriver twisting,
 * dramatic 0.5s freeze-frame zoom at frame 90 with crimson status-drop meter.
 */
export const Scene01ColdOpen: React.FC<SceneProps> = ({ frame, localFrame, cues }) => {
  const { fps } = useVideoConfig();

  const isFreezeWindow = localFrame >= 90 && localFrame < 105;
  const freezeZoom = interpolate(
    localFrame,
    [86, 91, 104, 114],
    [1, 1.075, 1.075, 1.015],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Subtle living room camera push before freeze
  const baseCameraScale =
    localFrame < 86
      ? interpolate(localFrame, [0, 86], [1, 1.02], { extrapolateRight: 'clamp' })
      : freezeZoom;

  const animFrame = isFreezeWindow ? 90 : frame;
  const chachaLip = isFreezeWindow ? -1 : getLipSyncShape('chacha', frame, cues);
  const rafiLip = isFreezeWindow ? -1 : getLipSyncShape('rafi', frame, cues);

  const hookEntrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 190 },
  });

  const statusDropProgress = interpolate(localFrame, [90, 126], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const statusCardOpacity = interpolate(localFrame, [87, 92, 200, 224], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const statusMeterValue = Math.round((1 - statusDropProgress) * 100);

  // Realistic 2-joint arm & elbow choreography (+leftElbow / -rightElbow bends forearm UPWARD)
  const rafiIsPleading = localFrame >= 120 && localFrame < 215;
  const rafiTwist = Math.sin(animFrame * 0.36) * 7;
  const rafiLeftArm = rafiIsPleading ? 68 : 108 + rafiTwist * 0.5;
  const rafiLeftElbow = rafiIsPleading ? 48 : 38 + rafiTwist * 1.3;
  const rafiRightArm = rafiIsPleading ? -46 - Math.sin(animFrame * 0.25) * 8 : -16;
  const rafiRightElbow = rafiIsPleading ? -48 : -16;

  // Cha-cha raises smartphone up to chest/eye level with natural upward elbow bend
  const chachaPhoneLift = interpolate(localFrame, [22, 58, 210, 240], [34, 58, 58, 68], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const chachaRightArm = localFrame > 210 ? -38 - Math.sin(animFrame * 0.28) * 10 : -14;
  const chachaRightElbow = localFrame > 210 ? -52 : -14;

  // Ticking wall clock & gently swaying window curtain
  const clockSecAngle = Math.floor(animFrame / 8) * 6;
  const curtainSway = Math.sin(animFrame * 0.045) * 6;
  const recPulse = 0.35 + 0.65 * Math.abs(Math.sin(animFrame * 0.22));

  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden', background: '#EDE1CE' }}>
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{
          transform: `scale(${baseCameraScale})`,
          transformOrigin: '490px 830px',
        }}
      >
        <defs>
          <clipPath id="s1-window-clip">
            <rect x={44} y={376} width={220} height={540} rx={6} />
          </clipPath>
          <pattern id="s1-tile-grid" width={120} height={60} patternUnits="userSpaceOnUse">
            <rect width={120} height={60} fill="#CFAF86" />
            <path d="M 0 60 L 120 60 M 60 0 L 60 60" stroke="#B69368" strokeWidth={1.6} />
          </pattern>
        </defs>

        {/* Flat-cel sunlit editorial living room wall */}
        <rect x={0} y={0} width={1080} height={1340} fill="#F4E8D5" />
        {/* Warm sunlit diagonal shafts from left window */}
        <polygon points="44,376 264,376 740,1340 240,1340" fill="#FFF9EA" opacity={0.55} />
        <polygon points="264,376 310,376 820,1340 740,1340" fill="#FFF9EA" opacity={0.28} />

        {/* Editorial wainscoting lower wall & baseboard molding */}
        <rect x={0} y={1020} width={1080} height={320} fill="#E6D5BC" />
        <rect x={0} y={1012} width={1080} height={12} fill="#C9B393" stroke="#5E4B37" strokeWidth={1.8} />
        {[80, 260, 440, 620, 800, 960].map((wx) => (
          <rect key={wx} x={wx} y={1054} width={132} height={240} rx={4} fill="none" stroke="#CDB89A" strokeWidth={2.5} />
        ))}

        {/* Tiled Dhaka living-room floor */}
        <rect x={0} y={1340} width={1080} height={580} fill="url(#s1-tile-grid)" />
        <rect x={0} y={1334} width={1080} height={14} fill="#8C6E4B" stroke="#3B2B1C" strokeWidth={2} />

        {/* Left Living Room Window with Outer Greenery & Swaying Curtain */}
        <g>
          <rect x={36} y={368} width={236} height={556} rx={8} fill="#7A5636" stroke="#2D1D10" strokeWidth={3} />
          <g clipPath="url(#s1-window-clip)">
            <rect x={44} y={376} width={220} height={540} fill="#BCE2EC" />
            <rect x={44} y={710} width={220} height={206} fill="#88B591" />
            {/* Outside Dhaka apartment silhouette & tree leaves */}
            <rect x={60} y={550} width={78} height={200} fill="#D9C5A8" stroke="#6B5A45" strokeWidth={1.6} />
            <circle cx={196} cy={690} r={54} fill="#5C8F66" />
            <circle cx={234} cy={720} r={42} fill="#467350" />
            {/* Window mullions */}
            <line x1={154} y1={376} x2={154} y2={916} stroke="#634226" strokeWidth={8} />
            <line x1={44} y1={646} x2={264} y2={646} stroke="#634226" strokeWidth={8} />
          </g>
          {/* Brass curtain rod & swaying teal-gold fabric drape */}
          <rect x={22} y={352} width={268} height={10} rx={5} fill="#C69B38" stroke="#4D390D" strokeWidth={2} />
          <path
            d={`M 32 362 L 106 362 C ${96 + curtainSway} 560, ${84 + curtainSway * 1.3} 740, ${98 + curtainSway} 948 L 28 948 Z`}
            fill="#2B676E"
            stroke="#14353A"
            strokeWidth={2.2}
          />
          <path
            d={`M 54 362 C ${50 + curtainSway * 0.6} 560, ${44 + curtainSway} 740, ${52 + curtainSway * 0.8} 948`}
            fill="none"
            stroke="#1B484E"
            strokeWidth={2.2}
          />
          <path
            d={`M 82 362 C ${76 + curtainSway * 0.8} 560, ${68 + curtainSway * 1.1} 740, ${78 + curtainSway * 0.9} 948`}
            fill="none"
            stroke="#D4AF37"
            strokeWidth={2}
            strokeDasharray="8 6"
          />
        </g>

        {/* Ticking Vintage Wall Clock (x: 340, y: 438) */}
        <g transform="translate(344, 438)">
          <circle cx={0} cy={0} r={42} fill="#5E3A20" stroke="#26160B" strokeWidth={2.6} />
          <circle cx={0} cy={0} r={34} fill="#FAF4E8" stroke="#C59B38" strokeWidth={2} />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1={0}
              y1={-29}
              x2={0}
              y2={deg % 90 === 0 ? -23 : -26}
              stroke="#33261B"
              strokeWidth={deg % 90 === 0 ? 2.4 : 1.3}
              transform={`rotate(${deg})`}
            />
          ))}
          <line x1={0} y1={0} x2={0} y2={-16} stroke="#26160B" strokeWidth={3} strokeLinecap="round" transform="rotate(65)" />
          <line x1={0} y1={0} x2={0} y2={-24} stroke="#26160B" strokeWidth={2.2} strokeLinecap="round" transform="rotate(210)" />
          <line x1={0} y1={4} x2={0} y2={-26} stroke="#C23A2B" strokeWidth={1.4} strokeLinecap="round" transform={`rotate(${clockSecAngle})`} />
          <circle cx={0} cy={0} r={3.2} fill="#C23A2B" />
        </g>

        {/* Framed Bengali River Landscape Wall Art (right wall, x: 840, y: 690) */}
        <g transform="translate(838, 690)">
          <rect x={0} y={0} width={156} height={124} rx={4} fill="#5E3A20" stroke="#26160B" strokeWidth={2.5} />
          <rect x={10} y={10} width={136} height={104} fill="#F2E4C8" />
          <rect x={16} y={16} width={124} height={92} fill="#D8E9EC" />
          <circle cx={106} cy={42} r={14} fill="#E07A47" />
          <path d="M 16 74 Q 56 64 96 74 T 140 72 L 140 108 L 16 108 Z" fill="#548A8A" />
          <path d="M 48 76 L 86 76 L 78 85 L 54 85 Z" fill="#4E2F1E" />
          <path d="M 62 76 L 62 52 L 82 68 Z" fill="#FFF7E2" stroke="#5E3A20" strokeWidth={1.2} />
        </g>

        {/* Potted Money Plant in Terracotta Pot on Floor (left corner) */}
        <g transform="translate(96, 1272)">
          <path d="M -28 0 L 28 0 L 20 68 L -20 68 Z" fill="#B85D3B" stroke="#4D2112" strokeWidth={2.2} />
          <rect x={-32} y={-10} width={64} height={14} rx={3} fill="#C96B46" stroke="#4D2112" strokeWidth={2.2} />
          <path d="M 0 -10 Q -28 -68 -42 -96" fill="none" stroke="#2D6A4F" strokeWidth={3.5} />
          <path d="M 0 -10 Q 12 -74 36 -108" fill="none" stroke="#2D6A4F" strokeWidth={3.5} />
          <path d="M 0 -10 Q -4 -86 4 -126" fill="none" stroke="#3B8260" strokeWidth={3.5} />
          <ellipse cx={-38} cy={-86} rx={22} ry={12} transform="rotate(-28 -38 -86)" fill="#40916C" stroke="#1B4332" strokeWidth={1.8} />
          <ellipse cx={30} cy={-96} rx={22} ry={12} transform="rotate(24 30 -96)" fill="#52B788" stroke="#1B4332" strokeWidth={1.8} />
          <ellipse cx={4} cy={-122} rx={18} ry={11} transform="rotate(-12 4 -122)" fill="#40916C" stroke="#1B4332" strokeWidth={1.8} />
        </g>

        {/* DETAILED OPEN WALL-MOUNTED SPLIT AC UNIT + COPPER PIPING & CONDUIT */}
        <g transform="translate(362, 514)">
          {/* Electrical wall conduit & switch box */}
          <rect x={346} y={76} width={12} height={156} fill="#DCD3C3" stroke="#5A5349" strokeWidth={1.6} />
          <rect x={334} y={224} width={36} height={46} rx={4} fill="#F4F1EA" stroke="#475569" strokeWidth={2} />
          <rect x={344} y={236} width={16} height={12} rx={2} fill="#E05A47" />
          <circle cx={352} cy={258} r={3.2} fill="#1E293B" />
          {/* Cast wall shadow */}
          <rect x={8} y={14} width={334} height={116} rx={12} fill="#9C8464" opacity={0.45} />
          {/* Main AC housing (flat 2D editorial cel) */}
          <rect x={0} y={0} width={334} height={114} rx={12} fill="#F5F7FA" stroke="#263240" strokeWidth={2.6} />
          <path d="M 0 88 L 334 88 L 334 102 C 334 109, 328 114, 322 114 L 12 114 C 5 114, 0 109, 0 102 Z" fill="#D5DEE8" />
          {/* Open front maintenance panel showing condenser coils & copper tubing */}
          <rect x={20} y={16} width={218} height={64} rx={6} fill="#1F2937" stroke="#111827" strokeWidth={2} />
          {[28, 38, 48, 58, 68].map((ly) => (
            <line key={ly} x1={26} y1={ly} x2={230} y2={ly} stroke="#64748B" strokeWidth={2.2} />
          ))}
          {/* Copper U-bends on coil left */}
          <path d="M 28 32 C 18 32, 18 46, 28 46 M 28 52 C 18 52, 18 66, 28 66" fill="none" stroke="#C97841" strokeWidth={4} strokeLinecap="round" />
          {/* Open hinge cover flipped up */}
          <polygon points="18,16 240,16 254,-12 32,-12" fill="#E8EEF5" stroke="#263240" strokeWidth={2.2} />
          {/* Digital LED temperature display & fault blink */}
          <rect x={252} y={24} width={62} height={36} rx={6} fill="#0F172A" stroke="#334155" strokeWidth={1.8} />
          <text x={283} y={49} textAnchor="middle" fill="#38BDF8" fontFamily="monospace" fontSize={20} fontWeight={700}>
            26°
          </text>
          <circle cx={264} cy={72} r={4} fill={Math.floor(animFrame / 10) % 2 === 0 ? '#E05A47' : '#5C1E18'} />
          <circle cx={280} cy={72} r={4} fill="#2EC4B6" />
          {/* Louver air vent */}
          <rect x={22} y={92} width={290} height={14} rx={4} fill="#263240" />
          <line x1={30} y1={99} x2={304} y2={99} stroke="#94A3B8" strokeWidth={2} />
        </g>

        {/* ALUMINUM STEP LADDER WITH RUBBER FOOT-PADS & CROSS-BRACES */}
        <g transform="translate(226, 704)">
          {/* Floor contact shadow */}
          <ellipse cx={120} cy={676} rx={118} ry={14} fill="#6E5233" opacity={0.45} />
          {/* Back support rails */}
          <line x1={52} y1={0} x2={16} y2={670} stroke="#64748B" strokeWidth={11} strokeLinecap="round" />
          <line x1={188} y1={0} x2={224} y2={670} stroke="#64748B" strokeWidth={11} strokeLinecap="round" />
          {/* Center locking spreader bar */}
          <line x1={38} y1={350} x2={202} y2={350} stroke="#475569" strokeWidth={6} />
          {/* Front aluminum rails */}
          <line x1={44} y1={0} x2={8} y2={670} stroke="#CBD5E1" strokeWidth={13} strokeLinecap="round" />
          <line x1={44} y1={0} x2={8} y2={670} stroke="#334155" strokeWidth={2.2} strokeLinecap="round" />
          <line x1={196} y1={0} x2={232} y2={670} stroke="#CBD5E1" strokeWidth={13} strokeLinecap="round" />
          <line x1={196} y1={0} x2={232} y2={670} stroke="#334155" strokeWidth={2.2} strokeLinecap="round" />
          {/* Non-slip ribbed steps */}
          {[70, 165, 260, 355, 450, 545].map((ry) => (
            <g key={ry}>
              <rect x={26} y={ry} width={188} height={13} rx={3} fill="#94A3B8" stroke="#1E293B" strokeWidth={2} />
              <line x1={34} y1={ry + 4} x2={206} y2={ry + 4} stroke="#E2E8F0" strokeWidth={2} />
            </g>
          ))}
          {/* Rubber floor pads */}
          <rect x={-4} y={658} width={24} height={18} rx={4} fill="#1E293B" />
          <rect x={220} y={658} width={24} height={18} rx={4} fill="#1E293B" />
        </g>

        {/* RED TECHNICIAN TOOLBOX ON FLOOR WITH WRENCHES & INSULATION TAPE */}
        <g transform="translate(500, 1272)">
          <ellipse cx={64} cy={72} rx={72} ry={10} fill="#6E5233" opacity={0.45} />
          <rect x={0} y={14} width={128} height={58} rx={6} fill="#B83227" stroke="#2B0B08" strokeWidth={2.4} />
          <rect x={0} y={14} width={128} height={18} rx={4} fill="#D14338" stroke="#2B0B08" strokeWidth={2.2} />
          <path d="M 42 14 L 42 2 Q 64 -4 86 2 L 86 14" fill="none" stroke="#1E293B" strokeWidth={5} strokeLinecap="round" />
          <rect x={22} y={26} width={16} height={12} rx={2} fill="#D4AF37" stroke="#4D3A08" strokeWidth={1.6} />
          <rect x={90} y={26} width={16} height={12} rx={2} fill="#D4AF37" stroke="#4D3A08" strokeWidth={1.6} />
          {/* Spanner & black tape roll resting beside toolbox */}
          <circle cx={-28} cy={62} r={14} fill="#1E293B" stroke="#0F172A" strokeWidth={2} />
          <circle cx={-28} cy={62} r={6} fill="#CFAF86" />
        </g>

        {/* RAFI ON LADDER (2-joint articulated elbow twisting screwdriver at AC) */}
        <CharacterRig
          character="rafi"
          rafiOutfit="uniform"
          frame={animFrame}
          x={354}
          y={688}
          scale={1.08}
          expression={isFreezeWindow ? 'shocked' : rafiIsPleading ? 'worried' : 'neutral'}
          lipSyncShape={rafiLip}
          leftArmAngle={rafiLeftArm}
          leftElbowAngle={rafiLeftElbow}
          rightArmAngle={rafiRightArm}
          rightElbowAngle={rafiRightElbow}
          leftProp="screwdriver"
          showLegs={true}
          headTilt={rafiIsPleading ? 9 : -4}
          uid="s1-rafi"
        />

        {/* CHA-CHA ON FLOOR RECORDING WITH PHONE & SMUG GRIN */}
        <g>
          <ellipse cx={776} cy={1402} rx={78} ry={14} fill="#6E5233" opacity={0.42} />
          <CharacterRig
            character="chacha"
            frame={animFrame}
            x={776}
            y={892}
            scale={1.12}
            expression="smirk"
            lipSyncShape={chachaLip}
            leftArmAngle={chachaPhoneLift}
            leftElbowAngle={64}
            rightArmAngle={chachaRightArm}
            rightElbowAngle={chachaRightElbow}
            leftProp="phone"
            showLegs={true}
            headTilt={-5}
            uid="s1-chacha"
          />
        </g>

        {/* Subtle editorial comic focus lines radiating during 0.5s freeze-frame */}
        {isFreezeWindow && (
          <g opacity={0.55}>
            <rect x={0} y={0} width={1080} height={1920} fill="#14181F" opacity={0.18} />
            {[
              [80, 320, 260, 560],
              [990, 300, 740, 560],
              [60, 1140, 240, 940],
              [1010, 1180, 820, 960],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E05A47" strokeWidth={4} strokeLinecap="round" />
            ))}
          </g>
        )}

        {/* Small live REC badge near Cha-cha's phone when recording */}
        {localFrame >= 36 && (
          <g transform="translate(566, 940)">
            <rect x={0} y={0} width={86} height={30} rx={6} fill="#151C26" stroke="#E05A47" strokeWidth={1.8} />
            <circle cx={18} cy={15} r={5.5} fill="#E05A47" opacity={recPulse} />
            <text x={32} y={20} fill="#F8FAFC" fontFamily="monospace" fontSize={16} fontWeight={700}>
              REC
            </text>
          </g>
        )}
      </svg>

      {/* EDITORIAL TOP HOOK CARD (strictly inside safe zone x: 64..936, y: 184..340) */}
      <div
        style={{
          position: 'absolute',
          left: 64,
          top: 184,
          width: 872,
          borderRadius: 16,
          padding: '18px 24px 16px 24px',
          background: '#113E37',
          border: '3px solid #D4AF37',
          boxShadow: '6px 6px 0px #091F1C',
          transform: `translateY(${(1 - hookEntrance) * -28}px) scale(${0.95 + 0.05 * hookEntrance})`,
          opacity: Math.min(1, hookEntrance * 1.2),
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            fontFamily: BENGALI_FONT,
            fontSize: 38,
            fontWeight: 700,
            color: '#FFFDF7',
            textAlign: 'center',
            lineHeight: 1.24,
          }}
        >
          মাস্টার্স পাস রাফি এসি সারায়, আর বাবা জানেন না!
        </div>

        {/* Crisp Flat Editorial Data Stamp */}
        <div
          style={{
            marginTop: 10,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '5px 18px',
              borderRadius: 6,
              background: '#0A2723',
              border: '1.8px solid #D4AF37',
              fontFamily: BENGALI_FONT,
              fontSize: 23,
              fontWeight: 700,
              color: '#F6DC8C',
            }}
          >
            <span>🎓 মাস্টার্স পাস</span>
            <span style={{ color: '#E05A47', fontWeight: 700 }}>→</span>
            <span>🔧 এসি হেল্পার</span>
          </div>
        </div>
      </div>

      {/* EDITORIAL CRIMSON STATUS-DROP METER (cleanly above AC unit, zero overlap) */}
      {statusCardOpacity > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 520,
            top: 358,
            width: 410,
            borderRadius: 12,
            padding: '14px 18px',
            background: '#220E10',
            border: '2.5px solid #E05A47',
            boxShadow: '5px 5px 0px #120607',
            opacity: statusCardOpacity,
            transform: `scale(${isFreezeWindow ? 1.04 : 1})`,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: BENGALI_FONT,
              fontSize: 24,
              fontWeight: 700,
              color: '#FFE0DC',
              marginBottom: 8,
            }}
          >
            <span>সম্মান: ১০০% → ০%</span>
            <span style={{ color: '#FF7563', fontFamily: 'monospace', fontSize: 24 }}>{statusMeterValue}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: 14,
              borderRadius: 4,
              background: '#3F1619',
              border: '1.5px solid #7F262A',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${statusMeterValue}%`,
                height: '100%',
                background: statusMeterValue > 35 ? '#D4AF37' : '#E05A47',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
