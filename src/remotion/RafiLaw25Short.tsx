import React, { useMemo } from 'react';
import { Audio, staticFile, useCurrentFrame } from 'remotion';
import audioTimingData from './audio-timing.json';
import { EditorialGrain } from './components/EditorialGrain';
import { SubtitleBar } from './components/SubtitleBar';
import { TransitionVeil } from './components/TransitionVeil';
import { Scene01ColdOpen } from './scenes/Scene01ColdOpen';
import { Scene02SplitCall } from './scenes/Scene02SplitCall';
import { Scene03Flashback } from './scenes/Scene03Flashback';
import { Scene04Montage } from './scenes/Scene04Montage';
import { Scene05Resolve } from './scenes/Scene05Resolve';
import { Scene06BrainCutaway } from './scenes/Scene06BrainCutaway';
import { Scene07Comparison } from './scenes/Scene07Comparison';
import { Scene08BookQuote } from './scenes/Scene08BookQuote';
import { Scene09Turnaround } from './scenes/Scene09Turnaround';
import { Scene10Finale } from './scenes/Scene10Finale';
import {
  getActiveCue,
  getActiveScene,
  resolveDialogueCues,
  type AudioTimingManifest,
} from './timeline';

export const RafiLaw25Short: React.FC = () => {
  const frame = useCurrentFrame();
  const cues = useMemo(
    () => resolveDialogueCues(audioTimingData as unknown as AudioTimingManifest),
    []
  );

  const activeScene = getActiveScene(frame);
  const localFrame = frame - activeScene.startFrame;
  const activeCue = getActiveCue(frame, cues);

  const renderScene = (): React.ReactNode => {
    switch (activeScene.id) {
      case 1:
        return <Scene01ColdOpen frame={frame} localFrame={localFrame} cues={cues} />;
      case 2:
        return <Scene02SplitCall frame={frame} localFrame={localFrame} cues={cues} />;
      case 3:
        return <Scene03Flashback frame={frame} localFrame={localFrame} cues={cues} />;
      case 4:
        return <Scene04Montage frame={frame} localFrame={localFrame} cues={cues} />;
      case 5:
        return <Scene05Resolve frame={frame} localFrame={localFrame} cues={cues} />;
      case 6:
        return <Scene06BrainCutaway frame={frame} localFrame={localFrame} cues={cues} />;
      case 7:
        return <Scene07Comparison frame={frame} localFrame={localFrame} cues={cues} />;
      case 8:
        return <Scene08BookQuote frame={frame} localFrame={localFrame} cues={cues} />;
      case 9:
        return <Scene09Turnaround frame={frame} localFrame={localFrame} cues={cues} />;
      case 10:
      default:
        return <Scene10Finale frame={frame} localFrame={localFrame} cues={cues} />;
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: 1080,
        height: 1920,
        overflow: 'hidden',
        backgroundColor: '#0D131D',
      }}
    >
      {/* Master 90.00s mixed voiceover + cinema SFX + ducked ambient piano bed */}
      <Audio src={staticFile('audio/voiceover.mp3')} />

      {/* Active Scene Layer */}
      {renderScene()}

      {/* Tactile 2D Editorial Print Stipple Texture */}
      <EditorialGrain />

      {/* Seamless 10-12 frame color-matched dissolve veil at scene boundaries */}
      <TransitionVeil frame={frame} />

      {/* Frame-locked Bengali Subtitle Bar strictly inside safe zone y: 1380..1546 */}
      <SubtitleBar cue={activeCue} />
    </div>
  );
};
