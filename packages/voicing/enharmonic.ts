import Note from '@tonaljs/note';

// helper
// returns enharmonic equivalents of note for pitchClass.
function enharmonic(note: string, pitchClass: string): string {
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

export default {
  enharmonic,
};
