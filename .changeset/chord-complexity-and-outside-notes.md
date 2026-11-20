---
"@tonaljs/chord-type": minor
"@tonaljs/chord": minor
"@tonaljs/scale": minor
---

`ChordType.complexity(intervals)`, and a `complexity` property on every chord type and chord: 0 for triads, 1 for sevenths and sixths, and each extension adds 1, or 3 when it's altered (`maj9` is 2, `7b9#11` is 7). Sorting by it lists the common chord types first.

`Scale.outside(scale, chord)` returns the notes of a chord that aren't in a scale, spelled as in the chord: `Scale.outside("C major", "Bb7")` is `["Bb", "Ab"]`, and `[]` when the chord fits. The scale and the chord can also be note lists.
