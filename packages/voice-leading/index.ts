import Note from "@tonaljs/note";

// A function that decides which of a set of voicings is picked as a follow up to lastVoicing.
export declare type VoiceLeadingFunction = (
  voicings: string[][],
  lastVoicing: string[]
) => string[];

export const topNoteDiff: VoiceLeadingFunction = (voicings, lastVoicing) => {
  if (!lastVoicing || !lastVoicing.length) {
    return voicings[0];
  }
  const topNoteMidi = (voicing: string[]) =>
    Note.midi(voicing[voicing.length - 1]) || 0;
  const diff = (voicing: string[]) =>
    Math.abs(topNoteMidi(lastVoicing) - topNoteMidi(voicing));
  return voicings.sort((a, b) => diff(a) - diff(b))[0];
};

export default {
  topNoteDiff,
};
