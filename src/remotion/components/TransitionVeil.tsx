import React from 'react';
import { interpolate } from 'remotion';
import { SCENES, TOTAL_FRAMES } from '../timeline';

interface TransitionVeilProps {
  frame: number;
}

/**
 * Renders a smooth 10-12 frame color-matched dissolve veil across every scene
 * boundary so transitions never snap abruptly on a single frame.
 */
export const TransitionVeil: React.FC<TransitionVeilProps> = ({ frame }) => {
  // Subtle fade-in at video start (frames 0..8) and fade-out at end (2690..2700)
  if (frame < 8) {
    const op = interpolate(frame, [0, 8], [0.85, 0], { extrapolateRight: 'clamp' });
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#1E242B',
          opacity: op,
          pointerEvents: 'none',
        }}
      />
    );
  }

  if (frame > TOTAL_FRAMES - 10) {
    const op = interpolate(frame, [TOTAL_FRAMES - 10, TOTAL_FRAMES], [0, 0.35], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#FFF6E5',
          opacity: op,
          pointerEvents: 'none',
        }}
      />
    );
  }

  // Check every internal boundary between scene i and scene i+1
  for (let i = 1; i < SCENES.length; i++) {
    const scene = SCENES[i];
    const boundary = scene.startFrame;
    const half = Math.floor(scene.transitionFrames / 2); // 5-6 frames on each side (10-12f total)
    if (frame >= boundary - half && frame <= boundary + half) {
      const opacity = interpolate(
        frame,
        [boundary - half, boundary, boundary + half],
        [0, 0.92, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: scene.veilColor,
            opacity,
            pointerEvents: 'none',
          }}
        />
      );
    }
  }

  return null;
};
