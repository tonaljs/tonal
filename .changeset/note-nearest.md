---
"@tonaljs/note": minor
---

`Note.nearest(note, reference, { direction, range })` places a note near another: the octave of a note or pitch class nearest a reference note, keeping its spelling (`Note.nearest("Eb", "C3")` is `"Eb3"`, `Note.nearest("A", "C3")` is `"A2"`). `direction: "up"` or `"down"` gives the nearest strictly above or below, and `range` keeps the result in a register, turning around at its edges. For lines built one note at a time, like a walking bass.
