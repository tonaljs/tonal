---
"@tonaljs/chord-type": minor
"@tonaljs/chord": minor
"tonal": minor
---

Chord types and chords have a `family`: `major`, `minor`, `dominant`, `half-diminished`, `diminished`, `augmented`, `suspended` or `power`, computed from the third, fifth and seventh. It's coarser than `quality`, which doesn't change: `ChordType.get("m7b5").family` is `"half-diminished"` (its quality is `"Diminished"`), `ChordType.get("7b9").family` is `"dominant"` and `ChordType.get("7sus4").family` is `"suspended"` (its quality is `"Unknown"`). Composed chords get one too: `Chord.get("C7(b9,#9)").family` is `"dominant"`.

`ChordType.family(intervals)` classifies any list of intervals.
