import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { BENGALI_FONT, SERIF_QUOTE_FONT } from '../fonts';
import { type DialogueCue } from '../timeline';

interface SceneProps {
  frame: number;
  localFrame: number;
  cues: readonly DialogueCue[];
}

/**
 * Scene 08 (1:07 - 1:15 | Frames 2010-2250): Editorial 2D Library Desk + 3D Opening Book Quote.
 * Dark walnut desk with crisp woodgrain, green-shade brass banker's lamp casting warm light cone,
 * inkwell + brass fountain pen, antique crimson-and-gold hardcover "THE 48 LAWS OF POWER — ROBERT GREENE"
 * opening with smooth fading turning page (opacity 1 -> 0 so no stuck vertical flap),
 * animated golden highlighter sweeping across Playfair Display 600 italic Law 25 quote,
 * and embossed Golden Rule Seal ("★ মূল নিয়ম").
 */
export const Scene08BookQuote: React.FC<SceneProps> = ({ frame, localFrame }) => {
  const { fps } = useVideoConfig();

  // Smooth book reveal & page turn (page fades to 0 as it finishes turning)
  const bookOpen = spring({
    frame: localFrame,
    fps,
    config: { damping: 17, stiffness: 135 },
  });
  const pageTurnProgress = interpolate(localFrame, [16, 62], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const turningPageScaleX = Math.cos(pageTurnProgress * Math.PI);
  const turningPageOpacity = interpolate(pageTurnProgress, [0, 0.72, 0.96], [1, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Golden highlighter sweep across 4 quote lines
  const hl1 = interpolate(localFrame, [66, 94], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hl2 = interpolate(localFrame, [92, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hl3 = interpolate(localFrame, [118, 146], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hl4 = interpolate(localFrame, [144, 174], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Embossed Golden Rule Seal pop
  const sealPop = spring({
    frame: Math.max(0, localFrame - 150),
    fps,
    config: { damping: 13, stiffness: 210 },
  });

  // Warm dust motes drifting softly in banker's lamp beam
  const dustOffset = (frame * 0.45) % 80;

  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden', background: '#1A130F' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        {/* Dark Walnut Study Wall & Mahogany Desk Surface */}
        <rect x={0} y={0} width={1080} height={540} fill="#17110E" />
        {/* Bookshelf silhouettes in soft background */}
        <g opacity={0.35}>
          <rect x={70} y={140} width={940} height={18} fill="#3B271B" />
          {[96, 130, 162, 200, 232, 740, 774, 810, 846, 882].map((bx, i) => (
            <rect
              key={bx}
              x={bx}
              y={54 + (i % 3) * 14}
              width={26}
              height={86 - (i % 3) * 14}
              rx={2}
              fill={i % 2 === 0 ? '#5C2622' : '#264442'}
              stroke="#120B08"
              strokeWidth={1.6}
            />
          ))}
        </g>

        {/* Walnut Study Desk Top with Crisp Woodgrain Lines */}
        <rect x={0} y={500} width={1080} height={1420} fill="#2A1C15" />
        <line x1={0} y1={500} x2={1080} y2={500} stroke="#523728" strokeWidth={6} />
        {[580, 690, 820, 960, 1120, 1270].map((wy) => (
          <path
            key={wy}
            d={`M 0 ${wy} Q 340 ${wy + 12} 680 ${wy - 8} T 1080 ${wy + 6}`}
            fill="none"
            stroke="#3B271D"
            strokeWidth={2.2}
          />
        ))}

        {/* GREEN-SHADE BRASS BANKER'S LAMP (top right desk corner, warm golden reading cone) */}
        <g transform="translate(838, 286)">
          {/* Warm volumetric light cone across open book */}
          <polygon points="-16,32 -540,930 120,930 40,32" fill="#FFE6A3" opacity={0.1} />
          {/* Brass base & curved neck */}
          <ellipse cx={42} cy={224} rx={52} ry={14} fill="#B88E2B" stroke="#4D370A" strokeWidth={2.4} />
          <path d="M 42 218 L 42 42 Q 42 10 10 10" fill="none" stroke="#D4AF37" strokeWidth={10} strokeLinecap="round" />
          {/* Classic Emerald Glass Banker's Lampshade */}
          <path d="M -52 38 C -46 -10, 38 -10, 44 38 Z" fill="#1A6B52" stroke="#0C3528" strokeWidth={2.8} />
          <path d="M -38 28 C -30 4, 22 4, 30 28" fill="none" stroke="#5ED1A7" strokeWidth={3} opacity={0.45} />
          <ellipse cx={-4} cy={38} rx={48} ry={8} fill="#FFF2B8" />
        </g>

        {/* Soft floating dust specks inside lamp beam */}
        {[
          [340, 460],
          [520, 520],
          [680, 480],
          [440, 600],
        ].map(([dx, dy], i) => (
          <circle
            key={i}
            cx={dx + Math.sin(frame * 0.04 + i) * 14}
            cy={dy - dustOffset * 0.4 + i * 12}
            r={2.5}
            fill="#FFF2C2"
            opacity={0.45}
          />
        ))}

        {/* ANTIQUE GLASS INKWELL + BRASS FOUNTAIN PEN RESTING ON DESK (bottom left above safe zone) */}
        <g transform="translate(132, 1188)">
          {/* Inkwell bottle */}
          <rect x={0} y={14} width={44} height={42} rx={8} fill="#18222F" stroke="#5A6C82" strokeWidth={2.2} />
          <rect x={10} y={2} width={24} height={14} rx={3} fill="#D4AF37" stroke="#5A420C" strokeWidth={1.8} />
          <rect x={8} y={28} width={28} height={18} rx={2} fill="#F2E7D0" />
          {/* Diagonal vintage fountain pen */}
          <g transform="translate(150, 38) rotate(-14)">
            <rect x={-76} y={-6} width={144} height={12} rx={6} fill="#231D1A" stroke="#D4AF37" strokeWidth={1.8} />
            <polygon points="68,-5 96,0 68,5" fill="#D4AF37" stroke="#5A420C" strokeWidth={1.4} />
            <line x1={-40} y1={-6} x2={-40} y2={6} stroke="#D4AF37" strokeWidth={3} />
          </g>
        </g>

        {/* TOP EDITORIAL LAW BADGE (strictly inside safe zone x: 84..740, y: 186..270) */}
        <g transform="translate(84, 188)">
          <rect x={5} y={5} width={652} height={80} rx={12} fill="#080504" opacity={0.55} />
          <rect x={0} y={0} width={652} height={80} rx={12} fill="#2B1416" stroke="#D4AF37" strokeWidth={2.8} />
          <text x={326} y={50} textAnchor="middle" fill="#F7DC88" fontFamily={BENGALI_FONT} fontSize={31} fontWeight={700}>
            দ্য ৪৮ লজ অব পাওয়ার · আইন ২৫
          </text>
        </g>

        {/* ================= OPEN ANTIQUE HARDCOVER BOOK (strictly inside safe zone x: 74..926, y: 392..1120) ================= */}
        <g transform={`translate(500, 760) scale(${0.9 + 0.1 * bookOpen}) translate(-500, -760)`}>
          {/* Cast book shadow on mahogany desk */}
          <rect x={84} y={422} width={852} height={704} rx={18} fill="#0B0705" opacity={0.58} />

          {/* Crimson-and-Gold Embossed Hardcover Boards */}
          <rect x={74} y={406} width={852} height={704} rx={16} fill="#6E1D21" stroke="#D4AF37" strokeWidth={4} />
          <rect x={86} y={418} width={828} height={680} rx={10} fill="none" stroke="#C99B32" strokeWidth={1.8} />

          {/* Layered paper block edges */}
          <rect x={96} y={428} width={808} height={660} rx={8} fill="#DFD1B4" stroke="#8C7654" strokeWidth={2} />

          {/* LEFT PARCHMENT PAGE */}
          <path
            d="M 104 434 L 496 434 C 500 434, 500 440, 500 444 L 500 1078 C 500 1082, 496 1082, 492 1082 L 104 1082 Z"
            fill="#F6EEDB"
            stroke="#A89370"
            strokeWidth={1.8}
          />
          {/* Left Page Ornamental Book Typography */}
          <rect x={128} y={462} width={344} height={592} fill="none" stroke="#C69B38" strokeWidth={2} />
          <rect x={136} y={470} width={328} height={576} fill="none" stroke="#C69B38" strokeWidth={1} strokeDasharray="5 4" />

          <text x={300} y={548} textAnchor="middle" fill="#6E1D21" fontFamily={SERIF_QUOTE_FONT} fontSize={26} fontWeight={700} letterSpacing={2}>
            THE 48 LAWS
          </text>
          <text x={300} y={584} textAnchor="middle" fill="#6E1D21" fontFamily={SERIF_QUOTE_FONT} fontSize={26} fontWeight={700} letterSpacing={2}>
            OF POWER
          </text>
          <line x1={210} y1={608} x2={390} y2={608} stroke="#C69B38" strokeWidth={2.5} />
          <text x={300} y={646} textAnchor="middle" fill="#5A452A" fontFamily={SERIF_QUOTE_FONT} fontSize={21} fontStyle="italic">
            Robert Greene
          </text>

          {/* Emblematic Law 25 Crest on Left Page */}
          <g transform="translate(300, 774)">
            <circle cx={0} cy={0} r={66} fill="#EBE0C8" stroke="#9E2A2B" strokeWidth={3} />
            <circle cx={0} cy={0} r={54} fill="none" stroke="#C69B38" strokeWidth={1.8} strokeDasharray="4 4" />
            <text x={0} y={-8} textAnchor="middle" fill="#6E1D21" fontFamily={SERIF_QUOTE_FONT} fontSize={22} fontWeight={700}>
              LAW
            </text>
            <text x={0} y={32} textAnchor="middle" fill="#6E1D21" fontFamily={SERIF_QUOTE_FONT} fontSize={44} fontWeight={700}>
              25
            </text>
          </g>

          <text x={300} y={910} textAnchor="middle" fill="#2A1F16" fontFamily={SERIF_QUOTE_FONT} fontSize={25} fontWeight={700}>
            RE-CREATE
          </text>
          <text x={300} y={944} textAnchor="middle" fill="#2A1F16" fontFamily={SERIF_QUOTE_FONT} fontSize={25} fontWeight={700}>
            YOURSELF
          </text>
          <text x={300} y={1006} textAnchor="middle" fill="#7D623C" fontFamily={BENGALI_FONT} fontSize={24} fontWeight={700}>
            নিজেকে নতুন রূপে গড়ো
          </text>

          {/* RIGHT PARCHMENT PAGE WITH GOLDEN HIGHLIGHTER SWEEP */}
          <path
            d="M 500 444 C 500 440, 504 434, 508 434 L 896 434 L 896 1082 L 508 1082 C 504 1082, 500 1082, 500 1078 Z"
            fill="#FAF3E2"
            stroke="#A89370"
            strokeWidth={1.8}
          />
          {/* Subtle central gutter shadow */}
          <rect x={486} y={434} width={28} height={648} fill="#5A4528" opacity={0.14} />
          <line x1={500} y1={434} x2={500} y2={1082} stroke="#7A6242" strokeWidth={2.5} />

          {/* Right page header */}
          <text x={698} y={488} textAnchor="middle" fill="#8C6C3B" fontFamily={SERIF_QUOTE_FONT} fontSize={18} letterSpacing={2.5}>
            JUDGMENT · PAGE 191
          </text>
          <line x1={546} y1={506} x2={852} y2={506} stroke="#D4AF37" strokeWidth={1.8} />

          {/* Animated Golden Marker Highlighter Bars */}
          <rect x={534} y={556} width={332 * hl1} height={36} rx={4} fill="#F7DC79" opacity={0.62} />
          <rect x={534} y={612} width={332 * hl2} height={36} rx={4} fill="#F7DC79" opacity={0.62} />
          <rect x={534} y={668} width={332 * hl3} height={36} rx={4} fill="#F7DC79" opacity={0.62} />
          <rect x={534} y={724} width={316 * hl4} height={36} rx={4} fill="#F7DC79" opacity={0.62} />

          {/* Exact Playfair Display 600 Italic Quote */}
          <text x={542} y={584} fill="#231911" fontFamily={SERIF_QUOTE_FONT} fontSize={27} fontWeight={600} fontStyle="italic">
            “Do not accept the roles
          </text>
          <text x={542} y={640} fill="#231911" fontFamily={SERIF_QUOTE_FONT} fontSize={27} fontWeight={600} fontStyle="italic">
            that society foists on you.
          </text>
          <text x={542} y={696} fill="#231911" fontFamily={SERIF_QUOTE_FONT} fontSize={27} fontWeight={600} fontStyle="italic">
            Re-create yourself by
          </text>
          <text x={542} y={752} fill="#231911" fontFamily={SERIF_QUOTE_FONT} fontSize={27} fontWeight={600} fontStyle="italic">
            forging a new identity.”
          </text>

          {/* Bengali Translation Box inside Right Page */}
          <rect x={534} y={806} width={332} height={110} rx={8} fill="#EFE3C6" stroke="#B68E28" strokeWidth={1.8} />
          <text x={700} y={850} textAnchor="middle" fill="#2A1D12" fontFamily={BENGALI_FONT} fontSize={24} fontWeight={700}>
            সমাজের চাপানো ভূমিকা নয়,
          </text>
          <text x={700} y={890} textAnchor="middle" fill="#6E1D21" fontFamily={BENGALI_FONT} fontSize={24} fontWeight={700}>
            নিজেকে নতুন পরিচয়ে গড়ে তোলো।
          </text>

          {/* EMBOSSED GOLDEN RULE SEAL ("★ মূল নিয়ম") */}
          <g transform={`translate(788, 998) scale(${0.65 + 0.35 * sealPop})`} opacity={sealPop}>
            <polygon points="-24,38 -36,82 -14,72 -4,86 8,42" fill="#9E2A2B" />
            <polygon points="10,40 22,86 34,72 50,82 32,38" fill="#7A1C1E" />
            <circle cx={0} cy={0} r={54} fill="#D4AF37" stroke="#6E4E0D" strokeWidth={3.5} />
            <circle cx={0} cy={0} r={44} fill="#E6C35A" stroke="#8C6414" strokeWidth={1.8} strokeDasharray="5 3" />
            <text x={0} y={-8} textAnchor="middle" fill="#3B2506" fontFamily={BENGALI_FONT} fontSize={20} fontWeight={700}>
              ★ মূল
            </text>
            <text x={0} y={18} textAnchor="middle" fill="#3B2506" fontFamily={BENGALI_FONT} fontSize={22} fontWeight={700}>
              নিয়ম
            </text>
          </g>

          {/* SMOOTH TURNING PARCHMENT PAGE (fades cleanly to 0 before completion — zero stuck flap!) */}
          {turningPageOpacity > 0.01 && (
            <g
              transform={`translate(500, 434) scale(${turningPageScaleX}, 1)`}
              opacity={turningPageOpacity}
            >
              <rect x={0} y={0} width={396} height={648} fill="#F2E6CC" stroke="#9C845E" strokeWidth={2} />
              {[86, 134, 182, 230, 278, 326].map((ly) => (
                <line key={ly} x1={38} y1={ly} x2={342} y2={ly} stroke="#C2B08F" strokeWidth={4} strokeLinecap="round" />
              ))}
            </g>
          )}
        </g>

        {/* Subtle Ribbon Bookmark hanging out bottom of book */}
        <polygon points="488,1110 512,1110 512,1190 500,1174 488,1190" fill="#9E2A2B" stroke="#4D1112" strokeWidth={1.8} />
      </svg>
    </div>
  );
};
