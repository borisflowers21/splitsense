export type WorkoutType = 'Erg' | 'Water' | 'Strength';
export type Workout = {
  id: string; type: WorkoutType; title: string; date: string;
  seconds: number; meters: number; rate?: number; effort: number;
  notes: string; rhythm?: number; balance?: number; connection?: number;
  demo?: boolean;
};
export type Profile = { name: string; club: string; goal: string };
export type AppData = { version: 1; workouts: Workout[]; profile: Profile };
export const emptyData: AppData = { version: 1, workouts: [], profile: { name: '', club: '', goal: '' } };
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
  return workouts.filter(w => w.type === 'Erg' && w.meters === meters).sort((a, b) => a.seconds - b.seconds)[0];
}
export function ordered(workouts: Workout[]): Workout[] {
  return [...workouts].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}
function isWorkout(w: unknown): w is Workout {
  if (!w || typeof w !== 'object') return false;
  const x = w as Workout;
  return typeof x.id === 'string' && ['Erg', 'Water', 'Strength'].includes(x.type) && typeof x.title === 'string'
    && typeof x.date === 'string' && validDate(x.date) && Number.isFinite(x.seconds) && x.seconds > 0
    && Number.isFinite(x.meters) && (x.type === 'Strength' ? x.meters === 0 : x.meters > 0)
    && Number.isInteger(x.effort) && x.effort >= 1 && x.effort <= 10 && typeof x.notes === 'string'
    && (x.rate === undefined || (Number.isFinite(x.rate) && x.rate > 0))
    && ['rhythm', 'balance', 'connection'].every(key => {
      const value = x[key as 'rhythm']; return value === undefined || (Number.isInteger(value) && value >= 1 && value <= 5);
    }) && (x.demo === undefined || typeof x.demo === 'boolean');
}
export function decodeData(raw: string): AppData {
  const data = JSON.parse(raw) as AppData;
  if (data?.version !== 1 || !Array.isArray(data.workouts) || !data.workouts.every(isWorkout)
    || !data.profile || !['name', 'club', 'goal'].every(key => typeof data.profile[key as keyof Profile] === 'string')) {
    throw new Error('Saved training data could not be read.');
  }
  return data;
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
