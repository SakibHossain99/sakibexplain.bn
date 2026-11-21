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
 * Scene 05 (0:40 - 0:50 | Frames 1200-1500): Midnight Resolve & Father's Turning Point.
 * Part 1 (0..154f): Atmospheric Dhaka night repair shop — skyline rooftops with water
 *                   tanks, crescent moon, tungsten streetlamp cone with drifting moths,
 *                   hand-painted "সুমন এসি সার্ভিস" board, spinning outdoor AC fans,
 *                   steaming roadside kettle. Rafi & Sumon talking with bent elbows.
 * Part 2 (154..300f): "২ মাস পর" video-call flip — dignified Baba speaking calmly over
 *                     animated golden speakerphone waves as Cha-cha freezes in shock.
 */
export const Scene05Resolve: React.FC<SceneProps> = ({ frame, localFrame, cues }) => {
  const { fps } = useVideoConfig();

  const isPart2 = localFrame >= 154;
  const rafiLip = getLipSyncShape('rafi', frame, cues);
  const sumonLip = getLipSyncShape('sumon', frame, cues);
  const babaLip = getLipSyncShape('baba', frame, cues);

  const part2Frame = Math.max(0, localFrame - 154);
  const part2Pop = spring({
    frame: part2Frame,
    fps,
    config: { damping: 16, stiffness: 175 },
  });

  // Spinning outdoor AC fan blades & drifting streetlamp moths
  const fanRot = (frame * 7) % 360;
  const moth1X = 186 + Math.sin(frame * 0.14) * 34;
  const moth1Y = 398 + Math.cos(frame * 0.19) * 18;
  const moth2X = 230 + Math.cos(frame * 0.12) * 28;
  const moth2Y = 442 + Math.sin(frame * 0.17) * 16;

  // Expressive bent-elbow dialogue choreography (+leftElbow / -rightElbow bends UPWARD)
  const rafiRightArm = rafiLip >= 0 ? -42 - Math.sin(frame * 0.25) * 10 : -18;
  const rafiRightElbow = rafiLip >= 0 ? -52 : -20;
  const sumonLeftArm = sumonLip >= 0 ? 58 + Math.sin(frame * 0.3) * 12 : 28;
  const sumonLeftElbow = sumonLip >= 0 ? 54 : 26;

  // Golden speakerphone audio wave bars in Part 2
  const waveBars = [0.4, 0.75, 1, 0.85, 0.55, 0.95, 0.65, 0.45];

  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden', background: '#111826' }}>
      {!isPart2 ? (
        /* ================= PART 1: DHAKA NIGHT WORKSHOP ("সুমন এসি সার্ভিস") ================= */
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          {/* Night sky & Dhaka skyline silhouette with rooftop water tanks */}
          <rect x={0} y={0} width={1080} height={1340} fill="#111A2B" />
          {/* Crescent moon & crisp stars */}
          <circle cx={880} cy={224} r={34} fill="#F7E3A1" />
          <circle cx={894} cy={214} r={30} fill="#111A2B" />
          {[
            [140, 190],
            [310, 160],
            [520, 210],
            [720, 175],
            [960, 310],
          ].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={2.5} fill="#E2E8F0" opacity={0.6 + 0.3 * Math.sin(frame * 0.1 + i)} />
          ))}

          {/* Dhaka distant apartments + overhead water tanks */}
          <g fill="#19253B" stroke="#0D1422" strokeWidth={2}>
            <rect x={20} y={390} width={140} height={420} />
            <rect x={60} y={350} width={54} height={40} rx={4} />
            <rect x={180} y={440} width={170} height={370} />
            <rect x={710} y={400} width={160} height={410} />
            <rect x={764} y={362} width={52} height={38} rx={4} />
            <rect x={890} y={460} width={170} height={350} />
          </g>
          {/* Warm lit apartment windows */}
          {[
            [52, 430],
            [104, 430],
            [52, 490],
            [746, 444],
            [808, 502],
          ].map(([wx, wy], i) => (
            <rect key={i} x={wx} y={wy} width={22} height={28} fill="#E6B85C" opacity={0.65} />
          ))}

          {/* Left Streetlamp + Warm Tungsten Light Cone + Drifting Moths */}
          <rect x={62} y={248} width={14} height={1110} fill="#334155" stroke="#0F172A" strokeWidth={2} />
          <path d="M 69 258 L 200 258 L 200 282" fill="none" stroke="#334155" strokeWidth={12} strokeLinecap="round" />
          <polygon points="178,288 222,288 410,1340 40,1340" fill="#FFE08A" opacity={0.13} />
          <ellipse cx={200} cy={288} rx={26} ry={10} fill="#FFF0B8" stroke="#8C6414" strokeWidth={2} />
          <circle cx={moth1X} cy={moth1Y} r={3.2} fill="#FFF7D6" />
          <circle cx={moth2X} cy={moth2Y} r={2.6} fill="#FFF7D6" />

          {/* SUMON AC SERVICE GARAGE FRONT (x: 240..980, y: 490..1340) */}
          <rect x={244} y={536} width={730} height={804} fill="#1E2B3A" stroke="#0D1420" strokeWidth={3} />
          {/* Rolled-up corrugated shop shutter */}
          <rect x={274} y={562} width={670} height={86} fill="#334559" stroke="#16202C" strokeWidth={2.4} />
          {[582, 602, 622].map((sy) => (
            <line key={sy} x1={276} y1={sy} x2={942} y2={sy} stroke="#1D2B3A" strokeWidth={2.5} />
          ))}

          {/* Workshop interior pegboard with hanging wrenches + warm fluorescent tube */}
          <rect x={286} y={648} width={646} height={692} fill="#253445" />
          <rect x={440} y={664} width={338} height={14} rx={7} fill="#E0F7FA" />
          <polygon points="440,678 778,678 900,1340 318,1340" fill="#BCECF2" opacity={0.08} />
          {/* Tool pegboard on back wall */}
          <rect x={446} y={722} width={220} height={154} rx={6} fill="#38495C" stroke="#18222E" strokeWidth={2.2} />
          {[478, 514, 550, 586, 622].map((tx, idx) => (
            <g key={tx}>
              <rect x={tx} y={744} width={10} height={66 + (idx % 2) * 18} rx={3} fill="#CBD5E1" stroke="#1E293B" strokeWidth={1.6} />
              <circle cx={tx + 5} cy={744} r={7} fill="#94A3B8" stroke="#1E293B" strokeWidth={1.6} />
            </g>
          ))}

          {/* Stacked Outdoor AC Condenser Units with Spinning Fans */}
          {[742, 916].map((ay, idx) => (
            <g key={ay} transform={`translate(736, ${ay})`}>
              <rect x={0} y={0} width={182} height={146} rx={6} fill="#DCE3EC" stroke="#1E293B" strokeWidth={2.5} />
              <circle cx={68} cy={73} r={52} fill="#1E293B" stroke="#475569" strokeWidth={3} />
              <g transform={`translate(68, 73) rotate(${idx === 0 ? fanRot : -fanRot * 0.7})`}>
                {[0, 120, 240].map((deg) => (
                  <ellipse
                    key={deg}
                    cx={0}
                    cy={-24}
                    rx={12}
                    ry={24}
                    fill="#64748B"
                    transform={`rotate(${deg})`}
                  />
                ))}
                <circle cx={0} cy={0} r={10} fill="#94A3B8" />
              </g>
              <line x1={134} y1={24} x2={168} y2={24} stroke="#64748B" strokeWidth={4} />
              <line x1={134} y1={42} x2={168} y2={42} stroke="#64748B" strokeWidth={4} />
              <line x1={134} y1={60} x2={168} y2={60} stroke="#64748B" strokeWidth={4} />
            </g>
          ))}

          {/* Hand-painted Bengali Workshop Signboard ("সুমন এসি সার্ভিস") */}
          <g transform="translate(260, 424)">
            <rect x={6} y={6} width={696} height={116} rx={10} fill="#080C14" opacity={0.55} />
            <rect x={0} y={0} width={696} height={116} rx={10} fill="#144E52" stroke="#D4AF37" strokeWidth={4} />
            <rect x={10} y={10} width={676} height={96} rx={6} fill="none" stroke="#6BD4CC" strokeWidth={1.6} strokeDasharray="8 5" />
            <text x={348} y={62} textAnchor="middle" fill="#FFFDF7" fontFamily={BENGALI_FONT} fontSize={44} fontWeight={700}>
              সুমন এসি সার্ভিস
            </text>
            <text x={348} y={96} textAnchor="middle" fill="#F6DC8C" fontFamily={BENGALI_FONT} fontSize={22} fontWeight={600}>
              এসি মেরামত ও সার্ভিসিং · রাত দিন খোলা
            </text>
          </g>

          {/* Wet asphalt Dhaka street floor */}
          <rect x={0} y={1340} width={1080} height={580} fill="#18202B" />
          <line x1={0} y1={1340} x2={1080} y2={1340} stroke="#334155" strokeWidth={4} />

          {/* Small roadside steaming tea kettle on wooden stool */}
          <g transform="translate(866, 1252)">
            <rect x={-36} y={32} width={72} height={12} rx={2} fill="#6E4A2E" stroke="#2D1B0D" strokeWidth={2} />
            <rect x={-26} y={44} width={10} height={44} fill="#5A3A22" />
            <rect x={16} y={44} width={10} height={44} fill="#5A3A22" />
            {/* Aluminum kettle */}
            <path d="M -22 32 L -16 -2 L 16 -2 L 22 32 Z" fill="#CBD5E1" stroke="#334155" strokeWidth={2} />
            <path d="M -14 -2 Q 0 -22 14 -2" fill="none" stroke="#334155" strokeWidth={3} />
            <path d="M -20 12 L -36 2" stroke="#94A3B8" strokeWidth={6} strokeLinecap="round" />
            {/* Rising steam curls */}
            <path
              d={`M -34 ${-8 - (frame % 16)} Q -42 ${-22 - (frame % 16)} -30 ${-36 - (frame % 16)}`}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.65}
            />
          </g>

          {/* RAFI (humble resolve, asking Sumon for work) */}
          <CharacterRig
            character="rafi"
            rafiOutfit="flashback"
            frame={frame}
            x={336}
            y={892}
            scale={1.1}
            expression="worried"
            lipSyncShape={rafiLip}
            leftArmAngle={16}
            leftElbowAngle={18}
            rightArmAngle={rafiRightArm}
            rightElbowAngle={rafiRightElbow}
            showLegs={true}
            headTilt={4}
            uid="s5-rafi"
          />

          {/* SUMON (energetic cheerful mechanic friend) */}
          <CharacterRig
            character="sumon"
            frame={frame}
            x={692}
            y={888}
            scale={1.12}
            expression="happy"
            lipSyncShape={sumonLip}
            leftArmAngle={sumonLeftArm}
            leftElbowAngle={sumonLeftElbow}
            rightArmAngle={-20}
            rightElbowAngle={-24}
            showLegs={true}
            headTilt={-4}
            uid="s5-sumon"
          />

          {/* Editorial offer badge when Sumon speaks */}
          {localFrame >= 88 && (
            <g transform="translate(534, 696)">
              <rect x={4} y={4} width={386} height={74} rx={10} fill="#080D14" opacity={0.55} />
              <rect x={0} y={0} width={386} height={74} rx={10} fill="#12383D" stroke="#6BD4CC" strokeWidth={2.5} />
              <text x={193} y={46} textAnchor="middle" fill="#E6FFFC" fontFamily={BENGALI_FONT} fontSize={27} fontWeight={700}>
                দিনে ৫০০ টাকা + চা ফ্রি!
              </text>
            </g>
          )}
        </svg>
      ) : (
        /* ================= PART 2: "২ মাস পর" — FATHER'S DIGNIFIED VIDEO CALL FLIP ================= */
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          <rect x={0} y={0} width={1080} height={1920} fill="#141C28" />
          {/* Warm golden dignity radiance behind Baba's call screen */}
          <circle cx={430} cy={620} r={340} fill="#D4AF37" opacity={0.11} />

          {/* Top Time-Jump Editorial Tag (strictly inside safe zone y: 184..258) */}
          <g transform={`translate(292, 186) scale(${0.92 + 0.08 * part2Pop})`}>
            <rect x={4} y={4} width={416} height={68} rx={10} fill="#080C14" opacity={0.5} />
            <rect x={0} y={0} width={416} height={68} rx={10} fill="#2B2110" stroke="#D4AF37" strokeWidth={2.6} />
            <text x={208} y={45} textAnchor="middle" fill="#F7DC88" fontFamily={BENGALI_FONT} fontSize={31} fontWeight={700}>
              ২ মাস পর · ভিডিও কলে বাবা
            </text>
          </g>

          {/* LARGE GOLDEN-FRAMED SPEAKERPHONE CALL FRAME SHOWING BABA (x: 84..740, y: 294..910) */}
          <g transform="translate(86, 296)">
            <rect x={8} y={8} width={640} height={616} rx={20} fill="#080C12" opacity={0.5} />
            <rect x={0} y={0} width={640} height={616} rx={20} fill="#F2E7D3" stroke="#D4AF37" strokeWidth={4} />
            {/* Call header bar */}
            <rect x={16} y={16} width={608} height={54} rx={10} fill="#1B2836" />
            <circle cx={44} cy={43} r={8} fill="#2EC4B6" />
            <text x={66} y={51} fill="#FFFDF7" fontFamily={BENGALI_FONT} fontSize={25} fontWeight={700}>
              বাবা · স্পিকারফোন চালু
            </text>

            {/* Animated Golden Speakerphone Audio Waves */}
            <g transform="translate(466, 43)">
              {waveBars.map((amp, i) => {
                const h =
                  babaLip >= 0
                    ? 8 + Math.abs(Math.sin(frame * 0.35 + i * 0.9)) * 24 * amp
                    : 6;
                return (
                  <rect
                    key={i}
                    x={i * 16}
                    y={-h / 2}
                    width={9}
                    height={h}
                    rx={4}
                    fill="#D4AF37"
                  />
                );
              })}
            </g>

            {/* Clip Baba inside video call window */}
            <defs>
              <clipPath id="s5-baba-screen">
                <rect x={16} y={82} width={608} height={518} rx={12} />
              </clipPath>
            </defs>
            <g clipPath="url(#s5-baba-screen)">
              <rect x={16} y={82} width={608} height={518} fill="#E9DEC8" />
              {/* Warm sunlit home room backdrop */}
              <rect x={44} y={118} width={150} height={180} rx={6} fill="#D5E4E6" stroke="#6E4A2E" strokeWidth={5} />
              <CharacterRig
                character="baba"
                frame={frame}
                x={320}
                y={336}
                scale={1.48}
                expression="realization"
                lipSyncShape={babaLip}
                leftArmAngle={20}
                leftElbowAngle={24}
                rightArmAngle={-24}
                rightElbowAngle={-28}
                headTilt={0}
                uid="s5-baba"
              />
            </g>
          </g>

          {/* CHA-CHA FROZEN IN STUNNED SILENCE ON RIGHT */}
          <g transform="translate(0, 0)">
            <CharacterRig
              character="chacha"
              frame={frame}
              x={818}
              y={888}
              scale={1.08}
              expression="shocked"
              lipSyncShape={-1}
              leftArmAngle={48}
              leftElbowAngle={64}
              rightArmAngle={-18}
              rightElbowAngle={-20}
              leftProp="phone"
              headTilt={-4}
              uid="s5-chacha"
            />
            {/* Editorial stunned shock marks near Cha-cha's cap */}
            <g stroke="#E05A47" strokeWidth={4} strokeLinecap="round" opacity={interpolate(part2Frame, [10, 26], [0, 1], { extrapolateRight: 'clamp' })}>
              <line x1={890} y1={792} x2={916} y2={772} />
              <line x1={900} y1={822} x2={930} y2={816} />
              <line x1={888} y1={852} x2={916} y2={862} />
            </g>
          </g>

          {/* Key Dignity Callout Strip */}
          <g transform="translate(86, 948)">
            <rect x={0} y={0} width={540} height={74} rx={10} fill="#143A36" stroke="#2EC4B6" strokeWidth={2.5} />
            <text x={270} y={46} textAnchor="middle" fill="#D5FCF7" fontFamily={BENGALI_FONT} fontSize={26} fontWeight={700}>
              “ছেলে চুরি করে না, কাজ শিখতেছে!”
            </text>
          </g>
        </svg>
      )}
    </div>
  );
};
