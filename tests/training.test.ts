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

test('old storage gains an empty plan without changing workouts or profile', () => {
  const legacy = { version: 1, workouts: demoWorkouts(), profile: { name: 'Rower', club: '', goal: '' } };
  assert.deepEqual(decodeData(JSON.stringify(legacy)), { ...legacy, plans: [] });
  assert.throws(() => decodeData(JSON.stringify({ ...emptyData, plans: [{ id: 'p', date: '2026-02-30', templateId: 'steady' }] })));
  assert.throws(() => decodeData(JSON.stringify({ ...emptyData, plans: [{ id: 'p', date: '2026-10-13', templateId: 'unknown' }] })));
});

test('pace calculations match Concept2 example and reject invalid inputs', async () => {
  const { ergWatts, targetTime } = await import('../src/training.ts');
  assert.equal(targetTime(2000, 110), 440);
  assert.equal(Math.round(ergWatts(120)!), 203);
  for (const value of [0, -1, Infinity, NaN]) { assert.equal(ergWatts(value), null); assert.equal(targetTime(value, 110), null); }
});

test('interval totals exclude recovery and cannot become continuous benchmarks', async () => {
  const { intervalTotals, sessionReview } = await import('../src/training.ts');
  const intervals = [{ meters: 1000, seconds: 210, restSeconds: 120 }, { meters: 1000, seconds: 220, restSeconds: 0 }];
  assert.deepEqual(intervalTotals(intervals), { meters: 2000, seconds: 430, restSeconds: 120 });
  assert.throws(() => intervalTotals([{ meters: 500, seconds: 0, restSeconds: 0 }]));
  const workout = { ...demoWorkouts()[0], id: 'interval-test', meters: 2000, seconds: 430, intervals };
  assert.equal(personalBest([workout], 2000), undefined);
  assert.match(sessionReview(workout, []), /1:45.0.*1:50.0/);
  assert.doesNotThrow(() => decodeData(JSON.stringify({ ...emptyData, workouts: [workout] })));
  assert.throws(() => decodeData(JSON.stringify({ ...emptyData, workouts: [{ ...workout, seconds: 550 }] })));
});

test('week strip handles Sunday and date boundaries', async () => {
  const { weekDates } = await import('../src/training.ts');
  assert.deepEqual(weekDates(new Date(2027, 0, 3)), ['2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02', '2027-01-03']);
});
