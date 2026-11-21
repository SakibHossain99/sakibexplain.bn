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
 * Scene 04 (0:29 - 0:40 | Frames 870-1200): 41 Failed Exams & Mother's Sacrifice.
 * 3 meticulous editorial 2D beats:
 *  Beat 1 (0..115f): Kraft "বাবার পেনশন" envelope + Taka banknotes draining into 41 exam
 *                    admit cards getting slammed with tilted crimson "✕" stamps.
 *  Beat 2 (115..225f): Jewelry shop counter with hanging brass pendants & animated antique
 *                      brass balance scale tilting as Ma (earringsState="gone") places her
 *                      gold jhumkas onto the crimson velvet tray.
 *  Beat 3 (225..330f): Gazette "চূড়ান্ত মেধা তালিকা" with animated brass magnifying glass
 *                      scanning rolls before heavy red stamps slam: "রোল নেই" & "বয়সসীমা শেষ".
 */
export const Scene04Montage: React.FC<SceneProps> = ({ frame, localFrame }) => {
  const { fps } = useVideoConfig();

  const beat = localFrame < 115 ? 1 : localFrame < 225 ? 2 : 3;

  // Beat 1: Exam counter 1 -> 41 & rapidly slamming stamps
  const examCount = Math.min(
    41,
    Math.max(1, Math.round(interpolate(localFrame, [6, 98], [1, 41], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })))
  );
  const pensionPct = Math.round(
    interpolate(localFrame, [8, 102], [100, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );

  // Beat 2: Antique balance scale tipping as earrings land
  const beat2Frame = Math.max(0, localFrame - 115);
  const scaleTilt = interpolate(beat2Frame, [16, 48, 70], [0, -14, -11], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const maHandLift = interpolate(beat2Frame, [0, 32], [44, 72], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Beat 3: Gazette scan + two heavy crimson stamp slams with micro camera shake
  const beat3Frame = Math.max(0, localFrame - 225);
  const magnifierY = interpolate(beat3Frame, [0, 34], [520, 810], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const stamp1Spring = spring({
    frame: Math.max(0, beat3Frame - 34),
    fps,
    config: { damping: 12, stiffness: 280 },
  });
  const stamp2Spring = spring({
    frame: Math.max(0, beat3Frame - 58),
    fps,
    config: { damping: 12, stiffness: 280 },
  });
  const shake1 = beat3Frame >= 34 && beat3Frame < 42 ? Math.sin(beat3Frame * 3.1) * 7 : 0;
  const shake2 = beat3Frame >= 58 && beat3Frame < 66 ? Math.sin(beat3Frame * 3.3) * 8 : 0;

  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden', background: '#1D222B' }}>
      {/* ================= BEAT 1: PENSION -> 41 FAILED EXAM ADMIT CARDS ================= */}
      {beat === 1 && (
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          {/* Dark slate desk mat with editorial cutting grid */}
          <rect x={0} y={0} width={1080} height={1920} fill="#1E2530" />
          {[120, 240, 360, 480, 600, 720, 840, 960].map((gx) => (
            <line key={gx} x1={gx} y1={0} x2={gx} y2={1920} stroke="#2A3444" strokeWidth={1.5} />
          ))}
          {[200, 400, 600, 800, 1000, 1200, 1400].map((gy) => (
            <line key={gy} x1={0} y1={gy} x2={1080} y2={gy} stroke="#2A3444" strokeWidth={1.5} />
          ))}

          {/* Top Editorial Counter Header (inside safe zone y: 185..310) */}
          <g transform="translate(76, 188)">
            <rect x={5} y={5} width={848} height={112} rx={14} fill="#0B0E14" opacity={0.5} />
            <rect x={0} y={0} width={848} height={112} rx={14} fill="#26181A" stroke="#E05A47" strokeWidth={3} />
            <text x={32} y={48} fill="#FFD5CE" fontFamily={BENGALI_FONT} fontSize={27} fontWeight={700}>
              সরকারি চাকরির পরীক্ষা
            </text>
            <text x={32} y={88} fill="#9AA4B2" fontFamily={BENGALI_FONT} fontSize={22} fontWeight={600}>
              চাকরি হয়েছে: ০টি · বাবার পেনশন বাকি: {pensionPct}%
            </text>
            {/* Big red counter box */}
            <rect x={630} y={16} width={196} height={80} rx={10} fill="#9E2A2B" stroke="#F6DC8C" strokeWidth={2.2} />
            <text x={728} y={69} textAnchor="middle" fill="#FFFDF7" fontFamily={BENGALI_FONT} fontSize={44} fontWeight={700}>
              {examCount} / ৪১
            </text>
          </g>

          {/* Kraft "বাবার পেনশন" Envelope + Draining Taka Banknotes (y: 344..560) */}
          <g transform="translate(110, 356)">
            <rect x={8} y={8} width={340} height={192} rx={8} fill="#0F141B" opacity={0.45} />
            <rect x={0} y={0} width={340} height={192} rx={8} fill="#DFC9A1" stroke="#5A4528" strokeWidth={3} />
            <polyline points="0,0 170,84 340,0" fill="#CEB486" stroke="#5A4528" strokeWidth={2.5} />
            <rect x={64} y={96} width={212} height={46} rx={6} fill="#3B2B18" />
            <text x={170} y={128} textAnchor="middle" fill="#F6DC8C" fontFamily={BENGALI_FONT} fontSize={25} fontWeight={700}>
              বাবার পেনশন
            </text>
            {/* Draining banknote bar */}
            <rect x={38} y={158} width={264} height={16} rx={4} fill="#9C845E" />
            <rect x={38} y={158} width={(264 * pensionPct) / 100} height={16} rx={4} fill="#2E7D5E" />
          </g>

          {/* Flying Taka notes draining from envelope into exam fees */}
          {[0, 1, 2].map((idx) => {
            const p = ((localFrame * 0.03 + idx * 0.33) % 1);
            const nx = 440 + p * 170;
            const ny = 420 + Math.sin(p * Math.PI) * -44 + p * 80;
            return (
              <g key={idx} transform={`translate(${nx}, ${ny}) rotate(${-14 + p * 28})`} opacity={1 - p * 0.6}>
                <rect x={0} y={0} width={92} height={44} rx={4} fill="#3A8C6E" stroke="#184735" strokeWidth={2} />
                <circle cx={46} cy={22} r={12} fill="#88D1B5" opacity={0.75} />
                <text x={46} y={28} textAnchor="middle" fill="#103326" fontFamily={BENGALI_FONT} fontSize={18} fontWeight={700}>
                  ৳
                </text>
              </g>
            );
          })}

          {/* Right side summary badge */}
          <g transform="translate(620, 396)">
            <rect x={0} y={0} width={296} height={126} rx={12} fill="#161D26" stroke="#D4AF37" strokeWidth={2.4} />
            <text x={148} y={48} textAnchor="middle" fill="#F6DC8C" fontFamily={BENGALI_FONT} fontSize={26} fontWeight={700}>
              আবেদন ফি ও যাতায়াত
            </text>
            <text x={148} y={92} textAnchor="middle" fill="#E05A47" fontFamily={BENGALI_FONT} fontSize={32} fontWeight={700}>
              সব পেনশন শেষ
            </text>
          </g>

          {/* Grid of 6 Detailed Admit Cards Rapidly Getting Slammed with Red Reject Stamps */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const cx = 86 + col * 424;
            const cy = 610 + row * 238;
            const stampDelay = 12 + i * 14;
            const stamped = localFrame >= stampDelay;
            const stampScale = stamped
              ? interpolate(localFrame - stampDelay, [0, 6], [1.65, 1], { extrapolateRight: 'clamp' })
              : 0;
            const examNum = Math.min(41, 6 * i + 7);
            return (
              <g key={i} transform={`translate(${cx}, ${cy})`}>
                <rect x={6} y={6} width={392} height={206} rx={10} fill="#0B0E14" opacity={0.45} />
                <rect x={0} y={0} width={392} height={206} rx={10} fill="#F7F1E3" stroke="#5A4B38" strokeWidth={2.4} />
                {/* Card top header */}
                <rect x={0} y={0} width={392} height={42} rx={8} fill="#25364A" />
                <text x={18} y={29} fill="#F8FAFC" fontFamily={BENGALI_FONT} fontSize={21} fontWeight={700}>
                  প্রবেশপত্র #{examNum}
                </text>
                {/* Passport photo placeholder */}
                <rect x={286} y={56} width={84} height={96} rx={4} fill="#D5DEE8" stroke="#64748B" strokeWidth={1.6} />
                <circle cx={328} cy={88} r={17} fill="#D99C73" />
                <path d="M 304 148 Q 328 114 352 148 Z" fill="#89B4D4" />
                {/* Printed Bengali exam lines */}
                <line x1={20} y1={74} x2={250} y2={74} stroke="#475569" strokeWidth={5} strokeLinecap="round" />
                <line x1={20} y1={104} x2={210} y2={104} stroke="#94A3B8" strokeWidth={4} strokeLinecap="round" />
                <line x1={20} y1={134} x2={236} y2={134} stroke="#94A3B8" strokeWidth={4} strokeLinecap="round" />
                <line x1={20} y1={174} x2={140} y2={174} stroke="#64748B" strokeWidth={3} strokeLinecap="round" />

                {/* Heavy Red Editorial Rejection Stamp */}
                {stamped && (
                  <g transform={`translate(178, 114) rotate(${-14 + (i % 2) * 8}) scale(${stampScale})`}>
                    <rect
                      x={-112}
                      y={-36}
                      width={224}
                      height={72}
                      rx={8}
                      fill="#9E2A2B"
                      fillOpacity={0.14}
                      stroke="#C23A2B"
                      strokeWidth={5}
                    />
                    <text
                      x={0}
                      y={12}
                      textAnchor="middle"
                      fill="#C23A2B"
                      fontFamily={BENGALI_FONT}
                      fontSize={34}
                      fontWeight={700}
                    >
                      ✕ অকৃতকার্য
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      )}

      {/* ================= BEAT 2: JEWELRY SHOP COUNTER — MA'S EARRINGS SACRIFICE ================= */}
      {beat === 2 && (
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          {/* Warm amber jewelry shop interior */}
          <rect x={0} y={0} width={1080} height={1920} fill="#261A14" />
          {/* Background glass display cabinets */}
          {[90, 410, 730].map((cx) => (
            <g key={cx} transform={`translate(${cx}, 320)`}>
              <rect x={0} y={0} width={250} height={460} rx={8} fill="#36241B" stroke="#8C672A" strokeWidth={3} />
              <line x1={12} y1={150} x2={238} y2={150} stroke="#A87E34" strokeWidth={3} />
              <line x1={12} y1={300} x2={238} y2={300} stroke="#A87E34" strokeWidth={3} />
              {/* Blurred editorial necklace stands */}
              <polygon points="56,144 74,90 92,144" fill="#6E1D21" />
              <polygon points="154,144 172,90 190,144" fill="#6E1D21" />
              <path d="M 62 110 Q 74 128 86 110" fill="none" stroke="#D4AF37" strokeWidth={3} />
              <path d="M 160 110 Q 172 128 184 110" fill="none" stroke="#D4AF37" strokeWidth={3} />
            </g>
          ))}

          {/* Hanging warm brass pendant lamps + soft light cones */}
          {[280, 740].map((lx) => (
            <g key={lx}>
              <line x1={lx} y1={0} x2={lx} y2={280} stroke="#C9A03C" strokeWidth={3} />
              <polygon points={`${lx},300 ${lx - 180},1080 ${lx + 180},1080`} fill="#FFE49E" opacity={0.11} />
              <path d={`M ${lx - 42} 308 Q ${lx} 262 ${lx + 42} 308 Z`} fill="#D4AF37" stroke="#5A420C" strokeWidth={2.4} />
            </g>
          ))}

          {/* MA WITHOUT EARRINGS (earringsState="gone"!) placing her jhumkas onto the tray */}
          <CharacterRig
            character="ma"
            earringsState="gone"
            frame={frame}
            x={336}
            y={712}
            scale={1.24}
            expression="sad"
            lipSyncShape={-1}
            leftArmAngle={14}
            leftElbowAngle={14}
            rightArmAngle={-maHandLift}
            rightElbowAngle={-18}
            rightProp={beat2Frame < 24 ? 'earrings' : 'none'}
            glisteningEyes={true}
            headTilt={6}
            uid="s4-ma"
          />

          {/* RICH WOODEN JEWELER COUNTER (y = 1048) */}
          <rect x={0} y={1048} width={1080} height={872} fill="#4D2E1D" stroke="#211109" strokeWidth={4} />
          <rect x={0} y={1048} width={1080} height={46} fill="#6E4229" stroke="#211109" strokeWidth={3} />
          <line x1={0} y1={1096} x2={1080} y2={1096} stroke="#D4AF37" strokeWidth={3} />

          {/* Crimson Velvet Jeweler Tray with Glowing Gold Earrings (appears once placed!) */}
          <g transform="translate(500, 1020)">
            <ellipse cx={120} cy={38} rx={124} ry={28} fill="#7A1C20" stroke="#D4AF37" strokeWidth={3} />
            <ellipse cx={120} cy={36} rx={104} ry={20} fill="#962429" />
            {beat2Frame >= 22 && (
              <g opacity={interpolate(beat2Frame, [22, 30], [0, 1], { extrapolateRight: 'clamp' })}>
                <g transform="translate(88, 30)">
                  <circle cx={0} cy={0} r={8} fill="#F7D76B" stroke="#7A560C" strokeWidth={1.8} />
                  <path d="M -11 8 Q 0 28 11 8 Z" fill="#D4AF37" stroke="#7A560C" strokeWidth={1.8} />
                </g>
                <g transform="translate(152, 32)">
                  <circle cx={0} cy={0} r={8} fill="#F7D76B" stroke="#7A560C" strokeWidth={1.8} />
                  <path d="M -11 8 Q 0 28 11 8 Z" fill="#D4AF37" stroke="#7A560C" strokeWidth={1.8} />
                </g>
              </g>
            )}
          </g>

          {/* ANTIQUE BRASS JEWELER'S BALANCE SCALE (resting on counter, tilting under weight) */}
          <g transform="translate(838, 1052)">
            {/* Brass pedestal base */}
            <path d="M -52 0 L 52 0 L 36 -22 L -36 -22 Z" fill="#C99B32" stroke="#4D370A" strokeWidth={2.4} />
            <rect x={-7} y={-246} width={14} height={224} fill="#D4AF37" stroke="#4D370A" strokeWidth={2.2} />
            <circle cx={0} cy={-250} r={12} fill="#F7D76B" stroke="#4D370A" strokeWidth={2} />
            {/* Animated tilting balance beam */}
            <g transform={`translate(0, -242) rotate(${scaleTilt})`}>
              <rect x={-114} y={-5} width={228} height={10} rx={5} fill="#D4AF37" stroke="#4D370A" strokeWidth={2} />
              {/* Left pan (heavier with gold) */}
              <g transform={`translate(-104, 0) rotate(${-scaleTilt})`}>
                <line x1={0} y1={0} x2={-28} y2={92} stroke="#B88E2B" strokeWidth={2} />
                <line x1={0} y1={0} x2={28} y2={92} stroke="#B88E2B" strokeWidth={2} />
                <path d="M -38 92 Q 0 118 38 92 Z" fill="#D4AF37" stroke="#4D370A" strokeWidth={2} />
              </g>
              {/* Right pan (brass weight) */}
              <g transform={`translate(104, 0) rotate(${-scaleTilt})`}>
                <line x1={0} y1={0} x2={-28} y2={92} stroke="#B88E2B" strokeWidth={2} />
                <line x1={0} y1={0} x2={28} y2={92} stroke="#B88E2B" strokeWidth={2} />
                <path d="M -38 92 Q 0 118 38 92 Z" fill="#D4AF37" stroke="#4D370A" strokeWidth={2} />
                <rect x={-12} y={76} width={24} height={16} rx={3} fill="#7A560C" />
              </g>
            </g>
          </g>

          {/* Editorial caption card (inside safe zone y: 185..286) */}
          <g transform="translate(88, 190)">
            <rect x={5} y={5} width={824} height={90} rx={12} fill="#0F0806" opacity={0.5} />
            <rect x={0} y={0} width={824} height={90} rx={12} fill="#3B1A19" stroke="#D4AF37" strokeWidth={2.6} />
            <text x={412} y={56} textAnchor="middle" fill="#FFF3D4" fontFamily={BENGALI_FONT} fontSize={32} fontWeight={700}>
              শেষ পরীক্ষার ফি দিতে মা বেচলেন কানের দুল
            </text>
          </g>
        </svg>
      )}

      {/* ================= BEAT 3: GAZETTE MERIT LIST + RED STAMPS ================= */}
      {beat === 3 && (
        <svg
          width={1080}
          height={1920}
          viewBox="0 0 1080 1920"
          style={{ transform: `translate(${shake1 + shake2}px, ${(shake1 - shake2) * 0.6}px)` }}
        >
          <rect x={0} y={0} width={1080} height={1920} fill="#181F29" />

          {/* Official Printed Government Gazette Sheet (strictly inside safe zone x: 84..916, y: 210..1310) */}
          <g transform="translate(84, 214)">
            <rect x={10} y={10} width={832} height={1080} rx={8} fill="#080B10" opacity={0.5} />
            <rect x={0} y={0} width={832} height={1080} rx={8} fill="#F5EFE1" stroke="#5A4B38" strokeWidth={3} />
            {/* Gazette masthead */}
            <rect x={24} y={24} width={784} height={116} rx={4} fill="#1D3347" />
            <text x={416} y={76} textAnchor="middle" fill="#FFFDF7" fontFamily={BENGALI_FONT} fontSize={38} fontWeight={700}>
              চূড়ান্ত মেধা তালিকা (গেজেট)
            </text>
            <text x={416} y={116} textAnchor="middle" fill="#B8CBE0" fontFamily={BENGALI_FONT} fontSize={22} fontWeight={600}>
              ৪১তম নিয়োগ পরীক্ষা · উত্তীর্ণ রোল নম্বরসমূহ
            </text>

            {/* 4-column dense gazette roll numbers */}
            {Array.from({ length: 12 }).map((_, row) => {
              const ry = 186 + row * 68;
              return (
                <g key={row}>
                  <line x1={32} y1={ry + 18} x2={800} y2={ry + 18} stroke="#DDD2BD" strokeWidth={1.6} />
                  {[92, 286, 480, 674].map((rx, col) => (
                    <text
                      key={col}
                      x={rx}
                      y={ry}
                      fill="#2B3645"
                      fontFamily="monospace"
                      fontSize={24}
                      fontWeight={700}
                    >
                      {24101 + row * 17 + col * 3}
                    </text>
                  ))}
                </g>
              );
            })}

            {/* Highlighted search bar at bottom of gazette */}
            <rect x={32} y={992} width={768} height={60} rx={6} fill="#EBE0CA" stroke="#8C7656" strokeWidth={2} />
            <text x={416} y={1031} textAnchor="middle" fill="#4A3B28" fontFamily={BENGALI_FONT} fontSize={25} fontWeight={700}>
              রাফির রোল নম্বর: ২৪৮৯২ — তালিকায় পাওয়া যায়নি
            </text>
          </g>

          {/* Animated Brass Magnifying Glass scanning down the gazette */}
          <g transform={`translate(660, ${magnifierY})`}>
            <line x1={52} y1={52} x2={132} y2={132} stroke="#4D2F18" strokeWidth={18} strokeLinecap="round" />
            <line x1={52} y1={52} x2={132} y2={132} stroke="#7A4C28" strokeWidth={10} strokeLinecap="round" />
            <circle cx={0} cy={0} r={74} fill="#DDF3F8" fillOpacity={0.28} stroke="#C69B38" strokeWidth={12} />
            <circle cx={0} cy={0} r={66} fill="none" stroke="#4D370A" strokeWidth={2.5} />
            <path d="M -38 -36 Q -10 -56 26 -38" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
          </g>

          {/* HEAVY CRIMSON STAMP 1: "রোল নেই" */}
          {beat3Frame >= 34 && (
            <g transform={`translate(490, 600) rotate(-11) scale(${0.85 + 0.15 * stamp1Spring + (1 - stamp1Spring) * 0.9})`}>
              <rect x={-246} y={-68} width={492} height={136} rx={12} fill="#F5EFE1" fillOpacity={0.92} stroke="#C23A2B" strokeWidth={9} />
              <rect x={-232} y={-54} width={464} height={108} rx={6} fill="none" stroke="#C23A2B" strokeWidth={2.5} strokeDasharray="8 6" />
              <text x={0} y={24} textAnchor="middle" fill="#C23A2B" fontFamily={BENGALI_FONT} fontSize={74} fontWeight={700}>
                রোল নেই
              </text>
            </g>
          )}

          {/* HEAVY CRIMSON STAMP 2: "বয়সসীমা শেষ" */}
          {beat3Frame >= 58 && (
            <g transform={`translate(500, 860) rotate(8) scale(${0.85 + 0.15 * stamp2Spring + (1 - stamp2Spring) * 0.9})`}>
              <rect x={-286} y={-68} width={572} height={136} rx={12} fill="#2A0F12" stroke="#E05A47" strokeWidth={8} />
              <text x={0} y={22} textAnchor="middle" fill="#FFE0DC" fontFamily={BENGALI_FONT} fontSize={66} fontWeight={700}>
                বয়সসীমা শেষ!
              </text>
            </g>
          )}
        </svg>
      )}
    </div>
  );
};
