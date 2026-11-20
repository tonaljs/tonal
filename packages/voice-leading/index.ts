import Note from "@tonaljs/note";

// A function that decides which of a set of voicings is picked as a follow up to lastVoicing.
export declare type VoiceLeadingFunction = (
  voicings: string[][],
  lastVoicing: string[],
) => string[];

/**
 * Pick the voicing whose top note is closest to the top note of the last
 * voicing (the first of them on a tie). If there is no last voicing, it picks
 * the first one. It returns `[]` if there are no voicings, and doesn't change
 * the given list.
 *
 * @param voicings - candidate voicings, like [["C4", "E4", "G4"], ["E4", "G4", "C5"]]
 * @param lastVoicing - the previous voicing
 * @example
 * VoiceLeading.topNoteDiff([["C4", "E4", "G4"], ["E4", "G4", "C5"], ["G4", "C5", "E5"]], ["D4", "F4", "A4"]); // => ["C4", "E4", "G4"]
 */
export const topNoteDiff: VoiceLeadingFunction = (voicings, lastVoicing) => {
  if (!voicings.length) return [];
  if (!lastVoicing || !lastVoicing.length) {
    return voicings[0];
  }
  const topNoteMidi = (voicing: string[]) =>
    Note.midi(voicing[voicing.length - 1]) || 0;
  const diff = (voicing: string[]) =>
    Math.abs(topNoteMidi(lastVoicing) - topNoteMidi(voicing));
  // the first voicing with the smallest difference, without sorting the list
  return voicings.reduce((best, voicing) =>
    diff(voicing) < diff(best) ? voicing : best,
  );
};

/** @deprecated Use the named exports instead. */
export default {
  topNoteDiff,
};
