// The piano sound of the apps, with smplr. tonal doesn't make sound: the apps
// use it to hear the notes tonal computes.
//
// The samples are loaded the first time something is played, because browsers
// only start audio after a user gesture.
import type { Smplr } from "smplr";

let context: AudioContext | undefined;
let loading: Promise<Smplr> | undefined;

// C2 to C7: the apps play in the middle of the piano, and the notes outside
// play the nearest loaded sample
const PIANO_KEYS = Array.from({ length: 61 }, (_, i) => i + 36);

function loadPiano(): Promise<Smplr> {
  context ??= new AudioContext();
  void context.resume();
  const ctx = context;
  loading ??= import("smplr")
    .then(
      ({ SplendidGrandPiano }) =>
        // one velocity layer is enough for the apps, and loads 5 times less
        SplendidGrandPiano(ctx, {
          notesToLoad: { notes: PIANO_KEYS, velocityRange: [68, 84] },
        }).load,
    )
    .catch((error) => {
      // let the next play try again
      loading = undefined;
      throw error;
    });
  return loading;
}

export type PlayOptions = {
  /** Play the notes one after the other instead of together */
  arpeggio?: boolean;
};

/** Play chords one after the other, `gap` seconds apart. */
export async function playChords(
  chords: (string | number)[][],
  gap = 0.9,
): Promise<void> {
  const piano = await loadPiano();
  const now = context!.currentTime;
  piano.stop();
  chords.forEach((notes, i) => {
    notes.forEach((note, j) => {
      piano.start({
        note,
        velocity: 76,
        time: now + i * gap + j * 0.012,
        duration: gap * 1.1,
      });
    });
  });
}

export type TimedNotes = {
  /** Notes played together (none is a rest) */
  notes: (string | number)[];
  /** Seconds until the next ones */
  duration: number;
};

/**
 * A timeline being played: when its beginning is (audio clock, seconds), how
 * long it lasts, and whether it starts again when it ends.
 */
export type Playback = { start: number; duration: number; loop?: boolean };

export type ScheduleOptions = {
  /** Seconds into the timeline to start from (default 0) */
  from?: number;
  /** The audio time at which `from` sounds (default now) */
  at?: number;
  /** Stop what is sounding first (default true) */
  replace?: boolean;
};

/**
 * Schedule groups of notes one after the other, each for its own duration,
 * starting `from` seconds into the timeline: a group already sounding at that
 * point plays at once, for the time it has left. Resolves with the audio time
 * of the timeline's beginning and its length.
 */
export async function scheduleTimeline(
  steps: TimedNotes[],
  { from = 0, at, replace = true }: ScheduleOptions = {},
): Promise<Playback> {
  const piano = await loadPiano();
  const now = context!.currentTime;
  if (replace) piano.stop();
  const startsAt = (at ?? now) - from;
  const cut = startsAt + from;
  let time = startsAt;
  for (const { notes, duration } of steps) {
    const end = time + duration;
    if (end > cut) {
      const begin = Math.max(time, cut);
      notes.forEach((note, j) => {
        piano.start({
          note,
          velocity: 76,
          time: begin + j * 0.012,
          duration: (end - begin) * 1.1,
        });
      });
    }
    time = end;
  }
  return { start: startsAt, duration: time - startsAt };
}

/** Play groups of notes one after the other, each for its own duration. */
export function playTimeline(steps: TimedNotes[]): Promise<Playback> {
  return scheduleTimeline(steps);
}

/** Stop every note, also the ones scheduled to start later. */
export async function stopAll(): Promise<void> {
  if (!loading) return;
  const piano = await loading;
  piano.stop();
}

/** The time of the audio clock, in seconds (0 before anything plays). */
export function audioTime(): number {
  return context?.currentTime ?? 0;
}

/** Play note names (with octave) or midi numbers. Resolves once they start. */
export async function playNotes(
  notes: (string | number)[],
  { arpeggio = false }: PlayOptions = {},
): Promise<void> {
  const piano = await loadPiano();
  const now = context!.currentTime;
  piano.stop();
  notes.forEach((note, i) => {
    piano.start({
      note,
      velocity: 76,
      // a chord is slightly rolled, as a pianist plays it
      time: now + i * (arpeggio ? 0.22 : 0.012),
      duration: arpeggio ? 1.2 : 2,
    });
  });
}
