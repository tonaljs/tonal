import Chord from "@tonaljs/chord";
import Note from "@tonaljs/note";
import Range from "@tonaljs/range";
import Interval from "@tonaljs/interval";
import VoicingDictionary from "@tonaljs/voicing-dictionary";
import VoiceLeading from "@tonaljs/voice-leading";

const defaultRange = ["C3", "C5"];
const defaultDictionary = VoicingDictionary.all;
const defaultVoiceLeading = VoiceLeading.topNoteDiff;

function get(
  chord: string,
  range: string[] = defaultRange,
  dictionary = defaultDictionary,
  voiceLeading = defaultVoiceLeading,
  lastVoicing?: string[]
) {
  const voicings = search(chord, range, dictionary);
  if (!lastVoicing || !lastVoicing.length) {
    // notes = voicings[Math.ceil(voicings.length / 2)]; // pick middle voicing..
    return voicings[0]; // pick lowest voicing..
  } else {
    // calculates the distance between the last note and the given voicings top note
    // sort voicings with differ
    return voiceLeading(voicings, lastVoicing);
  }
}

function search(
  chord: string,
  range = defaultRange,
  dictionary = VoicingDictionary.triads
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
      (interval) => Interval.substract(interval, voicing[0]) || ""
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
              relativeIntervals[relativeIntervals.length - 1]
            )
          ) || 0) <= (Note.midi(range[1]) || 0)
      )
      // replace Range.chromatic notes with the correct enharmonic equivalents
      .map((note) => Note.enharmonic(note, bottomPitchClass));
    // render one voicing for each start note
    const notes = starts.map((start) =>
      relativeIntervals.map((interval) => Note.transpose(start, interval))
    );
    return voiced.concat(notes);
  }, []);
}

function sequence(
  chords: string[],
  range = defaultRange,
  dictionary = defaultDictionary,
  voiceLeading = defaultVoiceLeading,
  lastVoicing?: string[]
) {
  const { voicings } = chords.reduce<{
    voicings: string[][];
    lastVoicing: string[] | undefined;
  }>(
    ({ voicings, lastVoicing }, chord) => {
      const voicing = get(chord, range, dictionary, voiceLeading, lastVoicing);
      lastVoicing = voicing;
      voicings.push(voicing);
      return { voicings, lastVoicing };
    },
    { voicings: [], lastVoicing }
  );
  return voicings;
}

export default {
  get,
  search,
  sequence,
};
