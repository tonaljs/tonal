---
"@tonaljs/scale": minor
"tonal": minor
---

`Scale.rank(notes, { chords, types, limit })`: the scales that fit a set of notes and chords, best first ("which scale is this?"). Every tonic is tried with the common scale types; the order is fit, then the more common type, then the evidence of the tonic (first and last chord and note), and each result has its `matched`, `missing` and `outside` notes.
