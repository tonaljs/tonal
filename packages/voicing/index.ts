import Chord from '@tonaljs/chord';
import Note from '@tonaljs/note';
import Range from '@tonaljs/range';
import Interval from '@tonaljs/interval';
import { VoicingDictionary } from './data';
// VoicingDictionary
// Maps a chord symbol to a set of voicings (interval string). The Voicings package could provide a set of common voicings.

// VoiceLeading
export declare type VoiceLeadingFunction = (voicings: string[][], lastVoicing: string[]) => string[];

// A function that decides which of a set of voicings is picked as a follow up to lastVoicing.

export declare interface VoiceLeadingInterface {
  [name: string]: VoiceLeadingFunction;
}

export const VoiceLeading: VoiceLeadingInterface = {
  topNoteDiff: (voicings, lastVoicing) => {
    if (!lastVoicing?.length) {
      return voicings[0];
    }
    const topNoteMidi = (voicing: string[]) => Note.midi(voicing[voicing.length - 1]) || 0;
    const diff = (voicing: string[]) => Math.abs(topNoteMidi(lastVoicing) - topNoteMidi(voicing));
    return voicings.sort((a, b) => diff(a) - diff(b))[0];
  },
};

export declare interface VoicingInterface {
  defaultRange: string[];
  defaultDictionary: VoicingDictionary;
  defaultVoiceLeading: VoiceLeadingFunction;
  search(chord: string, range?: string[], dictionary?: VoicingDictionary): string[][];
  get(
    chord: string,
    range?: string[],
    dictionary?: VoicingDictionary,
    voiceLeading?: VoiceLeadingFunction,
    lastVoicing?: string[]
  ): string[];
  sequence(
    chords: string[],
    range?: string[],
    dictionary?: VoicingDictionary,
    voiceLeading?: VoiceLeadingFunction,
    lastVoicing?: string[]
  ): string[][];
  analyze?(
    voicing: string[]
  ): {
    topNote: string;
    bottomNote: string;
    midiAverage: number;
  };
  analyzeTransition?(
    from: string[],
    to: string[]
  ): {
    topNoteDiff: number;
    bottomNoteDiff: number;
    movement: number;
  };
  enharmonicEquivalent?(note: string, pitchClass: string): string;
}

// Voicing
// A collection of functions to generate chord voicings
export const Voicing: VoicingInterface = {
  defaultRange: ['C3', 'C5'],
  defaultDictionary: VoicingDictionary.all,
  defaultVoiceLeading: VoiceLeading.topNoteDiff,
  // returns the best voicing for a chord after the optional lastVoicing, using voiceLeading. Internally calls Voicing.search to generate the available voicings.
  get: (
    chordSymbol,
    range = Voicing.defaultRange,
    dictionary = Voicing.defaultDictionary,
    voiceLeading = Voicing.defaultVoiceLeading,
    lastVoicing?
  ) => {
    const voicings = Voicing.search(chordSymbol, range, dictionary);
    const { aliases } = Chord.get(chordSymbol);
    const symbol = Object.keys(dictionary).find((_symbol) => aliases.includes(_symbol));
    if (!symbol) {
      // console.log(`no voicings found for chord "${chordSymbol}"`);
      return [];
    }
    let notes;
    if (!lastVoicing?.length) {
      // notes = voicings[Math.ceil(voicings.length / 2)]; // pick middle voicing..
      notes = voicings[0]; // pick lowest voicing..
    } else {
      // calculates the distance between the last note and the given voicings top note
      // sort voicings with differ
      notes = voiceLeading(voicings, lastVoicing);
    }
    return notes;
  },
  // returns all possible voicings of the given chord, as defined in the dictionary, inside the given range
  search: (chord, range = ['D3', 'A4'], dictionary = VoicingDictionary.triads): string[][] => {
    const [tonic, symbol] = Chord.tokenize(chord);
    let match;
    if (!dictionary[symbol]) {
      const { aliases } = Chord.get(chord);
      if (!!aliases.length) {
        match = Object.keys(dictionary).find((_symbol) => aliases.includes(_symbol));
      }
    }
    // find equivalent symbol that is used as a key in dictionary:
    if (!match || !dictionary[match]) {
      return [];
    }
    // resolve array of interval arrays for the wanted symbol
    const voicings = dictionary[symbol].map((intervals) => intervals.split(' '));
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
            Note.midi(Note.transpose(note, relativeIntervals[relativeIntervals.length - 1])) ||
            0 <= (Note.midi(range[1]) || 0)
        )
        // replace Range.chromatic notes with the correct enharmonic equivalents
        .map((note) => enharmonicEquivalent(note, bottomPitchClass));
      // render one voicing for each start note
      const notes = starts.map((start) => relativeIntervals.map((interval) => Note.transpose(start, interval)));
      return voiced.concat(notes);
    }, []);
  },
  // voices all given chords, using the specified voiceLeading function between each
  sequence: (chords, range?, dictionary?, voiceLeading?, lastVoicing?) => {
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
  },
};

// returns enharmonic equivalents of note for pitchClass.
export function enharmonicEquivalent(note: string, pitchClass: string): string {
  const { alt, letter } = Note.get(pitchClass);
  if (!letter || alt === undefined) {
    return '';
  }
  const chroma = Note.chroma(letter) || 0;
  let { oct } = Note.get(note);
  oct = oct ?? 0;
  const letterChroma = chroma + alt;
  if (letterChroma > 11) {
    oct--;
  } else if (letterChroma < 0) {
    oct++;
  }
  return pitchClass + oct;
}
