import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseDuration, formatSplit, splitSeconds, weekSummary, validDate, decodeData, emptyData, personalBest, demoWorkouts } from '../src/training.ts';

test('duration accepts minutes or hours and rejects malformed and zero times', () => {
  assert.equal(parseDuration('7:12'), 432);
  assert.equal(parseDuration('1:04:00'), 3840);
  for (const invalid of ['7:99', '0:00', '-2:00', '7.12', '1:60:00', '']) assert.equal(parseDuration(invalid), null);
});
test('rowing splits use 500 meters, preserve tenths and round across minute boundary', () => {
  assert.equal(splitSeconds({ type: 'Erg', meters: 2000, seconds: 432 }), 108);
  assert.equal(formatSplit(108.24), '1:48.2');
  assert.equal(formatSplit(119.98), '2:00.0');
  assert.equal(splitSeconds({ type: 'Strength', meters: 0, seconds: 2700 }), null);
});
test('calendar validation rejects rolled-over dates', () => {
  assert.equal(validDate('2026-02-30'), false);
  assert.equal(validDate('2028-02-29'), true);
});
test('weekly summary begins Monday and excludes future sessions', () => {
  const samples = demoWorkouts(new Date(2026, 9, 13));
  samples[1].date = '2026-10-12'; samples[2].date = '2026-10-14'; samples[3].date = '2026-10-11';
  assert.deepEqual(weekSummary(samples, new Date(2026, 9, 13)), { sessions: 2, meters: 14400, seconds: 4272 });
});
test('benchmarks use exact-distance erg efforts, never water sessions', () => {
  const samples = demoWorkouts(); samples[1].meters = 2000; samples[1].seconds = 400;
  assert.equal(personalBest(samples, 2000)?.seconds, 432);
  assert.equal(personalBest(samples, 6000), undefined);
});
test('storage round-trip and invalid data rejection', () => {
  assert.deepEqual(decodeData(JSON.stringify(emptyData)), emptyData);
  assert.throws(() => decodeData('{bad'));
  assert.throws(() => decodeData(JSON.stringify({ ...emptyData, version: 2 })));
  assert.throws(() => decodeData(JSON.stringify({ ...emptyData, workouts: [{ seconds: -5 }] })));
});
