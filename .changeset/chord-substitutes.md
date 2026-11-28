---
"@tonaljs/chord": minor
"tonal": minor
---

Chord substitutions: `Chord.substitutes(chord, { next, kinds })` lists the chords that can take a chord's place as `{ chords, kind }`: the tritone substitute, the backdoor dominant, the chords made of its notes on another root (Em for Cmaj7, Bm7b5 and Dm6 for G9), the related ii of a dominant, and with `next` the approach chords (secondary and substitute dominants, passing diminished). `Chord.tritoneSubstitute(chord)` gives the tritone substitute alone. `Chord.containing(note)` lists the chords that can harmonise a melody note, with the note's degree in each.
