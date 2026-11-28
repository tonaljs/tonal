---
"@tonaljs/chord": minor
"tonal": minor
---

Chord substitutions: `Chord.tritoneSubstitute`, `Chord.relatedTwo`, `Chord.secondaryDominant`, `Chord.backdoor`, `Chord.passingDiminished`, `Chord.contained` (the chords made of a chord's notes on another root: Em for Cmaj7, Bm7b5 and Dm6 for G9) and `Chord.substitutes(chord, { next })`, which lists them all as `{ chords, kind }`. `Chord.containing(note)` lists the chords that can harmonise a melody note, with the note's degree in each.
