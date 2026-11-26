---
"@tonaljs/note": minor
"@tonaljs/chord": patch
"tonal": minor
---

`Note.fold` takes pitch classes: a note without octave goes to the lowest octave at or above the low end of the range (in a range under an octave, the octave nearest the range), in either mode. It places notes in a register: `Note.fold(["D", "G", "C"], ["E2", "D3"])` is `["D3", "G2", "C3"]`, and a bass line is `Note.fold(chords.map((chord) => Chord.bass(chord)), ["E1", "D2"])`. It used to return `[]` for a pitch class.
