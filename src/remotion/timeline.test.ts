import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_DIALOGUE_CUES,
  SCENES,
  TOTAL_FRAMES,
  enforceArmPolarity,
  getActiveCue,
  getActiveScene,
  getLipSyncShape,
  isCharacterSpeaking,
  validateTimelineTiling,
} from './timeline';

test('10-scene timeline tiles 0..2700 gaplessly with zero overlaps', () => {
  const result = validateTimelineTiling(SCENES, TOTAL_FRAMES);
  assert.equal(result.valid, true, result.reason);
  assert.equal(SCENES.length, 10);

  // Every single frame 0..2699 resolves to exactly one scene
  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const scene = getActiveScene(f);
    assert.ok(f >= scene.startFrame && f < scene.endFrame);
  }
});

test('dialogue cues are strictly monotonic, non-overlapping, and inside their owning scene', () => {
  assert.equal(DEFAULT_DIALOGUE_CUES.length, 19);

  for (let i = 0; i < DEFAULT_DIALOGUE_CUES.length; i++) {
    const cue = DEFAULT_DIALOGUE_CUES[i];
    const scene = SCENES.find((s) => s.id === cue.sceneId);
    assert.ok(scene, `Scene ${cue.sceneId} missing`);
    assert.ok(
      cue.startFrame >= scene.startFrame && cue.endFrame <= scene.endFrame,
      `Cue ${cue.id} (${cue.startFrame}..${cue.endFrame}) escapes scene ${scene.id} (${scene.startFrame}..${scene.endFrame})`
    );
    if (i > 0) {
      const prev = DEFAULT_DIALOGUE_CUES[i - 1];
      assert.ok(
        cue.startFrame >= prev.endFrame,
        `Cue ${cue.id} overlaps previous cue ${prev.id}`
      );
    }
  }
});

test('lip-sync shape is active ONLY during that character spoken frames', () => {
  // Cha-cha speaks at frame 30 (s01_01: 5..118)
  assert.equal(isCharacterSpeaking('chacha', 30), true);
  assert.equal(isCharacterSpeaking('rafi', 30), false);
  assert.equal(getLipSyncShape('chacha', 30), Math.floor(30 / 4) % 4);
  assert.equal(getLipSyncShape('rafi', 30), -1);

  // Rafi speaks at frame 150 (s01_02: 123..208)
  assert.equal(isCharacterSpeaking('rafi', 150), true);
  assert.equal(getActiveCue(150)?.id, 's01_02');
  assert.equal(getLipSyncShape('rafi', 150), Math.floor(150 / 4) % 4);
  assert.equal(getLipSyncShape('chacha', 150), -1);
});

test('enforceArmPolarity strictly guards SVG left >= 0 and right <= 0 degrees', () => {
  assert.deepEqual(enforceArmPolarity(45, -60), { leftArmAngle: 45, rightArmAngle: -60 });
  assert.deepEqual(enforceArmPolarity(-30, 25), { leftArmAngle: 0, rightArmAngle: 0 });
  assert.deepEqual(enforceArmPolarity(200, -210), { leftArmAngle: 155, rightArmAngle: -155 });
});
