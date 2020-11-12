import Chord from '@tonaljs/chord';
import Note from '@tonaljs/note';
import Range from '@tonaljs/range';
import Interval from '@tonaljs/interval';
import { VoicingDictionary } from './data';

// VoiceLeading

// A function that decides which of a set of voicings is picked as a follow up to lastVoicing.
export declare type VoiceLeadingFunction = (voicings: string[][], lastVoicing: string[]) => string[];

const topNoteDiff: VoiceLeadingFunction = (voicings, lastVoicing) => {
  if (!lastVoicing || !lastVoicing.length) {
    return voicings[0];
  }
  const topNoteMidi = (voicing: string[]) => Note.midi(voicing[voicing.length - 1]) || 0;
  const diff = (voicing: string[]) => Math.abs(topNoteMidi(lastVoicing) - topNoteMidi(voicing));
  return voicings.sort((a, b) => diff(a) - diff(b))[0];
};

export const VoiceLeading = {
  topNoteDiff,
};

// Voicing

const defaultRange = ['C3', 'C5'];
const defaultDictionary = VoicingDictionary.all;
const defaultVoiceLeading = topNoteDiff;

function get(
  chord: string,
  range: string[] = defaultRange,
  dictionary = defaultDictionary,
  voiceLeading = defaultVoiceLeading,
  lastVoicing?: string[]
) {
  const voicings = Voicing.search(chord, range, dictionary);
  if (!lastVoicing || !lastVoicing.length) {
    // notes = voicings[Math.ceil(voicings.length / 2)]; // pick middle voicing..
    return voicings[0]; // pick lowest voicing..
  } else {
    // calculates the distance between the last note and the given voicings top note
    // sort voicings with differ
    return voiceLeading(voicings, lastVoicing);
  }
}

function search(chord: string, range = defaultRange, dictionary = VoicingDictionary.triads): string[][] {
  const [tonic, symbol] = Chord.tokenize(chord);
  const sets = Voicing.lookup(symbol, dictionary);
  // find equivalent symbol that is used as a key in dictionary:
  if (!sets) {
    return [];
  }
  // resolve array of interval arrays for the wanted symbol
  const voicings = sets.map((intervals) => intervals.split(' '));
  const notesInRange = Range.chromatic(range); // gives array of notes inside range
  return voicings.reduce((voiced: string[][], voicing: string[]) => {
    // transpose intervals relative to first interval (e.g. 3m 5P > 1P 3M)
    const relativeIntervals = voicing.map((interval) => Interval.substract(interval, voicing[0]) || '');
    // get enharmonic correct pitch class the bottom note
    const bottomPitchClass = Note.transpose(tonic, voicing[0]);
    // get all possible start notes for voicing
    const starts = notesInRange
      // only get the start notes:
      .filter((note) => Note.chroma(note) === Note.chroma(bottomPitchClass))
      // filter out start notes that will overshoot the top end of the range
      .filter(
        (note) =>
          (Note.midi(Note.transpose(note, relativeIntervals[relativeIntervals.length - 1])) || 0) <=
          (Note.midi(range[1]) || 0)
      )
      // replace Range.chromatic notes with the correct enharmonic equivalents
      .map((note) => enharmonicEquivalent(note, bottomPitchClass));
    // render one voicing for each start note
    const notes = starts.map((start) => relativeIntervals.map((interval) => Note.transpose(start, interval)));
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
  const { voicings } = chords.reduce<{ voicings: string[][]; lastVoicing: string[] | undefined }>(
    ({ voicings, lastVoicing }, chord) => {
      const voicing = Voicing.get(chord, range, dictionary, voiceLeading, lastVoicing);
      lastVoicing = voicing;
      voicings.push(voicing);
      return { voicings, lastVoicing };
    },
    { voicings: [], lastVoicing }
  );
  return voicings;
}

function lookup(symbol: string, dictionary = defaultDictionary) {
  if (dictionary[symbol]) {
    return dictionary[symbol];
  }
  const { aliases } = Chord.get('C' + symbol);
  // TODO: find other way to get aliases of symbol
  const match = Object.keys(dictionary).find((_symbol) => aliases.includes(_symbol)) || '';
  if (match !== undefined) {
    return dictionary[match];
  }
  return undefined;
}

export const Voicing = {
  get,
  search,
  lookup,
  sequence,
};

// helper
// returns enharmonic equivalents of note for pitchClass.
export function enharmonicEquivalent(note: string, pitchClass: string): string {
  const { alt, letter } = Note.get(pitchClass);
  if (!letter || alt === undefined) {
    return '';
  }
  const chroma = Note.chroma(letter) || 0;
  let { oct } = Note.get(note);
  oct = oct !== undefined ? oct : 0;
  const letterChroma = chroma + alt;
  if (letterChroma > 11) {
    oct--;
  } else if (letterChroma < 0) {
    oct++;
  }
  return pitchClass + oct;
}
