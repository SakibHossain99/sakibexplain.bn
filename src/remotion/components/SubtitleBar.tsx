import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BENGALI_FONT } from '../fonts';
import { SPEAKER_PROFILES, type DialogueCue } from '../timeline';

interface SubtitleBarProps {
  cue: DialogueCue | null;
}

/**
 * Layered obsidian-glass Bengali subtitle card strictly inside YouTube Shorts
 * safe zone (x: 68..932, y: 1380..1546), with specular top bevel, speaker-colored
 * bottom accent border, floating top-rim Bengali speaker pill, and spring pop-in.
 */
export const SubtitleBar: React.FC<SubtitleBarProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!cue) return null;

  const profile = SPEAKER_PROFILES[cue.speaker];
  const localFrame = Math.max(0, frame - cue.startFrame);
  const pop = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 210, mass: 0.7 },
  });

  // Gentle fade out on the final 4 frames of the cue
  const framesLeft = cue.endFrame - frame;
  const exitOpacity = framesLeft <= 4 ? Math.max(0, framesLeft / 4) : 1;
  const opacity = Math.min(1, pop * 1.15) * exitOpacity;
  const translateY = (1 - pop) * 18;
  const scale = 0.96 + 0.04 * pop;

  // Slightly tighten font size for the longest finale line so it stays comfortably inside y: 1380..1546
  const isLongLine = cue.text.length > 78;
  const fontSize = isLongLine ? 29 : 34;

  return (
    <div
      style={{
        position: 'absolute',
        left: 68,
        top: 1380,
        width: 864,
        height: 166,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        pointerEvents: 'none',
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: 'center bottom',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 116,
          maxHeight: 146,
          borderRadius: 16,
          padding: '24px 28px 18px 28px',
          background: '#111720',
          border: '2px solid rgba(255, 255, 255, 0.16)',
          borderBottom: `5px solid ${profile.accentColor}`,
          boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Crisp editorial top-rim Bengali speaker tag */}
        <div
          style={{
            position: 'absolute',
            top: -21,
            left: 24,
            padding: '4px 18px',
            borderRadius: 8,
            background: profile.pillBg,
            border: `2.5px solid ${profile.accentColor}`,
            boxShadow: '3px 3px 0px rgba(0, 0, 0, 0.5)',
            fontFamily: BENGALI_FONT,
            fontSize: 22,
            fontWeight: 700,
            color: profile.pillText,
            letterSpacing: '0.01em',
            lineHeight: 1.2,
          }}
        >
          {profile.bengaliName}
        </div>

        {/* Bengali subtitle text */}
        <div
          style={{
            fontFamily: BENGALI_FONT,
            fontSize,
            fontWeight: 600,
            color: '#F8FAFC',
            textAlign: 'center',
            lineHeight: 1.32,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.65)',
          }}
        >
          {cue.text}
        </div>
      </div>
    </div>
  );
};
