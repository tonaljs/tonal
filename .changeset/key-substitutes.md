---
"@tonaljs/key": minor
"tonal": minor
---

`Key.borrowedChords(key)`: the chords a key borrows from its parallel scales (modal interchange), each with its numeral, the scale it comes from and the numerals it replaces. `Key.substitutes(key, chord, { next, kinds })`: `Chord.substitutes` in a key, plus the key's chords with the same function and the borrowed chords that replace it.

The key's substitute dominants are now `Chord.tritoneSubstitute` of its secondary dominants, spelled with fewer accidentals as a lead sheet writes them: `B7`, not `Cb7`, for `F7` (in `substituteDominants`, their supertonics and `Key.majorKeyChords` / `minorKeyChords`). Only the roots that were Cb or Fb change.
