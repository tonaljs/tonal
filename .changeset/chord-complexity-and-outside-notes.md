---
"@tonaljs/chord-type": minor
"@tonaljs/chord": minor
"@tonaljs/scale": minor
---

`ChordType.complexity(intervals)`, and a `complexity` property on every chord type and chord: the number of notes added to a triad, plus two for each chromatic note (a note, as spelled, outside the major scale that holds most of the chord). `m` is 0, `m7b5` 1, `maj9` 2, `dim7` 3, `7b9#11` 7. Sorting by it lists the common chord types first.

`Scale.outside(scale, chord)` returns the notes of a chord that aren't in a scale, spelled as in the chord: `Scale.outside("C major", "Bb7")` is `["Bb", "Ab"]`, and `[]` when the chord fits. The scale and the chord can also be note lists.
