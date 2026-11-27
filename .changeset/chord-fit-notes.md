---
"@tonaljs/chord": minor
"tonal": minor
---

`Chord.fitNote(note, from, to, { scale, bass })` and `Chord.fitDegree(degree, to, { scale })`: play a pattern written over one chord over another, each note keeping its role (the 3rd goes to the new 3rd, 11 to #11 on a dominant, 13 to b13 on a half-diminished chord) by rules built on `Chord.tensions`, near its place.
