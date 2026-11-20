import Chord from "@tonaljs/chord";
import Interval from "@tonaljs/interval";
import Note from "@tonaljs/note";
import Range from "@tonaljs/range";
import VoiceLeading from "@tonaljs/voice-leading";
import VoicingDictionary from "@tonaljs/voicing-dictionary";

const defaultRange = ["C3", "C5"];
const defaultDictionary = VoicingDictionary.all;
const defaultVoiceLeading = VoiceLeading.topNoteDiff;

/**
 * Get a voicing (a list of notes with octaves) of a chord symbol inside a
 * range. Without `lastVoicing` it picks the lowest voicing; with it, the
 * `voiceLeading` function picks the voicing that follows it best. Returns
 * `[]` if the chord is unknown or no voicing fits the range.
 *
 * @param chord - chord symbol, like "Cmaj7"
 * @param range - lowest and highest note, default ["C3", "C5"]
 * @param dictionary - voicing dictionary, default VoicingDictionary.all
 * @param voiceLeading - picks a voicing after lastVoicing, default VoiceLeading.topNoteDiff
 * @param lastVoicing - the previous voicing, if any
 * @example
 * Voicing.get("Cmaj7"); // => ["E3", "G3", "B3", "D4"]
 * Voicing.get("Dm7", ["C3", "C5"], undefined, undefined, ["C4", "E4", "G4", "B4"]); // => ["C4", "E4", "F4", "A4"]
 * Voicing.get("xx"); // => []
 */
export function get(
  chord: string,
  range: string[] = defaultRange,
  dictionary = defaultDictionary,
  voiceLeading = defaultVoiceLeading,
  lastVoicing?: string[],
): string[] {
  const voicings = search(chord, range, dictionary);
  if (!voicings.length) {
    return [];
  }
  if (!lastVoicing || !lastVoicing.length) {
    // notes = voicings[Math.ceil(voicings.length / 2)]; // pick middle voicing..
    return voicings[0]; // pick lowest voicing..
  } else {
    // calculates the distance between the last note and the given voicings top note
    // sort voicings with differ
    return voiceLeading(voicings, lastVoicing) ?? [];
  }
}

/**
 * Get all the voicings of a chord symbol that fit inside a range: each
 * voicing of the dictionary, at every position in the range. Returns `[]` if the chord is not in the dictionary.
 *
 * @param chord - chord symbol, like "C"
 * @param range - lowest and highest note, default ["C3", "C5"]
 * @param dictionary - voicing dictionary, default VoicingDictionary.all
 * @example
 * Voicing.search("C", ["C3", "C5"], VoicingDictionary.triads).slice(0, 3); // => [["C3", "E3", "G3"], ["C4", "E4", "G4"], ["E3", "G3", "C4"]]
 */
export function search(
  chord: string,
  range = defaultRange,
  dictionary = defaultDictionary,
): string[][] {
  const [tonic, symbol] = Chord.tokenize(chord);
  const sets = VoicingDictionary.lookup(symbol, dictionary);
  // find equivalent symbol that is used as a key in dictionary:
  if (!sets) {
    return [];
  }
  // resolve array of interval arrays for the wanted symbol
  const voicings = sets.map((intervals) => intervals.split(" "));
  const notesInRange = Range.chromatic(range); // gives array of notes inside range
  return voicings.reduce((voiced: string[][], voicing: string[]) => {
    // transpose intervals relative to first interval (e.g. 3m 5P > 1P 3M)
    const relativeIntervals = voicing.map(
      (interval) => Interval.subtract(interval, voicing[0]) || "",
    );
    // get enharmonic correct pitch class the bottom note
    const bottomPitchClass = Note.transpose(tonic, voicing[0]);
    // get all possible start notes for voicing
    const starts = notesInRange
      // only get the start notes:
      .filter((note) => Note.chroma(note) === Note.chroma(bottomPitchClass))
      // filter out start notes that will overshoot the top end of the range
      .filter(
        (note) =>
          (Note.midi(
            Note.transpose(
              note,
              relativeIntervals[relativeIntervals.length - 1],
            ),
          ) || 0) <= (Note.midi(range[1]) || 0),
      )
      // replace Range.chromatic notes with the correct enharmonic equivalents
      .map((note) => Note.enharmonic(note, bottomPitchClass));
    // render one voicing for each start note
    const notes = starts.map((start) =>
      relativeIntervals.map((interval) => Note.transpose(start, interval)),
    );
    return voiced.concat(notes);
  }, []);
}

/**
 * Get a voicing for each chord of a list, each one voice-led from the
 * previous. A chord without voicing gives `[]` and the next chord is led from
 * the last chord that had one.
 *
 * @param chords - chord symbols, like ["Dm7", "G7", "Cmaj7"]
 * @param range - lowest and highest note, default ["C3", "C5"]
 * @param dictionary - voicing dictionary, default VoicingDictionary.all
 * @param voiceLeading - picks each voicing, default VoiceLeading.topNoteDiff
 * @param lastVoicing - the voicing before the first chord, if any
 * @example
 * Voicing.sequence(["Dm7", "G7", "Cmaj7"]); // => [["F3", "A3", "C4", "E4"], ["F3", "A3", "B3", "E4"], ["E3", "G3", "B3", "D4"]]
 */
export function sequence(
  chords: string[],
  range = defaultRange,
  dictionary = defaultDictionary,
  voiceLeading = defaultVoiceLeading,
  lastVoicing?: string[],
): string[][] {
  const { voicings } = chords.reduce<{
    voicings: string[][];
    lastVoicing: string[] | undefined;
  }>(
    ({ voicings, lastVoicing }, chord) => {
      const voicing = get(chord, range, dictionary, voiceLeading, lastVoicing);
      // a chord without voicing gives [] and keeps its position, but the next
      // chord is still voice-led from the last chord that had a voicing
      if (voicing.length) {
        lastVoicing = voicing;
      }
      voicings.push(voicing);
      return { voicings, lastVoicing };
    },
    { voicings: [], lastVoicing },
  );
  return voicings;
}

/** @deprecated Use the named exports instead. */
export default {
  get,
  search,
  sequence,
};
