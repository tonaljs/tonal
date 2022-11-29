import { all, ChordType } from "@tonaljs/chord-type";
import { note } from "@tonaljs/core";
import { modes } from "@tonaljs/pcset";

interface FoundChord {
  readonly weight: number;
  readonly name: string;
}

const namedSet = (notes: string[]) => {
  const pcToName = notes.reduce<Record<number, string>>((record, n) => {
    const chroma = note(n).chroma;
    if (chroma !== undefined) {
      record[chroma] = record[chroma] || note(n).name;
    }
    return record;
  }, {});

  return (chroma: number) => pcToName[chroma];
};

type DetectOptions = {
  assumePerfectFifth: boolean
}
export function detect(source: string[], options: Partial<DetectOptions> = {}): string[] {
  const notes = source.map((n) => note(n).pc).filter((x) => x);
  if (note.length === 0) {
    return [];
  }

  const found: FoundChord[] = findMatches(notes, 1, options);

  return found
    .filter((chord) => chord.weight)
    .sort((a, b) => b.weight - a.weight)
    .map((chord) => chord.name);
}

/* tslint:disable:no-bitwise */
const BITMASK = {
  // 3m 000100000000
  // 3M 000010000000
  anyThirds: 384,
  // 5P 000000010000
  perfectFifth: 16,
  // 5d 000000100000
  // 5A 000000001000
  nonPerfectFifths: 40,
  anySeventh: 3,
}

const testChromaNumber = (bitmask: number) => (chromaNumber: number) => Boolean(chromaNumber & bitmask)
const hasAnyThird = testChromaNumber(BITMASK.anyThirds)
const hasPerfectFifth = testChromaNumber(BITMASK.perfectFifth)
const hasAnySeventh = testChromaNumber(BITMASK.anySeventh)
const hasNonPerfectFifth = testChromaNumber(BITMASK.nonPerfectFifths)

function hasAnyThirdAndPerfectFifthAndAnySeventh(chordType: ChordType) {
  const chromaNumber = parseInt(chordType.chroma, 2)
  return hasAnyThird(chromaNumber) && hasPerfectFifth(chromaNumber) && hasAnySeventh(chromaNumber)
}

function withPerfectFifth(chroma: string): string {
  const chromaNumber = parseInt(chroma, 2)
  return hasNonPerfectFifth(chromaNumber)
  ? chroma 
  : (chromaNumber | 16).toString(2)
}

/* tslint:enable:no-bitwise */

type FindMatchesOptions = {
  assumePerfectFifth: boolean
}
function findMatches(notes: string[], weight: number, options: Partial<FindMatchesOptions>): FoundChord[] {
  const tonic = notes[0];
  const tonicChroma = note(tonic).chroma;
  const noteName = namedSet(notes);
  // we need to test all chromas to get the correct baseNote
  const allModes = modes(notes, false);

  const found: FoundChord[] = [];
  allModes.forEach((mode, index) => {
    const modeWithPerfectFifth = options.assumePerfectFifth && withPerfectFifth(mode)
    // some chords could have the same chroma but different interval spelling
    const chordTypes = all().filter((chordType) => {
      if(options.assumePerfectFifth && hasAnyThirdAndPerfectFifthAndAnySeventh(chordType)) {
        return chordType.chroma === modeWithPerfectFifth
      }
      return chordType.chroma === mode
    });

    chordTypes.forEach((chordType) => {
      const chordName = chordType.aliases[0];
      const baseNote = noteName(index);
      const isInversion = index !== tonicChroma;
      if (isInversion) {
        found.push({
          weight: 0.5 * weight,
          name: `${baseNote}${chordName}/${tonic}`,
        });
      } else {
        found.push({ weight: 1 * weight, name: `${baseNote}${chordName}` });
      }
    });
  });

  return found;
}

export default { detect };
