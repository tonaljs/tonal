---
"@tonaljs/chord": minor
"tonal": minor
---

Chord degrees by name: `Chord.formula`, `Chord.degreeOf`, `Chord.noteOf` and `Chord.degreesByImportance`.

Degrees are named as in chord formulas, counted from the major scale of the root (`1 b3 5 b7` for a minor seventh). `Chord.formula("Cm7")` is `["1", "b3", "5", "b7"]`. `Chord.degreeOf("C7b9", "Db")` is `"b9"`; a note that isn't in the chord gets its most probable degree (`Chord.degreeOf("C7", "F")` is `"11"`, `Chord.degreeOf("C", "A")` is `"6"`). `Chord.noteOf("C7b9", "b9")` is `"Db"`, spelled from the root, and gives back the note of any degree from `degreeOf`. `Chord.degreesByImportance("C13")` is `["3", "b7", "9", "1", "5", "13"]`: the degrees sorted by how much they define the chord.

**Deprecated:** `Chord.degrees`. Use `Chord.steps`: `Chord.degrees(chord)(n)` is `Chord.steps(chord)(n - 1)` for positive numbers. Its numbers count the chord notes (`Chord.degrees("C")(3)` is `"G"`), while the degrees of a chord are named (the `3` of C is `"E"`). In the next major version, `Chord.degrees` will return the chord formula.
