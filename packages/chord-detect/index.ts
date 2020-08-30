import { all } from "@tonaljs/chord-type";
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

export function detect(source: string[]): string[] {
  const notes = source.map((n) => note(n).pc).filter((x) => x);
  if (note.length === 0) {
    return [];
  }

  const found: FoundChord[] = findExactMatches(notes, 1);

  return found
    .filter((chord) => chord.weight)
    .sort((a, b) => b.weight - a.weight)
    .map((chord) => chord.name);
}

function findExactMatches(notes: string[], weight: number): FoundChord[] {
  const tonic = notes[0];
  const tonicChroma = note(tonic).chroma;
  const noteName = namedSet(notes);
  // we need to test all chormas to get the correct baseNote
  const allModes = modes(notes, false);

  const found: FoundChord[] = [];
  allModes.forEach((mode, index) => {
    // some chords could have the same chroma but different interval spelling
    const chordTypes = all().filter((chordType) => chordType.chroma === mode);

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
