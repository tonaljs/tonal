import { Note } from "tonal";

/**
 * Give an octave to the notes without one, each above the previous note, so
 * the first note is the lowest. Notes with an octave keep it.
 */
export function voice(names: string[], startOctave = 3): string[] {
  let previous = -Infinity;
  return names.map((name) => {
    const note = Note.get(name);
    if (note.oct !== undefined) {
      previous = note.height;
      return note.name;
    }
    let oct = startOctave;
    while (oct < 9 && Note.get(note.pc + oct).height <= previous) oct++;
    previous = Note.get(note.pc + oct).height;
    return note.pc + oct;
  });
}
