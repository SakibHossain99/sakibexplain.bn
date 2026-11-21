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
 * Scene 03 (0:19 - 0:29 | Frames 570-870): Flashback Pride Trap ("৪ বছর আগে").
 * Warm sepia editorial home with slowly rotating ceiling fan, vintage "২০২২" wall
 * calendar, university book stack, arched wooden window. Ma wears gold earrings
 * (`present`) and gestures warmly with bent elbow; Rafi in light-blue panjabi holds
 * ornate Master's certificate proudly before dismissing her advice.
 */
export const Scene03Flashback: React.FC<SceneProps> = ({ frame, localFrame, cues }) => {
  const { fps } = useVideoConfig();

  const badgePop = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 180 },
  });

  const maLip = getLipSyncShape('ma', frame, cues);
  const rafiLip = getLipSyncShape('rafi', frame, cues);

  const isMaSpeaking = maLip >= 0;
  const isRafiSpeaking = rafiLip >= 0;

  // Ceiling fan continuous gentle rotation
  const fanPhase = (frame * 0.14) % (Math.PI * 2);
  const bladeScaleX = Math.cos(fanPhase);

  // Expressive bent-elbow gestures (+leftElbow / -rightElbow bends forearm UPWARD)
  const maRightArm = isMaSpeaking ? -42 - Math.sin(frame * 0.24) * 10 : -24;
  const maRightElbow = isMaSpeaking ? -56 - Math.sin(frame * 0.24) * 8 : -32;

  const rafiCertLift = interpolate(localFrame, [0, 48, 175, 205], [44, 62, 62, 74], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rafiRightArm = isRafiSpeaking ? -48 - Math.sin(frame * 0.3) * 12 : -18;
  const rafiRightElbow = isRafiSpeaking ? -52 : -20;

  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden', background: '#EFE7DA' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        {/* Warm sepia nostalgic cream wall */}
        <rect x={0} y={0} width={1080} height={1340} fill="#F1E7D6" />
        {/* Warm afternoon light bars through wooden louvers */}
        <polygon points="820,380 1040,380 540,1340 260,1340" fill="#FFF8E6" opacity={0.48} />

        {/* Slowly Rotating Vintage Ceiling Fan (top center) */}
        <g transform="translate(540, 290)">
          <rect x={-5} y={-290} width={10} height={290} fill="#7A654D" stroke="#3B2D1F" strokeWidth={1.8} />
          <g transform={`scale(${Math.max(0.18, Math.abs(bladeScaleX))}, 1)`}>
            <ellipse cx={-110} cy={4} rx={104} ry={12} fill="#C9B393" stroke="#5A4632" strokeWidth={2} />
            <ellipse cx={110} cy={4} rx={104} ry={12} fill="#B89E7A" stroke="#5A4632" strokeWidth={2} />
          </g>
          <ellipse cx={0} cy={4} rx={36} ry={14} fill="#D4AF37" stroke="#5A4632" strokeWidth={2.2} />
        </g>

        {/* Vintage Tear-off Wall Calendar "২০২২" (x: 112, y: 420) */}
        <g transform="translate(112, 420)">
          <rect x={4} y={6} width={132} height={154} rx={6} fill="#8C7355" opacity={0.3} />
          <rect x={0} y={0} width={132} height={154} rx={6} fill="#FAF5EB" stroke="#4D3A24" strokeWidth={2.4} />
          <rect x={0} y={0} width={132} height={42} rx={5} fill="#9E2A2B" stroke="#4D1617" strokeWidth={2} />
          <circle cx={34} cy={14} r={4} fill="#FAF5EB" />
          <circle cx={98} cy={14} r={4} fill="#FAF5EB" />
          <text x={66} y={32} textAnchor="middle" fill="#FFF8EA" fontFamily={BENGALI_FONT} fontSize={22} fontWeight={700}>
            ২০২২
          </text>
          <text x={66} y={102} textAnchor="middle" fill="#2A2017" fontFamily={BENGALI_FONT} fontSize={44} fontWeight={700}>
            ১২
          </text>
          <text x={66} y={136} textAnchor="middle" fill="#7D6852" fontFamily={BENGALI_FONT} fontSize={18} fontWeight={600}>
            বৈশাখ
          </text>
        </g>

        {/* Right Arched Wooden Louver Window */}
        <g transform="translate(822, 412)">
          <path d="M 0 60 A 90 60 0 0 1 180 60 L 180 440 L 0 440 Z" fill="#C7DFDE" stroke="#5E4026" strokeWidth={8} />
          {[100, 160, 220, 280, 340, 400].map((wy) => (
            <line key={wy} x1={4} y1={wy} x2={176} y2={wy} stroke="#7A5636" strokeWidth={5} />
          ))}
          <line x1={90} y1={4} x2={90} y2={440} stroke="#5E4026" strokeWidth={6} />
        </g>

        {/* Wooden Study Desk + Stacked University Textbooks behind Rafi */}
        <g transform="translate(590, 1140)">
          <rect x={0} y={24} width={380} height={24} rx={4} fill="#7D5333" stroke="#2E1B0E" strokeWidth={2.4} />
          <rect x={24} y={48} width={22} height={160} fill="#634025" stroke="#2E1B0E" strokeWidth={2} />
          <rect x={334} y={48} width={22} height={160} fill="#634025" stroke="#2E1B0E" strokeWidth={2} />
          {/* Textbook stack */}
          <rect x={212} y={4} width={118} height={20} rx={2} fill="#2A5E68" stroke="#152E33" strokeWidth={1.8} />
          <rect x={222} y={-14} width={102} height={18} rx={2} fill="#8C332B" stroke="#3D120F" strokeWidth={1.8} />
          <rect x={232} y={-30} width={86} height={16} rx={2} fill="#C69B38" stroke="#4D3A0C" strokeWidth={1.8} />
          {/* Graduation cap resting on top of books */}
          <polygon points="274,-52 316,-40 274,-28 232,-40" fill="#1E293B" stroke="#0F172A" strokeWidth={1.8} />
          <path d="M 304 -36 L 314 -14" stroke="#D4AF37" strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* Warm wooden parquet floor */}
        <rect x={0} y={1336} width={1080} height={584} fill="#C8A983" />
        <line x1={0} y1={1336} x2={1080} y2={1336} stroke="#5E4226" strokeWidth={5} />

        {/* MA (gold earrings PRESENT!) gesturing warmly with bent elbow */}
        <g>
          <ellipse cx={288} cy={1374} rx={78} ry={14} fill="#7D6242" opacity={0.35} />
          <CharacterRig
            character="ma"
            earringsState="present"
            frame={frame}
            x={288}
            y={878}
            scale={1.12}
            expression={isMaSpeaking ? 'worried' : 'neutral'}
            lipSyncShape={maLip}
            leftArmAngle={16}
            leftElbowAngle={18}
            rightArmAngle={maRightArm}
            rightElbowAngle={maRightElbow}
            showLegs={false}
            headTilt={4}
            uid="s3-ma"
          />
          {/* Ma's lower saree drape to floor */}
          <path d="M 196 1180 L 380 1180 L 392 1372 L 184 1372 Z" fill="#184E4B" stroke="#231A17" strokeWidth={2.4} />
          <path d="M 218 1180 L 210 1370 M 288 1180 L 288 1370 M 356 1180 L 364 1370" stroke="#0F3533" strokeWidth={2.2} opacity={0.55} />
          <rect x={184} y={1346} width={208} height={24} fill="#9E2A2B" stroke="#231A17" strokeWidth={1.8} />
          <line x1={184} y1={1352} x2={392} y2={1352} stroke="#D4AF37" strokeWidth={3.5} />
        </g>

        {/* RAFI IN LIGHT-BLUE FLASHBACK PANJABI HOLDING MASTER'S CERTIFICATE */}
        <g>
          <ellipse cx={726} cy={1396} rx={78} ry={14} fill="#7D6242" opacity={0.35} />
          <CharacterRig
            character="rafi"
            rafiOutfit="flashback"
            frame={frame}
            x={726}
            y={858}
            scale={1.14}
            expression={isRafiSpeaking ? 'smirk' : 'neutral'}
            lipSyncShape={rafiLip}
            leftArmAngle={rafiCertLift}
            leftElbowAngle={56}
            rightArmAngle={rafiRightArm}
            rightElbowAngle={rafiRightElbow}
            leftProp="certificate"
            showLegs={true}
            headTilt={isRafiSpeaking ? -5 : 0}
            uid="s3-rafi"
          />
        </g>

        {/* Subtle sepia flashback photo border frame */}
        <rect
          x={24}
          y={24}
          width={1032}
          height={1872}
          rx={18}
          fill="none"
          stroke="#B89B72"
          strokeWidth={6}
          strokeDasharray="16 10"
          opacity={0.45}
        />
      </svg>

      {/* TOP FLASHBACK EDITORIAL STAMP (strictly inside safe zone y: 184..274) */}
      <div
        style={{
          position: 'absolute',
          left: 274,
          top: 188,
          width: 452,
          borderRadius: 10,
          padding: '12px 24px',
          background: '#3B2B1C',
          border: '2.5px solid #D4AF37',
          boxShadow: '5px 5px 0px #1F150C',
          transform: `scale(${0.92 + 0.08 * badgePop})`,
          opacity: Math.min(1, badgePop * 1.2),
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: BENGALI_FONT,
            fontSize: 30,
            fontWeight: 700,
            color: '#F7DC88',
          }}
        >
          ফ্ল্যাশব্যাক · ৪ বছর আগে (২০২২)
        </div>
      </div>

      {/* Subtle Bengali Degree Tag near certificate */}
      <div
        style={{
          position: 'absolute',
          left: 472,
          top: 632,
          padding: '7px 16px',
          borderRadius: 8,
          background: '#FAF3E2',
          border: '2px solid #8C6420',
          boxShadow: '3px 3px 0px #5A3E12',
          fontFamily: BENGALI_FONT,
          fontSize: 21,
          fontWeight: 700,
          color: '#3B250C',
        }}
      >
        🎓 মাস্টার্স সার্টিফিকেট
      </div>
    </div>
  );
};
