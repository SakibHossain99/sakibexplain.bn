import React from 'react';
import { Composition } from 'remotion';
import { RafiLaw25Short } from './RafiLaw25Short';
import { TOTAL_FRAMES, VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from './timeline';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="RafiLaw25Short"
      component={RafiLaw25Short}
      durationInFrames={TOTAL_FRAMES}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
  );
};
