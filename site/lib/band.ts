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

/** A swung position: an off-beat eighth is played two thirds into the beat. */
export const swing = (position: number) => {
  const beat = Math.floor(position);
  return position - beat === 0.5 ? beat + 2 / 3 : position;
};

/** The audio time of the beginning, and the length in seconds. */
export type BandPlayback = { start: number; duration: number };

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
  for (const n of notes) {
    const begin = swing(n.start);
    const end = swing(n.start + n.duration);
    bass.start({
      note: n.note,
      time: start + begin * spb,
      duration: (end - begin) * spb * 0.95,
      velocity: n.ghost ? 45 : 95,
    });
  }
  if (ride) {
    for (let beat = 0; beat < length; beat++) {
      const time = start + beat * spb;
      drums.start({ note: "ride", time, velocity: beat % 2 ? 70 : 60 });
      if (beat % 2 === 1) {
        drums.start({ note: "ride", time: time + (2 / 3) * spb, velocity: 50 });
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
