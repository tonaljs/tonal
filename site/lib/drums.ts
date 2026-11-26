// The drum sound of the rhythm app, with smplr. tonal doesn't make sound or
// keep time: the app plays the patterns tonal computes, with its own clock.
//
// The samples are loaded the first time something is played, because browsers
// only start audio after a user gesture.
import type { DrumMachine } from "smplr";

let context: AudioContext | undefined;
let loading: Promise<DrumMachine> | undefined;

/** The sounds the app uses, from smplr's TR-808 kit. */
export type DrumSound =
  "clave" | "kick" | "hihat-close" | "rimshot" | "cowbell";

export function loadDrums(): Promise<DrumMachine> {
  context ??= new AudioContext();
  void context.resume();
  const ctx = context;
  loading ??= import("smplr")
    .then(({ DrumMachine }) => DrumMachine(ctx, { instrument: "TR-808" }).load)
    .catch((error) => {
      // let the next play try again
      loading = undefined;
      throw error;
    }) as Promise<DrumMachine>;
  return loading;
}

/** Play a sound at a time of the audio clock (now by default). */
export async function playDrum(
  sound: DrumSound,
  { time, velocity = 100 }: { time?: number; velocity?: number } = {},
): Promise<void> {
  const drums = await loadDrums();
  drums.start({ note: sound, time: time ?? context!.currentTime, velocity });
}

/** Stop every sound, also the ones scheduled to start later. */
export async function stopDrums(): Promise<void> {
  if (!loading) return;
  const drums = await loading;
  drums.stop();
}

/** The time of the audio clock, in seconds (0 before anything plays). */
export function drumsTime(): number {
  return context?.currentTime ?? 0;
}
