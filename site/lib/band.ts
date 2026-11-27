// The bass and ride of the walking bass app, with smplr. tonal doesn't make
// sound or keep time: the app turns the line's positions (quarter notes) into
// seconds, swings the eighths, and schedules the samples on the audio clock.
//
// The samples are loaded the first time something is played, because browsers
// only start audio after a user gesture.
import type { DrumMachine, Soundfont } from "smplr";

let context: AudioContext | undefined;
let loading: Promise<[Soundfont, DrumMachine]> | undefined;

function load(): Promise<[Soundfont, DrumMachine]> {
  context ??= new AudioContext();
  void context.resume();
  const ctx = context;
  loading ??= import("smplr")
    .then(({ Soundfont, DrumMachine }) =>
      Promise.all([
        Soundfont(ctx, { instrument: "acoustic_bass" }).load,
        DrumMachine(ctx, { instrument: "LM-2" }).load,
      ]),
    )
    .catch((error) => {
      // let the next play try again
      loading = undefined;
      throw error;
    }) as Promise<[Soundfont, DrumMachine]>;
  return loading;
}

/** A note to play: positions in quarter notes. */
export type BandNote = {
  start: number;
  duration: number;
  note: string;
  ghost?: boolean;
};

// a value read from points (tempo, value), straight between them
function byTempo(points: [number, number][], tempo: number) {
  if (tempo <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    const [t0, v0] = points[i - 1];
    const [t1, v1] = points[i];
    if (tempo <= t1) return v0 + ((v1 - v0) * (tempo - t0)) / (t1 - t0);
  }
  return points[points.length - 1][1];
}

/**
 * How the band plays at a tempo, as recorded jazz bass lines do (JJazzLab's
 * swing profile and its recorded phrases, FiloBass's aligned recordings):
 * a wider swing when slow, a little shorter and ahead of the beat when fast,
 * and only small accents, on beats 1 and 3.
 */
export function feel(tempo: number) {
  return {
    /** Long to short eighth: 2.3 at 50 BPM, 2 at 120, 1.6 at 240 */
    swing: byTempo(
      [
        [50, 2.3],
        [120, 2],
        [190, 1.8],
        [240, 1.6],
      ],
      tempo,
    ),
    /** How much of its length a note on the beat is held */
    legato: byTempo(
      [
        [120, 1],
        [190, 0.97],
        [240, 0.94],
      ],
      tempo,
    ),
    /** Extra velocity on beats 1 and 3 */
    accent: byTempo(
      [
        [50, 9],
        [120, 6],
        [190, 3],
        [240, 1.5],
      ],
      tempo,
    ),
    /** Seconds ahead of (negative) or behind the beat */
    lean: byTempo(
      [
        [50, 0.002],
        [120, 0],
        [190, -0.005],
        [240, -0.009],
      ],
      tempo,
    ),
  };
}

/** A swung position: an off-beat eighth is played late, by the swing ratio. */
export const swing = (position: number, ratio = 2) => {
  const beat = Math.floor(position);
  return position - beat === 0.5 ? beat + ratio / (1 + ratio) : position;
};

/** The audio time of the beginning, and the length in seconds. */
export type BandPlayback = { start: number; duration: number };

// a seeded random number (mulberry32), so a line plays the same every time
function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// velocities on the bass's scale: recorded lines sit around 62 (of 127) with
// off-beats about 11 lower and ghosts near 39; here everything is scaled up
// so the soundfont is heard
const VELOCITY = { beat: 88, offBeat: 72, ghost: 52, spread: 5 };

/**
 * Schedule a bass line, and a ride pattern under it (every beat, and the
 * swung eighth after beats 2 and 4, with the hi-hat on 2 and 4), at a tempo
 * in quarter notes per minute.
 */
export async function playBand(
  notes: BandNote[],
  {
    length,
    tempo,
    ride,
    at,
  }: { length: number; tempo: number; ride: boolean; at?: number },
): Promise<BandPlayback> {
  const [bass, drums] = await load();
  const spb = 60 / tempo;
  const start = at ?? context!.currentTime + 0.1;
  const { swing: ratio, legato, accent, lean } = feel(tempo);
  const rnd = random(7);
  // a normal random number (Box-Muller)
  const normal = () =>
    Math.sqrt(-2 * Math.log(rnd() || 1e-9)) * Math.cos(2 * Math.PI * rnd());
  for (const n of notes) {
    const begin = swing(n.start, ratio);
    const end = swing(n.start + n.duration, ratio);
    const onBeat = Number.isInteger(n.start);
    const strong = onBeat && n.start % 2 === 0;
    // a few milliseconds of timing, half as much on beats 1 and 3
    const jitter = Math.max(-0.007, Math.min(0.007, normal() * 0.0025));
    const time = start + begin * spb + lean + (strong ? jitter / 2 : jitter);
    const velocity = n.ghost
      ? VELOCITY.ghost
      : (onBeat ? VELOCITY.beat : VELOCITY.offBeat) +
        (strong ? accent : 0) +
        normal() * VELOCITY.spread;
    const gate = n.ghost ? 0.35 : onBeat ? legato : 0.7;
    bass.start({
      note: n.note,
      time: Math.max(start, time),
      duration: (end - begin) * spb * gate,
      velocity: Math.round(Math.max(30, Math.min(120, velocity))),
    });
  }
  if (ride) {
    const skip = ratio / (1 + ratio);
    for (let beat = 0; beat < length; beat++) {
      const time = start + beat * spb;
      drums.start({ note: "ride", time, velocity: beat % 2 ? 70 : 60 });
      if (beat % 2 === 1) {
        drums.start({ note: "ride", time: time + skip * spb, velocity: 50 });
        drums.start({ note: "hhclosed", time, velocity: 55 });
      }
    }
  }
  return { start, duration: length * spb };
}

/** Stop every note, also the ones scheduled to start later. */
export async function stopBand(): Promise<void> {
  if (!loading) return;
  const [bass, drums] = await loading;
  bass.stop();
  drums.stop();
}

/** The time of the audio clock, in seconds (0 before anything plays). */
export function bandTime(): number {
  return context?.currentTime ?? 0;
}
