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
