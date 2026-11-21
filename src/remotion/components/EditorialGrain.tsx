import React from 'react';

/**
 * Tactile 2D editorial paper/print stipple grain overlay (lightweight static SVG pattern)
 * that replaces sterile plastic gradients with a crafted 2D animation explainer finish.
 */
export const EditorialGrain: React.FC = () => {
  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0.05,
        mixBlendMode: 'overlay',
      }}
    >
      <defs>
        <pattern id="editorial-stipple" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.9" fill="#FFFFFF" />
          <circle cx="8" cy="5" r="0.8" fill="#000000" />
          <circle cx="5" cy="10" r="0.85" fill="#FFFFFF" />
          <circle cx="11" cy="9" r="0.7" fill="#000000" />
        </pattern>
      </defs>
      <rect x={0} y={0} width={1080} height={1920} fill="url(#editorial-stipple)" />
    </svg>
  );
};
