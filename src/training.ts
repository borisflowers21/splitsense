export type WorkoutType = 'Erg' | 'Water' | 'Strength';
export type Interval = { meters: number; seconds: number; restSeconds: number };
export type Workout = {
  id: string; type: WorkoutType; title: string; date: string;
  seconds: number; meters: number; rate?: number; effort: number;
  notes: string; rhythm?: number; balance?: number; connection?: number;
  demo?: boolean; planId?: string; intervals?: Interval[];
};
export type Profile = { name: string; club: string; goal: string };
export type PlannedSession = { id: string; templateId: string; date: string };
export type AppData = { version: 1; workouts: Workout[]; profile: Profile; plans: PlannedSession[] };
export const emptyData: AppData = { version: 1, workouts: [], plans: [], profile: { name: '', club: '', goal: '' } };
export const workoutTemplates = [
  { id: 'steady', title: 'Steady rhythm', type: 'Erg' as WorkoutType, label: '20 min · continuous', meters: '', duration: '20:00', rate: '20', notes: 'Example structure: continuous rowing at a comfortable effort. Adjust duration and rate to your own training plan.' },
  { id: 'intervals', title: 'Six by five hundred', type: 'Erg' as WorkoutType, label: '6 × 500 m · 2 min rest', meters: '3000', duration: '', rate: '', notes: '6 × 500 m with 2:00 rest between repetitions. Log total work distance and moving time, excluding rest. Adapt to your coach’s plan.' },
  { id: 'benchmark', title: '2K benchmark', type: 'Erg' as WorkoutType, label: '2,000 m · benchmark', meters: '2000', duration: '', rate: '', notes: 'Warm up first. Enter the completed 2K time from your monitor.' },
  { id: 'water', title: 'On-water technique', type: 'Water' as WorkoutType, label: 'Technique · on the water', meters: '', duration: '', rate: '', notes: 'Record your session and reflect on rhythm, balance and connection.' },
  { id: 'strength', title: 'Strength session', type: 'Strength' as WorkoutType, label: 'Off-water · strength', meters: '', duration: '', rate: '', notes: 'Record your exercises, sets, reps and weights in session notes.' },
];
export type WorkoutTemplate = typeof workoutTemplates[number];
export function ergWatts(split: number): number | null {
  return Number.isFinite(split) && split > 0 ? 2.8 / (split / 500) ** 3 : null;
}
export function intervalTotals(intervals: Interval[]) {
  if (!intervals.length || !intervals.every(i => Number.isFinite(i.meters) && i.meters > 0 && Number.isFinite(i.seconds) && i.seconds > 0 && Number.isFinite(i.restSeconds) && i.restSeconds >= 0)) throw new Error('Invalid intervals');
  return { meters: intervals.reduce((n, i) => n + i.meters, 0), seconds: intervals.reduce((n, i) => n + i.seconds, 0), restSeconds: intervals.reduce((n, i) => n + i.restSeconds, 0) };
}
export function targetTime(meters: number, split: number): number | null {
  return Number.isFinite(meters) && meters > 0 && Number.isFinite(split) && split > 0 ? meters * split / 500 : null;
}
export function weekDates(now = new Date()): string[] {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  return Array.from({ length: 7 }, (_, i) => { const date = new Date(monday); date.setDate(date.getDate() + i); return localDate(date); });
}
export function sessionReview(workout: Workout, history: Workout[]): string {
  if (workout.intervals?.length) {
    const splits = workout.intervals.map(i => i.seconds * 500 / i.meters);
    return `${workout.intervals.length} repetitions recorded. Your fastest split was ${formatSplit(Math.min(...splits))} and your slowest was ${formatSplit(Math.max(...splits))} /500 m. Total work time excludes recovery.`;
  }
  const previous = ordered(history.filter(w => w.id !== workout.id && !w.demo && !w.intervals?.length && w.type === workout.type && w.meters === workout.meters && w.date <= workout.date))[0];
  if (workout.type === 'Strength') return `${Math.round(workout.seconds / 60)} minutes recorded at effort ${workout.effort}/10. Your exercise details are in your session notes.`;
  if (!previous) return 'This is a starting point for this distance. Log another session at a similar effort to compare your results.';
  const delta = splitSeconds(workout)! - splitSeconds(previous)!;
  return `${delta === 0 ? 'The same average split as' : `${Math.abs(delta).toFixed(1)} seconds per 500 m ${delta < 0 ? 'faster' : 'slower'} than`} your previous saved ${workout.type.toLowerCase()} session at this distance (${previous.date}). Effort and conditions can change the comparison.`;
}
export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}
export function parseDuration(value: string): number | null {
  if (!/^\d{1,3}:\d{2}(?::\d{2})?$/.test(value.trim())) return null;
  const parts = value.trim().split(':').map(Number);
  if (parts.slice(1).some(n => n > 59)) return null;
  const seconds = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] * 3600 + parts[1] * 60 + parts[2];
  return seconds > 0 ? seconds : null;
}
export function formatDuration(seconds: number): string {
  const value = Math.round(seconds);
  const h = Math.floor(value / 3600);
  const m = Math.floor(value / 60) % 60;
  const s = value % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}
export function splitSeconds(workout: Pick<Workout, 'meters' | 'seconds' | 'type'>): number | null {
  return workout.type !== 'Strength' && workout.meters > 0 ? workout.seconds * 500 / workout.meters : null;
}
export function formatSplit(seconds: number): string {
  const tenths = Math.round(seconds * 10);
  return `${Math.floor(tenths / 600)}:${String(Math.floor(tenths / 10) % 60).padStart(2, '0')}.${tenths % 10}`;
}
export function weekSummary(workouts: Workout[], now = new Date()) {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  const start = localDate(monday), end = localDate(now);
  const week = workouts.filter(w => w.date >= start && w.date <= end);
  return { sessions: week.length, meters: week.reduce((n, w) => n + w.meters, 0), seconds: week.reduce((n, w) => n + w.seconds, 0) };
}
export function personalBest(workouts: Workout[], meters: number): Workout | undefined {
  return workouts.filter(w => w.type === 'Erg' && !w.intervals?.length && w.meters === meters).sort((a, b) => a.seconds - b.seconds)[0];
}
export function ordered(workouts: Workout[]): Workout[] {
  return [...workouts].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}
function isWorkout(w: unknown): w is Workout {
  if (!w || typeof w !== 'object') return false;
  const x = w as Workout;
  if (x.intervals !== undefined) {
    if (!Array.isArray(x.intervals) || !x.intervals.length || x.type !== 'Erg') return false;
    try { const total = intervalTotals(x.intervals); if (Math.abs(total.meters - x.meters) > 0.001 || Math.abs(total.seconds - x.seconds) > 0.001) return false; } catch { return false; }
  }
  return typeof x.id === 'string' && ['Erg', 'Water', 'Strength'].includes(x.type) && typeof x.title === 'string'
    && typeof x.date === 'string' && validDate(x.date) && Number.isFinite(x.seconds) && x.seconds > 0
    && Number.isFinite(x.meters) && (x.type === 'Strength' ? x.meters === 0 : x.meters > 0)
    && Number.isInteger(x.effort) && x.effort >= 1 && x.effort <= 10 && typeof x.notes === 'string'
    && (x.rate === undefined || (Number.isFinite(x.rate) && x.rate > 0))
    && ['rhythm', 'balance', 'connection'].every(key => {
      const value = x[key as 'rhythm']; return value === undefined || (Number.isInteger(value) && value >= 1 && value <= 5);
    }) && (x.demo === undefined || typeof x.demo === 'boolean') && (x.planId === undefined || typeof x.planId === 'string');
}
export function decodeData(raw: string): AppData {
  const data = JSON.parse(raw) as AppData;
  if (data?.version !== 1 || !Array.isArray(data.workouts) || !data.workouts.every(isWorkout)
    || !data.profile || !['name', 'club', 'goal'].every(key => typeof data.profile[key as keyof Profile] === 'string')) {
    throw new Error('Saved training data could not be read.');
  }
  const plans = data.plans === undefined ? [] : data.plans;
  if (!Array.isArray(plans) || !plans.every(p => p && typeof p.id === 'string' && validDate(p.date) && workoutTemplates.some(t => t.id === p.templateId))) throw new Error('Saved plan could not be read.');
  return { ...data, plans };
}
export function demoWorkouts(now = new Date()): Workout[] {
  const specs = [
    { type: 'Erg' as const, title: '2K benchmark', meters: 2000, seconds: 432, rate: 28 },
    { type: 'Water' as const, title: 'Steady water row', meters: 12400, seconds: 3840, rate: 20 },
    { type: 'Strength' as const, title: 'Strength session', meters: 0, seconds: 2700 },
    { type: 'Erg' as const, title: '2K benchmark', meters: 2000, seconds: 446, rate: 29 },
  ];
  return specs.map((spec, i) => {
    const date = new Date(now); date.setDate(date.getDate() - i * 3);
    return { ...spec, id: `demo-${i}`, date: localDate(date), effort: 7, notes: 'Example workout — replace with your own training.', demo: true };
  });
}
